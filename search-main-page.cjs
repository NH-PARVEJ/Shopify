const fs = require('fs');
const readline = require('readline');

async function searchMainPage() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    const str = JSON.stringify(o);
    if (str.includes('main-page.liquid') && (str.includes('write_file') || str.includes('edit_file') || str.includes('writeFileSync'))) {
      console.log(`Step ${o.step_index} (${o.type}) touched main-page.liquid`);
    }
  }
}

searchMainPage();
