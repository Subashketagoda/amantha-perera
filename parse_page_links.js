const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf', 'latin1');

// Extract all objects into a map
const objMap = new Map();
const objRegex = /(\d+)\s+0\s+obj([\s\S]*?)endobj/g;
let match;
while ((match = objRegex.exec(content)) !== null) {
  objMap.set(parseInt(match[1]), match[2]);
}

console.log('Total objects found:', objMap.size);

// Find all Pages: objects containing /Type /Page (and not /Pages)
const pages = [];
for (let [num, body] of objMap.entries()) {
  if (body.includes('/Type /Page') && !body.includes('/Type /Pages')) {
    pages.push({ num, body });
  }
}

console.log(`Found ${pages.length} pages.`);

// For each page, parse /Annots
const pageLinkData = [];

pages.forEach((p, idx) => {
  const pageNum = idx + 1;
  const annotsMatch = p.body.match(/\/Annots\s*\[([^\]]*)\]/);
  const links = [];
  
  if (annotsMatch) {
    const annotRefs = annotsMatch[1].match(/(\d+)\s+0\s+R/g) || [];
    for (const ref of annotRefs) {
      const refNum = parseInt(ref);
      const annotBody = objMap.get(refNum);
      if (annotBody) {
        const uriMatch = annotBody.match(/\/URI\s*\(([^)]+)\)/);
        const rectMatch = annotBody.match(/\/Rect\s*\[([0-9.\s-]+)\]/);
        if (uriMatch) {
          const rect = rectMatch ? rectMatch[1].trim().split(/\s+/).map(Number) : [];
          links.push({
            annotObj: refNum,
            uri: uriMatch[1],
            rect: rect // [x1, y1, x2, y2] in PDF pts (1920x1080)
          });
        }
      }
    }
  }
  
  pageLinkData.push({
    page: pageNum,
    pageObj: p.num,
    links: links
  });
});

console.log(JSON.stringify(pageLinkData, null, 2));
fs.writeFileSync('page_links.json', JSON.stringify(pageLinkData, null, 2));
