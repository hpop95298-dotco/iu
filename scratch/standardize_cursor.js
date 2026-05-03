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
    
    // 1. Remove old inline cursor styles/scripts if they exist
    // This is a bit risky with regex but I'll try to match the common pattern
    const oldStyleRegex = /<style>\s*\/\* Custom Cursor Styles \*\/[\s\S]*?<\/style>/gi;
    const oldHtmlRegex = /<div class="cursor-dot"><\/div>\s*<div class="cursor-outline"><\/div>/gi;
    const oldJsRegex = /\/\/ Custom Cursor Logic[\s\S]*?(?=(<\/script>|$))/gi;
    
    // Also match the specific script block if it's separate
    const oldScriptBlockRegex = /<script>\s*\/\/ Custom Cursor Logic[\s\S]*?<\/script>/gi;

    content = content.replace(oldStyleRegex, '');
    content = content.replace(oldHtmlRegex, '');
    content = content.replace(oldScriptBlockRegex, '');
    
    // Check if it already has the new links (avoid duplicates)
    if (content.includes('cursor.css') || content.includes('cursor-dot')) {
        // If it has it but I already removed the old ones, I might need to re-inject the new ones
        // Actually if it has 'cursor-dot' it probably has the inline stuff.
    }

    const relPath = getRelativePath(filePath);
    const cssLink = `<link rel="stylesheet" href="${relPath}/${CSS_PATH_BASE}">`;
    const cursorHtml = `\n    <!-- Custom Magnetic Cursor -->\n    <div class="cursor-dot"></div>\n    <div class="cursor-outline"></div>\n`;
    const jsScript = `<script src="${relPath}/${JS_PATH_BASE}"></script>`;

    // Inject CSS before </head>
    if (!content.includes('cursor.css')) {
        content = content.replace('</head>', `    ${cssLink}\n</head>`);
    }

    // Inject HTML after <body>
    if (!content.includes('cursor-dot')) {
        content = content.replace(/<body(.*?)>/i, (match) => `${match}${cursorHtml}`);
    }

    // Inject JS before </body>
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
console.log("Standardization Complete.");
