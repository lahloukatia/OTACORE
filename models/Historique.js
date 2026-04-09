const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Historique = sequelize.define('Historique', {
  id:                { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:           { type: DataTypes.INTEGER, allowNull: false },
  contenu_id:        { type: DataTypes.INTEGER, allowNull: false },
  date_consultation: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName:  'historique',
  timestamps: false
});

module.exports = Historique;