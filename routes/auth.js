const express = require('express');
const router  = express.Router();

// GET - Afficher la page signup
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// GET - Afficher la page login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});
// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;