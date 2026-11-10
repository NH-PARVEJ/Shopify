const fs = require('fs');

console.log('--- Applying Mobile Typography & Standardization Updates ---');

// 1. Update refinements.css
function updateRefinements(filePath) {
  let css = fs.readFileSync(filePath, 'utf-8');

  // Fix early mobile-app-menu-btn
  css = css.replace(
    /(\.mobile-app-menu-btn\s*\{[\s\S]*?width:\s*)32px([\s\S]*?height:\s*)32px([\s\S]*?\.mobile-app-menu-btn svg\s*\{[\s\S]*?width:\s*)17px([\s\S]*?height:\s*)17px/g,
    '$142px$242px$322px$422px'
  );

  // Fix second mobile-app-menu-btn
  css = css.replace(
    /(\.mobile-app-menu-btn\s*\{[\s\S]*?width:\s*)36px\s*!important([\s\S]*?height:\s*)36px\s*!important/g,
    '$142px !important$242px !important'
  );

  // Fix header .book font size in mobile
  css = css.replace(
    /(header\s+\.book\s*\{[\s\S]*?font-size:\s*)8px\s*!important/g,
    '$112px !important'
  );

  // Fix product card mobile font sizes
  css = css.replace(
    /(\.product h3,\s*\.kids-product h3,\s*\.shop-card-title,\s*\.design-card-title\s*\{[\s\S]*?font-size:\s*)10px\s*!important([\s\S]*?min-height:\s*)28px\s*!important/g,
    '$113.5px !important$236px !important'
  );

  css = css.replace(
    /(\.product \.price,\s*\.kids-product p,\s*\.shop-card-price,\s*\.design-card-price\s*\{[\s\S]*?font-size:\s*)12\.5px\s*!important/g,
    '$114px !important; font-weight: 700 !important'
  );

  css = css.replace(
    /(\.product \.add,\s*\.kids-add,\s*\.shop-card-btn,\s*\.design-card-btn\s*\{[\s\S]*?height:\s*)34px\s*!important([\s\S]*?min-height:\s*)34px\s*!important([\s\S]*?font-size:\s*)9px\s*!important/g,
    '$138px !important$238px !important$312.5px !important; font-weight: 600 !important'
  );

  // Fix app-drawer-link font size
  css = css.replace(
    /(\.app-drawer-link\s*\{[\s\S]*?font-size:\s*)11\.5px\s*!important/g,
    '$115px !important; min-height: 44px !important; font-weight: 500 !important'
  );

  // Append master mobile standards block if not already present
  const mobileMasterMarker = '/* === STANDARDIZED MOBILE TYPOGRAPHY & TOUCH TARGETS (MAX-WIDTH: 768PX) === */';
  if (!css.includes(mobileMasterMarker)) {
    const mobileMasterCSS = `

${mobileMasterMarker}
@media (max-width: 768px) {
  html, body {
    font-size: 14px !important;
    line-height: 1.55 !important;
  }

  p,
  .intro,
  .description,
  .shop-description,
  .design-description,
  .kids-description,
  .feature p,
  .why p,
  .testimonial p,
  .review-body,
  .pdp-description,
  .pdp-description p,
  .pdp-review-card p {
    font-size: 14px !important;
    line-height: 1.55 !important;
  }

  h1,
  .hero h1,
  .shop-hero h1,
  .design-hero h1,
  .kids-hero h1,
  .pdp-title {
    font-size: 25px !important;
    line-height: 1.25 !important;
  }

  .shop-script,
  .design-script,
  .kids-script {
    font-size: 24px !important;
    line-height: 1.2 !important;
  }

  h2,
  .collections-title,
  .section-heading h2,
  .why h2,
  .features h2,
  .social h2,
  .feature h2,
  .kids-section-heading h2,
  .kids-promo h2,
  .kids-menu h2,
  .pdp-reviews-section h2 {
    font-size: 20px !important;
    line-height: 1.3 !important;
  }

  h3,
  .product h3,
  .kids-product h3,
  .shop-card-title,
  .shop-card h2,
  .shop-card h3,
  .design-card-title,
  .design-card h2,
  .design-card h3,
  .collection h2,
  .collection h3,
  .pdp-related-card h3 {
    font-size: 13.5px !important;
    line-height: 1.35 !important;
    font-weight: 600 !important;
  }

  .price,
  .product .price,
  .kids-product p,
  .shop-card-price,
  .design-card-price,
  .pdp-price,
  .product-price {
    font-size: 14px !important;
    font-weight: 700 !important;
    line-height: 1.3 !important;
  }

  .eyebrow {
    font-size: 12.5px !important;
    line-height: 1.4 !important;
  }

  .add,
  .product .add,
  .kids-add,
  .shop-card-btn,
  .design-card-btn,
  .outline,
  .view-all,
  .book,
  .shop-primary,
  .design-primary,
  .kids-primary,
  .pdp-add-btn,
  .pdp-buy-btn,
  .newsletter button {
    font-size: 12.5px !important;
    font-weight: 600 !important;
    min-height: 40px !important;
    padding: 8px 14px !important;
    box-sizing: border-box !important;
  }

  .announcement {
    font-size: 12px !important;
    height: 36px !important;
    line-height: 36px !important;
  }
  .announcement a,
  .announcement .phone-number {
    font-size: 12px !important;
  }

  .benefits b,
  .kids-benefits strong,
  .shop-benefits strong,
  .design-services strong {
    font-size: 13px !important;
    font-weight: 600 !important;
    line-height: 1.3 !important;
  }

  .benefits p,
  .kids-benefits p,
  .shop-benefits p,
  .design-services span,
  .design-services p {
    font-size: 12px !important;
    line-height: 1.45 !important;
  }

  footer h3 {
    font-size: 14px !important;
    font-weight: 700 !important;
    line-height: 1.4 !important;
  }

  footer p,
  footer a,
  .copyright {
    font-size: 13px !important;
    line-height: 1.6 !important;
  }

  .mobile-app-menu-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 42px !important;
    height: 42px !important;
    min-width: 42px !important;
    min-height: 42px !important;
    border-radius: 8px !important;
    background: #fff0f5 !important;
    border: 1.5px solid #ffd2e2 !important;
    color: #fa4087 !important;
    cursor: pointer !important;
    flex-shrink: 0 !important;
    order: 1 !important;
    padding: 0 !important;
    transition: all 0.18s ease !important;
    -webkit-tap-highlight-color: transparent !important;
  }

  .mobile-app-menu-btn svg {
    width: 22px !important;
    height: 22px !important;
    stroke: #fa4087 !important;
    stroke-width: 2.4 !important;
    display: block !important;
  }

  .mobile-app-menu-btn:active {
    background: #ffe3ee !important;
    transform: scale(0.94) !important;
  }

  .app-drawer-content {
    width: 320px !important;
    max-width: 88vw !important;
  }

  .app-drawer-link {
    font-size: 15px !important;
    font-weight: 500 !important;
    padding: 12px 14px !important;
    min-height: 44px !important;
    display: flex !important;
    align-items: center !important;
  }

  .app-drawer-sublink {
    font-size: 13.5px !important;
    padding: 8px 12px !important;
  }

  .app-drawer-delivery {
    font-size: 12.5px !important;
    line-height: 1.4 !important;
    padding: 10px 16px !important;
  }

  .app-drawer-close {
    width: 38px !important;
    height: 38px !important;
    font-size: 16px !important;
  }

  .mobile-app-dock,
  nav.mobile-app-dock {
    height: 60px !important;
  }

  .app-tab {
    font-size: 11px !important;
    line-height: 14px !important;
  }

  .app-tab-icon {
    width: 24px !important;
    height: 24px !important;
  }

  .app-tab-icon svg {
    width: 21px !important;
    height: 21px !important;
    stroke-width: 2 !important;
  }

  .cart-sidebar-panel {
    width: 100% !important;
    max-width: 100vw !important;
  }

  .cart-promo-section,
  .cart-promo-wrap {
    width: 100% !important;
    gap: 8px !important;
  }

  .cart-promo-input-wrap,
  .cart-promo-input-row {
    width: 100% !important;
    gap: 8px !important;
  }

  .cart-promo-input-wrap input,
  .cart-promo-input-row input,
  #cart-promo-input,
  .cart-promo-input {
    flex: 1 1 auto !important;
    min-width: 0 !important;
    width: 100% !important;
    height: 42px !important;
    padding: 0 12px !important;
    font-size: 13.5px !important;
    border-radius: 8px !important;
    box-sizing: border-box !important;
  }

  .cart-promo-input-wrap input::placeholder,
  .cart-promo-input-row input::placeholder,
  #cart-promo-input::placeholder,
  .cart-promo-input::placeholder {
    font-size: 12px !important;
    color: #a8848d !important;
  }

  .cart-promo-input-wrap button,
  .cart-promo-input-row button,
  #cart-promo-apply-btn,
  .cart-promo-btn {
    height: 42px !important;
    padding: 0 16px !important;
    font-size: 12.5px !important;
    font-weight: 700 !important;
    border-radius: 8px !important;
    flex-shrink: 0 !important;
  }

  .cart-summary-row {
    font-size: 13.5px !important;
  }

  .cart-sidebar-checkout-btn {
    height: 48px !important;
    font-size: 14.5px !important;
    font-weight: 700 !important;
  }
}
`;
    css += mobileMasterCSS;
  }
  fs.writeFileSync(filePath, css, 'utf-8');
  console.log('Updated:', filePath);
}

// 2. Update style.css
function updateStyleCSS(filePath) {
  let css = fs.readFileSync(filePath, 'utf-8');

  // Replace tiny rems in @media(max-width:700px) in style.css
  css = css.replace(
    /\.announcement\{padding:0 12rem;font-size:7rem;height:33rem\}/g,
    '.announcement{padding:0 12px;font-size:12px;height:36px;line-height:36px}'
  );
  css = css.replace(
    /h1\{font-size:20rem\}/g,
    'h1{font-size:25px;line-height:1.25}'
  );
  css = css.replace(
    /\.intro\{font-size:10rem\}/g,
    '.intro{font-size:14px;line-height:1.55}'
  );
  css = css.replace(
    /\.collection h2\{font-size:16rem\}/g,
    '.collection h2{font-size:18px}'
  );
  css = css.replace(
    /\.benefits b\{font-size:8rem\}/g,
    '.benefits b{font-size:13px}'
  );
  css = css.replace(
    /\.feature h2\{font-size:14rem\}/g,
    '.feature h2{font-size:18px}'
  );
  css = css.replace(
    /\.social h2\{font-size:15rem\}/g,
    '.social h2{font-size:18px}'
  );
  css = css.replace(
    /footer p,footer a\{font-size:10rem;line-height:18rem\}/g,
    'footer p,footer a{font-size:13px;line-height:1.6}'
  );

  fs.writeFileSync(filePath, css, 'utf-8');
  console.log('Updated:', filePath);
}

// Update both press-by-heart and root files
['press-by-heart/assets/refinements.css', 'refinements.css'].forEach(f => {
  if (fs.existsSync(f)) updateRefinements(f);
});

['press-by-heart/assets/style.css', 'style.css'].forEach(f => {
  if (fs.existsSync(f)) updateStyleCSS(f);
});

// 3. Update shop-all.css
const shopAllPath = 'press-by-heart/assets/shop-all.css';
if (fs.existsSync(shopAllPath)) {
  let css = fs.readFileSync(shopAllPath, 'utf-8');
  css = css.replace(/\.shop-description\s*\{[^}]*font-size:\s*12rem;[^}]*\}/g, '.shop-description { font-size: 14px; line-height: 1.55; margin: 8px 0 10px; }');
  css = css.replace(/\.shop-hero h1\s*\{[^}]*font-size:\s*38rem;[^}]*\}/g, '.shop-hero h1 { font-size: 26px; line-height: 1.25; }');
  css = css.replace(/\.shop-script\s*\{[^}]*font-size:\s*31rem;[^}]*\}/g, '.shop-script { font-size: 24px; line-height: 1.2; }');
  fs.writeFileSync(shopAllPath, css, 'utf-8');
  console.log('Updated:', shopAllPath);
}

// 4. Update kids.css
const kidsPath = 'press-by-heart/assets/kids.css';
if (fs.existsSync(kidsPath)) {
  let css = fs.readFileSync(kidsPath, 'utf-8');
  css = css.replace(/\.kids-description\s*\{[^}]*font-size:\s*12rem[^}]*\}/g, '.kids-description { font-size: 14px; line-height: 1.55; }');
  css = css.replace(/\.kids-hero h1\s*\{[^}]*font-size:\s*38rem;[^}]*\}/g, '.kids-hero h1 { font-size: 26px; line-height: 1.25; }');
  css = css.replace(/\.kids-script\s*\{[^}]*font-size:\s*31rem;[^}]*\}/g, '.kids-script { font-size: 24px; line-height: 1.2; }');
  css = css.replace(/\.kids-benefits strong\s*\{[^}]*font-size:\s*8rem[^}]*\}/g, '.kids-benefits strong { font-size: 13px; }');
  css = css.replace(/\.kids-benefits p>span\s*\{[^}]*font-size:\s*9rem[^}]*\}/g, '.kids-benefits p>span { font-size: 12px; }');
  fs.writeFileSync(kidsPath, css, 'utf-8');
  console.log('Updated:', kidsPath);
}

