const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage();
  const filePath = 'file:///' + path.resolve('Home.png').replace(/\\/g, '/');
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background: #fff;">
      <img src="${filePath}" style="display: block; width: 863px; height: 1822px;">
    </body>
    </html>
  `);
  await page.setViewportSize({ width: 863, height: 300 });

  await page.screenshot({
    path: 'previews/home-exact-header.png',
    clip: { x: 350, y: 0, width: 513, height: 75 }
  });
  console.log('Saved previews/home-exact-header.png');
  await browser.close();
})();
