const fs = require('fs');

console.log('--- Applying Grid-based Mobile Actions & Escape Key Handler ---');

// 1. Update product.css and press-by-heart/assets/product.css
const gridActionsCSS = `

/* ==========================================================================
   PERFECTED PDP ACTION BUTTONS GRID & PROPORTIONS
   ========================================================================== */
.pdp-actions-row {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 12px !important;
  margin: 18px 0 14px !important;
  width: 100% !important;
}

.pdp-qty-wrap {
  display: inline-flex !important;
  align-items: center !important;
  border: 1.5px solid #ffd2e2 !important;
  border-radius: 8px !important;
  background: #ffffff !important;
  height: 46px !important;
  max-height: 46px !important;
  width: 110px !important;
  flex: 0 0 110px !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}

.pdp-qty-btn {
  width: 34px !important;
  height: 100% !important;
  border: none !important;
  background: #fff0f5 !important;
  color: #fa4087 !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: background 0.18s ease !important;
}

.pdp-qty-input {
  width: 42px !important;
  height: 100% !important;
  border: none !important;
  text-align: center !important;
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
  background: transparent !important;
}

.pdp-add-btn {
  flex: 1 1 auto !important;
  height: 46px !important;
  max-height: 46px !important;
  min-height: 46px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  background: linear-gradient(105deg, #fa4087, #f13d84) !important;
  color: #ffffff !important;
  border: 1px solid #ff4c92 !important;
  border-radius: 8px !important;
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  cursor: pointer !important;
  text-transform: uppercase !important;
  box-shadow: 0 4px 14px rgba(250, 64, 135, 0.28) !important;
  transition: all 0.2s ease !important;
  padding: 0 20px !important;
  box-sizing: border-box !important;
}

.pdp-buy-btn {
  height: 46px !important;
  max-height: 46px !important;
  min-height: 46px !important;
  padding: 0 22px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: #1a1a1a !important;
  color: #ffffff !important;
  border: 1px solid #1a1a1a !important;
  border-radius: 8px !important;
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  cursor: pointer !important;
  text-transform: uppercase !important;
  transition: all 0.18s ease !important;
  white-space: nowrap !important;
  box-sizing: border-box !important;
}

@media (max-width: 700px) {
  .pdp-actions-row {
    display: grid !important;
    grid-template-columns: 104px 1fr !important;
    gap: 8px !important;
    width: 100% !important;
    margin: 14px 0 !important;
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
    min-height: 44px !important;
    font-size: 13px !important;
    padding: 0 12px !important;
    flex: none !important;
  }

  .pdp-buy-btn {
    grid-column: 1 / -1 !important;
    width: 100% !important;
    height: 44px !important;
    max-height: 44px !important;
    min-height: 44px !important;
    font-size: 13px !important;
    margin-top: 2px !important;
    flex: none !important;
  }
}
`;

['press-by-heart/assets/product.css', 'product.css'].forEach(f => {
  if (fs.existsSync(f)) {
    let css = fs.readFileSync(f, 'utf-8');
    css += gridActionsCSS;
    fs.writeFileSync(f, css, 'utf-8');
    console.log('✓ Added grid actions CSS to', f);
  }
});

// 2. Add Escape listener to product.js and press-by-heart/assets/product.js
const escapeListenerCode = `
    // Global Escape key listener for modals
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const reviewModal = document.getElementById('review-modal');
        if (reviewModal && reviewModal.classList.contains('is-open')) {
          reviewModal.classList.remove('is-open');
          reviewModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
        const sizeModal = document.getElementById('size-guide-modal');
        if (sizeModal && sizeModal.classList.contains('is-open')) {
          sizeModal.classList.remove('is-open');
          sizeModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });
`;

['press-by-heart/assets/product.js', 'product.js'].forEach(f => {
  if (fs.existsSync(f)) {
    let js = fs.readFileSync(f, 'utf-8');
    if (!js.includes('Global Escape key listener for modals')) {
      js = js.replace('function init() {', 'function init() {\n' + escapeListenerCode);
      fs.writeFileSync(f, js, 'utf-8');
      console.log('✓ Added Escape listener to', f);
    }
  }
});
