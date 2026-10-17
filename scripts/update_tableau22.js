import fs from 'fs';
import path from 'path';

const DOC_XML_PATH = path.resolve('scripts/temp_docx/word/document.xml');
let docXml = fs.readFileSync(DOC_XML_PATH, 'utf8');

// Find Table 4 (Tableau 2.2)
const tableRegex = /<w:tbl\b[\s\S]*?<\/w:tbl>/g;
const matches = [...docXml.matchAll(tableRegex)];

let targetTbl = null;
for (const m of matches) {
  const clean = m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.includes('S1') && clean.includes('S6') && clean.includes('Semaine')) {
    targetTbl = m[0];
    break;
  }
}

if (!targetTbl) {
  console.error('Table 2.2 not found!');
  process.exit(1);
}

// Extract rows
const rows = targetTbl.match(/<w:tr\b[\s\S]*?<\/w:tr>/g);
const headerRow = rows[0];
const sampleDataRow = rows[1]; // template for table cell styling

function makeRow(sId, dates, taches, livrable, avancement) {
  let r = sampleDataRow;
  // Replace cell texts
  // Cell 1: S1 -> sId
  // Cell 2: Dates -> dates
  // Cell 3: Tâches -> taches
  // Cell 4: Livrable -> livrable
  // Cell 5: Avancement -> avancement
  const cells = r.match(/<w:tc\b[\s\S]*?<\/w:tc>/g);
  
  function replaceCellText(cellXml, newText) {
    // Keep cell properties <w:tcPr>...</w:tcPr> and replace paragraphs or runs
    const tcPrMatch = cellXml.match(/<w:tcPr\b[\s\S]*?<\/w:tcPr>/);
    const tcPr = tcPrMatch ? tcPrMatch[0] : '';
    return `<w:tc>${tcPr}<w:p><w:pPr><w:spacing w:line="260" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t>${newText}</w:t></w:r></w:p></w:tc>`;
  }

  const newC1 = replaceCellText(cells[0], sId);
  const newC2 = replaceCellText(cells[1], dates);
  const newC3 = replaceCellText(cells[2], taches);
  const newC4 = replaceCellText(cells[3], livrable);
  const newC5 = replaceCellText(cells[4], avancement);

  const trPrMatch = r.match(/<w:trPr\b[\s\S]*?<\/w:trPr>/);
  const trPr = trPrMatch ? trPrMatch[0] : '';

  return `<w:tr>${trPr}${newC1}${newC2}${newC3}${newC4}${newC5}</w:tr>`;
}

const s1Row = makeRow('S1', '01/07 – 07/07', 'Accueil, analyse du besoin, recherche documentaire, cadrage technique', 'Cahier des charges, Product Backlog', '100 %');
const s2Row = makeRow('S2', '08/07 – 14/07', 'Modélisation des données MySQL (10 tables), MCD/MPD, script SQL', 'Schéma relationnel, script SQL, seed initial', '100 %');
const s3Row = makeRow('S3', '15/07 – 21/07', 'Développement de l’API REST Express, sécurité hachage scrypt, sessions', 'API v1 (auth, sessions, upload)', '100 %');
const s4Row = makeRow('S4', '22/07 – 28/07', 'Intégration frontend React 19/Vite, UI Dark Luxury Tech, catalogues', 'Pages Home, Shop, filtres marques &amp; prix', '100 %');
const s5Row = makeRow('S5', '29/07 – 04/08', 'Fiche produit détaillée, sélecteurs variantes, panier interactif', 'Fiche ProductDetails, CartPage, promos', '100 %');
const s6Row = makeRow('S6', '05/08 – 11/08', 'Tunnel de commande sécurisé, paiement COD, carnet d’adresses sans overlap', 'Checkout, Orders, gestion multi-adresses', '100 %');
const s7Row = makeRow('S7', '12/08 – 18/08', 'Console d’Administration Back-Office, KPIs financiers et favoris marketing', 'Dashboard Admin, métriques en temps réel', '100 %');
const s8Row = makeRow('S8', '19/08 – 31/08', 'Recette technique, tests d’intégration, optimisation WebP/SQL, rapport final', 'Plateforme validée, rapport académique', '100 %');

const tblPrMatch = targetTbl.match(/<w:tblPr\b[\s\S]*?<\/w:tblPr>/);
const tblGridMatch = targetTbl.match(/<w:tblGrid\b[\s\S]*?<\/w:tblGrid>/);
const tblPr = tblPrMatch ? tblPrMatch[0] : '';
const tblGrid = tblGridMatch ? tblGridMatch[0] : '';

const newTableXml = `<w:tbl>${tblPr}${tblGrid}${headerRow}${s1Row}${s2Row}${s3Row}${s4Row}${s5Row}${s6Row}${s7Row}${s8Row}</w:tbl>`;

docXml = docXml.replace(targetTbl, newTableXml);
fs.writeFileSync(DOC_XML_PATH, docXml, 'utf8');
console.log('Table 2.2 successfully updated to 8 weeks (2 months)!');
