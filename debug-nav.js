const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const requests = [];
  page.on('request', req => {
    const url = req.url();
    if (req.resourceType() === 'document' || url.includes('ffxiv-portfolio')) {
      requests.push({ url, type: req.resourceType() });
    }
  });

  await page.goto('https://kishkumen32.github.io/ffxiv-portfolio/');
  await page.waitForLoadState('networkidle');

  console.log('--- BEFORE CLICK ---');
  console.log('URL:', page.url());

  // Clear requests and click Character
  requests.length = 0;
  await page.click('a[href="/ffxiv-portfolio/character"]');
  await page.waitForTimeout(1500);

  console.log('--- AFTER CLICK Character ---');
  console.log('URL:', page.url());

  // Check what's in the DOM
  const rootContent = await page.locator('#root').innerHTML();
  console.log('Root content length:', rootContent.length);
  console.log('Root has nav:', rootContent.includes('nav'));
  console.log('Root has Kish:', rootContent.includes('Kish'));
  console.log('Root has Gunbreaker:', rootContent.includes('Gunbreaker'));

  console.log('--- REQUESTS MADE ON CLICK ---');
  requests.forEach(r => console.log(r.type, r.url));

  // Now check if the page shows Character content or still shows Home
  const bodyText = await page.locator('body').textContent();
  console.log('--- PAGE TEXT SAMPLE ---');
  console.log(bodyText.slice(0, 300));

  await browser.close();
})();
