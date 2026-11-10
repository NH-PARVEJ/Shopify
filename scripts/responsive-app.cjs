const fs=require('fs');const base='theme-validation/responsive-live';const p=base+'/assets/refinements.css';const css=fs.readFileSync(p,'utf8');function blockAt(start){const open=css.indexOf('{',start);let depth=1,i=open+1;for(;i<css.length&&depth;i++){if(css[i]==='{')depth++;else if(css[i]==='}')depth--;}return css.slice(open+1,i-1);}
const appStart=css.indexOf('@media (max-width: 700px)',css.indexOf('MOBILE APP'));const app=blockAt(appStart);if(!app.includes('.app-drawer-content'))throw Error('Mobile rules not found');const headerStart=css.indexOf('@media (max-width: 700px)',css.indexOf('UNIFIED MOBILE APP VIEW'));const header=blockAt(headerStart).split('/* Universal 16px')[0];
let output='/* Tablet uses the established app navigation; desktop content keeps its approved layout. */\n@media(min-width:701px) and (max-width:1024px){\n'+app+'\n'+header+'\n}\n';
output+=`@media(max-width:1024px){
 body:has(.mobile-app-dock){padding-bottom:calc(66px + env(safe-area-inset-bottom,0px))!important}
 nav.mobile-app-dock{height:calc(58px + env(safe-area-inset-bottom,0px))!important;padding:0 4px env(safe-area-inset-bottom,0px)!important;gap:0!important;isolation:isolate}
 nav.mobile-app-dock .app-tab{min-width:0;min-height:44px;padding:4px 2px!important;white-space:nowrap;border-bottom:0!important;line-height:1.25;touch-action:manipulation}
 nav.mobile-app-dock .app-tab-label{font-size:10px;line-height:1.35}
 nav.mobile-app-dock .app-tab-icon img{width:22px;height:22px;object-fit:contain}
 .mobile-app-drawer{height:100dvh;z-index:100000!important}
 .app-drawer-content{max-height:100dvh;overscroll-behavior:contain;padding-bottom:env(safe-area-inset-bottom,0px)}
 .app-drawer-nav{overflow-y:auto;min-height:0;overscroll-behavior:contain}
 .app-drawer-link{min-height:44px}
 .app-drawer-close{min-width:40px;min-height:40px}
 .app-drawer-delivery{flex-wrap:wrap;justify-content:center;gap:3px 6px}
 .app-drawer-header,.app-drawer-delivery,.app-drawer-actions,.app-drawer-footer{flex-shrink:0}
 .shop-chips,.sbd-chips-row{overscroll-behavior-x:contain}
 #review-modal.pbh-review-popup{padding:16px!important}
 #review-modal .pbh-review-card{max-height:calc(100dvh - 32px)!important;overscroll-behavior:contain}
 #size-guide-modal{padding:16px!important;overflow-y:auto!important;overscroll-behavior:contain}
 #size-guide-modal .pdp-modal-content{max-width:100%!important;max-height:calc(100dvh - 32px);overflow:auto!important}
 .pdp-size-table{max-width:100%;table-layout:fixed}
 #cart-sidebar-drawer .cart-sidebar-panel{width:min(420px,100%)!important;max-width:100%!important;height:100dvh!important;max-height:100dvh!important}
 #cart-sidebar-drawer .cart-sidebar-body{min-height:0!important;overscroll-behavior:contain}
 #cart-sidebar-drawer .cart-sidebar-footer{padding-bottom:max(18px,env(safe-area-inset-bottom,0px))!important}
 input,textarea,select{scroll-margin-block:90px}
 .pdp-details,.pdp-gallery,.pdp-main-grid>*,.pbh-cart-info{min-width:0}
 .pdp-title,.pbh-cart-info h2,.pbh-cart-property{overflow-wrap:anywhere}
}
@media(min-width:701px) and (max-width:1024px){
 header .book{font-size:12px!important;padding:9px 14px!important}
 header .logo{height:36px!important;max-width:130px!important}
 header{height:64px!important;min-height:64px!important}
 .app-drawer-content{width:340px;max-width:86vw}
 nav.mobile-app-dock .app-tab-label{font-size:11px}
}
@media(max-width:360px){header{gap:4px!important;padding-inline:8px!important}header .book{font-size:9px!important;padding:7px 6px!important}header .logo{max-width:90px!important}.pdp-trust-row{gap:6px!important}.pdp-trust-item{min-width:0}.pdp-trust-item strong,.pdp-trust-item span{white-space:normal!important}.pdp-payment-methods{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.app-drawer-content,.app-drawer-overlay,.mobile-app-drawer{transition:none!important}}
`;
fs.writeFileSync(base+'/assets/responsive-app.css',output);fs.writeFileSync('press-by-heart/assets/responsive-app.css',output);
for(const root of [base,'press-by-heart']){const p=root+'/layout/theme.liquid';let s=fs.readFileSync(p,'utf8');if(!s.includes("'responsive-app.css'"))s=s.replace('  {{ content_for_header }}',"  {{ 'responsive-app.css' | asset_url | stylesheet_tag }}\n  {{ content_for_header }}");s=s.replace('content="width=device-width, initial-scale=1"','content="width=device-width, initial-scale=1, viewport-fit=cover"');fs.writeFileSync(p,s);}
console.log('Added tablet app shell and safe-area/modal fixes.');
