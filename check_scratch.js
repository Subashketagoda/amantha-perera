const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function checkScratch() {
  const dir = 'c:\\Users\\User\\Desktop\\amantha\\assets\\images';
  const files = fs.readdirSync(dir).filter(f => f.startsWith('scratch_img'));
  for (const f of files.slice(0, 5)) {
    const meta = await sharp(path.join(dir, f)).metadata();
    console.log(`${f}: ${meta.width}x${meta.height}, ${meta.format}`);
  }
}
checkScratch();
