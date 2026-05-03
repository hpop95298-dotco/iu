import { api } from './api.js';
import { healthAudit } from './health-check.js';

/**
 * IU Admin Dashboard Logic
 * Handles executive stats and system-wide monitoring
 */

// Expose health audit to global scope for debugging
window.runIUAudit = () => healthAudit.runFullAudit();

async function initializeAdminDashboard() {
    const preloader = document.getElementById('preloader');
    
    try {
        console.log("Admin Dashboard: Fetching executive stats...");

        // 1. Fetch Admin Data
        const adminData = await api.academic.getAdminStats();
        
        // 2. Update Global Stats
        updateGlobalStats(adminData);

        // 3. Update Recent Activity Table
        renderActivityTable(adminData.recentActivity);

        // 4. Initialize Charts
        renderAdminCharts(adminData);

    } catch (error) {
        console.error("Admin Dashboard Load Error:", error);
    } finally {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }
}

/**
 * Update the Top Stat Summary Cards
 */
function updateGlobalStats(data) {
    const statValues = document.querySelectorAll('.dashboard-grid-stats .glass-card div:last-child');
    if (statValues.length >= 3) {
        statValues[0].innerText = data.totalStudents.toLocaleString();
        statValues[1].innerText = data.totalCourses;
        // Optionally update the 3rd card if your data supports it (e.g., avg performance)
        if (data.avgPerformance) statValues[2].innerText = data.avgPerformance + '%';
    }
}

/**
 * Render the Recent Academic Activity Table with Luxury Styling
 */
function renderActivityTable(activities) {
    const tbody = document.getElementById('activityBody');
    if (!tbody) return;

    tbody.innerHTML = ''; 
    
    if (!activities || activities.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 40px; color: var(--iu-text-muted);">No recent academic activity in queue.</td></tr>`;
        return;
    }

    activities.forEach((act, index) => {
        const tr = document.createElement('tr');
        tr.style.cssText = `background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); transition: all 0.4s ease; cursor: default; animation: fadeInRight 0.5s ease forwards; animation-delay: ${index * 0.1}s; opacity: 0;`;
        
        const statusClass = act.status === 'Validated' ? 'status-ok' : 'status-warn';
        const borderCol = act.status === 'Validated' ? 'var(--iu-accent)' : '#fdb913';

        tr.innerHTML = `
            <td style="padding: 25px 30px; border-radius: 20px 0 0 20px; border-left: 5px solid ${borderCol};">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--iu-accent);">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <span style="font-weight: 800; color: #fff; font-size: 1rem;">${act.name}</span>
                </div>
            </td>
            <td style="color: rgba(255,255,255,0.8); font-weight: 600; font-size: 1rem;">${act.module}</td>
            <td style="color: var(--iu-text-muted); font-weight: 600;">${act.date}</td>
            <td style="text-align: right; padding-right: 30px; border-radius: 0 20px 20px 0;">
                <span class="status-badge ${statusClass}" style="font-size: 0.8rem; padding: 6px 18px; border-radius: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">
                    ${act.status}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Initialize Administrative Charts with Premium Visuals
 */
function renderAdminCharts(data) {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = 'rgba(255,255,255,0.5)';
    Chart.defaults.font.family = "'Outfit', sans-serif";

    // 1. Strategic Growth (Line)
    const ctxL = document.getElementById('lineChart')?.getContext('2d');
    if (ctxL) {
        const gradient = ctxL.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(var(--iu-accent-rgb), 0.3)');
        gradient.addColorStop(1, 'rgba(var(--iu-accent-rgb), 0)');

        new Chart(ctxL, {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Academic Submissions',
                    data: [450, 600, 800, 500, 900, 1100, 700],
                    borderColor: '#522d80',
                    borderWidth: 4,
                    pointBackgroundColor: '#fdb913',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        padding: 15,
                        displayColors: false,
                        borderRadius: 12
                    }
                },
                scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    }

    // 2. Faculty Distribution (Doughnut)
    const ctxD = document.getElementById('doughnutChart')?.getContext('2d');
    if (ctxD) {
        new Chart(ctxD, {
            type: 'doughnut',
            data: {
                labels: ['CS & IT', 'Business', 'Design'],
                datasets: [{
                    data: [45, 25, 30],
                    backgroundColor: ['#fdb913', '#522d80', '#ffffff'],
                    hoverOffset: 15,
                    borderWidth: 0
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        position: 'bottom', 
                        labels: { color: 'rgba(255,255,255,0.8)', padding: 30, font: { size: 12, weight: 'bold' }, usePointStyle: true } 
                    } 
                },
                cutout: '75%' 
            }
        });
    }
}

// Navbar Toggle logic for Admin
function initNavbar() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
}

// Initialize on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initializeAdminDashboard();
});
