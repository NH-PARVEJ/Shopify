const fs = require('fs');

const cssToAdd = `
/* ==========================================================================
   UNIVERSAL CART DRAWER PROMO BOX & PDP REVIEW MODAL STYLES (Bulletproof)
   ========================================================================== */
#cart-sidebar-drawer .cart-promo-section,
#cart-sidebar-drawer .cart-promo-wrap,
.cart-promo-section,
.cart-promo-wrap {
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

#cart-sidebar-drawer .cart-promo-input-row,
#cart-sidebar-drawer .cart-promo-input-wrap,
.cart-promo-input-row,
.cart-promo-input-wrap {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

#cart-sidebar-drawer input#cart-promo-input,
#cart-promo-input,
input.cart-promo-input,
.cart-promo-input {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  width: 100% !important;
  height: 42px !important;
  padding: 0 14px !important;
  border: 1.5px solid #f1dde4 !important;
  border-radius: 8px !important;
  background: #ffffff !important;
  font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important;
  font-size: 13px !important;
  color: #4a1520 !important;
  outline: none !important;
  box-sizing: border-box !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  box-shadow: none !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
}

#cart-sidebar-drawer input#cart-promo-input:focus,
#cart-promo-input:focus,
input.cart-promo-input:focus {
  border-color: #fa4087 !important;
  background-color: #fffbfa !important;
  box-shadow: 0 0 0 3px rgba(250, 64, 135, 0.16) !important;
}

#cart-sidebar-drawer input#cart-promo-input::placeholder,
#cart-promo-input::placeholder,
input.cart-promo-input::placeholder {
  color: #a8848d !important;
  font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important;
  font-size: 11.5px !important;
  opacity: 1 !important;
}

#cart-sidebar-drawer button#cart-promo-apply-btn,
#cart-promo-apply-btn,
button.cart-promo-btn,
.cart-promo-btn {
  padding: 0 18px !important;
  height: 42px !important;
  min-height: 42px !important;
  background: #fdf0f4 !important;
  border: 1.5px solid #f1dde4 !important;
  border-radius: 8px !important;
  color: #fa4087 !important;
  font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.6px !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  transition: all 0.2s ease !important;
  text-transform: uppercase !important;
}

#cart-sidebar-drawer button#cart-promo-apply-btn:hover,
#cart-promo-apply-btn:hover,
.cart-promo-btn:hover {
  background: #fa4087 !important;
  color: #ffffff !important;
  border-color: #fa4087 !important;
  box-shadow: 0 3px 10px rgba(250, 64, 135, 0.28) !important;
  transform: translateY(-1px) !important;
}

#cart-sidebar-drawer button#cart-promo-apply-btn:active,
#cart-promo-apply-btn:active,
.cart-promo-btn:active {
  transform: translateY(0) !important;
}

#cart-sidebar-drawer .cart-promo-status,
#cart-promo-status,
.cart-promo-status {
  font-size: 11px !important;
  font-family: Poppins, Arial, sans-serif !important;
  line-height: 1.3 !important;
  min-height: 14px !important;
}

#cart-sidebar-drawer .cart-promo-status.success,
#cart-promo-status.success {
  color: #20bf6b !important;
  font-weight: 600 !important;
}

#cart-sidebar-drawer .cart-promo-status.error,
#cart-promo-status.error {
  color: #eb3b5a !important;
}

/* Review Modal Core & Luxury Styling */
#review-modal.pdp-modal {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(30, 10, 18, 0.6) !important;
  backdrop-filter: blur(4px) !important;
  -webkit-backdrop-filter: blur(4px) !important;
  z-index: 999999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 16px !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
  transition: opacity 0.24s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.24s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-sizing: border-box !important;
}

#review-modal.pdp-modal.is-open {
  opacity: 1 !important;
  pointer-events: auto !important;
  visibility: visible !important;
}

#review-modal .pdp-review-modal-dialog {
  background: #ffffff !important;
  border-radius: 16px !important;
  max-width: 480px !important;
  width: 100% !important;
  padding: 28px 24px !important;
  box-shadow: 0 20px 48px rgba(80, 20, 36, 0.22) !important;
  position: relative !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  box-sizing: border-box !important;
  border: 1.5px solid #fae2eb !important;
}

#review-modal .pdp-modal-close {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  width: 34px !important;
  height: 34px !important;
  border-radius: 50% !important;
  border: 1px solid #ffd2e2 !important;
  background: #fff0f5 !important;
  color: #fa4087 !important;
  font-size: 16px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  transition: background 0.18s ease, transform 0.18s ease !important;
  padding: 0 !important;
}

#review-modal .pdp-modal-close:hover {
  background: #ffe0ec !important;
  transform: scale(1.08) !important;
}

#review-modal .pdp-review-modal-header {
  margin-bottom: 18px !important;
  padding-right: 32px !important;
  text-align: left !important;
}

#review-modal .pdp-review-modal-header h3 {
  font-family: Georgia, 'Times New Roman', serif !important;
  font-size: 22px !important;
  color: #1a1a1a !important;
  margin: 0 0 6px 0 !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
}

#review-modal .pdp-review-modal-subtitle {
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13px !important;
  color: #7a6e74 !important;
  margin: 0 !important;
  line-height: 1.4 !important;
}

#review-modal .pdp-review-form {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

#review-modal .pdp-review-rating-picker {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  text-align: left !important;
  margin-bottom: 2px !important;
}

#review-modal .pdp-star-rating-select {
  display: flex !important;
  flex-direction: row-reverse !important;
  justify-content: flex-end !important;
  gap: 4px !important;
}

#review-modal .pdp-star-btn {
  background: none !important;
  border: none !important;
  padding: 0 2px !important;
  font-size: 26px !important;
  color: #fa4087 !important;
  cursor: pointer !important;
  line-height: 1 !important;
  transition: transform 0.15s ease, color 0.15s ease !important;
  -webkit-tap-highlight-color: transparent !important;
}

#review-modal .pdp-star-btn:hover,
#review-modal .pdp-star-btn:hover ~ .pdp-star-btn {
  color: #fa4087 !important;
  transform: scale(1.15) !important;
}

#review-modal .pdp-star-rating-select:hover .pdp-star-btn {
  color: #ffd2e2 !important;
}

#review-modal .pdp-star-rating-select:hover .pdp-star-btn:hover,
#review-modal .pdp-star-rating-select:hover .pdp-star-btn:hover ~ .pdp-star-btn {
  color: #fa4087 !important;
}

#review-modal .pdp-form-field {
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
  width: 100% !important;
  text-align: left !important;
  box-sizing: border-box !important;
}

#review-modal .pdp-field-label {
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #2c2126 !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  margin: 0 !important;
}

#review-modal .pdp-field-label .required {
  color: #fa4087 !important;
  font-weight: 700 !important;
}

#review-modal .pdp-field-hint {
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 11px !important;
  color: #92838a !important;
  margin-top: 2px !important;
  line-height: 1.3 !important;
}

#review-modal .pdp-form-input {
  width: 100% !important;
  height: 42px !important;
  padding: 0 14px !important;
  border: 1.5px solid #f1dde4 !important;
  border-radius: 8px !important;
  background: #fffcfd !important;
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13.5px !important;
  color: #1a1a1a !important;
  outline: none !important;
  box-sizing: border-box !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
}

#review-modal .pdp-form-input:focus {
  border-color: #fa4087 !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(250, 64, 135, 0.15) !important;
}

#review-modal .pdp-form-textarea {
  width: 100% !important;
  min-height: 96px !important;
  padding: 10px 14px !important;
  border: 1.5px solid #f1dde4 !important;
  border-radius: 8px !important;
  background: #fffcfd !important;
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13.5px !important;
  color: #1a1a1a !important;
  outline: none !important;
  resize: vertical !important;
  box-sizing: border-box !important;
  line-height: 1.5 !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
}

#review-modal .pdp-form-textarea:focus {
  border-color: #fa4087 !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(250, 64, 135, 0.15) !important;
}

#review-modal .pdp-review-submit-btn {
  width: 100% !important;
  height: 44px !important;
  min-height: 44px !important;
  background: linear-gradient(105deg, #fa4087, #f13d84) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 8px !important;
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.6px !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 4px 14px rgba(250, 64, 135, 0.28) !important;
  transition: all 0.2s ease !important;
  margin-top: 6px !important;
  box-sizing: border-box !important;
  text-transform: uppercase !important;
}

#review-modal .pdp-review-submit-btn:hover {
  background: #df2675 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 18px rgba(223, 38, 117, 0.35) !important;
}

#review-modal .pdp-review-submit-btn:active {
  transform: translateY(1px) !important;
}

@media (max-width: 480px) {
  #review-modal .pdp-review-modal-dialog {
    padding: 22px 18px !important;
    border-radius: 14px !important;
    max-width: 92vw !important;
  }
}
`;

const targetFiles = [
  'press-by-heart/assets/refinements.css',
  'refinements.css',
  'press-by-heart/assets/style.css',
  'style.css',
  'press-by-heart/assets/product.css',
  'product.css'
];

targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('UNIVERSAL CART DRAWER PROMO BOX & PDP REVIEW MODAL STYLES')) {
      content += '\n' + cssToAdd;
      fs.writeFileSync(file, content, 'utf8');
      console.log('Appended universal bulletproof CSS to:', file);
    } else {
      console.log('Already present in:', file);
    }
  }
});
