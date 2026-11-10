// ==========================================================================
// SHOP BY DESIGN PAGE JAVASCRIPT — Press By Heart
// Operates directly on Shopify-rendered design cards (ZERO hardcoded mock products)
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

  // Active filter state
  const activeFilters = {
    shape: 'all',
    length: 'all',
    colour: 'all'
  };

  // Initialize filter state from URL query parameters
  function initFiltersFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      ['shape', 'length', 'colour'].forEach(key => {
        const val = params.get(key);
        if (val) {
          activeFilters[key] = val.toLowerCase();
        }
      });
    } catch (e) {}
  }

  // Filter products matching current active filters
  function renderProducts() {
    const grid = document.getElementById('design-grid') || document.getElementById('shop-by-design-grid');
    const countEl = document.getElementById('sbd-count');
    const totalEl = document.getElementById('sbd-total');
    if (!grid) return;

    const cards = grid.querySelectorAll('.design-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const shape = (card.dataset.shape || '').toLowerCase();
      const length = (card.dataset.length || '').toLowerCase();
      const colour = (card.dataset.colour || '').toLowerCase();

      const matchShape = activeFilters.shape === 'all' || shape === activeFilters.shape || shape.includes(activeFilters.shape);
      const matchLength = activeFilters.length === 'all' || length === activeFilters.length || length.includes(activeFilters.length);
      const matchColour = activeFilters.colour === 'all' || colour === activeFilters.colour || colour.includes(activeFilters.colour);

      const matches = matchShape && matchLength && matchColour;
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    if (countEl) countEl.textContent = `${visibleCount}`;
    if (totalEl) totalEl.textContent = `${cards.length}`;

    // Manage empty state
    let emptyNotice = grid.querySelector('.sbd-empty-notice');
    if (visibleCount === 0 && cards.length > 0) {
      if (!emptyNotice) {
        emptyNotice = document.createElement('div');
        emptyNotice.className = 'sbd-empty-notice';
        emptyNotice.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 48rem 20rem; background: #fff5f8; border-radius: 12rem; border: 1rem solid #fee0ea;';
        emptyNotice.innerHTML = `
          <p style="font-family: Georgia, serif; font-size: 20rem; color: #1a1a1a; margin: 0 0 8rem;">No matching designs found 💕</p>
          <p style="font-family: Poppins, sans-serif; font-size: 11rem; color: #7a6e74; margin: 0 0 16rem;">Try adjusting your shape, length, or colour filters.</p>
          <button class="sbd-reset-btn" type="button" style="padding: 8rem 20rem; font-size: 11rem;" onclick="window.sbdResetFilters()">RESET ALL FILTERS</button>
        `;
        grid.appendChild(emptyNotice);
      }
      emptyNotice.style.display = '';
    } else if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }
  }

  // Update active state of filter chips in DOM
  function updateChipStates() {
    document.querySelectorAll('.sbd-chip[data-filter-type]').forEach(chip => {
      const type = chip.dataset.filterType;
      const val = chip.dataset.filterValue;
      const isActive = activeFilters[type] === val;
      chip.classList.toggle('active', isActive);
      chip.setAttribute('aria-pressed', String(isActive));
    });
  }

  // Handle chip click
  function handleChipClick(event) {
    const chip = event.currentTarget;
    const type = chip.dataset.filterType;
    const val = chip.dataset.filterValue;
    if (!type || !val) return;

    if (activeFilters[type] === val && val !== 'all') {
      activeFilters[type] = 'all';
    } else {
      activeFilters[type] = val;
    }

    updateChipStates();
    renderProducts();

    try {
      const url = new URL(window.location);
      ['shape', 'length', 'colour'].forEach(key => {
        if (activeFilters[key] !== 'all') {
          url.searchParams.set(key, activeFilters[key]);
        } else {
          url.searchParams.delete(key);
        }
      });
      window.history.replaceState({}, '', url);
    } catch (e) {}
  }

  // Reset all filters
  window.sbdResetFilters = function () {
    activeFilters.shape = 'all';
    activeFilters.length = 'all';
    activeFilters.colour = 'all';
    updateChipStates();
    renderProducts();
    try {
      const url = new URL(window.location);
      url.searchParams.delete('shape');
      url.searchParams.delete('length');
      url.searchParams.delete('colour');
      window.history.replaceState({}, '', url);
    } catch (e) {}
  };

  // Bag & Toast logic
  function getBag() {
    try {
      return JSON.parse(localStorage.getItem('pressByHeartBag')) || [];
    } catch (e) {
      return [];
    }
  }

  function saveBag(bag) {
    try {
      localStorage.setItem('pressByHeartBag', JSON.stringify(bag));
    } catch (e) {}
  }

  function updateBagCount() {
    const bag = getBag();
    const count = Array.isArray(bag) ? bag.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) : 0;
    document.querySelectorAll('.bag-count').forEach(el => {
      el.textContent = String(count);
    });
    const dockBadge = document.getElementById('mobile-dock-badge');
    if (dockBadge) dockBadge.textContent = String(count);
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible', 'is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('visible', 'is-visible');
    }, 2400);
  }

  function handleAddToBag(event) {
    event.preventDefault();
    const btn = event.currentTarget;
    const card = btn.closest('.design-card');
    const name = btn.dataset.productName || btn.dataset.name || card?.querySelector('h2')?.textContent?.trim() || 'Custom Set';
    const priceStr = btn.dataset.productPrice || btn.dataset.price || card?.querySelector('.design-card-price')?.textContent || '£16.99';
    const cleanPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 16.99;
    const imageSrc = btn.dataset.productImage || btn.dataset.image || card?.querySelector('img')?.getAttribute('src') || '';
    const variantId = btn.dataset.variantId || null;

    const bag = getBag();
    bag.push({
      name: name,
      price: cleanPrice,
      image: imageSrc,
      quantity: 1,
      variantId: variantId,
      details: 'Handcrafted Set • Prep Kit Included'
    });
    saveBag(bag);
    updateBagCount();
    showToast(`Added "${name}" to your bag! 💕`);

    if (typeof pbhSyncAllBagCounts === 'function') {
      pbhSyncAllBagCounts();
    }
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

    btn.style.transform = 'scale(0.96)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 150);
  }

  // Setup event listeners
  function init() {
    initFiltersFromUrl();

    // Attach chip listeners
    document.querySelectorAll('.sbd-chip[data-filter-type]').forEach(chip => {
      chip.addEventListener('click', handleChipClick);
    });

    // Reset button
    const resetBtn = document.getElementById('sbd-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', window.sbdResetFilters);
    }

    // Attach Add to Bag listeners to design cards in grid
    const grid = document.getElementById('design-grid') || document.getElementById('shop-by-design-grid');
    if (grid) {
      grid.querySelectorAll('.design-card-btn, .add-to-bag-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToBag);
      });
    }

    updateChipStates();
    renderProducts();
    updateBagCount();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
