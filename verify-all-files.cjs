const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else {
      results.push(full);
    }
  });
  return results;
}

const allFiles = getFiles('press-by-heart');
console.log(`Total files in press-by-heart: ${allFiles.length}`);

// Group by folder
const folders = {};
allFiles.forEach(f => {
  const rel = path.relative('press-by-heart', f);
  const top = rel.split(path.sep)[0];
  if (!folders[top]) folders[top] = [];
  folders[top].push(rel);
});

for (const dir in folders) {
  console.log(`\n[${dir}] (${folders[dir].length} files):`);
  folders[dir].forEach(f => console.log('  ' + f));
}
