import fs from 'fs';

const docXml = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');

// Find table containing "Calendrier de réalisation"
const tableRegex = /<w:tbl\b[\s\S]*?<\/w:tbl>/g;
const tables = docXml.match(tableRegex) || [];

console.log(`Found ${tables.length} tables.`);

tables.forEach((tbl, idx) => {
  const clean = tbl.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.includes('Calendrier de réalisation') || (clean.includes('S1') && clean.includes('S6'))) {
    console.log(`\nTable ${idx + 1} matches Tableau 2.2!`);
    console.log(`Table XML length: ${tbl.length}`);
    const rows = tbl.match(/<w:tr\b[\s\S]*?<\/w:tr>/g) || [];
    console.log(`Row count: ${rows.length}`);
    rows.forEach((r, rIdx) => {
      const rClean = r.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(` Row ${rIdx + 1}: ${rClean}`);
    });
  }
});
