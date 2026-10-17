import fs from 'fs';
import path from 'path';

function getDirSize(dir) {
  let total = 0;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git') continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      total += getDirSize(full);
    } else {
      total += stat.size;
    }
  }
  return total;
}

console.log('Total non-node_modules size:', (getDirSize('.') / 1024 / 1024).toFixed(2), 'MB');
