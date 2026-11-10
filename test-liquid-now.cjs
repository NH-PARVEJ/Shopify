const fs = require('fs');
const path = require('path');
const { Liquid } = require('liquidjs');

const engine = new Liquid({
  root: [
    path.resolve('press-by-heart/snippets'),
    path.resolve('press-by-heart/sections'),
    path.resolve('press-by-heart/layout')
  ],
  extname: '.liquid'
});

// Register Shopify specific tags so liquidjs parses them accurately
const shopifyBlockTags = ['schema', 'form', 'paginate', 'javascript', 'style', 'comment', 'raw'];
const shopifyInlineTags = ['section', 'sections', 'render', 'layout', 'content_for_header', 'content_for_layout'];

shopifyBlockTags.forEach(tagName => {
  engine.registerTag(tagName, {
    parse: function(tagToken, remainTokens) {
      this.tokens = [];
      const stream = this.liquid.parser.parseStream(remainTokens);
      stream.on('tag:end' + tagName, () => stream.stop());
      stream.on('template', t => this.tokens.push(t));
      stream.on('end', () => {
        throw new Error(`tag {% ${tagName} %} not closed with {% end${tagName} %}`);
      });
      stream.start();
    }
  });
});

shopifyInlineTags.forEach(tagName => {
  engine.registerTag(tagName, {
    parse: function() {}
  });
});

const themeDir = path.resolve('press-by-heart');
const subdirs = ['layout', 'sections', 'snippets', 'templates'];

let totalFiles = 0;
let errors = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (file.endsWith('.liquid')) {
      totalFiles++;
      const content = fs.readFileSync(full, 'utf8');
      try {
        engine.parse(content);
      } catch (err) {
        errors.push({ file: path.relative(themeDir, full), error: err.message });
      }
    }
  }
}

for (const sub of subdirs) {
  const p = path.join(themeDir, sub);
  if (fs.existsSync(p)) walk(p);
}

console.log(`Parsed ${totalFiles} Liquid files.`);
if (errors.length === 0) {
  console.log('SUCCESS: 0 syntax or parse errors in all Liquid templates!');
} else {
  console.error(`FAILED: ${errors.length} errors found:`, errors);
  process.exit(1);
}
