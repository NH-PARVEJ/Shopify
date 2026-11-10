const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const fileUrl = 'file:///' + path.resolve(__dirname, 'product.html').replace(/\\/g, '/');

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
  console.log('--- STARTING PLAYWRIGHT VERIFICATION FOR PRODUCT SINGLE PAGE (PDP) ---');
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

    // Check title text exists
    const titleText = await page.evaluate(() => document.querySelector('h1').textContent.trim());
    if (!titleText || titleText.length < 5) {
      console.error(`[TITLE ERROR] ${vp.name}: Invalid title: "${titleText}"`);
      totalErrors++;
    }

    // Check main image loaded
    const mainImgOk = await page.evaluate(() => {
      const img = document.getElementById('pdp-main-img');
      return img && img.complete && img.naturalWidth > 0;
    });
    if (!mainImgOk) {
      console.error(`[IMAGE ERROR] ${vp.name}: Main product image not loaded`);
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

    // Save screenshots for visual inspection
    if ([863, 1440, 768, 390].includes(vp.width)) {
      await page.screenshot({ path: `previews/product-${vp.width}.png`, fullPage: true });
    }

    console.log(`✓ ${vp.name}: scrollWidth=${overflow.scrollWidth}/${overflow.clientWidth}, H1s=${h1Count}, mainImg OK, all images loaded`);
  }

  // 2. Interactive Gallery Thumbnail Switcher
  console.log('\n--- TESTING GALLERY THUMBNAIL SWITCHER ---');
  await page.setViewportSize({ width: 863, height: 1000 });
  await page.goto(fileUrl);
  await page.evaluate(() => document.fonts.ready);

  const initialMainSrc = await page.locator('#pdp-main-img').getAttribute('src');
  const secondThumb = page.locator('.pdp-thumb-btn').nth(1);
  await secondThumb.click();
  await page.waitForTimeout(150);

  const updatedMainSrc = await page.locator('#pdp-main-img').getAttribute('src');
  if (initialMainSrc === updatedMainSrc) {
    console.error('[GALLERY ERROR] Clicking thumbnail did not change main image!');
    totalErrors++;
  } else {
    console.log(`✓ Thumbnail click switched main image from "${initialMainSrc}" to "${updatedMainSrc}"`);
  }

  // 3. Interactive Shape, Length, Size Selectors
  console.log('\n--- TESTING OPTION SELECTORS ---');
  // Shape
  await page.locator('.pdp-shape-chip[data-shape="Coffin"]').click();
  await page.waitForTimeout(100);
  const selectedShapeText = await page.locator('#selected-shape-text').textContent();
  if (selectedShapeText.trim() !== 'Coffin') {
    console.error(`[OPTION ERROR] Selected shape expected 'Coffin', got '${selectedShapeText}'`);
    totalErrors++;
  } else {
    console.log('✓ Shape selector switched to Coffin');
  }

  // Length
  await page.locator('.pdp-length-chip[data-length="Long"]').click();
  await page.waitForTimeout(100);
  const selectedLengthText = await page.locator('#selected-length-text').textContent();
  if (selectedLengthText.trim() !== 'Long') {
    console.error(`[OPTION ERROR] Selected length expected 'Long', got '${selectedLengthText}'`);
    totalErrors++;
  } else {
    console.log('✓ Length selector switched to Long');
  }

  // Size
  await page.locator('.pdp-size-chip[data-size="L"]').click();
  await page.waitForTimeout(100);
  const selectedSizeText = await page.locator('#selected-size-text').textContent();
  if (!selectedSizeText.includes('L')) {
    console.error(`[OPTION ERROR] Selected size expected 'L', got '${selectedSizeText}'`);
    totalErrors++;
  } else {
    console.log('✓ Size selector switched to L');
  }

  // 4. Quantity Counter
  console.log('\n--- TESTING QUANTITY SELECTOR ---');
  const qtyInput = page.locator('#pdp-qty');
  await page.locator('#pdp-qty-plus').click();
  await page.waitForTimeout(50);
  let qtyVal = await qtyInput.inputValue();
  if (qtyVal !== '2') {
    console.error(`[QTY ERROR] Expected qty 2 after plus click, got ${qtyVal}`);
    totalErrors++;
  } else {
    console.log('✓ Plus button increased quantity to 2');
  }

  await page.locator('#pdp-qty-minus').click();
  await page.waitForTimeout(50);
  qtyVal = await qtyInput.inputValue();
  if (qtyVal !== '1') {
    console.error(`[QTY ERROR] Expected qty 1 after minus click, got ${qtyVal}`);
    totalErrors++;
  } else {
    console.log('✓ Minus button decreased quantity back to 1');
  }

  // 5. Size Guide Modal
  console.log('\n--- TESTING SIZE GUIDE MODAL ---');
  const modal = page.locator('#size-guide-modal');
  await page.locator('#open-size-guide').click();
  await page.waitForTimeout(100);
  let isModalOpen = await modal.evaluate(el => el.classList.contains('is-open'));
  if (!isModalOpen) {
    console.error('[MODAL ERROR] Size guide modal did not open on button click!');
    totalErrors++;
  } else {
    console.log('✓ Size guide modal opened successfully');
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  let isModalClosed = await modal.evaluate(el => !el.classList.contains('is-open'));
  if (!isModalClosed) {
    console.error('[MODAL ERROR] Escape key did not close size guide modal!');
    totalErrors++;
  } else {
    console.log('✓ Size guide modal closed on Escape key');
  }

  // 6. Accordion Expand / Collapse
  console.log('\n--- TESTING ACCORDIONS ---');
  const secondAccordionTrigger = page.locator('.pdp-accordion-trigger').nth(1);
  const secondAccordionItem = page.locator('.pdp-accordion-item').nth(1);
  await secondAccordionTrigger.click();
  await page.waitForTimeout(100);
  let isAccordionOpen = await secondAccordionItem.evaluate(el => el.classList.contains('is-open'));
  if (!isAccordionOpen) {
    console.error('[ACCORDION ERROR] Accordion did not expand on trigger click!');
    totalErrors++;
  } else {
    console.log('✓ Accordion expanded on click');
  }

  // 7. Add To Bag & Cart integration
  console.log('\n--- TESTING ADD TO BAG ---');
  await page.locator('#pdp-add-btn').click();
  await page.waitForTimeout(150);

  const bagCount = await page.locator('.bag-count').first().textContent();
  const toastVisible = await page.evaluate(() => {
    const t = document.querySelector('.toast');
    return t && t.classList.contains('is-visible') && t.textContent.includes('Added');
  });

  if (!bagCount || parseInt(bagCount, 10) < 1 || !toastVisible) {
    console.error(`[BAG ERROR] Add to bag failed: count=${bagCount}, toastVisible=${toastVisible}`);
    totalErrors++;
  } else {
    console.log(`✓ Add to bag updated bag count to ${bagCount} and displayed toast notification`);
  }

  // 8. Dynamic Product Lookup via URL (?id=2)
  console.log('\n--- TESTING DYNAMIC PRODUCT LOOKUP VIA URL ---');
  await page.goto(fileUrl + '?id=2');
  await page.evaluate(() => document.fonts.ready);

  const p2Title = await page.locator('#pdp-title').textContent();
  const p2Price = await page.locator('#pdp-price').textContent();
  if (!p2Title.includes('Pearly White Minimalist') || !p2Price.includes('15.99')) {
    console.error(`[LOOKUP ERROR] ?id=2 failed: title="${p2Title}", price="${p2Price}"`);
    totalErrors++;
  } else {
    console.log(`✓ Dynamic product lookup loaded "${p2Title}" at ${p2Price}`);
  }

  // 9. Mobile Interaction (390px)
  console.log('\n--- TESTING MOBILE INTERACTIONS (390px) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fileUrl);
  await page.evaluate(() => document.fonts.ready);

  const drawer = page.locator('#mobile-app-drawer');
  await page.locator('.mobile-app-menu-btn').click();
  await page.waitForTimeout(100);

  const isDrawerOpen = await drawer.evaluate(el => el.classList.contains('is-open'));
  if (!isDrawerOpen) {
    console.error('[MOBILE ERROR] Click on hamburger at 390px did not open #mobile-app-drawer!');
    totalErrors++;
  } else {
    console.log('✓ Mobile hamburger click opened #mobile-app-drawer');
  }

  await page.locator('.app-drawer-close').click();
  await page.waitForTimeout(100);

  // Report console errors
  if (consoleErrors.length > 0) {
    console.error('\nConsole errors detected during run:');
    consoleErrors.forEach(e => console.error(e));
    totalErrors += consoleErrors.length;
  }

  await browser.close();

  console.log(`\n========================================`);
  if (totalErrors === 0) {
    console.log(`🎉 ALL PRODUCT SINGLE PAGE TESTS PASSED WITH 0 ERRORS!`);
  } else {
    console.error(`❌ VERIFICATION FAILED WITH ${totalErrors} ERRORS!`);
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
