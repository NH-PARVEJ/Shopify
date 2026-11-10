(() => {
  function restoreReviewResult(){
    const modal=document.getElementById('review-modal');
    if(!modal)return;
    // Keep the overlay outside transformed product containers and their stacking contexts.
    if(modal.parentElement!==document.body)document.body.append(modal);
    if(modal.querySelector('[data-review-result]')){
      modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');modal.setAttribute('aria-modal','true');document.body.style.overflow='hidden';modal.querySelector('button')?.focus();
    }
  }
  if(!window.pbhReviewPopup){
    window.pbhReviewPopup=true;
    document.addEventListener('shopify:section:load',restoreReviewResult);
    document.addEventListener('shopify:section:unload',event=>{if(event.target.querySelector('[data-product-json]')){document.getElementById('review-modal')?.remove();document.body.style.overflow='';}});
  }
  restoreReviewResult();
})();
