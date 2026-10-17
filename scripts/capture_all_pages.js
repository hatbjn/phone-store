import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.resolve('screenshots');

const pages = [
  { name: '01_accueil.png', url: 'http://localhost:5173/' },
  { name: '02_catalogue_smartphones.png', url: 'http://localhost:5173/smartphones' },
  { name: '03_fiche_produit.png', url: 'http://localhost:5173/produit/1' },
  { name: '05_panier.png', url: 'http://localhost:5173/panier' },
  { name: '06_authentification.png', url: 'http://localhost:5173/connexion' },
  { name: '07_contact.png', url: 'http://localhost:5173/contact' },
  { name: '08_tableau_de_bord_admin.png', url: 'http://localhost:5173/compte/tableau-de-bord?demo=admin' },
  { name: '09_mes_commandes.png', url: 'http://localhost:5173/compte/mes-commandes?demo=client' },
  { name: '09_mes_adresses.png', url: 'http://localhost:5173/compte/adresses?demo=client' },
  { name: '10_tunnel_commande.png', url: 'http://localhost:5173/commande?demo=client' },
  { name: '11_favoris_clients.png', url: 'http://localhost:5173/compte/favoris-clients?demo=admin' }
];

for (const p of pages) {
  const dest = path.join(OUT_DIR, p.name);
  console.log(`Capturing: ${p.name} from ${p.url}...`);
  // Edge flags: window size 1440x960, hide scrollbars
  const cmd = `"${EDGE}" --headless --disable-gpu "--screenshot=${dest}" --window-size=1440,960 --virtual-time-budget=5000 "${p.url}"`;
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 35000 });
  } catch (err) {
    console.error(`Error capturing ${p.name}:`, err.message);
  }
}

console.log('Capture script finished.');
