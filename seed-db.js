import 'dotenv/config';
import pool, { initDb } from './server/db.js';

const P = (name, brand, category, price, old_price, stock, rating, reviews, colors, storages, image_url, description) =>
  ({ name, brand, category, price, old_price, stock, rating, reviews, colors, storages, image_url, description });

const S = '128 Go,256 Go,512 Go,1 To';
const products = [
  P('iPhone 16 Pro', 'Apple', 'Smartphones', 12999, 14499, 40, 4.8, 128, 'Titane,Noir,Bleu,Blanc', S,
    '/products/iphone-16-pro.jpg',
    'Un design en titane, des performances exceptionnelles et un système photo révolutionnaire.'),
  P('Samsung Galaxy S24', 'Samsung', 'Smartphones', 9499, 10499, 30, 4.7, 96, 'Violet,Noir,Vert', '128 Go,256 Go,512 Go',
    '/products/galaxy-s24.jpg',
    'Galaxy AI est arrivé. Un écran Dynamic AMOLED 2X lumineux et un processeur ultra rapide.'),
  P('Xiaomi 14', 'Xiaomi', 'Smartphones', 6499, null, 25, 4.5, 74, 'Vert,Noir,Blanc', '256 Go,512 Go',
    '/products/xiaomi-14.jpg',
    'Optiques Leica, charge ultra rapide et écran 120 Hz.'),
  P('Oppo Reno12', 'Oppo', 'Smartphones', 5499, null, 22, 4.4, 51, 'Violet,Noir', '256 Go,512 Go',
    '/products/oppo-reno12.jpg',
    'Un design fin et élégant avec un portrait IA professionnel.'),
  P('Realme 12 Pro', 'Realme', 'Smartphones', 4999, 5499, 18, 4.4, 38, 'Or,Bleu', '128 Go,256 Go',
    '/products/realme-12-pro.jpg',
    'Zoom périscope 3x et finition cuir végan.'),
  P('iPhone 15', 'Apple', 'Smartphones', 10999, 11999, 35, 4.7, 210, 'Noir,Bleu,Rose', '128 Go,256 Go,512 Go',
    '/products/iphone-15.jpg',
    'Dynamic Island, appareil photo 48 Mpx et USB-C.'),
  P('Samsung Galaxy A55', 'Samsung', 'Smartphones', 4499, null, 40, 4.3, 62, 'Bleu,Noir', '128 Go,256 Go',
    '/products/galaxy-a55.jpg',
    'Le meilleur rapport qualité/prix : écran 120 Hz et batterie 5000 mAh.'),
  P('Xiaomi Redmi Note 13', 'Xiaomi', 'Smartphones', 2999, 3299, 60, 4.2, 144, 'Noir,Bleu,Vert', '128 Go,256 Go',
    '/products/redmi-note-13.jpg',
    'Appareil photo 108 Mpx et écran AMOLED.'),
  P('iPhone 16', 'Apple', 'Smartphones', 10499, null, 45, 4.7, 87, 'Noir,Blanc,Rose,Vert', '128 Go,256 Go,512 Go',
    '/products/iphone-16.jpg',
    'Bouton Action, puce A18 et nouveau système photo.'),
  P('Samsung Galaxy S24 Ultra', 'Samsung', 'Smartphones', 13499, 14499, 20, 4.9, 175, 'Noir,Titane,Violet', '256 Go,512 Go,1 To',
    '/products/galaxy-s24-ultra.jpg',
    'S Pen intégré, zoom 100x et cadre en titane.'),
  P('Oppo Find X7', 'Oppo', 'Smartphones', 8999, null, 12, 4.6, 29, 'Noir,Bleu', '256 Go,512 Go',
    '/products/oppo-find-x7.jpg',
    'Hasselblad Camera for Mobile et charge SUPERVOOC 100 W.'),
  P('Xiaomi 13T', 'Xiaomi', 'Smartphones', 5999, 6499, 28, 4.4, 55, 'Bleu,Noir,Vert', '256 Go',
    '/products/xiaomi-13t.jpg',
    'Écran 144 Hz et optique Leica.'),
  P('AirPods Pro', 'Apple', 'Accessoires', 2499, 2799, 80, 4.9, 312, 'Blanc', null,
    '/products/airpods-pro.jpg',
    'Réduction active du bruit, audio spatial personnalisé, boîtier MagSafe.'),
  P('Chargeur 20W', 'Apple', 'Accessoires', 349, null, 150, 4.6, 120, 'Blanc', null,
    '/products/chargeur-20w.jpg',
    'Adaptateur secteur USB-C 20 W pour une charge rapide.'),
  P('Câble USB-C', 'Anker', 'Accessoires', 129, null, 300, 4.5, 98, 'Blanc,Noir', null,
    '/products/cable-usb-c.jpg',
    'Câble USB-C tressé 1 m, charge et synchronisation.'),
  P('Coque MagSafe', 'Apple', 'Accessoires', 399, 449, 90, 4.6, 76, 'Titane,Noir,Bleu', null,
    '/products/coque-magsafe.jpg',
    'Coque en silicone compatible MagSafe.'),
  P('Power Bank', 'Anker', 'Accessoires', 399, null, 70, 4.5, 64, 'Noir', null,
    '/products/power-bank.jpg',
    'Batterie externe 10 000 mAh, charge rapide 22,5 W.'),
  P('Support voiture', 'Baseus', 'Accessoires', 249, null, 85, 4.3, 41, 'Noir', null,
    '/products/support-voiture.jpg',
    'Support magnétique pour tableau de bord.'),
  P('Montre connectée', 'Xiaomi', 'Accessoires', 899, 999, 50, 4.4, 83, 'Noir,Blanc', null,
    '/products/montre-connectee.jpg',
    'Suivi santé, GPS intégré, 14 jours d\'autonomie.'),
  P('Protection écran', 'Spigen', 'Accessoires', 199, null, 200, 4.5, 133, 'Noir', null,
    '/products/protection-ecran.jpg',
    'Verre trempé 9H, installation facile.'),
];

await initDb();
await pool.query('TRUNCATE TABLE products');
for (const p of products) {
  await pool.query(
    `INSERT INTO products (name, description, price, old_price, stock, category, brand, colors, storages, rating, reviews_count, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [p.name, p.description, p.price, p.old_price, p.stock, p.category, p.brand, p.colors, p.storages, p.rating, p.reviews, p.image_url]
  );
}
console.log(`${products.length} produits insérés avec succès avec leurs photos réelles.`);
await pool.end();
