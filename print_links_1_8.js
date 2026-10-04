const fs = require('fs');
const data = JSON.parse(fs.readFileSync('page_links.json', 'utf8'));

data.slice(0, 8).forEach(p => {
  console.log(`Page ${p.page}:`);
  p.links.forEach(l => {
    console.log(`  - Rect: [${l.rect.join(', ')}] -> ${l.uri}`);
  });
});
