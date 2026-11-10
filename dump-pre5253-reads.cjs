const fs = require('fs');
const readline = require('readline');

async function dumpAllPre5253Reads() {
  const fileStream = fs.createReadStream('C:/Users/devnh/.gemini/antigravity/brain/01503fdc-1f94-4c4c-910c-200f43c13c0b/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let currentReadFile = null;

  for await (const line of rl) {
    const o = JSON.parse(line);
    if (o.step_index >= 5370) break;

    if (o.step_index >= 5253) {
      if (o.tool_calls) {
        for (const tc of o.tool_calls) {
          if (tc.name === 'read_file') {
            currentReadFile = { step: o.step_index, path: tc.args.Path, start: tc.args.StartLine, end: tc.args.EndLine };
          }
        }
      } else if (o.type === 'GENERIC' && currentReadFile) {
        console.log(`Step ${o.step_index}: Read ${currentReadFile.path} (lines ${currentReadFile.start}-${currentReadFile.end}), length: ${o.content.length}`);
        // Strip line numbers if format is "123: content"
        const cleanLines = [];
        const rawLines = o.content.split('\n');
        for (const rl of rawLines) {
          const m = rl.match(/^\d+:\s?(.*)$/);
          if (m) {
            cleanLines.push(m[1]);
          }
        }
        if (cleanLines.length > 0) {
          const fname = currentReadFile.path.split(/[\\/]/).pop();
          const outName = `pre_${fname}_step${o.step_index}`;
          fs.writeFileSync(outName, cleanLines.join('\n'));
          console.log(`  -> Saved ${cleanLines.length} lines to ${outName}`);
        }
        currentReadFile = null;
      }
    }
  }
}

dumpAllPre5253Reads();
