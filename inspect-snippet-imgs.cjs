const fs = require('fs');
const files = fs.readdirSync('press-by-heart/snippets');
files.forEach(f => {
  const c = fs.readFileSync('press-by-heart/snippets/' + f, 'utf8');
  const imgMatches = c.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
  if (imgMatches.length > 0) {
    console.log(f, 'has images:');
    imgMatches.forEach(m => console.log('  ', m));
  }
});
