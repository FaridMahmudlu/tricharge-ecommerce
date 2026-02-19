import { createClient } from '@supabase/supabase-js';
import config from '../config/environment';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  throw new Error('Supabase credentials are missing.');
}

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

export default supabase;
