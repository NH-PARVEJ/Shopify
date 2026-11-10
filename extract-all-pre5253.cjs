const fs = require('fs');
const readline = require('readline');

async function extractFiles() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  // Track the most recent content of all press-by-heart files before step 5253
  const preFiles = {};

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    if (o.tool_calls) {
      for (const tc of o.tool_calls) {
        const p = tc.args?.Path || '';
        if (p.includes('press-by-heart')) {
          const norm = p.replace(/\\/g, '/').toLowerCase();
          if (tc.name === 'write_file' && tc.args.Content !== undefined) {
            preFiles[norm] = { step: o.step_index, content: tc.args.Content };
          }
        }
      }
    }
  }

  console.log('Total files written before step 5253:', Object.keys(preFiles).length);
  for (const [k, v] of Object.entries(preFiles)) {
    console.log(` - ${k}: step ${v.step}, len ${v.content.length}`);
  }
}

extractFiles();
