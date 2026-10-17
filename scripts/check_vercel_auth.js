import fs from 'fs';
import path from 'path';

const home = 'C:\\Users\\JOKER';
const vercelDirs = [
  path.join(home, 'AppData', 'Roaming', 'com.vercel.cli'),
  path.join(home, '.vercel'),
  path.join(home, 'AppData', 'Local', 'com.vercel.cli')
];

vercelDirs.forEach(d => {
  if (fs.existsSync(d)) {
    console.log('Found directory:', d);
    try {
      console.log('Files:', fs.readdirSync(d));
      const authFile = path.join(d, 'auth.json');
      if (fs.existsSync(authFile)) {
        const auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
        console.log('auth.json has token:', !!auth.token);
      }
    } catch (e) {
      console.log('Error reading:', e.message);
    }
  } else {
    console.log('Not found:', d);
  }
});
