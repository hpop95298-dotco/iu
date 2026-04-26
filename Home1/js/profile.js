import { api } from './api.js';

/**
 * IU Profile Logic
 * Manages user identity and technical skill visualization
 */

async function initializeProfile() {
    const preloader = document.getElementById('preloader');
    
    try {
        // Try to get data from localStorage first (for quick edit reflections)
        const localData = JSON.parse(localStorage.getItem("profileData"));
        
        // If no local data, we could fetch from API (mock)
        const userId = localData?.ID || "25030410";
        const apiData = await api.auth.getProfile(userId);

        // Merge data (Local has priority for recent edits)
        const profile = { ...apiData, ...localData };
        
        populateProfile(profile);

    } catch (error) {
        console.error("Profile Load Error:", error);
    } finally {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }
}

/**
 * Update UI with profile data
 */
function populateProfile(data) {
    if (!data) return;

    // Basic Info
    const elements = {
        'profile-img': (el, val) => el.src = val,
        'profile-name': (el, val) => el.innerText = val,
        'profile-role': (el, val) => el.innerText = val,
        'profile-bio': (el, val) => el.innerText = val,
        'profile-email': (el, val) => el.innerText = val,
        'profile-phone': (el, val) => el.innerText = val,
        'profile-city': (el, val) => el.innerText = val,
        'profile-ID': (el, val) => el.innerText = val
    };

    Object.entries(elements).forEach(([id, updater]) => {
        const el = document.getElementById(id);
        const val = data[id.replace('profile-', '')] || data[id.replace('profile-', '').toLowerCase()];
        if (el && val) updater(el, val);
    });

    // Special case for imageUrl mapping
    if (data.imageUrl && document.getElementById('profile-img')) {
        document.getElementById('profile-img').src = data.imageUrl;
    }

    // Skills
    if (data.skills) {
        if (data.skills.html) document.getElementById('skill-html').style.width = data.skills.html + "%";
        if (data.skills.css) document.getElementById('skill-css').style.width = data.skills.css + "%";
        if (data.skills.js) document.getElementById('skill-js').style.width = data.skills.js + "%";
    }
}

// Global Actions
window.logout = () => {
    localStorage.removeItem("profileData"); 
    localStorage.removeItem("iu_session");
    window.location.href = "login.html"; 
};

window.editProfile = () => {
    window.location.href = "edit-profile.html";
};

// Navbar Logic
function initNavbar() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initializeProfile();
});
