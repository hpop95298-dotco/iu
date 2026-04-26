/**
 * IU Frontend Health Audit Tool (v1.0)
 * Run this script in the browser console to verify system integrity.
 */
export const healthAudit = {
    async runFullAudit() {
        console.group("%cIU System Health Audit", "color: #fdb913; font-size: 1.2rem; font-weight: bold;");
        
        const results = {
            api: await this.checkAPI(),
            auth: await this.checkAuth(),
            dom: this.checkDOM(),
            security: this.checkSecurity()
        };

        console.table(results);
        
        const allOk = Object.values(results).every(r => r.status === "PASS");
        if (allOk) {
            console.log("%c✅ ALL SYSTEMS OPERATIONAL: Frontend is 100% healthy.", "color: #22c55e; font-weight: bold;");
        } else {
            console.error("%c❌ AUDIT FAILED: Some components require attention.", "color: #ef4444; font-weight: bold;");
        }
        
        console.groupEnd();
        return results;
    },

    async checkAPI() {
        const start = performance.now();
        try {
            const { api } = await import('./api.js');
            const health = await api.academic.checkHealth();
            const end = performance.now();
            return { 
                component: "API Layer", 
                status: "PASS", 
                latency: `${(end - start).toFixed(2)}ms`,
                mode: health.isMock ? "MOCK" : "PRODUCTION"
            };
        } catch (e) {
            return { component: "API Layer", status: "FAIL", error: e.message };
        }
    },

    async checkAuth() {
        try {
            const { supabase } = await import('./supabase.js');
            const { data: { session } } = await supabase.auth.getSession();
            return { 
                component: "Auth Session", 
                status: "PASS", 
                active: !!session 
            };
        } catch (e) {
            return { component: "Auth Session", status: "FAIL", error: e.message };
        }
    },

    checkDOM() {
        const criticalElements = ['preloader', 'userDisplay'];
        const missing = criticalElements.filter(id => !document.getElementById(id));
        return { 
            component: "DOM Integrity", 
            status: missing.length === 0 ? "PASS" : "WARN", 
            missing: missing.join(', ') || "None"
        };
    },

    checkSecurity() {
        const hasServiceKey = document.documentElement.innerHTML.includes('service_role');
        return { 
            component: "Security Scan", 
            status: !hasServiceKey ? "PASS" : "FAIL", 
            issue: hasServiceKey ? "Service Key Leak Detected!" : "None"
        };
    }
};

// Auto-expose to window for easy console access
window.runIUAudit = () => healthAudit.runFullAudit();
