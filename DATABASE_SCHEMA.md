# Database Schema Mapping
## SQL Schema ↔ Sequelize Models

### Schema Overview

This document shows how your SQL schema (`example.sql`) maps to your Sequelize models.

---

## Table Mappings

### 1. **genres** (SQL) ↔ **Genre Model**
| SQL Column | Sequelize Field | Type | Notes |
|-----------|-----------------|------|-------|
| id | id | INTEGER | Primary Key, Auto-increment |
| name | name | STRING(50) | Unique |
| slug | slug | STRING(60) | Unique, URL-friendly identifier |

**Sequelize Setup:**
```js
// models/Genre.js is properly aligned ✅
```

---

### 2. **contenus** (SQL) ↔ **Contenu Model**

| SQL Column | Sequelize Field | SQL Type | Model Type | Status |
|-----------|-----------------|----------|-----------|--------|
| id | id | INT UNSIGNED | INTEGER | ✅ Mapped |
| titre | titre | VARCHAR(200) | STRING(200) | ✅ Match |
| type | type | ENUM('ANIME','MANGA') | ENUM | ✅ Match |
| synopsis | synopsis | TEXT | TEXT | ✅ Mapped |
| image_url | image_url | VARCHAR(500) | STRING(500) | ✅ Mapped |
| date_ajout | date_ajout | DATE | DATE | ✅ Mapped |

**Status:** ✅ Compatible (field names match SQL schema)

---

### 3. **utilisateurs** (SQL) ↔ **Utilisateur Model**

| SQL Column | Sequelize Field | SQL Type | Model Type | Status |
|-----------|-----------------|----------|-----------|--------|
| id | id | INT UNSIGNED | INTEGER | ✅ Mapped |
| username | username | VARCHAR(50) | STRING(50) | ✅ Match |
| email | email | VARCHAR(100) | STRING(100) | ✅ Match |
| mot_de_passe | mot_de_passe | VARCHAR(255) | STRING(255) | ✅ Match |
| date_naissance | date_naissance | DATE | DATEONLY | ✅ Match |
| statut | statut | ENUM | ENUM | ✅ Match |
| date_inscription | date_inscription | DATE | DATE | ✅ Match |

**Status:** ✅ Compatible

---

### 4. **watch_later** (SQL) ↔ **WatchLater Model**

| SQL Column | Sequelize Field | SQL Type | Model Type | Status |
|-----------|-----------------|----------|-----------|--------|
| id | id | INT UNSIGNED | INTEGER | ✅ Mapped |
| user_id | user_id | INT UNSIGNED | INTEGER | ✅ Match |
| contenu_id | contenu_id | INT UNSIGNED | INTEGER | ✅ Match |
| statut_suivi | statut_suivi | ENUM | ENUM | ✅ Match |
| date_ajout | date_ajout | DATE | DATE | ✅ Match |

**Status:** ✅ Compatible

---

### 5. **historique** (SQL) ↔ **Historique Model**

| SQL Column | Sequelize Field | SQL Type | Model Type | Status |
|-----------|-----------------|----------|-----------|--------|
| id | id | INT UNSIGNED | INTEGER | ✅ Mapped |
| user_id | user_id | INT UNSIGNED | INTEGER | ✅ Match |
| contenu_id | contenu_id | INT UNSIGNED | INTEGER | ✅ Match |
| date_consultation | date_consultation | DATETIME | DATE | ✅ Mapped |

**Status:** ✅ Compatible

---

### 6. **contenus_genres** (SQL Junction Table)

**Sequelize Setup:**
```js
// Defined in models/index.js
Contenu.belongsToMany(Genre, {
  through: 'contenus_genres',
  foreignKey: 'contenu_id',
  otherKey: 'genre_id',
  timestamps: false
});
```

**Status:** ✅ Properly configured

---

## Relationships (Association Diagram)

```
Utilisateur
  ├─→ has many → WatchLater
  ├─→ has many → Historique
  └─→ has many → Sessions (for express-session)

Contenu
  ├─→ many ↔ many → Genre (through: contenus_genres)
  ├─→ has many ← WatchLater
  └─→ has many ← Historique

Genre
  └─→ many ↔ many → Contenu (through: contenus_genres)
```

---

## How to Use

### 1. Initialize Database
```bash
npm start
# This will:
# - Create the database from example.sql (if not exists)
# - Verify Sequelize connections
# - Start the server
```

### 2. Query Examples

```js
// Find all anime
const anime = await Contenu.findAll({ where: { type: 'ANIME' } });

// Find user's watchlist with content details
const watchlist = await Utilisateur.findByPk(userId, {
  include: [{ association: 'watch_later', include: ['Contenu'] }]
});

// Get content with genres
const content = await Contenu.findByPk(contentId, {
  include: [Genre]
});

// Add content to watchlist
await WatchLater.create({
  user_id: userId,
  contenu_id: contentId,
  statut_suivi: 'EN_COURS'
});
```

---

## Important Notes

⚠️ **Before using the app:**

1. **Database must be created** - Run `npm start` at least once to initialize
2. **Environment variables** - Copy `env.example` to `.env` and set MySQL credentials
3. **MySQL must be running** - Ensure your MySQL server is accessible
4. **Foreign keys enabled** - The SQL schema uses CASCADE deletes for data integrity

---

## Troubleshooting

### "Table doesn't exist" error
- Run `npm start` to initialize the database from the SQL schema
- Check that MySQL credentials in `.env` are correct

### "Unknown column" error
- Check the field name matches the schema mapping above
- Use the SQL column name when querying directly
- Use the Sequelize field name in your models

### Connection refused
- Verify MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Ensure MySQL port (default 3306) is accessible

