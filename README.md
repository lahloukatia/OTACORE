# OTACORE 🎌
> Gestion de streaming anime & manga

## Stack technique
- **Frontend** : HTML, CSS, Bootstrap 5, EJS
- **Backend** : Node.js, Express.js
- **Base de données** : MySQL + Sequelize

## Installation

### Prérequis
- Node.js v18+
- MySQLss 8.0+

### Étapes

1. Cloner le repo
git clone https://github.com/lahloukatia/OTACORE.git
cd OTACORE

2. Installer les dépendances
npm install

3. Configurer l'environnement
cp .env.example .env
# Modifier .env avec vos infos MySQL

4. Créer la base de données MySQL
## Setup Base de Données

### Importer la BDD complète
mysql -u root -p -e "CREATE DATABASE otacore;"
mysql -u root -p otacore < database/otacore.sql

C'est tout ! Toutes les tables et données sont incluses.
5. Lancer le projet
npm run dev

6. Ouvrir dans le navigateur
http://localhost:3000
