const express = require('express');
const router  = express.Router();

// Page publique visiteur
router.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/landing');
  }
  res.render('home');
});

// Landing page connecté
router.get('/landing', (req, res) => {
  const user = req.session?.user || { username: 'TestUser' };
  res.render('landing', {
    user,
    page: 'home',
    featured: null,
    trending: [],
    topManga: []
  });
});

module.exports = router;