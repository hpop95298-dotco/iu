/**
 * fix_all_footers.js
 * 
 * سكريبت شامل لتوحيد التذييل (Footer) في جميع صفحات جامعة الابتكار.
 * يحسب المسار النسبي الصحيح لكل ملف HTML ويضمن تطابق التصميم في كل مكان.
 */

const fs   = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'Home1', 'Pages');

// ─── Recursive directory walker ────────────────────────────────────────────
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

// ─── Footer HTML template ──────────────────────────────────────────────────
const buildFooter = (dep, isDashboard = false) => `
<!-- ═══════════════ ROYAL GLASS UNIFIED FOOTER v6 ═══════════════ -->
<footer class="royal-footer" style="
    background: ${isDashboard ? 'rgba(255, 255, 255, 0.03)' : 'linear-gradient(180deg, rgba(18, 12, 36, 0.98) 0%, rgba(10, 6, 20, 1) 100%)'};
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-top: 1px solid rgba(253, 185, 19, 0.2);
    padding: ${isDashboard ? '60px 40px 30px' : '85px 5% 35px'};
    position: relative;
    overflow: hidden;
    margin-top: ${isDashboard ? '60px' : '110px'};
    border-radius: ${isDashboard ? '24px' : '0'};
    ${isDashboard ? 'border: 1px solid rgba(255,255,255,0.08);' : ''}
    font-family: 'Outfit', 'Inter', sans-serif;
    color: #ffffff;
    box-shadow: 0 -20px 50px rgba(0,0,0,0.3);
    ${isDashboard ? 'margin-bottom: 20px;' : ''}
">
    <!-- Animated Background Elements -->
    <div style="position: absolute; top: -150px; right: -150px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(253, 185, 19, 0.03) 0%, transparent 70%); pointer-events: none; animation: pulse 8s infinite alternate;"></div>
    <div style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(123, 63, 228, 0.03) 0%, transparent 70%); pointer-events: none; animation: pulse 6s infinite alternate-reverse;"></div>

    <div style="${isDashboard ? '' : 'max-width: 1400px; margin: 0 auto;'} position: relative; z-index: 2;">
        <div style="display: grid; grid-template-columns: ${isDashboard ? '1.5fr 1fr 1fr 1.5fr' : '2fr 1fr 1fr 1.5fr'}; gap: ${isDashboard ? '30px' : '50px'}; margin-bottom: ${isDashboard ? '30px' : '60px'};">
            
            <!-- Column 1: Brand Identity -->
            <div class="footer-brand-section">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                    <img src="${dep}images/iu-logo.png" alt="IU Logo" style="height: ${isDashboard ? '40px' : '50px'}; filter: drop-shadow(0 0 15px rgba(253, 185, 19, 0.3)); transition: transform 0.3s ease;" onerror="this.src='https://via.placeholder.com/50x50?text=IU'">
                    <div>
                        <h2 style="margin: 0; font-size: ${isDashboard ? '1.1rem' : '1.4rem'}; font-weight: 800; letter-spacing: 1px; color: #fdb913;">INNOVATION</h2>
                        <p style="margin: 0; font-size: 0.6rem; letter-spacing: 2px; color: rgba(255,255,255,0.5); font-weight: 600;">UNIVERSITY</p>
                    </div>
                </div>
                <p style="color: rgba(255,255,255,0.4); line-height: 1.6; font-size: 0.8rem; margin-bottom: 20px; max-width: 300px;">
                    Empowering the next generation of digital leaders.
                </p>
            </div>

            <!-- Column 2: Academic Links -->
            <div>
                <h4 style="color: #fdb913; font-size: 0.8rem; letter-spacing: 1px; font-weight: 900; margin: 0 0 20px; text-transform: uppercase;">Hub</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem;">
                    <li style="margin-bottom: 10px;"><a href="${dep}programs.html" style="color: rgba(255,255,255,0.4);">Programs</a></li>
                    <li style="margin-bottom: 10px;"><a href="${dep}regulations.html" style="color: rgba(255,255,255,0.4);">Regulations</a></li>
                </ul>
            </div>

            <!-- Column 3: Portals -->
            <div>
                <h4 style="color: #fdb913; font-size: 0.8rem; letter-spacing: 1px; font-weight: 900; margin: 0 0 20px; text-transform: uppercase;">Portals</h4>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.85rem;">
                    <li style="margin-bottom: 10px;"><a href="${dep}dashboard-STU.html" style="color: rgba(255,255,255,0.4);">Student</a></li>
                    <li style="margin-bottom: 10px;"><a href="${dep}login.html" style="color: rgba(255,255,255,0.4);">Secure Login</a></li>
                </ul>
            </div>

            <!-- Column 4: Contact -->
            <div>
                <h4 style="color: #fdb913; font-size: 0.8rem; letter-spacing: 1px; font-weight: 900; margin: 0 0 20px; text-transform: uppercase;">Connect</h4>
                <div style="display: flex; gap: 15px;">
                    <a href="#" style="color: rgba(255,255,255,0.4);"><i class="fab fa-facebook"></i></a>
                    <a href="#" style="color: rgba(255,255,255,0.4);"><i class="fab fa-linkedin"></i></a>
                    <a href="#" style="color: rgba(255,255,255,0.4);"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
            <p style="color: rgba(255,255,255,0.2); margin: 0;">&copy; 2026 Innovation University.</p>
            <div style="background: rgba(253, 185, 19, 0.1); padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(253, 185, 19, 0.2);">
                <p style="color: #fdb913; font-size: 0.6rem; font-weight: 800; margin: 0;">AES-256 ENCRYPTED</p>
            </div>
        </div>
    </div>
    
    <style>
        @keyframes pulse {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.6; transform: scale(1.1); }
        }
    </style>
</footer>
<!-- ═══════════════════════════════════════════════════ -->
`;

