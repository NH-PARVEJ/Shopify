const fs = require('fs');
const readline = require('readline');

async function findPre5253Files() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const targetFiles = [
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

  // We want to find the LAST written or read content for each file before step 5253
  const lastKnown = {};

  let lastReadTarget = null;

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    if (o.tool_calls) {
      for (const tc of o.tool_calls) {
        const p = tc.args?.Path || '';
        for (const tf of targetFiles) {
          if (p.endsWith(tf)) {
            if (tc.name === 'write_file' && tc.args.Content) {
              lastKnown[tf] = { step: o.step_index, type: 'write', content: tc.args.Content };
            } else if (tc.name === 'read_file') {
              lastReadTarget = { tf, step: o.step_index, startLine: tc.args.StartLine };
            }
          }
        }
      }
    } else if (o.type === 'GENERIC' && lastReadTarget) {
      if (o.content && !lastReadTarget.startLine) { // only full read
        lastKnown[lastReadTarget.tf] = { step: o.step_index, type: 'read', content: o.content };
      }
      lastReadTarget = null;
    }
  }

  console.log('Known files before step 5253:');
  for (const tf of targetFiles) {
    if (lastKnown[tf]) {
      console.log(` - ${tf}: from step ${lastKnown[tf].step} (${lastKnown[tf].type}), length: ${lastKnown[tf].content.length}`);
    } else {
      console.log(` - ${tf}: NOT recorded in transcript (was never edited or read full before 5253)`);
    }
  }
}

findPre5253Files();
