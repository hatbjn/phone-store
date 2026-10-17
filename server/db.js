import 'dotenv/config';
import mysql from 'mysql2/promise';

const DB = process.env.DB_NAME || 'phone_store';
const cfg = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const pool = mysql.createPool({
  ...cfg,
  database: DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

const EXTRA_PRODUCT_COLUMNS = {
  old_price: 'DECIMAL(10,2) NULL',
  brand: 'VARCHAR(100) NULL',
  colors: 'VARCHAR(255) NULL',
  storages: 'VARCHAR(255) NULL',
  rating: 'DECIMAL(2,1) NOT NULL DEFAULT 4.5',
  reviews_count: 'INT NOT NULL DEFAULT 0',
};

export const initDb = async () => {
  const c = await mysql.createConnection(cfg);
  await c.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\` CHARACTER SET utf8mb4`);
  await c.end();

  await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(100),
    image_url VARCHAR(2048)
  )`);

  const [cols] = await pool.query(
    'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = "products"',
    [DB]
  );
  const have = new Set(cols.map((x) => x.COLUMN_NAME));
  for (const [name, def] of Object.entries(EXTRA_PRODUCT_COLUMNS)) {
    if (!have.has(name)) await pool.query(`ALTER TABLE products ADD COLUMN ${name} ${def}`);
  }
  await pool.query('ALTER TABLE products MODIFY COLUMN image_url MEDIUMTEXT').catch(() => {});

  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(40),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  const [userCols] = await pool.query(
    'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = "users"',
    [DB]
  );
  if (!userCols.map((x) => x.COLUMN_NAME).includes('role')) {
    await pool.query('ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT "user"');
  }
  await pool.query(`CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(64) PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    full_name VARCHAR(120), phone VARCHAR(40), address VARCHAR(255),
    city VARCHAR(100), postal_code VARCHAR(20), payment_method VARCHAR(40),
    subtotal DECIMAL(10,2) NOT NULL, discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL, promo_code VARCHAR(40) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL, product_id INT NOT NULL,
    name VARCHAR(255), price DECIMAL(10,2), quantity INT,
    color VARCHAR(60) NULL, storage VARCHAR(40) NULL
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, label VARCHAR(60),
    full_name VARCHAR(120), phone VARCHAR(40), address VARCHAR(255),
    city VARCHAR(100), postal_code VARCHAR(20)
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120), email VARCHAR(190), subject VARCHAR(120), message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL, author VARCHAR(120), rating INT NOT NULL, comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_prod (user_id, product_id)
  )`);
  console.log('Database ready.');
};

export default pool;
