const fs = require('fs');
const readline = require('readline');

async function getStep5275() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index === 5275) {
      console.log('Step 5275 length:', o.content.length);
      console.log('First 300 chars:\n', o.content.substring(0, 300));
      fs.writeFileSync('mobile-dock.liquid.pre5253', o.content);
      console.log('Saved mobile-dock.liquid.pre5253');
      break;
    }
  }
}

getStep5275();
