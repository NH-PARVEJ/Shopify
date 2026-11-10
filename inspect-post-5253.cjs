const fs = require('fs');
const readline = require('readline');

async function inspectEdits() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const post5253Edits = [];

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253 && o.tool_calls) {
      for (const tc of o.tool_calls) {
        if (tc.name === 'write_file' || tc.name === 'edit_file') {
          post5253Edits.push({
            step: o.step_index,
            tool: tc.name,
            path: tc.args.Path,
            target: tc.args.Target ? tc.args.Target.substring(0, 100) : null,
            replacement: tc.args.Replacement ? tc.args.Replacement.substring(0, 100) : null
          });
        }
      }
    }
  }

  console.log(`Found ${post5253Edits.length} write/edit operations after step 5253:`);
  for (const e of post5253Edits) {
    console.log(JSON.stringify(e));
  }
}

inspectEdits();
