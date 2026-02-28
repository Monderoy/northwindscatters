// Supabase Configuration for NorthWind Scatters
const SUPABASE_URL = 'https://lsjzeubrhagoutqxlsoz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bUUZjgFpx_6GH8WS3nY9aQ_NAXbrZBt';

// Initialize Supabase client (using global supabase from CDN)
const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Make it globally available
window.supabaseClient = supabaseClient;

// For backward compatibility
if (typeof window.supabase === 'undefined') {
  window.supabase = supabaseClient;
}
