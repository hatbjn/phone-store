import fs from 'fs';

// Let's see if image13, 14, 15, 16 are old screenshots or if we can see their visual content
console.log('image13 size:', fs.statSync('scripts/temp_docx/word/media/image13.png').size);
console.log('image14 size:', fs.statSync('scripts/temp_docx/word/media/image14.png').size);
console.log('image15 size:', fs.statSync('scripts/temp_docx/word/media/image15.png').size);
console.log('image16 size:', fs.statSync('scripts/temp_docx/word/media/image16.png').size);
console.log('image8 size:', fs.statSync('scripts/temp_docx/word/media/image8.png').size);
console.log('image9 size:', fs.statSync('scripts/temp_docx/word/media/image9.png').size);
console.log('image10 size:', fs.statSync('scripts/temp_docx/word/media/image10.png').size);
