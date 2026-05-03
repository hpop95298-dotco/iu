// js/supabase.js
// Supabase Initialization via CDN for Vanilla JS

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ==========================================
// ⚠️ ACTION REQUIRED: 
// Replace these with your actual Supabase URL and Anon Key
// You can find these in your Supabase Dashboard -> Settings -> API
// ==========================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

let supabaseInstance;

try {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && SUPABASE_URL) {
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        // Provide a dummy object that mimics the structure enough for the dev mode checks
        supabaseInstance = {
            supabaseUrl: SUPABASE_URL,
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                signInWithPassword: async () => ({ data: null, error: new Error("Not configured") }),
                signOut: async () => ({ error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
            }
        };
    }
} catch (e) {
    console.warn("Supabase initialization skipped:", e.message);
    supabaseInstance = { supabaseUrl: SUPABASE_URL };
}

export const supabase = supabaseInstance;
