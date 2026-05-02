const express  = require('express');
const path     = require('path');
const session  = require('express-session');
require('dotenv').config();
require('./services/scheduler');   // starts the cron job

// Initialize database from schema
const initDatabase = require('./database/init');

// Import BDD
const { sequelize } = require('./models/index');

const app = express();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use('/',        require('./routes/index'));
app.use('/auth',    require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/contenu', require('./routes/contenu'));
app.use('/notifications', require('./routes/notifications'));

// Start server after database initialization
async function startServer() {
  try {
    // Initialize database from SQL schema
    await initDatabase();
    
    // Test Sequelize connection
    await sequelize.authenticate();
    console.log('🔗 Sequelize connected to database');
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ OTACORE running → http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();