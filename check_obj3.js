const fs = require('fs');

const buffer = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf');
const content = buffer.toString('binary');

const obj3 = content.indexOf('3 0 obj');
console.log(content.substring(obj3, obj3 + 500));
