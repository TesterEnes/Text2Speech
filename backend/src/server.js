require('dotenv').config({ path: '../../.env' });
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

// Frontend build'ini sunmak için statik middleware
app.use(express.static(path.join(__dirname, '../../../frontend/build')));

// Tüm istekleri React app'e yönlendir, böylece client-side routing çalışır
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Backend sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});
