const fs = require('fs');
const path = require('path');

const dir = __dirname;
const CHUNK = 60;

const files = [
  { id: 'hero', file: 'hero-card-cover.jpg' },
  { id: 'profile', file: 'profile.jpg' },
  { id: 'coffee', file: 'portfolio-coffee-thumb.jpg' },
  { id: 'studio', file: 'portfolio-studio-thumb.jpg' }
];

function toJsString(buf) {
  const b64 = buf.toString('base64');
  const parts = ['"data:image/jpeg;base64,"'];
  for (let i = 0; i < b64.length; i += CHUNK) {
    parts.push('"' + b64.slice(i, i + CHUNK) + '"');
  }
  return parts.join(' +\n  ');
}

let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

let scriptVars = '';
let scriptAssign = '';

for (const { id, file } of files) {
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) continue;
  const buf = fs.readFileSync(fp);
  scriptVars += 'var _' + id + ' = ' + toJsString(buf).trimEnd().replace(/^\s*\+\s*"/, '') + ';\n';
  if (id === 'profile') {
    scriptAssign += '  document.getElementById("img-profile").onload = function(){ document.getElementById("photo-fallback").classList.add("hidden"); };\n';
  }
  scriptAssign += '  document.getElementById("img-' + id + '").src = _' + id + ';\n';
}

// Replace img tags with id and no src
html = html.replace(
  '<img src="hero-card-cover.jpg" alt="" width="1200" height="400" onerror="this.style.display=\'none\'">',
  '<img id="img-hero" alt="" width="1200" height="400" onerror="this.style.display=\'none\'">'
);
html = html.replace(
  '<img src="profile.jpg" alt="Егор Кучулин" width="200" height="200" onload="document.getElementById(\'photo-fallback\').classList.add(\'hidden\')" onerror="this.style.display=\'none\'; document.getElementById(\'photo-fallback\').classList.remove(\'hidden\')">',
  '<img id="img-profile" alt="Егор Кучулин" width="200" height="200" onerror="this.style.display=\'none\'; document.getElementById(\'photo-fallback\').classList.remove(\'hidden\')">'
);
html = html.replace(
  '<img src="portfolio-coffee-thumb.jpg" alt="Кофейня Уголок" width="400" height="180" loading="lazy" onerror="this.style.display=\'none\'">',
  '<img id="img-coffee" alt="Кофейня Уголок" width="400" height="180" loading="lazy" onerror="this.style.display=\'none\'">'
);
html = html.replace(
  '<img src="portfolio-studio-thumb.jpg" alt="Фотостудия Свет" width="400" height="180" loading="lazy" onerror="this.style.display=\'none\'">',
  '<img id="img-studio" alt="Фотостудия Свет" width="400" height="180" loading="lazy" onerror="this.style.display=\'none\'">'
);

const script = '<script>\n(function(){\n' + scriptVars + '\n' + scriptAssign + '})();\n</script>\n';
html = html.replace('</body>', script + '</body>');

fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('Done. index.html size:', (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0), 'KB');