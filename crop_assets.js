const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

async function cropAssets() {
  console.log('Cropping high-res assets from page images...');

  // Page 1: Hero Amantha on sofa
  // In page 1 (1920x1080), Amantha on sofa is roughly from x: 800 to 1920, y: 0 to 1080
  await sharp('extracted_pages/page_01.jpg')
    .extract({ left: 880, top: 0, width: 1040, height: 1080 })
    .toFile(path.join(imgDir, 'hero_amantha.jpg'));
  console.log('Cropped hero_amantha.jpg');

  // Page 2: Amantha with laptop at café
  // Right side rounded card: approx x: 1192, y: 120, w: 600, h: 760
  await sharp('extracted_pages/page_02.jpg')
    .extract({ left: 1190, top: 115, width: 605, height: 760 })
    .toFile(path.join(imgDir, 'page02_cafe_laptop.jpg'));
  console.log('Cropped page02_cafe_laptop.jpg');

  // Page 5: The 6 cards thumbnails
  // Row 1: y ~ 265 to 555
  // Card 1 image: left ~ 145, top ~ 275, w ~ 175, h ~ 255
  await sharp('extracted_pages/page_05.jpg')
    .extract({ left: 145, top: 275, width: 175, height: 260 })
    .toFile(path.join(imgDir, 'p05_card1_organic.jpg'));
  // Card 2 logo
  await sharp('extracted_pages/page_05.jpg')
    .extract({ left: 708, top: 275, width: 175, height: 260 })
    .toFile(path.join(imgDir, 'p05_card2_cargo.jpg'));
  // Card 3 Divide
  await sharp('extracted_pages/page_05.jpg')
    .extract({ left: 1270, top: 275, width: 175, height: 260 })
    .toFile(path.join(imgDir, 'p05_card3_divide.jpg'));
  // Card 4 The Sun
  await sharp('extracted_pages/page_05.jpg')
    .extract({ left: 145, top: 605, width: 175, height: 260 })
    .toFile(path.join(imgDir, 'p05_card4_sun.jpg'));
  // Card 5 Music
  await sharp('extracted_pages/page_05.jpg')
    .extract({ left: 708, top: 605, width: 175, height: 260 })
    .toFile(path.join(imgDir, 'p05_card5_music.jpg'));
  // Card 6 Standup
  await sharp('extracted_pages/page_05.jpg')
    .extract({ left: 1270, top: 605, width: 175, height: 260 })
    .toFile(path.join(imgDir, 'p05_card6_standup.jpg'));
  console.log('Cropped page 5 card thumbnails');

  // Page 7: Organic logo and standing Amantha
  await sharp('extracted_pages/page_07.jpg')
    .extract({ left: 840, top: 125, width: 220, height: 180 })
    .toFile(path.join(imgDir, 'p07_organic_logo.jpg'));
  await sharp('extracted_pages/page_07.jpg')
    .extract({ left: 0, top: 0, width: 750, height: 1080 })
    .toFile(path.join(imgDir, 'p07_amantha_standing.jpg'));
  console.log('Cropped page 7 assets');

  // Page 8: Proposal photo
  await sharp('extracted_pages/page_08.jpg')
    .extract({ left: 1192, top: 128, width: 600, height: 824 })
    .toFile(path.join(imgDir, 'p08_proposal.jpg'));
  console.log('Cropped page 8 proposal');

  // Page 9: Instagram post mockup card
  await sharp('extracted_pages/page_09.jpg')
    .extract({ left: 1192, top: 108, width: 600, height: 864 })
    .toFile(path.join(imgDir, 'p09_instagram_post.jpg'));
  console.log('Cropped page 9 post');

  // Page 10: Street fight photo
  await sharp('extracted_pages/page_10.jpg')
    .extract({ left: 1192, top: 120, width: 600, height: 380 })
    .toFile(path.join(imgDir, 'p10_street_fight.jpg'));
  console.log('Cropped page 10 street fight');

  // Page 11: Sarigama logo & Upali's logo
  await sharp('extracted_pages/page_11.jpg')
    .extract({ left: 165, top: 340, width: 240, height: 120 })
    .toFile(path.join(imgDir, 'p11_sarigama_logo.jpg'));
  await sharp('extracted_pages/page_11.jpg')
    .extract({ left: 1015, top: 340, width: 260, height: 120 })
    .toFile(path.join(imgDir, 'p11_upalis_logo.jpg'));
  console.log('Cropped page 11 logos');

  // Page 12: Brands grid
  await sharp('extracted_pages/page_12.jpg')
    .extract({ left: 120, top: 250, width: 1680, height: 650 })
    .toFile(path.join(imgDir, 'p12_brands_grid.jpg'));
  console.log('Cropped page 12 brands');

  // Page 13: 3 venture photos
  await sharp('extracted_pages/page_13.jpg')
    .extract({ left: 145, top: 435, width: 495, height: 175 })
    .toFile(path.join(imgDir, 'p13_divide.jpg'));
  await sharp('extracted_pages/page_13.jpg')
    .extract({ left: 708, top: 435, width: 495, height: 175 })
    .toFile(path.join(imgDir, 'p13_cargo.jpg'));
  await sharp('extracted_pages/page_13.jpg')
    .extract({ left: 1270, top: 435, width: 495, height: 175 })
    .toFile(path.join(imgDir, 'p13_organic.jpg'));
  console.log('Cropped page 13 venture cards');

  // Page 14: Full crowd stage photo
  await sharp('extracted_pages/page_14.jpg')
    .toFile(path.join(imgDir, 'p14_full_crowd.jpg'));
  console.log('Saved page 14 full crowd');

  // Page 15: Stage photos
  await sharp('extracted_pages/page_15.jpg')
    .extract({ left: 900, top: 128, width: 420, height: 824 })
    .toFile(path.join(imgDir, 'p15_stage_mic_tall.jpg'));
  await sharp('extracted_pages/page_15.jpg')
    .extract({ left: 1340, top: 128, width: 452, height: 395 })
    .toFile(path.join(imgDir, 'p15_stage_cohost.jpg'));
  await sharp('extracted_pages/page_15.jpg')
    .extract({ left: 1340, top: 550, width: 452, height: 402 })
    .toFile(path.join(imgDir, 'p15_stage_audience.jpg'));
  console.log('Cropped page 15 stage photos');

  // Page 16: Chandi Kollek artwork
  await sharp('extracted_pages/page_16.jpg')
    .extract({ left: 1190, top: 115, width: 605, height: 850 })
    .toFile(path.join(imgDir, 'p16_chandi_poster.jpg'));
  console.log('Cropped page 16 music poster');

  // Page 17: Industry photos
  await sharp('extracted_pages/page_17.jpg')
    .extract({ left: 910, top: 120, width: 880, height: 430 })
    .toFile(path.join(imgDir, 'p17_panel_stage.jpg'));
  await sharp('extracted_pages/page_17.jpg')
    .extract({ left: 910, top: 575, width: 425, height: 375 })
    .toFile(path.join(imgDir, 'p17_solo_armchair.jpg'));
  await sharp('extracted_pages/page_17.jpg')
    .extract({ left: 1365, top: 575, width: 425, height: 375 })
    .toFile(path.join(imgDir, 'p17_award_group.jpg'));
  console.log('Cropped page 17 event photos');

  // Page 18: Podcast Amantha
  await sharp('extracted_pages/page_18.jpg')
    .extract({ left: 128, top: 128, width: 560, height: 824 })
    .toFile(path.join(imgDir, 'p18_podcast_host.jpg'));
  console.log('Cropped page 18 podcast portrait');

  // Page 19: Newspapers
  await sharp('extracted_pages/page_19.jpg')
    .extract({ left: 128, top: 128, width: 840, height: 824 })
    .toFile(path.join(imgDir, 'p19_newspapers.jpg'));
  console.log('Cropped page 19 newspapers');

  // Page 20: Amantha café photo
  await sharp('extracted_pages/page_20.jpg')
    .extract({ left: 1150, top: 115, width: 642, height: 835 })
    .toFile(path.join(imgDir, 'p20_cafe_watch.jpg'));
  console.log('Cropped page 20 café');

  // Page 24: Contact stage photo
  await sharp('extracted_pages/page_24.jpg')
    .extract({ left: 1100, top: 0, width: 820, height: 1080 })
    .toFile(path.join(imgDir, 'p24_contact_stage.jpg'));
  console.log('Cropped page 24 stage photo');
}

cropAssets().catch(console.error);
