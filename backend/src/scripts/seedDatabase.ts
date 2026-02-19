import bcrypt from 'bcryptjs';
import config from '../config/environment';
import { pgPool } from '../db';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'change-this-password';

const sampleProducts = [
  {
    name: 'TriCharge Wireless Dock',
    description: '3-in-1 wireless charging dock for phone, earbuds, and watch with foldable design and ambient lighting.',
    price: 89.99,
    category: 'Accessories',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1580894897480-00a6ee5b3c4a?w=800',
    ],
    features: [
      'Supports up to 15W fast charging',
      'USB-C input',
      'Night light with three brightness levels',
    ],
    colors: [
      { name: 'Matte Black', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800' },
      { name: 'Soft White', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
    ],
  },
  {
    name: 'TrueSound Earbuds Pro',
    description: 'Noise-cancelling wireless earbuds with 36-hour battery life and wireless charging case.',
    price: 129.0,
    category: 'Audio',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?w=800',
    ],
    features: [
      'Hybrid active noise cancellation',
      'IPX5 water resistance',
      'Low latency gaming mode',
    ],
  },
];

const createAdminUser = async () => {
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
    console.log('Created admin user');
  } else {
    await pgPool.query(
      "update public.users set password_hash = $1, role = $2, updated_at = timezone('utc', now()) where id = $3",
      [hashedPassword, 'admin', existing.rows[0].id],
    );
    console.log('Updated admin user password');
  }
};

const createSampleProducts = async () => {
  const existing = await pgPool.query('select id from public.products limit 1');
  if (existing.rows.length > 0) {
    console.log('Products already exist, skipping seeding.');
    return;
  }

  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');

    for (const product of sampleProducts) {
      const { rows } = await client.query<{ id: string }>(
        `insert into public.products (name, description, price, category, stock, specifications)
         values ($1, $2, $3, $4, $5, $6)
         returning id`,
        [
          product.name,
          product.description,
          product.price,
          product.category,
          product.stock,
          {},
        ],
      );

      const productId = rows[0].id;

      if (product.images) {
        for (let index = 0; index < product.images.length; index += 1) {
          await client.query(
            'insert into public.product_images (product_id, url, position) values ($1, $2, $3)',
            [productId, product.images[index], index],
          );
        }
      }

      if (product.features) {
        for (const feature of product.features) {
          await client.query(
            'insert into public.product_features (product_id, feature) values ($1, $2)',
            [productId, feature],
          );
        }
      }

      if (product.colors) {
        for (const color of product.colors) {
          await client.query(
            'insert into public.product_colors (product_id, name, image) values ($1, $2, $3)',
            [productId, color.name, color.image],
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log(`Seeded ${sampleProducts.length} products`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const seedDatabase = async () => {
  try {
    console.log('Seeding database with Supabase/Postgres...');
    await createAdminUser();
    await createSampleProducts();
    console.log('Seeding completed.');
    console.log('\nAdmin credentials:');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  } finally {
    pgPool.end();
  }
};

if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
