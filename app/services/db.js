require("dotenv").config();
const mysql = require('mysql2/promise');

// Configuration object securely pulling from environment variables
const config = {
  db: {
    host: process.env.DB_CONTAINER,
    port: process.env.DB_PORT,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },
};

// Initialize connection pool
const pool = mysql.createPool(config.db);

// Database query wrapper function
async function query(sql, params) {
  // Using pool.query prevents crashing when parameters are empty
  const [rows, fields] = await pool.query(sql, params);
  
  // Return only the data rows, discarding excess database metadata
  return rows;
}

// Export the query function for use in routing
module.exports = {
  query,
};