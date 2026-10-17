import http from 'http';

function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, status: res.statusCode, headers: res.headers });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

const urls = [
  'http://localhost:5173/products/iphone-16-pro.jpg',
  'http://localhost:5173/products/iphone-15.jpg',
  'http://localhost:5173/products/realme-12-pro.jpg',
  'http://localhost:5173/products/chargeur-20w.jpg',
  'http://localhost:5173/products/cable-usb-c.jpg',
  'http://localhost:5173/products/coque-magsafe.jpg',
  'http://localhost:5173/products/galaxy-a55.jpg',
  'http://localhost:5173/products/galaxy-s24-ultra.jpg',
  'http://localhost:5173/products/montre-connectee.jpg',
  'http://localhost:5173/products/power-bank.jpg',
  'http://localhost:5173/products/support-voiture.jpg',
  'http://localhost:5173/products/protection-ecran.jpg',
  'http://localhost:5173/products/redmi-note-13.jpg',
];

for (const u of urls) {
  console.log(await check(u));
}
process.exit(0);
