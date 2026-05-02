const express = require('express');
const router = express.Router();
const { Notification, Utilisateur } = require('../models');
const transporter = require('../config/mailer');

// ── Middleware to ensure user is logged in ─────
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// ── Email helper ─────────────────────────────
async function sendNotificationEmail(user, notification) {
  if (!user || !user.email) return;
  // Only send email for important notification types (optional)
  const importantTypes = ['new_episode', 'new_chapter', 'comment_reply', 'watchlist_add'];
  if (!importantTypes.includes(notification.type)) return;

  try {
    await transporter.sendMail({
      from: `"OTACORE Notifications" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `🔔 ${notification.type.replace(/_/g, ' ')} - OTACORE`,
      html: `
        <div style="background:#0d0015; color:#fff; padding:20px; font-family:sans-serif;">
          <h2 style="color:#c084fc;">${notification.message}</h2>
          <p style="color:rgba(255,255,255,0.6);">Type : ${notification.type}</p>
          ${notification.link ? `<p><a href="${notification.link}" style="color:#c084fc;">Cliquez ici pour voir</a></p>` : ''}
          <p style="color:rgba(255,255,255,0.4); font-size:0.9rem;">À bientôt sur OTACORE !</p>
        </div>
      `
    });
    console.log(`📧 Email sent to ${user.email} for notification #${notification.id}`);
  } catch (err) {
    console.error('Failed to send notification email:', err.message);
  }
}

// ── Get unread count (for badge) ──────────────
router.get('/count', requireAuth, async (req, res) => {
  try {
    const count = await Notification.count({
      where: { user_id: req.session.user.id, is_read: false }
    });
    res.json({ count });
  } catch (err) {
    console.error('Error fetching notification count:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Get all notifications (latest first) ──────
router.get('/', requireAuth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.session.user.id },
      order: [['created_at', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Mark a single notification as read ────────
router.post('/:id/read', requireAuth, async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { id: req.params.id, user_id: req.session.user.id } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Mark all notifications as read ────────────
router.post('/read-all', requireAuth, async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.session.user.id, is_read: false } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Simulate a notification (for testing) ─────
router.post('/simulate', requireAuth, async (req, res) => {
  try {
    const { type, message, link } = req.body;
    console.log('--- SIMULATE REQUEST RECEIVED ---');
    console.log('Body:', req.body);
    console.log('User ID:', req.session.user.id);

    const notification = await Notification.create({
      user_id: req.session.user.id,
      type: type || 'info',
      message: message || 'This is a simulated notification.',
      link: link || null
    });

    console.log('Notification created successfully:', notification.toJSON());

    // Send email notification to the user
    const user = await Utilisateur.findByPk(req.session.user.id);
    if (user) {
      await sendNotificationEmail(user, notification);
    }

    res.json({ success: true, notification });
  } catch (err) {
    console.error('!!! ERROR in /notifications/simulate:');
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;