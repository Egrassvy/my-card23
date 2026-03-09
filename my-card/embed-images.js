const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cardImages = path.join(root, 'card-images');
const htmlPath = path.join(__dirname, 'index.html');

const files = [
  'hero-card-cover.jpg',
  'profile.jpg',
  'portfolio-coffee-thumb.jpg',
  'portfolio-studio-thumb.jpg'
];

let html = fs.readFileSync(htmlPath, 'utf8');

for (const name of files) {
  const filePath = path.join(cardImages, name);
  if (!fs.existsSync(filePath)) {
    console.warn('Skip (not found):', name);
    continue;
  }
  const buf = fs.readFileSync(filePath);
  const b64 = buf.toString('base64');
  const dataUri = 'data:image/jpeg;base64,' + b64;
  const alt = name.includes('profile') ? 'Егор Кучулин' : name.includes('coffee') ? 'Кофейня Уголок' : name.includes('studio') ? 'Фотостудия Свет' : '';
  const sizes = name.includes('profile') ? '200" height="200' : name.includes('hero') ? '1200" height="400' : '400" height="180';
  let extra = '';
  if (name.includes('profile')) extra = ' onload="document.getElementById(\'photo-fallback\').classList.add(\'hidden\')"';
  else if (name.includes('portfolio')) extra = ' loading="lazy"';
  const re = new RegExp('<img src="/card-images/' + name.replace('.', '\\.') + '"[^>]*>');
  const newTag = '<img src="' + dataUri + '" alt="' + alt + '" width="' + sizes + '"' + extra + '>';
  html = html.replace(re, newTag);
  console.log(name, (buf.length / 1024).toFixed(0) + ' KB');
}

fs.writeFileSync(htmlPath, html);
const size = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);
console.log('Done. index.html size:', size, 'KB');
