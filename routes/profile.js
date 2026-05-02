const express = require('express');
const router = express.Router();
const profilecontroller = require('../controllers/profileController');
const { isConnected } = require('../middleware/authMiddleware');
const { WatchLater, Contenu, Notification, Historique } = require('../models');

// Middleware to require login
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// Profile page
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = req.session.user;

    // Recently viewed (last 5)
    const history = await Historique.findAll({
      where: { user_id: user.id },
      order: [['date_consultation', 'DESC']],
      limit: 5,
      include: [Contenu]
    });
    const recentlyViewed = history.map(h => ({
      id: h.Contenu.id,
      titre: h.Contenu.titre,
      image_url: h.Contenu.image_url,
      type: h.Contenu.type
    }));

    // Watchlist (later you can fetch the real list; for now an empty array to not break the view)
    const watchLater = [];

    // Count watchlist items
    const watchlistCount = await WatchLater.count({ where: { user_id: user.id } });

    res.render('profile', {
      user: { ...user, watchlistCount },
      page: 'profile',
      watchLater,            // <-- now defined
      recentlyViewed
    });
  } catch (err) {
    console.error(err);
    res.render('profile', {
      user: req.session.user,
      page: 'profile',
      watchLater: [],
      recentlyViewed: []
    });
  }
});

// My List page
router.get('/mylist', requireAuth, async (req, res) => {
  try {
    const user = req.session.user;
    const filter = req.query.filter || '';

    let where = { user_id: user.id };
    if (filter === 'PLANIFIE' || filter === 'EN_COURS' || filter === 'TERMINE') {
      where.statut_suivi = filter;
    }

    const items = await WatchLater.findAll({
      where,
      order: [['date_ajout', 'DESC']],
      include: [Contenu]
    });

    // Map to flat objects for the view
    const watchLater = items.map(item => ({
      id: item.id,
      contenu_id: item.contenu_id,
      titre: item.Contenu.titre,
      image_url: item.Contenu.image_url,
      type: item.Contenu.type,
      statutSuivi: item.statut_suivi,          // camelCase for EJS
      reminder_date: item.reminder_date,
      reminder_sent: item.reminder_sent
    }));

    res.render('mylist', { user, page: 'mylist', watchLater, filter });
  } catch (err) {
    console.error(err);
    res.render('mylist', { user: req.session.user, page: 'mylist', watchLater: [], filter: '' });
  }
});

// Add to watchlater (already implemented, but rewritten cleanly)
router.post('/watchlater/add', requireAuth, async (req, res) => {
  try {
    const { contenu_id } = req.body;
    const userId = req.session.user.id;

    const existing = await WatchLater.findOne({ where: { user_id: userId, contenu_id } });
    if (existing) {
      return res.json({ success: false, message: 'Déjà dans votre liste' });
    }

    await WatchLater.create({
      user_id: userId,
      contenu_id,
      statut_suivi: 'PLANIFIE'
    });

    // Create notification
    const contenu = await Contenu.findByPk(contenu_id);
    if (contenu) {
      await Notification.create({
        user_id: userId,
        type: 'watchlist_add',
        message: `Vous avez ajouté "${contenu.titre}" à votre liste.`,
        link: `/contenu/${contenu.id}`
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Remove from watchlater
router.post('/watchlater/remove', requireAuth, async (req, res) => {
  try {
    const { contenu_id } = req.body;
    await WatchLater.destroy({
      where: { user_id: req.session.user.id, contenu_id }
    });
    res.redirect('/profile/mylist');
  } catch (err) {
    console.error(err);
    res.redirect('/profile/mylist');
  }
});

// Update status
router.post('/watchlater/status', requireAuth, async (req, res) => {
  try {
    const { contenu_id, statut } = req.body;
    await WatchLater.update(
      { statut_suivi: statut },
      { where: { user_id: req.session.user.id, contenu_id } }
    );
    res.redirect('/profile/mylist');
  } catch (err) {
    console.error(err);
    res.redirect('/profile/mylist');
  }
});

// Set reminder date
router.post('/watchlater/set-reminder', requireAuth, async (req, res) => {
  try {
    const { contenu_id, reminder_date } = req.body;
    await WatchLater.update(
      { reminder_date, reminder_sent: false },
      { where: { user_id: req.session.user.id, contenu_id } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur set-reminder:', err);
    res.status(500).json({ success: false });
  }
});

// Edit profile
router.get('/edit', requireAuth, (req, res) => {
  res.render('edit-profile', { user: req.session.user, page: '', error: null, success: null });
});

router.post('/edit', requireAuth, async (req, res) => {
  const { username, email, bio } = req.body;
  if (req.session.user) {
    req.session.user.username = username;
    req.session.user.email = email;
    req.session.user.bio = bio;
    // Optionally update in DB
  }
  res.render('edit-profile', {
    user: req.session.user,
    page: '',
    error: null,
    success: 'Profil mis à jour avec succès !'
  });
});

// Set reminder date
router.post('/watchlater/set-reminder', requireAuth, async (req, res) => {
  try {
    const { contenu_id, reminder_date } = req.body;
    if (!contenu_id || !reminder_date) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    await WatchLater.update(
      { reminder_date, reminder_sent: false },
      { where: { user_id: req.session.user.id, contenu_id } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Erreur set-reminder:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});
module.exports = router;