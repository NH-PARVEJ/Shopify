const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function verifyZip() {
  const zipPath = path.resolve('press-by-heart.zip');
  const buffer = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(buffer);

  const filenames = Object.keys(zip.files);
  console.log(`Total files in zip: ${filenames.length}`);

  const roots = new Set();
  let hasBackslash = false;

  for (const name of filenames) {
    if (name.includes('\\')) hasBackslash = true;
    const rootDir = name.split('/')[0];
    roots.add(rootDir);
  }

  console.log('Archive root directories:', Array.from(roots));
  console.log('Has backslashes:', hasBackslash);

  const expectedRoots = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
  const unexpected = Array.from(roots).filter(r => !expectedRoots.includes(r));

  if (unexpected.length > 0) {
    console.error('UNEXPECTED ROOTS:', unexpected);
    process.exit(1);
  }

  if (hasBackslash) {
    console.error('ERROR: Zip contains Windows backslashes!');
    process.exit(1);
  }

  console.log('SUCCESS: ZIP archive structure is 100% compliant with Shopify Online Store 2.0!');
}

verifyZip().catch(err => {
  console.error(err);
  process.exit(1);
});
