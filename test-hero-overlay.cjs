const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="file:///${path.resolve('style.css').replace(/\\/g, '/')}">
      <link rel="stylesheet" href="file:///${path.resolve('refinements.css').replace(/\\/g, '/')}">
      <link rel="stylesheet" href="file:///${path.resolve('theme-components.css').replace(/\\/g, '/')}">
      <style>
        @media (max-width: 700px) {
          .hero {
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            height: auto !important;
            min-height: 560px !important;
            background: linear-gradient(180deg, #fff5f8 0%, #fdeaf1 45%, #f9d8e5 100%) !important;
            overflow: hidden !important;
          }
          .hero-container {
            position: relative !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 auto !important;
            z-index: 2 !important;
          }
          .hero .hero-picture {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: block !important;
            pointer-events: none !important;
            z-index: 1 !important;
          }
          .hero .hero-background {
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center bottom !important;
            display: block !important;
            max-width: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }
          .hero-copy {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 24px 20px 220px !important;
            background: linear-gradient(180deg, rgba(255, 245, 248, 0.95) 0%, rgba(255, 245, 248, 0.78) 65%, rgba(255, 245, 248, 0) 100%) !important;
            z-index: 3 !important;
          }
        }
      </style>
    </head>
    <body>
      <header id="site-header" class="site-header">
        <a class="nav-bag luxury-cart-btn" id="press-heart-cart" href="#bag">
          <svg class="icon bag-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f93685" stroke-width="1.8"><path d="M6 8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1l1.2 11.5A2 2 0 0 1 17.2 22H6.8a2 2 0 0 1-2-2.5L6 8Z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/><path d="M12 16.2c-2.4-1.6-4-3.3-4-4.8 0-1.2.9-2.1 2.1-2.1 1 0 1.6.6 1.9 1.1.3-.5.9-1.1 1.9-1.1 1.2 0 2.1.9 2.1 2.1 0 1.5-1.6 3.2-4 4.8Z" fill="#f93685"/></svg>
          <span class="bag-count luxury-badge">0</span>
        </a>
      </header>
      <section class="hero" aria-labelledby="hero-title">
        <picture class="hero-picture">
          <source media="(max-width: 700px)" srcset="file:///${path.resolve('assets/hero-mobile.png').replace(/\\/g, '/')}">
          <img class="hero-background" src="file:///${path.resolve('assets/hero-expanded.png').replace(/\\/g, '/')}" alt="" width="1881" height="836">
        </picture>
        <div class="hero-container">
          <div class="hero-copy">
            <p class="eyebrow">PRESS BY HEART <span>♡</span></p>
            <h1 id="hero-title">QUICK PRESS,<span class="script-line">instant beauty</span></h1>
            <p class="hero-description">Salon quality press-on nails<br>delivered to your door.</p>
            <button class="shop-button" type="button">SHOP NOW</button>
          </div>
        </div>
      </section>
      <div class="content-container">
        <section id="collections" class="collections">
          <h2 class="collections-title">SHOP BY COLLECTION <span>♡</span></h2>
        </section>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'previews/test-hero-seamless.png', fullPage: true });
  console.log('Saved previews/test-hero-seamless.png');

  await browser.close();
})();
