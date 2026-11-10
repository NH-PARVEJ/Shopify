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

// Global Category Page JavaScript — Press By Heart
// Operates directly on Shopify-rendered collection products (ZERO hardcoded mock products)

const categoryDefinitions = {
  all: {
    name: 'All Nails',
    script: 'Press By Heart ♡',
    title: 'SHOP ALL<br>NAILS',
    description: 'Salon quality press-on nails delivered to your door.',
    bgImage: 'hero-expanded.png'
  },
  kids: {
    name: 'Kids Collection',
    script: 'Made for ♡',
    title: 'LITTLE<br>QUEENS',
    description: 'Adorable press-on nails specially sized for little hands.',
    bgImage: 'kids-hero-natural-hand.png'
  },
  pedis: {
    name: 'Pedis Collection',
    script: 'Salon At Home ♡',
    title: 'PEDIS<br>COLLECTION',
    description: 'Matching salon pedicure press-on toenails with durable, flexible comfort fit.',
    bgImage: 'hero-expanded.png'
  },
  bundles: {
    name: 'Bundles & Sets',
    script: 'Curated Value ♡',
    title: 'BUNDLES<br>&amp; SETS',
    description: 'Trio packs, designer bundles & essential care kits — save up to 25%.',
    bgImage: 'hero-expanded.png'
  },
  accessories: {
    name: 'Accessories & Care',
    script: 'Prep & Perfect ♡',
    title: 'ACCESSORIES<br>&amp; CARE',
    description: 'Nail glues, gentle adhesive tabs, cuticle oils, buffers and application kits.',
    bgImage: 'hero-expanded.png'
  }
};

function initCategoryPage() {
  const catNavLinks = document.querySelectorAll('.category-nav a, .shop-categories a');
  const chipsContainer = document.querySelector('.shop-chips');
  const grid = document.querySelector('#shop-all-grid, #category-grid, .shop-grid');
  const countEl = document.querySelector('#product-count');
  const toast = document.querySelector('.toast');
  let toastTimer;

  let currentCategory = 'all';
  let currentSubFilter = 'all';

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  function updateBagBadge() {
    try {
      const bag = JSON.parse(localStorage.getItem('pressByHeartBag') || '[]');
      const count = Array.isArray(bag) ? bag.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) : 0;
      document.querySelectorAll('.bag-count').forEach(el => {
        el.textContent = String(count);
      });
      const dockBadge = document.getElementById('mobile-dock-badge');
      if (dockBadge) dockBadge.textContent = String(count);
    } catch {
      // fallback
    }
  }

  // Filter Shopify collection products rendered in the DOM
  function filterProducts() {
    if (!grid) return;
    const cards = grid.querySelectorAll('.shop-card, .kids-product');
    let visibleCount = 0;

    cards.forEach(card => {
      const tags = (card.dataset.tags || '').toLowerCase();
      let matches = true;
      if (currentSubFilter && currentSubFilter !== 'all') {
        matches = tags.includes(currentSubFilter.toLowerCase());
      }
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    if (countEl) {
      countEl.textContent = `${visibleCount}`;
    }
  }

  function setSubFilter(subFilterKey) {
    currentSubFilter = subFilterKey;
    if (chipsContainer) {
      chipsContainer.querySelectorAll('.shop-chip').forEach(chip => {
        const chipVal = chip.dataset.filter || chip.getAttribute('href')?.split('/')?.pop() || '';
        chip.classList.toggle('active', chipVal === subFilterKey || (subFilterKey === 'all' && chipVal === ''));
      });
    }
    filterProducts();

    const url = new URL(window.location);
    if (subFilterKey === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', subFilterKey);
    }
    history.replaceState(null, '', url);
  }

  // Chip click listeners for instant client-side tag filtering
  if (chipsContainer) {
    chipsContainer.querySelectorAll('.shop-chip').forEach(chip => {
      chip.addEventListener('click', e => {
        const filterVal = chip.dataset.filter || chip.getAttribute('href')?.split('/')?.pop() || 'all';
        // If this is a collection tag link on Shopify, prevent full page reload if we can filter instantly
        if (grid && grid.querySelectorAll('.shop-card, .kids-product').length > 0) {
          e.preventDefault();
          setSubFilter(filterVal);
        }
      });
    });
  }

  // Attach Add to Bag listeners to all cards in the grid
  function attachBagListeners() {
    if (!grid) return;
    grid.querySelectorAll('.shop-card-btn, .kids-add').forEach(btn => {
      if (btn.dataset.hasBagListener) return;
      btn.dataset.hasBagListener = 'true';

      btn.addEventListener('click', e => {
        e.preventDefault();
        const card = btn.closest('.shop-card, .kids-product');
        const name = btn.dataset.name || card?.querySelector('h2, h3')?.textContent?.trim() || 'Press-On Set';
        const priceStr = btn.dataset.price || card?.querySelector('.shop-card-price, p')?.textContent || '£12.99';
        const cleanPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 12.99;
        const imageSrc = btn.dataset.image || card?.querySelector('img')?.getAttribute('src') || '';
        const variantId = btn.dataset.variantId || null;

        try {
          const raw = JSON.parse(localStorage.getItem('pressByHeartBag') || '[]');
          const bag = Array.isArray(raw) ? raw : [];
          bag.push({
            name: name,
            price: cleanPrice,
            image: imageSrc,
            quantity: 1,
            variantId: variantId,
            details: 'Standard Set • Glue & Prep Kit Included'
          });
          localStorage.setItem('pressByHeartBag', JSON.stringify(bag));
          updateBagBadge();
          showToast(`${name} added to your bag ♡`);

          if (typeof pbhSyncAllBagCounts === 'function') {
            pbhSyncAllBagCounts();
          }
          if (typeof openCartSidebar === 'function') {
            openCartSidebar(true);
          }
        } catch {
          showToast(`Added to your bag!`);
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

  attachBagListeners();

  // Initial count sync
  if (grid && countEl) {
    const totalCards = grid.querySelectorAll('.shop-card, .kids-product').length;
    if (totalCards > 0) {
      countEl.textContent = `${totalCards}`;
    }
  }

  // Read URL query params on page load
  const params = new URLSearchParams(window.location.search);
  const initFilter = params.get('filter');
  if (initFilter && initFilter !== 'all') {
    setSubFilter(initFilter);
  }

  updateBagBadge();

  // Newsletter form
  const form = document.querySelector('form');
  if (form && window.location.protocol === 'file:') {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Thank you for joining the Heart Club! 💕');
      form.reset();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategoryPage);
} else {
  initCategoryPage();
}
