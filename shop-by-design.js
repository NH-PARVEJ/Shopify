// ==========================================================================
// SHOP BY DESIGN PAGE JAVASCRIPT — Press By Heart
// Filter by Shape, Length, and Colour with responsive product grid & cart
// ==========================================================================

(function () {
  'use strict';

  // Product Catalog for Shop By Design
  const DESIGN_PRODUCTS = [
    {
      id: 1,
      name: 'French Rose Glaze',
      price: '£16.99',
      rating: '★★★★★',
      reviews: 42,
      desc: 'Soft milky rose with delicate white tips and glazed finish.',
      shape: 'almond',
      length: 'medium',
      colour: 'pink',
      badge: 'BESTSELLER',
      badgeType: 'gold',
      image: 'assets/product-0.png'
    },
    {
      id: 2,
      name: 'Pearly White Minimalist',
      price: '£15.99',
      rating: '★★★★★',
      reviews: 38,
      desc: 'Clean porcelain white with pearlescent chrome sheen.',
      shape: 'square',
      length: 'short',
      colour: 'white',
      badge: 'TRENDING',
      badgeType: '',
      image: 'assets/product-1.png'
    },
    {
      id: 3,
      name: 'Midnight Noir Starlight',
      price: '£18.99',
      rating: '★★★★★',
      reviews: 29,
      desc: 'Glossy pitch black adorned with micro sparkle accents.',
      shape: 'coffin',
      length: 'long',
      colour: 'black',
      badge: 'LUXE',
      badgeType: 'gold',
      image: 'assets/product-2.png'
    },
    {
      id: 4,
      name: 'Blushing Ballerina Gems',
      price: '£19.99',
      rating: '★★★★★',
      reviews: 51,
      desc: 'Ballet slipper pink embellished with iridescent crystal gems.',
      shape: 'ballerina',
      length: 'long',
      colour: 'gems',
      badge: 'PREMIUM',
      badgeType: 'gold',
      image: 'assets/product-3.png'
    },
    {
      id: 5,
      name: 'Sky Blue Aura',
      price: '£16.49',
      rating: '★★★★★',
      reviews: 23,
      desc: 'Ethereal pastel blue gradient aura with glossy gel coat.',
      shape: 'oval',
      length: 'medium',
      colour: 'blue',
      badge: 'NEW',
      badgeType: '',
      image: 'assets/product-4.png'
    },
    {
      id: 6,
      name: 'Ruby Velvet Almond',
      price: '£17.99',
      rating: '★★★★★',
      reviews: 35,
      desc: 'Deep crimson red with cat-eye velvet shimmer dimension.',
      shape: 'almond',
      length: 'medium',
      colour: 'red',
      badge: 'POPULAR',
      badgeType: 'gold',
      image: 'assets/collection-0.png'
    },
    {
      id: 7,
      name: 'Citrus Sunset Square',
      price: '£15.99',
      rating: '★★★★★',
      reviews: 19,
      desc: 'Warm peach orange ombre with micro gold foil flakes.',
      shape: 'square',
      length: 'short',
      colour: 'orange',
      badge: 'SUMMER',
      badgeType: '',
      image: 'assets/collection-1.png'
    },
    {
      id: 8,
      name: 'Lavender Haze Ballerina',
      price: '£17.49',
      rating: '★★★★★',
      reviews: 27,
      desc: 'Dreamy soft lilac purple with iridescent holographic dust.',
      shape: 'ballerina',
      length: 'medium',
      colour: 'purple',
      badge: 'NEW',
      badgeType: '',
      image: 'assets/collection-2.png'
    },
    {
      id: 9,
      name: 'Emerald Blossom Coffin',
      price: '£18.49',
      rating: '★★★★★',
      reviews: 31,
      desc: 'Rich forest green with delicate white daisy florals.',
      shape: 'coffin',
      length: 'long',
      colour: 'green',
      badge: 'BESTSELLER',
      badgeType: 'gold',
      image: 'assets/collection-3.png'
    },
    {
      id: 10,
      name: 'Buttercup Daisy Short Oval',
      price: '£14.99',
      rating: '★★★★★',
      reviews: 22,
      desc: 'Pastel pastel yellow with adorable hand-painted blooms.',
      shape: 'oval',
      length: 'short',
      colour: 'yellow',
      badge: 'CUTE',
      badgeType: '',
      image: 'assets/collection-4.png'
    },
    {
      id: 11,
      name: 'Rhinestone Tiara Almond',
      price: '£21.99',
      rating: '★★★★★',
      reviews: 48,
      desc: 'Sheer nude base encrusted with crown jewel rhinestone clusters.',
      shape: 'almond',
      length: 'long',
      colour: 'gems',
      badge: 'LUXE',
      badgeType: 'gold',
      image: 'assets/collection-5.png'
    },
    {
      id: 12,
      name: 'Classic White French Coffin',
      price: '£16.99',
      rating: '★★★★★',
      reviews: 64,
      desc: 'The timeless ultra-crisp white French tip in modern tapered coffin.',
      shape: 'coffin',
      length: 'medium',
      colour: 'white',
      badge: 'CLASSIC',
      badgeType: 'gold',
      image: 'assets/kids/product-0.png'
    },
    {
      id: 13,
      name: 'Bubblegum Short Square',
      price: '£14.99',
      rating: '★★★★★',
      reviews: 26,
      desc: 'Playful vivid pink in an easy-to-wear natural everyday length.',
      shape: 'square',
      length: 'short',
      colour: 'pink',
      badge: '',
      badgeType: '',
      image: 'assets/kids/product-1.png'
    },
    {
      id: 14,
      name: 'Cobalt Chrome Ballerina',
      price: '£18.99',
      rating: '★★★★★',
      reviews: 33,
      desc: 'Electric royal blue finished with mirror chrome reflection.',
      shape: 'ballerina',
      length: 'long',
      colour: 'blue',
      badge: 'TRENDING',
      badgeType: '',
      image: 'assets/kids/product-2.png'
    },
    {
      id: 15,
      name: 'Matcha Latte Short Oval',
      price: '£15.49',
      rating: '★★★★★',
      reviews: 28,
      desc: 'Soothing creamy sage green with subtle white wave swirls.',
      shape: 'oval',
      length: 'short',
      colour: 'green',
      badge: 'NEW',
      badgeType: '',
      image: 'assets/kids/product-3.png'
    },
    {
      id: 16,
      name: 'Onyx Glamour Almond',
      price: '£17.99',
      rating: '★★★★★',
      reviews: 37,
      desc: 'Sleek matte black with high-gloss French tip accents.',
      shape: 'almond',
      length: 'medium',
      colour: 'black',
      badge: 'POPULAR',
      badgeType: 'gold',
      image: 'assets/kids/product-4.png'
    }
  ];

  // Active filter state
  const activeFilters = {
    shape: 'all',
    length: 'all',
    colour: 'all'
  };

  // Color hex mapping for swatches
  const COLOUR_MAP = {
    all: 'linear-gradient(135deg, #fa4087, #ffd32a, #84b6f4)',
    pink: '#ff7aa5',
    white: '#ffffff',
    blue: '#84b6f4',
    black: '#1a1a1a',
    orange: '#ff9f43',
    yellow: '#ffd32a',
    purple: '#a55eea',
    green: '#26de81',
    red: '#eb3b5a',
    gems: 'url(assets/design/swatch-gems.png)'
  };

  // Read URL query params on initial load
  function initFiltersFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const shapeParam = params.get('shape');
      const lengthParam = params.get('length');
      const colourParam = params.get('colour');

      if (shapeParam && ['almond', 'square', 'oval', 'coffin', 'ballerina'].includes(shapeParam.toLowerCase())) {
        activeFilters.shape = shapeParam.toLowerCase();
      }
      if (lengthParam && ['short', 'medium', 'long'].includes(lengthParam.toLowerCase())) {
        activeFilters.length = lengthParam.toLowerCase();
      }
      if (colourParam && ['pink', 'white', 'blue', 'black', 'orange', 'yellow', 'purple', 'green', 'red', 'gems'].includes(colourParam.toLowerCase())) {
        activeFilters.colour = colourParam.toLowerCase();
      }
    } catch (e) {
      // URLSearchParams fallback
    }
  }

  // Filter products matching current active filters
  function getFilteredProducts() {
    return DESIGN_PRODUCTS.filter(product => {
      const matchShape = activeFilters.shape === 'all' || product.shape === activeFilters.shape;
      const matchLength = activeFilters.length === 'all' || product.length === activeFilters.length;
      const matchColour = activeFilters.colour === 'all' || product.colour === activeFilters.colour;
      return matchShape && matchLength && matchColour;
    });
  }

  // Render product grid
  function renderProducts() {
    const grid = document.getElementById('shop-by-design-grid');
    const countEl = document.getElementById('sbd-count');
    const totalEl = document.getElementById('sbd-total');
    if (!grid) return;

    const filtered = getFilteredProducts();

    if (countEl) countEl.textContent = filtered.length;
    if (totalEl) totalEl.textContent = DESIGN_PRODUCTS.length;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48rem 20rem; background: #fff5f8; border-radius: 12rem; border: 1rem solid #fee0ea;">
          <p style="font-family: Georgia, serif; font-size: 20rem; color: #1a1a1a; margin: 0 0 8rem;">No matching designs found 💕</p>
          <p style="font-family: Poppins, sans-serif; font-size: 11rem; color: #7a6e74; margin: 0 0 16rem;">Try adjusting your shape, length, or colour filters.</p>
          <button class="sbd-reset-btn" type="button" style="padding: 8rem 20rem; font-size: 11rem;" onclick="window.sbdResetFilters()">RESET ALL FILTERS</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <article class="design-card" data-shape="${item.shape}" data-length="${item.length}" data-colour="${item.colour}">
        <div class="design-card-media">
          <a href="product.html?id=${item.id}">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </a>
          ${item.badge ? `<span class="design-card-badge ${item.badgeType}">${item.badge}</span>` : ''}
        </div>
        <div class="design-card-body">
          <div class="design-card-tags">
            <span class="design-card-tag">${item.shape}</span>
            <span class="design-card-tag">${item.length}</span>
            <span class="design-card-tag">${item.colour}</span>
          </div>
          <div class="design-card-rating" aria-label="Rated 5 stars">${item.rating} <span style="font-size: 9rem; color: #9c8e94;">(${item.reviews})</span></div>
          <h2><a href="product.html?id=${item.id}" style="color:inherit;text-decoration:none;">${item.name}</a></h2>
          <p class="design-card-desc">${item.desc}</p>
          <div class="design-card-price">${item.price}</div>
          <button class="design-card-btn add-to-bag-btn" type="button" data-product-id="${item.id}" data-product-name="${item.name}" data-product-price="${item.price}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 14H4Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>
            ADD TO BAG
          </button>
        </div>
      </article>
    `).join('');

    // Attach Add to Bag listeners
    grid.querySelectorAll('.add-to-bag-btn').forEach(btn => {
      btn.addEventListener('click', handleAddToBag);
    });
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

    // Toggle: if already active and not 'all', turn back to 'all', otherwise select
    if (activeFilters[type] === val && val !== 'all') {
      activeFilters[type] = 'all';
    } else {
      activeFilters[type] = val;
    }

    updateChipStates();
    renderProducts();

    // Update URL history without reload
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
    const count = bag.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.bag-count').forEach(el => {
      el.textContent = count;
    });
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
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  function handleAddToBag(event) {
    const btn = event.currentTarget;
    const id = parseInt(btn.dataset.productId, 10);
    const name = btn.dataset.productName;
    const price = btn.dataset.productPrice;

    const bag = getBag();
    const existing = bag.find(item => item.id === id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      bag.push({ id, name, price, quantity: 1 });
    }
    saveBag(bag);
    updateBagCount();
    showToast(`Added "${name}" to your bag! 💕`);

    // Micro bounce button
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
