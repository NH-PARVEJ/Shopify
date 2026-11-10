const fs = require('fs');
const readline = require('readline');

async function findEditsAfter5253() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const filesTouched = new Set();
  const operations = [];

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) {
      if (o.tool_calls) {
        for (const tc of o.tool_calls) {
          const p = tc.args?.Path || tc.args?.path;
          if (p) {
            filesTouched.add(p);
            operations.push({ step: o.step_index, name: tc.name, path: p });
          } else if (tc.name === 'run_command') {
            const cmd = tc.args?.CommandLine || '';
            if (cmd.includes('write') || cmd.includes('Out-File') || cmd.includes('Set-Content') || cmd.includes('node')) {
              operations.push({ step: o.step_index, name: tc.name, cmd: cmd.substring(0, 100) });
            }
          }
        }
      }
    }
  }

  console.log('Total files touched after step 5253:', filesTouched.size);
  console.log('Files list:');
  for (const f of filesTouched) {
    console.log(' -', f);
  }
  console.log('\nTotal operations:', operations.length);
  for (const op of operations.slice(0, 50)) {
    console.log(op);
  }
}

findEditsAfter5253();
