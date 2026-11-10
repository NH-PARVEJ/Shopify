const fs=require('fs');const root='theme-validation/cart-page-fix';const file=root+'/sections/main-cart.liquid';const old=fs.readFileSync(file,'utf8');fs.writeFileSync(root+'/main-cart-before.liquid',old);const schema=JSON.parse(old.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);schema.settings.push({type:'text',id:'summary_heading',label:'Summary heading',default:'Order Summary'},{type:'text',id:'continue_label',label:'Continue shopping label',default:'Continue shopping'},{type:'text',id:'security_label',label:'Checkout reassurance',default:'Secure checkout powered by Shopify'},{type:'url',id:'continue_link',label:'Continue shopping destination'});
const body=`{{ 'cart-page.css' | asset_url | stylesheet_tag }}
<section id="pbh-cart-page" class="pbh-cart-page">
  <div class="pbh-cart-heading"><p>PRESS BY HEART</p><h1>{{ section.settings.copy_1 | escape }} <span>♡</span></h1><a href="{{ section.settings.continue_link | default: routes.all_products_collection_url }}">← {{ section.settings.continue_label | escape }}</a></div>
  {% if cart.empty? %}<div class="pbh-cart-empty"><span aria-hidden="true">♡</span><h2>{{ section.settings.copy_2 | escape }}</h2><p>{{ section.settings.copy_3 | escape }}</p><a class="pbh-cart-primary" href="{{ section.settings.continue_link | default: routes.all_products_collection_url }}">{{ section.settings.copy_4 | escape }}</a></div>
  {% else %}
  <form action="{{ routes.cart_url }}" method="post" id="cart-page-form" class="pbh-cart-layout">
    <div class="pbh-cart-items">
      {% for item in cart.items %}
      <article class="pbh-cart-item">
        <a class="pbh-cart-image" href="{{ item.url }}">{% if item.image %}{{ item.image | image_url: width: 320 | image_tag: loading: 'lazy', widths: '100,200,320', alt: item.product.title }}{% else %}{{ 'product-1' | placeholder_svg_tag }}{% endif %}</a>
        <div class="pbh-cart-info"><h2><a href="{{ item.url }}">{{ item.product.title | escape }}</a></h2>
          {% unless item.product.has_only_default_variant %}<div class="pbh-cart-options">{% for option in item.options_with_values %}<span>{{ option.name | escape }}: {{ option.value | escape }}</span>{% endfor %}</div>{% endunless %}
          {% if item.selling_plan_allocation %}<p class="pbh-cart-plan">{{ item.selling_plan_allocation.selling_plan.name | escape }}</p>{% endif %}
          {% for property in item.properties %}{% assign initial = property.first | slice: 0 %}{% if property.last != blank and initial != '_' %}<p class="pbh-cart-property">{{ property.first | escape }}: {% if property.last contains '/uploads/' %}<a href="{{ property.last }}">{{ property.last | split: '/' | last | escape }}</a>{% else %}{{ property.last | escape }}{% endif %}</p>{% endif %}{% endfor %}
          <p class="pbh-cart-unit">{% if item.original_price > item.final_price %}<s>{{ item.original_price | money }}</s> {% endif %}{{ item.final_price | money }}</p>
          <div class="pbh-cart-controls"><div><label for="CartQuantity-{{ item.index | plus: 1 }}">{{ section.settings.copy_5 | escape }}</label><div class="pbh-cart-quantity"><button type="button" data-cart-step="-1" aria-label="Decrease quantity for {{ item.product.title | escape }}">−</button><input id="CartQuantity-{{ item.index | plus: 1 }}" type="number" name="updates[]" value="{{ item.quantity }}" min="0" step="1" inputmode="numeric" aria-label="Quantity for {{ item.product.title | escape }}"{% if item.variant.inventory_management != blank and item.variant.inventory_policy == 'deny' %} max="{{ item.variant.inventory_quantity | at_least: item.quantity }}"{% endif %}><button type="button" data-cart-step="1" aria-label="Increase quantity for {{ item.product.title | escape }}">+</button></div></div><a class="pbh-cart-remove" href="{{ item.url_to_remove }}">{{ section.settings.copy_6 | escape }}</a></div>
          {% for discount in item.line_level_discount_allocations %}<p class="pbh-cart-discount">{{ discount.discount_application.title | escape }} (−{{ discount.amount | money }})</p>{% endfor %}
        </div>
        <div class="pbh-cart-line-total">{% if item.original_line_price > item.final_line_price %}<s>{{ item.original_line_price | money }}</s>{% endif %}<strong>{{ item.final_line_price | money }}</strong>{% if item.unit_price_measurement %}<small>{{ item.unit_price | money }} / {% if item.unit_price_measurement.reference_value != 1 %}{{ item.unit_price_measurement.reference_value }}{% endif %}{{ item.unit_price_measurement.reference_unit }}</small>{% endif %}</div>
      </article>
      {% endfor %}
      <div class="pbh-cart-update-row"><button type="submit" name="update" class="pbh-cart-secondary">{{ section.settings.copy_9 | escape }}</button><p class="pbh-cart-update-notice" role="status" aria-live="polite"></p></div>
    </div>
    <aside class="pbh-cart-summary"><h2>{{ section.settings.summary_heading | escape }}</h2><div class="pbh-cart-subtotal"><span>{{ section.settings.copy_7 | escape }}</span><strong>{{ cart.total_price | money }}</strong></div>{% for discount in cart.cart_level_discount_applications %}<div class="pbh-cart-discount"><span>{{ discount.title | escape }}</span><span>−{{ discount.total_allocated_amount | money }}</span></div>{% endfor %}<p class="pbh-cart-tax-note">{{ section.settings.copy_8 | escape }}</p><button type="submit" name="checkout" class="pbh-cart-primary">{{ section.settings.copy_10 | escape }} <span aria-hidden="true">♡</span></button><p class="pbh-cart-security"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>{{ section.settings.security_label | escape }}</p></aside>
  </form>{% endif %}
</section>
<script src="{{ 'cart-page.js' | asset_url }}" defer></script>
{% schema %}${JSON.stringify(schema,null,2)}{% endschema %}`;
fs.writeFileSync(file,body);fs.copyFileSync(file,'press-by-heart/sections/main-cart.liquid');
for(const p of [root+'/snippets/catalog-card.liquid','press-by-heart/snippets/catalog-card.liquid']){let s=fs.readFileSync(p,'utf8');s=s.replace(/\s*<p class="{{ prefix }}-desc">[\s\S]*?<\/p>/g,'');fs.writeFileSync(p,s);}
console.log('Cart redesigned with native Shopify updates, removal, discounts and checkout; card descriptions removed.');
