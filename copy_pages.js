const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'assets', 'pages');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

for (let i = 1; i <= 24; i++) {
  const name = `page_${i.toString().padStart(2, '0')}.jpg`;
  const src = path.join(__dirname, 'extracted_pages', name);
  const dest = path.join(targetDir, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}
console.log('Copied all 24 page images into assets/pages');
