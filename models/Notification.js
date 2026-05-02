const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id:         { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
  user_id:    { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  type:       { type: DataTypes.STRING(50), allowNull: false },
  message:    { type: DataTypes.TEXT, allowNull: false },
  link:       { type: DataTypes.STRING(255), defaultValue: null },
  is_read:    { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }   // ✅ fixed
}, {
  tableName: 'notifications',
  timestamps: false,
  underscored: true
});

module.exports = Notification;