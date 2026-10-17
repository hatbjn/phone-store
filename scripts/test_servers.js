try {
  const r1 = await fetch('http://localhost:5173');
  console.log('Vite status:', r1.status);
} catch (e) {
  console.log('Vite error:', e.message);
}

try {
  const r2 = await fetch('http://localhost:5000/api/products');
  console.log('API status:', r2.status);
} catch (e) {
  console.log('API error:', e.message);
}
