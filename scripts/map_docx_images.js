import fs from 'fs';

const rels = fs.readFileSync('scripts/temp_docx/word/_rels/document.xml.rels', 'utf8');
const doc = fs.readFileSync('scripts/temp_docx/word/document.xml', 'utf8');

const relMatches = [...rels.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)];
const rMap = {};
relMatches.forEach(m => {
  rMap[m[1]] = m[2];
});

// Let's find every paragraph containing <w:drawing>
const pRegex = /<w:p\b[^>]*>[\s\S]*?<\/w:p>/g;
const paragraphs = doc.match(pRegex) || [];

let figIndex = 0;
paragraphs.forEach((p, idx) => {
  if (p.includes('<w:drawing>')) {
    figIndex++;
    const embedMatch = p.match(/r:embed="([^"]+)"/);
    const rId = embedMatch ? embedMatch[1] : null;
    const target = rId ? rMap[rId] : null;

    // Next paragraph often contains the caption
    let nextCaption = '';
    for (let j = idx + 1; j < Math.min(idx + 4, paragraphs.length); j++) {
      const clean = paragraphs[j].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (clean.includes('Figure') || clean.length > 0) {
        nextCaption = clean;
        break;
      }
    }

    // Previous paragraph
    let prevText = '';
    if (idx > 0) {
      prevText = paragraphs[idx - 1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(-100);
    }

    console.log(`\nItem ${figIndex}: rId=${rId} -> ${target}`);
    console.log(`Prev text: ${prevText}`);
    console.log(`Caption/Next: ${nextCaption}`);
  }
});
