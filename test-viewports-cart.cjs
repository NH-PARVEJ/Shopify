const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const cartDrawerLiquid = fs.readFileSync('press-by-heart/sections/cart-drawer.liquid', 'utf8');
  const styleMatch = cartDrawerLiquid.match(/<style>([\s\S]*?)<\/style>/);
  const inlineStyle = styleMatch ? styleMatch[1] : '';

  const viewports = [320, 360, 375, 390, 414];
  for (const w of viewports) {
    const page = await browser.newPage({ viewport: { width: w, height: 750 } });
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${inlineStyle}
          @media (max-width: 700px) {
            .cart-sidebar-panel { width: 100% !important; max-width: 100vw !important; }
          }
        </style>
      </head>
      <body style="margin: 0; background: #fff;">
        <div id="cart-sidebar-drawer" class="cart-sidebar-drawer is-open" style="position: fixed; inset: 0; width: 100vw;">
          <div class="cart-sidebar-panel" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
            <div class="cart-sidebar-footer" style="padding: 16px 16px; box-sizing: border-box; width: 100%;">
              <div class="cart-promo-section cart-promo-wrap">
                <div class="cart-promo-input-wrap cart-promo-input-row">
                  <input type="text" id="cart-promo-input" class="cart-promo-input" placeholder="Promo code (e.g. HEART10)" aria-label="Discount promo code">
                  <button type="button" id="cart-promo-apply-btn" class="cart-promo-btn">APPLY</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    await page.setContent(html);
    await page.waitForTimeout(100);

    const check = await page.evaluate(() => {
      const input = document.getElementById('cart-promo-input');
      return {
        inputClientWidth: input.clientWidth,
        inputScrollWidth: input.scrollWidth,
        overflowing: input.scrollWidth > input.clientWidth
      };
    });
    console.log(`Viewport ${w}px:`, JSON.stringify(check));
    await page.close();
  }

  await browser.close();
})();
