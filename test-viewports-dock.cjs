const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const url = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

  const viewports = [
    { name: 'iPhone-14-390', width: 390, height: 844 },
    { name: 'iPhone-SE-375', width: 375, height: 667 },
    { name: 'Android-360', width: 360, height: 800 },
    { name: 'Small-320', width: 320, height: 568 },
    { name: 'Desktop-1440', width: 1440, height: 900 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const data = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const header = document.querySelector('header');
      const menuBtn = header ? header.querySelector('.mobile-app-menu-btn') : null;
      const dock = document.querySelector('.mobile-app-dock');
      const dockMenu = dock ? dock.querySelector('#mobile-dock-menu-btn, .app-tab-menu') : null;
      const dockBag = dock ? dock.querySelector('.app-tab-bag, [href="#bag"]') : null;

      return {
        hasOverflow: docW > winW,
        docWidth: docW,
        winWidth: winW,
        headerMenuVisible: menuBtn ? window.getComputedStyle(menuBtn).display !== 'none' : false,
        dockVisible: dock ? window.getComputedStyle(dock).display !== 'none' : false,
        hasDockMenu: !!dockMenu,
        hasDockBag: !!dockBag
      };
    });

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}):`, data);
    await page.close();
  }

  await browser.close();
})();
