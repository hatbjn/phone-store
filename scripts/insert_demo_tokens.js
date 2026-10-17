import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'phone_store'
});

async function run() {
  await pool.query('INSERT IGNORE INTO sessions (token, user_id) VALUES (?, ?)', ['demo-admin-token', 4]);
  await pool.query('INSERT IGNORE INTO sessions (token, user_id) VALUES (?, ?)', ['demo-client-token', 5]);
  console.log('Demo tokens inserted successfully.');
  await pool.end();
}
run();
