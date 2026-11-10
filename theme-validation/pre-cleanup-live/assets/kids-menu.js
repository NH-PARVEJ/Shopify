function pbhResolveAsset(imgPath) {
  if (!imgPath) return 'assets/product-0.png';
  if (imgPath.indexOf('//') !== -1 || imgPath.indexOf('http') === 0) return imgPath;
  var clean = imgPath.split('/').pop().split('?')[0];
  if (window.ShopifyTheme && typeof window.ShopifyTheme.assetUrl === 'function') {
    return window.ShopifyTheme.assetUrl(clean);
  }
  if (window.ShopifyTheme && window.ShopifyTheme.assetRoot) {
    return window.ShopifyTheme.assetRoot + clean;
  }
  return 'assets/' + clean;
}
window.pbhResolveAsset = pbhResolveAsset;

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

Object.assign(sharedMenuIcons, typeof paths === 'object' ? paths : {}, {
 nails:'<rect x="5" y="12" width="14" height="11" rx="2"/><path d="M8 12V4a4 4 0 0 1 8 0v8M8 8h8M8 16h8v4H8Z"/>',
 kids:'<circle cx="7" cy="13" r="6"/><circle cx="17" cy="13" r="6"/><path d="M1 12c4 0 5-3 6-5 2 3 3 4 6 5m-2 0c3 0 5-3 6-5 2 3 3 4 6 5M5 14h.1m3 0h.1m7 0h.1m3 0h.1M5 17q2 2 4 0m6 0q2 2 4 0M7 6C2 0 7-1 12 5c4-6 10-5 5 1"/>',
 gift:'<path d="M3 10h18v4H3Zm2 4v9h14v-9M10 10v13m4-13v13M12 10C-1 7 6-5 12 8c5-14 13-1 0 2Z"/>',
 feet:'<ellipse cx="8" cy="14" rx="3" ry="6" transform="rotate(-20 8 14)"/><ellipse cx="17" cy="16" rx="3" ry="6" transform="rotate(20 17 16)"/><circle cx="4" cy="5" r="1.5"/><circle cx="8" cy="3" r="1.5"/><circle cx="12" cy="4" r="1"/><circle cx="16" cy="7" r="1.5"/><circle cx="20" cy="8" r="1.5"/><circle cx="23" cy="11" r="1"/>',
 bagHeart:'<path d="M4 7h16l2 16H2ZM8 8V5a4 4 0 0 1 8 0v3"/><path d="M12 18c-7-4-4-8 0-5 4-3 7 1 0 5Z"/>',
 sparkles:'<path d="m9 1 2 7 6 2-6 2-2 8-2-8-6-2 6-2Zm11 12 1 3 3 1-3 1-1 4-1-4-3-1 3-1Zm0-12v5m-2-3h4"/>',
 flame:'<path d="M13 1c1 7-5 8-4 13-3-1-3-4-3-4C-3 20 9 28 18 21c7-6 2-13 0-15 0 7-3 6-3 6 3-5-1-10-2-11Z"/>',
 apply:'<path d="M9 14V3a2 2 0 0 1 4 0v12-5a2 2 0 0 1 4 0v6-4a2 2 0 0 1 4 0v7c0 3-2 5-5 5h-5c-2 0-3-1-4-3l-5-7c-1-2 1-4 3-2l4 4"/><path d="M6 8a6 6 0 1 1 10 0"/>',
 reuse:'<path d="M3 8a10 10 0 0 1 17-3l2 3m-1-5 1 5-5-1M21 16A10 10 0 0 1 4 20l-2-3m1 5-1-5 5 1"/>',
 truck:'<path d="M1 4h13v14H1Zm13 5h5l4 5v4h-9M18 9v5h5"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="19" r="3"/>',
 quality:'<path d="m5 5-3 6 3 12h14l3-12-3-6Zm2 0V3h10v2M8 5l-1 18M16 5l1 18M2 11h20M10 1v5m4-5v5"/>',
 headset:'<path d="M3 13v-2a9 9 0 0 1 18 0v2M6 10H4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3h2Zm12 0h2a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-2Zm3 10c0 3-3 3-7 3"/>'
});
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

  const signal = window.pbhMenuController.signal;
  const on = (target,event,handler) => target.addEventListener(event,handler,{signal});
  signal.addEventListener('abort',()=>clearTimeout(menuCloseTimer),{once:true});
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

  on(menuBackdrop, 'click', () => {
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

  on(window, 'resize', () => {
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

  on(toggle, 'mouseenter', () => {
    if (isDesktop()) setOpen(true);
  });
  on(toggle, 'mouseleave', () => {
    if (isDesktop()) scheduleClose();
  });
  on(menu, 'mouseenter', () => clearTimeout(menuCloseTimer));
  on(menu, 'mouseleave', () => {
    if (isDesktop()) scheduleClose();
  });

  on(toggle, 'click', event => {
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

  on(toggle, 'keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  });

  on(document, 'focusin', event => {
    if (!menu.contains(event.target) && event.target !== toggle) {
      if (!menu.hidden) setOpen(false);
    }
  });

  on(document, 'keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  on(document, 'click', event => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
      if (!menu.hidden) setOpen(false);
    }
  });

  on(matchMedia('(max-width:700px)'), 'change', () => setOpen(false));

  return { setOpen, scheduleClose };
}


function initApprovedMenus(){
 window.pbhMenuController?.abort();
 window.pbhMenuController=new AbortController();
 renderMenuIcons(document);
 initMegaMenu('#kids-menu','.kids-menu-toggle',()=>document.body.classList.contains('kids-page'));
 initMegaMenu('#shop-all-menu','.shop-all-menu-toggle',()=>document.body.classList.contains('shop-all-page'));
 initMegaMenu('#shop-by-design-menu','.shop-by-design-menu-toggle',()=>document.body.classList.contains('shop-by-design-page'));
}
initApprovedMenus();
document.addEventListener('shopify:section:load',initApprovedMenus);
