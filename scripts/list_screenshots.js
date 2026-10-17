import fs from 'fs';
import path from 'path';

const dir = 'screenshots';
fs.readdirSync(dir).forEach(f => {
  const stat = fs.statSync(path.join(dir, f));
  console.log(`${f}: ${(stat.size / 1024).toFixed(1)} KB`);
});
