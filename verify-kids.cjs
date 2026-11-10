const {chromium}=require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
 for(const width of [866,1440,1920,768,701,700,600,480,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto('file:///C:/Users/devnh/Downloads/shopify/kids.html');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode()))});
  if([866,1440,1920,768,390,320].includes(width))await page.screenshot({path:`previews/kids-${width}.png`,fullPage:true});
  const result=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,products:document.querySelectorAll('.kids-product').length,headingCount:document.querySelectorAll('h1').length,menuOpen:!document.querySelector('#kids-menu').hidden,clipped:[...document.querySelectorAll('.kids-product h3,.kids-benefits>div,.kids-services>div,.kids-promo h2')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.textContent),missing:[...document.images].filter(img=>!img.naturalWidth).map(img=>img.src),containerAlignment:['header','.kids-hero-container','.content-container','.footer-inner'].map(selector=>{const b=document.querySelector(selector).getBoundingClientRect();return {selector,left:b.left,width:b.width}})}));
  results.push(result);if(result.menuOpen||result.scrollWidth!==width||result.products!==5||result.headingCount!==1||result.clipped.length||result.missing.length)throw Error(JSON.stringify(result));
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto('file:///C:/Users/devnh/Downloads/shopify/kids.html');
 await page.locator('.kids-menu-toggle').hover();if(await page.locator('#kids-menu').evaluate(el=>el.hidden))throw Error('Hover did not open menu');
 if(!await page.locator('.kids-menu-backdrop').evaluate(el=>el.classList.contains('is-visible')))throw Error('Menu backdrop did not open');
 await page.locator('#kids-menu [data-filter="new"]').hover();await page.waitForTimeout(250);if(await page.locator('#kids-menu').evaluate(el=>el.hidden))throw Error('Menu closed while moving into submenu');
 await page.screenshot({path:'previews/kids-menu-1440.png',fullPage:false});
 await page.mouse.move(5,800);await page.waitForTimeout(250);if(!await page.locator('#kids-menu').evaluate(el=>el.hidden))throw Error('Menu did not close after hover left');
 if(await page.locator('.kids-menu-backdrop').evaluate(el=>el.classList.contains('is-visible')))throw Error('Backdrop did not close with menu');
 await page.keyboard.press('Escape');if(!await page.locator('#kids-menu').evaluate(el=>el.hidden))throw Error('Escape did not close menu');
 await page.locator('.kids-menu-toggle').click();if(await page.locator('#kids-menu').evaluate(el=>el.hidden))throw Error('Toggle did not open menu');
 await page.locator('[data-filter="glitter"]').click();if(await page.locator('.kids-product:visible').count()!==2)throw Error('Glitter filter failed');
 await page.locator('.kids-section-heading [data-filter="all"]').click();if(await page.locator('.kids-product:visible').count()!==5)throw Error('View all failed');
 await page.locator('.kids-add').first().click();if(!await page.evaluate(()=>JSON.parse(localStorage.getItem('pressByHeartBag')||'[]').includes('LITTLE BLOSSOM')))throw Error('Bag failed');
 await page.setViewportSize({width:390,height:900});const drawer=page.locator('#mobile-app-drawer');if(await drawer.evaluate(el=>el.classList.contains('is-open')))throw Error('Mobile app drawer must start collapsed');
 await page.locator('.mobile-app-menu-btn').click();if(!await drawer.evaluate(el=>el.classList.contains('is-open')))throw Error('Mobile menu toggle failed');
 await page.locator('.app-drawer-close').click();if(await drawer.evaluate(el=>el.classList.contains('is-open')))throw Error('Mobile menu close failed');
 if(errors.length)throw Error(errors.join('\n'));
 fs.writeFileSync('previews/kids-validation.json',JSON.stringify({results,errors,menu:true,filters:true,bag:true},null,2));console.log(JSON.stringify({viewports:results.map(x=>({width:x.width,overflow:x.scrollWidth!==x.width,menuOpen:x.menuOpen})),errors,menu:true,filters:true,bag:true},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
