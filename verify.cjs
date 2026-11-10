const { chromium } = require('C:/Users/devnh/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));fs.mkdirSync('previews',{recursive:true});const results=[];
 for(const width of [863,1440,1920,2560,768,701,700,600,480,390,320]){
  await page.setViewportSize({width,height:1000});await page.goto('file:///C:/Users/devnh/Downloads/shopify/index.html');await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(async()=>{document.querySelectorAll('img').forEach(img=>img.loading='eager');await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})))});
  if([863,1440,1920,768,390,320].includes(width))await page.screenshot({path:`previews/home-${width}.png`,fullPage:true});
  if([863,1920,390].includes(width))await page.locator('.hero').screenshot({path:`previews/hero-${width}.png`});
  const result=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('header,.hero,.collections,.benefits,.best-sellers,.features,.why,.social,footer')].map(el=>({name:el.className||el.tagName,y:Math.round(el.getBoundingClientRect().top),height:Math.round(el.getBoundingClientRect().height)})),missingImages:[...document.images].filter(x=>!x.complete||!x.naturalWidth).map(x=>x.src),fonts:{poppins:document.fonts.check('12px Poppins'),allura:document.fonts.check('50px Allura')},heroButton:document.querySelector('.shop-button').tagName,heroText:document.querySelector('#hero-title').textContent}));
  result.alignment=await page.evaluate(()=>{
   const rect=s=>{const b=document.querySelector(s).getBoundingClientRect();return {left:b.left,width:b.width,height:b.height}};
   return {topBackground:rect('.announcement-bar'),topContent:rect('.announcement'),header:rect('header'),main:rect('.content-container'),hero:rect('.hero'),heroContent:rect('.hero-container'),footerBackground:rect('footer'),footerContent:rect('.footer-inner')};
  });
  const a=result.alignment;
  result.lowerSections=await page.evaluate(()=>[...document.querySelectorAll('.features,.why,.social')].map(el=>{
   const b=el.getBoundingClientRect(),container=el.closest('.content-container'),c=container?.getBoundingClientRect();
   return {section:el.className,inContainer:!!container,withinBounds:!!c&&b.left>=c.left&&b.right<=c.right};
  }));
  if(result.lowerSections.some(x=>!x.inContainer||!x.withinBounds))throw Error('Lower section container check failed at '+width);
  if(await page.locator('#social-grid .instagram-card').count()!==6)throw Error('Instagram demo feed requires six cards');
  result.polish=await page.evaluate(()=>{
   const overlap=[...document.querySelectorAll('.collection')].some(el=>el.querySelector('p').getBoundingClientRect().bottom>el.querySelector('.outline').getBoundingClientRect().top+1);
   const clipped=[...document.querySelectorAll('.feature-content,.product h3,.collection h2,.footer-grid>div')].some(el=>el.scrollWidth>el.clientWidth+2);
   const links=[...document.querySelectorAll('.feature a')].map(el=>({top:el.getBoundingClientRect().top,row:el.closest('.feature').getBoundingClientRect().top}));
   const ctaAligned=links.every(a=>links.filter(b=>Math.abs(a.row-b.row)<1).every(b=>Math.abs(a.top-b.top)<1));
   return {collectionOverlap:overlap,clippedText:clipped,promoLinksAligned:ctaAligned,mainHeadings:document.querySelectorAll('h1').length};
  });
  if(result.polish.collectionOverlap||result.polish.clippedText||!result.polish.promoLinksAligned||result.polish.mainHeadings!==1)throw Error('Visual consistency check failed at '+width+': '+JSON.stringify(result.polish));
  const aligned=[a.topContent,a.header,a.footerContent,a.heroContent].every(x=>Math.abs(x.left-a.main.left)<1&&Math.abs(x.width-a.main.width)<1);
  if(!aligned||a.hero.width!==width||a.topBackground.width!==width||a.footerBackground.width!==width)throw Error('Full-width background/container alignment failed at '+width);
  if(result.width!==result.scrollWidth||result.missingImages.length||!result.fonts.poppins||!result.fonts.allura)throw Error('Layout/asset check failed at '+width);results.push(result);
 }
 await page.setViewportSize({width:863,height:1000});await page.goto('file:///C:/Users/devnh/Downloads/shopify/index.html');await page.locator('.shop-button').click();await page.waitForTimeout(800);const shopButtonWorks=await page.evaluate(()=>Math.abs(scrollY-Math.min(document.querySelector('#best-sellers').getBoundingClientRect().top+scrollY,document.documentElement.scrollHeight-innerHeight))<3);
 await page.locator('.add').first().click();const bagWorks=await page.evaluate(()=>JSON.parse(localStorage.getItem('pressByHeartBag')).includes('CLASSIC NUDE'));
 const first=await page.locator('.product h3').first().textContent();await page.locator('.next').click();const carouselWorks=first!==await page.locator('.product h3').first().textContent();
 const initialReview=await page.locator('.review-text').textContent();
 await page.locator('.review-next').click();
 if(initialReview===await page.locator('.review-text').textContent())throw Error('Review next arrow did not change slide');
 await page.locator('[data-review="0"]').click();
 if(initialReview!==await page.locator('.review-text').textContent())throw Error('Review pagination did not restore first slide');
 await page.locator('.testimonial').focus();await page.keyboard.press('ArrowLeft');
 if(await page.locator('[data-review="2"]').getAttribute('aria-current')!=='true')throw Error('Review keyboard/wraparound check failed');
 const report={results,errors,interactions:{shopButtonWorks,bagWorks,carouselWorks}};fs.writeFileSync('previews/validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify({viewports:results.map(x=>({width:x.width,scrollWidth:x.scrollWidth,height:x.height})),errors,interactions:report.interactions},null,2));if(errors.length||!shopButtonWorks||!bagWorks||!carouselWorks)throw Error('Interaction check failed');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});


