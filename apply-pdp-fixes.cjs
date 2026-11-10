const fs = require('fs');

console.log('--- Applying PDP Clean Organization & Review Modal Redesign ---');

// 1. Update main-product.liquid
const mainProductPath = 'press-by-heart/sections/main-product.liquid';
let mainProduct = fs.readFileSync(mainProductPath, 'utf-8');

const oldModalRegex = /<div class="pdp-modal" id="review-modal"[\s\S]*?<\/div><\/div><script type="application\/ld\+json">/;

const newModalHTML = `<div class="pdp-modal" id="review-modal" role="dialog" aria-hidden="true" aria-labelledby="review-form-title">
  <div class="pdp-modal-dialog pdp-review-modal-dialog">
    <button type="button" class="pdp-modal-close" id="close-review-form" aria-label="Close review form">✕</button>
    <div class="pdp-review-modal-header">
      <h3 id="review-form-title">Write a Review</h3>
      <p class="pdp-review-modal-subtitle">Share your experience with other nail lovers 💕</p>
    </div>
    {% form 'contact', id: 'product-review-form', class: 'pdp-review-form' %}
      {{ form.errors | default_errors }}
      {% if form.posted_successfully? %}
        <div class="pdp-review-success" role="status">
          <i>🌸</i>
          <p><strong>Thank you for your review!</strong><br>Your feedback has been submitted successfully and will appear after moderation.</p>
        </div>
      {% endif %}
      <input type="hidden" name="contact[product]" value="{{ product.title | escape }}">
      <div class="pdp-review-rating-picker">
        <label class="pdp-field-label">Overall Rating <span class="required">*</span></label>
        <div class="pdp-star-rating-select" id="pdp-star-rating-select" role="radiogroup" aria-label="Star rating">
          <button type="button" class="pdp-star-btn active" data-rating="5" aria-label="5 stars" aria-checked="true">★</button>
          <button type="button" class="pdp-star-btn active" data-rating="4" aria-label="4 stars" aria-checked="false">★</button>
          <button type="button" class="pdp-star-btn active" data-rating="3" aria-label="3 stars" aria-checked="false">★</button>
          <button type="button" class="pdp-star-btn active" data-rating="2" aria-label="2 stars" aria-checked="false">★</button>
          <button type="button" class="pdp-star-btn active" data-rating="1" aria-label="1 star" aria-checked="false">★</button>
        </div>
        <input type="hidden" name="contact[rating]" id="pdp-rating-input" value="5">
      </div>
      <div class="pdp-form-field">
        <label for="review-author-name" class="pdp-field-label">Your Name <span class="required">*</span></label>
        <input id="review-author-name" class="pdp-form-input" required name="contact[name]" autocomplete="name" placeholder="e.g. Sarah Jenkins">
      </div>
      <div class="pdp-form-field">
        <label for="review-author-email" class="pdp-field-label">Email Address <span class="required">*</span></label>
        <input id="review-author-email" class="pdp-form-input" required name="contact[email]" type="email" autocomplete="email" placeholder="e.g. sarah@example.com">
        <span class="pdp-field-hint">Your email is kept private and will never be published.</span>
      </div>
      <div class="pdp-form-field">
        <label for="review-body-text" class="pdp-field-label">Your Review <span class="required">*</span></label>
        <textarea id="review-body-text" class="pdp-form-textarea" required name="contact[body]" rows="4" placeholder="How was the fit, finish, and wear time? What did you love most?"></textarea>
      </div>
      <button type="submit" class="pdp-review-submit-btn" id="pdp-submit-review">SUBMIT REVIEW ✨</button>
    {% endform %}
  </div>
</div><script type="application/ld+json">`;

if (oldModalRegex.test(mainProduct)) {
  mainProduct = mainProduct.replace(oldModalRegex, newModalHTML);
  fs.writeFileSync(mainProductPath, mainProduct, 'utf-8');
  console.log('✓ Updated main-product.liquid with clean review modal');
} else {
  console.log('Warning: could not match old review-modal in main-product.liquid');
}

// 2. Update product.html to have #review-modal as well
const productHtmlPath = 'product.html';
let productHtml = fs.readFileSync(productHtmlPath, 'utf-8');

