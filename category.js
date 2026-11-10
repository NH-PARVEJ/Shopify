// Global Category Page JavaScript — Press By Heart
// Unifies all categories (Nails, Kids, Pedis, Bundles, Accessories) in one global category page.

const categoryDefinitions = {
  all: {
    name: 'All Nails',
    script: 'Press By Heart ♡',
    title: 'SHOP ALL<br>NAILS',
    description: 'Salon quality press-on nails delivered to your door.',
    bgImage: 'assets/hero-expanded.png',
    chips: [
      { id: 'all', label: 'All Nails' },
      { id: 'new-arrivals', label: 'New Arrivals' },
      { id: 'best-sellers', label: 'Best Sellers' },
      { id: 'french', label: 'French Tips' },
      { id: 'glaze', label: 'Glazed & Chrome' }
    ]
  },
  kids: {
    name: 'Kids Collection',
    script: 'Made for ♡',
    title: 'LITTLE<br>QUEENS',
    description: 'Adorable press-on nails specially sized for little hands.',
    bgImage: 'assets/kids/hero-natural-hand.png',
    chips: [
      { id: 'all', label: 'All Kids Nails' },
      { id: 'new', label: 'New Arrivals' },
      { id: 'best', label: 'Best Sellers' },
      { id: 'character', label: 'Character Collection' },
      { id: 'glitter', label: 'Glitter & Sparkle' }
    ]
  },
  pedis: {
    name: 'Pedis Collection',
    script: 'Salon At Home ♡',
    title: 'PEDIS<br>COLLECTION',
    description: 'Matching salon pedicure press-on toenails with durable, flexible comfort fit.',
    bgImage: 'assets/hero-expanded.png',
    chips: [
      { id: 'all', label: 'All Pedis' },
      { id: 'new-arrivals', label: 'New Arrivals' },
      { id: 'best-sellers', label: 'Best Sellers' },
      { id: 'french', label: 'French Pedi' },
      { id: 'solid', label: 'Solid Colours' }
    ]
  },
  bundles: {
    name: 'Bundles & Sets',
    script: 'Curated Value ♡',
    title: 'BUNDLES<br>&amp; SETS',
    description: 'Trio packs, designer bundles & essential care kits — save up to 25%.',
    bgImage: 'assets/hero-expanded.png',
    chips: [
      { id: 'all', label: 'All Bundles' },
      { id: 'starter', label: 'Starter Kits' },
      { id: 'trio', label: 'Trio Packs' },
      { id: 'best-sellers', label: 'Best Value' }
    ]
  },
  accessories: {
    name: 'Accessories & Care',
    script: 'Prep & Perfect ♡',
    title: 'ACCESSORIES<br>&amp; CARE',
    description: 'Nail glues, gentle adhesive tabs, cuticle oils, buffers and application kits.',
    bgImage: 'assets/hero-expanded.png',
    chips: [
      { id: 'all', label: 'All Accessories' },
      { id: 'adhesives', label: 'Adhesives & Glues' },
      { id: 'tools', label: 'Prep Tools' },
      { id: 'care', label: 'Care & Removal' }
    ]
  }
};

