const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const cardImages = path.join(root, 'card-images');
const files = [
  { name: 'hero-card-cover.png', maxWidth: 1200, quality: 80 },
  { name: 'profile.png', maxWidth: 400, quality: 85 },
  { name: 'portfolio-coffee-thumb.png', maxWidth: 800, quality: 80 },
  { name: 'portfolio-studio-thumb.png', maxWidth: 800, quality: 80 }
];

async function run() {
  for (const f of files) {
    const src = path.join(cardImages, f.name);
    if (!fs.existsSync(src)) continue;
    const ext = path.extname(f.name);
    const base = path.basename(f.name, ext);
    const out = path.join(cardImages, base + '.jpg');
    await sharp(src)
      .resize(f.maxWidth, null, { withoutEnlargement: true })
      .jpeg({ quality: f.quality })
      .toFile(out);
    const oldSize = (fs.statSync(src).size / 1024).toFixed(0);
    const newSize = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(f.name + ' -> ' + base + '.jpg  ' + oldSize + ' KB -> ' + newSize + ' KB');
  }
  console.log('Done. Update index.html to use .jpg for these images.');
}

run().catch(e => { console.error(e); process.exit(1); });
