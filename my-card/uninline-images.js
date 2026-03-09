const fs = require('fs');
const path = require('path');

const dir = __dirname;
// Replace each inlined img with external path (order matters)
const replacements = [
  ['<img src="data:image/png;base64,[^"]+" alt="" width="1200" height="400">', '<img src="/card-images/hero-card-cover.png" alt="" width="1200" height="400">'],
  ['<img src="data:image/png;base64,[^"]+" alt="Егор Кучулин" width="200" height="200">', '<img src="/card-images/profile.png" alt="Егор Кучулин" width="200" height="200">'],
  ['<img src="data:image/png;base64,[^"]+" alt="Кофейня Уголок" width="400" height="180">', '<img src="/card-images/portfolio-coffee-thumb.png" alt="Кофейня Уголок" width="400" height="180">'],
  ['<img src="data:image/png;base64,[^"]+" alt="Фотостудия Свет" width="400" height="180">', '<img src="/card-images/portfolio-studio-thumb.png" alt="Фотостудия Свет" width="400" height="180">']
];

let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
for (const [from, to] of replacements) {
  html = html.replace(new RegExp(from), to);
}

fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('Done. File size:', (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1), 'KB');
