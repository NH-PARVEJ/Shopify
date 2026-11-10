const fs=require('node:fs'),vm=require('node:vm'),R='press-by-heart';const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
function extract(html,id){const start=html.indexOf('<div id="'+id+'"');if(start<0)throw Error(id);const tags=html.slice(start).matchAll(/<\/?div\b[^>]*>/g);let depth=0;for(const tag of tags){depth+=tag[0].startsWith('</')?-1:1;if(depth===0)return html.slice(start,start+tag.index+tag[0].length);}throw Error(id);}
function urls(s){return s.replace(/src="assets\/kids\/([^\"]+)"/g,(_,n)=>`src="{{ '${n}' | asset_url }}"`).replace(/src="assets\/(?:design\/|payments\/)?([^\"]+)"/g,(_,n)=>`src="{{ '${n}' | asset_url }}"`).replace(/href="category\.html\?category=([\w-]+)(?:&amp;filter=([\w-]+))?"/g,(_,c,f)=>`href="{{ routes.collections_url }}/${c==='all'?'all':c}${f?'/'+f:''}"`).replace(/href="shop-all\.html(?:\?filter=([\w-]+))?"/g,(_,f)=>`href="{{ routes.all_products_collection_url }}${f?'/'+f:''}"`).replace(/href="kids\.html"/g,'href="{{ routes.collections_url }}/kids"').replace(/href="shop-by-design\.html([^\"]*)"/g,(_,q)=>`href="{{ routes.root_url }}pages/shop-by-design${q}"`);}
let header=read(R+'/sections/header.liquid'),sm=header.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/),schema=JSON.parse(sm[1]);
schema.settings=schema.settings.filter(s=>!s.id?.startsWith('mega_menu_'));
for(const [id,prefix] of [['kids-menu','kids'],['shop-all-menu','shop'],['shop-by-design-menu','design']]){
 let markup=urls(extract(read('index.html'),id)),seq=0;const protectedTokens=[];
 markup=markup.replace(/\{[\{%][\s\S]*?[\}%]\}/g,x=>`@@LIQ${protectedTokens.push(x)-1}@@`);
 markup=markup.split(/(<[^>]+>)/g).map(token=>{
  if(token.startsWith('<'))return token;
  if(!/[A-Za-z]/.test(token)||token.includes('@@LIQ'))return token;
  const text=token.trim();if(!text)return token;const key='menu_'+prefix+'_'+(++seq);schema.settings.push({type:'text',id:key,label:text.replace(/&amp;/g,'&').slice(0,60),default:text.replace(/&amp;/g,'&')});return token.replace(text,`{{ section.settings.${key} | escape }}`);
 }).join('').replace(/@@LIQ(\d+)@@/g,(_,i)=>protectedTokens[Number(i)]);
 write(R+'/snippets/mega-menu-'+(prefix==='kids'?'kids':prefix==='shop'?'shop-all':'shop-by-design')+'.liquid',markup);
}
if(!schema.settings.some(x=>x.id==='use_custom_menu'))schema.settings.unshift({type:'checkbox',id:'use_custom_menu',label:'Use a custom Shopify navigation menu',default:false});
header=header.replace('if section.settings.menu != blank and','if section.settings.use_custom_menu and section.settings.menu != blank and');
header=header.replace(sm[0],'{% schema %}\n'+JSON.stringify(schema,null,2)+'\n{% endschema %}');write(R+'/sections/header.liquid',header);
// All collection tabs lead to actual collection pages, not inert JavaScript filters.
for(const name of fs.readdirSync(R+'/sections')){
 if(!name.endsWith('.liquid'))continue;const p=R+'/sections/'+name;let s=read(p).replace(/\{\{ routes.all_products_collection_url \}\}\?filter\.p\.tag=(kids|pedis|bundles|accessories)/g,'{{ routes.collections_url }}/$1');write(p,s);
}
// Give every approved category its own editable preset while retaining its original hero and chip markup.
const definitions=vm.runInNewContext('('+read('category.js').match(/const categoryDefinitions = ([\s\S]*?);\s*const allProducts/)[1]+')');
const cp=R+'/sections/main-collection.liquid',cs=read(cp),cSchema=JSON.parse(cs.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/)[1]);
for(const [handle,def]of Object.entries(definitions)){
 if(handle==='kids')continue;
 const settings={};for(const x of cSchema.settings){if(x.default==='Press By Heart ♡')settings[x.id]=def.script;if(x.default==='SHOP ALL')settings[x.id]=def.title.split('<br>')[0];if(x.default==='NAILS'&&x.label?.includes('Copy:'))settings[x.id]=def.title.split('<br>')[1]?.replace('&amp;','&')||def.name;if(x.default==='Salon quality press-on nails')settings[x.id]=def.description;if(x.default==='delivered to your door.')settings[x.id]='';}
 write(R+'/templates/collection.'+handle+'.json',JSON.stringify({sections:{main:{type:'main-collection',settings}},order:['main']},null,2));
}
// Native tag-based collection chips keep working across pagination and without client-side catalogs.
let coll=read(cp);coll=coll.replace(/<button class="shop-chip(?: active)?" type="button" role="tab" data-filter="([^\"]+)">([\s\S]*?)<\/button>/g,(_,tag,label)=>`<a class="shop-chip {% if current_tags contains '${tag}' %}active{% elsif current_tags == blank and '${tag}' == 'all' %}active{% endif %}" href="{{ collection.url }}${tag==='all'?'':'/'+tag}">${label}</a>`);write(cp,coll);
// Preserve approved home card order using merchant-editable product blocks.
let best=read(R+'/sections/best-sellers.liquid');best=best.replace(/\{% assign featured_collection[\s\S]*?\{% endfor %\}/,`{% if section.settings.collection != blank %}{% for product in section.settings.collection.products limit: section.settings.products_to_show %}{% render 'product-card', product: product %}{% endfor %}{% else %}{% for block in section.blocks %}{% assign selected_product = block.settings.product %}{% if selected_product != blank %}{% render 'product-card', product: selected_product %}{% endif %}{% endfor %}{% endif %}`);write(R+'/sections/best-sellers.liquid',best);
let index=JSON.parse(read(R+'/templates/index.json'));index.sections.best_sellers.blocks={};index.sections.best_sellers.block_order=[];for(const h of ['classic-nude','pink-baddie','french-collection','glitter-gloss','love-struck']){const id=h.replaceAll('-','_');index.sections.best_sellers.blocks[id]={type:'product_item',settings:{product:h}};index.sections.best_sellers.block_order.push(id);}write(R+'/templates/index.json',JSON.stringify(index,null,2));
// Product merchandising metadata falls back to imported merchant-editable tags.
let catalog=read(R+'/snippets/catalog-card.liquid');catalog=catalog.replace('{%- assign rating =',`{%- for tag in product.tags -%}{% assign tag_key = tag | split: ':' | first %}{% assign tag_value = tag | remove_first: tag_key | remove_first: ':' %}{% case tag_key %}{% when 'badge' %}{% assign badge = badge | default: tag_value %}{% when 'shape' %}{% assign card_shape = tag_value %}{% when 'length' %}{% assign card_length = tag_value %}{% when 'colour' %}{% assign card_colour = tag_value %}{% endcase %}{%- endfor -%}\n{%- assign rating =`);
catalog=catalog.replaceAll('product.metafields.custom.shape.value | handleize','product.metafields.custom.shape.value | default: card_shape | handleize').replaceAll('product.metafields.custom.length.value | handleize','product.metafields.custom.length.value | default: card_length | handleize').replaceAll('product.metafields.custom.colour.value | handleize','product.metafields.custom.colour.value | default: card_colour | handleize');
write(R+'/snippets/catalog-card.liquid',catalog);
// Correct Shopify section setting ID collisions left by the previous generated configuration.
for(const name of fs.readdirSync(R+'/sections')){if(!name.endsWith('.liquid'))continue;const p=R+'/sections/'+name,s=read(p),m=s.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/),obj=JSON.parse(m[1]),ids=new Set();obj.settings=(obj.settings||[]).filter(x=>!x.id||(!ids.has(x.id)&&ids.add(x.id)));write(p,s.replace(m[0],'{% schema %}\n'+JSON.stringify(obj,null,2)+'\n{% endschema %}'));}
console.log('Approved mega menus, collection templates, and product mapping repaired.');
