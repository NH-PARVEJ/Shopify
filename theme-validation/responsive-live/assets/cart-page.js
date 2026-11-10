(() => {
  if(window.pbhCartPage)return;
  window.pbhCartPage=true;
  document.addEventListener('click',event=>{
    const step=event.target.closest('#pbh-cart-page [data-cart-step]');
    if(!step)return;
    const input=step.parentElement.querySelector('input');
    const min=Number(input.min)||0,max=input.max?Number(input.max):Infinity;
    input.value=Math.min(max,Math.max(min,(Number(input.value)||0)+Number(step.dataset.cartStep)));
    input.dispatchEvent(new Event('change',{bubbles:true}));
  });
  document.addEventListener('change',event=>{
    if(!event.target.matches('#cart-page-form input[name="updates[]"]'))return;
    const notice=document.querySelector('.pbh-cart-update-notice');
    if(notice)notice.textContent='Select “Update bag” to apply your changes.';
  });
})();
