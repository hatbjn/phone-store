import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import pool, { initDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.resolve('public/uploads')));
app.use('/products', express.static(path.resolve('public/products')));

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) => {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  });

// Codes promo : stockés dans la table `promos` (voir server/db.js)
const promoPercent = async (db, code) => {
  if (!code) return 0;
  const [[p]] = await db.query(
    'SELECT percent FROM promos WHERE code = ? AND active = 1 AND (expires_at IS NULL OR expires_at >= CURDATE())',
    [String(code).trim().toUpperCase()]
  );
  return p ? Number(p.percent) : 0;
};

// ---------- auth helpers ----------
const hashPassword = (pwd) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(pwd, salt, 64).toString('hex')}`;
};
const checkPassword = (pwd, stored) => {
  const [salt, hash] = stored.split(':');
  const test = crypto.scryptSync(pwd, salt, 64);
  return crypto.timingSafeEqual(test, Buffer.from(hash, 'hex'));
};
const loadUser = async (req) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return null;
  const [rows] = await pool.query(
    'SELECT u.id, u.name, u.email, u.phone, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?',
    [token]
  );
  return rows[0] || null;
};
const optionalAuth = async (req, res, next) => {
  try { req.user = await loadUser(req); next(); } catch (e) { next(e); }
};
const requireAuth = async (req, res, next) => {
  try {
    req.user = await loadUser(req);
    if (!req.user) return res.status(401).json({ error: 'Connexion requise' });
    next();
  } catch (e) { next(e); }
};
const newSession = async (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query('INSERT INTO sessions (token, user_id) VALUES (?, ?)', [token, userId]);
  return token;
};

// ---------- products ----------
app.get('/api/products', wrap(async (req, res) => {
  const { category, search } = req.query;
  const where = [];
  const params = [];
  if (category) { where.push('category = ?'); params.push(category); }
  if (search) { where.push('(name LIKE ? OR brand LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  const [rows] = await pool.query(
    `SELECT * FROM products ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id`,
    params
  );
  res.json(rows);
}));

app.get('/api/products/:id', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(rows[0]);
}));

app.post('/api/products', wrap(async (req, res) => {
  const { name, description, price, old_price, stock, category, brand, colors, storages, image_url } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Nom et prix requis' });
  const [r] = await pool.query(
    `INSERT INTO products (name, description, price, old_price, stock, category, brand, colors, storages, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description || '', price, old_price || null, stock || 0, category || 'Smartphones',
      brand || null, colors || null, storages || null, image_url || '']
  );
  res.status(201).json({ id: r.insertId });
}));

app.put('/api/products/:id', wrap(async (req, res) => {
  const { name, description, price, old_price, stock, category, brand, colors, storages, image_url } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Nom et prix requis' });
  const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
  if (!existing[0]) return res.status(404).json({ error: 'Produit introuvable' });
  await pool.query(
    `UPDATE products SET name = ?, description = ?, price = ?, old_price = ?, stock = ?, category = ?,
     brand = ?, colors = ?, storages = ?, image_url = ? WHERE id = ?`,
    [name, description || '', price, old_price || null, stock || 0, category || 'Smartphones',
      brand || null, colors || null, storages || null, image_url || '', req.params.id]
  );
  res.json({ ok: true, id: req.params.id });
}));

app.delete('/api/products/:id', wrap(async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
}));

