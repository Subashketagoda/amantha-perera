const fs = require('fs');
const path = require('path');

function decodeAscii85(str) {
  str = str.replace(/\s+/g, '');
  if (str.endsWith('~>')) {
    str = str.substring(0, str.length - 2);
  }
  
  const bytes = [];
  let i = 0;
  while (i < str.length) {
    if (str[i] === 'z') {
      bytes.push(0, 0, 0, 0);
      i++;
      continue;
    }
    
    let tuple = 0;
    let count = 0;
    for (let j = 0; j < 5; j++) {
      if (i + j < str.length) {
        const c = str.charCodeAt(i + j);
        if (c < 33 || c > 117) {
          // ignore or skip invalid characters if any trailing
          break;
        }
        tuple = tuple * 85 + (c - 33);
        count++;
      } else {
        tuple = tuple * 85 + 84;
      }
    }
    
    if (count === 0) break;
    
    const b0 = (tuple >>> 24) & 0xff;
    const b1 = (tuple >>> 16) & 0xff;
    const b2 = (tuple >>> 8) & 0xff;
    const b3 = tuple & 0xff;
    
    if (count >= 2) bytes.push(b0);
    if (count >= 3) bytes.push(b1);
    if (count >= 4) bytes.push(b2);
    if (count >= 5) bytes.push(b3);
    
    i += count;
  }
  return Buffer.from(bytes);
}

const pdfPath = 'C:\\Users\\User\\Downloads\\Amantha-Perera-Creator-Deck-4.pdf';
const content = fs.readFileSync(pdfPath, 'binary');

const outDir = path.join(__dirname, 'extracted_pages');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let searchPos = 0;
let pageIndex = 1;

while (searchPos < content.length) {
  const objIdx = content.indexOf('obj', searchPos);
  if (objIdx === -1) break;
  
  const streamIdx = content.indexOf('stream', objIdx);
  if (streamIdx === -1) break;
  
  const endStreamIdx = content.indexOf('endstream', streamIdx);
  if (endStreamIdx === -1) break;
  
  const header = content.substring(objIdx, streamIdx);
  if (header.includes('/Subtype /Image') || header.includes('/Subtype/Image')) {
    // Find where stream data actually starts
    let dataStart = streamIdx + 6;
    if (content[dataStart] === '\r') dataStart++;
    if (content[dataStart] === '\n') dataStart++;
    
    let dataEnd = endStreamIdx;
    if (content[dataEnd - 1] === '\n') dataEnd--;
    if (content[dataEnd - 1] === '\r') dataEnd--;
    
    const streamData = content.substring(dataStart, dataEnd);
    console.log(`Extracting Image obj at index ${objIdx}, stream length: ${streamData.length}`);
    
    try {
      let decoded;
      if (header.includes('ASCII85Decode')) {
        decoded = decodeAscii85(streamData);
      } else {
        decoded = Buffer.from(streamData, 'binary');
      }
      
      const filename = `page_${pageIndex.toString().padStart(2, '0')}.jpg`;
      fs.writeFileSync(path.join(outDir, filename), decoded);
      console.log(`Saved ${filename}: ${decoded.length} bytes (SOI: 0x${decoded[0].toString(16)} 0x${decoded[1].toString(16)})`);
      pageIndex++;
    } catch (err) {
      console.error(`Error decoding:`, err);
    }
  }
  
  searchPos = endStreamIdx + 9;
}

console.log(`Extraction complete: ${pageIndex - 1} pages.`);
