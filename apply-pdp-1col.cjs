const fs = require('fs');

console.log('--- Applying Full Mobile 1-Col Layout and PDP Organization ---');

const pdpMobileGridCSS = `

/* ==========================================================================
   MOBILE RESPONSIVE PDP LAYOUT (<= 700PX)
   Single-column elegant flow: Gallery -> Details -> Reviews -> Related
   ========================================================================== */
@media (max-width: 700px) {
  .pdp-content {
    padding: 0 16px 40px !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
  }

  .pdp-main-grid {
    display: flex !important;
    flex-direction: column !important;
    grid-template-columns: 1fr !important;
    gap: 22px !important;
    width: 100% !important;
    margin-bottom: 24px !important;
  }

  .pdp-gallery {
    width: 100% !important;
    max-width: 100% !important;
    order: 1 !important;
  }

  .pdp-main-media {
    width: 100% !important;
    aspect-ratio: 1 / 1 !important;
    border-radius: 12px !important;
  }

  .pdp-thumbnails {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .pdp-trust-row {
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 6px !important;
    padding: 10px 14px !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .pdp-details {
    width: 100% !important;
    max-width: 100% !important;
    order: 2 !important;
  }

  .pdp-title {
    font-size: 24px !important;
    line-height: 1.25 !important;
    margin: 0 0 8px 0 !important;
  }

  .pdp-rating-row {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 8px !important;
    margin-bottom: 10px !important;
  }

  .pdp-price-row {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    margin-bottom: 8px !important;
  }

  .pdp-current-price {
    font-size: 22px !important;
  }

  .pdp-desc-text {
    font-size: 13.5px !important;
    line-height: 1.55 !important;
    margin-bottom: 14px !important;
  }

  .pdp-option-group {
    margin-bottom: 12px !important;
  }

  .pdp-actions-row {
    display: grid !important;
    grid-template-columns: 104px 1fr !important;
    gap: 8px !important;
    width: 100% !important;
    margin: 14px 0 !important;
    box-sizing: border-box !important;
  }

  .pdp-qty-wrap {
    grid-column: 1 !important;
    width: 104px !important;
    height: 44px !important;
    max-height: 44px !important;
    flex: none !important;
  }

  .pdp-add-btn {
    grid-column: 2 !important;
    width: 100% !important;
    height: 44px !important;
    max-height: 44px !important;
    font-size: 13px !important;
    padding: 0 10px !important;
    flex: none !important;
  }

  .pdp-buy-btn {
    grid-column: 1 / -1 !important;
    width: 100% !important;
    height: 44px !important;
    max-height: 44px !important;
    font-size: 13px !important;
    margin-top: 2px !important;
    flex: none !important;
  }

  .pdp-reviews-section {
    padding: 16px !important;
    border-radius: 12px !important;
    margin: 20px 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .pdp-reviews-summary {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }

  .pdp-review-cards {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  .pdp-related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 12px !important;
    width: 100% !important;
  }

  .product-page .benefits,
  .product-page .design-services {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 14px 10px !important;
    padding: 14px 12px !important;
    height: auto !important;
  }
}
`;

['press-by-heart/assets/product.css', 'product.css'].forEach(f => {
  if (fs.existsSync(f)) {
    let css = fs.readFileSync(f, 'utf-8');
    css += pdpMobileGridCSS;
    fs.writeFileSync(f, css, 'utf-8');
    console.log('✓ Added mobile 1-column layout to', f);
  }
});