// 5. Update product.css
const pdpPath = 'press-by-heart/assets/product.css';
if (fs.existsSync(pdpPath)) {
  let css = fs.readFileSync(pdpPath, 'utf-8');
  css = css.replace(/\.pdp-title\s*\{[^}]*font-size:\s*20rem;[^}]*\}/g, '.pdp-title { font-size: 24px; line-height: 1.3; }');
  fs.writeFileSync(pdpPath, css, 'utf-8');
  console.log('Updated:', pdpPath);
}

// 6. Update shop-by-design.css
const designPath = 'press-by-heart/assets/shop-by-design.css';
if (fs.existsSync(designPath)) {
  let css = fs.readFileSync(designPath, 'utf-8');
  css = css.replace(/\.design-description\s*\{[^}]*font-size:\s*12rem;[^}]*\}/g, '.design-description { font-size: 14px; line-height: 1.55; margin: 8px 0 10px; }');
  css = css.replace(/\.design-hero h1\s*\{[^}]*font-size:\s*38rem;[^}]*\}/g, '.design-hero h1 { font-size: 26px; line-height: 1.25; }');
  css = css.replace(/\.design-script\s*\{[^}]*font-size:\s*31rem;[^}]*\}/g, '.design-script { font-size: 24px; line-height: 1.2; }');
  fs.writeFileSync(designPath, css, 'utf-8');
  console.log('Updated:', designPath);
}

