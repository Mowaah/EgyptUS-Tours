const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Map of pixel sizes to variable names
const varMap = {
  11: '$font-size-2xs',
  12: '$font-size-xs',
  13: '$font-size-13',
  14: '$font-size-sm',
  15: '$font-size-15',
  16: '$font-size-base',
  17: '$font-size-17',
  18: '$font-size-lg',
  20: '$font-size-xl',
  22: '$font-size-22',
  24: '$font-size-2xl',
  26: '$font-size-26',
  28: '$font-size-28',
  29: '$font-size-29',
  30: '$font-size-3xl',
  32: '$font-size-32',
  36: '$font-size-4xl',
  40: '$font-size-40',
  48: '$font-size-5xl'
};

const missingVars = new Set();
let filesModified = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.scss')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Find font-size: 14px;
  const regex = /font-size:\s*(\d+)px/g;
  let hasChanges = false;
  
  content = content.replace(regex, (match, pxStr) => {
    const px = parseInt(pxStr, 10);
    if (varMap[px]) {
      hasChanges = true;
      return `font-size: ${varMap[px]}`;
    } else {
      missingVars.add(px);
      // dynamically add to varMap
      const varName = `$font-size-${px}`;
      varMap[px] = varName;
      hasChanges = true;
      return `font-size: ${varName}`;
    }
  });

  if (hasChanges) {
    // Ensure @use "@/styles/variables" as *; exists
    if (!content.includes('@use "@/styles/variables"')) {
      content = '@use "@/styles/variables" as *;\n' + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
  }
}

walkDir(srcDir);

console.log(`Modified ${filesModified} files.`);
console.log(`Found these missing vars: ${Array.from(missingVars).join(', ')}`);
