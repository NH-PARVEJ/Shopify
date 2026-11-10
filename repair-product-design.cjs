const fs=require('node:fs');
const root='press-by-heart';
const read=p=>fs.readFileSync(p,'utf8');
// Reuse the approved shared card/service rules directly from their original stylesheet.
function collect(css){
 css=css.replace(/\/\*[\s\S]*?\*\//g,'');let result='',pos=0;
 while(pos<css.length){const open=css.indexOf('{',pos);if(open<0)break;let depth=1,end=open+1;for(;end<css.length&&depth;end++){if(css[end]==='{')depth++;else if(css[end]==='}')depth--;}
  const selector=css.slice(pos,open).trim(),body=css.slice(open+1,end-1);
  if(selector.startsWith('@media')){const inner=collect(body);if(inner)result+=selector+'{'+inner+'}\n';}
  else if(/\.design-(?:card|services)\b/.test(selector))result+=selector+'{'+body+'}\n';
  pos=end;
 }
 return result;
}
let restore=read(root+'/assets/product-restored.css');restore+='\n/* Approved shared product-card and service-icon styles. */\n'+collect(read('shop-by-design.css'));fs.writeFileSync(root+'/assets/product-restored.css',restore);
let header=read(root+'/sections/header.liquid');const match=header.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/),schema=JSON.parse(match[1]);
if(!schema.settings.some(x=>x.id==='use_custom_menu'))schema.settings.unshift({type:'checkbox',id:'use_custom_menu',label:'Replace approved navigation with a custom menu',default:false});
header=header.replace(match[1],JSON.stringify(schema,null,2));fs.writeFileSync(root+'/sections/header.liquid',header);
let layout=read(root+'/layout/theme.liquid');layout=layout.replace("{{ 'product.css' | asset_url | stylesheet_tag }}","{{ 'product.css' | asset_url | stylesheet_tag }}{{ 'product-restored.css' | asset_url | stylesheet_tag }}");fs.writeFileSync(root+'/layout/theme.liquid',layout);
console.log('Restored shared original styles and header navigation.');
