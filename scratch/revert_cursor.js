const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join('c:', 'Users', 'ASUS', '.gemini', 'antigravity', 'scratch', 'iu-repo', 'Home1', 'Pages');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the CSS link
    const cssRegex = /<link\s+rel="stylesheet"\s+href="[^"]*css\/core\/cursor\.css">\s*/gi;
    content = content.replace(cssRegex, '');
    
    // Remove the HTML elements and comments
    const htmlRegex1 = /<!-- Custom Magnetic Cursor -->\s*/gi;
    const htmlRegex2 = /<div class="cursor-dot"><\/div>\s*/gi;
    const htmlRegex3 = /<div class="cursor-outline"><\/div>\s*/gi;
    content = content.replace(htmlRegex1, '');
    content = content.replace(htmlRegex2, '');
    content = content.replace(htmlRegex3, '');

    // Remove the JS script link
    const jsRegex = /<script\s+src="[^"]*js\/core\/interaction\.js"><\/script>\s*/gi;
    content = content.replace(jsRegex, '');

    fs.writeFileSync(filePath, content);
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    });
}

walk(BASE_DIR);
console.log("Cursor code removed from all HTML pages.");
