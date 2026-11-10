const fs = require('fs');

console.log('--- Applying Micro-Mobile (<= 360px) Adjustments ---');

function updateStyles(filePath) {
  let css = fs.readFileSync(filePath, 'utf-8');

  // Fix header .nav-bag right padding safety
  if (!css.includes('/* MICRO-MOBILE HEADER & OVERFLOW SAFEGUARDS */')) {
    const microMobileCSS = `

/* MICRO-MOBILE HEADER & OVERFLOW SAFEGUARDS */
@media (max-width: 360px) {
  header {
    padding: 0 8px !important;
    gap: 6px !important;
  }
  header .mobile-app-menu-btn {
    width: 38px !important;
    height: 38px !important;
    min-width: 38px !important;
    min-height: 38px !important;
  }
  header .logo {
    max-width: 88px !important;
  }
  header .book {
    font-size: 10px !important;
    padding: 4px 6px !important;
  }
  header .nav-bag {
    margin-right: 4px !important;
  }
}

@media (max-width: 768px) {
  header .nav-bag {
    margin-right: 4px !important;
  }
  .pdp-modal-content {
    overflow-x: auto !important;
    max-width: 92vw !important;
  }
  .pdp-size-table {
    width: 100% !important;
    font-size: 11px !important;
  }
  .pdp-size-table th,
  .pdp-size-table td {
    padding: 6px 4px !important;
  }
}
`;
    css += microMobileCSS;
    fs.writeFileSync(filePath, css, 'utf-8');
    console.log('Updated:', filePath);
  }
}

['press-by-heart/assets/refinements.css', 'refinements.css'].forEach(updateStyles);

// Also update product.css
const pdpPath = 'press-by-heart/assets/product.css';
if (fs.existsSync(pdpPath)) {
  let pCss = fs.readFileSync(pdpPath, 'utf-8');
  if (!pCss.includes('overflow-x: auto')) {
    pCss += `
@media (max-width: 360px) {
  .pdp-modal-content {
    overflow-x: auto !important;
    max-width: 90vw !important;
    padding: 16px 12px !important;
  }
  .pdp-size-table th,
  .pdp-size-table td {
    padding: 4px 3px !important;
    font-size: 9px !important;
  }
}
`;
    fs.writeFileSync(pdpPath, pCss, 'utf-8');
    console.log('Updated product.css');
  }
}
