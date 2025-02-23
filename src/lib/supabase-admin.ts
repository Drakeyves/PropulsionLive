import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://gjesptymdtynclbdrjjf.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZXNwdHltZHR5bmNsYmRyampmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODU1NDE3MCwiZXhwIjoyMDI0MTMwMTcwfQ.Hs_5Iu_Ks_Ks_Ks_Ks_Ks_Ks_Ks_Ks_Ks_Ks_Ks_Ks';

if (!supabaseServiceKey) {
  throw new Error('Missing Supabase service key');
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
