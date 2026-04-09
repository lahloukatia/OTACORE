const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Contenu = sequelize.define('Contenu', {
  id:             { type: DataTypes.INTEGER,    autoIncrement: true, primaryKey: true },
  titre:          { type: DataTypes.STRING(200),allowNull: false },
  type:           { type: DataTypes.ENUM('ANIME','MANGA'), allowNull: false },
  synopsis:       { type: DataTypes.TEXT },
  image_url:      { type: DataTypes.STRING(500) },
  trailer_url:    { type: DataTypes.STRING(500) },
  auteur:         { type: DataTypes.STRING(100) },
  note:           { type: DataTypes.DECIMAL(3,1), defaultValue: 0 },
  date_sortie:    { type: DataTypes.INTEGER },
  statut:         { type: DataTypes.ENUM('EN_COURS','TERMINE'), defaultValue: 'EN_COURS' },
  nb_saisons:     { type: DataTypes.INTEGER },
  nb_chapitres:   { type: DataTypes.INTEGER },
  duree_episode:  { type: DataTypes.INTEGER },
  age_recommande: { type: DataTypes.INTEGER, defaultValue: 0 },
  classification: { type: DataTypes.ENUM('TOUT_PUBLIC','ADULTE'), defaultValue: 'TOUT_PUBLIC' },
  date_ajout:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName:  'contenus',
  timestamps: false
});

module.exports = Contenu;