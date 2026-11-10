const fs = require('fs');
const readline = require('readline');

async function findAllReadsWrites() {
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

  const occurrences = [];

  let pendingRead = null;

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    if (o.tool_calls) {
      for (const tc of o.tool_calls) {
        const p = tc.args?.Path || '';
        for (const tf of targetFiles) {
          if (p.endsWith(tf)) {
            if (tc.name === 'write_file') {
              occurrences.push({ step: o.step_index, file: tf, op: 'write', length: tc.args.Content?.length });
            } else if (tc.name === 'read_file') {
              pendingRead = { step: o.step_index, file: tf, start: tc.args.StartLine, end: tc.args.EndLine };
            }
          }
        }
      }
    } else if (o.type === 'GENERIC' && pendingRead) {
      occurrences.push({ step: o.step_index, file: pendingRead.file, op: 'read', start: pendingRead.start, end: pendingRead.end, length: o.content?.length });
      pendingRead = null;
    }
  }

  console.log(`Found ${occurrences.length} occurrences before step 5253:`);
  for (const occ of occurrences) {
    console.log(JSON.stringify(occ));
  }
}

findAllReadsWrites();