const reviewModalForStatic = `  <!-- Customer Review Modal -->
  <div class="pdp-modal" id="review-modal" role="dialog" aria-hidden="true" aria-labelledby="review-form-title">
    <div class="pdp-modal-dialog pdp-review-modal-dialog">
      <button type="button" class="pdp-modal-close" id="close-review-form" aria-label="Close review form">✕</button>
      <div class="pdp-review-modal-header">
        <h3 id="review-form-title">Write a Review</h3>
        <p class="pdp-review-modal-subtitle">Share your experience with other nail lovers 💕</p>
      </div>
      <form id="product-review-form" class="pdp-review-form" onsubmit="event.preventDefault(); document.getElementById('pdp-review-success-msg').style.display='flex'; document.getElementById('pdp-submit-review').style.display='none'; setTimeout(()=>{ dialog('#review-modal', false); }, 2000);">
        <div id="pdp-review-success-msg" class="pdp-review-success" role="status" style="display: none;">
          <i>🌸</i>
          <p><strong>Thank you for your review!</strong><br>Your feedback has been submitted successfully and will appear after moderation.</p>
        </div>
        <div class="pdp-review-rating-picker">
          <label class="pdp-field-label">Overall Rating <span class="required">*</span></label>
          <div class="pdp-star-rating-select" id="pdp-star-rating-select" role="radiogroup" aria-label="Star rating">
            <button type="button" class="pdp-star-btn active" data-rating="5" aria-label="5 stars" aria-checked="true">★</button>
            <button type="button" class="pdp-star-btn active" data-rating="4" aria-label="4 stars" aria-checked="false">★</button>
            <button type="button" class="pdp-star-btn active" data-rating="3" aria-label="3 stars" aria-checked="false">★</button>
            <button type="button" class="pdp-star-btn active" data-rating="2" aria-label="2 stars" aria-checked="false">★</button>
            <button type="button" class="pdp-star-btn active" data-rating="1" aria-label="1 star" aria-checked="false">★</button>
          </div>
          <input type="hidden" name="rating" id="pdp-rating-input" value="5">
        </div>
        <div class="pdp-form-field">
          <label for="review-author-name" class="pdp-field-label">Your Name <span class="required">*</span></label>
          <input id="review-author-name" class="pdp-form-input" required autocomplete="name" placeholder="e.g. Sarah Jenkins">
        </div>
        <div class="pdp-form-field">
          <label for="review-author-email" class="pdp-field-label">Email Address <span class="required">*</span></label>
          <input id="review-author-email" class="pdp-form-input" required type="email" autocomplete="email" placeholder="e.g. sarah@example.com">
          <span class="pdp-field-hint">Your email is kept private and will never be published.</span>
        </div>
        <div class="pdp-form-field">
          <label for="review-body-text" class="pdp-field-label">Your Review <span class="required">*</span></label>
          <textarea id="review-body-text" class="pdp-form-textarea" required rows="4" placeholder="How was the fit, finish, and wear time? What did you love most?"></textarea>
        </div>
        <button type="submit" class="pdp-review-submit-btn" id="pdp-submit-review">SUBMIT REVIEW ✨</button>
      </form>
    </div>
  </div>
`;

if (!productHtml.includes('id="review-modal"')) {
  productHtml = productHtml.replace('  <div class="toast"', reviewModalForStatic + '\n  <div class="toast"');
  fs.writeFileSync(productHtmlPath, productHtml, 'utf-8');
  console.log('✓ Added review-modal to product.html');
}

