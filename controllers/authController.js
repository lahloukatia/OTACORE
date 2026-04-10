const bcrypt      = require('bcrypt');
const nodemailer  = require('nodemailer');
const transporter = require('../config/mailer');
const { Utilisateur } = require('../models/index');
const sequelize   = require('../config/database');
const { QueryTypes } = require('sequelize');

// ── Générer code 6 chiffres ──────────────────
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Envoyer email ────────────────────────────
async function sendVerificationEmail(email, code, username) {
  await transporter.sendMail({
    from:    `"OTACORE" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject: `${code} is your OTACORE verification code`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="margin:0;padding:0;background:#080010;font-family:'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" style="padding:40px 20px;">
              <table width="500" cellpadding="0" cellspacing="0" style="background:#0d0015;border-radius:16px;border:1px solid rgba(150,0,255,0.3);overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#1a0035,#0d0015);padding:30px;text-align:center;border-bottom:1px solid rgba(150,0,255,0.2);">
                    <h1 style="margin:0;color:#c084fc;font-size:2rem;letter-spacing:4px;">OTACORE</h1>
                    <p style="margin:6px 0 0;color:rgba(255,255,255,0.4);font-size:0.85rem;">Anime & Manga Streaming</p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 40px 20px;">
                    <p style="color:rgba(255,255,255,0.8);font-size:1rem;margin:0 0 8px;">
                      Hi <strong style="color:white;">${username}</strong> 👋
                    </p>
                    <p style="color:rgba(255,255,255,0.6);font-size:0.92rem;line-height:1.6;margin:0 0 30px;">
                      Welcome to OTACORE ! Here is your verification code to activate your account :
                    </p>

                    <!-- Code -->
                    <div style="text-align:center;margin:0 0 30px;">
                      <div style="display:inline-block;background:rgba(124,58,237,0.2);border:2px solid rgba(124,58,237,0.5);border-radius:12px;padding:20px 40px;">
                        <span style="font-size:2.5rem;font-weight:800;color:white;letter-spacing:12px;">${code}</span>
                      </div>
                    </div>

                    <p style="color:rgba(255,255,255,0.4);font-size:0.82rem;text-align:center;margin:0 0 10px;">
                      ⏱ This code expires in <strong style="color:rgba(255,255,255,0.6);">10 minutes</strong>
                    </p>
                    <p style="color:rgba(255,255,255,0.3);font-size:0.78rem;text-align:center;margin:0;">
                      If you didn't create an account on OTACORE, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px 30px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <p style="color:rgba(255,255,255,0.2);font-size:0.75rem;margin:0;">
                      © 2024 OTACORE Media — Streaming the Multiverse
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  });
}

// ── INSCRIPTION ──────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, dateNaissance } = req.body;

    // Vérif mots de passe
    if (password !== confirmPassword) {
      return res.render('signup', { error: 'Les mots de passe ne correspondent pas' });
    }

    // Vérif longueur mdp
    if (password.length < 8) {
      return res.render('signup', { error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Vérif date
    if (!dateNaissance) {
      return res.render('signup', { error: 'Date de naissance requise' });
    }

    // Vérif email existant
    const emailExist = await Utilisateur.findOne({ where: { email } });
    if (emailExist) {
      return res.render('signup', { error: 'Cet email est déjà utilisé' });
    }

    // Vérif username existant
    const usernameExist = await Utilisateur.findOne({ where: { username } });
    if (usernameExist) {
      return res.render('signup', { error: 'Ce nom d\'utilisateur est déjà utilisé' });
    }

    // Calcul statut mineur/adulte
    const today     = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    const statut = age >= 18 ? 'ADULTE' : 'MINEUR';

    // Hash mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Stocker données temporairement en session
    req.session.pendingUser = {
      username,
      email,
      mot_de_passe:   hash,
      date_naissance: dateNaissance,
      statut,
      compte_statut:  'ACTIF'
    };

    // Générer et sauvegarder le code
    const code      = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Supprimer anciens codes pour cet email
    await sequelize.query(
      'DELETE FROM verification_codes WHERE email = ?',
      { replacements: [email], type: QueryTypes.DELETE }
    );

    // Insérer nouveau code
    await sequelize.query(
      'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
      { replacements: [email, code, expiresAt], type: QueryTypes.INSERT }
    );

    // Envoyer email
    await sendVerificationEmail(email, code, username);

    // Rediriger vers page vérification
    
res.render('verify', { email, error: null });

  } catch (err) {
    console.error('ERREUR SIGNUP:', err.message);
    res.render('signup', { error: err.message });
  }
};

// ── VÉRIFICATION CODE ────────────────────────
exports.verify = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Chercher le code
    const rows = await sequelize.query(
      'SELECT * FROM verification_codes WHERE email = ? AND code = ? AND used = FALSE AND expires_at > NOW()',
      { replacements: [email, code], type: QueryTypes.SELECT }
    );

    if (rows.length === 0) {
      return res.render('verify', {
        email,
        error: 'Code incorrect ou expiré. Veuillez réessayer.'
      });
    }

    // Marquer code comme utilisé
    await sequelize.query(
      'UPDATE verification_codes SET used = TRUE WHERE email = ? AND code = ?',
      { replacements: [email, code], type: QueryTypes.UPDATE }
    );

    // Créer le compte
    const pendingUser = req.session.pendingUser;
    if (!pendingUser) {
      return res.redirect('/auth/signup');
    }

    const user = await Utilisateur.create(pendingUser);

    // Créer session
    req.session.user = {
      id:       user.id,
      username: user.username,
      email:    user.email,
      statut:   user.statut,
      bio:      user.bio || ''
    };

    // Supprimer données temporaires
    delete req.session.pendingUser;

    res.redirect('/landing');

  } catch (err) {
    console.error('ERREUR VERIFY:', err.message);
    res.render('verify', { email: req.body.email, error: err.message });
  }
};

// ── RENVOYER CODE ────────────────────────────
exports.resend = async (req, res) => {
  try {
    const { email } = req.query;
    const pendingUser = req.session.pendingUser;

    if (!pendingUser || pendingUser.email !== email) {
      return res.redirect('/auth/signup');
    }

    const code      = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await sequelize.query(
      'DELETE FROM verification_codes WHERE email = ?',
      { replacements: [email], type: QueryTypes.DELETE }
    );

    await sequelize.query(
      'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
      { replacements: [email, code, expiresAt], type: QueryTypes.INSERT }
    );

    await sendVerificationEmail(email, code, pendingUser.username);

    res.render('verify', { email, error: null });

  } catch (err) {
    console.error('ERREUR RESEND:', err.message);
    res.redirect('/auth/signup');
  }
};

// ── CONNEXION ────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const { Op } = require('sequelize');
    const user = await Utilisateur.findOne({
      where: {
        [Op.or]: [
          { email:    identifier },
          { username: identifier }
        ]
      }
    });

    if (!user) {
      return res.render('login', { error: 'Email ou mot de passe incorrect' });
    }

    if (user.compte_statut === 'SUSPENDU') {
      return res.render('login', { error: 'Votre compte a été suspendu. Contactez le support.' });
    }

    const valid = await bcrypt.compare(password, user.mot_de_passe);
    if (!valid) {
      return res.render('login', { error: 'Email ou mot de passe incorrect' });
    }

    req.session.user = {
      id:       user.id,
      username: user.username,
      email:    user.email,
      statut:   user.statut,
      bio:      user.bio || ''
    };

    res.redirect('/landing');

  } catch (err) {
    console.error('ERREUR LOGIN:', err.message);
    res.render('login', { error: 'Une erreur est survenue. Veuillez réessayer.' });
  }
};