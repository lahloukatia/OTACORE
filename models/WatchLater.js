const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WatchLater = sequelize.define('WatchLater', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id:     { type: DataTypes.INTEGER, allowNull: false },
  contenu_id:  { type: DataTypes.INTEGER, allowNull: false },
  statut_suivi:{ type: DataTypes.ENUM('PLANIFIE','EN_COURS','TERMINE'),
                 defaultValue: 'PLANIFIE' },
  date_ajout:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  reminder_date: { type: DataTypes.DATE, allowNull: true },
  reminder_sent: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'watch_later',
  timestamps: false
});

module.exports = WatchLater;