const fs = require('fs');
const readline = require('readline');

async function findFileHistory() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    // Check if o.content in GENERIC steps contains full file content when read
    if (o.type === 'GENERIC' && o.content) {
      if (o.content.includes('"name": "header"') || o.content.includes('"name": "Header"')) {
        console.log(`Step ${o.step_index} GENERIC contains header.liquid! Length: ${o.content.length}`);
        fs.writeFileSync('header.liquid.step' + o.step_index, o.content);
      }
      if (o.content.includes('"name": "footer"') || o.content.includes('"name": "Footer"')) {
        console.log(`Step ${o.step_index} GENERIC contains footer.liquid! Length: ${o.content.length}`);
        fs.writeFileSync('footer.liquid.step' + o.step_index, o.content);
      }
      if (o.content.includes('"name": "mobile-dock"') || o.content.includes('"name": "Mobile dock"')) {
        console.log(`Step ${o.step_index} GENERIC contains mobile-dock.liquid! Length: ${o.content.length}`);
        fs.writeFileSync('mobile-dock.liquid.step' + o.step_index, o.content);
      }
      if (o.content.includes('theme-settings') && o.content.includes('style')) {
        console.log(`Step ${o.step_index} GENERIC contains theme-settings! Length: ${o.content.length}`);
        fs.writeFileSync('theme-settings.step' + o.step_index, o.content);
      }
    }
  }
}

findFileHistory();
