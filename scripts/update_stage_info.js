import fs from 'fs';
import path from 'path';

const DOC_XML_PATH = path.resolve('scripts/temp_docx/word/document.xml');
let docXml = fs.readFileSync(DOC_XML_PATH, 'utf8');

console.log('Original length:', docXml.length);

// 1. Director / Supervisor replacements
// M/Mme Nom Prénom -> M. Charaf-Eddine MLILI
docXml = docXml.replace(/M\/Mme Nom Prénom/g, 'M. Charaf-Eddine MLILI');
docXml = docXml.replace(/M\.\s*Yassine\s+MANSOURI/g, 'M. Charaf-Eddine MLILI');
docXml = docXml.replace(/Yassine\s+MANSOURI/g, 'Charaf-Eddine MLILI');
docXml = docXml.replace(/Yassine\s+Mansouri/g, 'Charaf-Eddine Mlili');

// 2. Stage duration replacements (6 semaines -> 2 mois / 8 semaines)
docXml = docXml.replace(/ces six semaines/g, 'ces deux mois');
docXml = docXml.replace(/de six semaines/g, 'de deux mois');
docXml = docXml.replace(/d’une durée de six semaines/g, 'd’une durée de deux mois (huit semaines)');
docXml = docXml.replace(/d'une durée de six semaines/g, 'd\'une durée de deux mois (huit semaines)');
docXml = docXml.replace(/du 01 juillet au 12 août 2025/g, 'du 01 juillet au 31 août 2025');
docXml = docXml.replace(/Du 01 juillet au 12 août 2025/g, 'Du 01 juillet au 31 août 2025');
docXml = docXml.replace(/du 01\/07 au 12\/08\/2025/g, 'du 01/07 au 31/08/2025');
docXml = docXml.replace(/sur les six semaines/g, 'sur les huit semaines (deux mois)');
docXml = docXml.replace(/trois Sprints de deux semaines/g, 'quatre Sprints de deux semaines (soit huit semaines sur deux mois)');
docXml = docXml.replace(/trois Sprints/g, 'quatre Sprints');
docXml = docXml.replace(/3 Sprints/g, '4 Sprints');
docXml = docXml.replace(/\(6 semaines\)/g, '(2 mois / 8 semaines)');
docXml = docXml.replace(/6 semaines/g, '2 mois (8 semaines)');

// Cover page period check
docXml = docXml.replace(/Du 15\/07\/2026 au 15\/09\/2026/g, 'Du 01/07/2025 au 31/08/2025 (2 mois)');

fs.writeFileSync(DOC_XML_PATH, docXml, 'utf8');
console.log('Updated length:', docXml.length);
console.log('Stage info text updated successfully!');
