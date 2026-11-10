const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  fs.mkdirSync('previews', { recursive: true });
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const pages = [
    { url: 'index.html', prefix: 'mobile-home' },
    { url: 'category.html?category=all', prefix: 'mobile-category-all' },
    { url: 'category.html?category=kids', prefix: 'mobile-category-kids' },
    { url: 'shop-by-design.html', prefix: 'mobile-shop-design' },
    { url: 'product.html?id=1', prefix: 'mobile-pdp' },
  ];

  for (const p of pages) {
    const fileUrl = 'file:///' + path.resolve(p.url).replace(/\\/g, '/');
    await page.goto(fileUrl);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(i => i.loading = 'eager');
      await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    });

    // Top view
    await page.screenshot({ path: `previews/${p.prefix}-top.png` });

    // Scroll to products
    await page.evaluate(() => {
      const prodEl = document.querySelector('.products, #products, .kids-products, .shop-grid, #shop-all-grid, #shop-by-design-grid, #category-grid, .pdp-layout');
      if (prodEl) {
        prodEl.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollBy(0, 500);
      }
    });
    await page.waitForTimeout(100);
    await page.screenshot({ path: `previews/${p.prefix}-content.png` });

    // Full page
    await page.screenshot({ path: `previews/${p.prefix}-full.png`, fullPage: true });
  }

  // Also test drawer opened
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));
  await page.locator('.mobile-app-menu-btn').click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `previews/mobile-drawer-open.png` });

  await browser.close();
  console.log('Mobile screenshots generated successfully!');
})();
