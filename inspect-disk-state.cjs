const fs = require('fs');

const header = fs.readFileSync('press-by-heart/sections/header.liquid', 'utf8');
console.log('header.liquid includes mega_menu_shop_all:', header.includes('mega_menu_shop_all'));
console.log('header.liquid length:', header.length);

const footer = fs.readFileSync('press-by-heart/sections/footer.liquid', 'utf8');
console.log('footer.liquid includes f_menu_2:', footer.includes('f_menu_2'));
console.log('footer.liquid length:', footer.length);

const dock = fs.readFileSync('press-by-heart/sections/mobile-dock.liquid', 'utf8');
console.log('mobile-dock.liquid length:', dock.length);

const page = fs.readFileSync('press-by-heart/sections/main-page.liquid', 'utf8');
console.log('main-page.liquid length:', page.length);

const schema = fs.readFileSync('press-by-heart/config/settings_schema.json', 'utf8');
console.log('settings_schema.json length:', schema.length);

const data = fs.readFileSync('press-by-heart/config/settings_data.json', 'utf8');
console.log('settings_data.json length:', data.length);
