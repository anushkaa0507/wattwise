const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ← THIS fixes the self-signed cert error on Render
  },
});

module.exports = pool;