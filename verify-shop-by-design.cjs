const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const fileUrl = 'file:///' + path.resolve(__dirname, 'shop-by-design.html').replace(/\\/g, '/');

const VIEWPORTS = [
  { name: '863px (baseline)', width: 863, height: 1821 },
  { name: '1440px (desktop wide)', width: 1440, height: 900 },
  { name: '1920px (full HD)', width: 1920, height: 1080 },
  { name: '2560px (2K ultra)', width: 2560, height: 1440 },
  { name: '768px (tablet portrait)', width: 768, height: 1024 },
  { name: '701px (desktop lower edge)', width: 701, height: 900 },
  { name: '700px (mobile upper edge)', width: 700, height: 900 },
  { name: '600px (large phone)', width: 600, height: 800 },
  { name: '480px (medium phone)', width: 480, height: 800 },
  { name: '390px (iPhone standard)', width: 390, height: 844 },
  { name: '320px (minimum mobile)', width: 320, height: 568 }
];

async function runTests() {
  console.log('--- STARTING PLAYWRIGHT VERIFICATION FOR SHOP-BY-DESIGN ---');
  let totalErrors = 0;
  fs.mkdirSync('previews', { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(`[Page Error] ${err.message}`);
  });

  // 1. Test across all 11 viewports
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(fileUrl);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(img => img.loading = 'eager');
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });

    // Check horizontal scroll / overflow
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: window.innerWidth,
        diff: doc.scrollWidth - window.innerWidth
      };
    });

    if (overflow.diff > 1) {
      console.error(`[OVERFLOW ERROR] ${vp.name}: scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.clientWidth} (diff=${overflow.diff})`);
      totalErrors++;
    }

    // Check headings
    const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
    if (h1Count !== 1) {
      console.error(`[HEADING ERROR] ${vp.name}: Expected 1 H1, found ${h1Count}`);
      totalErrors++;
    }

    // Check products grid populated
    const productCount = await page.evaluate(() => document.querySelectorAll('#shop-by-design-grid .design-card').length);
    if (productCount < 1) {
      console.error(`[GRID ERROR] ${vp.name}: Product grid is empty!`);
      totalErrors++;
    }

    // Check broken images
    const brokenImages = await page.evaluate(() => {
      return [...document.images]
        .filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src);
    });

    if (brokenImages.length > 0) {
      console.error(`[IMAGE ERROR] ${vp.name}: Broken images found:`, brokenImages);
      totalErrors++;
    }

    // Save screenshots for visual validation
    if ([863, 1440, 768, 390].includes(vp.width)) {
      await page.screenshot({ path: `previews/shop-by-design-${vp.width}.png`, fullPage: true });
    }

    console.log(`✓ ${vp.name}: scrollWidth=${overflow.scrollWidth}/${overflow.clientWidth}, H1s=${h1Count}, products=${productCount}, images OK`);
  }

  // 2. Interactive Desktop Mega Menu Tests (at 863px)
  console.log('\n--- TESTING DESKTOP MEGA MENUS ---');
  await page.setViewportSize({ width: 863, height: 1000 });
  await page.goto(fileUrl);
  await page.evaluate(() => document.fonts.ready);

  // Hover over Shop By Design toggle
  const sbdToggle = page.locator('.shop-by-design-menu-toggle');
  const sbdMenu = page.locator('#shop-by-design-menu');
  await sbdToggle.hover();
  await page.waitForTimeout(100);

  let isSbdVisible = await sbdMenu.evaluate(el => !el.hidden && window.getComputedStyle(el).display !== 'none');
  if (!isSbdVisible) {
    console.error('[MENU ERROR] #shop-by-design-menu did not become visible on hover!');
    totalErrors++;
  } else {
    console.log('✓ #shop-by-design-menu opens smoothly on desktop hover');
  }

  // Take screenshot of open mega menu
  await page.screenshot({ path: 'previews/shop-by-design-menu-open.png' });

  // Press Escape to close
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  let isSbdHiddenAfterEsc = await sbdMenu.evaluate(el => el.hidden);
  if (!isSbdHiddenAfterEsc) {
    console.error('[MENU ERROR] #shop-by-design-menu did not close on Escape key!');
    totalErrors++;
  } else {
    console.log('✓ #shop-by-design-menu closes on Escape key');
  }

  // Test Shop All menu hover
  const shopAllToggle = page.locator('.shop-all-menu-toggle');
  const shopAllMenu = page.locator('#shop-all-menu');
  await shopAllToggle.hover();
  await page.waitForTimeout(100);
  let isShopAllVisible = await shopAllMenu.evaluate(el => !el.hidden);
  if (!isShopAllVisible) {
    console.error('[MENU ERROR] #shop-all-menu did not open on hover!');
    totalErrors++;
  } else {
    console.log('✓ #shop-all-menu opens on hover');
  }

  // Test Kids menu hover
  const kidsToggle = page.locator('.kids-menu-toggle');
  const kidsMenu = page.locator('#kids-menu');
  await kidsToggle.hover();
  await page.waitForTimeout(100);
  let isKidsVisible = await kidsMenu.evaluate(el => !el.hidden);
  if (!isKidsVisible) {
    console.error('[MENU ERROR] #kids-menu did not open on hover!');
    totalErrors++;
  } else {
    console.log('✓ #kids-menu opens on hover');
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);

  // 3. Interactive Customizer Filter Tests
  console.log('\n--- TESTING DESIGN CUSTOMIZER FILTERS ---');
  // Check initial count
  const initialCount = await page.evaluate(() => document.querySelectorAll('#shop-by-design-grid .design-card').length);
  console.log(`Initial designs count: ${initialCount}`);

  // Click 'Almond' shape chip
  await page.locator('.sbd-chip[data-filter-value="almond"]').click();
  await page.waitForTimeout(100);
  const almondCount = await page.evaluate(() => document.querySelectorAll('#shop-by-design-grid .design-card').length);
  const allCardsAlmond = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#shop-by-design-grid .design-card'));
    return cards.every(c => c.dataset.shape === 'almond');
  });

  if (!allCardsAlmond || almondCount >= initialCount) {
    console.error(`[FILTER ERROR] Filter almond failed: count=${almondCount}, allAlmond=${allCardsAlmond}`);
    totalErrors++;
  } else {
    console.log(`✓ Shape filter 'almond' works: filtered to ${almondCount} designs`);
  }

  // Click 'Long' length chip
  await page.locator('.sbd-chip[data-filter-value="long"]').click();
  await page.waitForTimeout(100);
  const almondLongCount = await page.evaluate(() => document.querySelectorAll('#shop-by-design-grid .design-card').length);
  console.log(`Filtered to almond + long: ${almondLongCount} designs`);

  // Reset Filters
  await page.locator('#sbd-reset-btn').click();
  await page.waitForTimeout(100);
  const resetCount = await page.evaluate(() => document.querySelectorAll('#shop-by-design-grid .design-card').length);
  if (resetCount !== initialCount) {
    console.error(`[RESET ERROR] Expected ${initialCount} after reset, found ${resetCount}`);
    totalErrors++;
  } else {
    console.log(`✓ Reset button successfully restored all ${resetCount} designs`);
  }

  // Test URL query param support: load page with ?shape=coffin&length=long
  await page.goto(fileUrl + '?shape=coffin&length=long');
  await page.evaluate(() => document.fonts.ready);
  const urlParamCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#shop-by-design-grid .design-card'));
    return {
      count: cards.length,
      allMatch: cards.every(c => c.dataset.shape === 'coffin' && c.dataset.length === 'long')
    };
  });

  if (!urlParamCards.allMatch || urlParamCards.count === 0) {
    console.error(`[URL PARAM ERROR] ?shape=coffin&length=long failed: count=${urlParamCards.count}, allMatch=${urlParamCards.allMatch}`);
    totalErrors++;
  } else {
    console.log(`✓ URL search parameters (?shape=coffin&length=long) correctly filtered ${urlParamCards.count} designs`);
  }

  // 4. Test Add To Bag and Toast
  console.log('\n--- TESTING ADD TO BAG & TOAST ---');
  await page.goto(fileUrl);
  await page.evaluate(() => document.fonts.ready);

  const firstAddBtn = page.locator('#shop-by-design-grid .add-to-bag-btn').first();
  await firstAddBtn.click();
  await page.waitForTimeout(150);

  const bagCountAfter1 = await page.evaluate(() => document.querySelector('.bag-count').textContent.trim());
  const toastVisible = await page.evaluate(() => {
    const t = document.querySelector('.toast');
    return t && t.classList.contains('is-visible') && t.textContent.includes('Added');
  });

  if (!bagCountAfter1 || parseInt(bagCountAfter1, 10) < 1 || !toastVisible) {
    console.error(`[BAG ERROR] Add to bag failed: count=${bagCountAfter1}, toastVisible=${toastVisible}`);
    totalErrors++;
  } else {
    console.log(`✓ Add to bag updates .bag-count to ${bagCountAfter1} and shows toast notification`);
  }

  // 5. Test Mobile Menu Toggle at 390px
  console.log('\n--- TESTING MOBILE INTERACTIONS (390px) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fileUrl);
  await page.evaluate(() => document.fonts.ready);

  const drawer = page.locator('#mobile-app-drawer');
  await page.locator('.mobile-app-menu-btn').click();
  await page.waitForTimeout(200);

  const isMobileDrawerOpen = await drawer.evaluate(el => el.classList.contains('is-open'));
  if (!isMobileDrawerOpen) {
    console.error('[MOBILE ERROR] Click on hamburger at 390px did not open #mobile-app-drawer!');
    totalErrors++;
  } else {
    console.log('✓ Mobile hamburger click opens #mobile-app-drawer');
  }

  await page.locator('.app-drawer-close').click();
  await page.waitForTimeout(200);
  const isMobileDrawerClosed = await drawer.evaluate(el => !el.classList.contains('is-open'));
  if (!isMobileDrawerClosed) {
    console.error('[MOBILE ERROR] Click on close button at 390px did not close drawer!');
    totalErrors++;
  } else {
    console.log('✓ Mobile close button closes #mobile-app-drawer');
  }

  // Report console errors
  if (consoleErrors.length > 0) {
    console.error('\nConsole errors detected during run:');
    consoleErrors.forEach(e => console.error(e));
    totalErrors += consoleErrors.length;
  }

  await browser.close();

  console.log(`\n========================================`);
  if (totalErrors === 0) {
    console.log(`🎉 ALL SHOP-BY-DESIGN TESTS PASSED WITH 0 ERRORS!`);
  } else {
    console.error(`❌ VERIFICATION FAILED WITH ${totalErrors} ERRORS!`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
