const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');               // ← add this
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST,
    port:    process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,                      // ← add this
    logging: false
  }
);

// Test connexion
sequelize.authenticate()
  .then(() => console.log('✅ MySQL connecté'))
  .catch(err => console.error('❌ Erreur MySQL :', err));

module.exports = sequelize;