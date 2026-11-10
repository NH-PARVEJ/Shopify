// Press By Heart — Theme Script
// Preserves server-rendered Liquid HTML while providing fallback preview rendering and full cart integration

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


  // 1. Shop By Collection (Fallback rendering for preview/unpopulated state)
  const collections = [
    ['The Classics', 'Timeless styles you’ll<br>never get tired of.'],
    ['The Pinks', 'From soft blush to<br>bold Barbie pink.'],
    ['The French', 'Elegant, clean &amp;<br>always in style.'],
    ['Kawaii', 'Playful, cute &amp; full<br>of good vibes.'],
    ['Never Basic', 'Bold designs for<br>those who love to<br>stand out.'],
    ['Festivities', 'Celebrate every<br>season &amp; special<br>moment.']
  ];
  const colGrid = document.querySelector('#collection-grid');
  if (colGrid && colGrid.children.length === 0) {
    colGrid.innerHTML = collections.map(([name, description], i) => `
      <article class="collection">
        <img src="${pbhAssetUrl('collection-' + i + '.png')}" alt="${name} press-on nail designs">
        <h2>${name}</h2>
        <p>${description}</p>
        <a class="outline" href="#best-sellers" aria-label="Shop ${name} collection">
          <span class="collection-button-label">SHOP COLLECTION</span>
          <svg class="collection-button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4"/></svg>
        </a>
      </article>
    `).join('');
  }

  // 2. Best Sellers Products: Server-rendered dynamically from Shopify collection

  // 3. Features / Promos (Fallback rendering for preview)
  const features = [
    ['NEW ARRIVALS', 'Shop the latest drop'],
    ['KIDS COLLECTION', 'Fun &amp; cute designs<br>for little queens'],
    ['BUNDLES &amp; SAVE', 'More nails, more<br>savings'],
    ['ACCESSORIES', 'Everything you<br>need for the<br>perfect set']
  ];
  const featGrid = document.querySelector('#features');
  if (featGrid && featGrid.children.length === 0) {
    featGrid.innerHTML = features.map(([name, description], i) => `
      <article class="feature">
        <img src="${pbhAssetUrl('feature-' + i + '.png')}" alt="${name}">
        <div class="feature-content">
          <h2>${name}</h2>
          <p>${description}</p>
          <a href="${i === 1 ? 'kids.html' : '#best-sellers'}">SHOP NOW <span>→</span></a>
        </div>
      </article>
    `).join('');
  }

  // 4. Social / Instagram Feed (Fallback rendering for preview)
  const instagramDemoCaptions = [
    'Everyday nude nail inspiration',
    'Pretty in pink press-on nails',
    'Unbox your instant beauty',
    'Your next pink manicure',
    'Glossy French nail designs',
    'A little pink delivery'
  ];
  const socGrid = document.querySelector('#social-grid');
  if (socGrid && socGrid.children.length === 0) {
    socGrid.innerHTML = instagramDemoCaptions.map((caption, i) => `
      <a class="instagram-card" role="listitem" href="https://www.instagram.com/pressbyheart/" target="_blank" rel="noopener noreferrer" aria-label="${caption} — view @pressbyheart on Instagram">
        <img src="${pbhAssetUrl('social-' + i + '.png')}" alt="${caption}" loading="lazy">
        <span class="instagram-overlay" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7"/></svg>
          <span>View on Instagram</span>
        </span>
      </a>
    `).join('');
  }

  // Toast notification helper
  let toastTimer;
  function notify(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
  }

  // Add to Bag buttons on product cards
  document.querySelectorAll('.add').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const name = button.dataset.name || button.closest('.product')?.querySelector('h3')?.textContent?.trim() || 'Press-On Set';
      const priceStr = button.dataset.price || button.closest('.product')?.querySelector('.price')?.textContent || '£12.99';
      const cleanPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 12.99;
      const imageSrc = button.dataset.image || button.closest('.product')?.querySelector('img')?.getAttribute('src') || 'assets/product-0.png';
      const variantId = button.dataset.variantId || null;

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
        notify(`${name} added to your bag ♡`);

        if (typeof pbhSyncAllBagCounts === 'function') {
          pbhSyncAllBagCounts();
        }
        if (typeof openCartSidebar === 'function') {
          openCartSidebar(true);
        }
      } catch (err) {
        notify('Your browser could not save the bag. Please try again.');
      }

      // Live Shopify Cart API integration
      if (variantId && window.location.protocol !== 'file:') {
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        }).catch(() => {});
      }
    });
  });

  // Best Sellers carousel arrows
  document.querySelectorAll('.product-wrap .arrow').forEach(button => {
    button.addEventListener('click', () => {
      const list = document.querySelector('#products');
      if (!list) return;
      if (list.scrollWidth > list.clientWidth) {
        list.scrollBy({
          left: (button.classList.contains('next') ? 1 : -1) * list.clientWidth / 2,
          behavior: 'smooth'
        });
      } else if (button.classList.contains('next')) {
        list.append(list.firstElementChild);
      } else {
        list.prepend(list.lastElementChild);
      }
    });
  });

  // Newsletter form submission handling
  const newsletterForm = document.querySelector('.footer-newsletter form, #shopify-section-footer form');
  if (newsletterForm && window.location.protocol === 'file:') {
    newsletterForm.addEventListener('submit', event => {
      event.preventDefault();
      notify('Newsletter signup requires a connected email service.');
    });
  }

  // Testimonials / Reviews Carousel
  const reviewCarousel = document.querySelector('.testimonial');
  if (reviewCarousel) {
    let reviewSlides = [
      { text: '“The quality is unreal! They last for weeks and I get so many compliments.”', author: '- Sarah J.' },
      { text: '“So easy to apply, with a beautiful salon-style finish at home.”', author: '- Demo review' },
      { text: '“Love the glossy designs and being able to switch up my nails.”', author: '- Demo review' }
    ];

    if (reviewCarousel.dataset.review0Text) {
      const customSlides = [];
      if (reviewCarousel.dataset.review0Text) customSlides.push({ text: reviewCarousel.dataset.review0Text, author: reviewCarousel.dataset.review0Author || '' });
      if (reviewCarousel.dataset.review1Text) customSlides.push({ text: reviewCarousel.dataset.review1Text, author: reviewCarousel.dataset.review1Author || '' });
      if (reviewCarousel.dataset.review2Text) customSlides.push({ text: reviewCarousel.dataset.review2Text, author: reviewCarousel.dataset.review2Author || '' });
      if (customSlides.length > 0) reviewSlides = customSlides;
    }

    reviewCarousel.setAttribute('role', 'region');
    reviewCarousel.setAttribute('aria-roledescription', 'carousel');
    reviewCarousel.setAttribute('aria-label', 'Customer reviews');
    reviewCarousel.tabIndex = 0;

    // Only inject HTML if not already present from Liquid
    if (!reviewCarousel.querySelector('.quote-line')) {
      const reviewChevron = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5"/></svg>';
      reviewCarousel.innerHTML = `
        <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
        <div class="quote-line">
          <button type="button" class="review-prev" aria-label="Previous review">${reviewChevron}</button>
          <blockquote aria-live="polite" aria-atomic="true"><span class="review-text"></span><cite></cite></blockquote>
          <button type="button" class="review-next" aria-label="Next review">${reviewChevron}</button>
        </div>
        <div class="review-dots" aria-label="Choose a review">
          ${reviewSlides.map((_, i) => `<button type="button" aria-label="Show review ${i + 1} of ${reviewSlides.length}" data-review="${i}"></button>`).join('')}
        </div>
      `;
    }

    let activeReview = 0;
    function showReview(index, animate = true) {
      activeReview = (index + reviewSlides.length) % reviewSlides.length;
      const slide = reviewSlides[activeReview];
      const textEl = reviewCarousel.querySelector('.review-text');
      const citeEl = reviewCarousel.querySelector('cite');
      if (textEl) textEl.textContent = slide.text;
      if (citeEl) citeEl.textContent = slide.author;

      reviewCarousel.querySelectorAll('[data-review]').forEach((btn, i) => {
        btn.setAttribute('aria-current', String(i === activeReview));
      });

      if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const bq = reviewCarousel.querySelector('blockquote');
        if (bq && bq.animate) {
          bq.animate([{ opacity: 0.3, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 200 });
        }
      }
    }

    const prevBtn = reviewCarousel.querySelector('.review-prev');
    const nextBtn = reviewCarousel.querySelector('.review-next');
    if (prevBtn) prevBtn.addEventListener('click', () => showReview(activeReview - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showReview(activeReview + 1));

    reviewCarousel.querySelectorAll('[data-review]').forEach(button => {
      button.addEventListener('click', () => showReview(Number(button.dataset.review)));
    });

    reviewCarousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        showReview(activeReview + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });

    let reviewTouchStart;
    reviewCarousel.addEventListener('touchstart', event => {
      reviewTouchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }, { passive: true });

    reviewCarousel.addEventListener('touchend', event => {
      if (!reviewTouchStart) return;
      const dx = event.changedTouches[0].clientX - reviewTouchStart.x;
      const dy = event.changedTouches[0].clientY - reviewTouchStart.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        showReview(activeReview + (dx < 0 ? 1 : -1));
      }
      reviewTouchStart = null;
    }, { passive: true });

    showReview(0, false);
  }
})();
