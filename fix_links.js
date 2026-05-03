const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'Home1', 'Pages');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

walkDir(baseDir, (filePath) => {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix broken links
    content = content.replace(/href="courses\.html"/g, 'href="programs.html"');
    content = content.replace(/href='courses\.html'/g, "href='programs.html'");
    
    // Also fix any links to "courses" without .html if they exist
    content = content.replace(/href="courses"/g, 'href="programs.html"');

    if (content !== original) {
        console.log(`Fixing links in: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log("Link fixing complete.");
