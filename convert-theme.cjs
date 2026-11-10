const fs = require('node:fs');
const path = require('node:path');
const root = 'press-by-heart';
const read = p => fs.readFileSync(p, 'utf8');
const write = (p, s) => fs.writeFileSync(p, s);
const section = (name, html, settings = []) => write(`${root}/sections/${name}.liquid`, html + '\n{% schema %}\n' + JSON.stringify({name:name.replaceAll('-',' ').slice(0,25),settings,presets:[{name:name.replaceAll('-',' ').slice(0,25)}]}, null, 2) + '\n{% endschema %}\n');
const main = name => read(name+'.html').match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
function liquidize(s) {
 return s.replace(/assets\/kids\/(hero-[\w-]+|product-\d|promo-product)\.png/g, (_,n)=>`assets/kids-${n}.png`)
 .replace(/(?:src)=\"assets\/(?:design\/|payments\/|kids\/)?([^\"]+)\"/g, (_,n)=>`src="{{ '${n}' | asset_url }}"`)
 .replace(/href="category\.html\?category=all"/g,'href="{{ routes.all_products_collection_url }}"')
 .replace(/href="category\.html\?category=([\w-]+)(?:&amp;filter=([\w-]+))?"/g, (_,c,f)=>`href="{{ routes.collections_url }}/${c}${f ? '?filter.p.tag='+f : ''}"`)
 .replace(/href="shop-all\.html(?:\?filter=([\w-]+))?"/g,(_,f)=>`href="{{ routes.all_products_collection_url }}${f?'?filter.p.tag='+f:''}"`)
 .replace(/href="kids\.html"/g,'href="{{ routes.collections_url }}/kids"')
 .replace(/href="shop-by-design\.html([^\"]*)"/g,(_,q)=>`href="{{ routes.root_url }}pages/shop-by-design${q}"`)
 .replace(/href="index\.html([^\"]*)"/g,(_,q)=>`href="{{ routes.root_url }}${q}"`);
}
// Keep every approved CSS declaration; only make asset paths relative to Shopify's flat asset folder.
for (const file of fs.readdirSync('.').filter(f=>f.endsWith('.css'))) {
 write(`${root}/assets/${file}`, read(file).replace(/assets\/(?:kids\/|design\/|payments\/)?([\w.-]+)/g, '$1'));
}
// Preserve original storefront page structures, including the dedicated Kids landing page.
let collection = liquidize(main('shop-all'));
collection = collection.replace('<strong id="product-count">12</strong>','<strong id="product-count">{{ collection.products_count }}</strong>');
collection = collection.replace('<section class="shop-grid" id="shop-all-grid" aria-label="Product list"></section>', `{% render 'collection-controls', results: collection %}{% paginate collection.products by section.settings.products_per_page %}<section class="shop-grid" id="shop-all-grid" aria-label="Product list">{% for product in collection.products %}{% render 'catalog-card', product: product, kind: 'shop' %}{% else %}<p>{{ section.settings.empty_text }}</p>{% endfor %}</section>{{ paginate | default_pagination }}{% endpaginate %}`);
section('main-collection',collection,[{type:'range',id:'products_per_page',label:'Products per page',min:8,max:48,step:4,default:24},{type:'text',id:'empty_text',label:'Empty collection',default:'No products found.'}]);
let kids = liquidize(main('kids'));
kids = kids.replace(/<div class="kids-products">[\s\S]*?<\/div><p class="sr-only" id="kids-filter-status"/, `{% paginate collection.products by 20 %}<div class="kids-products">{% for product in collection.products %}{% render 'catalog-card', product: product, kind: 'kids' %}{% endfor %}</div>{{ paginate | default_pagination }}{% endpaginate %}<p class="sr-only" id="kids-filter-status"`);
section('main-kids',kids);
write(`${root}/templates/collection.kids.json`, JSON.stringify({sections:{main:{type:'main-kids',settings:{}}},order:['main']},null,2));
let design = liquidize(main('shop-by-design'));
design = design.replace(/<section class="design-grid"[^>]*><\/section>/,`{% assign design_collection = section.settings.collection | default: collections.all %}{% paginate design_collection.products by 24 %}<section class="design-grid" id="design-grid" aria-label="Matching designs product catalog">{% for product in design_collection.products %}{% render 'catalog-card', product: product, kind: 'design' %}{% endfor %}</section>{{ paginate | default_pagination }}{% endpaginate %}`);
section('shop-by-design',design,[{type:'collection',id:'collection',label:'Design collection'}]);
// Use the approved PDP HTML, rather than the incompatible markup in the earlier conversion.
let pdp = liquidize(main('product'));
pdp = pdp.replace('French Rose Glaze</span>', '{{ product.title | escape }}</span>').replace('French Rose Glaze Press-On Nails</h1>','{{ product.title | escape }}</h1>');
pdp = pdp.replace(/<img id="pdp-main-img"[^>]*>/,`{% if product.featured_media.media_type == 'image' %}<img id="pdp-main-img" src="{{ product.featured_image | image_url: width: 1200 }}" alt="{{ product.featured_image.alt | escape }}" width="{{ product.featured_image.width }}" height="{{ product.featured_image.height }}">{% else %}{{ product.featured_media | media_tag: image_size: '1200x', controls: true }}{% endif %}`);
pdp = pdp.replace(/<div class="pdp-thumbnails"[\s\S]*?<\/div>/,`<div class="pdp-thumbnails" role="tablist" aria-label="Product thumbnails">{% for media in product.media %}<button class="pdp-thumb-btn {% if forloop.first %}active{% endif %}" type="button" role="tab" aria-selected="{{ forloop.first }}" aria-label="View {{ forloop.index }}" data-media-target="media-{{ media.id }}" data-image-url="{{ media.preview_image | image_url: width: 1200 }}"><img src="{{ media.preview_image | image_url: width: 160 }}" alt="{{ media.alt | escape }}" width="{{ media.preview_image.width }}" height="{{ media.preview_image.height }}"></button>{% endfor %}</div><div class="pdp-extra-media" hidden>{% for media in product.media %}{% unless media.media_type == 'image' %}<div id="media-{{ media.id }}">{{ media | media_tag: image_size: '1200x', controls: true }}</div>{% endunless %}{% endfor %}</div>`);
pdp = pdp.replace(/(<span class="pdp-current-price" id="pdp-price">)[\s\S]*?<\/span>/,'$1{{ product.selected_or_first_available_variant.price | money }}</span>');
pdp = pdp.replace(/(<span class="pdp-compare-price" id="pdp-compare-price">)[\s\S]*?<\/span>/,'$1{% if product.selected_or_first_available_variant.compare_at_price > product.selected_or_first_available_variant.price %}{{ product.selected_or_first_available_variant.compare_at_price | money }}{% endif %}</span>');
pdp = pdp.replace(/(<span class="pdp-discount-pill" id="pdp-save-pill">)[\s\S]*?<\/span>/,'$1{% assign variant = product.selected_or_first_available_variant %}{% if variant.compare_at_price > variant.price %}SAVE {{ variant.compare_at_price | minus: variant.price | times: 100 | divided_by: variant.compare_at_price }}%{% endif %}</span>');
pdp = pdp.replace(/(<p class="pdp-desc-text" id="pdp-desc">)[\s\S]*?<\/p>/,'$1{{ product.description }}</p>');
pdp = pdp.replace(/<!-- Shape Option -->[\s\S]*?<!-- Action buttons & Quantity/,`{% form 'product', product, id: 'pdp-form' %}<input type="hidden" name="id" id="pdp-variant-id" value="{{ product.selected_or_first_available_variant.id }}">{% for option in product.options_with_values %}{% assign option_key = option.name | downcase %}<div class="pdp-option-group" data-option-index="{{ forloop.index0 }}"><div class="pdp-option-header"><span>{{ option.name | escape }}: <strong data-selected-option>{{ option.selected_value | escape }}</strong></span>{% if option_key contains 'size' %}<button class="pdp-size-guide-btn" id="open-size-guide" type="button">📏 Size Guide</button>{% endif %}</div><div class="pdp-option-chips" role="radiogroup" aria-label="{{ option.name | escape }}">{% for value in option.values %}<button class="{% if option_key contains 'shape' %}pdp-shape-chip{% elsif option_key contains 'length' %}pdp-length-chip{% else %}pdp-size-chip{% endif %} {% if option.selected_value == value %}active{% endif %}" type="button" data-option-value="{{ value | escape }}" role="radio" aria-checked="{% if option.selected_value == value %}true{% else %}false{% endif %}">{% if option_key contains 'shape' %}{% assign icon = value | handleize | prepend: 'shape-' | append: '.png' %}<img src="{{ icon | asset_url }}" alt="">{% endif %}{{ value | escape }}</button>{% endfor %}</div></div>{% endfor %}<!-- Quantity`);
// The source comment is "Quantity & Purchase Actions"; keep purchase wrappers unchanged.
if (!pdp.includes("{% form 'product'")) throw Error('PDP options replacement failed');
pdp = pdp.replace('id="pdp-qty" type="text"','id="pdp-qty" name="quantity" type="number" min="1"').replace(' readonly aria-label="Quantity"',' aria-label="Quantity"');
pdp = pdp.replace('id="pdp-add-btn" type="button"','id="pdp-add-btn" type="submit" {% unless product.available %}disabled{% endunless %}');
pdp = pdp.replace('<!-- Stock','{% endform %}<script type="application/json" data-product-json>{{ product | json }}</script>\n<!-- Stock');
if (!pdp.includes('{% endform %}')) { pdp = pdp.replace('<div class="pdp-stock-banner">','{% endform %}<script type="application/json" data-product-json>{{ product | json }}</script><div class="pdp-stock-banner">'); }
pdp = pdp.replace(/<span class="pdp-review-count"[^>]*>[\s\S]*?<\/span>/,`{% if product.metafields.reviews.rating_count.value > 0 %}<span class="pdp-review-count">{{ product.metafields.reviews.rating.value.rating }} ({{ product.metafields.reviews.rating_count }} Reviews)</span>{% endif %}`);
pdp = pdp.replace(/<section class="pdp-reviews-section"[\s\S]*?<\/section>/,`{% for block in section.blocks %}{% if block.type == '@app' %}{% render block %}{% endif %}{% endfor %}`);
pdp = pdp.replace('<div class="pdp-related-grid" id="pdp-related-grid"></div>',`<div class="pdp-related-grid" id="pdp-related-grid" data-recommendations-url="{{ routes.product_recommendations_url }}?section_id={{ section.id }}&product_id={{ product.id }}&limit=4">{% if recommendations.performed %}{% for product in recommendations.products %}{% render 'catalog-card', product: product, kind: 'design' %}{% endfor %}{% endif %}</div>`);
pdp += "\n{% render 'size-guide-modal' %}<script type=\"application/ld+json\">{{ product | structured_data }}</script>";
section('main-product',pdp);
let pf=`${root}/sections/main-product.liquid`; let ps=read(pf).replace('"settings": [],','"settings": [],\n  "blocks": [{"type":"@app"}],');write(pf,ps);
// Replace mock best-seller fallbacks with actual products only.
let best=read(`${root}/sections/best-sellers.liquid`);
best=best.replace(/\{%\- if section.settings.collection[\s\S]*?\{%\- endif \-%\}/,`{% assign featured_collection = section.settings.collection | default: collections.all %}{% for product in featured_collection.products limit: section.settings.products_to_show %}{% render 'product-card', product: product %}{% endfor %}`);
// Remove the entire old branching region through the outer endif.
best=best.replace(/\{%\- endfor \-%\}[\s\S]*?\{%\- endif \-%\}\s*<\/div>/,'</div>');
write(`${root}/sections/best-sellers.liquid`,best);
// Remove abandoned demo scripts from the runtime. Menu logic is retained verbatim with lifecycle cleanup.
let menu=read('kids-menu.js').split('function initMobileAppView()')[0];
menu=menu.replace('  renderMenuIcons(menu);','  if (toggle.dataset.pbhInitialized) return null;\n  toggle.dataset.pbhInitialized = "true";\n  renderMenuIcons(menu);');
menu=menu.replace('  const header = document.querySelector(\'header\');', `  const signal = window.pbhMenuController.signal;\n  const on = (target, event, fn) => target.addEventListener(event, fn, {signal});\n  const header = document.querySelector('header');`);
menu=menu.replace(/(menuBackdrop|window|toggle|menu|document)\.addEventListener\(/g,'on($1, ');
menu=menu.replace("matchMedia('(max-width:700px)').addEventListener('change', () => setOpen(false));","on(matchMedia('(max-width:700px)'), 'change', () => setOpen(false));");
menu += `\nfunction initMenus(){\n window.pbhMenuController?.abort(); window.pbhMenuController = new AbortController();\n document.querySelectorAll('[data-pbh-initialized]').forEach(el=>delete el.dataset.pbhInitialized);\n renderMenuIcons(document);\n initMegaMenu('#kids-menu','.kids-menu-toggle',()=>document.body.classList.contains('kids-page'));\n initMegaMenu('#shop-all-menu','.shop-all-menu-toggle',()=>document.body.classList.contains('shop-all-page'));\n initMegaMenu('#shop-by-design-menu','.shop-by-design-menu-toggle',()=>document.body.classList.contains('shop-by-design-page'));\n}\ninitMenus(); document.addEventListener('shopify:section:load',initMenus);\n`;
write(`${root}/assets/kids-menu.js`,menu);
// Global layout loads one delegated commerce controller on every page.
let layout=read(`${root}/layout/theme.liquid`);
layout=layout.replace(/  \{% if template.name == 'index' %\}[\s\S]*?  \{% endif %\}\s*<\/body>/,'  <script src="{{ \'commerce.js\' | asset_url }}" defer></script>\n</body>');
layout=layout.replace('<body class="','<body class="{% if template.name == \'product\' %}product-page{% elsif template.name == \'collection\' %}{% if template.suffix == \'kids\' %}kids-page{% else %}category-page shop-all-page{% endif %}{% elsif template.suffix == \'shop-by-design\' %}shop-by-design-page{% endif %} ');
layout=layout.replace(/id="MainContent" class="main-content"/,'id="MainContent" class="main-content"');
layout=layout.replace('  {{ content_for_header }}',"  {{ content_for_header }}\n  {% render 'theme-settings' %}");
layout=layout.replace(/content="http:\{\{ page_image \| image_url \}\}"/,'content="{{ page_image | image_url: width: 1200 }}"').replace(/content="https:\{\{ page_image \| image_url \}\}"/,'content="{{ page_image | image_url: width: 1200 }}"');
write(`${root}/layout/theme.liquid`,layout);
let header=read(`${root}/sections/header.liquid`).replace(/\s*style="width: \{\{ section.settings.logo_width[^\"]*"/g,'').replace('id="shopify-section-header"','id="site-header"');write(`${root}/sections/header.liquid`,header);
for (const folder of ['sections','snippets']) for(const file of fs.readdirSync(`${root}/${folder}`).filter(f=>f.endsWith('.liquid'))) {
 let p=`${root}/${folder}/${file}`,s=read(p);s=s.replace(/id="shopify-section-\{\{ section.id \}\}"/g,'data-section-id="{{ section.id }}"');write(p,s);
}
// Native cart page quantity update, without requiring JavaScript.
let cart=read(`${root}/sections/main-cart.liquid`).replace('<span>{{ cart.total_price | money }}</span>','<span>{{ cart.total_price | money }}</span>');
cart=cart.replace('<span style="font-size: 13px; font-weight: bold;', '<label>Quantity <input type="number" name="updates[]" value="{{ item.quantity }}" min="0" aria-label="Quantity for {{ item.product.title | escape }}"></label><span style="font-size: 13px; font-weight: bold;');
cart=cart.replace('<button type="submit" name="checkout"','<button type="submit" name="update" class="add">Update bag</button><button type="submit" name="checkout"');write(`${root}/sections/main-cart.liquid`,cart);
// Search must paginate and support non-product results as well.
let search=read(`${root}/sections/main-search.liquid`).replace('{%- for item in search.results -%}','{% paginate search.results by 24 %}{%- for item in search.results -%}').replace('{%- endif -%}\n        {%- endfor -%}',`{% else %}<article><h2><a href="{{ item.url }}">{{ item.title | escape }}</a></h2><p>{{ item.content | strip_html | truncatewords: 30 }}</p></article>{%- endif -%}\n        {%- endfor -%}{{ paginate | default_pagination }}{% endpaginate %}`);write(`${root}/sections/main-search.liquid`,search);
// Correct invalid font picker default; approved fonts remain in force until explicitly overridden.
let config=JSON.parse(read(`${root}/config/settings_schema.json`));
config.find(x=>x.name==='Typography').settings=[{type:'checkbox',id:'custom_typography',label:'Override approved typography',default:false},{type:'font_picker',id:'font_body',label:'Body font',default:'poppins_n4'},{type:'font_picker',id:'font_heading',label:'Heading font',default:'poppins_n4'}];
config.find(x=>x.name==='Colors').settings.unshift({type:'checkbox',id:'custom_colors',label:'Override approved colors',default:false});
write(`${root}/config/settings_schema.json`,JSON.stringify(config,null,2));
console.log('Original page structures restored; Shopify data paths installed.');