// 3. Update product.css and press-by-heart/assets/product.css
const pdpStylesAdd = `

/* ==========================================================================
   ENHANCED PDP BUTTONS & REVIEW MODAL STYLES (Luxury & Refined Proportions)
   ========================================================================== */
.pdp-actions-row {
  display: flex !important;
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

.pdp-qty-btn:hover {
  background: #ffe0ec !important;
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
  -moz-appearance: textfield !important;
}

.pdp-qty-input::-webkit-outer-spin-button,
.pdp-qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0 !important;
}

.pdp-add-btn {
  flex: 1 1 auto !important;
  height: 46px !important;
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

.pdp-add-btn:hover {
  background: #df2675 !important;
  box-shadow: 0 6px 18px rgba(223, 38, 117, 0.35) !important;
  transform: translateY(-1px) !important;
}

.pdp-add-btn:active {
  transform: translateY(1px) !important;
}

.pdp-buy-btn {
  height: 46px !important;
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

.pdp-buy-btn:hover {
  background: #333333 !important;
  transform: translateY(-1px) !important;
}

.pdp-shape-chip,
.pdp-length-chip {
  height: 38px !important;
  padding: 0 14px !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
  border: 1.5px solid #fae2eb !important;
  border-radius: 8px !important;
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.pdp-shape-chip img,
.pdp-length-chip img {
  width: 14px !important;
  height: 20px !important;
  object-fit: contain !important;
}

.pdp-size-chip {
  height: 38px !important;
  min-width: 44px !important;
  padding: 0 12px !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
  border: 1.5px solid #fae2eb !important;
  border-radius: 8px !important;
  box-sizing: border-box !important;
}

/* Modal Core Styles */
.pdp-modal {
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

.pdp-modal.is-open {
  opacity: 1 !important;
  pointer-events: auto !important;
  visibility: visible !important;
}

.pdp-review-modal-dialog {
  background: #ffffff !important;
  border-radius: 16px !important;
  max-width: 460px !important;
  width: 100% !important;
  padding: 28px 24px !important;
  box-shadow: 0 20px 48px rgba(80, 20, 36, 0.22) !important;
  position: relative !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  box-sizing: border-box !important;
  border: 1.5px solid #fae2eb !important;
}

.pdp-review-modal-header {
  margin-bottom: 18px !important;
  padding-right: 32px !important;
  text-align: left !important;
}

.pdp-review-modal-header h3 {
  font-family: Georgia, 'Times New Roman', serif !important;
  font-size: 22px !important;
  color: #1a1a1a !important;
  margin: 0 0 6px 0 !important;
  font-weight: 700 !important;
  line-height: 1.25 !important;
}

.pdp-review-modal-subtitle {
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13px !important;
  color: #7a6e74 !important;
  margin: 0 !important;
  line-height: 1.4 !important;
}

.pdp-review-form {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

.pdp-review-success {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 12px 14px !important;
  background: #f0fdf4 !important;
  border: 1.5px solid #bbf7d0 !important;
  border-radius: 8px !important;
  color: #166534 !important;
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13px !important;
  line-height: 1.4 !important;
}

.pdp-review-rating-picker {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  text-align: left !important;
  margin-bottom: 2px !important;
}

.pdp-star-rating-select {
  display: flex !important;
  flex-direction: row-reverse !important;
  justify-content: flex-end !important;
  gap: 4px !important;
}

.pdp-star-btn {
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

.pdp-star-btn:hover,
.pdp-star-btn:hover ~ .pdp-star-btn {
  color: #fa4087 !important;
  transform: scale(1.15) !important;
}

.pdp-star-rating-select:hover .pdp-star-btn {
  color: #ffd2e2;
}

.pdp-star-rating-select:hover .pdp-star-btn:hover,
.pdp-star-rating-select:hover .pdp-star-btn:hover ~ .pdp-star-btn {
  color: #fa4087;
}

.pdp-form-field {
  display: flex !important;
  flex-direction: column !important;
  gap: 5px !important;
  width: 100% !important;
  text-align: left !important;
  box-sizing: border-box !important;
}

.pdp-field-label {
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #2c2126 !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  margin: 0 !important;
}

.pdp-field-label .required {
  color: #fa4087 !important;
  font-weight: 700 !important;
}

.pdp-field-hint {
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 11px !important;
  color: #9c8e94 !important;
  margin-top: 1px !important;
  line-height: 1.3 !important;
}

.pdp-form-input {
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

.pdp-form-input:focus {
  border-color: #fa4087 !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(250, 64, 135, 0.15) !important;
}

.pdp-form-textarea {
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

.pdp-form-textarea:focus {
  border-color: #fa4087 !important;
  background-color: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(250, 64, 135, 0.15) !important;
}

.pdp-review-submit-btn {
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
}

.pdp-review-submit-btn:hover {
  background: #df2675 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 18px rgba(250, 64, 135, 0.38) !important;
}

.pdp-review-submit-btn:active {
  transform: translateY(1px) !important;
}

.pdp-write-review-btn {
  font-family: Poppins, Arial, sans-serif !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  color: #fa4087 !important;
  background: #fff0f5 !important;
  border: 1.5px solid #ffd2e2 !important;
  border-radius: 999px !important;
  padding: 8px 18px !important;
  cursor: pointer !important;
  transition: all 0.18s ease !important;
  box-sizing: border-box !important;
}

.pdp-write-review-btn:hover {
  background: #fa4087 !important;
  color: #ffffff !important;
  border-color: #fa4087 !important;
}

/* Responsive PDP Buttons for Mobile Viewports */
@media (max-width: 700px) {
  .pdp-actions-row {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
    align-items: stretch !important;
    width: 100% !important;
    margin: 14px 0 !important;
  }

  .pdp-qty-wrap {
    width: 104px !important;
    height: 44px !important;
    flex: 0 0 104px !important;
  }

  .pdp-add-btn {
    flex: 1 1 calc(100% - 114px) !important;
    min-width: 0 !important;
    height: 44px !important;
    font-size: 13px !important;
    padding: 0 12px !important;
  }

  .pdp-buy-btn {
    width: 100% !important;
    flex: 0 0 100% !important;
    height: 44px !important;
    font-size: 13px !important;
    margin-top: 2px !important;
  }

  .pdp-review-modal-dialog {
    max-width: 92vw !important;
    padding: 22px 18px !important;
    border-radius: 14px !important;
  }
}
`;

