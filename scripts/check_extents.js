import fs from 'fs';

const docXml = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');
const relsXml = fs.readFileSync('scripts/temp_docx/word/_rels/document.xml.rels', 'utf8');

const relMatches = [...relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)];
const rMap = {};
relMatches.forEach(m => {
  rMap[m[1]] = m[2];
});

const drawings = docXml.split('<w:drawing>');
for (let i = 1; i < drawings.length; i++) {
  const d = drawings[i].split('</w:drawing>')[0];
  const rIdMatch = d.match(/r:embed="([^"]+)"/);
  const extentMatch = d.match(/<wp:extent cx="([^"]+)" cy="([^"]+)"/);
  const rId = rIdMatch ? rIdMatch[1] : null;
  const target = rId ? rMap[rId] : null;
  const cx = extentMatch ? parseInt(extentMatch[1]) : null;
  const cy = extentMatch ? parseInt(extentMatch[2]) : null;

  // In EMUs: 1 inch = 914400 EMUs, 1 cm = 360000 EMUs
  const widthCm = cx ? (cx / 360000).toFixed(2) : '-';
  const heightCm = cy ? (cy / 360000).toFixed(2) : '-';
  console.log(`Drawing ${i}: ${target} -> ${widthCm} cm x ${heightCm} cm (cx=${cx}, cy=${cy})`);
}
