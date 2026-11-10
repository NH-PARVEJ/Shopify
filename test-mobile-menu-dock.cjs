const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });

  const url = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Inspect Header elements
  const headerInfo = await page.evaluate(() => {
    const header = document.querySelector('header');
    const menuBtn = header.querySelector('.mobile-app-menu-btn');
    const logo = header.querySelector('.logo');
    const logoLink = header.querySelector('a:has(.logo)') || (logo ? logo.closest('a') : null);
    const book = header.querySelector('.book');
    const cart = header.querySelector('#press-heart-cart');

    const logoRect = logo ? logo.getBoundingClientRect() : null;
    const headerRect = header.getBoundingClientRect();

    return {
      hasHeaderMenuBtn: !!menuBtn && window.getComputedStyle(menuBtn).display !== 'none',
      logoLeft: logoRect ? logoRect.left - headerRect.left : null,
      logoWidth: logoRect ? logoRect.width : null,
      logoHeight: logoRect ? logoRect.height : null,
      bookRight: book ? headerRect.right - book.getBoundingClientRect().right : null,
      cartRight: cart ? headerRect.right - cart.getBoundingClientRect().right : null
    };
  });
  console.log('Header Test Results:', headerInfo);

  // 2. Inspect Bottom Navigation Dock
  const dockInfo = await page.evaluate(() => {
    const dock = document.querySelector('.mobile-app-dock');
    if (!dock) return { hasDock: false };

    const tabs = Array.from(dock.querySelectorAll('.app-tab')).map(tab => {
      const label = tab.querySelector('.app-tab-label')?.textContent?.trim() || '';
      const isButton = tab.tagName.toLowerCase() === 'button';
      const isVisible = window.getComputedStyle(tab).display !== 'none';
      return { label, isButton, isVisible };
    });

    const hasBagTab = !!dock.querySelector('.app-tab-bag, [href="#bag"], #mobile-dock-bag-btn');
    const hasMenuTab = !!dock.querySelector('#mobile-dock-menu-btn, .app-tab-menu, .app-menu-btn');

    return {
      hasDock: true,
      tabCount: tabs.length,
      tabs,
      hasBagTab,
      hasMenuTab
    };
  });
  console.log('Dock Test Results:', dockInfo);

  // Screenshot initial mobile view (showing left-aligned logo & new bottom bar)
  await page.screenshot({ path: 'previews/mobile-header-left-dock-menu.png' });
  console.log('Saved previews/mobile-header-left-dock-menu.png');

  // 3. Test Clicking Menu Tab in Bottom Dock
  console.log('Clicking Menu tab in bottom dock...');
  const menuTab = page.locator('.mobile-app-dock #mobile-dock-menu-btn, .mobile-app-dock .app-tab-menu');
  await menuTab.click();
  await page.waitForTimeout(400);

  const drawerState = await page.evaluate(() => {
    const drawer = document.querySelector('#mobile-app-drawer');
    return {
      exists: !!drawer,
      isOpen: drawer ? drawer.classList.contains('is-open') : false,
      ariaHidden: drawer ? drawer.getAttribute('aria-hidden') : null,
      display: drawer ? window.getComputedStyle(drawer).display : null
    };
  });
  console.log('Drawer State After Click:', drawerState);

  // Screenshot open drawer
  await page.screenshot({ path: 'previews/mobile-drawer-open-verified.png' });
  console.log('Saved previews/mobile-drawer-open-verified.png');

  // 4. Test Closing Drawer
  console.log('Clicking Drawer Close button (✕)...');
  await page.locator('#mobile-app-drawer .app-drawer-close').click();
  await page.waitForTimeout(300);

  const drawerClosedState = await page.evaluate(() => {
    const drawer = document.querySelector('#mobile-app-drawer');
    return {
      isOpen: drawer ? drawer.classList.contains('is-open') : false,
      ariaHidden: drawer ? drawer.getAttribute('aria-hidden') : null
    };
  });
  console.log('Drawer State After Close:', drawerClosedState);

  await browser.close();
})();
