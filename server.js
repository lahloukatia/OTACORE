const express  = require('express');
const path     = require('path');
const session  = require('express-session');
require('dotenv').config();

const app = express();

// ── Moteur de templates ──────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Fichiers statiques ───────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body parser ──────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Sessions ─────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// ── Routes ───────────────────────────────────
app.use('/',        require('./routes/index'));
app.use('/auth',    require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/contenu', require('./routes/contenu'));

// ── Lancement ────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ OTACORE running → http://localhost:${PORT}`);
});