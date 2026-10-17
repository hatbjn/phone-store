import fs from 'fs';
import path from 'path';

// Let's create an html file to preview all images in temp_docx/word/media and temp_expressor_docx/word/media side by side
const tempDocxMedia = 'scripts/temp_docx/word/media';
const files = fs.readdirSync(tempDocxMedia).filter(f => f.endsWith('.png'));

let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Images preview</title>
<style>
body { font-family: sans-serif; background: #1e1e2f; color: #fff; padding: 20px; }
.card { background: #2a2a40; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
img { max-width: 600px; display: block; margin-top: 10px; border: 1px solid #444; border-radius: 4px; }
</style>
</head><body>
<h1>Modele docx images</h1>
`;

files.forEach(f => {
  const p = path.join(tempDocxMedia, f);
  const b64 = fs.readFileSync(p).toString('base64');
  html += `<div class="card">
    <h3>${f}</h3>
    <img src="data:image/png;base64,${b64}">
  </div>`;
});

html += `</body></html>`;
fs.writeFileSync('scripts/preview_temp_docx.html', html);
console.log('Preview written to scripts/preview_temp_docx.html');