// ---------- uploads ----------
app.post('/api/upload', wrap(async (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Données image requises' });
  const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const ext = matches
    ? (matches[1].split('/')[1] || 'jpg').replace('jpeg', 'jpg').replace('svg+xml', 'svg')
    : 'jpg';
  const rawBase64 = matches ? matches[2] : data;
  const buffer = Buffer.from(rawBase64, 'base64');
  const safeName = `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const uploadDir = path.resolve('public/uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });
  await fs.promises.writeFile(path.join(uploadDir, safeName), buffer);
  res.json({ url: `/uploads/${safeName}` });
}));

// ---------- reviews ----------
app.get('/api/products/:id/reviews', wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC', [req.params.id]);
  res.json(rows);
}));

app.post('/api/products/:id/reviews', optionalAuth, wrap(async (req, res) => {
  const { author, rating, comment } = req.body;
  const r = Number(rating);
  if (!(r >= 1 && r <= 5) || !comment) return res.status(400).json({ error: 'Note et commentaire requis' });
  const name = req.user?.name || author || 'Client';
  await pool.query('INSERT INTO reviews (product_id, author, rating, comment) VALUES (?, ?, ?, ?)',
    [req.params.id, name, r, comment]);
  const [[agg]] = await pool.query('SELECT AVG(rating) a, COUNT(*) c FROM reviews WHERE product_id = ?', [req.params.id]);
  await pool.query('UPDATE products SET rating = ?, reviews_count = reviews_count + 1 WHERE id = ?',
    [Math.round(agg.a * 10) / 10, req.params.id]);
  res.status(201).json({ ok: true });
}));

// ---------- auth ----------
app.post('/api/auth/register', wrap(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ error: 'Nom, email et mot de passe (6 caractères min.) requis' });
  const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (exists[0]) return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  const [r] = await pool.query('INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
    [name, email, phone || null, hashPassword(password)]);
  const token = await newSession(r.insertId);
  res.status(201).json({ token, user: { id: r.insertId, name, email, phone: phone || null, role: 'user' } });
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const u = rows[0];
  if (!u || !checkPassword(password || '', u.password_hash))
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  const token = await newSession(u.id);
  res.json({ token, user: { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role || 'user' } });
}));

app.get('/api/auth/me', requireAuth, (req, res) => res.json(req.user));

app.put('/api/auth/me', requireAuth, wrap(async (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nom et email requis' });
  const [dup] = await pool.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, req.user.id]);
  if (dup[0]) return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  if (password && password.trim().length >= 6) {
    await pool.query('UPDATE users SET name = ?, phone = ?, email = ?, password_hash = ? WHERE id = ?',
      [name, phone || null, email, hashPassword(password.trim()), req.user.id]);
  } else {
    await pool.query('UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?',
      [name, phone || null, email, req.user.id]);
  }
  res.json({ id: req.user.id, name, email, phone: phone || null, role: req.user.role });
}));

app.post('/api/auth/logout', requireAuth, wrap(async (req, res) => {
  await pool.query('DELETE FROM sessions WHERE token = ?', [(req.headers.authorization || '').replace('Bearer ', '')]);
  res.json({ ok: true });
}));

// ---------- promo ----------
app.post('/api/promo/validate', (req, res) => {
  const code = String(req.body.code || '').trim().toUpperCase();
  if (!PROMOS[code]) return res.status(404).json({ error: 'Code promo invalide' });
  res.json({ code, percent: PROMOS[code] });
});

// ---------- orders ----------
app.post('/api/orders', optionalAuth, wrap(async (req, res) => {
  const { items, shipping, payment_method, promo_code } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Panier vide' });
  const s = shipping || {};
  if (!s.full_name || !s.phone || !s.address || !s.city)
    return res.status(400).json({ error: 'Informations de livraison incomplètes' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let subtotal = 0;
    const lines = [];
    for (const it of items) {
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      const [[p]] = await conn.query('SELECT * FROM products WHERE id = ? FOR UPDATE', [it.product_id]);
      if (!p) throw Object.assign(new Error('Produit introuvable'), { status: 400 });
      if (p.stock < qty) throw Object.assign(new Error(`Stock insuffisant pour ${p.name}`), { status: 400 });
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, p.id]);
      subtotal += Number(p.price) * qty;
      lines.push({ p, qty, color: it.color || null, storage: it.storage || null });
    }
    const code = promo_code ? String(promo_code).toUpperCase() : null;
    const percent = code && PROMOS[code] ? PROMOS[code] : 0;
    const discount = Math.round(subtotal * percent) / 100;
    const total = subtotal - discount;
    const [o] = await conn.query(
      `INSERT INTO orders (user_id, full_name, phone, address, city, postal_code, payment_method, subtotal, discount, total, promo_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user?.id || null, s.full_name, s.phone, s.address, s.city, s.postal_code || null,
        payment_method || 'card', subtotal, discount, total, percent ? code : null]
    );
    for (const l of lines) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, name, price, quantity, color, storage) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [o.insertId, l.p.id, l.p.name, l.p.price, l.qty, l.color, l.storage]
      );
    }
    await conn.commit();
    res.status(201).json({ id: o.insertId, total });
  } catch (e) {
    await conn.rollback();
    if (e.status) return res.status(e.status).json({ error: e.message });
    throw e;
  } finally {
    conn.release();
  }
}));

app.get('/api/orders', requireAuth, wrap(async (req, res) => {
  const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
  if (orders.length) {
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?)', [orders.map((o) => o.id)]);
    orders.forEach((o) => { o.items = items.filter((i) => i.order_id === o.id); });
  }
  res.json(orders);
}));

app.put('/api/orders/:id/cancel', requireAuth, wrap(async (req, res) => {
  const [[o]] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!o) return res.status(404).json({ error: 'Commande introuvable' });
  if (o.status !== 'processing') return res.status(400).json({ error: 'Cette commande ne peut plus être annulée' });
  const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
  for (const i of items) await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [i.quantity, i.product_id]);
  await pool.query('UPDATE orders SET status = "cancelled" WHERE id = ?', [o.id]);
  res.json({ ok: true });
}));

// ---------- addresses ----------
app.get('/api/addresses', requireAuth, wrap(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
  res.json(rows);
}));
app.post('/api/addresses', requireAuth, wrap(async (req, res) => {
  const { label, full_name, phone, address, city, postal_code } = req.body;
  if (!full_name || !address || !city) return res.status(400).json({ error: 'Nom, adresse et ville requis' });
  const [r] = await pool.query(
    'INSERT INTO addresses (user_id, label, full_name, phone, address, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, label || 'Domicile', full_name, phone || null, address, city, postal_code || null]
  );
  res.status(201).json({ id: r.insertId });
}));
app.delete('/api/addresses/:id', requireAuth, wrap(async (req, res) => {
  await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ ok: true });
}));

