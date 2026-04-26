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

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
