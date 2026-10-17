import fs from 'fs';
import path from 'path';

function getPngDimensions(buffer) {
  if (buffer.length < 24) return null;
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
    return null;
  }
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

console.log('=== Modele docx images dimensions ===');
const docxMediaDir = 'scripts/temp_docx/word/media';
fs.readdirSync(docxMediaDir).filter(f => f.endsWith('.png')).forEach(f => {
  const buf = fs.readFileSync(path.join(docxMediaDir, f));
  const dim = getPngDimensions(buf);
  console.log(`${f}: ${dim ? `${dim.width}x${dim.height}` : 'unknown'}, size: ${(buf.length / 1024).toFixed(1)} KB`);
});

console.log('\n=== screenshots directory dimensions ===');
const ssDir = 'screenshots';
fs.readdirSync(ssDir).filter(f => f.endsWith('.png')).forEach(f => {
  const buf = fs.readFileSync(path.join(ssDir, f));
  const dim = getPngDimensions(buf);
  console.log(`${f}: ${dim ? `${dim.width}x${dim.height}` : 'unknown'}, size: ${(buf.length / 1024).toFixed(1)} KB`);
});
