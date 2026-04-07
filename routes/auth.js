const express = require('express');
const router  = express.Router();

router.get('/signup', (req, res) => {
  res.send('Signup page - coming soon');
});

router.get('/login', (req, res) => {
  res.send('Login page - coming soon');
});

module.exports = router;