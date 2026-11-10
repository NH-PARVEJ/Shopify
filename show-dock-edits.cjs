const fs = require('fs');
const readline = require('readline');

async function getDockEdits() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253 && o.tool_calls) {
      for (const tc of o.tool_calls) {
        if (tc.args.Path && tc.args.Path.includes('mobile-dock.liquid')) {
          console.log(`\n=== STEP ${o.step_index} (${tc.name}) ===`);
          if (tc.name === 'edit_file') {
            console.log('--- TARGET ---\n', tc.args.Target);
            console.log('--- REPLACEMENT ---\n', tc.args.Replacement);
          } else if (tc.name === 'write_file') {
            console.log('--- WRITE FILE CONTENT (first 200 chars) ---\n', tc.args.Content.substring(0, 200));
          }
        }
      }
    }
  }
}

getDockEdits();
