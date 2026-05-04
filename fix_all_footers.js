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
const buildFooter = (dep) => `
<!-- ═══════════════ ROYAL GLASS UNIFIED FOOTER v5 ═══════════════ -->
<footer class="royal-footer" style="
    background: linear-gradient(180deg, rgba(18, 12, 36, 0.98) 0%, rgba(10, 6, 20, 1) 100%);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-top: 1px solid rgba(253, 185, 19, 0.2);
    padding: 85px 5% 35px;
    position: relative;
    overflow: hidden;
    margin-top: 110px;
    font-family: 'Outfit', 'Inter', sans-serif;
    color: #ffffff;
    box-shadow: 0 -20px 50px rgba(0,0,0,0.3);
">
    <!-- Animated Background Elements -->
    <div style="position: absolute; top: -150px; right: -150px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(253, 185, 19, 0.03) 0%, transparent 70%); pointer-events: none; animation: pulse 8s infinite alternate;"></div>
    <div style="position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(123, 63, 228, 0.03) 0%, transparent 70%); pointer-events: none; animation: pulse 6s infinite alternate-reverse;"></div>

    <div style="max-width: 1400px; margin: 0 auto; position: relative; z-index: 2;">
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 50px; margin-bottom: 60px;">
            
            <!-- Column 1: Brand Identity -->
            <div class="footer-brand-section">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                    <img src="${dep}images/iu-logo.png" alt="IU Logo" style="height: 50px; filter: drop-shadow(0 0 15px rgba(253, 185, 19, 0.3)); transition: transform 0.3s ease;">
                    <div>
                        <h2 style="margin: 0; font-size: 1.4rem; font-weight: 800; letter-spacing: 1px; color: #fdb913;">INNOVATION</h2>
                        <p style="margin: 0; font-size: 0.7rem; letter-spacing: 3px; color: rgba(255,255,255,0.5); font-weight: 600;">UNIVERSITY</p>
                    </div>
                </div>
                <p style="color: rgba(255,255,255,0.4); line-height: 1.8; font-size: 0.85rem; margin-bottom: 30px; max-width: 350px;">
                    Empowering the next generation of digital leaders through world-class education in Computing, Artificial Intelligence, and Advanced Engineering.
                </p>
                <div style="display: flex; gap: 12px;">
                    <span style="padding: 6px 15px; background: rgba(253, 185, 19, 0.05); border: 1px solid rgba(253, 185, 19, 0.2); border-radius: 50px; font-size: 0.65rem; color: #fdb913; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">QS Ranked #1</span>
                    <span style="padding: 6px 15px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; font-size: 0.65rem; color: rgba(255,255,255,0.7); font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">ABET Global</span>
                </div>
            </div>

            <!-- Column 2: Academic Links -->
            <div>
                <h4 style="color: #fdb913; font-size: 0.85rem; letter-spacing: 2px; font-weight: 900; margin: 0 0 30px; text-transform: uppercase; position: relative;">
                    Academic Hub
                    <span style="position: absolute; bottom: -10px; left: 0; width: 30px; height: 2px; background: #fdb913;"></span>
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 15px;"><a href="${dep}programs.html" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.color='#fdb913'; this.style.paddingLeft='8px'" onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.paddingLeft='0'"><i class="fas fa-chevron-right" style="font-size: 0.6rem; color: #fdb913;"></i> Degree Programs</a></li>
                    <li style="margin-bottom: 15px;"><a href="${dep}regulations.html" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.color='#fdb913'; this.style.paddingLeft='8px'" onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.paddingLeft='0'"><i class="fas fa-chevron-right" style="font-size: 0.6rem; color: #fdb913;"></i> Academic Bylaws</a></li>
                    <li style="margin-bottom: 15px;"><a href="${dep}events.html" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.color='#fdb913'; this.style.paddingLeft='8px'" onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.paddingLeft='0'"><i class="fas fa-chevron-right" style="font-size: 0.6rem; color: #fdb913;"></i> Research & Innovation</a></li>
                </ul>
            </div>

            <!-- Column 3: Portals -->
            <div>
                <h4 style="color: #fdb913; font-size: 0.85rem; letter-spacing: 2px; font-weight: 900; margin: 0 0 30px; text-transform: uppercase; position: relative;">
                    Digital Portals
                    <span style="position: absolute; bottom: -10px; left: 0; width: 30px; height: 2px; background: #fdb913;"></span>
                </h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 15px;"><a href="${dep}dashboard-STU.html" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.color='#fdb913'; this.style.paddingLeft='8px'" onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.paddingLeft='0'"><i class="fas fa-user-graduate" style="font-size: 0.7rem; color: #fdb913;"></i> Student Dashboard</a></li>
                    <li style="margin-bottom: 15px;"><a href="${dep}dashboard-admin.html" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.color='#fdb913'; this.style.paddingLeft='8px'" onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.paddingLeft='0'"><i class="fas fa-user-shield" style="font-size: 0.7rem; color: #fdb913;"></i> Admin Portal</a></li>
                    <li style="margin-bottom: 15px;"><a href="${dep}login.html" style="color: rgba(255,255,255,0.4); text-decoration: none; font-size: 0.9rem; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px;" onmouseover="this.style.color='#fdb913'; this.style.paddingLeft='8px'" onmouseout="this.style.color='rgba(255,255,255,0.4)'; this.style.paddingLeft='0'"><i class="fas fa-sign-in-alt" style="font-size: 0.7rem; color: #fdb913;"></i> Secure Login</a></li>
                </ul>
            </div>

            <!-- Column 4: Newsletter & Contact -->
            <div>
                <h4 style="color: #fdb913; font-size: 0.85rem; letter-spacing: 2px; font-weight: 900; margin: 0 0 30px; text-transform: uppercase; position: relative;">
                    Get Notified
                    <span style="position: absolute; bottom: -10px; left: 0; width: 30px; height: 2px; background: #fdb913;"></span>
                </h4>
                <p style="color: rgba(255,255,255,0.4); font-size: 0.8rem; margin-bottom: 20px;">Subscribe for academic updates and latest news.</p>
                <div style="display: flex; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 5px; margin-bottom: 25px;">
                    <input type="email" placeholder="Your Email" style="background: transparent; border: none; padding: 10px; color: white; flex: 1; outline: none; font-size: 0.8rem;">
                    <button style="background: #fdb913; border: none; color: #000; padding: 10px 20px; border-radius: 6px; font-weight: 900; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">JOIN</button>
                </div>
                <div style="display: flex; gap: 15px;">
                    <a href="#" style="color: rgba(255,255,255,0.4); font-size: 1.2rem; transition: color 0.3s;" onmouseover="this.style.color='#fdb913'" onmouseout="this.style.color='rgba(255,255,255,0.4)'"><i class="fab fa-facebook"></i></a>
                    <a href="#" style="color: rgba(255,255,255,0.4); font-size: 1.2rem; transition: color 0.3s;" onmouseover="this.style.color='#fdb913'" onmouseout="this.style.color='rgba(255,255,255,0.4)'"><i class="fab fa-linkedin"></i></a>
                    <a href="#" style="color: rgba(255,255,255,0.4); font-size: 1.2rem; transition: color 0.3s;" onmouseover="this.style.color='#fdb913'" onmouseout="this.style.color='rgba(255,255,255,0.4)'"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <p style="color: rgba(255,255,255,0.3); font-size: 0.75rem; margin: 0;">
                &copy; 2026 Innovation University. Designed for Engineering Excellence.
            </p>
            <div style="display: flex; align-items: center; gap: 30px;">
                <p style="color: rgba(255,255,255,0.3); font-size: 0.75rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-envelope" style="color: #fdb913;"></i> info@iu.edu.eg
                </p>
                <p style="color: rgba(255,255,255,0.3); font-size: 0.75rem; margin: 0; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-phone-alt" style="color: #fdb913;"></i> +20 100 000 0000
                </p>
                <div style="background: rgba(253, 185, 19, 0.1); padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(253, 185, 19, 0.2);">
                    <p style="color: #fdb913; font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; margin: 0; display: flex; align-items: center; gap: 6px;">
                        <i class="fas fa-lock"></i> AES-256 ENCRYPTED
                    </p>
                </div>
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

    const newFooter = buildFooter(dep);

    // Clean up any double footers or old versions first
    content = content.replace(/<!-- ═══════════════ UNIFIED FOOTER v3 ═══════════════ -->[\s\S]*?<!-- ═══════════════════════════════════════════════════ -->/g, '');
    content = content.replace(/<!-- ═══════════════ ROYAL GLASS UNIFIED FOOTER v4 ═══════════════ -->[\s\S]*?<!-- ═══════════════════════════════════════════════════ -->/g, '');
    content = content.replace(/<!-- ═══════════════ ROYAL GLASS UNIFIED FOOTER v5 ═══════════════ -->[\s\S]*?<!-- ═══════════════════════════════════════════════════ -->/g, '');

    // Strategy 1: Dashboard Integration (Inject inside <main>)
    // ONLY for true dashboard layouts with sidebars to keep footer to the right
    if (content.includes('dashboard-sidebar') || content.includes('sidebar-nav')) {
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
    console.log(`  [OK]  depth=${depthCount}  ${path.relative(baseDir, filePath)}`);
});

console.log(`\n✅ Done — ${processed} updated, ${skipped} skipped.\n`);
