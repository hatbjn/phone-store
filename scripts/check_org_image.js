import fs from 'fs';

const buf = fs.readFileSync('scripts/temp_docx/word/media/image4.png');
console.log('image4.png length:', buf.length);

// Let's check some pixel colors by reading header or using simple sampling
// Or we can save a copy to workspace so we can inspect it
fs.copyFileSync('scripts/temp_docx/word/media/image4.png', 'screenshots/original_organigramme.png');
console.log('Copied to screenshots/original_organigramme.png');
