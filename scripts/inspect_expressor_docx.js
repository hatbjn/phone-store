import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const docxPath = 'Rapport_Stage_Technicien_EXPRESSOR.docx';
if (fs.existsSync(docxPath)) {
  const zip = new AdmZip(docxPath);
  const outDir = 'scripts/temp_expressor_media';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const entries = zip.getEntries();
  entries.forEach(e => {
    if (e.entryName.startsWith('word/media/')) {
      const fileName = path.basename(e.entryName);
      fs.writeFileSync(path.join(outDir, fileName), e.getData());
      console.log(`Extracted: ${fileName} (${(e.header.size / 1024).toFixed(1)} KB)`);
    }
  });

  // Also read document.xml to see which media is which figure
  const docXml = zip.readAsText('word/document.xml');
  const relsXml = zip.readAsText('word/_rels/document.xml.rels');
  
  const relMatches = [...relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)];
  const rMap = {};
  relMatches.forEach(m => {
    rMap[m[1]] = m[2];
  });

  // Find paragraphs with drawings
  const pRegex = /<w:p\b[^>]*>[\s\S]*?<\/w:p>/g;
  const pList = docXml.match(pRegex) || [];
  pList.forEach((p, idx) => {
    if (p.includes('<w:drawing>')) {
      const m = p.match(/r:embed="([^"]+)"/);
      const target = m ? rMap[m[1]] : null;
      let caption = '';
      for (let j = idx + 1; j < Math.min(idx + 3, pList.length); j++) {
        const clean = pList[j].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (clean.includes('Figure') || clean.length > 0) {
          caption = clean;
          break;
        }
      }
      console.log(`Expressor docx drawing: embed=${m ? m[1] : null} -> ${target} | Caption: ${caption}`);
    }
  });
} else {
  console.log('Rapport_Stage_Technicien_EXPRESSOR.docx not found!');
}
