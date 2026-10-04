// Check if there are font resources or text in the PDF
const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf', 'binary');

const fonts = content.match(/\/BaseFont\s*\/([a-zA-Z0-9_-]+)/g);
console.log('Fonts in PDF:', fonts);
