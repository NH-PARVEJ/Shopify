const fs=require('node:fs');
const p='press-by-heart/assets/kids-menu.js';
const original=fs.readFileSync(p,'utf8');
fs.writeFileSync('theme-validation/live-before-product-fix/assets/kids-menu.js',original);
// Retain approved menu transitions. Shopify's existing commerce.js owns all cart behavior.
let menu=original.slice(0,original.indexOf('function initMobileAppView()'));
menu=menu.replace("  const header = document.querySelector('header');",`  const signal = window.pbhMenuController.signal;\n  const on = (target,event,handler) => target.addEventListener(event,handler,{signal});\n  signal.addEventListener('abort',()=>clearTimeout(menuCloseTimer),{once:true});\n  const header = document.querySelector('header');`);
menu=menu.replace(/(menuBackdrop|window|toggle|menu|document)\.addEventListener\(/g,'on($1, ');
menu=menu.replace("matchMedia('(max-width:700px)').addEventListener('change', () => setOpen(false));","on(matchMedia('(max-width:700px)'), 'change', () => setOpen(false));");
const kidsIcons=fs.readFileSync('kids.js','utf8').match(/const kidsIcons=([\s\S]*?);\s*document.querySelectorAll/)[1];
menu=menu.replace('const kidsMenuIcons = sharedMenuIcons;',`Object.assign(sharedMenuIcons, typeof paths === 'object' ? paths : {}, ${kidsIcons});\nconst kidsMenuIcons = sharedMenuIcons;`);
menu+=`\nfunction initApprovedMenus(){\n window.pbhMenuController?.abort();\n window.pbhMenuController=new AbortController();\n renderMenuIcons(document);\n initMegaMenu('#kids-menu','.kids-menu-toggle',()=>document.body.classList.contains('kids-page'));\n initMegaMenu('#shop-all-menu','.shop-all-menu-toggle',()=>document.body.classList.contains('shop-all-page'));\n initMegaMenu('#shop-by-design-menu','.shop-by-design-menu-toggle',()=>document.body.classList.contains('shop-by-design-page'));\n}\ninitApprovedMenus();\ndocument.addEventListener('shopify:section:load',initApprovedMenus);\n`;
fs.writeFileSync(p,menu);
