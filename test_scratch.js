const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Let's create a montage or inspect them
async function testScratch() {
  const dir = 'c:\\Users\\User\\Desktop\\amantha\\assets\\images';
  for (let i of [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 15, 17]) {
    const fn = `scratch_img_${i}.jpg`;
    const meta = await sharp(path.join(dir, fn)).metadata();
    console.log(`Checking ${fn}: ${meta.width}x${meta.height}`);
  }
}
testScratch();
