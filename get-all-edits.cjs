const fs = require('fs');
const readline = require('readline');

async function getAllEdits() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const filesMap = {};

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253 && o.tool_calls) {
      for (const tc of o.tool_calls) {
        if (tc.name === 'edit_file' || tc.name === 'write_file') {
          const p = tc.args.Path;
          if (!filesMap[p]) filesMap[p] = [];
          filesMap[p].push({
            step: o.step_index,
            tool: tc.name,
            target: tc.args.Target,
            replacement: tc.args.Replacement,
            content: tc.args.Content ? tc.args.Content.substring(0, 100) : null
          });
        }
      }
    }
  }

  for (const [p, ops] of Object.entries(filesMap)) {
    console.log(`\nFILE: ${p} (${ops.length} ops)`);
    for (const op of ops) {
      console.log(`  step ${op.step} [${op.tool}]`);
    }
  }
}

getAllEdits();