['press-by-heart/assets/product.css', 'product.css'].forEach(f => {
  if (fs.existsSync(f)) {
    let css = fs.readFileSync(f, 'utf-8');
    if (!css.includes('/* ENHANCED PDP BUTTONS & REVIEW MODAL STYLES')) {
      css += pdpStylesAdd;
      fs.writeFileSync(f, css, 'utf-8');
      console.log('✓ Added enhanced PDP buttons and review modal styles to', f);
    }
  }
});

// 4. Update product.js and press-by-heart/assets/product.js
function updateProductJS(filePath) {
  let js = fs.readFileSync(filePath, 'utf-8');

  // Ensure writeReviewBtn opens #review-modal instead of just showing toast
  const oldReviewBtnLogic = /const writeReviewBtn = document\.getElementById\('pdp-write-review-btn'\);[\s\S]*?showToast\('Customer review form opening soon 💕'\);[\s\S]*?\}\);[\s\S]*?\}/;
  const newReviewBtnLogic = `const writeReviewBtn = document.getElementById('pdp-write-review-btn');
    if (writeReviewBtn) {
      writeReviewBtn.addEventListener('click', () => {
        const modal = document.getElementById('review-modal');
        if (modal) {
          modal.classList.add('is-open');
          modal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        } else if (typeof showToast === 'function') {
          showToast('Customer review form opening soon 💕');
        }
      });
    }

    const closeReviewBtn = document.getElementById('close-review-form');
    if (closeReviewBtn) {
      closeReviewBtn.addEventListener('click', () => {
        const modal = document.getElementById('review-modal');
        if (modal) {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    }

    // Modal background close
    const reviewModal = document.getElementById('review-modal');
    if (reviewModal) {
      reviewModal.addEventListener('click', e => {
        if (e.target === reviewModal) {
          reviewModal.classList.remove('is-open');
          reviewModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    }

    // Star rating picker interactivity
    const starContainer = document.getElementById('pdp-star-rating-select');
    const ratingInput = document.getElementById('pdp-rating-input');
    if (starContainer && ratingInput) {
      starContainer.querySelectorAll('.pdp-star-btn').forEach(star => {
        star.addEventListener('click', e => {
          e.preventDefault();
          const ratingVal = parseInt(star.dataset.rating, 10) || 5;
          ratingInput.value = ratingVal;
          starContainer.querySelectorAll('.pdp-star-btn').forEach(s => {
            const sVal = parseInt(s.dataset.rating, 10);
            s.style.color = sVal <= ratingVal ? '#fa4087' : '#ffd2e2';
            s.setAttribute('aria-checked', sVal === ratingVal ? 'true' : 'false');
          });
        });
      });
    }`;

  if (oldReviewBtnLogic.test(js)) {
    js = js.replace(oldReviewBtnLogic, newReviewBtnLogic);
    fs.writeFileSync(filePath, js, 'utf-8');
    console.log('✓ Updated writeReviewBtn logic in', filePath);
  } else if (!js.includes('close-review-form')) {
    // Append inside init
    js = js.replace(/(const writeReviewBtn = document\.getElementById\('pdp-write-review-btn'\);[\s\S]*?\}\);[\s\S]*?\})/, newReviewBtnLogic);
    fs.writeFileSync(filePath, js, 'utf-8');
    console.log('✓ Appended review modal logic in', filePath);
  }
}

['press-by-heart/assets/product.js', 'product.js'].forEach(f => {
  if (fs.existsSync(f)) updateProductJS(f);
});

console.log('--- All PDP Updates Completed ---');
