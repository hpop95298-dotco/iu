import { api } from './api.js';

/**
 * IU Student Dashboard Logic
 * Handles real-time data fetching and UI orchestration
 */

async function initializeDashboard() {
    const preloader = document.getElementById('preloader');
    
    try {
        // In a real scenario, this would come from the session
        // For now, we use the mock user ID from the audit
        const userId = "25030410"; 
        
        console.log("Dashboard: Initializing for user", userId);

        // 1. Fetch Student & AI Data
        const [dashboardData, aiData] = await Promise.all([
            api.academic.getStudentDashboard(userId),
            api.academic.getAIInsights(userId)
        ]);
        
        // 2. Update Main Stats
        updateStats(dashboardData);

        // 3. Update AI Insights Section
        renderAI(aiData);

        // 4. Update "Continue Learning"
        updateLearningSection(dashboardData);

        // 5. Update Assignments
        renderAssignments(dashboardData.assignments);

        // 6. Initialize Charts
        renderCharts(dashboardData);

    } catch (error) {
        console.error("Dashboard Load Error:", error);
    } finally {
        // Hide preloader with a smooth transition
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }
}

/**
 * Update the Top Stat Cards
 */
function updateStats(data) {
    const cards = document.querySelectorAll('.stat-card .value');
    if (cards.length >= 4) {
        cards[0].innerText = data.enrolledCount;
        cards[1].innerText = data.quizzesCount;
        cards[2].innerText = data.tasksCount;
        cards[3].innerText = data.avgScore + "%";
    }
}

/**
 * Update the "Continue Learning" progress block
 */
function updateLearningSection(data) {
    const learnSection = document.querySelector('.col-left .glass-card:first-child');
    if (!learnSection) return;

    const titleEl = learnSection.querySelector('strong');
    const percentEl = learnSection.querySelector('span');
    const progressEl = learnSection.querySelector('.progress-bar');

    if (titleEl) titleEl.innerText = data.recentCourse;
    if (percentEl) percentEl.innerText = data.learningProgress + "%";
    if (progressEl) progressEl.style.width = data.learningProgress + "%";
}

/**
 * Dynamically render assignment items
 */
