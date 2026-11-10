const shopProducts = [
  {
    id: 'pink-perfection',
    name: 'Pink Perfection',
    price: '£12.99',
    rating: '★★★★★ 5.0',
    badge: 'Best Seller',
    badgeClass: '',
    desc: 'Flawless pink French tips with soft gloss shine.',
    image: 'assets/product-0.png',
    tags: ['all', 'best-sellers']
  },
  {
    id: 'soft-glam',
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
    name: 'Glow Girl',
    price: '£12.99',
    rating: '★★★★★ 4.9',
    badge: 'Trending',
    badgeClass: '',
    desc: 'Glazed donut rosy finish with mirror chrome reflection.',
    image: 'assets/product-2.png',
    tags: ['all', 'new-arrivals']
  },
  {
    id: 'diamond-dreams',
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
    id: 'little-princess',
    name: 'Little Princess',
    price: '£9.99',
    rating: '★★★★★ 5.0',
    badge: 'Kids Collection',
    badgeClass: 'kids',
    desc: 'Petite sizing with adorable pastel crowns & glitter.',
    image: 'assets/product-4.png',
    tags: ['all', 'kids']
  },
  {
    id: 'little-blossom',
    name: 'Little Blossom',
    price: '£8.99',
    rating: '★★★★★ 4.9',
    badge: 'Kids Floral',
    badgeClass: 'kids',
    desc: 'Mini daisy petals and sweet soft blush tones.',
    image: 'assets/kids/product-0.png',
    tags: ['all', 'kids', 'new-arrivals']
  },
  {
    id: 'rainbow-dreamer',
    name: 'Rainbow Dreamer',
    price: '£8.99',
    rating: '★★★★★ 4.9',
    badge: 'Kids Brights',
    badgeClass: 'kids',
    desc: 'Vibrant pastel rainbows designed for happy little hands.',
    image: 'assets/kids/product-1.png',
    tags: ['all', 'kids']
  },
  {
    id: 'sweet-hearts',
    name: 'Sweet Hearts',
    price: '£8.99',
    rating: '★★★★★ 5.0',
    badge: 'Kids Loved',
    badgeClass: 'kids',
    desc: 'Hand-painted miniature hearts for everyday joy.',
    image: 'assets/kids/product-2.png',
    tags: ['all', 'kids', 'best-sellers']
  },
  {
    id: 'french-luxe',
    name: 'French Luxe',
    price: '£13.99',
    rating: '★★★★★ 5.0',
    badge: 'Classic Salon',
    badgeClass: '',
    desc: 'Crisp white French manicure with durable gel coat.',
    image: 'assets/collection-0.png',
    tags: ['all', 'best-sellers']
  },
  {
    id: 'pedi-rose-bliss',
    name: 'Pedi Rose Bliss',
    price: '£11.99',
    rating: '★★★★★ 4.9',
    badge: 'Pedi Set',
    badgeClass: '',
    desc: 'Matching salon pedicure press-on nails with flexible base.',
    image: 'assets/collection-1.png',
    tags: ['all', 'pedis']
  },
  {
    id: 'nude-elegance-bundle',
    name: 'Nude Elegance Bundle',
    price: '£24.99',
    rating: '★★★★★ 5.0',
    badge: 'Save 25%',
    badgeClass: 'gold',
    desc: 'Trio pack of best-selling nude shades and nail prep essentials.',
    image: 'assets/collection-2.png',
    tags: ['all', 'bundles']
  },
  {
    id: 'essential-prep-kit',
    name: 'Essential Prep & Care Kit',
    price: '£6.99',
    rating: '★★★★★ 4.8',
    badge: 'Accessory',
    badgeClass: '',
    desc: 'Buffer, cuticle stick, dual adhesive tabs and nail glue.',
    image: 'assets/collection-4.png',
    tags: ['all', 'accessories']
  }
];

function initShopAllPage() {
  const grid = document.querySelector('#shop-all-grid');
  const countEl = document.querySelector('#product-count');
  const chips = document.querySelectorAll('.shop-chip');
  const toast = document.querySelector('.toast');
  let toastTimer;

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

  function renderProducts(filter) {
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = shopProducts.filter(p => p.tags.includes(filter));
    
    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'shop-card';
      card.setAttribute('data-id', p.id);
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

    // Attach add to bag listeners
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

  function setFilter(filter) {
    chips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.filter === filter);
    });
    document.querySelectorAll('.shop-categories a[data-category]').forEach(a => {
      const match = (filter === 'all' && a.dataset.category === 'all') || a.dataset.category === filter;
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    renderProducts(filter);
  }

  document.querySelectorAll('.shop-categories a[data-category]').forEach(link => {
    link.addEventListener('click', e => {
      const cat = link.dataset.category;
      if (cat === 'kids') return;
      e.preventDefault();
      setFilter(cat);
      const url = new URL(window.location);
      if (cat === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', cat);
      }
      history.replaceState(null, '', url);
    });
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      setFilter(filter);
      const url = new URL(window.location);
      if (filter === 'all') {
        url.searchParams.delete('filter');
      } else {
        url.searchParams.set('filter', filter);
      }
      history.replaceState(null, '', url);
    });
  });

  // URL query parameter filter support
  const params = new URLSearchParams(window.location.search);
  const initialFilter = params.get('filter') || 'all';
  const hasMatch = ['all', 'new-arrivals', 'best-sellers', 'kids', 'pedis', 'bundles', 'accessories'].includes(initialFilter);
  setFilter(hasMatch ? initialFilter : 'all');
  updateBagBadge();

  // Newsletter form handler
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
  document.addEventListener('DOMContentLoaded', initShopAllPage);
} else {
  initShopAllPage();
}
