const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));

  await page.goto('https://kishkumen32.github.io/ffxiv-portfolio/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  console.log('HOME:', page.url());

  await page.click('a[href="/ffxiv-portfolio/character"]');
  await page.waitForTimeout(1000);
  console.log('AFTER /character:', page.url());
  const t = await page.locator('body').textContent();
  console.log('Has Gunbreaker:', t.includes('Gunbreaker'));

  await page.click('a[href="/ffxiv-portfolio/raiding"]');
  await page.waitForTimeout(1000);
  console.log('AFTER /raiding:', page.url());

  await page.click('a[href="/ffxiv-portfolio/achievements"]');
  await page.waitForTimeout(1000);
  console.log('AFTER /achievements:', page.url());

  console.log('Errors:', errors.length ? errors : 'none');
  await browser.close();
})();
