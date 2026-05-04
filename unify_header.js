const fs = require('fs');
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

function buildHeader(depth) {
    const prefix = '../'.repeat(depth);
    return `
    <header>
        <div class="nav-container">
            <div class="logo">
                <img src="${prefix}images/iu-logo.png" alt="IU Logo">
            </div>
            <div class="menu-icon" id="menuToggle"><i class="fas fa-bars"></i></div>
            <nav id="navMenu">
                <a href="${prefix}Pages/iu.html">Home</a>
                <a href="${prefix}Pages/iu-details.html">About FCIT</a>
                <a href="${prefix}Pages/programs.html">Programs</a>
                <a href="${prefix}Pages/regulations.html">Regulations</a>
                <a href="${prefix}Pages/events.html">Events</a>
                <a href="${prefix}Pages/login.html" class="btn-premium btn-accent">Student Portal <i class="fas fa-sign-in-alt"></i></a>
            </nav>
        </div>
    </header>`;
}

walkDir(baseDir, (filePath) => {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(baseDir, filePath);
    const depth = relativePath.split(path.sep).length - 1;

    // Search for header area (from <header> or what remains of it to </header>)
    const headerRegex = /<header>[\s\S]*?<\/header>/i;
    const brokenHeaderRegex = /<div class="nav-container">[\s\S]*?<\/header>/i;

    const newHeader = buildHeader(depth);

    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, newHeader);
    } else if (brokenHeaderRegex.test(content)) {
        content = content.replace(brokenHeaderRegex, newHeader);
    } else {
        // Fallback: insert after body start if no header found
        content = content.replace(/<body[\s\S]*?>/, (match) => match + newHeader);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  [HEADER UNIFIED] ${relativePath}`);
});

console.log('\n✅ Global Header Unification Complete.\n');
