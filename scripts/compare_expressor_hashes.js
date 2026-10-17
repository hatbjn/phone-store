import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function hashFile(p) {
  if (!fs.existsSync(p)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

console.log('--- Checking hash matches between temp_expressor_docx and screenshots ---');
const expressorMediaDir = 'scripts/temp_expressor_docx/word/media';
const screenshotsDir = 'screenshots';

const screenshotFiles = fs.readdirSync(screenshotsDir);
const screenshotHashes = {};
screenshotFiles.forEach(f => {
  screenshotHashes[hashFile(path.join(screenshotsDir, f))] = f;
});

const expressorFiles = fs.readdirSync(expressorMediaDir);
expressorFiles.forEach(f => {
  const h = hashFile(path.join(expressorMediaDir, f));
  console.log(`${f} matches screenshot: ${screenshotHashes[h] || 'NONE'}`);
});
