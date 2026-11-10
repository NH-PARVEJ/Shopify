const fs = require('fs');
const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const cartDrawerLiquid = fs.readFileSync('press-by-heart/sections/cart-drawer.liquid', 'utf8');
  const styleMatch = cartDrawerLiquid.match(/<style>([\s\S]*?)<\/style>/);
  const inlineStyle = styleMatch ? styleMatch[1] : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${inlineStyle}</style>
    </head>
    <body style="margin: 0; background: #fff;">
      <div id="cart-sidebar-drawer" class="cart-sidebar-drawer is-open" style="position: fixed; right: 0; top: 0; width: 440px; height: 100vh; background: #fff;">
        <div class="cart-sidebar-panel" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
          <div class="cart-sidebar-footer" id="cart-sidebar-footer" style="padding: 16px 20px; box-sizing: border-box; width: 100%;">
            <div class="cart-promo-section cart-promo-wrap" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
              <div class="cart-promo-input-wrap cart-promo-input-row" style="display: flex; align-items: center; gap: 8px; width: 100%;">
                <input type="text" id="cart-promo-input" class="cart-promo-input" placeholder="Promo code (e.g. HEART10)" aria-label="Discount promo code" autocomplete="off" style="flex: 1 1 auto; min-width: 0; width: 100%; height: 42px; padding: 0 14px; border: 1.5px solid #f1dde4; border-radius: 8px; background: #ffffff; font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11.5px; color: #4a1520; outline: none; box-sizing: border-box; -webkit-appearance: none; appearance: none;">
                <button type="button" id="cart-promo-apply-btn" class="cart-promo-btn" style="padding: 0 18px; height: 42px; background: #fdf0f4; border: 1.5px solid #f1dde4; border-radius: 8px; color: #fa4087; font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif; font-size: 11.5px; font-weight: 700; letter-spacing: 0.6px; cursor: pointer; white-space: nowrap; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; transition: all 0.2s ease;">APPLY</button>
              </div>
              <div id="cart-promo-status" class="cart-promo-status" role="status" aria-live="polite" style="font-size: 11px; font-family: Poppins, Arial, sans-serif; min-height: 14px; line-height: 1.3;"></div>
            </div>
            <div class="cart-summary-table" style="display: flex; flex-direction: column; gap: 8px; padding: 4px 0 10px 0; border-bottom: 1px dashed #f1dde4;">
              <div class="cart-summary-row" style="display: flex; justify-content: space-between; font-size: 12px; color: #7b5962;">
                <span>Subtotal</span>
                <span id="cart-summary-subtotal">£39.98</span>
              </div>
              <div class="cart-summary-row" style="display: flex; justify-content: space-between; font-size: 12px; color: #7b5962;">
                <span>UK Tracked Delivery</span>
                <span id="cart-summary-shipping">FREE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(300);

  const check = await page.evaluate(() => {
    const input = document.getElementById('cart-promo-input');
    const wrap = document.querySelector('.cart-promo-input-row');
    const btn = document.getElementById('cart-promo-apply-btn');
    return {
      wrapWidth: wrap.clientWidth,
      inputClientWidth: input.clientWidth,
      inputScrollWidth: input.scrollWidth,
      btnWidth: btn.clientWidth,
      placeholder: input.placeholder,
      overflowing: input.scrollWidth > input.clientWidth
    };
  });

  console.log('INPUT OVERFLOW CHECK:', JSON.stringify(check, null, 2));

  // Also test on small mobile (360px viewport)
  await page.setViewportSize({ width: 360, height: 740 });
  await page.waitForTimeout(200);

  const mobileCheck = await page.evaluate(() => {
    const input = document.getElementById('cart-promo-input');
    const wrap = document.querySelector('.cart-promo-input-row');
    const btn = document.getElementById('cart-promo-apply-btn');
    return {
      mobileWrapWidth: wrap.clientWidth,
      mobileInputClientWidth: input.clientWidth,
      mobileInputScrollWidth: input.scrollWidth,
      mobileBtnWidth: btn.clientWidth,
      mobileOverflowing: input.scrollWidth > input.clientWidth
    };
  });

  console.log('MOBILE CHECK (360px):', JSON.stringify(mobileCheck, null, 2));

  const footer = await page.$('.cart-sidebar-footer');
  await footer.screenshot({ path: 'previews/test-cart-footer-mobile.png' });
  console.log('Saved mobile screenshot: previews/test-cart-footer-mobile.png');

  await browser.close();
})();
