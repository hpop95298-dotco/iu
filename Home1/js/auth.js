import { supabase } from './supabase.js';
import { api } from './api.js';

// Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authError = document.getElementById('authError');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// Determine current page
const currentPage = window.location.pathname.split('/').pop();

// --- DEV BYPASS MODE ---
const isDevMode = supabase.supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabase.supabaseUrl;

function showError(msg) {
    if (authError) {
        authError.innerText = msg;
        authError.style.display = 'block';
    } else {
        alert('Authentication Error: ' + msg);
    }
}

/**
 * Handle Login Form
 */
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (authError) authError.style.display = 'none';
        
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        if (isDevMode) {
            console.warn("DEV MODE: Bypassing Supabase Login");
            // Simulate role check for dev mode with explicit accounts
            if (email === 'admin@iu.edu.eg' && password === 'admin123') {
                window.location.href = 'dashboard-admin.html';
            } else if (email === 'student@iu.edu.eg' && password === 'student123') {
                window.location.href = 'dashboard-STU.html';
            } else if (email === 'ebrahim.saeed.25030410@iu.edu.eg' && password === '01554@sis') {
                window.location.href = 'dashboard-STU.html';
            } else {
                showError("Invalid Credentials! Please check your email and password.");
            }
            return;
        }

        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Verifying...';
        submitBtn.disabled = true;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) throw error;
            
            // Get user profile to determine role
            const profile = await api.auth.getProfile(data.user.id);
            if (profile && profile.role === 'admin') {
                window.location.href = 'dashboard-admin.html';
            } else {
                window.location.href = 'dashboard-STU.html';
            }
        } catch (err) {
            console.error('Login Error:', err.message);
            showError(err.message);
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Handle Register Form
 */
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (authError) authError.style.display = 'none';
        
        if (isDevMode) {
            alert('DEV MODE: Registration bypassed. Please log in.');
            if (typeof toggleAuth === 'function') toggleAuth(); 
            return;
        }

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        submitBtn.innerText = 'Registering...';
        submitBtn.disabled = true;

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: { data: { full_name: name, role: 'student' } }
            });
            if (error) throw error;
            
            // Note: Trigger profile creation here if not using Supabase Triggers
            
            alert('Registration successful! Please check your email for verification.');
            if (typeof toggleAuth === 'function') toggleAuth(); 
            
        } catch (err) {
            console.error('Register Error:', err.message);
            showError(err.message);
        } finally {
            submitBtn.innerText = 'Register';
            submitBtn.disabled = false;
        }
    });
}

/**
 * Handle Logout
 */
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!isDevMode) {
            await supabase.auth.signOut();
        }
        window.location.href = 'login.html';
    });
}

/**
 * Session Protection & UI Sync
 */
async function checkSession() {
    const protectedPages = ['dashboard-STU.html', 'attendance.html', 'dashboard-admin.html', 'admin-attendance.html'];
    const preloader = document.getElementById('preloader');
    
    try {
        // 1. Show preloader immediately during check
        if (preloader) { preloader.style.display = 'flex'; preloader.style.opacity = '1'; }

        // 2. Early exit for Dev/Mock mode
        if (isDevMode || isMockMode) {
            console.info("Auth: Running in DEV/MOCK mode.");
            // Banner creation code removed to hide the warning until DB connection
            
            if (userDisplay) userDisplay.innerText = "Demo Student (Dev Mode)";
            return;
        }

        // 3. Real Supabase Session Check
        const { data: { session } } = await supabase.auth.getSession();
        
        // Redirect unauthenticated
        if (protectedPages.includes(currentPage) && !session) {
            window.location.href = 'login.html';
            return;
        }
        
        // Sync User UI
        if (session && userDisplay) {
            const profile = await api.auth.getProfile(session.user.id);
            userDisplay.innerText = profile ? profile.full_name : session.user.email;
        }
        
        // Redirect away from login if authenticated
        if (currentPage === 'login.html' && session) {
             window.location.href = 'dashboard-STU.html';
        }

    } catch (err) {
        console.error("Session Check Error:", err);
    } finally {
        // Only hide preloader here if this is NOT a dashboard (dashboards handle their own preloader after data fetch)
        const isDashboard = currentPage.includes('dashboard') || currentPage.includes('attendance');
        if (!isDashboard && preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    }
}

// Add isMockMode check
const isMockMode = supabase.supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabase.supabaseUrl;

// Initialize on load
checkSession();
