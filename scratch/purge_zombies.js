const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join('c:', 'Users', 'ASUS', '.gemini', 'antigravity', 'scratch', 'iu-repo', 'Home1', 'Pages');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the remaining broken cursor JS
    const brokenJsRegex = /\/\/ Outline follows with a delay[\s\S]*?\}\);/g;
    content = content.replace(brokenJsRegex, '');
    
    // Remove leftover hoverable loops
    const brokenHoverRegex = /\/\/ Hover Effect[\s\S]*?\}\);/g;
    content = content.replace(brokenHoverRegex, '');

    // Remove empty script tags
    content = content.replace(/<script>\s*<\/script>/gi, '');

    fs.writeFileSync(filePath, content);
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.html') && file !== 'result.html') {
            processFile(fullPath);
        }
    });
}

walk(BASE_DIR);
console.log("Zombie Code Purged.");
