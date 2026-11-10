const fs = require('fs');
const readline = require('readline');

async function checkMainPageHistory() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 4000 && o.step_index <= 4150) {
      if (o.tool_calls) {
        for (const tc of o.tool_calls) {
          if (tc.name === 'run_command' && (tc.args.CommandLine.includes('main-page') || tc.args.CommandLine.includes('pages'))) {
            console.log(`Step ${o.step_index}: run_command ${tc.args.CommandLine}`);
          }
        }
      }
    }
  }
}

checkMainPageHistory();
