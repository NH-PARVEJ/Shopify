const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function createShopifyZip() {
  const themeDir = path.resolve('press-by-heart');
  const zipPath = path.resolve('press-by-heart.zip');

  const zip = new JSZip();

  const standardFolders = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

  let totalFiles = 0;

  function addDirToZip(localDirPath, zipFolder) {
    const items = fs.readdirSync(localDirPath);
    for (const item of items) {
      const fullPath = path.join(localDirPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const subZip = zipFolder.folder(item);
        addDirToZip(fullPath, subZip);
      } else {
        const data = fs.readFileSync(fullPath);
        zipFolder.file(item, data);
        totalFiles++;
      }
    }
  }

  for (const folder of standardFolders) {
    const fullFolderPath = path.join(themeDir, folder);
    if (fs.existsSync(fullFolderPath)) {
      const zipFolder = zip.folder(folder);
      addDirToZip(fullFolderPath, zipFolder);
    }
  }

  console.log(`Zipping ${totalFiles} files into ${zipPath}...`);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
    platform: 'UNIX' // Ensures POSIX forward slashes
  });

  fs.writeFileSync(zipPath, content);
  const sizeMB = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
  console.log(`SUCCESS: Created ${zipPath} (${sizeMB} MB)`);
}

createShopifyZip().catch(err => {
  console.error('Error creating ZIP:', err);
  process.exit(1);
});
