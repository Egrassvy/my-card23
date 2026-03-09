const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const replacements = [
  [ /<img src="data:image\/jpeg;base64,[^"]+" alt="" width="1200" height="400"[^>]*>/, '<img src="hero-card-cover.jpg" alt="" width="1200" height="400" onerror="this.style.display=\'none\'">' ],
  [ /<img src="data:image\/jpeg;base64,[^"]+" alt="Егор Кучулин" width="200" height="200"[^>]*>/, '<img src="profile.jpg" alt="Егор Кучулин" width="200" height="200" onload="document.getElementById(\'photo-fallback\').classList.add(\'hidden\')" onerror="this.style.display=\'none\'; document.getElementById(\'photo-fallback\').classList.remove(\'hidden\')">' ],
  [ /<img src="data:image\/jpeg;base64,[^"]+" alt="Кофейня Уголок" width="400" height="180"[^>]*>/, '<img src="portfolio-coffee-thumb.jpg" alt="Кофейня Уголок" width="400" height="180" loading="lazy" onerror="this.style.display=\'none\'">' ],
  [ /<img src="data:image\/jpeg;base64,[^"]+" alt="Фотостудия Свет" width="400" height="180"[^>]*>/, '<img src="portfolio-studio-thumb.jpg" alt="Фотостудия Свет" width="400" height="180" loading="lazy" onerror="this.style.display=\'none\'">' ]
];

for (const [re, replacement] of replacements) {
  html = html.replace(re, replacement);
}

fs.writeFileSync(htmlPath, html);
console.log('Done. index.html now uses local JPGs. Size:', (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0), 'KB');