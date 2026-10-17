import pool from '../server/db.js';

const [rows] = await pool.query('SELECT id, name, category, image_url FROM products ORDER BY id');
console.log('Products in DB:');
for (const r of rows) {
  console.log(`${r.id} | ${r.category} | ${r.name} | image_url: "${r.image_url}"`);
}
process.exit(0);