// ---------- admin stats ----------
app.get('/api/admin/stats', wrap(async (req, res) => {
  const [[ordersAgg]] = await pool.query(
    'SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as total_revenue, COALESCE(AVG(total), 0) as avg_order FROM orders WHERE status != "cancelled"'
  );
  const [ordersByStatus] = await pool.query(
    'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
  );
  const [[productsAgg]] = await pool.query(
    'SELECT COUNT(*) as total_products, COALESCE(SUM(stock), 0) as total_stock, COALESCE(SUM(price * stock), 0) as inventory_value FROM products'
  );
  const [categoryBreakdown] = await pool.query(
    'SELECT category, COUNT(*) as count, COALESCE(SUM(stock), 0) as stock, COALESCE(SUM(price * stock), 0) as value FROM products GROUP BY category'
  );
  const [lowStock] = await pool.query(
    'SELECT id, name, category, price, stock FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 10'
  );
  const [recentOrders] = await pool.query(
    'SELECT id, full_name, total, status, created_at FROM orders ORDER BY id DESC LIMIT 5'
  );
  const [[usersAgg]] = await pool.query(
    'SELECT COUNT(*) as total_users FROM users'
  );

  res.json({
    total_revenue: Number(ordersAgg.total_revenue) || 0,
    total_orders: Number(ordersAgg.total_orders) || 0,
    avg_order: Number(ordersAgg.avg_order) || 0,
    total_products: Number(productsAgg.total_products) || 0,
    total_stock: Number(productsAgg.total_stock) || 0,
    inventory_value: Number(productsAgg.inventory_value) || 0,
    total_users: Number(usersAgg.total_users) || 0,
    category_breakdown: categoryBreakdown,
    orders_by_status: ordersByStatus,
    low_stock: lowStock,
    recent_orders: recentOrders,
  });
}));

// ---------- admin orders & status ----------
app.get('/api/admin/orders', requireAuth, wrap(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  const [orders] = await pool.query(
    `SELECT o.*, u.email as client_email, u.name as client_name
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.id DESC`
  );
  if (orders.length) {
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?)', [orders.map((o) => o.id)]);
    orders.forEach((o) => { o.items = items.filter((i) => i.order_id === o.id); });
  }
  res.json(orders);
}));

app.put('/api/admin/orders/:id/status', requireAuth, wrap(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  const { status } = req.body;
  if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ ok: true, status });
}));

// ---------- admin clients list ----------
app.get('/api/admin/users', requireAuth, wrap(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
            COUNT(DISTINCT o.id) as orders_count,
            COALESCE(SUM(CASE WHEN o.status != 'cancelled' THEN o.total ELSE 0 END), 0) as total_spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     GROUP BY u.id
     ORDER BY u.id DESC`
  );
  res.json(rows);
}));

// ---------- favorites endpoints ----------
app.get('/api/favorites', optionalAuth, wrap(async (req, res) => {
  if (!req.user) return res.json([]);
  const [rows] = await pool.query('SELECT product_id FROM favorites WHERE user_id = ?', [req.user.id]);
  res.json(rows.map((r) => r.product_id));
}));

app.post('/api/favorites/toggle', requireAuth, wrap(async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id requis' });
  const [rows] = await pool.query('SELECT id FROM favorites WHERE user_id = ? AND product_id = ?', [req.user.id, product_id]);
  if (rows[0]) {
    await pool.query('DELETE FROM favorites WHERE id = ?', [rows[0].id]);
    res.json({ action: 'removed', product_id });
  } else {
    await pool.query('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [req.user.id, product_id]);
    res.json({ action: 'added', product_id });
  }
}));

app.get('/api/admin/favorites', requireAuth, wrap(async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  const [rows] = await pool.query(
    `SELECT f.user_id, u.name as user_name, u.email as user_email, u.phone as user_phone,
            p.id as product_id, p.name as product_name, p.brand, p.price, p.image_url, p.category, p.stock,
            f.created_at
     FROM favorites f
     JOIN users u ON u.id = f.user_id
     JOIN products p ON p.id = f.product_id
     ORDER BY f.user_id, f.created_at DESC`
  );
  const grouped = {};
  for (const r of rows) {
    if (!grouped[r.user_id]) {
      grouped[r.user_id] = {
        user_id: r.user_id,
        user_name: r.user_name,
        user_email: r.user_email,
        user_phone: r.user_phone,
        items: [],
      };
    }
    grouped[r.user_id].items.push({
      id: r.product_id,
      name: r.product_name,
      brand: r.brand,
      price: r.price,
      image_url: r.image_url,
      category: r.category,
      stock: r.stock,
      created_at: r.created_at,
    });
  }
  res.json(Object.values(grouped));
}));

// ---------- contact ----------
app.post('/api/messages', wrap(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Nom, email et message requis' });
  await pool.query('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject || '', message]);
  res.status(201).json({ ok: true });
}));

initDb()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`API sur http://localhost:${PORT}`)))
  .catch((e) => { console.error('Impossible d\'initialiser la base MySQL :', e.message); process.exit(1); });
