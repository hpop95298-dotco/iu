/**
 * IU Navigation Utility
 * Handles dynamic breadcrumb generation and global navigation helpers
 */

const BREADCRUMB_MAP = {
    'iu.html': 'Home',
    'select-level.html': 'Academic Levels',
    'level1-term1-pdf.html': 'Level 01',
    'level1-term1-video.html': 'Level 01 Videos',
    'level1-quizzes.html': 'Level 01 Quizzes',
    'programs.html': 'Programs',
    'regulations.html': 'Regulations',
    'events.html': 'Events',
    'dashboard-STU.html': 'Student Dashboard',
    'dashboard-admin.html': 'Admin Dashboard',
    'profile.html': 'User Profile'
};

function initBreadcrumbs() {
    const container = document.querySelector('.main-content');
    if (!container) return;

    // Only add breadcrumbs if they don't exist
    if (document.querySelector('.breadcrumb-container')) return;

    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    // Don't show breadcrumbs on the home page
    if (page === 'iu.html' || page === '') return;

    const breadcrumbWrapper = document.createElement('div');
    breadcrumbWrapper.className = 'breadcrumb-container container';
    
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb-nav';

    // 1. Always start with Home
    nav.appendChild(createBreadcrumbItem('Home', 'iu.html'));

    // 2. Logic for intermediate levels based on directory/filename
    if (path.includes('levels-term1') || path.includes('level1')) {
        nav.appendChild(createBreadcrumbItem('Level 01', 'levels-term1/level1-term1-pdf.html'));
    } else if (path.includes('level2')) {
        nav.appendChild(createBreadcrumbItem('Level 02', 'level2-term1/level2-term1-pdf.html'));
    }

    // 3. Current Page
    const currentPageLabel = BREADCRUMB_MAP[page] || formatPageName(page);
    nav.appendChild(createBreadcrumbItem(currentPageLabel, '#', true));

    breadcrumbWrapper.appendChild(nav);
    container.insertBefore(breadcrumbWrapper, container.firstChild);
}

function createBreadcrumbItem(label, url, isActive = false) {
    const item = document.createElement('div');
    item.className = `breadcrumb-item ${isActive ? 'active' : ''}`;
    
    if (isActive) {
        item.innerText = label;
    } else {
        const link = document.createElement('a');
        link.href = url;
        link.innerText = label;
        item.appendChild(link);
    }
    
    return item;
}

function formatPageName(filename) {
    if (!filename) return 'Page';
    return filename
        .replace('.html', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Global Search/Navigation helper can be added here
window.addEventListener('DOMContentLoaded', () => {
    initBreadcrumbs();
});
