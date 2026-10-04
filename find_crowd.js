const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function findCrowd() {
  const dir = 'c:\\Users\\User\\Desktop\\amantha\\assets\\images';
  const files = fs.readdirSync(dir).filter(f => f.startsWith('scratch_img') || f.endsWith('.jpg'));
  for (const f of files) {
    const meta = await sharp(path.join(dir, f)).metadata();
    if (meta.width > 1200) {
      console.log(`Wide image ${f}: ${meta.width}x${meta.height}`);
    }
  }
}
findCrowd();
