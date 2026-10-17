import fs from 'fs';
import path from 'path';

const mediaDir = 'scripts/temp_docx/word/media';
const files = fs.readdirSync(mediaDir);

files.forEach(f => {
  const stat = fs.statSync(path.join(mediaDir, f));
  console.log(`${f}: ${(stat.size / 1024).toFixed(1)} KB`);
});
