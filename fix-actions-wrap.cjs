const fs = require('fs');

console.log('--- Applying flex-wrap: wrap to pdp-actions-row ---');

function fixActionsRow(filePath) {
  let css = fs.readFileSync(filePath, 'utf-8');

  // Replace rigid flex-direction: row with wrap-friendly row
  css = css.replace(
    /\.pdp-actions-row\s*\{[\s\S]*?flex-direction:\s*row\s*!important;[\s\S]*?\}/g,
    `.pdp-actions-row {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 10px !important;
  margin: 18px 0 14px !important;
  width: 100% !important;
}`
  );

  fs.writeFileSync(filePath, css, 'utf-8');
  console.log('Updated:', filePath);
}

['press-by-heart/assets/product.css', 'product.css'].forEach(fixActionsRow);
