import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const MEDIA_DIR = path.resolve('scripts/temp_docx/word/media');
const DOC_XML_PATH = path.resolve('scripts/temp_docx/word/document.xml');
const RELS_XML_PATH = path.resolve('scripts/temp_docx/word/_rels/document.xml.rels');

// Mapping of image files in temp_docx/word/media to replacement sources
const replacements = {
  'image5.png': 'screenshots/architecture_3tiers.png',
  'image6.png': 'screenshots/diagramme_gantt.png',
  'image7.png': 'screenshots/mcd_relational_schema.png',
  'image8.png': 'screenshots/01_accueil.png',
  'image9.png': 'screenshots/02_catalogue_smartphones.png',
  'image10.png': 'screenshots/03_fiche_produit.png',
  'image11.png': 'screenshots/10_tunnel_commande.png',
  'image12.png': 'screenshots/06_authentification.png',
  'image13.png': 'screenshots/09_mes_commandes.png',
  'image14.png': 'screenshots/09_mes_adresses.png',
  'image15.png': 'screenshots/08_tableau_de_bord_admin.png',
  'image16.png': 'screenshots/11_favoris_clients.png'
};

function getPngDimensions(buf) {
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504E47) return null;
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  return { w, h };
}

// 1. Copy replacement images to media dir
console.log('--- Step 1: Copying replacement images ---');
const dimensions = {};
for (const [imgName, srcPath] of Object.entries(replacements)) {
  const fullSrc = path.resolve(srcPath);
  if (!fs.existsSync(fullSrc)) {
    console.error(`ERROR: Missing replacement source: ${fullSrc}`);
    process.exit(1);
  }
  const buf = fs.readFileSync(fullSrc);
  const dim = getPngDimensions(buf);
  dimensions[imgName] = dim;
  const targetPath = path.join(MEDIA_DIR, imgName);
  fs.writeFileSync(targetPath, buf);
  console.log(`Replaced ${imgName} with ${srcPath} (${dim ? `${dim.w}x${dim.h}` : 'dim unknown'}, ${(buf.length / 1024).toFixed(1)} KB)`);
}

// 2. Adjust cx and cy in document.xml for proportional display
console.log('\n--- Step 2: Adjusting image extents in document.xml ---');
let docXml = fs.readFileSync(DOC_XML_PATH, 'utf8');
const relsXml = fs.readFileSync(RELS_XML_PATH, 'utf8');

const relMatches = [...relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)];
const rMap = {};
relMatches.forEach(m => {
  rMap[m[1]] = m[2]; // e.g. rId36 -> media/image8.png
});

// For each drawing element in document.xml
// Pattern: <w:drawing> ... <wp:extent cx="X" cy="Y"/> ... <a:ext cx="X" cy="Y"/> ... r:embed="rId..." ... </w:drawing>
const drawingRegex = /<w:drawing>[\s\S]*?<\/w:drawing>/g;
let updateCount = 0;

docXml = docXml.replace(drawingRegex, (drawingXml) => {
  const embedMatch = drawingXml.match(/r:embed="([^"]+)"/);
  if (!embedMatch) return drawingXml;
  const rId = embedMatch[1];
  const target = rMap[rId];
  if (!target) return drawingXml;
  const imgName = path.basename(target);

  if (dimensions[imgName] && dimensions[imgName].w && dimensions[imgName].h) {
    const { w, h } = dimensions[imgName];
    // Standard target width:
    // For screenshots: ~12.44 cm (4476750 EMU)
    // For diagrams (Gantt, Architecture, MCD): up to 14.8 cm (5328000 EMU)
    let targetCx = 4476750;
    if (imgName === 'image5.png' || imgName === 'image6.png' || imgName === 'image7.png') {
      targetCx = 5328000;
    }
    const targetCy = Math.round(targetCx * (h / w));

    let updatedDrawing = drawingXml.replace(/<wp:extent\s+cx="\d+"\s+cy="\d+"/g, `<wp:extent cx="${targetCx}" cy="${targetCy}"`);
    updatedDrawing = updatedDrawing.replace(/<a:ext\s+cx="\d+"\s+cy="\d+"/g, `<a:ext cx="${targetCx}" cy="${targetCy}"`);
    updateCount++;
    console.log(`Updated extent for ${imgName}: cx=${targetCx}, cy=${targetCy} (ratio ${ (w/h).toFixed(2) })`);
    return updatedDrawing;
  }
  return drawingXml;
});

fs.writeFileSync(DOC_XML_PATH, docXml, 'utf8');
console.log(`Updated ${updateCount} drawings in document.xml.`);

// 3. Repack temp_docx into docx files
console.log('\n--- Step 3: Repacking DOCX archive ---');
const zipScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$source = '${path.resolve('scripts/temp_docx').replace(/\\/g, '/')}'
$destTemp = '${path.resolve('scripts/temp_repacked.zip').replace(/\\/g, '/')}'
if (Test-Path $destTemp) { Remove-Item -Force $destTemp }
[System.IO.Compression.ZipFile]::CreateFromDirectory($source, $destTemp, [System.IO.Compression.CompressionLevel]::Optimal, $false)
`;

fs.writeFileSync('scripts/zip_docx.ps1', zipScript);
execSync('powershell -ExecutionPolicy Bypass -File scripts/zip_docx.ps1', { stdio: 'inherit' });

const destFiles = [
  'C:\\Users\\JOKER\\Downloads\\Modele_rapport_stage_Technicien_informatique (1)_UPDATED.docx',
  path.resolve('Modele_rapport_stage_Technicien_informatique (1).docx'),
  'C:\\Users\\JOKER\\.gemini\\antigravity\\brain\\2da9973e-ead5-4298-9305-ce83d9b6848d\\Modele_rapport_stage_Technicien_informatique (1).docx',
  'C:\\Users\\JOKER\\Downloads\\Modele_rapport_stage_Technicien_informatique (1).docx'
];

const repackedZip = path.resolve('scripts/temp_repacked.zip');
for (const dest of destFiles) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  try {
    fs.copyFileSync(repackedZip, dest);
    console.log(`Successfully written to: ${dest} (${(fs.statSync(dest).size / 1024 / 1024).toFixed(2)} MB)`);
  } catch (err) {
    if (err.code === 'EBUSY') {
      console.warn(`WARNING: ${dest} is currently opened/locked by Microsoft Word. A duplicate with the latest screenshots was saved to Modele_rapport_stage_Technicien_informatique (1)_UPDATED.docx`);
    } else {
      console.error(`Error copying to ${dest}:`, err.message);
    }
  }
}

console.log('\nAll operations completed successfully!');
