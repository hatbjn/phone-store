import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const testScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$dest = '${path.resolve('scripts/temp_verify').replace(/\\/g, '/')}'
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
[System.IO.Compression.ZipFile]::ExtractToDirectory('${path.resolve('Modele_rapport_stage_Technicien_informatique (1).docx').replace(/\\/g, '/')}', $dest)
`;

fs.writeFileSync('scripts/verify_docx.ps1', testScript);
execSync('powershell -ExecutionPolicy Bypass -File scripts/verify_docx.ps1', { stdio: 'inherit' });

const docXml = fs.readFileSync('scripts/temp_verify/word/document.xml', 'utf8');
console.log(`Verification SUCCESS: document.xml length = ${docXml.length} chars.`);

const media = fs.readdirSync('scripts/temp_verify/word/media');
console.log(`Media files in repacked docx (${media.length}):`);
media.forEach(m => {
  const sz = fs.statSync(path.join('scripts/temp_verify/word/media', m)).size;
  console.log(` - ${m}: ${(sz / 1024).toFixed(1)} KB`);
});
