const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const results = [];
  fs.mkdirSync('previews', { recursive: true });

  const cwd = process.cwd().replace(/\\/g, '/');
  const shopAllUrl = `file:///${cwd}/shop-all.html`;

  for (const width of [863, 1440, 1920, 2560, 768, 701, 700, 600, 480, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(shopAllUrl);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(img => img.loading = 'eager');
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });

    if ([863, 1440, 1920, 768, 390, 320].includes(width)) {
      await page.screenshot({ path: `previews/shop-all-${width}.png`, fullPage: true });
    }

    const result = await page.evaluate(() => {
      const b = sel => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect() : null;
      };
      return {
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        products: document.querySelectorAll('.shop-card').length,
        headingCount: document.querySelectorAll('h1').length,
        heroHasImage: !!document.querySelector('.shop-hero-background'),
        categoryTiles: document.querySelectorAll('.shop-categories a').length,
        shopMenuOpen: !document.querySelector('#shop-all-menu').hidden,
        kidsMenuOpen: !document.querySelector('#kids-menu').hidden,
        clipped: [...document.querySelectorAll('.shop-card h2, .shop-benefits > div, .shop-promo-copy h2, .shop-hero h1')].filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.textContent),
        missingImages: [...document.images].filter(img => !img.naturalWidth).map(img => img.src),
        containerAlignment: ['header', '.shop-all-content', '.footer-inner'].map(sel => {
          const rect = b(sel);
          return { selector: sel, left: rect ? rect.left : 0, width: rect ? rect.width : 0 };
        })
      };
    });

    results.push(result);
    if (result.shopMenuOpen || result.kidsMenuOpen || result.scrollWidth !== width || result.products !== 12 || result.headingCount !== 1 || !result.heroHasImage || result.categoryTiles !== 5 || result.clipped.length || result.missingImages.length) {
      throw new Error(`Shop All check failed at width ${width}: ` + JSON.stringify(result));
    }
  }

  // Interaction tests at 1440px
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(shopAllUrl);

  // Test 1: Hover on SHOP ALL opens shop-all-menu
  await page.locator('.shop-all-menu-toggle').hover();
  if (await page.locator('#shop-all-menu').evaluate(el => el.hidden)) {
    throw new Error('Hover on .shop-all-menu-toggle did not open shop-all-menu');
  }
  if (!await page.locator('.kids-menu-backdrop').evaluate(el => el.classList.contains('is-visible'))) {
    throw new Error('Shop all menu backdrop did not become visible');
  }
  await page.screenshot({ path: 'previews/shop-all-menu-open-1440.png', fullPage: false });

  // Move inside menu and ensure it stays open
  await page.locator('#shop-all-menu .shop-all-action-primary').hover();
  await page.waitForTimeout(200);
  if (await page.locator('#shop-all-menu').evaluate(el => el.hidden)) {
    throw new Error('Shop all menu closed prematurely while mouse was inside menu');
  }

  // Press Escape to close
  await page.keyboard.press('Escape');
  if (!await page.locator('#shop-all-menu').evaluate(el => el.hidden)) {
    throw new Error('Escape key did not close shop-all-menu');
  }

  // Test 2: Hover on KIDS opens kids-menu
  await page.locator('.kids-menu-toggle').hover();
  if (await page.locator('#kids-menu').evaluate(el => el.hidden)) {
    throw new Error('Hover on .kids-menu-toggle did not open kids-menu on shop-all page');
  }
  await page.screenshot({ path: 'previews/kids-menu-on-shop-all-1440.png', fullPage: false });

  await page.keyboard.press('Escape');

  // Test 3: Filter chips
  await page.locator('.shop-chip[data-filter="kids"]').click();
  let count = await page.locator('.shop-card').count();
  if (count !== 4) {
    throw new Error(`Expected 4 kids products when filtered, got ${count}`);
  }

  await page.locator('.shop-chip[data-filter="all"]').click();
  count = await page.locator('.shop-card').count();
  if (count !== 12) {
    throw new Error(`Expected 12 products after resetting filter to all, got ${count}`);
  }

  // Test 3b: Category tile click
  await page.locator('.shop-categories a[data-category="pedis"]').click();
  const pediCount = await page.locator('.shop-card').count();
  if (pediCount !== 1) {
    throw new Error(`Expected 1 pedi product when category tile clicked, got ${pediCount}`);
  }
  await page.locator('.shop-categories a[data-category="all"]').click();
  count = await page.locator('.shop-card').count();
  if (count !== 12) {
    throw new Error(`Expected 12 products after category tile reset, got ${count}`);
  }

  // Test 4: Add to bag button
  await page.locator('.shop-card-btn').first().click();
  const bagCount = await page.locator('.bag-count').first().textContent();
  if (bagCount !== '1') {
    throw new Error(`Expected bag count 1, got ${bagCount}`);
  }
  const toastVisible = await page.locator('.toast').evaluate(el => el.classList.contains('visible'));
  if (!toastVisible) {
    throw new Error('Toast notification did not appear on adding to bag');
  }

  // Test 5: Mobile app drawer toggle at 390px
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(shopAllUrl);
  const drawer = page.locator('#mobile-app-drawer');
  if (await drawer.evaluate(el => el.classList.contains('is-open'))) {
    throw new Error('Mobile drawer must start collapsed');
  }
  await page.locator('.mobile-app-menu-btn').click();
  if (!await drawer.evaluate(el => el.classList.contains('is-open'))) {
    throw new Error('Mobile hamburger button failed to open drawer at 390px');
  }
  await page.locator('.app-drawer-close').click();
  if (await drawer.evaluate(el => el.classList.contains('is-open'))) {
    throw new Error('Mobile drawer failed to close via close button');
  }

  if (errors.length) throw new Error('Page errors encountered:\n' + errors.join('\n'));

  fs.writeFileSync('previews/shop-all-validation.json', JSON.stringify({ results, errors, menu: true, filters: true, bag: true }, null, 2));
  console.log(JSON.stringify({
    success: true,
    viewports: results.map(x => ({ width: x.width, overflow: x.scrollWidth !== x.width, shopMenu: x.shopMenuOpen, kidsMenu: x.kidsMenuOpen })),
    interactions: { hoverMenu: true, escapeKey: true, filterChips: true, addToBag: true, mobileToggle: true }
  }, null, 2));

  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
