import fs from 'fs';
import path from 'path';

const dir = path.resolve('public/products');
for (const f of fs.readdirSync(dir)) {
  const buf = fs.readFileSync(path.join(dir, f));
  console.log(`${f} | size: ${buf.length} | first4: ${buf.subarray(0, 4).toString('hex')} | last4: ${buf.subarray(buf.length - 4).toString('hex')}`);
}
