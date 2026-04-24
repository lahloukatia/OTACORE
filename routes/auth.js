const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/authController');


router.get('/signup',  (req, res) => res.render('signup', { error: null }));
router.get('/login',   (req, res) => res.render('login',  { error: null }));

router.post('/signup', authController.signup);
router.post('/login',  authController.login);
router.post('/verify', authController.verify);
router.get('/resend',  authController.resend);

// Forgot password
router.get('/forgot-password',  authController.showForgotPassword);
router.post('/forgot-password', authController.sendResetLink);

// Reset password form
router.get('/reset-password/:token', authController.showResetForm);
router.post('/reset-password/:token', authController.resetPassword);

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;