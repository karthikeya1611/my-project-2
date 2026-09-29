const { Client } = require('pg');
require('dotenv').config();

async function createDatabaseIfNotExists() {
  const targetDbName = process.env.DB_NAME || 'smartserve';
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', // Connect to default maintenance DB
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDbName]
    );

    if (res.rowCount === 0) {
      console.log(`Database "${targetDbName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`✅ Database "${targetDbName}" created successfully.`);
    } else {
      console.log(`ℹ️ Database "${targetDbName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Error checking/creating database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabaseIfNotExists();
