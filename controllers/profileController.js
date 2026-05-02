const sequelize  = require('../config/database');
const { QueryTypes } = require('sequelize');
const { Contenu }    = require('../models/index');
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/images/avatars';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `avatar_${req.session.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Images seulement !'));
  }
});

exports.uploadMiddleware = upload.single('avatar');

// ── ADD TO WATCH LATER ───────────────────────
exports.addToWatchLater = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user) return res.json({ success: false, message: 'Non connecté' });

    const { contenu_id } = req.body;

    // Vérifier si déjà présent
    const existing = await sequelize.query(
      'SELECT id FROM watch_later WHERE user_id = ? AND contenu_id = ?',
      { replacements: [user.id, contenu_id], type: QueryTypes.SELECT }
    );

    if (existing.length > 0) {
      return res.json({ success: false, message: 'Déjà dans votre liste' });
    }

    await sequelize.query(
      'INSERT INTO watch_later (user_id, contenu_id, statut_suivi) VALUES (?, ?, "PLANIFIE")',
      { replacements: [user.id, contenu_id], type: QueryTypes.INSERT }
    );

    res.json({ success: true, message: 'Ajouté à votre liste !' });

  } catch (err) {
    console.error('ERREUR ADD WATCHLATER:', err.message);
    res.json({ success: false, message: err.message });
  }
};

// ── REMOVE FROM WATCH LATER ──────────────────
exports.removeFromWatchLater = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user) return res.redirect('/auth/login');

    const { contenu_id } = req.body;

    await sequelize.query(
      'DELETE FROM watch_later WHERE user_id = ? AND contenu_id = ?',
      { replacements: [user.id, contenu_id], type: QueryTypes.DELETE }
    );

    res.redirect('/profile/mylist');

  } catch (err) {
    console.error('ERREUR REMOVE WATCHLATER:', err.message);
    res.redirect('/profile/mylist');
  }
};

// ── UPDATE STATUS ────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user) return res.redirect('/auth/login');

    const { contenu_id, statut, date_planifiee } = req.body;

    // Mettre à jour statut + date planifiée
    await sequelize.query(
      `UPDATE watch_later 
       SET statut_suivi = ?, date_planifiee = ?
       WHERE user_id = ? AND contenu_id = ?`,
      {
        replacements: [
          statut,
          date_planifiee || null,
          user.id,
          contenu_id
        ],
        type: QueryTypes.UPDATE
      }
    );

    res.redirect('/profile/mylist');

  } catch (err) {
    console.error('ERREUR UPDATE STATUS:', err.message);
    res.redirect('/profile/mylist');
  }
};

// ── GET WATCH LATER ──────────────────────────
exports.getWatchLater = async (req, res) => {
  try {
    const user   = req.session?.user;
    if (!user) return res.redirect('/auth/login');

    const filter = req.query.filter || '';

    let query = `
      SELECT wl.*, c.titre, c.image_url, c.type
      FROM watch_later wl
      JOIN contenus c ON c.id = wl.contenu_id
      WHERE wl.user_id = ?
    `;
    const replacements = [user.id];

    if (filter) {
      query += ' AND wl.statut_suivi = ?';
      replacements.push(filter);
    }

    query += ' ORDER BY wl.date_ajout DESC';

    const watchLater = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Renommer statut_suivi → statutSuivi
    const liste = watchLater.map(w => ({
      ...w,
      statutSuivi: w.statut_suivi,
      contenu_id:  w.contenu_id
    }));

    res.render('mylist', { user, page: 'mylist', watchLater: liste, filter });

  } catch (err) {
    console.error('ERREUR GET WATCHLATER:', err.message);
    res.render('mylist', { user: req.session?.user, page: 'mylist', watchLater: [], filter: '' });
  }
};

// ── GET PROFILE ──────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user) return res.redirect('/auth/login');

    // Watch Later (5 derniers)
    const watchLater = await sequelize.query(
      `SELECT wl.*, c.titre, c.image_url, c.type
       FROM watch_later wl
       JOIN contenus c ON c.id = wl.contenu_id
       WHERE wl.user_id = ?
       ORDER BY wl.date_ajout DESC
       LIMIT 5`,
      { replacements: [user.id], type: QueryTypes.SELECT }
    );

    // Recently Viewed — full history, deduplicated, most recent first
    const recentlyViewed = await sequelize.query(
      `SELECT c.id AS contenu_id, c.titre, c.image_url, c.type,
              MAX(h.date_consultation) AS date_consultation
       FROM historique h
       JOIN contenus c ON c.id = h.contenu_id
       WHERE h.user_id = ?
       GROUP BY c.id, c.titre, c.image_url, c.type
       ORDER BY date_consultation DESC`,
      { replacements: [user.id], type: QueryTypes.SELECT }
    );

    res.render('profile', {
      user,
      page: 'profile',
      watchLater,
      recentlyViewed
    });

  } catch (err) {
    console.error('ERREUR PROFILE:', err.message);
    res.render('profile', {
      user: req.session?.user,
      page: 'profile',
      watchLater: [],
      recentlyViewed: []
    });
  }
};
// ── EDIT PROFILE ─────────────────────────────
exports.editProfile = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user) return res.redirect('/auth/login');

    res.render('edit-profile', {
      user, page: '', error: null, success: null
    });
  } catch (err) {
    res.redirect('/profile');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = req.session?.user;
    if (!user) return res.redirect('/auth/login');

    const { username, bio } = req.body;
    const bcrypt = require('bcrypt');

    // Vérif username disponible
    const existing = await sequelize.query(
      'SELECT id FROM utilisateurs WHERE username = ? AND id != ?',
      { replacements: [username, user.id], type: QueryTypes.SELECT }
    );

    if (existing.length > 0) {
      return res.render('edit-profile', {
        user, page: '',
        error: 'Ce nom d\'utilisateur est déjà utilisé',
        success: null
      });
    }

    // Changer mot de passe si demandé
    if (req.body.currentPassword && req.body.newPassword) {
      const userDb = await sequelize.query(
        'SELECT mot_de_passe FROM utilisateurs WHERE id = ?',
        { replacements: [user.id], type: QueryTypes.SELECT }
      );
      const valid = await bcrypt.compare(req.body.currentPassword, userDb[0].mot_de_passe);
      if (!valid) {
        return res.render('edit-profile', {
          user, page: '',
          error: 'Mot de passe actuel incorrect',
          success: null
        });
      }
      const hash = await bcrypt.hash(req.body.newPassword, 10);
      await sequelize.query(
        'UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?',
        { replacements: [hash, user.id], type: QueryTypes.UPDATE }
      );
    }

    // ── Avatar ──
    let avatarPath = user.avatar || null;
    if (req.file) {
      avatarPath = '/images/avatars/' + req.file.filename;
    }

    // ── Update BDD ──
    await sequelize.query(
      'UPDATE utilisateurs SET username = ?, bio = ?, avatar = ? WHERE id = ?',
      { replacements: [username, bio || '', avatarPath, user.id], type: QueryTypes.UPDATE }
    );

    // ── Update session ──
    req.session.user.username = username;
    req.session.user.bio      = bio || '';
    req.session.user.avatar   = avatarPath;

    // ✅ Retour profil
    res.redirect('/profile');

  } catch (err) {
    console.error('ERREUR UPDATE PROFILE:', err.message);
    res.render('edit-profile', {
      user: req.session?.user, page: '',
      error: err.message, success: null
    });
  }
};