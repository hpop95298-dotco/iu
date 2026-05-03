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
    <footer class="main-footer" style="background: linear-gradient(to top, #050308, #0a0612); border-top: 1px solid rgba(255,255,255,0.1); padding: 40px 5% 20px; position: relative; overflow: hidden; margin-top: 50px;">
        <div style="position: absolute; bottom: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 150px; background: radial-gradient(circle, rgba(253, 185, 19, 0.05) 0%, transparent 70%); pointer-events: none;"></div>

        <div class="footer-grid" style="max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.5fr; gap: 30px; position: relative; z-index: 1;">
            <div class="footer-col">
                <div class="footer-brand">
                    <img src="${depthStr}images/iu-logo.png" alt="IU Logo" style="height: 32px; margin-bottom: 15px; filter: drop-shadow(0 0 8px #fdb913);">
                    <p style="color: rgba(255,255,255,0.4); line-height: 1.5; font-size: 0.8rem; margin-bottom: 15px; max-width: 280px;">
                        Innovation University's FCIT is a hub for digital pioneers, fostering research and engineering excellence.
                    </p>
                </div>
            </div>

            <div class="footer-col">
                <h4 style="color: #fdb913; font-size: 0.8rem; margin-bottom: 18px; font-family: 'Outfit', sans-serif; letter-spacing: 1.5px; font-weight: 900;">ACADEMIC</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 8px;"><a href="${depthStr}programs.html" style="color: rgba(255,255,255,0.35); text-decoration: none; font-size: 0.8rem; transition: color 0.3s; display: flex; align-items: center; gap: 8px;"><i class="fas fa-chevron-right" style="font-size: 0.55rem; opacity: 0.4;"></i> Study Plans</a></li>
                    <li style="margin-bottom: 8px;"><a href="${depthStr}regulations.html" style="color: rgba(255,255,255,0.35); text-decoration: none; font-size: 0.8rem; transition: color 0.3s; display: flex; align-items: center; gap: 8px;"><i class="fas fa-chevron-right" style="font-size: 0.55rem; opacity: 0.4;"></i> Bylaws</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4 style="color: #fdb913; font-size: 0.8rem; margin-bottom: 18px; font-family: 'Outfit', sans-serif; letter-spacing: 1.5px; font-weight: 900;">QUICK LINKS</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 8px;"><a href="${depthStr}dashboard-admin.html" style="color: rgba(255,255,255,0.35); text-decoration: none; font-size: 0.8rem; transition: color 0.3s; display: flex; align-items: center; gap: 8px;"><i class="fas fa-chevron-right" style="font-size: 0.55rem; opacity: 0.4;"></i> Admin</a></li>
                    <li style="margin-bottom: 8px;"><a href="${depthStr}iu.html" style="color: rgba(255,255,255,0.35); text-decoration: none; font-size: 0.8rem; transition: color 0.3s; display: flex; align-items: center; gap: 8px;"><i class="fas fa-chevron-right" style="font-size: 0.55rem; opacity: 0.4;"></i> Home Portal</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4 style="color: #fdb913; font-size: 0.8rem; margin-bottom: 18px; font-family: 'Outfit', sans-serif; letter-spacing: 1.5px; font-weight: 900;">CONNECT</h4>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <a href="#" style="width: 30px; height: 30px; background: rgba(255,255,255,0.02); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fdb913; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.05);"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" style="width: 30px; height: 30px; background: rgba(255,255,255,0.02); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fdb913; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.05);"><i class="fab fa-github"></i></a>
                </div>
                <p style="color: rgba(255,255,255,0.3); font-size: 0.7rem; font-weight: 800; margin: 0;"><i class="fas fa-envelope" style="margin-right: 8px; color: #fdb913;"></i> info@iu.edu.eg</p>
            </div>
        </div>

        <div style="max-width: 1400px; margin: 30px auto 0; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; color: rgba(255,255,255,0.25); font-size: 0.7rem; position: relative; z-index: 1;">
            <p>&copy; 2026 Innovation University.</p>
            <p style="color: #fdb913; font-weight: 700; font-size: 0.65rem; letter-spacing: 0.5px;">SECURED BY AES-256</p>
        </div>
    </footer>
`;

walkDir(baseDir, (filePath) => {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Determine depth relative to Pages
    let relativeToPages = path.relative(baseDir, path.dirname(filePath));
    let depthCount = relativeToPages === '' ? 0 : relativeToPages.split(path.sep).length;
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
