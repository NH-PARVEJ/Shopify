const fs = require('fs');
const readline = require('readline');

async function extractPre5253Content() {
  const stepsToInspect = [5302, 5308, 5328, 5334, 5346, 5352, 5362];
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (stepsToInspect.includes(o.step_index)) {
      console.log(`=== STEP ${o.step_index} (${o.type}) ===`);
      if (o.content) {
        console.log('Content preview (first 300 chars):', o.content.substring(0, 300));
      }
      if (o.tool_calls) {
        console.log('Tool calls:', JSON.stringify(o.tool_calls).substring(0, 300));
      }
    }
  }
}

extractPre5253Content();
