const fs=require('node:fs'),vm=require('node:vm');
const read=f=>fs.readFileSync(f,'utf8');
function literal(file,name){const s=read(file),m=new RegExp('const '+name+'\\s*=\\s*').exec(s);if(!m)throw Error(name);const start=m.index+m[0].length;let level=0,quote=null,escape=false;for(let i=start;i<s.length;i++){const c=s[i];if(quote){if(escape)escape=false;else if(c==='\\')escape=true;else if(c===quote)quote=null;continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if(c==='['||c==='{')level++;if(c===']'||c==='}')level--;if(level===0)return vm.runInNewContext('('+s.slice(start,i+1)+')');}throw Error('unterminated');}
const handle=s=>s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const records=new Map();
function add(p,source){const h=handle(p.slug||p.name);if(!records.has(h))records.set(h,{...p,handle:h,source});else{const prev=records.get(h);prev.tags=[...new Set([...(prev.tags||[]),...(p.tags||[])])];}}
literal('script.js','products').forEach(([name,price,badge,rating],i)=>add({name,price,badge,rating,image:`assets/product-${i}.png`,category:'all',tags:['homepage','best-sellers']},'homepage'));
literal('category.js','allProducts').forEach(p=>add(p,'category'));
literal('shop-all.js','shopProducts').forEach(p=>add(p,'shop-all'));
literal('shop-by-design.js','DESIGN_PRODUCTS').forEach(p=>add({...p,tags:['design',...(p.tags||[])]},'design'));
literal('product.js','PRODUCT_DATABASE').forEach(p=>add({...p,image:p.images[0],tags:['design']},'product'));
// Original Kids landing-page cards are distinct from the category-page range.
const kids=read('kids.html');for(const match of kids.matchAll(/<article class="kids-product" data-tags="([^"]+)"[\s\S]*?<img src="([^"]+)"[\s\S]*?<h3><a[^>]*>([^<]+)<\/a><\/h3><p>£([\d.]+)/g)){add({name:match[3],price:match[4],image:match[2],category:'kids',tags:match[1].split(' ').concat('kids-landing')},'kids');}
const assetRoot='https://gt7tbv-26.myshopify.com/cdn/shop/t/2/assets/';
const assetName=s=>s.replace('assets/kids/','kids-').replace(/^assets\/(?:design\/)?/,'');
const columns=['Handle','Title','Body (HTML)','Vendor','Type','Tags','Published','Option1 Name','Option1 Value','Variant SKU','Variant Inventory Tracker','Variant Inventory Qty','Variant Inventory Policy','Variant Fulfillment Service','Variant Price','Variant Compare At Price','Variant Requires Shipping','Variant Taxable','Image Src','Image Position','Image Alt Text','Status','Option2 Name','Option2 Value','Option3 Name','Option3 Value'];
const rows=[];for(const p of records.values()){
 const category=p.category||'all';const tags=[...new Set([category,...(p.tags||[]),p.badge?'badge:'+p.badge:'',p.shape?'shape:'+p.shape:'',p.length?'length:'+p.length:'',p.colour?'colour:'+p.colour:''].filter(Boolean))];
 const variants=category==='accessories'||category==='bundles'?[['Default Title','','']]:['Almond','Square','Oval','Coffin','Ballerina'].flatMap(shape=>['Short','Medium','Long'].flatMap(length=>['XS','S','M','L','Custom'].map(size=>[shape,length,size])));
 variants.forEach(([shape,length,size],index)=>rows.push([p.handle,index?'':p.name,index?'':p.desc||'',index?'':'Press By Heart',index?'':category,index?'':tags.join(', '),index?'':'TRUE',length?'Shape':'Title',shape,'PBH-'+p.handle.toUpperCase()+(length?'-'+[shape,length,size].join('-').toUpperCase():''),'shopify','0','deny','manual',String(p.price).replace(/[^\d.]/g,''),p.comparePrice?String(p.comparePrice).replace(/[^\d.]/g,''):'','TRUE','TRUE',!index&&p.image?assetRoot+assetName(p.image):'',!index?'1':'',!index?p.name:'',!index?'active':'',length?'Length':'',length,size?'Size':'',size]));
}
columns.push('Collection');
for(const row of rows){const p=records.get(row[0]);row.push(row[1]?(p.source==='homepage'?'Homepage':p.source==='design'?'Designs':({all:'Nails',kids:'Kids',pedis:'Pedis',bundles:'Bundles',accessories:'Accessories'}[p.category]||'Nails')):'');}
const csv=arr=>arr.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n');
fs.mkdirSync('catalog-import',{recursive:true});fs.writeFileSync('catalog-import/approved-products.csv','\ufeff'+csv([columns,...rows]));fs.writeFileSync('catalog-import/catalog.json',JSON.stringify([...records.values()],null,2));
console.log(JSON.stringify({products:records.size,bySource:[...records.values()].reduce((a,p)=>(a[p.source]=(a[p.source]||0)+1,a),{}),file:'catalog-import/approved-products.csv'},null,2));