// 7. Update sections/cart-drawer.liquid inline style
const cartDrawerPath = 'press-by-heart/sections/cart-drawer.liquid';
if (fs.existsSync(cartDrawerPath)) {
  let content = fs.readFileSync(cartDrawerPath, 'utf-8');
  content = content.replace(
    /#cart-sidebar-drawer \.cart-promo-input,\s*#cart-promo-input\s*\{[\s\S]*?font-size:\s*11\.5px\s*!important;/g,
    '#cart-sidebar-drawer .cart-promo-input,\n  #cart-promo-input {\n    flex: 1 1 auto !important;\n    min-width: 0 !important;\n    width: 100% !important;\n    height: 42px !important;\n    padding: 0 12px !important;\n    border: 1.5px solid #f1dde4 !important;\n    border-radius: 8px !important;\n    background: #ffffff !important;\n    font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important;\n    font-size: 13.5px !important;'
  );
  content = content.replace(
    /#cart-sidebar-drawer \.cart-promo-input::placeholder,\s*#cart-promo-input::placeholder\s*\{[\s\S]*?font-size:\s*11px\s*!important;/g,
    '#cart-sidebar-drawer .cart-promo-input::placeholder,\n  #cart-promo-input::placeholder {\n    color: #a8848d !important;\n    font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important;\n    font-size: 12px !important;'
  );
  content = content.replace(
    /#cart-sidebar-drawer \.cart-promo-btn,\s*#cart-promo-apply-btn\s*\{[\s\S]*?padding:\s*0 18px\s*!important;[\s\S]*?font-size:\s*11\.5px\s*!important;/g,
    '#cart-sidebar-drawer .cart-promo-btn,\n  #cart-promo-apply-btn {\n    padding: 0 16px !important;\n    height: 42px !important;\n    background: #fdf0f4 !important;\n    border: 1.5px solid #f1dde4 !important;\n    border-radius: 8px !important;\n    color: #fa4087 !important;\n    font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important;\n    font-size: 12.5px !important;'
  );
  fs.writeFileSync(cartDrawerPath, content, 'utf-8');
  console.log('Updated:', cartDrawerPath);
}

console.log('--- All Mobile Typography & Sizing Updates Completed Successfully ---');
