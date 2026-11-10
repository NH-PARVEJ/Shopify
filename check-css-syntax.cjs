const fs = require('fs');

function checkCss(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(filePath, 'NOT FOUND');
    return;
  }
  const text = fs.readFileSync(filePath, 'utf8');
  let openBraces = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let errors = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i+1];

    if (inComment) {
      if (ch === '*' && next === '/') {
        inComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (ch === '\\') {
        i++;
      } else if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      inComment = true;
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (ch === '{') openBraces++;
    if (ch === '}') {
      openBraces--;
      if (openBraces < 0) {
        errors.push('Extra closing brace at char ' + i);
        openBraces = 0;
      }
    }
  }

  if (openBraces > 0) {
    errors.push('Unclosed braces at end of file: ' + openBraces);
  }
  if (inComment) {
    errors.push('Unclosed comment at end of file');
  }

  console.log(filePath, 'openBraces:', openBraces, 'errors:', errors);
}

checkCss('press-by-heart/assets/style.css');
checkCss('press-by-heart/assets/refinements.css');
checkCss('press-by-heart/assets/product.css');
checkCss('live_style.css');
checkCss('live_refinements.css');
checkCss('live_product.css');
