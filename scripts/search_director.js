import fs from 'fs';

const docXml = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');
const pList = docXml.match(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g) || [];

console.log('--- Search director / supervisor names ---');
pList.forEach((p, idx) => {
  const clean = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = clean.toLowerCase();
  if (
    lower.includes('mansouri') ||
    lower.includes('yassine') ||
    lower.includes('directeur') ||
    lower.includes('superviseur') ||
    lower.includes('gérant') ||
    lower.includes('gerant') ||
    lower.includes('nom prénom') ||
    lower.includes('nom prenom')
  ) {
    console.log(`[P ${idx + 1}]: ${clean}`);
  }
});
