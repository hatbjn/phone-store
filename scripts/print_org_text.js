import fs from 'fs';

const docXml = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');
const pList = docXml.match(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g) || [];

pList.forEach((p, idx) => {
  const clean = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.includes('Figure 1.1') || clean.includes('Organigramme') || clean.includes('organigramme')) {
    console.log(`[P ${idx + 1}]: ${clean}`);
    for (let j = Math.max(0, idx - 2); j < Math.min(pList.length, idx + 8); j++) {
      console.log(`  P ${j + 1}: ${pList[j].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`);
    }
  }
});
