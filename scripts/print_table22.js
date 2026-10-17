import fs from 'fs';

const docXml = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');
const pList = docXml.match(/<w:p\b[^>]*>[\s\S]*?<\/w:p>/g) || [];

for (let i = 260; i < Math.min(300, pList.length); i++) {
  const clean = pList[i].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length > 0) {
    console.log(`[P ${i + 1}]: ${clean}`);
  }
}
