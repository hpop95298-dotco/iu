const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'Home1', 'Pages');
let errors = [];
let checkedFiles = new Set();
let checkedLinks = new Set();

function checkFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    if (checkedFiles.has(filePath)) return;
    checkedFiles.add(filePath);

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find all href and src attributes (not inside onclick/script)
    let linkRegex = /(?:href|src)=["']([^"']+)["']/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        let link = match[1];
        // Skip external, anchors, mailto, javascript: and template literals
        if (link.startsWith('http') || 
            link.startsWith('mailto:') || 
            link.startsWith('#') || 
            link.startsWith('javascript:') ||
            link.startsWith('${') ||
            link.includes('${')) continue;
        
        let resolvedPath = path.resolve(path.dirname(filePath), link);
        resolvedPath = resolvedPath.split('?')[0].split('#')[0];

        if (!fs.existsSync(resolvedPath)) {
            let errorMsg = `BROKEN: '${link}'\n  in: ${path.relative(__dirname, filePath)}`;
            if (!checkedLinks.has(link + filePath)) {
                errors.push(errorMsg);
                checkedLinks.add(link + filePath);
            }
        }
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath);
        } else if (f.endsWith('.html')) {
            checkFile(dirPath);
        }
    });
}

console.log("Starting full site link and asset verification...\n");
walkDir(baseDir);

if (errors.length > 0) {
    console.log(`Found ${errors.length} broken links/assets:\n`);
    errors.forEach(e => console.log(e + '\n'));
} else {
    console.log("✅ All internal links and assets are valid!");
}
console.log(`\nChecked: ${checkedFiles.size} HTML pages`);
