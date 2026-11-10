const fs = require('fs');

console.log('--- Applying SVG size and Trust Row / Rating Row safeguards ---');

const cssRules = `

/* ==========================================================================
   PDP ADD BUTTON SVG & TRUST ROW OVERFLOW FIXES
   ========================================================================== */
.pdp-add-btn svg {
  width: 16px !important;
  height: 16px !important;
  max-width: 16px !important;
  max-height: 16px !important;
  stroke: currentColor !important;
  stroke-width: 2 !important;
  fill: none !important;
  flex-shrink: 0 !important;
  display: inline-block !important;
  vertical-align: middle !important;
}

.pdp-rating-row {
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
}

@media (max-width: 700px) {
  .pdp-trust-row {
    grid-template-columns: 1fr !important;
    gap: 8px !important;
    padding: 10px 14px !important;
  }
}
`;

['press-by-heart/assets/product.css', 'product.css'].forEach(f => {
  if (fs.existsSync(f)) {
    let css = fs.readFileSync(f, 'utf-8');
    css += cssRules;
    fs.writeFileSync(f, css, 'utf-8');
    console.log('✓ Added SVG & Trust Row CSS to', f);
  }
});

// Also add width="16" height="16" explicitly to the SVG in product.html and main-product.liquid
['product.html', 'press-by-heart/sections/main-product.liquid'].forEach(f => {
  if (fs.existsSync(f)) {
    let html = fs.readFileSync(f, 'utf-8');
    html = html.replace(/<button class="pdp-add-btn"[^>]*>\s*<svg(?!\s+width="16")\s+viewBox="0 0 24 24"/g, '<button class="pdp-add-btn" id="pdp-add-btn" type="submit"><svg width="16" height="16" viewBox="0 0 24 24"');
    fs.writeFileSync(f, html, 'utf-8');
    console.log('✓ Added explicit 16x16 to SVG tag in', f);
  }
});
