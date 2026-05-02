const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Contenu = require('./Contenu');
const Genre = require('./Genre');
const WatchLater = require('./WatchLater');
const Historique = require('./Historique');
const Notification = require('./Notification');   // ← new

// ── Associations ──────────────────────────────
// Contenu ↔ Genre (many to many)
Contenu.belongsToMany(Genre, {
  through: 'contenus_genres',
  foreignKey: 'contenu_id',
  otherKey: 'genre_id',
  timestamps: false
});
Genre.belongsToMany(Contenu, {
  through: 'contenus_genres',
  foreignKey: 'genre_id',
  otherKey: 'contenu_id',
  timestamps: false
});

// Utilisateur ↔ WatchLater
Utilisateur.hasMany(WatchLater, { foreignKey: 'user_id' });
WatchLater.belongsTo(Utilisateur, { foreignKey: 'user_id' });
WatchLater.belongsTo(Contenu, { foreignKey: 'contenu_id' });

// Utilisateur ↔ Historique
Utilisateur.hasMany(Historique, { foreignKey: 'user_id' });
Historique.belongsTo(Utilisateur, { foreignKey: 'user_id' });
Historique.belongsTo(Contenu, { foreignKey: 'contenu_id' });

// Utilisateur ↔ Notification  ← new
Utilisateur.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(Utilisateur, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  Utilisateur,
  Contenu,
  Genre,
  WatchLater,
  Historique,
  Notification   // ← export it
};