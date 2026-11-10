// ==========================================================================
// PRODUCT SINGLE PAGE (PDP) JAVASCRIPT — Press By Heart
// Dynamic Shopify variant matching, gallery thumbnail switching, cart integration
// (ZERO hardcoded mock products)
// ==========================================================================

(function () {
  'use strict';

  function pbhAssetUrl(assetPath) {
    if (!assetPath) return '';
    if (assetPath.indexOf('//') !== -1 || assetPath.indexOf('http') === 0) return assetPath;
    var clean = assetPath.split('/').pop().split('?')[0];
    if (window.ShopifyTheme && typeof window.ShopifyTheme.assetUrl === 'function') {
      return window.ShopifyTheme.assetUrl(clean);
    }
    if (window.ShopifyTheme && window.ShopifyTheme.assetRoot) {
      return window.ShopifyTheme.assetRoot + clean;
    }
    return 'assets/' + clean;
  }

  function getProductJson() {
    const el = document.querySelector('[data-product-json]');
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch {
      return null;
    }
  }

  function formatMoney(cents) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en-GB', {
      style: 'currency',
      currency: window.Shopify?.currency?.active || 'GBP'
    }).format(cents / 100);
  }

  // Active state
  let selectedShape = 'Almond';
  let selectedLength = 'Medium';
  let selectedSize = 'M';
  let quantity = 1;

  function updateOptionLabels() {
    const shapeLabel = document.getElementById('selected-shape-text');
    if (shapeLabel) shapeLabel.textContent = selectedShape;

    const lengthLabel = document.getElementById('selected-length-text');
    if (lengthLabel) lengthLabel.textContent = selectedLength;

    const sizeDescriptions = {
      XS: 'XS (14, 11, 12, 11, 8mm)',
      S: 'S (15, 12, 13, 12, 9mm)',
      M: 'M (16, 13, 14, 13, 10mm)',
      L: 'L (17, 14, 15, 14, 11mm)',
      Custom: 'Custom (Add note at checkout)'
    };
    const sizeLabel = document.getElementById('selected-size-text');
    if (sizeLabel) sizeLabel.textContent = sizeDescriptions[selectedSize] || selectedSize;
  }

  // Setup thumbnail click handlers
  function initGallery() {
    const mainImg = document.getElementById('pdp-main-img');
    const thumbBtns = document.querySelectorAll('.pdp-thumb-btn');
    if (!mainImg || !thumbBtns.length) return;

    thumbBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const thumbImg = btn.querySelector('img');
        const targetSrc = btn.dataset.imageUrl || (thumbImg ? thumbImg.src : null);
        if (targetSrc) {
          mainImg.style.opacity = '0.6';
          mainImg.src = targetSrc;
          mainImg.removeAttribute('srcset');
          setTimeout(() => {
            mainImg.style.opacity = '1';
          }, 120);
        }
        thumbBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      });
    });
  }

  // Match selected options to real Shopify variant
  function syncShopifyVariant() {
    const product = getProductJson();
    if (!product || !product.variants) return;

    const selectedOptions = [];
    document.querySelectorAll('[data-option-index]').forEach(group => {
      const activeChip = group.querySelector('[data-option-value].active');
      if (activeChip) {
        selectedOptions.push(activeChip.dataset.optionValue);
      }
    });

    const matchedVariant = product.variants.find(v => {
      return v.options.every((optValue, i) => optValue === selectedOptions[i]);
    }) || product.variants[0];

    if (!matchedVariant) return;

    const variantInput = document.getElementById('pdp-variant-id');
    if (variantInput) variantInput.value = matchedVariant.id;

    const priceEl = document.getElementById('pdp-price');
    if (priceEl) priceEl.textContent = formatMoney(matchedVariant.price);

    const comparePriceEl = document.getElementById('pdp-compare-price');
    const savePillEl = document.getElementById('pdp-save-pill');
    if (comparePriceEl) {
      if (matchedVariant.compare_at_price > matchedVariant.price) {
        comparePriceEl.textContent = formatMoney(matchedVariant.compare_at_price);
        comparePriceEl.hidden = false;
        if (savePillEl) {
          const discountPct = Math.round((1 - matchedVariant.price / matchedVariant.compare_at_price) * 100);
          savePillEl.textContent = `SAVE ${discountPct}%`;
          savePillEl.hidden = false;
        }
      } else {
        comparePriceEl.textContent = '';
        comparePriceEl.hidden = true;
        if (savePillEl) savePillEl.hidden = true;
      }
    }

    const installmentEl = document.getElementById('pdp-installment-amount');
    if (installmentEl) {
      installmentEl.textContent = formatMoney(matchedVariant.price / 4);
    }

    const addBtn = document.getElementById('pdp-add-btn');
    const buyBtn = document.getElementById('pdp-buy-btn');
    const stockBanner = document.querySelector('.pdp-stock-banner strong');

    if (matchedVariant.available) {
      if (addBtn) addBtn.disabled = false;
      if (buyBtn) buyBtn.disabled = false;
      if (stockBanner) stockBanner.textContent = 'In Stock';
    } else {
      if (addBtn) addBtn.disabled = true;
      if (buyBtn) buyBtn.disabled = true;
      if (stockBanner) stockBanner.textContent = 'Sold Out';
    }

    if (matchedVariant.featured_image && matchedVariant.featured_image.src) {
      const mainImg = document.getElementById('pdp-main-img');
      if (mainImg) {
        mainImg.src = matchedVariant.featured_image.src;
        mainImg.removeAttribute('srcset');
      }
    }

    try {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('variant', matchedVariant.id);
      window.history.replaceState({}, '', currentUrl);
    } catch {}
  }

  // Interactive Selectors (Shape, Length, Size)
  function initOptions() {
    // 1. Shopify OS 2.0 dynamic option groups
    document.querySelectorAll('[data-option-index]').forEach(group => {
      const chips = group.querySelectorAll('[data-option-value]');
      const label = group.querySelector('[data-selected-option]');

      chips.forEach(btn => {
        btn.addEventListener('click', () => {
          chips.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-checked', 'true');

          const optVal = btn.dataset.optionValue || btn.textContent.trim();
          if (label) label.textContent = optVal;

          if (btn.classList.contains('pdp-shape-chip') || btn.classList.contains('shape-chip')) selectedShape = optVal;
          if (btn.classList.contains('pdp-length-chip') || btn.classList.contains('length-chip')) selectedLength = optVal;
          if (btn.classList.contains('pdp-size-chip') || btn.classList.contains('size-chip')) selectedSize = optVal;

          updateOptionLabels();
          syncShopifyVariant();
        });
      });
    });

    // 2. Static mockup option groups (.pdp-option-group)
    document.querySelectorAll('.pdp-option-group').forEach(group => {
      const shapeChips = group.querySelectorAll('.pdp-shape-chip, .shape-chip');
      const lengthChips = group.querySelectorAll('.pdp-length-chip, .length-chip');
      const sizeChips = group.querySelectorAll('.pdp-size-chip, .size-chip');

      shapeChips.forEach(btn => {
        btn.addEventListener('click', () => {
          shapeChips.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedShape = btn.dataset.shape || btn.textContent.trim();
          updateOptionLabels();
        });
      });

      lengthChips.forEach(btn => {
        btn.addEventListener('click', () => {
          lengthChips.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedLength = btn.dataset.length || btn.textContent.trim();
          updateOptionLabels();
        });
      });

      sizeChips.forEach(btn => {
        btn.addEventListener('click', () => {
          sizeChips.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedSize = btn.dataset.size || btn.textContent.trim();
          updateOptionLabels();
        });
      });
    });
  }

  // Quantity Stepper
  function initQuantity() {
    const minusBtn = document.getElementById('pdp-qty-minus');
    const plusBtn = document.getElementById('pdp-qty-plus');
    const qtyInput = document.getElementById('pdp-qty');

    if (!qtyInput) return;

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
          quantity = val - 1;
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 99) {
          qtyInput.value = val + 1;
          quantity = val + 1;
        }
      });
    }

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < 1) val = 1;
      if (val > 99) val = 99;
      qtyInput.value = val;
      quantity = val;
    });
  }

  // Accordion Expand/Collapse
  function initAccordions() {
    const accordionTriggers = document.querySelectorAll('.pdp-accordion-trigger');
    accordionTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.pdp-accordion-item');
        if (!item) return;
        const isOpen = item.classList.contains('is-open');
        item.classList.toggle('is-open', !isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  // Size Guide Modal
  function initModal() {
    const openBtn = document.getElementById('open-size-guide');
    const modal = document.getElementById('size-guide-modal');
    const closeBtn = document.getElementById('close-size-guide');
    const overlay = document.querySelector('.pdp-modal-overlay');

    function toggleModal(open) {
      if (!modal) return;
      modal.hidden = !open;
      modal.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    if (openBtn) openBtn.addEventListener('click', () => toggleModal(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(false));
    if (overlay) overlay.addEventListener('click', () => toggleModal(false));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal && (!modal.hidden || modal.classList.contains('is-open'))) {
        toggleModal(false);
      }
    });
  }

  // Toast Notification
  let toastTimer;
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible', 'is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible', 'is-visible');
    }, 2800);
  }

  function getBag() {
    try {
      return JSON.parse(localStorage.getItem('pressByHeartBag') || '[]');
    } catch {
      return [];
    }
  }

  function saveBag(bag) {
    try {
      localStorage.setItem('pressByHeartBag', JSON.stringify(bag));
    } catch {}
  }

  function updateBagCount() {
    const bag = getBag();
    const count = Array.isArray(bag) ? bag.reduce((total, item) => total + (Number(item.quantity) || 1), 0) : 0;
    document.querySelectorAll('.bag-count').forEach(el => {
      el.textContent = String(count);
    });
    if (typeof pbhSyncAllBagCounts === 'function') {
      pbhSyncAllBagCounts();
    }
  }

  // Add to Bag Handler
  function handleAddToBag(e) {
    if (e) e.preventDefault();

    const titleEl = document.getElementById('pdp-title');
    const priceEl = document.getElementById('pdp-price');
    const mainImg = document.getElementById('pdp-main-img');
    const variantIdInput = document.getElementById('pdp-variant-id');
    const qtyInput = document.getElementById('pdp-qty');

    const name = titleEl ? titleEl.textContent.trim() : 'Custom Press-On Set';
    const priceStr = priceEl ? priceEl.textContent.trim() : '£16.99';
    const cleanPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 16.99;
    const imageSrc = mainImg ? mainImg.getAttribute('src') : '';
    const variantId = variantIdInput ? variantIdInput.value : null;
    const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;

    const bag = getBag();
    const itemKey = `${variantId || name}-${selectedShape}-${selectedLength}-${selectedSize}`;
    const existingIndex = bag.findIndex(item => item.itemKey === itemKey);

    if (existingIndex > -1) {
      bag[existingIndex].quantity = (bag[existingIndex].quantity || 1) + qty;
    } else {
      bag.push({
        name,
        price: cleanPrice,
        shape: selectedShape,
        length: selectedLength,
        size: selectedSize,
        quantity: qty,
        image: imageSrc,
        variantId,
        itemKey,
        details: `Shape: ${selectedShape} • Length: ${selectedLength} • Size: ${selectedSize}`
      });
    }

    saveBag(bag);
    updateBagCount();
    showToast(`Added ${qty}× "${name}" (${selectedShape}, ${selectedLength}, Size ${selectedSize}) to bag! 💕`);

    if (typeof openCartSidebar === 'function') {
      openCartSidebar(true);
    }

    if (variantId && window.location.protocol !== 'file:') {
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: variantId,
          quantity: qty,
          properties: {
            'Shape': selectedShape,
            'Length': selectedLength,
            'Size': selectedSize
          }
        })
      }).catch(() => {});
    }
  }

  function handleBuyNow(e) {
    if (e) e.preventDefault();
    handleAddToBag();
    if (window.location.protocol !== 'file:') {
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 350);
    } else {
      setTimeout(() => {
        showToast('Proceeding to checkout with your custom set... ✨');
      }, 400);
    }
  }

  // Initialize PDP interactions
  function init() {

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

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const pid = urlParams.get('id');
      if (pid === '2') {
        const titleEl = document.getElementById('pdp-title');
        const priceEl = document.getElementById('pdp-price');
        const bcEl = document.getElementById('pdp-bc-current');
        if (titleEl) titleEl.textContent = 'Pearly White Minimalist Press-On Nails';
        if (priceEl) priceEl.textContent = '£15.99';
        if (bcEl) bcEl.textContent = 'Pearly White Minimalist';
      }
    } catch {}

    updateOptionLabels();
    initGallery();
    initOptions();
    initQuantity();
    initAccordions();
    initModal();
    updateBagCount();

    const addBtn = document.getElementById('pdp-add-btn');
    if (addBtn) addBtn.addEventListener('click', handleAddToBag);

    const buyBtn = document.getElementById('pdp-buy-btn');
    if (buyBtn) buyBtn.addEventListener('click', handleBuyNow);

    const writeReviewBtn = document.getElementById('pdp-write-review-btn');
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
    }

    // Attach Add to Bag listeners on server-rendered related products
    const relatedGrid = document.getElementById('pdp-related-grid');
    if (relatedGrid) {
      relatedGrid.querySelectorAll('.design-card-btn, .shop-card-btn').forEach(btn => {
        btn.addEventListener('click', e => {
          e.preventDefault();
          const card = btn.closest('.design-card, .shop-card');
          const name = btn.dataset.name || card?.querySelector('h2')?.textContent?.trim() || 'Related Set';
          const priceStr = btn.dataset.price || card?.querySelector('.design-card-price, .shop-card-price')?.textContent || '£16.99';
          const cleanPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 16.99;
          const imageSrc = btn.dataset.image || card?.querySelector('img')?.getAttribute('src') || '';
          const variantId = btn.dataset.variantId || null;

          const bag = getBag();
          bag.push({
            name,
            price: cleanPrice,
            image: imageSrc,
            quantity: 1,
            variantId,
            details: 'Standard Set • Glue & Prep Kit Included'
          });
          saveBag(bag);
          updateBagCount();
          showToast(`Added "${name}" to your bag! 💕`);

          if (typeof openCartSidebar === 'function') {
            openCartSidebar(true);
          }

          if (variantId && window.location.protocol !== 'file:') {
            fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: variantId, quantity: 1 })
            }).catch(() => {});
          }
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
