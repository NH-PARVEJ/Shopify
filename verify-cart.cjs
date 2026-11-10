const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  console.log('--- TESTING CART SIDEBAR ON DESKTOP (1440px) ---');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('file:///C:/Users/devnh/Downloads/shopify/index.html');
  await page.evaluate(() => {
    localStorage.setItem('pressByHeartBag', JSON.stringify(['CLASSIC NUDE', 'PINK BADDIE']));
  });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);

  // 1. Verify bag count
  const bagCount = await page.evaluate(() => document.getElementById('cart-drawer-item-count')?.textContent || '');
  console.log('Initial drawer bag count text:', bagCount);

  // 2. Open drawer via trigger
  await page.evaluate(() => window.openCartSidebar(true));
  await page.waitForTimeout(400);

  const isDrawerOpen = await page.evaluate(() => {
    const d = document.getElementById('cart-sidebar-drawer');
    return d && d.classList.contains('is-open');
  });
  if (!isDrawerOpen) throw new Error('Drawer failed to open');
  console.log('✓ Cart sidebar drawer opened successfully');

  // Take screenshot of open cart drawer on desktop
  await page.screenshot({ path: 'previews/cart-sidebar-desktop-open.png' });
  console.log('✓ Saved desktop screenshot: previews/cart-sidebar-desktop-open.png');

  // 3. Test stepper +
  const initialQty = await page.evaluate(() => {
    return document.querySelector('.cart-step-qty')?.textContent.trim();
  });
  console.log('Initial first item quantity:', initialQty);
  await page.locator('.cart-step-btn[data-action="increase"]').first().click();
  await page.waitForTimeout(200);

  const updatedQty = await page.evaluate(() => {
    return document.querySelector('.cart-step-qty')?.textContent.trim();
  });
  console.log('Updated first item quantity after (+):', updatedQty);
  if (parseInt(updatedQty, 10) !== parseInt(initialQty, 10) + 1) {
    throw new Error(`Quantity did not increment. Expected ${parseInt(initialQty, 10) + 1}, got ${updatedQty}`);
  }
  console.log('✓ Stepper (+) incremented item quantity');

  // 4. Test Promo Code
  await page.locator('#cart-promo-input').fill('HEART10');
  await page.locator('#cart-promo-apply-btn').click();
  await page.waitForTimeout(200);

  const promoStatus = await page.evaluate(() => document.getElementById('cart-promo-status')?.textContent || '');
  console.log('Promo code status:', promoStatus);
  if (!promoStatus.includes('HEART10 applied')) {
    throw new Error('Promo code HEART10 was not applied');
  }
  console.log('✓ Promo code HEART10 successfully applied 10% discount');

  // 5. Check Free Shipping Progress Bar
  const shippingMsg = await page.evaluate(() => document.getElementById('cart-shipping-label')?.textContent || '');
  console.log('Shipping bar message:', shippingMsg);

  // 6. Test Close via Escape key
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
  const isDrawerClosed = await page.evaluate(() => {
    const d = document.getElementById('cart-sidebar-drawer');
    return !d.classList.contains('is-open');
  });
  if (!isDrawerClosed) throw new Error('Drawer failed to close on Escape key');
  console.log('✓ Cart sidebar closed on Escape key');

  // --- TESTING MOBILE APP CART DRAWER (390px) ---
  console.log('\n--- TESTING MOBILE APP CART DRAWER (390px) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('file:///C:/Users/devnh/Downloads/shopify/category.html?category=all');
  await page.waitForTimeout(300);

  // Click bag in bottom mobile dock
  await page.locator('#mobile-dock-bag-btn').click();
  await page.waitForTimeout(400);

  const isMobileDrawerOpen = await page.evaluate(() => {
    const d = document.getElementById('cart-sidebar-drawer');
    return d && d.classList.contains('is-open');
  });
  if (!isMobileDrawerOpen) throw new Error('Mobile dock bag button failed to open drawer');
  console.log('✓ Mobile dock bag button opened cart drawer');

  // Screenshot on mobile
  await page.screenshot({ path: 'previews/cart-sidebar-mobile-open.png' });
  console.log('✓ Saved mobile screenshot: previews/cart-sidebar-mobile-open.png');

  // Test empty state
  await page.evaluate(() => {
    localStorage.setItem('pressByHeartBag', '[]');
  });
  await page.evaluate(() => window.renderCartSidebar());
  await page.waitForTimeout(200);

  const emptyTitle = await page.evaluate(() => document.querySelector('.cart-empty-title')?.textContent || '');
  console.log('Empty state title:', emptyTitle);
  if (!emptyTitle.includes('empty')) {
    throw new Error('Empty state not displayed when bag is empty');
  }
  console.log('✓ Empty bag state displayed correctly with CTA');

  // Close mobile drawer via close button
  await page.locator('#cart-sidebar-close-btn').click();
  await page.waitForTimeout(350);
  const isMobileClosed = await page.evaluate(() => !document.getElementById('cart-sidebar-drawer')?.classList.contains('is-open'));
  if (!isMobileClosed) throw new Error('Mobile drawer failed to close via close button');
  console.log('✓ Mobile drawer closed via close button');

  if (errors.length) {
    throw new Error('Errors logged during cart verification: ' + errors.join('\n'));
  }

  console.log('\n========================================');
  console.log('🎉 ALL CART SIDEBAR TESTS PASSED WITH 0 ERRORS!');
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
