const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const buffer = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf');
const content = buffer.toString('binary');

console.log('Searching for /Subtype /Image...');
let regex = /\/Subtype\s*\/Image[\s\S]*?stream\r?\n([\s\S]*?)\r?\nendstream/g;
let match;
let count = 0;
const outputDir = path.join(__dirname, 'extracted_assets');

// Let's also check all /Filter [/FlateDecode] or /DCTDecode
const filterMatches = content.match(/\/Filter\s*\/[a-zA-Z0-9]+/g);
console.log('Filters found:', [...new Set(filterMatches)]);

// Check if there are XObjects
const xobjMatches = content.match(/\/Type\s*\/XObject/g);
console.log('XObjects found:', xobjMatches ? xobjMatches.length : 0);

// Let's check objects
const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
let objMatch;
let imgObjs = 0;
while ((objMatch = objRegex.exec(content)) !== null) {
  const objNum = objMatch[1];
  const body = objMatch[3];
  if (body.includes('/Subtype /Image') || body.includes('/Subtype/Image')) {
    imgObjs++;
    const filter = body.match(/\/Filter\s*\/([a-zA-Z0-9]+)/);
    const width = body.match(/\/Width\s*(\d+)/);
    const height = body.match(/\/Height\s*(\d+)/);
    const colorSpace = body.match(/\/ColorSpace\s*\/([a-zA-Z0-9]+)/);
    console.log(`Image obj ${objNum}: Filter=${filter ? filter[1] : 'none'}, Dimensions=${width ? width[1] : '?'}x${height ? height[1] : '?'}, CS=${colorSpace ? colorSpace[1] : '?'}`);
  }
}
console.log('Total Image objects found:', imgObjs);