function renderAssignments(assignments) {
    const container = document.querySelector('.col-left .glass-card:last-child');
    if (!container) return;

    const title = container.querySelector('.chart-card-title');
    container.innerHTML = '';
    if (title) container.appendChild(title);

    if (!assignments || assignments.length === 0) {
        container.innerHTML += `<p style="color: var(--iu-text-muted); text-align: center; padding: 20px;">No pending assignments.</p>`;
        return;
    }

    assignments.forEach(task => {
        const div = document.createElement('div');
        div.style = "display: flex; justify-content: space-between; align-items: center; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 15px; border: 1px solid var(--glass-border);";
        div.innerHTML = `
            <div>
                <div style="font-weight: 700;">${task.title}</div>
                <small style="color: var(--iu-text-muted);">${task.desc}</small>
            </div>
            <div style="text-align: right;">
                <span class="status-pill status-pending">${task.due}</span>
                <button class="btn-premium btn-glass" style="padding: 6px 15px; font-size: 0.8rem; margin-top:10px; display: block; width: 100%;">Upload</button>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Render AI Tutor Insights
 */
function renderAI(data) {
    const scoreEl = document.getElementById('readinessScore');
    if (scoreEl) scoreEl.innerText = `Readiness: ${data.readinessScore}%`;
    
    const container = document.getElementById('aiRecommendations');
    if (!container) return;
    container.innerHTML = "";
    
    data.recommendations.forEach(rec => {
        const div = document.createElement('div');
        div.style = "display: flex; gap: 12px; align-items: flex-start; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);";
        
        const config = {
            strength: { icon: 'fa-check-circle', color: '#22c55e' },
            improvement: { icon: 'fa-exclamation-circle', color: '#fdb913' },
            default: { icon: 'fa-lightbulb', color: '#a855f7' }
        };
        
        const { icon, color } = config[rec.type] || config.default;
        
        div.innerHTML = `
            <i class="fas ${icon}" style="color: ${color}; margin-top: 3px;"></i>
            <p style="margin: 0; font-size: 0.8rem; line-height: 1.4; color: var(--iu-text-main);">${rec.text}</p>
        `;
        container.appendChild(div);
    });
}

/**
 * Initialize all charts for the dashboard
 */
function renderCharts(data) {
    if (typeof Chart === 'undefined') {
        console.warn("Dashboard: Chart.js not detected.");
        return;
    }

    Chart.defaults.color = 'rgba(255,255,255,0.7)';
    Chart.defaults.font.family = 'Inter';

    // 1. Performance Chart (Bar)
    const perfCtx = document.getElementById('performanceChart')?.getContext('2d');
    if (perfCtx) {
        new Chart(perfCtx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Grades',
                    data: [85, 90, 78, data.avgScore], 
                    backgroundColor: '#fdb913',
                    borderRadius: 8
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } } 
            }
        });
    }

    // 2. Completion Chart (Doughnut)
    const pieCtx = document.getElementById('pieChart')?.getContext('2d');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Ongoing', 'Pending'],
                datasets: [{
                    data: [data.learningProgress, 20, 10],
                    backgroundColor: ['#522d80', '#fdb913', 'rgba(255,255,255,0.1)'],
                    borderWidth: 0
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // 3. Weekly Activity (Line)
    const lineCtx = document.getElementById('lineChart')?.getContext('2d');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Study Hours',
                    data: [4, 6, 3, 8, 5, 2, 7],
                    borderColor: '#fdb913',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(253, 185, 19, 0.1)'
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } } 
            }
        });
    }
}

// Sidebar Toggle Logic
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebar = document.getElementById('sidebar');

    const toggleSidebar = () => {
        document.body.classList.toggle('sidebar-collapsed');
        
        // For mobile compatibility
        if (window.innerWidth <= 768 && sidebar) {
            sidebar.classList.toggle('active');
        }
    };

    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (sidebarCollapseBtn) sidebarCollapseBtn.addEventListener('click', toggleSidebar);
}

// Global Logout Handler
window.handleLogout = () => {
    // This will be connected to auth.js later
    localStorage.removeItem('iu_session');
    window.location.href = 'login.html';
};

// Initialize on DOM Load
window.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initNotifications();
    initializeDashboard();
});

/**
 * Handle Notification Toggle and Rendering
 */
function initNotifications() {
    const bell = document.getElementById('notifBell');
    const dropdown = document.getElementById('notifDropdown');
    const list = document.getElementById('notifList');
    
    if (!bell || !dropdown) return;

    const mockNotifs = [
        { title: "Exam Result Ready", text: "Your Programming I final result is now available.", time: "2h ago", icon: "fa-graduation-cap" },
        { title: "New Assignment", text: "Database Lab 4 has been posted for Level 1.", time: "5h ago", icon: "fa-file-alt" },
        { title: "System Update", text: "Dashboard analytics now include AI tutor insights.", time: "1d ago", icon: "fa-info-circle" }
    ];

    // Render mock notifications
    list.innerHTML = mockNotifs.map(n => `
        <div style="padding: 15px 20px; border-bottom: 1px solid var(--glass-border); transition: 0.3s; cursor: pointer;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
            <div style="display: flex; gap: 15px;">
                <div style="width: 35px; height: 35px; border-radius: 50%; background: rgba(var(--iu-accent-rgb), 0.1); color: var(--iu-accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <i class="fas ${n.icon}"></i>
                </div>
                <div>
                    <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 2px;">${n.title}</div>
                    <div style="font-size: 0.75rem; color: var(--iu-text-muted); line-height: 1.4;">${n.text}</div>
                    <div style="font-size: 0.65rem; color: var(--iu-accent); margin-top: 5px;">${n.time}</div>
                </div>
            </div>
        </div>
    `).join('');

    bell.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) bell.style.color = 'var(--iu-accent)';
    });

    document.addEventListener('click', () => {
        dropdown.style.display = 'none';
        bell.style.color = 'rgba(255,255,255,0.7)';
    });
}
