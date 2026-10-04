const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf', 'binary');

console.log('BT markers:', (content.match(/BT\b/g) || []).length);
console.log('ET markers:', (content.match(/ET\b/g) || []).length);
console.log('Tj markers:', (content.match(/Tj\b/g) || []).length);
