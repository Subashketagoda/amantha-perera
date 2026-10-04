const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function run() {
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Navigating to http://localhost:3008/ ...');
  await page.goto('http://localhost:3008/', { waitUntil: 'networkidle0' });

  // Take screenshot of Page 01
  await page.screenshot({ path: path.join(screenshotsDir, 'web_slide_01.png') });
  console.log('Saved web_slide_01.png');

  // Let's scroll to each slide and capture key slides
  const slideIds = [
    'page-01', 'page-02', 'page-03', 'page-04', 'page-05',
    'page-06', 'page-07', 'page-08', 'page-09', 'page-10',
    'page-11', 'page-12', 'page-13', 'page-14', 'page-15',
    'page-16', 'page-17', 'page-18', 'page-19', 'page-20',
    'page-21', 'page-22', 'page-23', 'page-24'
  ];

  for (let i = 1; i <= 24; i++) {
    const pad = String(i).padStart(2, '0');
    const id = `page-${pad}`;
    const el = await page.$(`#${id}`);
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 250));
      await page.screenshot({ path: path.join(screenshotsDir, `web_slide_${pad}.png`) });
      console.log(`Saved web_slide_${pad}.png`);
    }
  }

  // Test mobile viewport
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:3008/#page-01', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(screenshotsDir, 'mobile_page_01.png') });
  
  for (const pad of ['01', '03', '05', '08', '14', '21', '24']) {
    const elMob = await page.$(`#page-${pad}`);
    if (elMob) {
      await elMob.scrollIntoView();
      await new Promise(r => setTimeout(r, 250));
      await page.screenshot({ path: path.join(screenshotsDir, `mobile_page_${pad}.png`) });
      console.log(`Saved mobile_page_${pad}.png`);
    }
  }

  console.log('All screenshots captured successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
