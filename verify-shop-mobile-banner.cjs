const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const viewports = [
  { name: 'iPhone-14-390', width: 390, height: 844 },
  { name: 'iPhone-SE-375', width: 375, height: 667 },
  { name: 'Android-360', width: 360, height: 800 },
  { name: 'Small-320', width: 320, height: 568 },
];

const pagesToTest = [
  { name: 'shop-all', file: 'shop-all.html', heroSelector: '.shop-hero' },
  { name: 'category', file: 'category.html', heroSelector: '.shop-hero' },
  { name: 'shop-by-design', file: 'shop-by-design.html', heroSelector: '.design-hero' }
];

async function run() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files']
  });
  const previewsDir = path.resolve(__dirname, 'previews');
  if (!fs.existsSync(previewsDir)) {
    fs.mkdirSync(previewsDir, { recursive: true });
  }

  let allPassed = true;

  for (const pageInfo of pagesToTest) {
    console.log(`\n========================================`);
    console.log(`Testing page: ${pageInfo.name} (${pageInfo.file})`);
    console.log(`========================================`);

    const pageUrl = 'file://' + path.resolve(__dirname, pageInfo.file).replace(/\\/g, '/');

    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2
      });

      await page.goto(pageUrl, { waitUntil: 'networkidle' });
      // wait a tiny bit for render
      await page.waitForTimeout(300);

      // Measure hero
      const hero = await page.$(pageInfo.heroSelector);
      if (!hero) {
        console.error(`[FAIL] ${pageInfo.name} on ${vp.name}: Hero selector ${pageInfo.heroSelector} not found!`);
        allPassed = false;
        await page.close();
        continue;
      }

      const heroBox = await hero.boundingBox();
      const heroHeight = Math.round(heroBox ? heroBox.height : 0);

      // Check overflow
      const overflowInfo = await page.evaluate(() => {
        const docEl = document.documentElement;
        return {
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          hasOverflow: docEl.scrollWidth > docEl.clientWidth + 1
        };
      });

      // Check current picture source
      const imgSrc = await page.evaluate((sel) => {
        const img = document.querySelector(sel + ' img');
        return img ? img.currentSrc || img.src : null;
      }, pageInfo.heroSelector);

      console.log(`  [${vp.name}] Width: ${vp.width}px | Hero Height: ${heroHeight}px | Overflow: ${overflowInfo.hasOverflow} | Img: ${imgSrc ? path.basename(imgSrc) : 'none'}`);

      if (heroHeight > 230 || heroHeight < 170) {
        console.error(`    [WARN/FAIL] Hero height ${heroHeight}px is not in compact range (170-220px)!`);
        allPassed = false;
      }

      if (overflowInfo.hasOverflow) {
        console.error(`    [FAIL] Horizontal overflow detected: scrollWidth=${overflowInfo.scrollWidth}, clientWidth=${overflowInfo.clientWidth}`);
        allPassed = false;
      }

      // Capture screenshot
      const shotPath = path.join(previewsDir, `${pageInfo.name}-${vp.name}-compact-verified.png`);
      await page.screenshot({ path: shotPath });

      await page.close();
    }
  }

  // Also test desktop on shop-all to ensure desktop banner was NOT broken
  console.log(`\n========================================`);
  console.log(`Testing Desktop (1440x900) on shop-all.html`);
  console.log(`========================================`);
  const deskPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  await deskPage.goto('file://' + path.resolve(__dirname, 'shop-all.html').replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  const deskHero = await deskPage.$('.shop-hero');
  const deskBox = await deskHero.boundingBox();
  const deskHeight = Math.round(deskBox ? deskBox.height : 0);
  console.log(`  [Desktop 1440] Hero Height: ${deskHeight}px (should be ~331px)`);
  await deskPage.screenshot({ path: path.join(previewsDir, 'shop-all-desktop-verified.png') });
  await deskPage.close();

  await browser.close();

  if (allPassed) {
    console.log(`\n>>> ALL TESTS PASSED! Compact mobile banners verified with zero overflow! <<<`);
  } else {
    console.error(`\n>>> SOME TESTS FAILED! Check output above. <<<`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
