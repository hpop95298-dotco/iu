const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'Home1', 'Pages', 'dashboard-admin.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');

// Update admin dashboard
adminHtml = adminHtml.replace(
    /<style>[\s\S]*?<\/style>/,
    '<link rel="stylesheet" href="../css/dashboard.css">'
);
adminHtml = adminHtml.replace(/class="grid-stats"/g, 'class="dashboard-grid-stats"');
adminHtml = adminHtml.replace(/class="grid-2"/g, 'class="dashboard-grid-2"');
adminHtml = adminHtml.replace(/<h3 style=".*?">/g, '<h3 class="chart-card-title">');

fs.writeFileSync(adminPath, adminHtml);
console.log("Updated dashboard-admin.html");

const stuPath = path.join(__dirname, 'Home1', 'Pages', 'dashboard-STU.html');
let stuHtml = fs.readFileSync(stuPath, 'utf8');

// Inject dashboard.css
stuHtml = stuHtml.replace(
    /<script src="https:\/\/cdn.jsdelivr.net\/npm\/chart.js"><\/script>/,
    '<link rel="stylesheet" href="../css/dashboard.css">\n  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>'
);

// Replace inline layout classes
stuHtml = stuHtml.replace(/<div class="layout" style="display: flex; min-height: 100vh;">/, '<div class="dashboard-layout">');

stuHtml = stuHtml.replace(
    /<aside class="glass-card" id="sidebar" style=".*?">/,
    '<aside class="glass-card dashboard-sidebar" id="sidebar">'
);

stuHtml = stuHtml.replace(/<div style="text-align: center; margin-bottom: 40px;">/, '<div class="logo-container">');
stuHtml = stuHtml.replace(/<h2 style=".*?">STUDENT PORTAL<\/h2>/, '<h2>STUDENT PORTAL</h2>');
stuHtml = stuHtml.replace(/<img src="\.\.\/images\/iu-logo\.png" alt="IU Logo" style=".*?">/, '<img src="../images/iu-logo.png" alt="IU Logo">');
stuHtml = stuHtml.replace(/<nav style=".*?">/, '<nav class="sidebar-nav">');

// Nav items
stuHtml = stuHtml.replace(/style="display: flex; align-items: center; gap: 15px; padding: 12px 20px; border-radius: 12px;.*?"/g, '');

// Main content
stuHtml = stuHtml.replace(
    /<main class="main-content" style=".*?">/,
    '<main class="main-content dashboard-main">'
);

// Topbar
stuHtml = stuHtml.replace(
    /<div class="topbar" style=".*?">/,
    '<div class="dashboard-topbar">'
);

stuHtml = stuHtml.replace(/<div id="welcome-msg">/, '<div class="welcome-text">');
stuHtml = stuHtml.replace(/<h2 style=".*?">Good Morning, <span style=".*?">Student<\/span><\/h2>/, '<h2>Good Morning, <span style="color: var(--iu-accent);">Student</span></h2>');
stuHtml = stuHtml.replace(/<p style=".*?">/, '<p>');

stuHtml = stuHtml.replace(/<div class="user-profile" style=".*?">/, '<div class="user-profile">');
stuHtml = stuHtml.replace(/<div style="text-align: right;">/, '<div class="user-info">');
stuHtml = stuHtml.replace(/<div style="font-weight: 700; font-size: 0.95rem;">/, '<div class="user-name">');
stuHtml = stuHtml.replace(/<div style="font-size: 0.75rem; color: var(--iu-accent);">/, '<div class="user-role">');
stuHtml = stuHtml.replace(/<img src="\.\.\/images\/Hema\.jpeg" alt="Student" style=".*?">/, '<img src="../images/Hema.jpeg" alt="Student">');

// Grid Stats
stuHtml = stuHtml.replace(
    /<section class="grid-stats" style=".*?">/,
    '<section class="dashboard-grid-stats">'
);

// Grids
stuHtml = stuHtml.replace(/<div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">/g, '<div class="dashboard-grid-2">');
stuHtml = stuHtml.replace(/<div class="col-left" style="display: flex; flex-direction: column; gap: 30px;">/g, '<div class="col-left" style="display: flex; flex-direction: column; gap: 30px;">'); // kept flex column for these wrappers
stuHtml = stuHtml.replace(/<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px; margin-top: 30px;">/g, '<div class="dashboard-grid-2-reverse">');

// Chart card titles
stuHtml = stuHtml.replace(/<h3 style="color: var\(--iu-accent\); margin-bottom: 25px; display: flex; align-items: center; gap: 12px;">/g, '<h3 class="chart-card-title">');

// Progress bar logic
stuHtml = stuHtml.replace(/<div style="background: rgba\(255,255,255,0.1\); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 25px;">/, '<div class="progress-bg" style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 25px;">');
stuHtml = stuHtml.replace(/<div style="width: 65%; height: 100%; background: linear-gradient\(90deg, var\(--iu-primary\), var\(--iu-accent\)\); box-shadow: 0 0 15px var\(--iu-accent-glow\);">/, '<div class="progress-bar" style="width: 65%; height: 100%; background: linear-gradient(90deg, var(--iu-primary), var(--iu-accent)); box-shadow: 0 0 15px var(--iu-accent-glow);">');


fs.writeFileSync(stuPath, stuHtml);
console.log("Updated dashboard-STU.html");
