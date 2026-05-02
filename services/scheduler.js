const cron = require('node-cron');
const { Op } = require('sequelize');
const { WatchLater, Contenu, Utilisateur, Notification } = require('../models');
const transporter = require('../config/mailer');

async function sendReminderEmail(user, contenu, reminderDate) {
  try {
    await transporter.sendMail({
      from: `"OTACORE Reminder" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `⏰ Rappel : ${contenu.titre}`,
      html: `
        <div style="background:#0d0015; color:#fff; padding:20px; font-family:sans-serif;">
          <h2 style="color:#c084fc;">Il est temps de regarder !</h2>
          <p style="font-size:1.2rem;"><strong>${contenu.titre}</strong></p>
          <p>Vous avez programmé un rappel pour le ${new Date(reminderDate).toLocaleString('fr-FR')}.</p>
          <p><a href="${process.env.SITE_URL || 'http://localhost:3000'}/contenu/${contenu.id}"
                style="color:#c084fc;">Voir la fiche</a></p>
        </div>
      `
    });
    console.log(`📧 Reminder sent to ${user.email}`);
  } catch (err) {
    console.error('Reminder email error:', err.message);
  }
}

async function checkReminders() {
  try {
    const now = new Date();
    const reminders = await WatchLater.findAll({
      where: {
        reminder_date: { [Op.lte]: now },
        reminder_sent: false
      },
      include: [
        { model: Utilisateur },
        { model: Contenu }
      ]
    });

    for (const item of reminders) {
      // Send email
      await sendReminderEmail(item.Utilisateur, item.Contenu, item.reminder_date);

      // Create in‑app notification
      await Notification.create({
        user_id: item.user_id,
        type: 'reminder',
        message: `Rappel : "${item.Contenu.titre}" est prévu pour maintenant !`,
        link: `/contenu/${item.contenu_id}`
      });

      // Mark as sent
      await WatchLater.update(
        { reminder_sent: true },
        { where: { id: item.id } }
      );
    }
  } catch (err) {
    console.error('Reminder scheduler error:', err);
  }
}

// Run every minute
cron.schedule('* * * * *', () => {
  console.log('⏳ Checking reminders...');
  checkReminders();
});

module.exports = { checkReminders };