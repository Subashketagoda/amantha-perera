const sharp = require('sharp');
const path = require('path');

async function cleanPage14() {
  // Let's inspect page 14
  // If we take a dark patch or blur the text area:
  // The text "THIS IS WHAT SHOWING UP LOOKS LIKE." is around left: 120, top: 900, width: 1250, height: 80
  // "Watch the turnout" button is around left: 1490, top: 900, width: 300, height: 60
  // "LIVE · BOTTOMS UP" is around left: 120, top: 120, width: 350, height: 40
  
  // Let's create a clean background by sampling nearby pixels or darkening the bottom bar
  const img = sharp('extracted_pages/page_14.jpg');
  const meta = await img.metadata();
  
  // Let's create an SVG overlay that darkens the bottom 250px with a rich dark gradient
  // so the HTML text sits crisply on top without any ghosting!
  const svgOverlay = Buffer.from(`
    <svg width="${meta.width}" height="${meta.height}">
      <defs>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0e0e0e" stop-opacity="0" />
          <stop offset="50%" stop-color="#0e0e0e" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#0e0e0e" stop-opacity="1" />
        </linearGradient>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0e0e0e" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#0e0e0e" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${meta.width}" height="220" fill="url(#topFade)" />
      <rect x="0" y="${meta.height - 300}" width="${meta.width}" height="300" fill="url(#bottomFade)" />
    </svg>
  `);
  
  await sharp('extracted_pages/page_14.jpg')
    .composite([{ input: svgOverlay, blend: 'over' }])
    .toFile('assets/images/p14_clean_bg.jpg');
    
  console.log('Created p14_clean_bg.jpg with smooth gradient overlay');
}

cleanPage14().catch(console.error);
