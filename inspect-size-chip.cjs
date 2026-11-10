const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage({ viewport: { width: 863, height: 1000 } });
  await page.goto('file:///' + path.resolve('product.html?id=1').replace(/\\/g, '/'));
  await page.waitForTimeout(300);

  const rects = await page.evaluate(() => {
    const sizeChip = document.querySelector('.pdp-size-chip[data-size="L"]');
    const actionsRow = document.querySelector('.pdp-actions-row');
    const svg = actionsRow ? actionsRow.querySelector('svg') : null;
    return {
      sizeChipRect: sizeChip ? sizeChip.getBoundingClientRect() : null,
      actionsRowRect: actionsRow ? actionsRow.getBoundingClientRect() : null,
      svgRect: svg ? svg.getBoundingClientRect() : null
    };
  });

  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