const allProducts = [
  // --- NAILS / ALL ---
  {
    id: 'pink-perfection',
    category: 'all',
    name: 'Pink Perfection',
    price: '£12.99',
    rating: '★★★★★ 5.0',
    badge: 'Best Seller',
    badgeClass: '',
    desc: 'Flawless pink French tips with soft gloss shine.',
    image: 'assets/product-0.png',
    tags: ['all', 'best-sellers', 'french']
  },
  {
    id: 'soft-glam',
    category: 'all',
    name: 'Soft Glam',
    price: '£12.99',
    rating: '★★★★★ 4.9',
    badge: 'New Arrival',
    badgeClass: '',
    desc: 'Subtle nude shimmer perfect for everyday luxury.',
    image: 'assets/product-1.png',
    tags: ['all', 'new-arrivals', 'best-sellers']
  },
  {
    id: 'glow-girl',
    category: 'all',
    name: 'Glow Girl',
    price: '£12.99',
    rating: '★★★★★ 4.9',
    badge: 'Trending',
    badgeClass: '',
    desc: 'Glazed donut rosy finish with mirror chrome reflection.',
    image: 'assets/product-2.png',
    tags: ['all', 'new-arrivals', 'glaze']
  },
  {
    id: 'diamond-dreams',
    category: 'all',
    name: 'Diamond Dreams',
    price: '£12.99',
    rating: '★★★★★ 5.0',
    badge: 'Top Pick',
    badgeClass: '',
    desc: 'Sparkling diamond accent tips on soft petal pink.',
    image: 'assets/product-3.png',
    tags: ['all', 'best-sellers']
  },
  {
    id: 'french-luxe',
    category: 'all',
    name: 'French Luxe',
    price: '£13.99',
    rating: '★★★★★ 5.0',
    badge: 'Classic Salon',
    badgeClass: '',
    desc: 'Crisp white French manicure with durable gel coat.',
    image: 'assets/collection-0.png',
    tags: ['all', 'best-sellers', 'french']
  },
  {
    id: 'pearly-white',
    category: 'all',
    name: 'Pearly White',
    price: '£15.99',
    rating: '★★★★★ 5.0',
    badge: 'New Arrival',
    badgeClass: '',
    desc: 'Minimalist glazed porcelain with soft translucent undertone.',
    image: 'assets/product-1.png',
    tags: ['all', 'new-arrivals', 'glaze']
  },

  // --- KIDS ---
  {
    id: 'little-blossom',
    category: 'kids',
    name: 'Little Blossom',
    price: '£8.99',
    rating: '★★★★★ 4.9',
    badge: 'Kids Floral',
    badgeClass: 'kids',
    desc: 'Mini daisy petals and sweet soft blush tones.',
    image: 'assets/kids/product-0.png',
    tags: ['all', 'new', 'best']
  },
  {
    id: 'rainbow-dreamer',
    category: 'kids',
    name: 'Rainbow Dreamer',
    price: '£8.99',
    rating: '★★★★★ 4.9',
    badge: 'Kids Brights',
    badgeClass: 'kids',
    desc: 'Vibrant pastel rainbows designed for happy little hands.',
    image: 'assets/kids/product-1.png',
    tags: ['all', 'new', 'character']
  },
  {
    id: 'sweet-hearts',
    category: 'kids',
    name: 'Sweet Hearts',
    price: '£8.99',
    rating: '★★★★★ 5.0',
    badge: 'Kids Loved',
    badgeClass: 'kids',
    desc: 'Hand-painted miniature hearts for everyday joy.',
    image: 'assets/kids/product-2.png',
    tags: ['all', 'best', 'character']
  },
  {
    id: 'daisy-days',
    category: 'kids',
    name: 'Daisy Days',
    price: '£8.99',
    rating: '★★★★★ 4.9',
    badge: 'Kids Glitter',
    badgeClass: 'kids',
    desc: 'Sparkling glitter with floral accents for cheerful days.',
    image: 'assets/kids/product-3.png',
    tags: ['all', 'glitter']
  },
  {
    id: 'princess-sparkle',
    category: 'kids',
    name: 'Princess Sparkle',
    price: '£8.99',
    rating: '★★★★★ 5.0',
    badge: 'Kids Sparkle',
    badgeClass: 'kids',
    desc: 'Dazzling fairy glitter tips made for little royalty.',
    image: 'assets/kids/product-4.png',
    tags: ['all', 'best', 'glitter']
  },
  {
    id: 'little-princess',
    category: 'kids',
    name: 'Little Princess',
    price: '£9.99',
    rating: '★★★★★ 5.0',
    badge: 'Kids Crown',
    badgeClass: 'kids',
    desc: 'Petite sizing with adorable pastel crowns & glitter.',
    image: 'assets/product-4.png',
    tags: ['all', 'character', 'new']
  },

  // --- PEDIS ---
  {
    id: 'pedi-rose-bliss',
    category: 'pedis',
    name: 'Pedi Rose Bliss',
    price: '£11.99',
    rating: '★★★★★ 4.9',
    badge: 'Best Seller',
    badgeClass: '',
    desc: 'Matching salon pedicure press-on nails with flexible base.',
    image: 'assets/collection-1.png',
    tags: ['all', 'best-sellers', 'solid']
  },
  {
    id: 'pedi-french-classic',
    category: 'pedis',
    name: 'Pedi French Classic',
    price: '£12.49',
    rating: '★★★★★ 5.0',
    badge: 'New Arrival',
    badgeClass: '',
    desc: 'Crisp white pedicure French smile line with natural bed.',
    image: 'assets/collection-0.png',
    tags: ['all', 'new-arrivals', 'french']
  },
  {
    id: 'pedi-nude-glow',
    category: 'pedis',
    name: 'Pedi Nude Glow',
    price: '£11.99',
    rating: '★★★★★ 4.9',
    badge: 'Trending',
    badgeClass: '',
    desc: 'Soft nude finish matching every sandal and heel.',
    image: 'assets/collection-2.png',
    tags: ['all', 'solid']
  },
  {
    id: 'pedi-glazed-pearl',
    category: 'pedis',
    name: 'Pedi Glazed Pearl',
    price: '£12.99',
    rating: '★★★★★ 5.0',
    badge: 'Top Pick',
    badgeClass: '',
    desc: 'High-shine pearl glazed toes with long-lasting gel coat.',
    image: 'assets/product-2.png',
    tags: ['all', 'new-arrivals']
  },

  // --- BUNDLES ---
  {
    id: 'nude-elegance-bundle',
    category: 'bundles',
    name: 'Nude Elegance Bundle',
    price: '£24.99',
    rating: '★★★★★ 5.0',
    badge: 'Save 25%',
    badgeClass: 'gold',
    desc: 'Trio pack of best-selling nude shades and nail prep essentials.',
    image: 'assets/collection-2.png',
    tags: ['all', 'trio', 'best-sellers']
  },
  {
    id: 'glam-queen-trio',
    category: 'bundles',
    name: 'Glam Queen Trio',
    price: '£26.99',
    rating: '★★★★★ 5.0',
    badge: 'Save 20%',
    badgeClass: 'gold',
    desc: 'French Luxe, Diamond Dreams and Soft Glam in one gift box.',
    image: 'assets/collection-3.png',
    tags: ['all', 'trio']
  },
  {
    id: 'starter-kit-bundle',
    category: 'bundles',
    name: 'Complete Starter Kit',
    price: '£19.99',
    rating: '★★★★★ 4.9',
    badge: 'Best Starter',
    badgeClass: 'gold',
    desc: 'Any two nail sets plus professional glue, buffer & care tools.',
    image: 'assets/collection-4.png',
    tags: ['all', 'starter', 'best-sellers']
  },
  {
    id: 'kids-party-pack',
    category: 'bundles',
    name: 'Kids Party 4-Pack',
    price: '£24.99',
    rating: '★★★★★ 5.0',
    badge: 'Kids Bundle',
    badgeClass: 'kids',
    desc: '4 fun kids nail boxes with safe, gentle adhesive tabs.',
    image: 'assets/kids/menu-product-hq.png',
    tags: ['all', 'starter']
  },

  // --- ACCESSORIES ---
  {
    id: 'essential-prep-kit',
    category: 'accessories',
    name: 'Essential Prep & Care Kit',
    price: '£6.99',
    rating: '★★★★★ 4.8',
    badge: 'Essential',
    badgeClass: '',
    desc: 'Buffer, cuticle stick, dual adhesive tabs and nail glue.',
    image: 'assets/collection-4.png',
    tags: ['all', 'tools', 'care']
  },
  {
    id: 'ultra-hold-nail-glue',
    category: 'accessories',
    name: 'Ultra-Hold Brush Nail Glue',
    price: '£4.99',
    rating: '★★★★★ 4.9',
    badge: 'Best Seller',
    badgeClass: '',
    desc: 'Precision brush-on salon formula for up to 2+ weeks hold.',
    image: 'assets/collection-4.png',
    tags: ['all', 'adhesives']
  },
  {
    id: 'dual-adhesive-tabs',
    category: 'accessories',
    name: 'Waterproof Adhesive Tabs (120pcs)',
    price: '£3.99',
    rating: '★★★★★ 4.9',
    badge: 'Damage Free',
    badgeClass: '',
    desc: 'Gentle, damage-free wear ideal for quick events and kids.',
    image: 'assets/collection-4.png',
    tags: ['all', 'adhesives']
  },
  {
    id: 'glass-cuticle-pusher',
    category: 'accessories',
    name: 'Precision Glass Cuticle Pusher',
    price: '£5.49',
    rating: '★★★★★ 5.0',
    badge: 'Pro Tool',
    badgeClass: '',
    desc: 'Etched glass file for immaculate prep without nail damage.',
    image: 'assets/collection-4.png',
    tags: ['all', 'tools']
  }
];

