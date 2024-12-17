import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xrqmtebmphkprsxohuqv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycW10ZWJtcGhrcHJzeG9odXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNzc0ODYsImV4cCI6MjA0ODY1MzQ4Nn0.mjxjXV3aIFXoVXKL-Kd9JcG9pLUlKMCE22oDr-pqK1M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
