const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage();

  const mockups = ['Home.png', 'shop all.png', 'shop by design.png', 'kids.png'];

  for (const m of mockups) {
    if (!fs.existsSync(m)) continue;
    const base64 = fs.readFileSync(m).toString('base64');
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0;">
        <img id="mockup" src="data:image/png;base64,${base64}" style="display: block;">
      </body>
      </html>
    `);
    await page.waitForSelector('#mockup');
    const dim = await page.evaluate(() => {
      const img = document.getElementById('mockup');
      return { w: img.naturalWidth, h: img.naturalHeight };
    });
    console.log(`${m} dimensions:`, dim);

    await page.setViewportSize({ width: dim.w, height: 400 });

    // Capture top 120px full width
    const safeName = m.replace(/\s+/g, '-').replace('.png', '');
    await page.screenshot({
      path: `previews/mockup-${safeName}-header.png`,
      clip: { x: 0, y: 0, width: dim.w, height: Math.min(130, dim.h) }
    });
    // Capture top right header
    await page.screenshot({
      path: `previews/mockup-${safeName}-right.png`,
      clip: { x: dim.w - 400, y: 0, width: 400, height: Math.min(90, dim.h) }
    });
    console.log(`Saved previews for ${m}`);
  }

  await browser.close();
})();
