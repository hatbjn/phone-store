import fs from 'fs';

const docXml = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');

// Match sentences or paragraphs containing "6" or "semaine" or "Août" or "durée"
const pList = docXml.match(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g) || [];

console.log(`Total paragraphs: ${pList.length}`);

pList.forEach((p, idx) => {
  const clean = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (
    clean.includes('6 semaines') ||
    clean.includes('six semaines') ||
    clean.includes('12 Août') ||
    clean.includes('12 août') ||
    clean.includes('6 Semaines') ||
    clean.includes('(6 semaines)') ||
    clean.includes('6 sem') ||
    clean.includes('Semaine 1') ||
    clean.includes('Semaine 6') ||
    clean.includes('S1') ||
    clean.includes('durée de 6')
  ) {
    console.log(`\n[P ${idx + 1}]: ${clean}`);
  }
});
