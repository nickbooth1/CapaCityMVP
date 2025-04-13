const { createClient } = require('@supabase/supabase-js');
const config = require('../config/config');

// Initialize Supabase client with standard anon key (for user operations)
const supabase = createClient(config.supabase.url, config.supabase.key);

// Initialize admin client with service role key (for admin operations)
// TEMPORARY DEBUG: Hardcode the service key to bypass potential .env loading issues
const supabaseAdmin = createClient(config.supabase.url, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcWljdGhuZnJhaWRtaHpyZ3d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDQ5Mjc1NywiZXhwIjoyMDYwMDY4NzU3fQ.9R5Wfj89bPOK9Dtvy228pFYlTrLRKSYCelNT5NPK9T8'); 
// Original line: const supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceKey);

module.exports = { supabase, supabaseAdmin }; 