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
  const [users] = await pool.query('SELECT id, name, email, role FROM users');
  console.log('Users:', users);
  const [sessions] = await pool.query('SELECT * FROM sessions');
  console.log('Sessions:', sessions);
  await pool.end();
}
run();
