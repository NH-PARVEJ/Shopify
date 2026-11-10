const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const indexPath = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');

  // 1. Test Desktop View (1440px)
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(indexPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // Check desktop cart icon bounding box and styles
    const cartBox = await page.locator('#press-heart-cart').boundingBox();
    const cartSvg = await page.locator('#press-heart-cart svg').boundingBox();
    console.log('Desktop Cart Button Box:', cartBox);
    console.log('Desktop Cart SVG Box:', cartSvg);

    await page.screenshot({ path: 'previews/desktop-header-verified-now.png', clip: { x: 0, y: 0, width: 1440, height: 160 } });
    console.log('Saved previews/desktop-header-verified-now.png');
    await page.close();
  }

  // 2. Test Mobile Viewports (390px, 375px, 360px, 320px)
  const viewports = [
    { name: 'iPhone-14-390', width: 390, height: 844 },
    { name: 'iPhone-SE-375', width: 375, height: 667 },
    { name: 'Android-360', width: 360, height: 800 },
    { name: 'Small-320', width: 320, height: 568 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(indexPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector('.hero');
      const heroCopy = document.querySelector('.hero-copy');
      const heroBg = document.querySelector('.hero .hero-background');
      const cart = document.querySelector('#press-heart-cart');
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;

      return {
        hasOverflow: docW > winW,
        docWidth: docW,
        winWidth: winW,
        heroHeight: hero ? hero.offsetHeight : 0,
        heroCopyHeight: heroCopy ? heroCopy.offsetHeight : 0,
        heroBgDisplay: heroBg ? window.getComputedStyle(heroBg).display : '',
        heroBgPosition: heroBg ? window.getComputedStyle(heroBg).position : '',
        cartDisplay: cart ? window.getComputedStyle(cart).display : '',
        cartWidth: cart ? cart.offsetWidth : 0,
        cartHeight: cart ? cart.offsetHeight : 0
      };
    });

    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}):`, metrics);

    await page.screenshot({
      path: `previews/hero-mobile-${vp.name}.png`,
      clip: { x: 0, y: 0, width: vp.width, height: Math.min(850, vp.height) }
    });
    console.log(`Saved previews/hero-mobile-${vp.name}.png`);

    await page.close();
  }

  await browser.close();
})();
