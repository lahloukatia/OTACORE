const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Initialize database from SQL schema file
 * Creates database and tables if they don't exist
 */
async function initDatabase() {
  try {
    // Connection to MySQL server (without database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306
    });

    console.log('📡 Connecting to MySQL...');

    // Check if database exists
    const databases = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [process.env.DB_NAME]
    );

    if (databases[0].length === 0) {
      console.log(`🆕 Creating database: ${process.env.DB_NAME}`);
      
      // Read SQL file
      const sqlFilePath = path.join(__dirname, 'example.sql');
      const sql = fs.readFileSync(sqlFilePath, 'utf8');
      
      // Execute SQL (split by semicolon to handle multiple statements)
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('--'));

      for (const statement of statements) {
        try {
          await connection.query(statement);
        } catch (err) {
          // Skip errors on table exists, etc.
          if (!err.message.includes('already exists')) {
            console.warn('⚠️ SQL Warning:', err.message);
          }
        }
      }

      console.log('✅ Database initialized from schema');
    } else {
      console.log('✅ Database already exists');
    }

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
}

module.exports = initDatabase;
