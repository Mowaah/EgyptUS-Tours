const fs = require('fs');
const path = require('path');

const variablesPath = path.resolve('src/styles/_variables.scss');
const variablesContent = fs.readFileSync(variablesPath, 'utf8');

// Parse variables into a map: Hex -> Variable Name
// We prefer semantic names over gray scale if both exist, but usually it's 1:1
const varMap = {};
const lines = variablesContent.split('\n');
lines.forEach(line => {
    const match = line.match(/^(\$[a-zA-Z0-9_-]+):\s*(#[a-fA-F0-9]{3,6})/);
    if (match) {
        const name = match[1];
        const hex = match[2].toLowerCase();
        // Prefer shorter/simpler names or the first one found
        if (!varMap[hex]) {
            varMap[hex] = name;
        }
    }
});

// Add shorthand versions if not present
Object.keys(varMap).forEach(hex => {
    if (hex.length === 7) {
        const shorthand = '#' + hex[1] + hex[3] + hex[5];
        if (hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]) {
            if (!varMap[shorthand]) varMap[shorthand] = varMap[hex];
        }
    }
});

console.log('Loaded variables:', varMap);

const ignoreDirs = ['node_modules', '.next', 'dist', '.git'];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoreDirs.includes(file)) {
                processDirectory(fullPath);
            }
        } else if (file.endsWith('.scss') && file !== '_variables.scss') {
            processFile(fullPath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Match hex codes
    const hexRegex = /#[a-fA-F0-9]{3,6}/g;
    const newContent = content.replace(hexRegex, (match) => {
        const hex = match.toLowerCase();
        if (varMap[hex]) {
            modified = true;
            return varMap[hex];
        }
        console.log(`Unmatched hex in ${filePath}: ${match}`);
        return match;
    });

    if (modified) {
        let finalContent = newContent;
        // Check for @use
        if (!finalContent.includes('@use "@/styles/variables" as *;')) {
            finalContent = '@use "@/styles/variables" as *;\n' + finalContent;
        }
        fs.writeFileSync(filePath, finalContent);
        console.log(`Updated ${filePath}`);
    }
}

processDirectory(path.resolve('src'));
