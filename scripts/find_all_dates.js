import fs from 'fs';

const docXml = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');
const pList = docXml.match(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g) || [];

pList.forEach((p, idx) => {
  const clean = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = clean.toLowerCase();
  if (
    lower.includes('12 août') ||
    lower.includes('12 aout') ||
    lower.includes('01 juillet') ||
    lower.includes('1er juillet') ||
    lower.includes('semaine') ||
    lower.includes('mois') ||
    lower.includes('durée')
  ) {
    console.log(`[P ${idx + 1}]: ${clean}`);
  }
});
