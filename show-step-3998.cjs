const fs = require('fs');
const readline = require('readline');

async function showStep3998() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index === 3998) {
      for (const tc of o.tool_calls || []) {
        console.log(`Tool: ${tc.name}`);
        if (tc.name === 'write_file' || tc.name === 'edit_file') {
          console.log(`Path: ${tc.args.Path}`);
          console.log(`Content length: ${tc.args.Content?.length}`);
          fs.writeFileSync('main-page.liquid.step3998', tc.args.Content);
          console.log('Saved main-page.liquid.step3998');
        } else if (tc.name === 'run_command') {
          console.log(`Cmd: ${tc.args.CommandLine}`);
        }
      }
    }
  }
}

showStep3998();
