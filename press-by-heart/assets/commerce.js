/* Shopify owns products, inventory, discounts and the cart. No browser-only basket. */
(() => {
  'use strict';
  if (window.pbhCommerce) return;
  window.pbhCommerce = true;
  const root = window.Shopify?.routes?.root || window.ShopifyTheme?.routes?.root || '/';
  const url = path => root.replace(/\/$/, '') + '/' + path;
  const q = (s, scope = document) => scope.querySelector(s);
  const qa = (s, scope = document) => [...scope.querySelectorAll(s)];
  let lastFocus, pending = false;
  function notify(message) {
    const toast = q('.toast');
    if (!toast) return;
    toast.textContent = message; toast.classList.add('visible');
    clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('visible'), 4000);
  }
  async function request(path, data) {
    const response = await fetch(url(path), {method:data?'POST':'GET', headers:{'Content-Type':'application/json',Accept:'application/json'}, ...(data?{body:JSON.stringify(data)}:{})});
    const result = await response.json();
    if (!response.ok) throw new Error(result.description || result.message || 'Unable to update your bag. Please try again.');
    return result;
  }
  function dialog(selector, open, trigger) {
    const el = q(selector); if (!el) return;
    if (open) lastFocus = trigger || document.activeElement;
    el.classList.toggle('is-open', open); el.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('cart-sidebar-open', open && selector === '#cart-sidebar-drawer');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { el.setAttribute('aria-modal','true'); (q('button,a,input',el)||el).focus(); }
    else { el.removeAttribute('aria-modal'); lastFocus?.focus(); }
  }
  async function refreshCart(open = false) {
    const cart = await request('cart.js');
    qa('.bag-count,#mobile-dock-badge').forEach(el => el.textContent = cart.item_count);
    const response = await fetch(url('?sections=cart-drawer'));
    const sections = await response.json();
    if (!sections['cart-drawer']) throw new Error('Bag updated. Open your cart to review it.');
    const doc = new DOMParser().parseFromString(sections['cart-drawer'],'text/html');
    const replacement = q('#cart-sidebar-drawer',doc), current = q('#cart-sidebar-drawer');
    if (replacement && current) { const wasOpen = current.classList.contains('is-open'); current.replaceWith(replacement); if (wasOpen || open) dialog('#cart-sidebar-drawer',true); }
    return cart;
  }
  async function add(items, buy = false, button) {
    if (pending) return; pending = true;
    if (button) button.disabled = true;
    try {
      await request('cart/add.js', {items});
      if (buy) { location.assign(url('checkout')); return; }
      await refreshCart(true);
    } catch(error) { notify(error.message); }
    finally { pending = false; if (button) button.disabled = false; updateVariant(); }
  }
  function productData() { const el = q('[data-product-json]'); return el ? JSON.parse(el.textContent) : null; }
  function money(cents) {
    return new Intl.NumberFormat(document.documentElement.lang, {style:'currency',currency:window.Shopify?.currency?.active || 'GBP'}).format(cents/100);
  }
  function updateVariant() {
    const product = productData(); if (!product) return;
    const selected = qa('[data-option-index]').map(group => q('[data-option-value].active',group)?.dataset.optionValue);
    const variant = product.variants.find(v => v.options.every((value,i) => value === selected[i])) || (selected.length ? null : product.variants[0]);
    const input = q('#pdp-variant-id'), button = q('#pdp-add-btn'), buy = q('#pdp-buy-btn');
    if (input) input.value = variant?.id || '';
    if (button) button.disabled = !variant?.available || pending;
    if (buy) buy.disabled = !variant?.available || pending;
    const stock = q('.pdp-stock-banner strong'); if (stock) stock.textContent = variant?.available ? 'In Stock' : 'Sold out';
    if (!variant) return;
    if(q('#pdp-price')) q('#pdp-price').textContent=money(variant.price);
    const compare=q('#pdp-compare-price'),save=q('#pdp-save-pill');
    if(compare){ compare.textContent=variant.compare_at_price>variant.price?money(variant.compare_at_price):'';compare.hidden=!(variant.compare_at_price>variant.price); }
    if(save){save.textContent=variant.compare_at_price>variant.price?`SAVE ${Math.round((1-variant.price/variant.compare_at_price)*100)}%`:'';save.hidden=!(variant.compare_at_price>variant.price);}
    if(q('#pdp-installment-amount'))q('#pdp-installment-amount').textContent=money(variant.price/4);
    const current = new URL(location.href); current.searchParams.set('variant',variant.id); history.replaceState({},'',current);
    if (variant.featured_image && q('#pdp-main-img')) {q('#pdp-main-img').src = variant.featured_image.src; q('#pdp-main-img').removeAttribute('srcset');}
  }
  function filterDesigns() {
    const selected = Object.fromEntries(['shape','length','colour'].map(key=>[key,q(`.sbd-chip.active[data-filter-type="${key}"]`)?.dataset.filterValue]));
    let count=0;
    qa('#design-grid .design-card').forEach(card=>{card.hidden=Object.entries(selected).some(([key,value])=>value && value!=='all' && card.dataset[key]!==value);if(!card.hidden)count++;});
    qa('#design-count,#results-count,#result-count,#sbd-count').forEach(el=>el.textContent=count);
    if(q('#sbd-total'))q('#sbd-total').textContent=qa('#design-grid .design-card').length;
  }
  document.addEventListener('submit', event => {
    if (event.target.id !== 'pdp-form') return;
    event.preventDefault(); const form = new FormData(event.target), id = form.get('id');
    if(id) add([{id, quantity:Math.max(1,Number(form.get('quantity'))||1)}],false,q('#pdp-add-btn'));
  });
  document.addEventListener('change',event=>{if(event.target.matches('[data-auto-submit]'))event.target.form.requestSubmit();});
  function showTestimonial(carousel, index) {
    if (!carousel) return;
    const jsonEl = q('.testimonials-json', carousel);
    let items = [];
    if (jsonEl) {
      try { items = JSON.parse(jsonEl.textContent); } catch (e) {}
    }
    const total = items.length || Number(carousel.dataset.totalReviews || 3);
    const safeIndex = (index % total + total) % total;
    carousel.dataset.activeReview = safeIndex;

    let text = '', author = '', stars = '';
    if (items.length && items[safeIndex]) {
      text = items[safeIndex].text || '';
      author = items[safeIndex].author || '';
      stars = items[safeIndex].stars || '★★★★★';
    } else {
      text = carousel.dataset[`review${safeIndex}Text`] || '';
      author = carousel.dataset[`review${safeIndex}Author`] || '';
    }

    const textEl = q('.review-text', carousel);
    const authorEl = q('cite', carousel);
    const starsEl = q('.stars', carousel);
    if (textEl && text) textEl.textContent = text;
    if (authorEl && author) authorEl.textContent = author;
    if (starsEl && stars) starsEl.textContent = stars;

    qa('[data-review]', carousel).forEach(el => {
      const isCurrent = Number(el.dataset.review) === safeIndex;
      el.setAttribute('aria-current', String(isCurrent));
      el.classList.toggle('active', isCurrent);
    });
  }
  document.addEventListener('click', async event => {
    const target = event.target.closest('button,a'); if (!target) return;
    if (target.matches('.nav-bag,.app-tab-bag,[href="#bag"]')) {
      event.preventDefault();
      dialog('#cart-sidebar-drawer', true, target);
      refreshCart(true);
      return;
    }
    if (target.matches('.cart-sidebar-close')) {dialog('#cart-sidebar-drawer',false);return;}
    if (target.matches('[data-variant-id]')) {event.preventDefault();add([{id:target.dataset.variantId,quantity:1}],false,target);return;}
    if (target.id==='pdp-buy-btn') {event.preventDefault(); const form = q('#pdp-form');if(form?.reportValidity())add([{id:q('#pdp-variant-id').value,quantity:Number(q('#pdp-qty').value)||1}],true,target);return;}
    if (target.matches('[data-action]') && target.closest('#cart-sidebar-drawer')) {
      if(pending)return;pending=true;target.disabled=true;
      const card=target.closest('[data-key]'),quantity=Number(q('.cart-step-qty',card)?.textContent)||0;
      try {await request('cart/change.js',{id:target.dataset.key,quantity:target.dataset.action==='remove'?0:Math.max(0,quantity+(target.dataset.action==='increase'?1:-1))});await refreshCart(true);}catch(error){notify(error.message);}finally{pending=false;target.disabled=false;}return;
    }
    if (target.id==='cart-promo-apply-btn'||target.classList.contains('cart-promo-btn')) { const input=q('#cart-promo-input'); const code=input?.value.trim(); if(code)location.assign(url('discount/'+encodeURIComponent(code))+'?redirect='+encodeURIComponent(root+'cart'));return; }
    if (target.matches('[data-option-value]')) {
      const group=target.closest('[data-option-index]');qa('[data-option-value]',group).forEach(el=>{el.classList.toggle('active',el===target);el.setAttribute('aria-checked',String(el===target));});q('[data-selected-option]',group).textContent=target.dataset.optionValue;updateVariant();return;
    }
    if(target.id==='pdp-qty-minus'||target.id==='pdp-qty-plus'){const input=q('#pdp-qty');input.value=Math.max(1,Number(input.value)+(target.id.endsWith('plus')?1:-1));return;}
    if(target.matches('.pdp-thumb-btn')) {
      const img=q('#pdp-main-img'); if(img){img.src=target.dataset.imageUrl;img.removeAttribute('srcset');}
      qa('.pdp-thumb-btn').forEach(btn=>{btn.classList.toggle('active',btn===target);btn.setAttribute('aria-selected',String(btn===target));});return;
    }
    if(target.matches('.pdp-accordion-trigger')){const item=target.closest('.pdp-accordion-item');item.classList.toggle('is-open');target.setAttribute('aria-expanded',String(item.classList.contains('is-open')));return;}
    if(target.id==='open-size-guide'){dialog('#size-guide-modal',true,target);return;}
    if(target.id==='close-size-guide'){dialog('#size-guide-modal',false);return;}
    if(target.id==='pdp-write-review-btn'){dialog('#review-modal',true,target);return;}     if(target.id==='close-review-form'){dialog('#review-modal',false);return;}
    const closeReviewBtn=target.closest('#close-review-form, #review-modal .pdp-modal-close');
    if(closeReviewBtn){dialog('#review-modal',false);return;}
    const starBtn=target.closest('.pdp-star-btn');
    if(starBtn){
      const rating=starBtn.dataset.rating||'5';
      const input=document.getElementById('pdp-rating-input');
      if(input) input.value=rating;
      const select=starBtn.closest('#pdp-star-rating-select');
      if(select){
        select.querySelectorAll('.pdp-star-btn').forEach(btn=>{
          const r=parseInt(btn.dataset.rating||'0',10);
          const isActive=r<=parseInt(rating,10);
          btn.style.setProperty('color', isActive?'#fa4087':'#ffd2e2', 'important');
          btn.setAttribute('aria-checked',String(isActive));
        });
      }
      return;
    }
    if(target.id==='close-review-form'){dialog('#review-modal',false);return;}
    if(target.matches('.review-prev,.review-next,[data-review]')){
      const carousel=target.closest('.testimonial');if(!carousel)return;
      const current=Number(carousel.dataset.activeReview||0);
      const nextIndex=target.hasAttribute('data-review')?Number(target.dataset.review):current+(target.matches('.review-next')?1:-1);
      showTestimonial(carousel,nextIndex);return;
    }
    const menuTrigger = target.closest('.app-menu-btn,.app-menu-toggle,.mobile-app-menu-btn,[data-drawer-trigger],.app-tab-menu,#mobile-dock-menu-btn');
    if(menuTrigger){dialog('#mobile-app-drawer',true,menuTrigger);return;}
    if(target.closest('.app-drawer-close')){dialog('#mobile-app-drawer',false);return;}
    if(target.matches('.product-wrap .arrow')){const list=q('#products');if(!list?.children.length)return;if(list.scrollWidth>list.clientWidth)list.scrollBy({left:(target.classList.contains('next')?1:-1)*list.clientWidth/2,behavior:'smooth'});else if(target.classList.contains('next'))list.append(list.firstElementChild);else list.prepend(list.lastElementChild);return;}
    if(target.matches('.shape-chip,.length-chip,.colour-swatch')){const selector=target.matches('.shape-chip')?'.shape-chip':target.matches('.length-chip')?'.length-chip':'.colour-swatch';qa(selector).forEach(el=>{el.classList.toggle('active',el===target);el.setAttribute('aria-checked',String(el===target));});filterDesigns();return;}
    if(target.matches('.sbd-chip[data-filter-type]')){qa(`.sbd-chip[data-filter-type="${target.dataset.filterType}"]`).forEach(el=>el.classList.toggle('active',el===target));filterDesigns();return;}
    if(target.id==='sbd-reset-btn'){qa('.sbd-chip').forEach(el=>el.classList.toggle('active',el.dataset.filterValue==='all'));filterDesigns();return;}
    if(target.matches('.shop-chip[data-filter]')){const filter=target.dataset.filter;const next=new URL(location.href);next.searchParams.delete('page');if(filter==='all')next.searchParams.delete('filter.p.tag');else next.searchParams.set('filter.p.tag',filter);location.assign(next);}
  });
  document.addEventListener('click',event=>{if(event.target.matches('.cart-sidebar-overlay'))dialog('#cart-sidebar-drawer',false);if(event.target.matches('.app-drawer-overlay'))dialog('#mobile-app-drawer',false);if(event.target.matches('#size-guide-modal')||event.target.closest('#close-size-guide'))dialog('#size-guide-modal',false);if(event.target.matches('#review-modal')||event.target.closest('#close-review-form'))dialog('#review-modal',false);});
  document.addEventListener('keydown',event=>{
    if(event.key==='Enter'&&event.target.id==='cart-promo-input'){event.preventDefault();const code=event.target.value.trim();if(code)location.assign(url('discount/'+encodeURIComponent(code))+'?redirect='+encodeURIComponent(root+'cart'));return;}
    const modal=q('.is-open[aria-modal="true"][id]');if(!modal)return;
    if(event.key==='Escape'){dialog('#'+modal.id,false);return;}
    if(event.key==='Tab'){const focusable=qa('a,button,input,select,[tabindex="0"]',modal).filter(el=>!el.disabled&&el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
  });
  async function init(scope=document) {
    qa('.pdp-option-group', scope).forEach(group => {
      const header = q('.pdp-option-header', group);
      const text = ((header ? header.textContent : '') + ' ' + (group.dataset.optionName || '')).trim();
      if (/default\s*title/i.test(text)) {
        group.remove();
      }
    });
    if(!new URL(location.href).searchParams.has('variant')){
      const data=productData(), preferred=data?.variants.find(v=>v.options.join('|')==='Almond|Medium|M');
      if(preferred)qa('[data-option-index]').forEach((group,i)=>{qa('[data-option-value]',group).forEach(el=>{const active=el.dataset.optionValue===preferred.options[i];el.classList.toggle('active',active);el.setAttribute('aria-checked',String(active));});const label=q('[data-selected-option]',group);if(label)label.textContent=preferred.options[i];});
    }
    const params=new URL(location.href).searchParams;
    for(const type of ['shape','length','colour'])if(params.has(type))qa(`.sbd-chip[data-filter-type="${type}"]`).forEach(el=>el.classList.toggle('active',el.dataset.filterValue===params.get(type)));
    updateVariant();filterDesigns();
    const recommendations=q('[data-recommendations-url]',scope);
    if(recommendations&&!recommendations.dataset.loaded){recommendations.dataset.loaded='true';try{const response=await fetch(recommendations.dataset.recommendationsUrl);if(!response.ok)return;const doc=new DOMParser().parseFromString(await response.text(),'text/html');const grid=q('#pdp-related-grid',doc);if(grid)recommendations.innerHTML=grid.innerHTML;}catch(error){console.warn('Recommendations unavailable',error);}}
  }
  window.refreshShopifyCart = refreshCart;
  document.addEventListener('shopify:section:load',event=>init(event.target));
  document.addEventListener('shopify:block:select', event => {
    const blockEl = event.target;
    // 1. Mega Menu blocks in Theme Editor
    if (blockEl.matches('[data-mega-menu-target], .shop-all-menu, .kids-menu, .shop-by-design-menu') || blockEl.closest('.shop-all-menu, .kids-menu, .shop-by-design-menu')) {
      const menu = blockEl.matches('.shop-all-menu, .kids-menu, .shop-by-design-menu') ? blockEl : blockEl.closest('.shop-all-menu, .kids-menu, .shop-by-design-menu') || q('#' + blockEl.dataset.megaMenuTarget);
      if (menu) {
        qa('.shop-all-menu, .kids-menu, .shop-by-design-menu').forEach(m => { if (m !== menu) m.hidden = true; });
        menu.hidden = false;
      }
      return;
    }
    // 2. Testimonial blocks in Theme Editor
    const carousel = blockEl.closest('.why')?.querySelector('.testimonial');
    if (!carousel) return;
    const jsonEl = q('.testimonials-json', carousel);
    if (!jsonEl) return;
    try {
      const items = JSON.parse(jsonEl.textContent);
      const index = items.findIndex(item => String(item.id) === String(event.detail.blockId));
      if (index !== -1) showTestimonial(carousel, index);
    } catch (e) {}
  });
  document.addEventListener('shopify:block:deselect', event => {
    const blockEl = event.target;
    if (blockEl.matches('[data-mega-menu-target], .shop-all-menu, .kids-menu, .shop-by-design-menu') || blockEl.closest('.shop-all-menu, .kids-menu, .shop-by-design-menu')) {
      const menu = blockEl.matches('.shop-all-menu, .kids-menu, .shop-by-design-menu') ? blockEl : blockEl.closest('.shop-all-menu, .kids-menu, .shop-by-design-menu') || q('#' + blockEl.dataset.megaMenuTarget);
      if (menu) menu.hidden = true;
    }
  });
  init();
})();
