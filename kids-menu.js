const sharedMenuIcons = {
  bag: '<path d="M5 8h14l1 14H4Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',
  sparkles: '<path d="m9 1 2 7 6 2-6 2-2 8-2-8-6-2 6-2Zm11 12 1 3 3 1-3 1-1 4-1-4-3-1 3-1Zm0-12v5m-2-3h4"/>',
  flame: '<path d="M13 1c1 7-5 8-4 13-3-1-3-4-3-4C-3 20 9 28 18 21c7-6 2-13 0-15 0 7-3 6-3 6 3-5-1-10-2-11Z"/>',
  kids: '<circle cx="7" cy="13" r="6"/><circle cx="17" cy="13" r="6"/><path d="M1 12c4 0 5-3 6-5 2 3 3 4 6 5m-2 0c3 0 5-3 6-5 2 3 3 4 6 5M5 14h.1m3 0h.1m7 0h.1m3 0h.1M5 17q2 2 4 0m6 0q2 2 4 0M7 6C2 0 7-1 12 5c4-6 10-5 5 1"/>',
  arrowRight: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevronDown: '<path d="m4 6 4 4 4-4"/>',
  nails: '<rect x="5" y="12" width="14" height="11" rx="2"/><path d="M8 12V4a4 4 0 0 1 8 0v8M8 8h8M8 16h8v4H8Z"/>',
  gift: '<path d="M3 10h18v4H3Zm2 4v9h14v-9M10 10v13m4-13v13M12 10C-1 7 6-5 12 8c5-14 13-1 0 2Z"/>',
  feet: '<ellipse cx="8" cy="14" rx="3" ry="6" transform="rotate(-20 8 14)"/><ellipse cx="17" cy="16" rx="3" ry="6" transform="rotate(20 17 16)"/><circle cx="4" cy="5" r="1.5"/><circle cx="8" cy="3" r="1.5"/><circle cx="12" cy="4" r="1"/><circle cx="16" cy="7" r="1.5"/><circle cx="20" cy="8" r="1.5"/><circle cx="23" cy="11" r="1"/>',
  bagHeart: '<path d="M4 7h16l2 16H2ZM8 8V5a4 4 0 0 1 8 0v3"/><path d="M12 18c-7-4-4-8 0-5 4-3 7 1 0 5Z"/>'
};

const kidsMenuIcons = sharedMenuIcons;

