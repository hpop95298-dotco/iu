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

const footerTemplate = (depthStr) => `
    <footer class="main-footer">
        <div class="footer-grid">
            <div class="footer-col">
                <div class="footer-brand">
                    <img src="${depthStr}images/iu-logo.png" alt="IU Logo" style="height: 35px; margin-bottom: 12px;">
                    <p style="color: rgba(255,255,255,0.6); line-height: 1.4; font-size: 0.85rem;">
                        Innovation University is a world-class institution dedicated to shaping the future of technology through academic excellence and practical innovation.
                    </p>
                </div>
            </div>
            <div class="footer-col">
                <h4>University</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="${depthStr}Pages/iu.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">Home Portal</a></li>
                    <li><a href="${depthStr}Pages/iu-details.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">About FCIT</a></li>
                    <li><a href="${depthStr}Pages/programs.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">Academic Programs</a></li>
                    <li><a href="${depthStr}Pages/regulations.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">Bylaws & Rules</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Student Life</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="${depthStr}Pages/login.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">Student Portal</a></li>
                    <li><a href="${depthStr}Pages/events.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">Campus Events</a></li>
                    <li><a href="${depthStr}Pages/schedule.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">Academic Calendar</a></li>
                    <li><a href="${depthStr}Pages/profile.html" style="color: rgba(255,255,255,0.7); text-decoration: none; margin-bottom: 6px; display: block; font-size: 0.85rem;">User Profile</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Connect</h4>
                <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                    <a href="#" style="color: var(--iu-accent); font-size: 1.2rem;"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" style="color: var(--iu-accent); font-size: 1.2rem;"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" style="color: var(--iu-accent); font-size: 1.2rem;"><i class="fab fa-github"></i></a>
                </div>
                <p style="color: rgba(255,255,255,0.5); font-size: 0.75rem;"><i class="fas fa-envelope" style="margin-right: 8px;"></i> info@iu.edu.eg</p>
            </div>
        </div>
        <div style="max-width: 1600px; margin: 30px auto 0; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; color: rgba(255,255,255,0.4); font-size: 0.75rem;">
            <p>&copy; 2026 Innovation University | Faculty of Computers & IT. Crafted for Excellence.</p>
        </div>
    </footer>
`;

walkDir(baseDir, (filePath) => {
    if (!filePath.endsWith('.html')) return;

    console.log(`Unifying footer for: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');

    // Determine depth relative to Home1
    let relativeToHome1 = path.relative(path.join(__dirname, 'Home1'), path.dirname(filePath));
    let depthCount = relativeToHome1.split(path.sep).filter(p => p !== '').length;
    let depthStr = '../'.repeat(depthCount);

    const newFooter = footerTemplate(depthStr);

    // Replace existing footer if any
    if (content.includes('<footer')) {
        content = content.replace(/<footer[\s\S]*?<\/footer>/, newFooter);
    } else {
        // Append before </body> or inside main-content if dashboard
        if (content.includes('class="dashboard-main"')) {
            content = content.replace('</main>', newFooter + '\n</main>');
        } else {
            content = content.replace('</body>', newFooter + '\n</body>');
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log("Footer unification complete.");
