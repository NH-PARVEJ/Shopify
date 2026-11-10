const fs = require('fs');
const path = require('path');

const sectionsDir = path.resolve('press-by-heart/sections');
const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.liquid'));

let errors = [];

const validSettingTypes = new Set([
  'text', 'textarea', 'image_picker', 'radio', 'select', 'checkbox', 'range',
  'color', 'color_background', 'font_picker', 'collection', 'product', 'blog',
  'page', 'link_list', 'url', 'video', 'video_url', 'richtext', 'html',
  'article', 'header', 'paragraph'
]);

for (const file of files) {
  const content = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
  const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!match) continue;

  try {
    const schema = JSON.parse(match[1]);
    if (schema.settings) {
      for (const s of schema.settings) {
        if (s.type === 'html') {
          errors.push({ file, error: `Invalid setting type "html" in id: ${s.id}` });
        }
      }
    }
  } catch (err) {
    errors.push({ file, error: 'JSON parse error: ' + err.message });
  }
}

if (errors.length === 0) {
  console.log(`SUCCESS: All ${files.length} sections have valid JSON schemas and setting types!`);
} else {
  console.error('FAILED schemas:', errors);
  process.exit(1);
}
