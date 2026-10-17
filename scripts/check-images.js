import fs from 'fs';
import path from 'path';

const dir = path.resolve('public/products');
const files = fs.readdirSync(dir);

console.log(`Checking ${files.length} files in ${dir}:`);
for (const f of files) {
  const p = path.join(dir, f);
  const stat = fs.statSync(p);
  const buf = Buffer.alloc(16);
  const fd = fs.openSync(p, 'r');
  fs.readSync(fd, buf, 0, 16, 0);
  fs.closeSync(fd);
  const hex = buf.toString('hex');
  const isJpg = hex.startsWith('ffd8');
  const isPng = hex.startsWith('89504e47');
  const isWebp = buf.toString('utf8', 8, 12) === 'WEBP';
  console.log(`${f} (${stat.size} bytes) -> hex: ${hex.slice(0, 16)} | validJpg: ${isJpg} | validPng: ${isPng} | webp: ${isWebp}`);
}
