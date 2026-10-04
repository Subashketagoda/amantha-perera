const sharp = require('sharp');

async function findVibrantYellow() {
  const { data, info } = await sharp('extracted_pages/page_01.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  let best = null;
  let maxDiff = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    if (r > 200 && g > 180 && b < 80) {
      const diff = (r + g) - b * 2;
      if (diff > maxDiff) {
        maxDiff = diff;
        best = { r, g, b };
      }
    }
  }
  if (best) {
    console.log(`Most vibrant yellow: rgb(${best.r}, ${best.g}, ${best.b}) -> #${best.r.toString(16)}${best.g.toString(16)}${best.b.toString(16)}`);
  }
}
findVibrantYellow();
