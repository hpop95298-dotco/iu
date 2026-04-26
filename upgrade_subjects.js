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

const headerTemplate = (depthStr) => `    <header>
        <div class="nav-container">
            <div class="logo">
                <img src="${depthStr}images/iu-logo.png" alt="IU Logo">
                <span>IU | Knowledge Base</span>
            </div>
            <div class="menu-icon" id="menuToggle"><i class="fas fa-bars"></i></div>
            <nav id="navMenu">
`;

walkDir(baseDir, (filePath) => {
    if (!filePath.endsWith('.html')) return;
    
    // We only care about deep subject pages, which usually have a path like:
    // level3-term1/subjects3/... or levels-term1/subjects/...
    if (!filePath.includes('subjects')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already modernized
    if (content.includes('core/tokens.css')) return;

    console.log(`Modernizing ${filePath}`);

    // Determine depth relative to Home1
    let relativeToHome1 = path.relative(path.join(__dirname, 'Home1'), path.dirname(filePath));
    let depthCount = relativeToHome1.split(path.sep).length;
    let depthStr = '../'.repeat(depthCount);

    // 1. Remove style block entirely
    content = content.replace(/<style>[\s\S]*?<\/style>/, '');

    // 2. Inject CSS links before </head>
    const cssLinks = `
    <!-- Design System Core -->
    <link rel="stylesheet" href="${depthStr}css/core/tokens.css">
    <link rel="stylesheet" href="${depthStr}css/core/base.css">
    <link rel="stylesheet" href="${depthStr}css/core/layout.css">
    <link rel="stylesheet" href="${depthStr}css/core/components.css">
    <link rel="stylesheet" href="${depthStr}css/core/animations.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="${depthStr}css/subject.css">
    `;
    content = content.replace('</head>', cssLinks + '\n</head>');

    // 3. Update body
    content = content.replace(/<body>/g, '<body class="faculty-theme">\n    <div id="preloader"><div class="spinner"></div></div>');

    // 4. Update Header structure
    // Extract the nav items to keep links
    let navLinksMatch = content.match(/<nav>([\s\S]*?)<\/nav>/);
    if (navLinksMatch) {
        let navLinks = navLinksMatch[1];
        let newHeader = headerTemplate(depthStr) + navLinks + `\n            </nav>\n        </div>\n    </header>`;
        content = content.replace(/<header>[\s\S]*?<\/header>/, newHeader);
    }

    // 5. Update specific classes
    content = content.replace(/class="container"/g, 'class="container-subject"');
    content = content.replace(/class="sidebar"/g, 'class="subject-sidebar"');
    content = content.replace(/class="content"/g, 'class="subject-content"');
    content = content.replace(/class="content"/g, 'class="subject-content"'); // Just in case
    content = content.replace(/id="content"/g, 'id="content"'); 

    // Add script for menu and preloader before </body>
    const scripts = `
    <script>
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        if(menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        }
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            if(preloader) {
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => preloader.style.display = 'none', 500);
                }, 800);
            }
        });
    </script>
`;
    content = content.replace('</body>', scripts + '</body>');

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Modernization of deep subject pages complete.");
