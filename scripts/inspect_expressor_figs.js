import fs from 'fs';

const relsXml = fs.readFileSync('scripts/temp_expressor_docx/word/_rels/document.xml.rels', 'utf8');
const docXml = fs.readFileSync('scripts/temp_expressor_docx/word/document.xml', 'utf8');

const relMatches = [...relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)];
const rMap = {};
relMatches.forEach(m => {
  rMap[m[1]] = m[2];
});

const pRegex = /<w:p\b[^>]*>[\s\S]*?<\/w:p>/g;
const pList = docXml.match(pRegex) || [];

pList.forEach((p, idx) => {
  if (p.includes('<w:drawing>')) {
    const m = p.match(/r:embed="([^"]+)"/);
    const target = m ? rMap[m[1]] : null;
    let caption = '';
    for (let j = idx + 1; j < Math.min(idx + 4, pList.length); j++) {
      const clean = pList[j].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean.includes('Figure') || clean.length > 0) {
        caption = clean;
        break;
      }
    }
    console.log(`Embed: ${m ? m[1] : null} -> ${target} | Caption: ${caption}`);
  }
});
