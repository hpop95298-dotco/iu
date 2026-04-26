import { supabase } from './supabase.js';

/**
 * IU Academic Platform - Production API Layer
 * This layer manages the transition from Mock to Supabase.
 * It follows the "Compatibility Layer" pattern:
 * UI -> api.js -> (Real Supabase Data | Fallback Mock Data)
 */

const MOCK_DELAY = 500;
export const isMockMode = supabase.supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabase.supabaseUrl;

const isSupabaseReady = () => !isMockMode;

/**
 * Log technical events to Supabase
 */
async function logEvent(type, details) {
    if (!isSupabaseReady()) return;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('system_logs').insert([{
            event_type: type,
            details: details,
            user_id: user ? user.id : null
        }]);
    } catch (e) {
        console.warn("API: Could not save log to DB", e.message);
    }
}

/**
 * Robust Request Wrapper with Retry Logic
 */
async function request(fn, mockFn, retries = 2) {
    try {
        if (!isSupabaseReady()) throw new Error("SUPABASE_NOT_CONFIGURED");
        return await fn();
    } catch (err) {
        if (retries > 0 && err.message !== "SUPABASE_NOT_CONFIGURED") {
            console.warn(`API: Retrying... (${retries} left)`);
            await logEvent('RETRY', { error: err.message, retries_left: retries - 1 });
            return await request(fn, mockFn, retries - 1);
        }
        
        await logEvent('API_ERROR', { error: err.message, source: fn.toString().substring(0, 50) });
        console.error("API Error:", err.message);
        return await mockFn();
    }
}

export const api = {
    auth: {
        async getProfile(userId) {
            return request(
                async () => {
                    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
                    if (error) throw error;
                    return data;
                },
                async () => {
                    const mock = {
                        "25030410": { id: "25030410", full_name: "Ibrahim Lotfi", role: "student", level: "3", department: "Computer Science" },
                        "admin": { id: "admin", full_name: "System Administrator", role: "admin" }
                    };
                    return new Promise(r => setTimeout(() => r(mock[userId] || null), MOCK_DELAY));
                }
            );
        }
    },

    academic: {
        async getStudentDashboard(studentId) {
            return request(
                async () => {
                    const { data, error } = await supabase.from('student_dashboards').select('*').eq('student_id', studentId).single();
                    if (error) throw error;
                    return data;
                },
                async () => new Promise(r => setTimeout(() => r({
                    enrolledCount: 5, quizzesCount: 12, tasksCount: 3, avgScore: 85,
                    learningProgress: 65, recentCourse: "Web Development - Module 12",
                    assignments: [{ id: 1, title: "Database Lab 4", desc: "SQL", due: "Tomorrow" }],
                    quizzes: [{ id: 101, title: "Data Structures", date: "Oct 25" }]
                }), MOCK_DELAY))
            );
        },

        async getAttendance(studentId) {
            return request(
                async () => {
                    const { data, error } = await supabase.from('attendance').select('*').eq('student_id', studentId);
                    if (error) throw error;
                    return data.map(r => ({ date: r.date, type: r.category, status: r.status }));
                },
                async () => new Promise(r => setTimeout(() => r([
                    { date: "10 May", type: "Lecture", status: "Present" },
                    { date: "04 May", type: "Section", status: "Absent" }
                ]), MOCK_DELAY))
            );
        },

        async getAdminStats() {
            return request(
                async () => {
                    const { data, error } = await supabase.rpc('get_admin_stats');
                    if (error) throw error;
                    return data;
                },
                async () => new Promise(r => setTimeout(() => r({
                    totalStudents: 1240, totalCourses: 48, activeSubmissions: 8421,
                    recentActivity: [{ name: "Ahmed Anter", module: "Web Design", date: "Oct 24", status: "Validated" }]
                }), MOCK_DELAY))
            );
        },

        async getAllStudents() {
            return request(
                async () => {
                    const { data, error } = await supabase.from('profiles').select('id, name:full_name').eq('role', 'student');
                    if (error) throw error;
                    return data;
                },
                async () => new Promise(r => setTimeout(() => r([{ id: "25030410", name: "Ibrahim Lotfi" }]), MOCK_DELAY))
            );
        },

        async getFullAttendanceHistory() {
            return request(
                async () => {
                    const { data, error } = await supabase.from('attendance_history').select('*');
                    if (error) throw error;
                    return data;
                },
                async () => new Promise(r => setTimeout(() => r([]), MOCK_DELAY))
            );
        },

        async submitAttendance(record) {
            return request(
                async () => {
                    const { error } = await supabase.from('attendance').insert([{ 
                        student_id: record.id, date: record.date, category: record.type, status: record.status 
                    }]);
                    if (error) throw error;
                    return { success: true };
                },
                async () => { return { success: true, mock: true }; }
            );
        },

        async checkHealth() {
            return request(
                async () => {
                    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
                    const { data: { session } } = await supabase.auth.getSession();
                    return { database: error ? "error" : "connected", session: session ? "active" : "none", isMock: false };
                },
                async () => { return { database: "disconnected", session: "none", isMock: true }; }
            );
        },

        async getAIInsights(studentId) {
            return request(
                async () => {
                    // Real AI Logic placeholder
                    return { readinessScore: 82, status: "Optimal", recommendations: [] };
                },
                async () => new Promise(r => setTimeout(() => r({
                    readinessScore: 78, status: "On Track", intent: "High",
                    recommendations: [
                        { id: 1, type: "improvement", text: "Attendance in Practical Sections is slightly low (70%)." },
                        { id: 2, type: "strength", text: "Excellent performance in Data Structures." }
                    ]
                }), MOCK_DELAY))
            );
        }
    }
};
