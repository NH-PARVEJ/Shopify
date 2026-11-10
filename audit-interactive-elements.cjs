const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

async function testInteractive() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const issues = [];
  const page = await browser.newPage();

  // =========================================================================
  // TEST 1: CART DRAWER ON PRODUCT & HOME
  // =========================================================================
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('file:///' + path.resolve('product.html').replace(/\\/g, '/'));

  // Click bag to open drawer
  await page.click('.nav-bag');
  await page.waitForTimeout(400);

  const cartDrawerCheck = await page.evaluate(() => {
    const drawer = document.querySelector('#cart-sidebar-drawer');
    const overlay = document.querySelector('#cart-drawer-overlay');
    if (!drawer) return { exists: false };

    const promoInput = drawer.querySelector('#cart-promo-input');
    const promoBtn = drawer.querySelector('#cart-promo-apply-btn');
    const checkoutBtn = drawer.querySelector('.cart-checkout-btn');
    const closeBtn = drawer.querySelector('#close-cart-sidebar');

    const dRect = drawer.getBoundingClientRect();
    const pRect = promoInput ? promoInput.getBoundingClientRect() : null;
    const bRect = promoBtn ? promoBtn.getBoundingClientRect() : null;
    const cRect = checkoutBtn ? checkoutBtn.getBoundingClientRect() : null;

    return {
      exists: true,
      isOpen: drawer.classList.contains('open'),
      drawerRight: dRect.right,
      drawerWidth: dRect.width,
      promoInputWidth: pRect ? pRect.width : 0,
      promoBtnWidth: bRect ? bRect.width : 0,
      promoBtnHeight: bRect ? bRect.height : 0,
      checkoutBtnWidth: cRect ? cRect.width : 0,
      closeBtnExists: !!closeBtn
    };
  });

  console.log('Cart Drawer Desktop Check:', JSON.stringify(cartDrawerCheck, null, 2));
  if (!cartDrawerCheck.exists || !cartDrawerCheck.isOpen || cartDrawerCheck.promoInputWidth === 0) {
    issues.push({ test: 'CART_DRAWER_DESKTOP', details: cartDrawerCheck });
  }

  // Close cart
  await page.click('#close-cart-sidebar');
  await page.waitForTimeout(300);

  // =========================================================================
  // TEST 2: WRITE A REVIEW MODAL
  // =========================================================================
  const reviewBtn = await page.$('#open-review-form, .pdp-write-review-btn');
  if (reviewBtn) {
    await reviewBtn.click();
    await page.waitForTimeout(300);

    const reviewModalCheck = await page.evaluate(() => {
      const modal = document.querySelector('#review-modal');
      const dialog = modal ? modal.querySelector('.pdp-modal-dialog') : null;
      const nameInp = modal ? modal.querySelector('#review-author-name') : null;
      const emailInp = modal ? modal.querySelector('#review-author-email') : null;
      const bodyInp = modal ? modal.querySelector('#review-body-text') : null;
      const submitBtn = modal ? modal.querySelector('#pdp-submit-review') : null;
      const stars = modal ? modal.querySelectorAll('.pdp-star-btn') : [];

      if (!modal) return { exists: false };
      const dRect = dialog.getBoundingClientRect();

      return {
        exists: true,
        isOpen: modal.classList.contains('open') || window.getComputedStyle(modal).display !== 'none',
        dialogWidth: dRect.width,
        nameInputHeight: nameInp ? nameInp.offsetHeight : 0,
        emailInputHeight: emailInp ? emailInp.offsetHeight : 0,
        bodyInputHeight: bodyInp ? bodyInp.offsetHeight : 0,
        submitBtnHeight: submitBtn ? submitBtn.offsetHeight : 0,
        starsCount: stars.length
      };
    });

    console.log('Review Modal Desktop Check:', JSON.stringify(reviewModalCheck, null, 2));
    if (!reviewModalCheck.isOpen || reviewModalCheck.submitBtnHeight === 0 || reviewModalCheck.starsCount !== 5) {
      issues.push({ test: 'REVIEW_MODAL_DESKTOP', details: reviewModalCheck });
    }

    // Close review modal
    await page.click('#close-review-form');
    await page.waitForTimeout(300);
  }

  // =========================================================================
  // TEST 3: SIZE GUIDE MODAL
  // =========================================================================
  const sizeGuideBtn = await page.$('#open-size-guide');
  if (sizeGuideBtn) {
    await sizeGuideBtn.click();
    await page.waitForTimeout(300);

    const sizeGuideCheck = await page.evaluate(() => {
      const modal = document.querySelector('#size-guide-modal');
      if (!modal) return { exists: false };
      const content = modal.querySelector('.pdp-modal-content');
      const table = modal.querySelector('.pdp-size-table');
      return {
        exists: true,
        isOpen: modal.classList.contains('open') || window.getComputedStyle(modal).display !== 'none',
        hasTable: !!table,
        tableWidth: table ? table.offsetWidth : 0
      };
    });

    console.log('Size Guide Modal Check:', JSON.stringify(sizeGuideCheck, null, 2));
    if (!sizeGuideCheck.isOpen || !sizeGuideCheck.hasTable || sizeGuideCheck.tableWidth === 0) {
      issues.push({ test: 'SIZE_GUIDE_MODAL', details: sizeGuideCheck });
    }

    // Close size guide
    await page.click('#close-size-guide');
    await page.waitForTimeout(300);
  }

  // =========================================================================
  // TEST 4: MEGA MENUS ON DESKTOP
  // =========================================================================
  const shopAllToggle = await page.$('.shop-all-menu-toggle');
  if (shopAllToggle) {
    await shopAllToggle.click();
    await page.waitForTimeout(300);

    const shopAllMenuCheck = await page.evaluate(() => {
      const menu = document.querySelector('#shop-all-menu');
      if (!menu) return { exists: false };
      return {
        exists: true,
        isOpen: !menu.hidden && window.getComputedStyle(menu).display !== 'none',
        menuWidth: menu.offsetWidth,
        menuHeight: menu.offsetHeight
      };
    });
    console.log('Shop All Mega Menu Check:', JSON.stringify(shopAllMenuCheck, null, 2));
    if (!shopAllMenuCheck.isOpen || shopAllMenuCheck.menuWidth === 0) {
      issues.push({ test: 'MEGA_MENU_SHOP_ALL', details: shopAllMenuCheck });
    }

    // Click again to close
    await shopAllToggle.click();
    await page.waitForTimeout(300);
  }

  // =========================================================================
  // TEST 5: MOBILE APP DRAWER & DOCK ON 390px
  // =========================================================================
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('file:///' + path.resolve('index.html').replace(/\\/g, '/'));

  const mobileDockCheck = await page.evaluate(() => {
    const dock = document.querySelector('.mobile-app-dock');
    if (!dock) return { exists: false };
    const cs = window.getComputedStyle(dock);
    return {
      exists: true,
      display: cs.display,
      height: dock.offsetHeight,
      itemsCount: dock.querySelectorAll('.mobile-app-dock-item, .app-dock-item').length
    };
  });
  console.log('Mobile Bottom Dock Check (390px):', JSON.stringify(mobileDockCheck, null, 2));

  const mobileMenuBtn = await page.$('#mobile-app-menu-btn, .mobile-app-menu-btn');
  if (mobileMenuBtn) {
    await mobileMenuBtn.click();
    await page.waitForTimeout(400);

    const drawerCheck = await page.evaluate(() => {
      const drawer = document.querySelector('#mobile-app-drawer, .mobile-app-drawer');
      if (!drawer) return { exists: false };
      const cs = window.getComputedStyle(drawer);
      return {
        exists: true,
        isOpen: drawer.classList.contains('open'),
        drawerLeft: drawer.getBoundingClientRect().left,
        drawerWidth: drawer.offsetWidth
      };
    });
    console.log('Mobile App Drawer Check (390px):', JSON.stringify(drawerCheck, null, 2));
    if (!drawerCheck.isOpen || drawerCheck.drawerWidth === 0) {
      issues.push({ test: 'MOBILE_APP_DRAWER', details: drawerCheck });
    }
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`INTERACTIVE AUDIT FINISHED: ${issues.length} issue(s) detected.`);
  console.log('========================================');
  if (issues.length > 0) {
    console.log(JSON.stringify(issues, null, 2));
  }
}

testInteractive().catch(e => console.error(e));
