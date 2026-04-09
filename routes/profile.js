const express = require('express');
const router  = express.Router();

// Profil
router.get('/', (req, res) => {
  const user = req.session?.user || { username: 'TestUser', bio: '' };
  res.render('profile', {
    user,
    page: 'profile',
    watchLater: [],
    recentlyViewed: []
  });
});

// My List
router.get('/mylist', (req, res) => {
  const user      = req.session?.user || { username: 'TestUser' };
  const filter    = req.query.filter || '';
  const watchLater = []; // sera rempli depuis BDD

  res.render('mylist', { user, page: 'mylist', watchLater, filter });
});

// Add to watchlater
router.post('/watchlater/add', (req, res) => {
  res.json({ success: true });
});

// Remove from watchlater
router.post('/watchlater/remove', (req, res) => {
  res.redirect('/profile/mylist');
});

// Update status
router.post('/watchlater/status', (req, res) => {
  res.redirect('/profile/mylist');
});
// GET edit profile
router.get('/edit', (req, res) => {
  const user = req.session?.user || { username: 'TestUser', bio: '', email: '' };
  res.render('edit-profile', { user, page: '', error: null, success: null });
});

// POST edit profile
router.post('/edit', (req, res) => {
  const { username, email, bio } = req.body;
  // sera connecté à la BDD plus tard
  // Pour l'instant on met à jour la session
  if (req.session.user) {
    req.session.user.username = username;
    req.session.user.email    = email;
    req.session.user.bio      = bio;
  }
  const user = req.session?.user || { username, email, bio };
  res.render('edit-profile', {
    user, page: '',
    error: null,
    success: 'Profile updated successfully !'
  });
});
module.exports = router;