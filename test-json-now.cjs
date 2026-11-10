const fs = require('fs');
const path = require('path');

const themeDir = path.resolve('press-by-heart');
const subdirs = ['templates', 'config', 'locales'];
let jsonFiles = 0;
let errors = [];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (file.endsWith('.json')) {
      jsonFiles++;
      const content = fs.readFileSync(full, 'utf8');
      try {
        JSON.parse(content);
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

console.log(`Validated ${jsonFiles} JSON files.`);
if (errors.length === 0) {
  console.log('SUCCESS: All JSON files are valid!');
} else {
  console.error('FAILED JSON files:', errors);
  process.exit(1);
}
