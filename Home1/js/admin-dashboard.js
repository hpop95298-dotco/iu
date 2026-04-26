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
        statValues[2].innerText = data.activeSubmissions.toLocaleString();
    }
}

/**
 * Render the Recent Academic Activity Table
 */
function renderActivityTable(activities) {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    tbody.innerHTML = ''; // Clear hardcoded content
    
    if (!activities || activities.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No recent activity recorded.</td></tr>`;
        return;
    }

    activities.forEach(act => {
        const tr = document.createElement('tr');
        const statusClass = act.status === 'Validated' ? 'status-completed' : 'status-pending';
        tr.innerHTML = `
            <td>${act.name}</td>
            <td>${act.module}</td>
            <td>${act.date}</td>
            <td><span class="status-pill ${statusClass}">${act.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Initialize Administrative Charts
 */
function renderAdminCharts(data) {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = 'rgba(255,255,255,0.7)';
    Chart.defaults.font.family = 'Inter';

    // 1. Strategic Growth (Line) - Visualizing Submissions
    const ctxL = document.getElementById('lineChart')?.getContext('2d');
    if (ctxL) {
        new Chart(ctxL, {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Submissions',
                    data: [450, 600, 800, 500, 900, 1100, 700],
                    borderColor: '#fdb913',
                    backgroundColor: 'rgba(253, 185, 19, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } } 
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
                    borderWidth: 0
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                    legend: { 
                        position: 'bottom', 
                        labels: { color: '#fff', padding: 20 } 
                    } 
                },
                cutout: '70%' 
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
