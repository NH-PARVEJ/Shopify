const fs = require('fs');
const readline = require('readline');

async function getPre5304Content() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  // Map of file name to its content right before step 5253
  // Let's check step 5253 to 5360 where the agent read files:
  // Step 5302 read settings_schema.json (lines 1 to 70)
  // Step 5308 read settings_data.json
  // Step 5322 read size-guide-modal.liquid
  // Step 5328 read main-page.liquid
  // Step 5346 read header.liquid
  // Step 5352 read mega-menu-shop-by-design.liquid

  // Let's check if there were full reads earlier:
  const lastFullContent = {};

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5253) break;

    if (o.type === 'GENERIC' && o.content) {
      if (o.content.includes('"name": "header"') || o.content.includes('"name": "Header"')) {
        lastFullContent['header.liquid'] = o.content;
      }
      if (o.content.includes('f_menu_2')) {
        lastFullContent['footer.liquid'] = o.content;
      }
      if (o.content.includes('mobile-dock')) {
        lastFullContent['mobile-dock.liquid'] = o.content;
      }
      if (o.content.includes('mega-menu-kids') || o.content.includes('kids-menu-item')) {
        lastFullContent['mega-menu-kids.liquid'] = o.content;
      }
      if (o.content.includes('mega-menu-shop-all') || o.content.includes('shop-all-menu-item')) {
        lastFullContent['mega-menu-shop-all.liquid'] = o.content;
      }
    }
  }

  for (const [k, v] of Object.entries(lastFullContent)) {
    console.log(`${k}: length ${v.length}`);
  }
}

getPre5304Content();
