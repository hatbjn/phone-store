import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function hashFile(p) {
  if (!fs.existsSync(p)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

console.log('--- Checking hash matches between temp_docx and screenshots ---');
const docxMediaDir = 'scripts/temp_docx/word/media';
const screenshotsDir = 'screenshots';

const docxFiles = fs.readdirSync(docxMediaDir);
const screenshotFiles = fs.readdirSync(screenshotsDir);

const screenshotHashes = {};
screenshotFiles.forEach(f => {
  screenshotHashes[hashFile(path.join(screenshotsDir, f))] = f;
});

docxFiles.forEach(f => {
  const h = hashFile(path.join(docxMediaDir, f));
  console.log(`${f} matches screenshot: ${screenshotHashes[h] || 'NONE'}`);
});
