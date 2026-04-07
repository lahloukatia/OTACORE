const express = require('express');
const router  = express.Router();

router.get('/:id', (req, res) => {
  res.send('Details page - coming soon');
});

module.exports = router;