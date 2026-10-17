import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'phone_store'
  });

  await pool.query("UPDATE users SET name = 'Charaf-Eddine Mlili' WHERE id = 4");
  console.log("Updated user 4 to 'Charaf-Eddine Mlili'");

  const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = 4");
  console.log("Current user 4:", rows[0]);

  await pool.end();
}
run();