function initCategoryPage() {
  const heroCopy = document.querySelector('.shop-hero-copy');
  const heroTitle = document.querySelector('#shop-hero-title');
  const heroScript = document.querySelector('.shop-script');
  const heroDesc = document.querySelector('.shop-description');
  const heroBtn = document.querySelector('.shop-primary');
  const heroBg = document.querySelector('.shop-hero-background');
  
  const catNavLinks = document.querySelectorAll('.category-nav a, .shop-categories a');
  const chipsContainer = document.querySelector('.shop-chips');
  const grid = document.querySelector('#shop-all-grid, #category-grid');
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
      const count = bag.length;
      document.querySelectorAll('.bag-count').forEach(el => {
        el.textContent = count;
      });
    } catch {
      // fallback
    }
  }

  function renderHero(catKey) {
    const def = categoryDefinitions[catKey] || categoryDefinitions.all;
    if (heroScript) heroScript.textContent = def.script;
    if (heroTitle) heroTitle.innerHTML = def.title;
    if (heroDesc) heroDesc.textContent = def.description;
    if (heroBg && def.bgImage) {
      heroBg.src = def.bgImage;
      heroBg.alt = `${def.name} banner`;
    }
    if (heroBtn) {
      heroBtn.innerHTML = `SHOP ${def.name.toUpperCase()} <svg class="icon crown-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 6 4 5 5-8 5 8 4-5-2 13H5L3 6Z"/><path d="M5 16h14M7 22h10"/></svg>`;
    }
  }

  function renderChips(catKey) {
    if (!chipsContainer) return;
    const def = categoryDefinitions[catKey] || categoryDefinitions.all;
    chipsContainer.innerHTML = '';
    
    def.chips.forEach((chip, index) => {
      const btn = document.createElement('button');
      btn.className = `shop-chip ${chip.id === currentSubFilter ? 'active' : ''}`;
      btn.type = 'button';
      btn.role = 'tab';
      btn.setAttribute('data-filter', chip.id);
      btn.textContent = chip.label;
      btn.addEventListener('click', () => {
        setSubFilter(chip.id);
      });
      chipsContainer.appendChild(btn);
    });
  }

  function renderProducts() {
    if (!grid) return;
    grid.innerHTML = '';

    // Filter by category and subfilter
    const filtered = allProducts.filter(p => {
      const matchCat = (currentCategory === 'all') ? true : p.category === currentCategory;
      const matchSub = (currentSubFilter === 'all') ? true : p.tags.includes(currentSubFilter);
      return matchCat && matchSub;
    });

    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'shop-card';
      card.setAttribute('data-id', p.id);
      card.setAttribute('data-category', p.category);
      card.innerHTML = `
        <div class="shop-card-media">
          ${p.badge ? `<span class="shop-card-badge ${p.badgeClass}">${p.badge}</span>` : ''}
          <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name} press-on nails" loading="lazy"></a>
        </div>
        <div class="shop-card-body">
          <div class="shop-card-rating" aria-label="Rated 5 stars">${p.rating}</div>
          <h2><a href="product.html?id=${p.id}" style="color:inherit;text-decoration:none;">${p.name}</a></h2>
          <p class="shop-card-desc">${p.desc}</p>
          <div class="shop-card-price">${p.price}</div>
          <button type="button" class="shop-card-btn" data-name="${p.name}">
            ADD TO BAG
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 8h14l1 14H4Z"/>
              <path d="M8 9V6a4 4 0 0 1 8 0v3"/>
            </svg>
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    if (countEl) {
      countEl.textContent = `${filtered.length}`;
    }

    // Attach Add to bag listeners
    grid.querySelectorAll('.shop-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        try {
          const bag = JSON.parse(localStorage.getItem('pressByHeartBag') || '[]');
          bag.push(name);
          localStorage.setItem('pressByHeartBag', JSON.stringify(bag));
          updateBagBadge();
          showToast(`${name} added to your bag ♡`);
        } catch {
          showToast(`Added to your bag!`);
        }
      });
    });
  }

  function setCategory(catKey, subFilterKey = 'all', updateUrl = true) {
    if (!categoryDefinitions[catKey]) {
      catKey = 'all';
    }
    currentCategory = catKey;
    currentSubFilter = subFilterKey;

    // Update Category Nav active state
    catNavLinks.forEach(link => {
      const isMatch = link.dataset.category === catKey;
      link.classList.toggle('active', isMatch);
      if (isMatch) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    renderHero(catKey);
    renderChips(catKey);
    renderProducts();

    if (updateUrl) {
      const url = new URL(window.location);
      if (catKey === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', catKey);
      }
      if (subFilterKey === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', subFilterKey);
      }
      history.replaceState(null, '', url);
    }
  }

  function setSubFilter(subFilterKey) {
    currentSubFilter = subFilterKey;
    if (chipsContainer) {
      chipsContainer.querySelectorAll('.shop-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.filter === subFilterKey);
      });
    }
    renderProducts();
    const url = new URL(window.location);
    if (subFilterKey === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', subFilterKey);
    }
    history.replaceState(null, '', url);
  }

  // Category Nav Clicks
  catNavLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const cat = link.dataset.category || 'all';
      setCategory(cat, 'all', true);
    });
  });

  // Read URL query params on page load
  const params = new URLSearchParams(window.location.search);
  let initCat = params.get('category');
  let initFilter = params.get('filter') || 'all';

  // Support legacy ?filter=kids, ?filter=pedis, ?filter=bundles, ?filter=accessories
  if (!initCat && ['kids', 'pedis', 'bundles', 'accessories'].includes(initFilter)) {
    initCat = initFilter;
    initFilter = 'all';
  } else if (!initCat) {
    initCat = 'all';
  }

  setCategory(initCat, initFilter, false);
  updateBagBadge();

  // Newsletter form
  const form = document.querySelector('form');
  if (form) {
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
