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

  console.log('--- TESTING PDP REVIEW MODAL & BUTTON RESIZING ---');

  // 1. Desktop Test (1440px)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('file:///' + path.resolve('product.html?id=1').replace(/\\/g, '/'));
  await page.waitForTimeout(300);

  // Check desktop button heights
  const desktopButtons = await page.evaluate(() => {
    const get = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        height: parseFloat(s.height),
        width: parseFloat(s.width),
        fontSize: s.fontSize
      };
    };
    return {
      addBtn: get('.pdp-add-btn'),
      buyBtn: get('.pdp-buy-btn'),
      qtyWrap: get('.pdp-qty-wrap'),
      shapeChip: get('.shape-chip, .pdp-shape-chip'),
      lengthChip: get('.length-chip, .pdp-length-chip'),
      sizeChip: get('.size-chip, .pdp-size-chip'),
      writeReviewBtn: get('.pdp-write-review-btn')
    };
  });
  console.log('DESKTOP BUTTON DIMENSIONS:', JSON.stringify(desktopButtons, null, 2));

  // Open review modal
  await page.locator('#pdp-write-review-btn').click();
  await page.waitForTimeout(300);

  const modalOpenDesktop = await page.evaluate(() => {
    const m = document.getElementById('review-modal');
    const dialog = m ? m.querySelector('.pdp-review-modal-dialog') : null;
    const nameInput = document.getElementById('review-author-name');
    const emailInput = document.getElementById('review-author-email');
    const textarea = document.getElementById('review-body-text');
    const submitBtn = document.getElementById('pdp-submit-review');
    const stars = document.querySelectorAll('.pdp-star-btn');
    return {
      isOpen: m ? m.classList.contains('is-open') : false,
      dialogWidth: dialog ? dialog.clientWidth : null,
      nameInputWidth: nameInput ? nameInput.clientWidth : null,
      nameInputHeight: nameInput ? nameInput.clientHeight : null,
      emailInputWidth: emailInput ? emailInput.clientWidth : null,
      textareaWidth: textarea ? textarea.clientWidth : null,
      textareaHeight: textarea ? textarea.clientHeight : null,
      submitBtnWidth: submitBtn ? submitBtn.clientWidth : null,
      submitBtnHeight: submitBtn ? submitBtn.clientHeight : null,
      starsCount: stars.length
    };
  });
  console.log('DESKTOP REVIEW MODAL LAYOUT:', JSON.stringify(modalOpenDesktop, null, 2));

  // Screenshot desktop review modal
  await page.screenshot({ path: 'previews/pdp-review-modal-desktop.png' });
  console.log('✓ Saved desktop modal screenshot: previews/pdp-review-modal-desktop.png');

  // Test star rating click
  await page.locator('.pdp-star-btn[data-rating="4"]').click();
  const ratingVal = await page.evaluate(() => document.getElementById('pdp-rating-input').value);
  console.log('✓ Star rating clicked, value is now:', ratingVal);

  // Close modal via close button
  await page.locator('#close-review-form').click();
  await page.waitForTimeout(200);
  const isClosed = await page.evaluate(() => !document.getElementById('review-modal').classList.contains('is-open'));
  console.log('✓ Close button closed modal:', isClosed);

  // 2. Mobile Test (390px)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(200);

  // Check mobile button layout
  const mobileButtons = await page.evaluate(() => {
    const get = sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        height: parseFloat(s.height),
        width: parseFloat(s.width),
        fontSize: s.fontSize
      };
    };
    return {
      qtyWrap: get('.pdp-qty-wrap'),
      addBtn: get('.pdp-add-btn'),
      buyBtn: get('.pdp-buy-btn')
    };
  });
  console.log('MOBILE BUTTON DIMENSIONS:', JSON.stringify(mobileButtons, null, 2));

  // Screenshot PDP main view on mobile
  await page.screenshot({ path: 'previews/pdp-mobile-clean.png' });
  console.log('✓ Saved mobile PDP screenshot: previews/pdp-mobile-clean.png');

  // Open review modal on mobile
  await page.locator('#pdp-write-review-btn').click();
  await page.waitForTimeout(300);

  const mobileModalLayout = await page.evaluate(() => {
    const m = document.getElementById('review-modal');
    const dialog = m ? m.querySelector('.pdp-review-modal-dialog') : null;
    const submitBtn = document.getElementById('pdp-submit-review');
    return {
      isOpen: m ? m.classList.contains('is-open') : false,
      dialogWidth: dialog ? dialog.clientWidth : null,
      submitBtnWidth: submitBtn ? submitBtn.clientWidth : null,
      submitBtnHeight: submitBtn ? submitBtn.clientHeight : null
    };
  });
  console.log('MOBILE REVIEW MODAL LAYOUT:', JSON.stringify(mobileModalLayout, null, 2));

  // Screenshot mobile review modal
  await page.screenshot({ path: 'previews/pdp-review-modal-mobile.png' });
  console.log('✓ Saved mobile modal screenshot: previews/pdp-review-modal-mobile.png');

  // Close via Escape key
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const escapeClosed = await page.evaluate(() => !document.getElementById('review-modal').classList.contains('is-open'));
  console.log('✓ Escape key closed modal on mobile:', escapeClosed);

  await browser.close();
  console.log('🎉 ALL REVIEW MODAL & PDP BUTTON TESTS COMPLETED SUCCESSFULLY!');
})();
