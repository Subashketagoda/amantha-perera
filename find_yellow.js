const sharp = require('sharp');

async function findYellow() {
  const { data, info } = await sharp('extracted_pages/page_01.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    // Yellow has high R and G, lower B
    if (r > 200 && g > 180 && b < 100) {
      console.log(`Found yellow pixel: rgb(${r}, ${g}, ${b}) -> #${r.toString(16)}${g.toString(16)}${b.toString(16)}`);
      break;
    }
  }
}
findYellow();
