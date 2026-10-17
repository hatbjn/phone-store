import fs from 'fs';
import path from 'path';

fs.readdirSync('.').forEach(f => {
  if (f === 'node_modules' || f === '.git') return;
  const stat = fs.statSync(f);
  if (stat.isDirectory()) {
    console.log(`[DIR] ${f}`);
  } else {
    console.log(`[FILE] ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
  }
});

if (fs.existsSync('scripts')) {
  console.log('\n--- In scripts/ ---');
  fs.readdirSync('scripts').forEach(f => {
    const stat = fs.statSync(path.join('scripts', f));
    if (stat.isDirectory()) {
      console.log(`[DIR] scripts/${f}`);
    }
  });
}
