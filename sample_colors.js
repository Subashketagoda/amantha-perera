const sharp = require('sharp');

async function sampleColor() {
  const image = sharp('extracted_pages/page_01.jpg');
  const metadata = await image.metadata();
  console.log('Page 1 metadata:', metadata);
  
  // Crop a tiny 10x10 piece of the yellow line under "COMMERCIAL ENOUGH TO PARTNER WITH."
  // In page 1, that line is around y=780-790, x=130-150
  const raw = await sharp('extracted_pages/page_01.jpg')
    .extract({ left: 135, top: 785, width: 10, height: 10 })
    .raw()
    .toBuffer();
    
  console.log('Sampled RGB at line:', raw[0], raw[1], raw[2]);
  console.log('Hex:', `#${raw[0].toString(16).padStart(2,'0')}${raw[1].toString(16).padStart(2,'0')}${raw[2].toString(16).padStart(2,'0')}`);
  
  // Sample background color at top-left
  const bg = await sharp('extracted_pages/page_01.jpg')
    .extract({ left: 50, top: 50, width: 1, height: 1 })
    .raw()
    .toBuffer();
  console.log('Dark BG Hex:', `#${bg[0].toString(16).padStart(2,'0')}${bg[1].toString(16).padStart(2,'0')}${bg[2].toString(16).padStart(2,'0')}`);
  
  // Sample light background from page 2
  const bg2 = await sharp('extracted_pages/page_02.jpg')
    .extract({ left: 50, top: 50, width: 1, height: 1 })
    .raw()
    .toBuffer();
  console.log('Light BG Hex (Page 2):', `#${bg2[0].toString(16).padStart(2,'0')}${bg2[1].toString(16).padStart(2,'0')}${bg2[2].toString(16).padStart(2,'0')}`);
}

sampleColor().catch(console.error);
