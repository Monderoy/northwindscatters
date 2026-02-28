// Supabase Configuration for NorthWind Scatters
const SUPABASE_URL = 'https://lsjzeubrhagoutqxlsoz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bUUZjgFpx_6GH8WS3nY9aQ_NAXbrZBt';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}
