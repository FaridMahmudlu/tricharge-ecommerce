import { Pool } from 'pg';
import config from '../config/environment';

if (!config.supabase.dbUrl) {
  throw new Error('Supabase database URL is missing.');
}

const pool = new Pool({
  connectionString: config.supabase.dbUrl,
  ssl: config.supabase.dbUrl.includes('localhost') || config.supabase.dbUrl.includes('127.0.0.1')
    ? undefined
    : { rejectUnauthorized: false },
});

pool.on('error', (error) => {
  console.error('Postgres pool error', error);
});

export default pool;
