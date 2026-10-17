import express from 'express';
import cors from 'cors';
import { SEED_PRODUCTS, SEED_USERS, SEED_STATS } from '../server/seedData.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// In-memory fallback state for serverless execution
let memoryProducts = [...SEED_PRODUCTS];
let memoryOrders = [
  { id: 101, user_id: 5, user_name: 'Amine Tazi', user_email: 'amine.tazi@gmail.com', total: 12999, status: 'delivered', items_count: 1, created_at: '2026-10-10T14:30:00Z' },
  { id: 102, user_id: 5, user_name: 'Amine Tazi', user_email: 'amine.tazi@gmail.com', total: 2499, status: 'shipped', items_count: 1, created_at: '2026-10-12T09:15:00Z' },
  { id: 103, user_id: 2, user_name: 'Karim Bennani', user_email: 'karim.bennani@gmail.com', total: 9499, status: 'processing', items_count: 1, created_at: '2026-10-14T18:00:00Z' }
];
let memoryAddresses = [
  { id: 1, user_id: 5, label: 'Domicile', full_name: 'Amine Tazi', phone: '+212 661 458920', address: '12 Boulevard d\'Anfa, Apt 4B', city: 'Casablanca', postal_code: '20000' },
  { id: 2, user_id: 5, label: 'Bureau', full_name: 'Amine Tazi', phone: '+212 661 458920', address: 'Technopark Casablanca, Route de Nouaceur', city: 'Casablanca', postal_code: '20150' }
];
let memoryFavorites = [
  { user_id: 5, product_id: 1 },
  { user_id: 5, product_id: 10 },
  { user_id: 2, product_id: 2 }
];

// Auth helper
function getUserFromToken(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (token === 'demo-admin-token' || token.includes('admin')) {
    return SEED_USERS[0]; // Charaf-Eddine Mlili
  }
  if (token === 'demo-client-token' || token.includes('client')) {
    return SEED_USERS[1]; // Amine Tazi
  }
  return SEED_USERS[1]; // Default fallback for preview
}

// Routes
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let result = memoryProducts;
  if (category) {
    result = result.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q));
  }
  res.json(result);
});

app.get('/api/products/:id', (req, res) => {
  const p = memoryProducts.find(x => x.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: 'Produit introuvable' });
  res.json(p);
});

app.post('/api/products', (req, res) => {
  const newP = { id: Date.now(), ...req.body };
  memoryProducts.push(newP);
  res.status(201).json({ id: newP.id });
});

app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = memoryProducts.findIndex(x => x.id === id);
  if (idx !== -1) {
    memoryProducts[idx] = { ...memoryProducts[idx], ...req.body };
  }
  res.json({ ok: true });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  memoryProducts = memoryProducts.filter(x => x.id !== id);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const user = getUserFromToken(req);
  res.json(user);
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (email && email.toLowerCase().includes('admin')) {
    res.json({ token: 'demo-admin-token', user: SEED_USERS[0] });
  } else {
    res.json({ token: 'demo-client-token', user: SEED_USERS[1] });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone } = req.body;
  const user = { id: Date.now(), name, email, phone, role: 'user' };
  res.status(201).json({ token: 'demo-client-token', user });
});

app.get('/api/orders', (req, res) => {
  res.json(memoryOrders);
});

app.post('/api/orders', (req, res) => {
  const newOrder = { id: Date.now(), ...req.body, status: 'processing', created_at: new Date().toISOString() };
  memoryOrders.unshift(newOrder);
  res.status(201).json({ id: newOrder.id });
});

app.get('/api/addresses', (req, res) => {
  res.json(memoryAddresses);
});

app.post('/api/addresses', (req, res) => {
  const newAddr = { id: Date.now(), ...req.body };
  memoryAddresses.push(newAddr);
  res.status(201).json({ id: newAddr.id });
});

app.delete('/api/addresses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  memoryAddresses = memoryAddresses.filter(x => x.id !== id);
  res.json({ ok: true });
});

app.get('/api/favorites', (req, res) => {
  res.json(memoryFavorites.map(f => f.product_id));
});

app.post('/api/favorites/:id', (req, res) => {
  const pid = parseInt(req.params.id);
  if (!memoryFavorites.some(f => f.product_id === pid)) {
    memoryFavorites.push({ user_id: 5, product_id: pid });
  }
  res.json({ ok: true });
});

app.delete('/api/favorites/:id', (req, res) => {
  const pid = parseInt(req.params.id);
  memoryFavorites = memoryFavorites.filter(f => f.product_id !== pid);
  res.json({ ok: true });
});

app.get('/api/admin/stats', (req, res) => {
  res.json(SEED_STATS);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(memoryOrders);
});

app.get('/api/admin/users', (req, res) => {
  res.json(SEED_USERS);
});

app.get('/api/admin/favorites', (req, res) => {
  const grouped = [
    {
      user_id: 5,
      user_name: 'Amine Tazi',
      user_email: 'amine.tazi@gmail.com',
      user_phone: '+212 661 458920',
      items: [memoryProducts[0], memoryProducts[9]]
    },
    {
      user_id: 2,
      user_name: 'Karim Bennani',
      user_email: 'karim.bennani@gmail.com',
      user_phone: '+212 662 334455',
      items: [memoryProducts[1]]
    }
  ];
  res.json(grouped);
});

app.get('/api/promos/validate/:code', (req, res) => {
  const code = (req.params.code || '').toUpperCase();
  if (code === 'EXPRESS10' || code === 'EXPRESSOR') {
    res.json({ percent: 10, valid: true });
  } else if (code === 'VIP20') {
    res.json({ percent: 20, valid: true });
  } else {
    res.status(404).json({ error: 'Code promo invalide' });
  }
});

app.post('/api/messages', (req, res) => {
  res.status(201).json({ ok: true });
});

export default app;
