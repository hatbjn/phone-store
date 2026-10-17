import { execSync } from 'child_process';

console.log('--- Checking Git Config ---');
try {
  const user = execSync('git config --global user.name', { encoding: 'utf8' }).trim();
  const email = execSync('git config --global user.email', { encoding: 'utf8' }).trim();
  console.log('Git user:', user);
  console.log('Git email:', email);
} catch (e) {
  console.log('Git config error:', e.message);
}

console.log('\n--- Checking GitHub CLI Auth ---');
try {
  const out = execSync('gh auth status', { encoding: 'utf8', timeout: 6000, stdio: ['pipe', 'pipe', 'pipe'] });
  console.log('GH stdout:', out);
} catch (e) {
  console.log('GH status output/error:', e.stdout || '', e.stderr || '', e.message);
}

console.log('\n--- Checking Vercel CLI Auth ---');
try {
  const out = execSync('npx vercel whoami', { encoding: 'utf8', timeout: 6000, stdio: ['pipe', 'pipe', 'pipe'] });
  console.log('Vercel whoami:', out);
} catch (e) {
  console.log('Vercel status output/error:', e.stdout || '', e.stderr || '', e.message);
}
