const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Genre = sequelize.define('Genre', {
  id:      { type: DataTypes.INTEGER,   autoIncrement: true, primaryKey: true },
  libelle: { type: DataTypes.STRING(50),allowNull: false,    unique: true }
}, {
  tableName:  'genres',
  timestamps: false
});

module.exports = Genre;