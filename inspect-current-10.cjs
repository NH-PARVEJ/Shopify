const fs = require('fs');

console.log('1. settings_schema.json size:', fs.statSync('press-by-heart/config/settings_schema.json').size);
console.log('2. theme-settings.liquid size:', fs.statSync('press-by-heart/snippets/theme-settings.liquid').size);
console.log('3. settings_data.json size:', fs.statSync('press-by-heart/config/settings_data.json').size);
console.log('4. mobile-dock.liquid size:', fs.statSync('press-by-heart/sections/mobile-dock.liquid').size);
console.log('5. main-page.liquid size:', fs.statSync('press-by-heart/sections/main-page.liquid').size);
console.log('6. footer.liquid size:', fs.statSync('press-by-heart/sections/footer.liquid').size);
console.log('7. mega-menu-shop-all.liquid size:', fs.statSync('press-by-heart/snippets/mega-menu-shop-all.liquid').size);
console.log('8. mega-menu-kids.liquid size:', fs.statSync('press-by-heart/snippets/mega-menu-kids.liquid').size);
console.log('9. mega-menu-shop-by-design.liquid size:', fs.statSync('press-by-heart/snippets/mega-menu-shop-by-design.liquid').size);
console.log('10. header.liquid size:', fs.statSync('press-by-heart/sections/header.liquid').size);
