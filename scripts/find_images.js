import fs from 'fs';

const content = fs.readFileSync('scripts/generate_official_report.js', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('getImageBuffer') || line.includes('Figure ')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
