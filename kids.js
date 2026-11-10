const kidsIcons={
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
};
document.querySelectorAll('[data-kids-icon]').forEach(el=>{const name=el.dataset.kidsIcon;el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${kidsIcons[name]||paths[name]||''}</svg>`});
document.querySelectorAll('.announcement a[href="#social"]').forEach(a=>{a.href='index.html#social'});
function setKidsMenu(open){const m=document.querySelector('#kids-menu');if(m)m.hidden=!open;const b=document.querySelector('.kids-menu-backdrop');if(b)b.classList.toggle('is-visible',open)}
document.querySelectorAll('[data-filter]').forEach(link=>link.addEventListener('click',()=>{
 const filter=link.dataset.filter;let count=0;
 document.querySelectorAll('.kids-product').forEach(card=>{card.hidden=filter!=='all'&&!card.dataset.tags.split(' ').includes(filter);if(!card.hidden)count++});
 document.querySelector('#kids-filter-status').textContent=`Showing ${count} kids nail sets`;
 setKidsMenu(false);
}));
const initialFilter=new URLSearchParams(window.location.search).get('filter');
if(initialFilter){
 let count=0;
 document.querySelectorAll('.kids-product').forEach(card=>{card.hidden=initialFilter!=='all'&&!card.dataset.tags.split(' ').includes(initialFilter);if(!card.hidden)count++});
 const status=document.querySelector('#kids-filter-status');
 if(status)status.textContent=`Showing ${count} kids nail sets`;
}
let kidsToastTimer;
function kidsNotify(message){const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(kidsToastTimer);kidsToastTimer=setTimeout(()=>toast.classList.remove('visible'),3000)}
document.querySelectorAll('.kids-add').forEach(button=>button.addEventListener('click',()=>{try{const bag=JSON.parse(localStorage.getItem('pressByHeartBag')||'[]');bag.push(button.dataset.name);localStorage.setItem('pressByHeartBag',JSON.stringify(bag));kidsNotify(`${button.dataset.name} added to your bag ♡`)}catch{kidsNotify('Your browser could not save the bag. Please try again.')}}));
document.querySelector('form').addEventListener('submit',event=>{event.preventDefault();kidsNotify('Newsletter signup requires a connected email service.')});
