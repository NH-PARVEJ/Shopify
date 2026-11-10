const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'small-360', width: 360, height: 740 }
];

const pages = [
  { name: 'home', file: 'index.html' },
  { name: 'product', file: 'product.html' },
  { name: 'category', file: 'category.html' },
  { name: 'shop-all', file: 'shop-all.html' },
  { name: 'shop-by-design', file: 'shop-by-design.html' }
];

async function runAudit() {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });

  const issues = [];

  for (const p of pages) {
    const fullPath = path.resolve(p.file);
    if (!fs.existsSync(fullPath)) {
      console.log(`[SKIP] Page not found: ${p.file}`);
      continue;
    }

    const page = await browser.newPage();

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('file:///' + fullPath.replace(/\\/g, '/'), { waitUntil: 'load' });

      // 1. Check Horizontal Overflow
      const overflow = await page.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const bodyW = document.body.scrollWidth;
        const isOverflow = docW > winW + 1 || bodyW > winW + 1;

        // Find elements causing overflow if any
        let culprit = null;
        if (isOverflow) {
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1) {
              culprit = {
                tag: el.tagName,
                class: el.className,
                id: el.id,
                right: r.right,
                width: r.width
              };
              break;
            }
          }
        }

        return { isOverflow, docW, winW, culprit };
      });

      if (overflow.isOverflow) {
        issues.push({
          type: 'HORIZONTAL_OVERFLOW',
          page: p.name,
          viewport: vp.name,
          details: `Doc width (${overflow.docW}px) > Window width (${overflow.winW}px)`,
          culprit: overflow.culprit
        });
      }

      // 2. Check Broken Images (naturalWidth === 0)
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(img => img.complete && img.naturalWidth === 0 && !img.src.includes('data:')).map(img => ({
          src: img.src,
          class: img.className,
          alt: img.alt
        }));
      });

      if (brokenImages.length > 0) {
        issues.push({
          type: 'BROKEN_IMAGES',
          page: p.name,
          viewport: vp.name,
          details: `${brokenImages.length} image(s) failed to load`,
          images: brokenImages
        });
      }

      // 3. Check Header alignment & Cart Bag
      const headerCheck = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        const bag = header.querySelector('.nav-bag');
        const bagSvg = bag ? bag.querySelector('svg') : null;
        const count = bag ? bag.querySelector('.bag-count') : null;

        return {
          bagExists: !!bag,
          bagVisible: bag ? window.getComputedStyle(bag).display !== 'none' : false,
          bagWidth: bag ? bag.offsetWidth : 0,
          bagHeight: bag ? bag.offsetHeight : 0,
          svgVisible: bagSvg ? window.getComputedStyle(bagSvg).display !== 'none' : false,
          svgStroke: bagSvg ? window.getComputedStyle(bagSvg).stroke : 'none',
          svgFill: bagSvg ? window.getComputedStyle(bagSvg).fill : 'none',
          countText: count ? count.textContent.trim() : null,
          countBg: count ? window.getComputedStyle(count).backgroundColor : null
        };
      });

      if (headerCheck && (!headerCheck.bagExists || headerCheck.bagWidth === 0 || headerCheck.svgStroke === 'none')) {
        issues.push({
          type: 'BROKEN_HEADER_CART',
          page: p.name,
          viewport: vp.name,
          details: headerCheck
        });
      }

      // 4. Check Mobile Menu button on mobile
      if (vp.width <= 700) {
        const mobileBtnCheck = await page.evaluate(() => {
          const btn = document.querySelector('.mobile-app-menu-btn');
          if (!btn) return { exists: false };
          const cs = window.getComputedStyle(btn);
          return {
            exists: true,
            display: cs.display,
            width: btn.offsetWidth,
            height: btn.offsetHeight
          };
        });

        if (!mobileBtnCheck.exists || mobileBtnCheck.display === 'none' || mobileBtnCheck.width === 0) {
          issues.push({
            type: 'MISSING_HAMBURGER_BUTTON',
            page: p.name,
            viewport: vp.name,
            details: mobileBtnCheck
          });
        }
      }
    }
    await page.close();
  }

  await browser.close();

  console.log('\n========================================');
  console.log(`AUDIT FINISHED: Found ${issues.length} potential issues:`);
  console.log('========================================');
  issues.forEach((iss, idx) => {
    console.log(`[#${idx + 1}] [${iss.type}] on ${iss.page} (${iss.viewport}):`);
    console.log('    Details:', iss.details);
    if (iss.culprit) console.log('    Culprit:', iss.culprit);
    if (iss.images) console.log('    Images:', iss.images);
  });

  return issues;
}

runAudit().catch(e => console.error(e));
