const fs = require('fs');
const readline = require('readline');

async function checkStep5304() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index === 5304) {
      console.log('Step 5304 Content written to settings_schema.json:');
      const tc = o.tool_calls[0];
      console.log('Length:', tc.args.Content.length);
      console.log('Snippet:', tc.args.Content.substring(0, 300));
    }
    if (o.step_index === 5302) {
      console.log('Step 5302 (read_file settings_schema.json)');
    }
    if (o.step_index === 5303) {
      console.log('Step 5303 (content of settings_schema.json BEFORE 5304):');
      console.log('Length:', o.content.length);
      fs.writeFileSync('settings_schema.json.pre5253', o.content);
      console.log('Saved settings_schema.json.pre5253');
    }
  }
}
checkStep5304();
