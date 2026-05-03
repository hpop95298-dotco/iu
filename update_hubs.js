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
    const fileName = path.basename(filePath);
    
    // Target only listing pages
    if (!(fileName.includes('pdf') || fileName.includes('video') || fileName.includes('quizzes'))) return;
    
    // Skip sub-pages (actual content pages)
    if (filePath.includes('subjects') || filePath.includes('Videos') || filePath.includes('quizzes/')) return;

    console.log(`Processing Hub Page: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');

    // Determine depth for CSS path
    let relativeToHome1 = path.relative(path.join(__dirname, 'Home1'), path.dirname(filePath));
    let depthCount = relativeToHome1.split(path.sep).length;
    let depthStr = '../'.repeat(depthCount);

    // 1. Inject or Update Hub CSS
    const hubLink = `<link rel="stylesheet" href="${depthStr}css/hub-pages.css">`;
    if (content.includes('hub-pages.css')) {
        content = content.replace(/<link rel="stylesheet" href="[^"]*hub-pages\.css">/, hubLink);
    } else {
        content = content.replace('</head>', `    ${hubLink}\n</head>`);
    }

    // 2. Remove old internal styles related to cards
    content = content.replace(/<style>[\s\S]*?<\/style>/, '');

    // 3. Structural replacements
    content = content.replace(/library-grid/g, 'hub-grid');
    content = content.replace(/video-hub-grid/g, 'hub-grid');
    content = content.replace(/grid-3/g, 'hub-grid');
    
    content = content.replace(/course-card/g, 'hub-card');
    content = content.replace(/video-card/g, 'hub-card');
    content = content.replace(/quiz-card/g, 'hub-card');
    
    content = content.replace(/course-icon/g, 'hub-icon');
    content = content.replace(/video-thumbnail-placeholder/g, 'hub-icon');
    content = content.replace(/quiz-icon/g, 'hub-icon');

    // 4. Cleanup inline styles on headers/paragraphs that might interfere
    content = content.replace(/style="text-align: center; margin-bottom: 40px; color: var\(--iu-accent\); font-size: 3rem;"/g, 'style="text-align: center; margin-bottom: 20px; color: var(--iu-accent); font-size: 3rem;"');

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Hub pages standardization complete.");
