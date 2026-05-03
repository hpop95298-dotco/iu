const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join('c:', 'Users', 'ASUS', '.gemini', 'antigravity', 'scratch', 'iu-repo', 'Home1', 'Pages');
const CSS_PATH_BASE = 'css/core/cursor.css';
const JS_PATH_BASE = 'js/core/interaction.js';

function getRelativePath(filePath) {
    const relative = path.relative(path.dirname(filePath), path.join(BASE_DIR, '..'));
    return relative.replace(/\\/g, '/') || '.';
}

function processFile(filePath) {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. Remove old inline cursor styles
    // Match the block containing "Custom Cursor Styles" comment
    const oldStyleRegex = /\/\* Custom Cursor Styles \*\/[\s\S]*?(?=(\n\s*<\/style>|\n\s*\/\*|$))/gi;
    content = content.replace(oldStyleRegex, '');

    // 2. Remove old cursor HTML divs
    const oldHtmlRegex = /<div class="cursor-dot"><\/div>\s*<div class="cursor-outline"><\/div>/gi;
    content = content.replace(oldHtmlRegex, '');

    // 3. Remove old cursor JS logic
    const oldJsRegex = /\/\/\s*Custom Cursor Logic[\s\S]*?(?=(\n\s*<\/script>|\n\s*\/\/|$))/gi;
    content = content.replace(oldJsRegex, '');
    
    // 4. Remove empty style/script tags that might be left behind
    content = content.replace(/<style>\s*<\/style>/gi, '');
    content = content.replace(/<script>\s*<\/script>/gi, '');

    const relPath = getRelativePath(filePath);
    const cssLink = `<link rel="stylesheet" href="${relPath}/${CSS_PATH_BASE}">`;
    const cursorHtml = `\n    <!-- Custom Magnetic Cursor -->\n    <div class="cursor-dot"></div>\n    <div class="cursor-outline"></div>\n`;
    const jsScript = `<script src="${relPath}/${JS_PATH_BASE}"></script>`;

    // Ensure links are present (not duplicates)
    if (!content.includes('cursor.css')) {
        content = content.replace('</head>', `    ${cssLink}\n</head>`);
    }

    if (!content.includes('cursor-dot')) {
        content = content.replace(/<body(.*?)>/i, (match) => `${match}${cursorHtml}`);
    }

    if (!content.includes('interaction.js')) {
        content = content.replace('</body>', `    ${jsScript}\n</body>`);
    }

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
console.log("Cleanup and Standardization Complete.");
