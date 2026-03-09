const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = [
  'hero-card-cover.png',
  'profile.png',
  'portfolio-coffee-thumb.png',
  'portfolio-studio-thumb.png'
];

let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

for (const name of files) {
  const filePath = path.join(dir, name);
  if (!fs.existsSync(filePath)) continue;
  const buf = fs.readFileSync(filePath);
  const b64 = buf.toString('base64');
  const dataUri = 'data:image/png;base64,' + b64;
  html = html.replace(
    new RegExp('data-src="' + name.replace('.', '\\.') + '"', 'g'),
    'src="' + dataUri + '"'
  );
}

html = html.replace(/\n  <script>\n    \(function\(\)\{[\s\S]*?\}\)\(\);\n  <\/script>\n/, '\n');

fs.writeFileSync(path.join(dir, 'index.html'), html);
console.log('Images inlined into index.html');
