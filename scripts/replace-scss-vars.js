const fs = require('fs');
const path = require('path');

const variablesPath = path.join(__dirname, '../src/styles/_variables.scss');
const srcPath = path.join(__dirname, '../src');

// Read _variables.scss
const variablesContent = fs.readFileSync(variablesPath, 'utf8');

// Build mappings
const colorMap = new Map(); // e.g. '#2971e6' -> '$primary'
const fontSizeMap = new Map(); // e.g. '14px' -> '$font-size-sm'

const colorRegex = /^\$([a-zA-Z0-9-]+):\s*(#[A-Fa-f0-9]{3,8}|rgba\([^)]+\));/gm;
let colorMatch;
while ((colorMatch = colorRegex.exec(variablesContent)) !== null) {
  const varName = `$${colorMatch[1]}`;
  let value = colorMatch[2];
  
  if (value.startsWith('#')) {
    value = value.toLowerCase();
    
    // Convert #abc to #aabbcc for consistency
    if (value.length === 4) {
      value = '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
    }
    
    // Only map if not already mapped (first one wins, e.g. $primary over alias)
    if (!colorMap.has(value)) {
      colorMap.set(value, varName);
    }
  } else {
    // rgba value
    value = value.replace(/\s+/g, ''); // strip spaces for easier matching
    if (!colorMap.has(value)) {
      colorMap.set(value, varName);
    }
  }
}

const fontRegex = /^\$([a-zA-Z0-9-]+):\s*[^;]+;\s*\/\/\s*(\d+)px/gm;
let fontMatch;
while ((fontMatch = fontRegex.exec(variablesContent)) !== null) {
  const varName = `$${fontMatch[1]}`;
  const pxVal = parseInt(fontMatch[2], 10);
  const pxString = `${pxVal}px`;
  const remString = `${pxVal / 16}rem`;
  
  if (!fontSizeMap.has(pxString)) {
    fontSizeMap.set(pxString, varName);
  }
  // If the rem value is cleanly parsed, map it too
  if (!fontSizeMap.has(remString)) {
    fontSizeMap.set(remString, varName);
  }
  // Some people might use 1rem instead of 1.0rem, javascript handles this automatically
}

console.log(`Loaded ${colorMap.size} colors and ${fontSizeMap.size} font sizes.`);

// Walk directory
function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      if (filepath.endsWith('.scss') && !filepath.endsWith('_variables.scss')) {
        filelist.push(filepath);
      }
    }
  }
  return filelist;
}

const scssFiles = walkSync(srcPath);
let modifiedCount = 0;

for (const file of scssFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Replace hex colors
  content = content.replace(/#[A-Fa-f0-9]{3,8}\b/g, (match) => {
    let hex = match.toLowerCase();
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    if (colorMap.has(hex)) {
      return colorMap.get(hex);
    }
    return match;
  });

  // Replace rgba colors (simple space-stripped match attempt)
  content = content.replace(/rgba\([^)]+\)/g, (match) => {
    const stripped = match.replace(/\s+/g, '');
    if (colorMap.has(stripped)) {
      return colorMap.get(stripped);
    }
    return match;
  });

  // Replace font sizes
  content = content.replace(/\b\d+px\b/g, (match) => {
    // Only replace if it's likely a font-size or spacing, but let's just replace any exact pixel match
    // since the prompt asked for hard coded colors and font sizes.
    // Wait, replacing any px might mess up widths/heights if they happen to match.
    // The user said "change all the hard coded colors and font sizes".
    // We should probably only replace px if it's following `font-size:`, `line-height:`, `margin`, `padding`, `gap`, etc.?
    // But they specifically asked for font sizes. We can restrict the regex to font-size context.
    return match; // Handled below with context
  });

  // More context-aware font-size replacement:
  content = content.replace(/(font-size\s*:\s*)(\d+px|\d*\.?\d+rem)/g, (match, prefix, val) => {
    if (fontSizeMap.has(val)) {
      return prefix + fontSizeMap.get(val);
    }
    return match;
  });

  if (content !== originalContent) {
    // Add import if missing
    if (!content.includes('@use "@/styles/variables"')) {
      const importStmt = '@use "@/styles/variables" as *;\n\n';
      // Put it after any existing @use or at top
      if (content.startsWith('@use')) {
        const lastUseIdx = content.lastIndexOf('@use');
        const endOfLine = content.indexOf('\n', lastUseIdx);
        content = content.slice(0, endOfLine + 1) + importStmt + content.slice(endOfLine + 1);
      } else {
        content = importStmt + content;
      }
    }
    
    fs.writeFileSync(file, content, 'utf8');
    modifiedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`\nFinished! Modified ${modifiedCount} files.`);