function renderMenuIcons(container) {
  if (!container) return;
  container.querySelectorAll('[data-kids-icon], [data-menu-icon]').forEach(el => {
    const name = el.dataset.kidsIcon || el.dataset.menuIcon;
    if (sharedMenuIcons[name]) {
      el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${sharedMenuIcons[name]}</svg>`;
    }
  });
}

function initMegaMenu(menuSelector, toggleSelector, isCurrentPageFn) {
  const menu = document.querySelector(menuSelector);
  const toggle = document.querySelector(toggleSelector);
  if (!menu || !toggle) return null;

  renderMenuIcons(menu);

  const header = document.querySelector('header');
  if (header && menu.parentElement !== header) {
    header.append(menu);
  }

  let menuBackdrop = document.querySelector('.kids-menu-backdrop');
  if (!menuBackdrop) {
    menuBackdrop = document.createElement('div');
    menuBackdrop.className = 'kids-menu-backdrop';
    menuBackdrop.setAttribute('aria-hidden', 'true');
    document.body.prepend(menuBackdrop);
  }

  menuBackdrop.addEventListener('click', () => {
    setOpen(false);
  });

  let menuCloseTimer;
  const isDesktop = () => matchMedia('(min-width:701px) and (hover:hover)').matches;

  function updatePointerPosition() {
    const pointer = menu.querySelector('.kids-menu-pointer, .shop-all-menu-pointer, .shop-by-design-pointer');
    if (!pointer) return;
    if (window.innerWidth <= 700) {
      pointer.style.left = '';
      return;
    }
    const toggleRect = toggle.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    if (toggleRect.width > 0 && menuRect.width > 0) {
      const pointerWidth = pointer.offsetWidth || 12;
      const targetLeft = (toggleRect.left + toggleRect.width / 2) - menuRect.left - (pointerWidth / 2);
      pointer.style.left = `${targetLeft}px`;
    }
  }

  function setOpen(open) {
    clearTimeout(menuCloseTimer);
    if (open) {
      document.querySelectorAll('.kids-menu, .shop-all-menu, .shop-by-design-menu').forEach(other => {
        if (other !== menu) other.hidden = true;
      });
      document.querySelectorAll('.kids-menu-toggle, .shop-all-menu-toggle, .shop-by-design-menu-toggle').forEach(other => {
        if (other !== toggle) other.setAttribute('aria-expanded', 'false');
      });
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      updatePointerPosition();
    } else {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
    menuBackdrop.classList.toggle('is-visible', open);
  }

  window.addEventListener('resize', () => {
    if (!menu.hidden) updatePointerPosition();
  });

  function scheduleClose() {
    clearTimeout(menuCloseTimer);
    menuCloseTimer = setTimeout(() => {
      if (!menu.matches(':hover') && !toggle.matches(':hover')) {
        setOpen(false);
      }
    }, 180);
  }

  setOpen(false);

  toggle.addEventListener('mouseenter', () => {
    if (isDesktop()) setOpen(true);
  });
  toggle.addEventListener('mouseleave', () => {
    if (isDesktop()) scheduleClose();
  });
  menu.addEventListener('mouseenter', () => clearTimeout(menuCloseTimer));
  menu.addEventListener('mouseleave', () => {
    if (isDesktop()) scheduleClose();
  });

  toggle.addEventListener('click', event => {
    if (isDesktop()) {
      if (isCurrentPageFn && isCurrentPageFn()) {
        event.preventDefault();
        setOpen(true);
      }
    } else {
      event.preventDefault();
      setOpen(menu.hidden);
    }
  });

  toggle.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  document.addEventListener('focusin', event => {
    if (!menu.contains(event.target) && event.target !== toggle) {
      if (!menu.hidden) setOpen(false);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', event => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      if (!menu.hidden) setOpen(false);
    }
  });

  matchMedia('(max-width:700px)').addEventListener('change', () => setOpen(false));

  return { setOpen, scheduleClose };
}

function initMobileAppView() {
  if (document.querySelector('.mobile-app-dock')) return;

  try {
    const path = (window.location.pathname || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();

    const isKids = path.includes('kids') || search.includes('category=kids');
    const isDesign = path.includes('shop-by-design');
    const isShop = (path.includes('shop-all') || path.includes('category')) && !isKids;
    const isHome = !isKids && !isDesign && !isShop && (path.includes('index') || path.endsWith('/') || path === '');

    let bagCount = 0;
    try {
      const bag = JSON.parse(localStorage.getItem('pressByHeartBag') || '[]');
      bagCount = Array.isArray(bag) ? bag.length : 0;
    } catch {}

    const dock = document.createElement('nav');
    dock.className = 'mobile-app-dock';
    dock.setAttribute('aria-label', 'Mobile application bottom navigation');
    dock.style.margin = '0';
    dock.style.marginLeft = '0px';
    dock.style.marginRight = '0px';
    dock.style.left = '0px';
    dock.style.right = '0px';
    dock.style.width = '100%';
    dock.innerHTML = `
      <a href="index.html" class="app-tab ${isHome ? 'active' : ''}">
        <span class="app-tab-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/></svg>
        </span>
        <span class="app-tab-label">Home</span>
      </a>
      <a href="category.html?category=all" class="app-tab ${isShop ? 'active' : ''}">
        <span class="app-tab-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
        </span>
        <span class="app-tab-label">Shop All</span>
      </a>
      <a href="shop-by-design.html" class="app-tab ${isDesign ? 'active' : ''}">
        <span class="app-tab-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>
        </span>
        <span class="app-tab-label">Designs</span>
      </a>
      <a href="category.html?category=kids" class="app-tab ${isKids ? 'active' : ''}">
        <span class="app-tab-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 7 4 5 5-8 5 8 4-5-2 13H5L3 7Z"/><path d="M5 16h14"/></svg>
        </span>
        <span class="app-tab-label">Kids</span>
      </a>
      <button type="button" class="app-tab app-tab-menu app-menu-btn" id="mobile-dock-menu-btn" aria-label="Menu" aria-controls="mobile-app-drawer">
        <span class="app-tab-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </span>
        <span class="app-tab-label">Menu</span>
      </button>
    `;
    document.body.appendChild(dock);

    const dockMenuBtn = dock.querySelector('#mobile-dock-menu-btn');
    if (dockMenuBtn) {
      dockMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setDrawer(true);
      });
    }

    function syncDockBadge() {
      try {
        const bag = JSON.parse(localStorage.getItem('pressByHeartBag') || '[]');
        const count = Array.isArray(bag) ? bag.length : 0;
        const badge = document.getElementById('mobile-dock-badge');
        if (badge) {
          badge.textContent = count;
          badge.style.transform = 'scale(1.25)';
          setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
        }
      } catch {}
    }

    window.addEventListener('storage', syncDockBadge);
    document.addEventListener('click', (e) => {
      if (e.target.closest('.add, .kids-add, .shop-card-btn, .design-card-btn, .pdp-add-btn, .add-to-bag-btn')) {
        setTimeout(syncDockBadge, 150);
      }
    });

    if (!document.querySelector('.mobile-app-drawer')) {
      const drawer = document.createElement('div');
      drawer.className = 'mobile-app-drawer';
      drawer.id = 'mobile-app-drawer';
      drawer.setAttribute('aria-hidden', 'true');
      drawer.innerHTML = `
        <div class="app-drawer-overlay" aria-hidden="true"></div>
        <div class="app-drawer-content" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          <div class="app-drawer-header">
            <div class="app-drawer-brand">
              <img src="assets/logo-hq-v2.png" alt="Press By Heart" class="app-drawer-logo">
              <span class="app-drawer-tagline">Quick press, instant beauty ♡</span>
            </div>
            <button type="button" class="app-drawer-close" aria-label="Close menu">✕</button>
          </div>
          <div class="app-drawer-delivery">
            <span>🚚</span> <strong>Free UK Tracked Delivery</strong> on orders over £30
          </div>
          <div class="app-drawer-nav">
            <a href="index.html" class="app-drawer-link ${isHome ? 'active' : ''}">
              <span class="app-link-glyph">🏠</span>
              <span class="app-link-title">Home</span>
            </a>
            <a href="category.html?category=all" class="app-drawer-link ${isShop ? 'active' : ''}">
              <span class="app-link-glyph">💅</span>
              <span class="app-link-title">All Press-On Nails</span>
              <span class="app-link-pill">24 Sets</span>
            </a>
            <a href="shop-by-design.html" class="app-drawer-link ${isDesign ? 'active' : ''}">
              <span class="app-link-glyph">🎨</span>
              <span class="app-link-title">Shop By Design</span>
            </a>
            <a href="category.html?category=kids" class="app-drawer-link ${isKids ? 'active' : ''}">
              <span class="app-link-glyph">👑</span>
              <span class="app-link-title">Kids Collection</span>
              <span class="app-link-pill">Safe &amp; Cute</span>
            </a>
            <a href="category.html?category=pedis" class="app-drawer-link">
              <span class="app-link-glyph">👣</span>
              <span class="app-link-title">Pedis Collection</span>
            </a>
            <a href="category.html?category=bundles" class="app-drawer-link">
              <span class="app-link-glyph">🎁</span>
              <span class="app-link-title">Bundles &amp; Save</span>
              <span class="app-link-pill sale">Save 25%</span>
            </a>
            <a href="category.html?category=accessories" class="app-drawer-link">
              <span class="app-link-glyph">✨</span>
              <span class="app-link-title">Accessories &amp; Care</span>
            </a>
          </div>
          <div class="app-drawer-actions">
            <a href="tel:07944545406" class="app-drawer-action-btn primary">
              BOOK APPOINTMENT <span>👑</span>
            </a>
            <a href="https://www.instagram.com/pressbyheart/" target="_blank" rel="noopener noreferrer" class="app-drawer-action-btn secondary">
              FOLLOW ON INSTAGRAM <span>◎</span>
            </a>
          </div>
          <div class="app-drawer-footer">
            <p>📞 Need Help? Call <a href="tel:07944545406">07944 545 406</a></p>
            <small>© 2025 Press By Heart London</small>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);

      const closeBtn = drawer.querySelector('.app-drawer-close');
      const overlay = drawer.querySelector('.app-drawer-overlay');
      function setDrawer(open) {
        drawer.classList.toggle('is-open', open);
        drawer.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
      }
      if (closeBtn) closeBtn.addEventListener('click', () => setDrawer(false));
      if (overlay) overlay.addEventListener('click', () => setDrawer(false));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
      });

      // Mobile hamburger menu button is now located in the bottom dock navigation per design

      // Ensure nav cart/bag icon is present in header
      if (header && !header.querySelector('.nav-bag')) {
        const navBag = document.createElement('a');
        navBag.className = 'nav-bag';
        navBag.href = '#bag';
        navBag.setAttribute('aria-label', 'Shopping bag');
        navBag.innerHTML = `<svg class="bag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 14H4Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg><span class="bag-count">0</span>`;
        const bookBtn = header.querySelector('.book');
        if (bookBtn) {
          header.insertBefore(navBag, bookBtn);
        } else {
          header.appendChild(navBag);
        }
      }

      // Smooth scroll to top when clicking header logo if already on home page
      const headerLogo = header ? (header.querySelector('a:has(.logo)') || header.querySelector('a[href="index.html"]') || header.querySelector('a[href="#"]')) : null;
      if (headerLogo) {
        headerLogo.addEventListener('click', (e) => {
          const p = (window.location.pathname || '').toLowerCase();
          const page = p.split('/').pop();
          if (page === '' || page === 'index.html') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (window.location.hash) {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }
        });
      }

      if (isHome) {
        const drawerHome = drawer ? drawer.querySelector('.app-drawer-link[href="index.html"]') : null;
        if (drawerHome) {
          drawerHome.addEventListener('click', (e) => {
            e.preventDefault();
            setDrawer(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }
        const dockHome = dock ? dock.querySelector('.app-tab[href="index.html"]') : null;
        if (dockHome) {
          dockHome.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }
      }
    }
  } catch (err) {
    // Graceful fallback
  }
}

// --- MASTER CATALOG FOR CART SIDEBAR ---
const PBH_CART_CATALOG = {
  // Homepage & Core Nails
  'classic nude': { name: 'Classic Nude', price: 12.99, image: 'assets/product-0.png', id: '1' },
  'pink baddie': { name: 'Pink Baddie', price: 13.99, image: 'assets/product-1.png', id: '2' },
  'french collection': { name: 'French Collection', price: 12.99, image: 'assets/product-2.png', id: '0' },
  'glitter gloss': { name: 'Glitter Gloss', price: 13.99, image: 'assets/product-3.png', id: '3' },
  'love struck': { name: 'Love Struck', price: 13.99, image: 'assets/product-4.png', id: '4' },

  // Kids Collection
  'little blossom': { name: 'Little Blossom', price: 8.99, image: 'assets/kids/card-blossom.png', id: '1', category: 'kids' },
  'rainbow dreamer': { name: 'Rainbow Dreamer', price: 8.99, image: 'assets/kids/product-1.png', id: '2', category: 'kids' },
  'sweet hearts': { name: 'Sweet Hearts', price: 8.99, image: 'assets/kids/product-2.png', id: '3', category: 'kids' },
  'daisy days': { name: 'Daisy Days', price: 8.99, image: 'assets/kids/product-3.png', id: '4', category: 'kids' },
  'princess sparkle': { name: 'Princess Sparkle', price: 8.99, image: 'assets/kids/product-4.png', id: '5', category: 'kids' },
  'sweet cherry': { name: 'Sweet Cherry', price: 9.99, image: 'assets/kids/card-cherry.png', id: 'sweet-cherry', category: 'kids' },
  'pastel rainbow': { name: 'Pastel Rainbow', price: 9.99, image: 'assets/kids/card-rainbow.png', id: 'pastel-rainbow', category: 'kids' },
  'pink butterfly': { name: 'Pink Butterfly', price: 9.99, image: 'assets/kids/card-butterfly.png', id: 'pink-butterfly', category: 'kids' },
  'glitter princess': { name: 'Glitter Princess', price: 9.99, image: 'assets/kids/card-glitter.png', id: 'glitter-princess', category: 'kids' },
  'teddy bear love': { name: 'Teddy Bear Love', price: 9.99, image: 'assets/kids/card-teddy.png', id: 'teddy-bear-love', category: 'kids' },

  // Category & Shop All Products
  'pink perfection': { name: 'Pink Perfection', price: 12.99, image: 'assets/product-0.png', id: 'pink-perfection' },
  'soft glam': { name: 'Soft Glam', price: 12.99, image: 'assets/product-1.png', id: 'soft-glam' },
  'glow girl': { name: 'Glow Girl', price: 12.99, image: 'assets/product-2.png', id: 'glow-girl' },
  'diamond dreams': { name: 'Diamond Dreams', price: 13.99, image: 'assets/product-3.png', id: 'diamond-dreams' },
  'french elegance': { name: 'French Elegance', price: 13.99, image: 'assets/product-4.png', id: 'french-elegance' },
  'cherry glaze': { name: 'Cherry Glaze', price: 12.99, image: 'assets/product-0.png', id: 'cherry-glaze' },
  'velvet rose': { name: 'Velvet Rose', price: 14.99, image: 'assets/product-1.png', id: 'velvet-rose' },
  'blush aura': { name: 'Blush Aura', price: 13.99, image: 'assets/product-2.png', id: 'blush-aura' },
  'baby french': { name: 'Baby French', price: 11.99, image: 'assets/product-3.png', id: 'baby-french' },
  'chrome halo': { name: 'Chrome Halo', price: 14.99, image: 'assets/product-4.png', id: 'chrome-halo' },
  'cotton candy': { name: 'Cotton Candy', price: 12.99, image: 'assets/product-0.png', id: 'cotton-candy' },
  'rose quartz': { name: 'Rose Quartz', price: 15.99, image: 'assets/product-1.png', id: 'rose-quartz' },

  // Pedis
  'french rose pedicure': { name: 'French Rose Pedicure', price: 11.99, image: 'assets/product-2.png', id: 'pedi-french' },
  'glazed donut pedicure': { name: 'Glazed Donut Pedicure', price: 11.99, image: 'assets/product-3.png', id: 'pedi-glazed' },
  'soft nude pedicure': { name: 'Soft Nude Pedicure', price: 10.99, image: 'assets/product-4.png', id: 'pedi-nude' },
  'ruby sparkle pedicure': { name: 'Ruby Sparkle Pedicure', price: 12.99, image: 'assets/product-0.png', id: 'pedi-ruby' },

  // Bundles
  'pink lovers trio bundle': { name: 'Pink Lovers Trio Bundle', price: 29.99, image: 'assets/product-1.png', id: 'bundle-pink' },
  'french essentials bundle': { name: 'French Essentials Bundle', price: 27.99, image: 'assets/product-2.png', id: 'bundle-french' },
  'luxury salon starter kit': { name: 'Luxury Salon Starter Kit', price: 34.99, image: 'assets/product-3.png', id: 'bundle-starter' },
  'glaze & glow bundle': { name: 'Glaze & Glow Bundle', price: 28.99, image: 'assets/product-4.png', id: 'bundle-glaze' },

  // Accessories
  'ultra-strong brush-on nail glue': { name: 'Ultra-Strong Brush-On Nail Glue', price: 4.99, image: 'assets/product-0.png', id: 'acc-glue' },
  'gentle sticky adhesive tabs': { name: 'Gentle Sticky Adhesive Tabs', price: 3.99, image: 'assets/product-1.png', id: 'acc-tabs' },
  'nourishing cuticle oil pen': { name: 'Nourishing Cuticle Oil Pen', price: 5.99, image: 'assets/product-2.png', id: 'acc-oil' },
  'luxury prep & buffer duo': { name: 'Luxury Prep & Buffer Duo', price: 4.50, image: 'assets/product-3.png', id: 'acc-buffer' },

  // Shop By Design
  'pearly white minimalist': { name: 'Pearly White Minimalist', price: 15.99, image: 'assets/product-0.png', id: 'pearly-white' },
  'rose quartz marble': { name: 'Rose Quartz Marble', price: 16.99, image: 'assets/product-1.png', id: 'rose-quartz-marble' },
  'french tip chrome': { name: 'French Tip Chrome', price: 15.99, image: 'assets/product-2.png', id: 'french-tip-chrome' },
  'blush pink coffin': { name: 'Blush Pink Coffin', price: 14.99, image: 'assets/product-3.png', id: 'blush-pink-coffin' },
  'glazed donut short': { name: 'Glazed Donut Short', price: 14.99, image: 'assets/product-4.png', id: 'glazed-donut-short' },
  'sugar plum stiletto': { name: 'Sugar Plum Stiletto', price: 16.99, image: 'assets/product-0.png', id: 'sugar-plum-stiletto' },
  'matte nude almond': { name: 'Matte Nude Almond', price: 13.99, image: 'assets/product-1.png', id: 'matte-nude-almond' },
  'lilac bloom square': { name: 'Lilac Bloom Square', price: 15.99, image: 'assets/product-2.png', id: 'lilac-bloom-square' },
  'gold foil emerald': { name: 'Gold Foil Emerald', price: 17.99, image: 'assets/product-3.png', id: 'gold-foil-emerald' },
  'mocha swirl coffin': { name: 'Mocha Swirl Coffin', price: 15.99, image: 'assets/product-4.png', id: 'mocha-swirl-coffin' },
  'cherry red ballerina': { name: 'Cherry Red Ballerina', price: 16.99, image: 'assets/product-0.png', id: 'cherry-red-ballerina' },
  'opal chrome square': { name: 'Opal Chrome Square', price: 16.99, image: 'assets/product-1.png', id: 'opal-chrome-square' },
  'baby pink pearl': { name: 'Baby Pink Pearl', price: 14.99, image: 'assets/product-2.png', id: 'baby-pink-pearl' },
  'cat eye velvet': { name: 'Cat Eye Velvet', price: 17.99, image: 'assets/product-3.png', id: 'cat-eye-velvet' },
  'midnight sparkle stiletto': { name: 'Midnight Sparkle Stiletto', price: 18.99, image: 'assets/product-4.png', id: 'midnight-sparkle-stiletto' },
  'clean girl oval': { name: 'Clean Girl Oval', price: 13.99, image: 'assets/product-0.png', id: 'clean-girl-oval' }
};

let pbhAppliedPromo = null;

function pbhGetRawBag() {
  try {
    const raw = JSON.parse(localStorage.getItem('pressByHeartBag') || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function pbhSetRawBag(bag) {
  try {
    localStorage.setItem('pressByHeartBag', JSON.stringify(bag));
  } catch {}
  pbhSyncAllBagCounts();
  window.dispatchEvent(new CustomEvent('pressByHeartBagUpdated', { detail: { bag } }));
}

function pbhSyncAllBagCounts() {
  const bag = pbhGetRawBag();
  let totalCount = 0;
  bag.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      totalCount += Number(item.quantity) || 1;
    } else {
      totalCount += 1;
    }
  });

  document.querySelectorAll('.bag-count').forEach(el => {
    el.textContent = String(totalCount);
  });
  const dockBadge = document.getElementById('mobile-dock-badge');
  if (dockBadge) {
    dockBadge.textContent = String(totalCount);
  }
  const drawerCount = document.getElementById('cart-drawer-item-count');
  if (drawerCount) {
    drawerCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;
  }
}

function pbhGetGroupedCartItems() {
  const rawBag = pbhGetRawBag();
  const groups = new Map();

  rawBag.forEach((item, index) => {
    let name = '';
    let price = 12.99;
    let image = 'assets/product-0.png';
    let details = 'Standard Set • Glue & Prep Kit Included';
    let quantity = 1;
    let groupKey = '';
    let isObject = false;
    let productId = '1';

    if (typeof item === 'string') {
      name = item;
      const lower = item.trim().toLowerCase();
      const meta = PBH_CART_CATALOG[lower];
      if (meta) {
        price = meta.price;
        image = meta.image;
        productId = meta.id;
        if (meta.category === 'kids') {
          details = 'Kids Sized • Gentle Adhesive Tabs Included';
        }
      }
      groupKey = `str_${lower}`;
    } else if (typeof item === 'object' && item !== null) {
      isObject = true;
      name = item.name || 'Press-On Nails';
      const lower = name.trim().toLowerCase();
      const meta = PBH_CART_CATALOG[lower];
      price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || (meta ? meta.price : 12.99);
      image = item.image || (meta ? meta.image : 'assets/product-0.png');
      productId = item.id || (meta ? meta.id : '1');
      const shape = item.shape || 'Almond';
      const length = item.length || 'Medium';
      const size = item.size || 'M';
      details = `Shape: ${shape} • Length: ${length} • Size: ${size}`;
      quantity = Number(item.quantity) || 1;
      groupKey = `obj_${lower}_${shape}_${length}_${size}`.toLowerCase();
    }

    if (groups.has(groupKey)) {
      const existing = groups.get(groupKey);
      existing.quantity += quantity;
      existing.rawIndices.push(index);
    } else {
      groups.set(groupKey, {
        key: groupKey,
        name,
        price,
        image,
        details,
        productId,
        quantity,
        isObject,
        rawIndices: [index]
      });
    }
  });

  return Array.from(groups.values());
}

function renderCartSidebar() {
  const drawer = document.getElementById('cart-sidebar-drawer');
  if (!drawer) return;

  const items = pbhGetGroupedCartItems();
  const bodyEl = document.getElementById('cart-sidebar-body');
  const footerEl = document.getElementById('cart-sidebar-footer');
  const shippingGoalEl = document.getElementById('cart-shipping-goal');
  const countEl = document.getElementById('cart-drawer-item-count');

  let totalItemsCount = 0;
  let subtotal = 0;

  items.forEach(item => {
    totalItemsCount += item.quantity;
    subtotal += item.price * item.quantity;
  });

  if (countEl) {
    countEl.textContent = `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'}`;
  }

  // Update Free Shipping Progress Bar
  const freeShippingThreshold = 30.00;
  if (shippingGoalEl) {
    const labelEl = document.getElementById('cart-shipping-label');
    const fillEl = document.getElementById('cart-shipping-fill');
    if (subtotal >= freeShippingThreshold) {
      if (labelEl) labelEl.innerHTML = `<span>🎉</span> <strong>FREE UK Tracked Delivery Unlocked!</strong>`;
      if (fillEl) {
        fillEl.style.width = '100%';
        fillEl.classList.add('unlocked');
      }
    } else {
      const remaining = (freeShippingThreshold - subtotal).toFixed(2);
      const percent = Math.min(100, Math.max(0, Math.round((subtotal / freeShippingThreshold) * 100)));
      if (labelEl) labelEl.innerHTML = `<span>🚚</span> <span>Add <strong>£${remaining}</strong> more for <strong>FREE Tracked UK Delivery</strong></span>`;
      if (fillEl) {
        fillEl.style.width = `${percent}%`;
        fillEl.classList.remove('unlocked');
      }
    }
  }

  // Render Body: Items or Empty State
  if (bodyEl) {
    if (items.length === 0) {
      bodyEl.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon-wrap">
            <svg viewBox="0 0 24 24" class="cart-empty-svg" aria-hidden="true">
              <path d="M5 8h14l1 14H4Z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/>
              <path d="M8 9V6a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <path d="M12 18c-4-2.5-2.5-5 0-3 2.5-2 4 .5 0 3Z" fill="#fa4087"/>
            </svg>
          </div>
          <h3 class="cart-empty-title">Your shopping bag is empty</h3>
          <p class="cart-empty-desc">Looks like you haven't discovered your favourite press-on nails yet. Find your perfect fit and instant salon glam!</p>
          <a href="category.html?category=all" class="cart-empty-cta">
            START SHOPPING <span>✨</span>
          </a>
        </div>
      `;
      if (footerEl) footerEl.style.display = 'none';
    } else {
      if (footerEl) footerEl.style.display = 'flex';
      bodyEl.innerHTML = items.map(item => `
        <article class="cart-item-card" data-key="${item.key}">
          <a href="product.html?id=${item.productId}" class="cart-item-img-wrap" aria-label="View ${item.name}">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </a>
          <div class="cart-item-info">
            <div class="cart-item-top">
              <h3 class="cart-item-title"><a href="product.html?id=${item.productId}">${item.name}</a></h3>
              <button type="button" class="cart-item-remove" data-action="remove" data-key="${item.key}" aria-label="Remove ${item.name} from bag">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
              </button>
            </div>
            ${item.details ? `<p class="cart-item-details">${item.details}</p>` : ''}
            <div class="cart-item-bottom">
              <div class="cart-item-stepper">
                <button type="button" class="cart-step-btn" data-action="decrease" data-key="${item.key}" aria-label="Decrease quantity of ${item.name}">−</button>
                <span class="cart-step-qty" aria-label="Quantity ${item.quantity}">${item.quantity}</span>
                <button type="button" class="cart-step-btn" data-action="increase" data-key="${item.key}" aria-label="Increase quantity of ${item.name}">+</button>
              </div>
              <div class="cart-item-pricing">
                <span class="cart-item-total-price">£${(item.price * item.quantity).toFixed(2)}</span>
                ${item.quantity > 1 ? `<small class="cart-item-unit-price">(£${item.price.toFixed(2)} each)</small>` : ''}
              </div>
            </div>
          </div>
        </article>
      `).join('');
    }
  }

  // Update Summary Table
  const subtotalEl = document.getElementById('cart-summary-subtotal');
  const discountRowEl = document.getElementById('cart-discount-row');
  const discountCodeEl = document.getElementById('cart-discount-code');
  const discountEl = document.getElementById('cart-summary-discount');
  const shippingEl = document.getElementById('cart-summary-shipping');
  const totalEl = document.getElementById('cart-summary-total');

  let discountAmount = 0;
  if (pbhAppliedPromo && subtotal > 0) {
    discountAmount = (subtotal * (pbhAppliedPromo.percent / 100));
    if (discountRowEl) discountRowEl.style.display = 'flex';
    if (discountCodeEl) discountCodeEl.textContent = pbhAppliedPromo.code;
    if (discountEl) discountEl.textContent = `-£${discountAmount.toFixed(2)}`;
  } else {
    if (discountRowEl) discountRowEl.style.display = 'none';
  }

  const shippingCost = (subtotal >= freeShippingThreshold || subtotal === 0) ? 0 : 3.99;
  const estimatedTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  if (subtotalEl) subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = (shippingCost === 0 && subtotal > 0) ? 'FREE' : `£${shippingCost.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `£${estimatedTotal.toFixed(2)}`;

  pbhSyncAllBagCounts();
}

function pbhStepQuantity(key, delta) {
  let rawBag = pbhGetRawBag();
  const groups = pbhGetGroupedCartItems();
  const targetGroup = groups.find(g => g.key === key);
  if (!targetGroup) return;

  if (delta > 0) {
    // Increase quantity
    const lastIndex = targetGroup.rawIndices[targetGroup.rawIndices.length - 1];
    const source = rawBag[lastIndex];
    if (typeof source === 'object' && source !== null) {
      source.quantity = (Number(source.quantity) || 1) + 1;
    } else {
      rawBag.push(source);
    }
  } else if (delta < 0) {
    // Decrease quantity
    const lastIndex = targetGroup.rawIndices[targetGroup.rawIndices.length - 1];
    const source = rawBag[lastIndex];
    if (typeof source === 'object' && source !== null && (Number(source.quantity) || 1) > 1) {
      source.quantity = Number(source.quantity) - 1;
    } else {
      rawBag.splice(lastIndex, 1);
    }
  }

  pbhSetRawBag(rawBag);
  renderCartSidebar();
}

function pbhRemoveCartItem(key) {
  let rawBag = pbhGetRawBag();
  const groups = pbhGetGroupedCartItems();
  const targetGroup = groups.find(g => g.key === key);
  if (!targetGroup) return;

  const toRemove = new Set(targetGroup.rawIndices);
  rawBag = rawBag.filter((_, idx) => !toRemove.has(idx));

  pbhSetRawBag(rawBag);
  renderCartSidebar();
}

function pbhApplyPromo() {
  const input = document.getElementById('cart-promo-input');
  const statusEl = document.getElementById('cart-promo-status');
  if (!input || !statusEl) return;

  const code = (input.value || '').trim().toUpperCase();
  if (!code) {
    statusEl.className = 'cart-promo-status error';
    statusEl.textContent = 'Please enter a promo code.';
    return;
  }

  if (code === 'HEART10' || code === 'SAVE10' || code === 'LOVE10') {
    pbhAppliedPromo = { code, percent: 10 };
    statusEl.className = 'cart-promo-status success';
    statusEl.innerHTML = `✓ Code <strong>${code}</strong> applied! (10% OFF)`;
    renderCartSidebar();
  } else if (code === 'PRESS20') {
    pbhAppliedPromo = { code, percent: 20 };
    statusEl.className = 'cart-promo-status success';
    statusEl.innerHTML = `✓ VIP Code <strong>PRESS20</strong> applied! (20% OFF)`;
    renderCartSidebar();
  } else {
    statusEl.className = 'cart-promo-status error';
    statusEl.textContent = `Promo code "${code}" is invalid or expired.`;
  }
}

function openCartSidebar(open = true) {
  let drawer = document.getElementById('cart-sidebar-drawer');
  if (!drawer) {
    initCartSidebar();
    drawer = document.getElementById('cart-sidebar-drawer');
  }
  if (!drawer) return;

  if (open) {
    renderCartSidebar();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-drawer-open');
    const closeBtn = document.getElementById('cart-sidebar-close-btn');
    if (closeBtn) closeBtn.focus();
  } else {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-drawer-open');
  }
}

window.openCartSidebar = openCartSidebar;
window.toggleCartSidebar = function() {
  const drawer = document.getElementById('cart-sidebar-drawer');
  const isOpen = drawer && drawer.classList.contains('is-open');
  openCartSidebar(!isOpen);
};

function initCartSidebar() {
  if (document.getElementById('cart-sidebar-drawer')) return;

  const drawer = document.createElement('div');
  drawer.className = 'cart-sidebar-drawer';
  drawer.id = 'cart-sidebar-drawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-label', 'Shopping Bag');

  drawer.innerHTML = `
    <div class="cart-sidebar-overlay" aria-hidden="true"></div>
    <aside class="cart-sidebar-panel">
      <!-- Header -->
      <div class="cart-sidebar-header">
        <div class="cart-header-title-wrap">
          <h2 class="cart-sidebar-title">Your Shopping Bag <span>♡</span></h2>
          <span class="cart-sidebar-count-pill" id="cart-drawer-item-count">0 items</span>
        </div>
        <button type="button" class="cart-sidebar-close" id="cart-sidebar-close-btn" aria-label="Close bag drawer">✕</button>
      </div>

      <!-- Free Shipping Goal Progress Bar -->
      <div class="cart-shipping-goal" id="cart-shipping-goal">
        <div class="cart-shipping-label" id="cart-shipping-label">
          <span>🚚</span> <span>Add <strong>£30.00</strong> more for <strong>FREE Tracked UK Delivery</strong></span>
        </div>
        <div class="cart-shipping-track">
          <div class="cart-shipping-fill" id="cart-shipping-fill" style="width: 0%;"></div>
        </div>
      </div>

      <!-- Scrollable Cart Items Container -->
      <div class="cart-sidebar-body" id="cart-sidebar-body"></div>

      <!-- Footer / Totals & Checkout -->
      <div class="cart-sidebar-footer" id="cart-sidebar-footer">
        <!-- Promo code section -->
        <div class="cart-promo-section cart-promo-wrap" style="display: flex !important; flex-direction: column !important; gap: 8px !important; width: 100% !important; box-sizing: border-box !important;">
          <div class="cart-promo-input-wrap cart-promo-input-row" style="display: flex !important; align-items: center !important; gap: 8px !important; width: 100% !important; box-sizing: border-box !important;">
            <input type="text" id="cart-promo-input" class="cart-promo-input" placeholder="Promo code (e.g. HEART10)" aria-label="Enter promotional code" autocomplete="off" style="flex: 1 1 auto !important; min-width: 0 !important; width: 100% !important; height: 42px !important; padding: 0 14px !important; border: 1.5px solid #f1dde4 !important; border-radius: 8px !important; background: #ffffff !important; font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important; font-size: 13px !important; color: #4a1520 !important; outline: none !important; box-sizing: border-box !important; -webkit-appearance: none !important; appearance: none !important; box-shadow: none !important;" />
            <button type="button" id="cart-promo-apply-btn" class="cart-promo-btn" style="padding: 0 18px !important; height: 42px !important; min-height: 42px !important; background: #fdf0f4 !important; border: 1.5px solid #f1dde4 !important; border-radius: 8px !important; color: #fa4087 !important; font-family: Poppins, -apple-system, BlinkMacSystemFont, Arial, sans-serif !important; font-size: 12px !important; font-weight: 700 !important; letter-spacing: 0.6px !important; cursor: pointer !important; white-space: nowrap !important; flex-shrink: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; box-sizing: border-box !important; transition: all 0.2s ease !important; text-transform: uppercase !important;">APPLY</button>
          </div>
          <div class="cart-promo-status" id="cart-promo-status" style="font-size: 11px !important; font-family: Poppins, Arial, sans-serif !important; min-height: 14px !important; line-height: 1.3 !important;"></div>
        </div>

        <!-- Totals summary -->
        <div class="cart-summary-table">
          <div class="cart-summary-row">
            <span>Subtotal</span>
            <span id="cart-summary-subtotal">£0.00</span>
          </div>
          <div class="cart-summary-row cart-discount-row" id="cart-discount-row" style="display: none;">
            <span>Promo Discount (<span id="cart-discount-code">HEART10</span>)</span>
            <span id="cart-summary-discount">-£0.00</span>
          </div>
          <div class="cart-summary-row">
            <span>Estimated UK Delivery</span>
            <span id="cart-summary-shipping">£3.99</span>
          </div>
          <div class="cart-summary-row cart-summary-total">
            <span>Estimated Total</span>
            <strong id="cart-summary-total">£0.00</strong>
          </div>
        </div>

        <!-- Checkout button -->
        <button type="button" class="cart-checkout-btn" id="cart-checkout-btn">
          PROCEED TO CHECKOUT <span>🔒</span>
        </button>

        <p class="cart-continue-shop-wrap">
          <button type="button" class="cart-continue-shop-btn" id="cart-continue-shop-btn">Continue Shopping →</button>
        </p>

        <!-- Trust badges -->
        <div class="cart-trust-badges">
          <div class="cart-payment-icons">
            <span class="pay-chip">VISA</span>
            <span class="pay-chip">Mastercard</span>
            <span class="pay-chip">Apple Pay</span>
            <span class="pay-chip">PayPal</span>
          </div>
          <div class="cart-ssl-note">🔒 256-bit SSL Encrypted Luxury Checkout</div>
        </div>
      </div>
    </aside>
  `;

  document.body.appendChild(drawer);

  // Event Listeners for Cart Actions
  drawer.querySelector('.cart-sidebar-overlay').addEventListener('click', () => openCartSidebar(false));
  drawer.querySelector('#cart-sidebar-close-btn').addEventListener('click', () => openCartSidebar(false));
  drawer.querySelector('#cart-continue-shop-btn').addEventListener('click', () => openCartSidebar(false));

  const promoBtn = drawer.querySelector('#cart-promo-apply-btn');
  if (promoBtn) promoBtn.addEventListener('click', pbhApplyPromo);

  const promoInput = drawer.querySelector('#cart-promo-input');
  if (promoInput) {
    promoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        pbhApplyPromo();
      }
    });
  }

  const checkoutBtn = drawer.querySelector('#cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const items = pbhGetGroupedCartItems();
      if (items.length === 0) return;
      let totalText = document.getElementById('cart-summary-total')?.textContent || '£0.00';
      alert(`🎉 Thank you for shopping with Press By Heart!\n\nYour order total is ${totalText}.\nProceeding to secure 256-bit SSL checkout...\n\n(Demo checkout completed ♡)`);
    });
  }

  drawer.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.action;
    const key = actionBtn.dataset.key;
    if (action === 'increase') {
      pbhStepQuantity(key, +1);
    } else if (action === 'decrease') {
      pbhStepQuantity(key, -1);
    } else if (action === 'remove') {
      pbhRemoveCartItem(key);
    }
  });

  // Global triggers for opening cart sidebar
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.nav-bag, a[href="#bag"], #mobile-dock-bag-btn, .cart-trigger, .open-cart-btn, .toast-bag-btn');
    if (trigger) {
      e.preventDefault();
      openCartSidebar(true);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      openCartSidebar(false);
    }
  });

  // Re-sync on storage changes across tabs
  window.addEventListener('storage', () => {
    pbhSyncAllBagCounts();
    if (drawer.classList.contains('is-open')) {
      renderCartSidebar();
    }
  });

  // Re-sync when bag buttons are clicked
  document.addEventListener('click', (e) => {
    if (e.target.closest('.add, .kids-add, .shop-card-btn, .design-card-btn, .pdp-add-btn, .add-to-bag-btn')) {
      setTimeout(() => {
        pbhSyncAllBagCounts();
        if (drawer.classList.contains('is-open')) {
          renderCartSidebar();
        }
      }, 150);
    }
  });

  // Initial count sync & render
  pbhSyncAllBagCounts();
  renderCartSidebar();
}

function initKidsMegaMenu() {
  renderMenuIcons(document);
  initMegaMenu('#kids-menu', '.kids-menu-toggle', () => document.body.classList.contains('kids-page'));
  initMegaMenu('#shop-all-menu', '.shop-all-menu-toggle', () => document.body.classList.contains('shop-all-page'));
  initMegaMenu('#shop-by-design-menu', '.shop-by-design-menu-toggle', () => document.body.classList.contains('shop-by-design-page'));
  initMobileAppView();
  initCartSidebar();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKidsMegaMenu);
} else {
  initKidsMegaMenu();
}

