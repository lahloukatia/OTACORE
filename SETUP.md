# Database Setup Guide

## Prerequisites
- MySQL 8.0+
- Node.js
- npm

## Setup Instructions

### 1. Create Database from Schema
```bash
# Option A: Using the SQL file (recommended for fresh setup)
mysql -u root -p -e "CREATE DATABASE otacore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p otacore < database/example.sql

# Option B: Manual creation
mysql -u root -p
> CREATE DATABASE otacore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> USE otacore;
> (paste contents of database/example.sql)
```

### 2. Configure Environment
```bash
cp env.example .env
# Edit .env with your database credentials
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm start
# or with nodemon (development)
npm run dev
```

## Database Schema Overview

### Core Tables
- **content**: Base table for all anime/manga (content_type: 'anime' or 'manga')
- **anime**: Anime-specific details (1-to-1 with content)
- **manga**: Manga-specific details (1-to-1 with content)
- **genres**: Genre lookup table
- **studios**: Studio information

### User Tables
- **utilisateurs**: User accounts
- **watch_later**: User's watchlist
- **historique**: Viewing history
- **sessions**: Session management

### Junction Tables
- **content_genres**: Links content to genres (many-to-many)

## Important Notes
- All timestamps are stored in UTC
- Use the Sequelize models in `/models` for API operations
- The SQL schema is the source of truth for the database structure
- Foreign key constraints are enforced
