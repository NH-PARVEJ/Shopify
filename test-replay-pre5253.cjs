const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function testReplay() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const filesToTrack = [
    'settings_schema.json',
    'theme-settings.liquid',
    'settings_data.json',
    'mobile-dock.liquid',
    'main-page.liquid',
    'footer.liquid',
    'mega-menu-shop-all.liquid',
    'mega-menu-kids.liquid',
    'mega-menu-shop-by-design.liquid',
    'header.liquid'
  ];

  const fileStates = {};

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    if (o.tool_calls) {
      for (const tc of o.tool_calls) {
        const p = tc.args?.Path || '';
        for (const ft of filesToTrack) {
          if (p.endsWith(ft)) {
            if (tc.name === 'write_file' && tc.args.Content !== undefined) {
              fileStates[ft] = tc.args.Content;
            } else if (tc.name === 'edit_file' && fileStates[ft]) {
              const target = tc.args.Target;
              const rep = tc.args.Replacement;
              if (fileStates[ft].includes(target)) {
                fileStates[ft] = fileStates[ft].replaceAll(target, rep);
              } else {
                console.warn(`[WARN] Edit target not found in ${ft} at step ${o.step_index}`);
              }
            }
          }
        }
      }
    }
  }

  console.log('\n--- REPLAY RESULTS UP TO STEP 5252 ---');
  for (const ft of filesToTrack) {
    if (!fileStates[ft]) {
      console.log(`[!] ${ft}: no state reconstructed`);
      continue;
    }
    // Find local file path
    let localPath = null;
    if (ft.endsWith('.json')) {
      localPath = path.join('press-by-heart', 'config', ft);
    } else if (ft.startsWith('mega-menu') || ft === 'theme-settings.liquid') {
      localPath = path.join('press-by-heart', 'snippets', ft);
    } else {
      localPath = path.join('press-by-heart', 'sections', ft);
    }

    if (fs.existsSync(localPath)) {
      const currentContent = fs.readFileSync(localPath, 'utf8');
      const matches = currentContent === fileStates[ft];
      console.log(`${ft}: Replayed length = ${fileStates[ft].length}, Current disk length = ${currentContent.length}, Matches: ${matches}`);
      if (!matches) {
        // Save replayed version to .pre5253
        fs.writeFileSync(localPath + '.pre5253', fileStates[ft]);
        console.log(`  -> Saved replayed content to ${localPath}.pre5253`);
      }
    } else {
      console.log(`${ft}: Local path does not exist: ${localPath}`);
    }
  }
}

testReplay();
