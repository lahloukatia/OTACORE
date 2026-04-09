const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

// Test connexion
sequelize.authenticate()
  .then(() => console.log('✅ MySQL connecté'))
  .catch(err => console.error('❌ Erreur MySQL :', err));

module.exports = sequelize;