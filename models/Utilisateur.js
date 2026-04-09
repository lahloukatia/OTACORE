const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  id:               { type: DataTypes.INTEGER,   autoIncrement: true, primaryKey: true },
  username:         { type: DataTypes.STRING(50), allowNull: false,    unique: true },
  email:            { type: DataTypes.STRING(100),allowNull: false,    unique: true },
  mot_de_passe:     { type: DataTypes.STRING(255),allowNull: false },
  date_naissance:   { type: DataTypes.DATEONLY,   allowNull: false },
  bio:              { type: DataTypes.TEXT },
  statut:           { type: DataTypes.ENUM('MINEUR','ADULTE'),          defaultValue: 'ADULTE' },
  compte_statut:    { type: DataTypes.ENUM('ACTIF','SUSPENDU'),         defaultValue: 'ACTIF' },
  date_inscription: { type: DataTypes.DATE,        defaultValue: DataTypes.NOW }
}, {
  tableName:  'utilisateurs',
  timestamps: false
});

module.exports = Utilisateur;