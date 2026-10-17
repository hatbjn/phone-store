import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.resolve('screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const pages = [
  { name: '01_accueil.png', url: 'http://localhost:5173/' },
  { name: '02_catalogue_smartphones.png', url: 'http://localhost:5173/smartphones' },
  { name: '03_fiche_produit.png', url: 'http://localhost:5173/produit/1' },
  { name: '04_accessoires.png', url: 'http://localhost:5173/accessoires' },
  { name: '05_panier.png', url: 'http://localhost:5173/panier' },
  { name: '06_authentification.png', url: 'http://localhost:5173/connexion' },
  { name: '07_contact.png', url: 'http://localhost:5173/contact' },
  { name: '08_tableau_de_bord_admin.png', url: 'http://localhost:5173/admin' }
];

for (const p of pages) {
  const dest = path.join(OUT_DIR, p.name);
  console.log(`Capturing: ${p.name}...`);
  const cmd = `"${EDGE}" --headless --disable-gpu "--screenshot=${dest}" --window-size=1440,960 "${p.url}"`;
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 15000 });
  } catch (err) {
    console.error(`Error on ${p.name}:`, err.message);
  }
}

console.log('Capture finished.');
