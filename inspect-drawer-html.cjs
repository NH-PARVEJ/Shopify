const fs = require('fs');
const c = fs.readFileSync('press-by-heart/sections/cart-drawer.liquid', 'utf-8');
const p = c.indexOf('cart-sidebar-footer');
console.log('--- FOOTER ---');
console.log(c.substring(p, p + 2500));
