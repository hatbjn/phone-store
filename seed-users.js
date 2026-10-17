import 'dotenv/config';
import crypto from 'crypto';
import pool, { initDb } from './server/db.js';

const hashPassword = (pwd) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(pwd, salt, 64).toString('hex')}`;
};

async function seedUsers() {
  await initDb();

  const accounts = [
    {
      name: 'Admin Expressor',
      email: 'admin@expressor.ma',
      phone: '+212 600 000001',
      password: 'admin123456',
      role: 'admin',
    },
    {
      name: 'Client Expressor',
      email: 'client@expressor.ma',
      phone: '+212 600 000002',
      password: 'client123456',
      role: 'user',
    },
    {
      name: 'Admin PhoneShop',
      email: 'admin@phoneshop.ma',
      phone: '+212 600 000001',
      password: 'admin123456',
      role: 'admin',
    },
    {
      name: 'Client PhoneShop',
      email: 'client@phoneshop.ma',
      phone: '+212 600 000002',
      password: 'client123456',
      role: 'user',
    },
  ];

  for (const acc of accounts) {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [acc.email]);
    const hash = hashPassword(acc.password);
    if (rows[0]) {
      await pool.query(
        'UPDATE users SET name = ?, phone = ?, password_hash = ?, role = ? WHERE id = ?',
        [acc.name, acc.phone, hash, acc.role, rows[0].id]
      );
      console.log(`Updated user: ${acc.email} (Role: ${acc.role})`);
    } else {
      await pool.query(
        'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [acc.name, acc.email, acc.phone, hash, acc.role]
      );
      console.log(`Created user: ${acc.email} (Role: ${acc.role})`);
    }
  }

  const [allUsers] = await pool.query('SELECT id, name, email, phone, role, created_at FROM users');
  console.log('Current users in DB:', allUsers);
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
