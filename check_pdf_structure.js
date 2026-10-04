const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf', 'latin1');

console.log('Total length:', content.length);
console.log('Matches for /Page:', (content.match(/\/Page\b/g) || []).length);
console.log('Matches for /Link:', (content.match(/\/Link\b/g) || []).length);
console.log('Matches for /URI:', (content.match(/\/URI\b/g) || []).length);
console.log('Matches for /Annots:', (content.match(/\/Annots\b/g) || []).length);

// Print sample around /URI
const uriIdx = content.indexOf('/URI');
if (uriIdx !== -1) {
  console.log('Context around first /URI:');
  console.log(content.substring(uriIdx - 150, uriIdx + 200));
}
