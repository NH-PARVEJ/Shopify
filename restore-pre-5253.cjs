const fs = require('fs');
const readline = require('readline');

async function restorePre5253() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  // For the 10 files, let's look at their write_file calls before 5253:
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

  const writes = {};
  const edits = {};

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    if (o.tool_calls) {
      for (const tc of o.tool_calls) {
        const p = tc.args?.Path || '';
        for (const ft of filesToTrack) {
          if (p.endsWith(ft)) {
            if (tc.name === 'write_file' && tc.args.Content !== undefined) {
              if (!writes[ft]) writes[ft] = [];
              writes[ft].push({ step: o.step_index, content: tc.args.Content });
            } else if (tc.name === 'edit_file') {
              if (!edits[ft]) edits[ft] = [];
              edits[ft].push({ step: o.step_index, target: tc.args.Target, replacement: tc.args.Replacement });
            }
          }
        }
      }
    }
  }

  for (const ft of filesToTrack) {
    const wCount = writes[ft] ? writes[ft].length : 0;
    const eCount = edits[ft] ? edits[ft].length : 0;
    const lastStep = writes[ft] ? writes[ft].at(-1).step : 'none';
    console.log(`${ft}: ${wCount} writes (last step ${lastStep}), ${eCount} edits`);
  }
}

restorePre5253();
