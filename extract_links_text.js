const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf', 'utf8');

// Find all URIs
const uriMatches = content.match(/\/URI\s*\(([^)]+)\)/g);
console.log('All URIs in PDF:');
if (uriMatches) {
  const uniqueUris = [...new Set(uriMatches.map(u => u.replace(/\/URI\s*\(/, '').slice(0, -1)))];
  console.log(JSON.stringify(uniqueUris, null, 2));
} else {
  console.log('No URIs found directly with regex');
}

// Find all text strings inside Tj or TJ
const tjMatches = content.match(/\(([^)]+)\)\s*Tj/g);
console.log(`Found ${tjMatches ? tjMatches.length : 0} Tj strings.`);
if (tjMatches) {
  const texts = tjMatches.map(t => t.replace(/\)\s*Tj/, '').replace(/^\(/, ''));
  console.log('Sample texts:', texts.slice(0, 30));
}
