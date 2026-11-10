const collections=[['The Classics',"Timeless styles you’ll<br>never get tired of."],['The Pinks','From soft blush to<br>bold Barbie pink.'],['The French','Elegant, clean &amp;<br>always in style.'],['Kawaii','Playful, cute &amp; full<br>of good vibes.'],['Never Basic','Bold designs for<br>those who love to<br>stand out.'],['Festivities','Celebrate every<br>season &amp; special<br>moment.']];
document.querySelector('#collection-grid').innerHTML=collections.map(([name,description],i)=>`<article class="collection"><img src="assets/collection-${i}.png" alt="${name} press-on nail designs"><h2>${name}</h2><p>${description}</p><a class="outline" href="#best-sellers" aria-label="Shop ${name} collection"><span class="collection-button-label">SHOP COLLECTION</span><svg class="collection-button-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4"/></svg></a></article>`).join('');
const products=[
  ['CLASSIC NUDE','12.99','BEST SELLER','5.0','1'],
  ['PINK BADDIE','13.99','TRENDING','5.0','2'],
  ['FRENCH COLLECTION','12.99','CLASSIC','4.9','0'],
  ['GLITTER GLOSS','13.99','SPARKLE','5.0','3'],
  ['LOVE STRUCK','13.99','POPULAR','5.0','4']
];
document.querySelector('#products').innerHTML=products.map(([name,price,badge,rating,id],i)=>`<article class="product"><div class="product-media"><span class="product-badge">${badge}</span><a href="product.html?id=${id}"><img src="assets/product-${i}.png" alt="${name} press-on nails" loading="lazy"></a></div><div class="product-body"><div class="product-rating" aria-label="5 out of 5 stars">★★★★★ <span>${rating}</span></div><h3><a href="product.html?id=${id}">${name}</a></h3><p class="price">£${price}</p><button class="add" data-name="${name}">ADD TO BAG <svg class="bag-svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 14H4Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg></button></div></article>`).join('');
const features=[['NEW ARRIVALS','Shop the latest drop'],['KIDS COLLECTION','Fun &amp; cute designs<br>for little queens'],['BUNDLES &amp; SAVE','More nails, more<br>savings'],['ACCESSORIES','Everything you<br>need for the<br>perfect set']];
document.querySelector('#features').innerHTML=features.map(([name,description],i)=>`<article class="feature"><img src="assets/feature-${i}.png" alt="${name}"><div class="feature-content"><h2>${name}</h2><p>${description}</p><a href="${i===1?'kids.html':'#best-sellers'}">SHOP NOW <span>→</span></a></div></article>`).join('');
// Demo feed uses the supplied design images. These link to the profile, not invented posts.
const instagramDemoCaptions=['Everyday nude nail inspiration','Pretty in pink press-on nails','Unbox your instant beauty','Your next pink manicure','Glossy French nail designs','A little pink delivery'];
document.querySelector('#social-grid').innerHTML=instagramDemoCaptions.map((caption,i)=>`<a class="instagram-card" role="listitem" href="https://www.instagram.com/pressbyheart/" target="_blank" rel="noopener noreferrer" aria-label="${caption} — view @pressbyheart on Instagram"><img src="assets/social-${i}.png" alt="${caption}" loading="lazy"><span class="instagram-overlay" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7"/></svg><span>View on Instagram</span></span></a>`).join('');
let toastTimer;function notify(message){const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3000)}
document.querySelectorAll('.add').forEach(button=>button.addEventListener('click',()=>{let bag;try{bag=JSON.parse(localStorage.getItem('pressByHeartBag')||'[]');bag.push(button.dataset.name);localStorage.setItem('pressByHeartBag',JSON.stringify(bag));notify(`${button.dataset.name} added to your bag ♡`)}catch{notify('Your browser could not save the bag. Please try again.')}}));
document.querySelectorAll('.arrow').forEach(button=>button.addEventListener('click',()=>{const list=document.querySelector('#products');if(list.scrollWidth>list.clientWidth){list.scrollBy({left:(button.classList.contains('next')?1:-1)*list.clientWidth/2,behavior:'smooth'})}else if(button.classList.contains('next')){list.append(list.firstElementChild)}else{list.prepend(list.lastElementChild)}}));
document.querySelector('form').addEventListener('submit',event=>{event.preventDefault();notify('Newsletter signup requires a connected email service.');});

// The first review is from the supplied design; additional slides are marked as demos.
const reviewSlides=[
 {text:'“The quality is unreal! They last for weeks and I get so many compliments.”',author:'- Sarah J.'},
 {text:'“So easy to apply, with a beautiful salon-style finish at home.”',author:'- Demo review'},
 {text:'“Love the glossy designs and being able to switch up my nails.”',author:'- Demo review'}
];
const reviewCarousel=document.querySelector('.testimonial');
reviewCarousel.setAttribute('role','region');
reviewCarousel.setAttribute('aria-roledescription','carousel');
reviewCarousel.setAttribute('aria-label','Customer reviews');
reviewCarousel.tabIndex=0;
const reviewChevron='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5"/></svg>';
reviewCarousel.innerHTML=`<div class="stars" aria-label="5 out of 5 stars">★★★★★</div><div class="quote-line"><button type="button" class="review-prev" aria-label="Previous review">${reviewChevron}</button><blockquote aria-live="polite" aria-atomic="true"><span class="review-text"></span><cite></cite></blockquote><button type="button" class="review-next" aria-label="Next review">${reviewChevron}</button></div><div class="review-dots" aria-label="Choose a review">${reviewSlides.map((_,i)=>`<button type="button" aria-label="Show review ${i+1} of ${reviewSlides.length}" data-review="${i}"></button>`).join('')}</div>`;
let activeReview=0;
function showReview(index,animate=true){
 activeReview=(index+reviewSlides.length)%reviewSlides.length;
 const slide=reviewSlides[activeReview];
 reviewCarousel.querySelector('.review-text').textContent=slide.text;
 reviewCarousel.querySelector('cite').textContent=slide.author;
 reviewCarousel.querySelectorAll('[data-review]').forEach((button,i)=>button.setAttribute('aria-current',String(i===activeReview)));
 if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)reviewCarousel.querySelector('blockquote').animate([{opacity:.3,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:200});
}
reviewCarousel.querySelector('.review-prev').addEventListener('click',()=>showReview(activeReview-1));
reviewCarousel.querySelector('.review-next').addEventListener('click',()=>showReview(activeReview+1));
reviewCarousel.querySelectorAll('[data-review]').forEach(button=>button.addEventListener('click',()=>showReview(Number(button.dataset.review))));
reviewCarousel.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();showReview(activeReview+(event.key==='ArrowRight'?1:-1));}});
let reviewTouchStart;
reviewCarousel.addEventListener('touchstart',event=>{reviewTouchStart={x:event.touches[0].clientX,y:event.touches[0].clientY}},{passive:true});
reviewCarousel.addEventListener('touchend',event=>{if(!reviewTouchStart)return;const dx=event.changedTouches[0].clientX-reviewTouchStart.x,dy=event.changedTouches[0].clientY-reviewTouchStart.y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))showReview(activeReview+(dx<0?1:-1));reviewTouchStart=null;},{passive:true});
showReview(0,false);
