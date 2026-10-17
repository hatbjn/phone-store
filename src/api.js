const API = import.meta.env.VITE_API_URL || '/api';

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Serveur injoignable. Vérifiez que le back-end est démarré.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
  return data;
}

export const money = (n) => `${Number(n).toLocaleString('fr-FR').replace(/\u202f/g, ' ')} DH`;
export const list = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);

export const COLOR_HEX = {
  Titane: '#b8a58f', Noir: '#1c1c1e', Bleu: '#3b82f6', Blanc: '#f1f1f1',
  Violet: '#8b5cf6', Vert: '#22a06b', Or: '#e0b66b', Rose: '#f472b6', Gris: '#9ca3af',
};
export const hex = (name) => COLOR_HEX[name] || '#9ca3af';

export const DEFAULT_PRODUCT_IMAGES = {
  'iphone 16 pro': '/products/iphone-16-pro.jpg',
  'samsung galaxy s24 ultra': '/products/galaxy-s24-ultra.jpg',
  'samsung galaxy s24': '/products/galaxy-s24.jpg',
  'samsung galaxy a55': '/products/galaxy-a55.jpg',
  'xiaomi 14': '/products/xiaomi-14.jpg',
  'xiaomi 13t': '/products/xiaomi-13t.jpg',
  'xiaomi redmi note 13': '/products/redmi-note-13.jpg',
  'oppo reno12': '/products/oppo-reno12.jpg',
  'oppo find x7': '/products/oppo-find-x7.jpg',
  'realme 12 pro': '/products/realme-12-pro.jpg',
  'iphone 15': '/products/iphone-15.jpg',
  'iphone 16': '/products/iphone-16.jpg',
  'airpods pro': '/products/airpods-pro.jpg',
  'chargeur 20w': '/products/chargeur-20w.jpg',
  'câble usb-c': '/products/cable-usb-c.jpg',
  'cable usb-c': '/products/cable-usb-c.jpg',
  'coque magsafe': '/products/coque-magsafe.jpg',
  'power bank': '/products/power-bank.jpg',
  'support voiture': '/products/support-voiture.jpg',
  'montre connectée': '/products/montre-connectee.jpg',
  'montre connectee': '/products/montre-connectee.jpg',
  'protection écran': '/products/protection-ecran.jpg',
  'protection ecran': '/products/protection-ecran.jpg',
};

export function resolveProductImage(product) {
  if (!product) return '/products/iphone-16-pro.jpg';
  if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim() && !product.image_url.includes('undefined')) {
    return product.image_url;
  }
  const name = String(product.name || '').toLowerCase().trim();
  if (DEFAULT_PRODUCT_IMAGES[name]) return DEFAULT_PRODUCT_IMAGES[name];
  for (const [k, v] of Object.entries(DEFAULT_PRODUCT_IMAGES)) {
    if (name.includes(k) || k.includes(name)) return v;
  }
  return product.category === 'Accessoires' ? '/products/chargeur-20w.jpg' : '/products/iphone-16-pro.jpg';
}

