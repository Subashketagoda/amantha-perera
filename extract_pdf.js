const fs = require('fs');
const path = require('path');

const pdfPath = 'C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf';
console.log('Checking PDF file:', pdfPath);
if (!fs.existsSync(pdfPath)) {
  console.error('File not found!');
  process.exit(1);
}

const stats = fs.statSync(pdfPath);
console.log('PDF file size:', stats.size);

// Let's inspect the PDF buffer
const buffer = fs.readFileSync(pdfPath);

// Let's search for DCTDecode (JPEG) and FlateDecode images
let jpegCount = 0;
let pos = 0;
const outputDir = path.join(__dirname, 'extracted_assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find JPEGs by SOI marker FF D8 FF
while (pos < buffer.length - 4) {
  if (buffer[pos] === 0xFF && buffer[pos+1] === 0xD8 && buffer[pos+2] === 0xFF) {
    // Find EOI marker FF D9
    let endPos = pos + 3;
    while (endPos < buffer.length - 1) {
      if (buffer[endPos] === 0xFF && buffer[endPos+1] === 0xD9) {
        break;
      }
      endPos++;
    }
    if (endPos < buffer.length - 1) {
      const imgLen = (endPos + 2) - pos;
      if (imgLen > 5000) { // filter out tiny icons/thumbnails
        jpegCount++;
        const imgBuffer = buffer.subarray(pos, endPos + 2);
        const imgName = `image_${jpegCount.toString().padStart(2, '0')}.jpg`;
        fs.writeFileSync(path.join(outputDir, imgName), imgBuffer);
        console.log(`Saved ${imgName}: ${imgLen} bytes (offset ${pos})`);
      }
      pos = endPos + 2;
      continue;
    }
  }
  pos++;
}

console.log(`Found and extracted ${jpegCount} JPEG images!`);
