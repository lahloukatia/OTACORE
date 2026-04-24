# OTACORE 🎌
> Gestion de streaming anime & manga

## Stack technique
- **Frontend** : HTML, CSS, Bootstrap 5, EJS
- **Backend** : Node.js, Express.js
- **Base de données** : MySQL + Sequelize

## Installation Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp env.example .env
# Éditer .env avec vos identifiants MySQL

# 3. Lancer l'application
npm start
# La base de données se créera automatiquement lors du premier démarrage

# 4. Accéder à l'application
# http://localhost:3000
```

## Configuration Détaillée

### Prérequis
- Node.js v18+
- MySQL 8.0+

### Variables d'Environnement (.env)
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=otacore
SESSION_SECRET=votre_clé_secrète
```

### Initialisation de la Base de Données
La base de données s'initialise automatiquement au premier lancement :
- Les tables sont créées depuis `database/example.sql`
- Les relations Sequelize se mettent en place
- Les indexes de performance sont appliqués

**Pour initialiser manuellement :**
```bash
mysql -u root -p -e "CREATE DATABASE otacore CHARACTER SET utf8mb4;"
mysql -u root -p otacore < database/example.sql
```

## Structure du Projet

```
OTACORE/
├── config/          # Configuration (DB, Mailer)
├── controllers/     # Logique métier
├── database/        # Schéma SQL et initialisation
├── middleware/      # Authentification, etc.
├── models/          # Modèles Sequelize
├── public/          # Fichiers statiques (CSS, JS)
├── routes/          # Définition des routes
├── views/           # Templates EJS
├── server.js        # Point d'entrée
└── SETUP.md         # Guide d'installation détaillé
```

## Documentation

- **[SETUP.md](./SETUP.md)** - Guide d'installation complet
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Mapping SQL ↔ Sequelize
- **[database/example.sql](./database/example.sql)** - Schéma MySQL complet

### Importer la BDD complète
mysql -u root -p -e "CREATE DATABASE otacore;"
mysql -u root -p otacore < database/otacore.sql

C'est tout ! Toutes les tables et données sont incluses.
5. Lancer le projet
npm run dev

6. Ouvrir dans le navigateur
http://localhost:3000
