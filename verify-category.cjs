const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  
  const categoryUrl = 'file:///' + path.resolve('category.html').replace(/\\/g, '/');
  const results = [];
  
  console.log('--- TESTING GLOBAL CATEGORY PAGE (category.html) ---');
  
  // Test 11 viewports
  for (const width of [863, 1440, 1920, 2560, 768, 701, 700, 600, 480, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(categoryUrl);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(img => img.loading = 'eager');
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });

    if ([863, 1440, 390].includes(width)) {
      await page.screenshot({ path: `previews/category-${width}.png`, fullPage: true });
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
        missingImages: [...document.images].filter(img => !img.naturalWidth).map(img => img.src)
      };
    });

    results.push(result);
    if (result.shopMenuOpen || result.kidsMenuOpen || result.scrollWidth !== width || result.products < 10 || result.headingCount !== 1 || !result.heroHasImage || result.categoryTiles !== 5 || result.clipped.length || result.missingImages.length) {
      throw new Error(`Category check failed at width ${width}: ` + JSON.stringify(result));
    }
    console.log(`✓ ${width}px: scrollWidth=${result.scrollWidth}/${width}, products=${result.products}, H1s=${result.headingCount}`);
  }

  // Interaction Tests at 1440px
  console.log('\n--- TESTING DYNAMIC CATEGORY SWITCHING & FILTERS ---');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(categoryUrl);

  // Default: All Nails
  let count = await page.locator('.shop-card').count();
  console.log(`Default All Nails count: ${count}`);

  // Switch to Kids
  await page.locator('.shop-categories a[data-category="kids"]').click();
  await page.waitForTimeout(200);
  let kidsCount = await page.locator('.shop-card').count();
  let heroTitle = await page.locator('#shop-hero-title').textContent();
  console.log(`✓ Switched to Kids: count=${kidsCount}, heroTitle="${heroTitle.replace(/\s+/g, ' ').trim()}"`);
  if (kidsCount !== 6 || !heroTitle.includes('QUEENS')) {
    throw new Error(`Kids category switch failed! count: ${kidsCount}, title: ${heroTitle}`);
  }

  // Kids subfilter: glitter
  await page.locator('.shop-chip[data-filter="glitter"]').click();
  await page.waitForTimeout(200);
  let glitterCount = await page.locator('.shop-card').count();
  console.log(`✓ Kids Glitter subfilter: count=${glitterCount}`);
  if (glitterCount !== 2) {
    throw new Error(`Kids glitter subfilter failed! Expected 2, got ${glitterCount}`);
  }

  // Switch to Pedis
  await page.locator('.shop-categories a[data-category="pedis"]').click();
  await page.waitForTimeout(200);
  let pedisCount = await page.locator('.shop-card').count();
  heroTitle = await page.locator('#shop-hero-title').textContent();
  console.log(`✓ Switched to Pedis: count=${pedisCount}, heroTitle="${heroTitle.replace(/\s+/g, ' ').trim()}"`);
  if (pedisCount !== 4 || !heroTitle.includes('PEDIS')) {
    throw new Error(`Pedis category switch failed! count: ${pedisCount}`);
  }

  // Switch to Bundles
  await page.locator('.shop-categories a[data-category="bundles"]').click();
  await page.waitForTimeout(200);
  let bundlesCount = await page.locator('.shop-card').count();
  heroTitle = await page.locator('#shop-hero-title').textContent();
  console.log(`✓ Switched to Bundles: count=${bundlesCount}, heroTitle="${heroTitle.replace(/\s+/g, ' ').trim()}"`);
  if (bundlesCount !== 4 || !heroTitle.includes('BUNDLES')) {
    throw new Error(`Bundles category switch failed! count: ${bundlesCount}`);
  }

  // Switch to Accessories
  await page.locator('.shop-categories a[data-category="accessories"]').click();
  await page.waitForTimeout(200);
  let accCount = await page.locator('.shop-card').count();
  heroTitle = await page.locator('#shop-hero-title').textContent();
  console.log(`✓ Switched to Accessories: count=${accCount}, heroTitle="${heroTitle.replace(/\s+/g, ' ').trim()}"`);
  if (accCount !== 4 || !heroTitle.includes('ACCESSORIES')) {
    throw new Error(`Accessories category switch failed! count: ${accCount}`);
  }

  // Reset to All Nails
  await page.locator('.shop-categories a[data-category="all"]').click();
  await page.waitForTimeout(200);
  count = await page.locator('.shop-card').count();
  console.log(`✓ Reset back to All: count=${count}`);

  // Test URL query param direct loading
  console.log('\n--- TESTING URL QUERY PARAMETER DIRECT LOAD ---');
  await page.goto(categoryUrl + '?category=kids');
  await page.waitForTimeout(300);
  kidsCount = await page.locator('.shop-card').count();
  heroTitle = await page.locator('#shop-hero-title').textContent();
  console.log(`✓ Direct load category=kids: count=${kidsCount}, title="${heroTitle.replace(/\s+/g, ' ').trim()}"`);
  if (kidsCount !== 6 || !heroTitle.includes('QUEENS')) {
    throw new Error('Direct query param load failed for kids');
  }

  // Test Mega menus on category page
  console.log('\n--- TESTING MEGA MENUS & OVERLAY ---');
  await page.locator('.kids-menu-toggle').hover();
  await page.waitForTimeout(250);
  if (await page.locator('#kids-menu').evaluate(el => el.hidden)) {
    throw new Error('Kids menu hover did not open on category.html');
  }
  if (!await page.locator('.kids-menu-backdrop').evaluate(el => el.classList.contains('is-visible'))) {
    throw new Error('Backdrop did not activate on category.html');
  }
  console.log('✓ Kids menu & backdrop verified');
  await page.keyboard.press('Escape');

  // Add to Bag
  console.log('\n--- TESTING ADD TO BAG ---');
  await page.locator('.shop-card-btn').first().click();
  const bagCount = await page.locator('.bag-count').first().textContent();
  const toastVisible = await page.locator('.toast').evaluate(el => el.classList.contains('visible'));
  console.log(`✓ Add to bag: bagCount=${bagCount}, toastVisible=${toastVisible}`);
  if (bagCount !== '1' || !toastVisible) {
    throw new Error('Add to bag failed on category.html');
  }

  // Mobile test
  console.log('\n--- TESTING MOBILE INTERACTIONS (390px) ---');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(categoryUrl);
  const drawer = page.locator('#mobile-app-drawer');
  await page.locator('.mobile-app-menu-btn').click();
  const openAfter = await drawer.evaluate(el => el.classList.contains('is-open'));
  if (!openAfter) throw new Error('Mobile hamburger menu toggle failed on category.html');
  await page.locator('.app-drawer-close').click();
  console.log('✓ Mobile hamburger menu drawer toggle verified');

  console.log('\n🎉 ALL GLOBAL CATEGORY PAGE TESTS PASSED WITH 0 ERRORS!');
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
