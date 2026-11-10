const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 600 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; padding: 40px; background: #fff5f8; font-family: 'Poppins', sans-serif; }
        .row { display: flex; flex-direction: column; gap: 40px; }
        .header-preview {
          background: #ffffff;
          padding: 16px 28px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
        }
        .nav-links { display: flex; gap: 20px; font-size: 11px; font-weight: 700; color: #1a1a1a; letter-spacing: 0.5px; align-items: center; }
        .nav-links a { text-decoration: none; color: inherit; }
        .book {
          padding: 9px 18px;
          border-radius: 999px;
          color: #ff0054;
          font-size: 11px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffeaf0, #ffc4d5);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(255, 0, 84, 0.15);
        }

        /* Base Luxury Cart Button */
        .luxury-cart-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fff5f8 0%, #ffeaf1 100%);
          border: 1.5px solid #ffd3e2;
          color: #fa4087;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(250, 64, 135, 0.12);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .luxury-cart-btn:hover {
          transform: translateY(-2px) scale(1.05);
          background: linear-gradient(135deg, #ffeef4 0%, #ffdbe7 100%);
          border-color: #fa4087;
          box-shadow: 0 4px 14px rgba(250, 64, 135, 0.25);
        }
        .luxury-cart-btn svg {
          width: 19px;
          height: 19px;
          display: block;
        }
        .luxury-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          background: linear-gradient(135deg, #fa4087, #f13d84);
          color: #ffffff;
          border-radius: 999px;
          border: 1.5px solid #ffffff;
          font-size: 9.5px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          box-shadow: 0 2px 6px rgba(250, 64, 135, 0.4);
          box-sizing: border-box;
        }

        /* Option 3: Minimal luxury icon (no outer circle) */
        .minimal-cart-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          color: #2c2126;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .minimal-cart-btn:hover {
          color: #fa4087;
          transform: scale(1.08);
        }
        .minimal-cart-btn svg { width: 22px; height: 22px; }
      </style>
    </head>
    <body>
      <div class="row">
        <div>
          <h3 style="margin: 0 0 8px; color: #2c2126; font-size: 14px;">OPTION 1: Luxury Curved Tote with Brand Heart (Pink Circle Button)</h3>
          <div class="header-preview">
            <div class="nav-links">
              <a href="#">BUNDLES</a>
              <a href="#">ACCESSORIES</a>
            </div>
            <a class="luxury-cart-btn" href="#">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1l1.2 11.5A2 2 0 0 1 17.2 22H6.8a2 2 0 0 1-2-2.5L6 8Z"/>
                <path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>
                <path d="M12 16.2c-2.4-1.6-4-3.3-4-4.8 0-1.2.9-2.1 2.1-2.1 1 0 1.6.6 1.9 1.1.3-.5.9-1.1 1.9-1.1 1.2 0 2.1.9 2.1 2.1 0 1.5-1.6 3.2-4 4.8Z" fill="#fa4087" stroke="none"/>
              </svg>
              <span class="luxury-badge">0</span>
            </a>
            <a class="book" href="#">BOOK NOW 👑</a>
          </div>
        </div>

        <div>
          <h3 style="margin: 0 0 8px; color: #2c2126; font-size: 14px;">OPTION 2: Modern Shopping Cart Trolley with Heart (Pink Circle Button)</h3>
          <div class="header-preview">
            <div class="nav-links">
              <a href="#">BUNDLES</a>
              <a href="#">ACCESSORIES</a>
            </div>
            <a class="luxury-cart-btn" href="#">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2.5 3h3.2l2.3 11a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2l1.4-7H6.5"/>
                <circle cx="10" cy="19.5" r="1.5" fill="currentColor"/>
                <circle cx="17.5" cy="19.5" r="1.5" fill="currentColor"/>
                <path d="M13.6 11.5c-1.3-.9-2.2-1.8-2.2-2.6 0-.6.5-1.1 1.1-1.1.5 0 .8.3 1 .6.2-.3.5-.6 1-.6.6 0 1.1.5 1.1 1.1 0 .8-.9 1.7-2 2.6Z" fill="#fa4087" stroke="none"/>
              </svg>
              <span class="luxury-badge">0</span>
            </a>
            <a class="book" href="#">BOOK NOW 👑</a>
          </div>
        </div>

        <div>
          <h3 style="margin: 0 0 8px; color: #2c2126; font-size: 14px;">OPTION 3: Sleek Minimal Luxury Shopping Bag with Heart (No background border)</h3>
          <div class="header-preview">
            <div class="nav-links">
              <a href="#">BUNDLES</a>
              <a href="#">ACCESSORIES</a>
            </div>
            <a class="minimal-cart-btn" href="#">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 8a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1l1.2 11.5A2 2 0 0 1 17.2 22H6.8a2 2 0 0 1-2-2.5L6 8Z"/>
                <path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>
                <path d="M12 16.2c-2.4-1.6-4-3.3-4-4.8 0-1.2.9-2.1 2.1-2.1 1 0 1.6.6 1.9 1.1.3-.5.9-1.1 1.9-1.1 1.2 0 2.1.9 2.1 2.1 0 1.5-1.6 3.2-4 4.8Z" fill="#fa4087" stroke="none"/>
              </svg>
              <span class="luxury-badge" style="top: 0; right: 0;">0</span>
            </a>
            <a class="book" href="#">BOOK NOW 👑</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(400);

  await page.screenshot({ path: 'previews/cart-icon-comparison.png', fullPage: true });
  console.log('Saved previews/cart-icon-comparison.png');
  await browser.close();
})();
