import fs from 'fs';
import path from 'path';

const SCRIPT_PATH = path.resolve('scripts/generate_official_report.js');
let content = fs.readFileSync(SCRIPT_PATH, 'utf8');

// Replace supervisor name
content = content.replace(/Monsieur Yassine MANSOURI/g, 'Monsieur Charaf-Eddine MLILI');
content = content.replace(/M\.\s*Yassine\s+MANSOURI/g, 'M. Charaf-Eddine MLILI');
content = content.replace(/Yassine\s+MANSOURI/g, 'Charaf-Eddine MLILI');
content = content.replace(/Yassine\s+Mansouri/g, 'Charaf-Eddine Mlili');

// Replace duration
content = content.replace(/six semaines \(du 01 Juillet 2025 au 12 Août 2025\)/g, 'deux mois (du 01 Juillet 2025 au 31 Août 2025)');
content = content.replace(/Du 01 Juillet 2025 au 12 Août 2025 \(6 semaines\)/g, 'Du 01 Juillet 2025 au 31 Août 2025 (2 mois / 8 semaines)');
content = content.replace(/du 01 Juillet 2025 au 12 Août 2025/g, 'du 01 Juillet 2025 au 31 Août 2025');
content = content.replace(/Au cours de ces six semaines/g, 'Au cours de ces deux mois');
content = content.replace(/de six semaines/g, 'de deux mois');
content = content.replace(/d'une durée de six semaines/g, 'd\'une durée de deux mois (huit semaines)');
content = content.replace(/d’une durée de six semaines/g, 'd’une durée de deux mois (huit semaines)');
content = content.replace(/trois sprints itératifs de deux semaines chacun/g, 'quatre sprints itératifs de deux semaines chacun (huit semaines au total)');
content = content.replace(/trois sprints de deux semaines/g, 'quatre sprints de deux semaines');
content = content.replace(/\(6 semaines\)/g, '(2 mois / 8 semaines)');
content = content.replace(/6 semaines/g, '2 mois (8 semaines)');

fs.writeFileSync(SCRIPT_PATH, content, 'utf8');
console.log('generate_official_report.js patched successfully!');
