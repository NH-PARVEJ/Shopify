const fs=require('node:fs'),vm=require('node:vm'),R='press-by-heart';const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const p=R+'/sections/main-collection.liquid';let main=read(p),m=main.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/),schema=JSON.parse(m[1]);let body=main.slice(0,m.index);
const definitions=vm.runInNewContext('('+read('category.js').match(/const categoryDefinitions = ([\s\S]*?);\s*const allProducts/)[1]+')');
let assigns="{% assign hero_script = section.settings.copy_1 %}{% assign hero_line1 = section.settings.copy_2 %}{% assign hero_line2 = section.settings.copy_3 %}{% assign hero_description = section.settings.copy_4 %}{% assign hero_description2 = section.settings.copy_5 %}{% assign hero_button = section.settings.copy_7 %}\n{% case collection.handle %}";
for(const handle of ['pedis','bundles','accessories']){
 const def=definitions[handle],values={script:def.script,line1:def.title.split('<br>')[0],line2:def.title.split('<br>')[1].replace('&amp;','&'),description:def.description,button:'SHOP '+def.name.toUpperCase(),filters:def.chips.map(x=>x.id+'|'+x.label).join(',')};
 assigns+=`{% when '${handle}' %}`;for(const[key,value]of Object.entries(values)){const id=handle+'_'+key;schema.settings.push({type:key==='description'||key==='filters'?'textarea':'text',id,label:handle+' '+key,default:value});if(key!=='filters')assigns+=`{% assign hero_${key==='description'?'description':key} = section.settings.${id} %}`;}
 assigns+="{% assign hero_description2 = '' %}";
}
assigns+='{% endcase %}';
body=body.replaceAll('{{ section.settings.copy_1 | escape }}','{{ hero_script | escape }}').replaceAll('{{ section.settings.copy_2 | escape }}','{{ hero_line1 | escape }}').replaceAll('{{ section.settings.copy_3 | escape }}','{{ hero_line2 | escape }}').replaceAll('{{ section.settings.copy_4 | escape }}','{{ hero_description | escape }}').replaceAll('{{ section.settings.copy_5 | escape }}','{{ hero_description2 | escape }}').replaceAll('{{ section.settings.copy_7 | escape }}','{{ hero_button | escape }}');
body=body.replace('<br>{{ hero_description2 | escape }}',"{% if hero_description2 != blank %}<br>{{ hero_description2 | escape }}{% endif %}");
body=body.replace(/(<div class="shop-chips"[^>]*>)([\s\S]*?)(<\/div>)/,(_,start,chips,end)=>`${start}{% assign filter_setting = collection.handle | append: '_filters' %}{% assign category_filters = section.settings[filter_setting] %}{% if category_filters != blank %}{% assign filters = category_filters | split: ',' %}{% for filter in filters %}{% assign parts = filter | split: '|' %}<a class="shop-chip {% if current_tags contains parts[0] %}active{% elsif current_tags == blank and forloop.first %}active{% endif %}" href="{{ collection.url }}{% unless forloop.first %}/{{ parts[0] | handleize }}{% endunless %}">{{ parts[1] | escape }}</a>{% endfor %}{% else %}${chips}{% endif %}${end}`);
const kids=read(R+'/sections/main-kids.liquid'),km=kids.match(/\{% schema %\}([\s\S]*?)\{% endschema %\}/),ks=JSON.parse(km[1]);let kb=kids.slice(0,km.index);
for(const setting of ks.settings){const old=setting.id;setting.id='kids_'+old;kb=kb.replaceAll('section.settings.'+old,'section.settings.'+setting.id);schema.settings.push(setting);}
write(R+'/snippets/kids-content.liquid',kb);
body=assigns+"{% if collection.handle == 'kids' %}{% render 'kids-content' %}{% else %}"+body+'{% endif %}';
write(p,body+'\n{% schema %}\n'+JSON.stringify(schema,null,2)+'\n{% endschema %}');
// The approved Kids CSS is selected by collection handle, even before template assignment.
let layout=read(R+'/layout/theme.liquid').replaceAll("template.suffix == 'kids'","collection.handle == 'kids'");write(R+'/layout/theme.liquid',layout);
// The design page uses its actual product collection rather than every store item.
let design=read(R+'/sections/shop-by-design.liquid').replace('section.settings.collection | default: collections.all','section.settings.collection | default: collections.designs');write(R+'/sections/shop-by-design.liquid',design);
// Keep original quick-add classes and actions for catalog cards, with real variant IDs.
let catalog=read(R+'/snippets/catalog-card.liquid');catalog=catalog.replace(/\{% if product.has_only_default_variant %\}(<button[\s\S]*?<\/button>)\{% else %\}<a[^\n]+?\{% endif %\}/g,'$1');write(R+'/snippets/catalog-card.liquid',catalog);
console.log('Collection handles now render their approved page layouts automatically.');
