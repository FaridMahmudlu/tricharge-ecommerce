import bcrypt from 'bcryptjs';
import config from '../config/environment';
import { pgPool } from '../db';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'change-this-password';

const resetAdminAccount = async () => {
  try {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, config.bcryptRounds);

    await pgPool.query(
      'delete from public.users where role = $1 and email <> $2',
      ['admin', ADMIN_EMAIL],
    );

    const existing = await pgPool.query('select id from public.users where email = $1', [ADMIN_EMAIL]);

    if (existing.rows.length === 0) {
      await pgPool.query(
        'insert into public.users (name, email, password_hash, role) values ($1, $2, $3, $4)',
        ['Admin User', ADMIN_EMAIL, hashedPassword, 'admin'],
      );
      console.log('Admin user created successfully');
    } else {
      await pgPool.query(
        "update public.users set password_hash = $1, role = $2, updated_at = timezone('utc', now()) where id = $3",
        [hashedPassword, 'admin', existing.rows[0].id],
      );
      console.log('Admin user password and role updated successfully');
    }

    console.log('  Email:', ADMIN_EMAIL);
    console.log('  Password:', ADMIN_PASSWORD);
  } catch (error) {
    console.error('Error resetting admin account:', error);
    process.exit(1);
  } finally {
    pgPool.end();
  }
};

resetAdminAccount();
