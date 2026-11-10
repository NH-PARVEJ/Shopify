const fs = require('fs');
const readline = require('readline');

async function findFullMainPage() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    if (o.tool_calls) {
      for (const tc of o.tool_calls) {
        if (tc.args?.Path && tc.args.Path.includes('main-page.liquid')) {
          console.log(`Step ${o.step_index} [${tc.name}]: ${JSON.stringify(tc.args).substring(0, 150)}`);
        }
        if (tc.args?.Path && tc.args.Path.includes('mega-menu-shop-by-design.liquid')) {
          console.log(`Step ${o.step_index} [${tc.name}]: ${JSON.stringify(tc.args).substring(0, 150)}`);
        }
      }
    }
  }
}

findFullMainPage();
