const fs = require('fs');
const path = require('path');

const rootDir = process.argv[2] || '.';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const logoText = `<span style="background: linear-gradient(90deg, #fdb913, #fff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 900; margin-left: 15px; font-family: 'Outfit', sans-serif; font-size: 1.8rem; letter-spacing: 2px;">IU-FCIT</span>`;

walk(rootDir, (filePath) => {
    if (filePath.endsWith('.html')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Regex to find the logo div and check if it already has the span
        // We look for the closing </div> of the logo class
        const logoRegex = /<div class="logo">([\s\S]*?)<\/div>/g;
        
        let modified = false;
        let newContent = content.replace(logoRegex, (match, inner) => {
            if (inner.includes('IU-FCIT')) {
                return match; // Already updated
            }
            modified = true;
            // Append the span before the closing div
            return `<div class="logo">${inner}${logoText}</div>`;
        });

        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