// ─── Main: process all HTML files ─────────────────────────────────────────
let processed = 0;
let skipped   = 0;

walkDir(baseDir, (filePath) => {
    if (!filePath.endsWith('.html')) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Calculate depth relative to Pages/
    const relativeToPages = path.relative(baseDir, path.dirname(filePath));
    const depthCount      = relativeToPages === '' ? 0 : relativeToPages.split(path.sep).filter(Boolean).length;
    
    // Prefix to get out of Pages/ PLUS depth prefix
    const dep = '../' + '../'.repeat(depthCount);

    // Determine if it's a dashboard
    const isDashboard = content.includes('dashboard-sidebar') || content.includes('sidebar-nav');
    
    const newFooter = buildFooter(dep, isDashboard);

    // Clean up any double footers or old versions first
    content = content.replace(/<!-- ═══════════════ UNIFIED FOOTER v3 ═══════════════ -->[\s\S]*?<!-- ═══════════════════════════════════════════════════ -->/g, '');
    content = content.replace(/<!-- ═══════════════ ROYAL GLASS UNIFIED FOOTER v4 ═══════════════ -->[\s\S]*?<!-- ═══════════════════════════════════════════════════ -->/g, '');
    content = content.replace(/<!-- ═══════════════ ROYAL GLASS UNIFIED FOOTER v5 ═══════════════ -->[\s\S]*?<!-- ═══════════════════════════════════════════════════ -->/g, '');
    content = content.replace(/<!-- ═══════════════ ROYAL GLASS UNIFIED FOOTER v6 ═══════════════ -->[\s\S]*?<!-- ═══════════════════════════════════════════════════ -->/g, '');

    // Strategy 1: Dashboard Integration (Inject inside <main>)
    if (isDashboard) {
        if (content.includes('</main>')) {
            content = content.replace('</main>', newFooter + '\n</main>');
            processed++;
        } else {
            content = content + '\n' + newFooter;
            processed++;
        }
    }
    // Strategy 2: replace existing <footer ...>...</footer>
    else if (/<footer[\s\S]*?<\/footer>/i.test(content)) {
        content = content.replace(/<footer[\s\S]*?<\/footer>/i, newFooter.trim());
        processed++;
    }
    // Strategy 3: insert before </body>
    else if (content.includes('</body>')) {
        content = content.replace('</body>', newFooter + '\n</body>');
        processed++;
    } else {
        console.warn('  [SKIP] no insertion point found:', path.relative(baseDir, filePath));
        skipped++;
        return;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  [OK]  depth=${depthCount}  ${isDashboard ? '[DASH]' : '[PAGE]'}  ${path.relative(baseDir, filePath)}`);
});

console.log(`\n✅ Done — ${processed} updated, ${skipped} skipped.\n`);
