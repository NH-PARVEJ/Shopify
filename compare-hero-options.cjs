const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files']
  });

  const p1 = 'C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/hero_mobile_seamless_1794215730864.jpg';
  const p2 = 'C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/hero_mobile_v1_1794215706651.jpg';

  const logoBase64 = fs.readFileSync('assets/logo-hq-v2.png').toString('base64');
  const img1Base64 = fs.readFileSync(p1).toString('base64');
  const img2Base64 = fs.readFileSync(p2).toString('base64');

  const cssStyle = fs.readFileSync('style.css', 'utf8');
  const cssRefinements = fs.readFileSync('refinements.css', 'utf8');

  const options = [
    { idx: 1, b64: img1Base64 },
    { idx: 2, b64: img2Base64 }
  ];

  for (const opt of options) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${cssStyle}
          ${cssRefinements}

          /* Seamless Mobile Hero Overlay Rules */
          @media (max-width: 700px) {
            .hero {
              position: relative !important;
              display: flex !important;
              flex-direction: column !important;
              width: 100% !important;
              min-height: 580px !important;
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
              margin: 0 !important;
              padding: 0 !important;
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
              background: linear-gradient(180deg, rgba(255, 245, 248, 0.95) 0%, rgba(255, 245, 248, 0.75) 60%, rgba(255, 245, 248, 0) 100%) !important;
              z-index: 3 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="announcement-bar"><div class="announcement"><span>QUICK PRESS, INSTANT BEAUTY ✨</span><span>07944 545 406</span></div></div>
        <header id="site-header" class="site-header">
          <button type="button" class="mobile-app-menu-btn" aria-label="Menu">
            <svg class="icon menu-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <img class="logo" src="data:image/png;base64,${logoBase64}" style="height:36px; width:auto; object-fit:contain;" alt="Press By Heart">
          <a class="book" href="#">BOOK NOW 👑</a>
          <a class="nav-bag luxury-cart-btn" id="press-heart-cart" href="#bag">
            <svg class="icon bag-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f93685" stroke-width="1.8"><path d="M6 8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1l1.2 11.5A2 2 0 0 1 17.2 22H6.8a2 2 0 0 1-2-2.5L6 8Z"/><path d="M9 7V5.5a3 3 0 0 1 6 0V7"/><path d="M12 16.2c-2.4-1.6-4-3.3-4-4.8 0-1.2.9-2.1 2.1-2.1 1 0 1.6.6 1.9 1.1.3-.5.9-1.1 1.9-1.1 1.2 0 2.1.9 2.1 2.1 0 1.5-1.6 3.2-4 4.8Z" fill="#f93685"/></svg>
            <span class="bag-count luxury-badge">4</span>
          </a>
        </header>
        <section class="hero" aria-labelledby="hero-title">
          <picture class="hero-picture">
            <img class="hero-background" src="data:image/jpeg;base64,${opt.b64}" alt="">
          </picture>
          <div class="hero-container">
            <div class="hero-copy">
              <p class="eyebrow">PRESS BY HEART <span>♡</span></p>
              <h1 id="hero-title">QUICK PRESS,<span class="script-line">instant beauty <span>♡</span></span></h1>
              <p class="hero-description">Salon quality press-on nails<br>delivered to your door.</p>
              <button class="shop-button" type="button">SHOP NOW 👑</button>
            </div>
          </div>
        </section>
        <div style="padding: 24px; text-align: center; background: #fff;">
          <h2 style="font-family: Georgia, serif; font-size: 22px; color: #1a1a1a; margin: 0;">SHOP BY COLLECTION ♡</h2>
        </div>
      </body>
      </html>
    `;

    await page.setContent(html);
    await page.waitForTimeout(300);
    const outPath = `previews/compare-hero-option${opt.idx}.png`;
    await page.screenshot({ path: outPath, fullPage: true });
    console.log('Saved', outPath);
    await page.close();
  }

  await browser.close();
})();
