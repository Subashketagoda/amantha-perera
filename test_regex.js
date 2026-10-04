const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf', 'binary');

const idx = content.indexOf('3 0 obj');
console.log('Index:', idx);
console.log(JSON.stringify(content.substring(idx, idx + 250)));
