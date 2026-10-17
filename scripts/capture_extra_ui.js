import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.resolve('screenshots');

const pages = [
  { name: '09_mon_compte.png', url: 'http://localhost:5173/compte?demo=client' },
  { name: '10_tunnel_commande.png', url: 'http://localhost:5173/commande?demo=client' }
];

for (const p of pages) {
  const dest = path.join(OUT_DIR, p.name);
  console.log(`Capturing: ${p.name}...`);
  const cmd = `"${EDGE}" --headless --disable-gpu "--screenshot=${dest}" --window-size=1440,960 "${p.url}"`;
  try {
    execSync(cmd, { stdio: 'inherit', timeout: 35000 });
  } catch (err) {
    console.error(`Error on ${p.name}:`, err.message);
  }
}

console.log('Capture extra finished.');
