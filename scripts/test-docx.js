import * as docx from 'docx';
console.log('Docx loaded successfully. Classes available:', Object.keys(docx).filter(k => k.endsWith('Run') || k.endsWith('Paragraph') || k === 'Document' || k === 'Packer'));
