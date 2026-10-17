import fs from 'fs';

const rels = fs.readFileSync('scripts/temp_docx/word/_rels/document.xml.rels', 'utf8');
const doc = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');

const relMatches = [...rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)];
const rMap = {};
relMatches.forEach(m => {
  rMap[m[1]] = m[2];
});

// Search for drawing elements and surrounding text in document.xml
// Let's split doc by <w:drawing>
const parts = doc.split('<w:drawing>');
console.log(`Found ${parts.length - 1} drawings.`);

for (let i = 1; i < parts.length; i++) {
  const drawingPart = parts[i].split('</w:drawing>')[0];
  const afterDrawing = parts[i].split('</w:drawing>')[1].slice(0, 500);
  const beforeDrawing = parts[i-1].slice(-500);

  const embedMatch = drawingPart.match(/r:embed="([^"]+)"/);
  const rId = embedMatch ? embedMatch[1] : null;
  const target = rId ? rMap[rId] : null;

  // Extract clean text before and after
  const cleanBefore = beforeDrawing.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(-150);
  const cleanAfter = afterDrawing.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);

  console.log(`\n--- DRAWING ${i} ---`);
  console.log(`rId: ${rId} -> Target: ${target}`);
  console.log(`Text before: ...${cleanBefore}`);
  console.log(`Text after: ${cleanAfter}...`);
}
