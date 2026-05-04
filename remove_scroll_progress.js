const fs   = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'Home1', 'Pages');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            walkDir(full, callback);
        } else {
            callback(full);
        }
    });
}

let removedCount = 0;

walkDir(baseDir, (filePath) => {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove the HTML element (various versions)
    content = content.replace(/<div id="scroll-progress"[\s\S]*?><\/div>/g, '');
    content = content.replace(/<!-- Option 7: Scroll Progress Bar -->[\s\S]*?<div id="scroll-progress"[\s\S]*?><\/div>/g, '');

    // 2. Remove the JavaScript logic
    content = content.replace(/\/\/ Option 7: Scroll Progress Logic[\s\S]*?\}\);/g, '');
    content = content.replace(/window\.addEventListener\('scroll', \(\) => \{[\s\S]*?const scrollProgress = document\.getElementById\('scroll-progress'\);[\s\S]*?\}\);/g, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        removedCount++;
        console.log(`  [CLEANED] ${path.relative(baseDir, filePath)}`);
    }
});

console.log(`\n✅ Done — Removed scroll-progress from ${removedCount} files.\n`);
