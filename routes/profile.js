const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.send('Profile page - coming soon');
});

module.exports = router;