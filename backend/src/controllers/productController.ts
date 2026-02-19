import { Request, Response } from 'express';
import { pgPool, supabase } from '../db';

interface SupabaseProductRecord {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  specifications: Record<string, unknown> | null;
  average_rating: number | null;
  num_reviews: number | null;
  created_at: string;
  updated_at: string;
  product_images?: Array<{ url: string; position: number }>;
  product_features?: Array<{ feature: string }>;
  product_colors?: Array<{ name: string; image: string }>;
  product_ratings?: Array<{ id: number; user_id: string; rating: number; comment: string | null; created_at: string }>;
}

type SortOption = { column: string; ascending: boolean };

const sortOptions: Record<string, SortOption> = {
  created_at: { column: 'created_at', ascending: false },
  price: { column: 'price', ascending: false },
  average_rating: { column: 'average_rating', ascending: false },
};

const mapProductRecord = (record: SupabaseProductRecord) => ({
  id: record.id,
  name: record.name,
  description: record.description,
  price: record.price,
  category: record.category,
  stock: record.stock,
  images: (record.product_images ?? [])
    .sort((a, b) => a.position - b.position)
    .map((image) => image.url),
  features: (record.product_features ?? []).map((feature) => feature.feature),
  specifications: record.specifications ?? {},
  colors: (record.product_colors ?? []).map((color) => ({ name: color.name, image: color.image })),
  ratings: (record.product_ratings ?? []).map((rating) => ({
    user: rating.user_id,
    rating: rating.rating,
    comment: rating.comment ?? undefined,
    createdAt: rating.created_at,
  })),
  averageRating: record.average_rating ?? 0,
  numReviews: record.num_reviews ?? 0,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

const castProducts = (rows: unknown) => {
  if (!Array.isArray(rows)) {
    return [];
  }
  return (rows as SupabaseProductRecord[]).map(mapProductRecord);
};

const castProduct = (row: unknown) => (row ? mapProductRecord(row as SupabaseProductRecord) : null);

export const getProducts = async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const sortParam = typeof req.query.sort === 'string' ? req.query.sort : 'created_at';
    const sort = sortOptions[sortParam] || sortOptions.created_at;

    let query = supabase
      .from('products')
      .select(
        'id, name, description, price, category, stock, specifications, average_rating, num_reviews, created_at, updated_at,' +
          ' product_images(url, position), product_features(feature), product_colors(name, image)',
        { count: 'exact' },
      )
      .order(sort.column, { ascending: sort.ascending });

    if (keyword) {
      query = query.ilike('name', `%${keyword}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw error;
    }

    const total = count ?? 0;

    return res.json({
      products: castProducts(data),
      page,
      pages: total > 0 ? Math.ceil(total / pageSize) : 1,
      total,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, name, description, price, category, stock, specifications, average_rating, num_reviews, created_at, updated_at,' +
          ' product_images(url, position), product_features(feature), product_colors(name, image),' +
          ' product_ratings(id, user_id, rating, comment, created_at)',
      )
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(castProduct(data));
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Error fetching product' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const client = await pgPool.connect();
  try {
    const {
      name,
      description,
      price,
      category,
      stock = 0,
      images = [],
      features = [],
      colors = [],
      specifications = {},
    } = req.body as Record<string, unknown>;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({ message: 'Invalid price value' });
    }

    await client.query('BEGIN');

    const productInsert = await client.query<{ id: string }>(
      `insert into public.products (name, description, price, category, stock, specifications)
       values ($1, $2, $3, $4, $5, $6)
       returning id`,
      [name, description, numericPrice, category, Number.isNaN(numericStock) ? 0 : numericStock, specifications],
    );

    const productId = productInsert.rows[0].id;

    const imageList = Array.isArray(images) ? (images as string[]) : [];
    for (let index = 0; index < imageList.length; index += 1) {
      await client.query(
        'insert into public.product_images (product_id, url, position) values ($1, $2, $3)',
        [productId, imageList[index], index],
      );
    }

    const featureList = Array.isArray(features) ? (features as string[]) : [];
    for (const feature of featureList) {
      await client.query(
        'insert into public.product_features (product_id, feature) values ($1, $2)',
        [productId, feature],
      );
    }

    const colorList = Array.isArray(colors) ? (colors as Array<{ name: string; image: string }>) : [];
    for (const color of colorList) {
      await client.query(
        'insert into public.product_colors (product_id, name, image) values ($1, $2, $3)',
        [productId, color.name, color.image],
      );
    }

    await client.query('COMMIT');

    const { data, error } = await supabase
      .from('products')
      .select(
        'id, name, description, price, category, stock, specifications, average_rating, num_reviews, created_at, updated_at,' +
          ' product_images(url, position), product_features(feature), product_colors(name, image)',
      )
      .eq('id', productId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return res.status(201).json(castProduct(data));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product:', error);
    return res.status(400).json({ message: 'Error creating product' });
  } finally {
    client.release();
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const client = await pgPool.connect();
  try {
    const productId = req.params.id;
    const body = req.body as Record<string, unknown>;

    await client.query('BEGIN');

    const updates: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    for (const field of ['name', 'description', 'price', 'category', 'stock', 'specifications'] as const) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates.push(`${field} = $${index}`);
        values.push(body[field]);
        index += 1;
      }
    }

    if (updates.length > 0) {
      values.push(productId);
      await client.query(`update public.products set ${updates.join(', ')} where id = $${index}`, values);
    }

    if (Array.isArray(body.images)) {
      const images = body.images as string[];
      await client.query('delete from public.product_images where product_id = $1', [productId]);
      for (let position = 0; position < images.length; position += 1) {
        await client.query(
          'insert into public.product_images (product_id, url, position) values ($1, $2, $3)',
          [productId, images[position], position],
        );
      }
    }

    if (Array.isArray(body.features)) {
      const features = body.features as string[];
      await client.query('delete from public.product_features where product_id = $1', [productId]);
      for (const feature of features) {
        await client.query(
          'insert into public.product_features (product_id, feature) values ($1, $2)',
          [productId, feature],
        );
      }
    }

    if (Array.isArray(body.colors)) {
      const colors = body.colors as Array<{ name: string; image: string }>;
      await client.query('delete from public.product_colors where product_id = $1', [productId]);
      for (const color of colors) {
        await client.query(
          'insert into public.product_colors (product_id, name, image) values ($1, $2, $3)',
          [productId, color.name, color.image],
        );
      }
    }

    await client.query('COMMIT');

    const { data, error } = await supabase
      .from('products')
      .select(
        'id, name, description, price, category, stock, specifications, average_rating, num_reviews, created_at, updated_at,' +
          ' product_images(url, position), product_features(feature), product_colors(name, image)',
      )
      .eq('id', productId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(castProduct(data));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    return res.status(400).json({ message: 'Error updating product' });
  } finally {
    client.release();
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await pgPool.query('delete from public.products where id = $1', [req.params.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product' });
  }
};

export const createProductReview = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const client = await pgPool.connect();
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body as { rating?: number; comment?: string };

    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }

    await client.query('BEGIN');

    const existing = await client.query(
      'select id from public.product_ratings where product_id = $1 and user_id = $2',
      [productId, req.user.id],
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    await client.query(
      'insert into public.product_ratings (product_id, user_id, rating, comment) values ($1, $2, $3, $4)',
      [productId, req.user.id, rating, comment ?? null],
    );

    const stats = await client.query<{ average_rating: number; num_reviews: number }>(
      'select avg(rating)::numeric(10,2) as average_rating, count(*) as num_reviews from public.product_ratings where product_id = $1',
      [productId],
    );

    const average = Number(stats.rows[0]?.average_rating ?? 0);
    const count = Number(stats.rows[0]?.num_reviews ?? 0);

    await client.query(
      'update public.products set average_rating = $1, num_reviews = $2 where id = $3',
      [average, count, productId],
    );

    await client.query('COMMIT');

    return res.status(201).json({ message: 'Review added' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating review:', error);
    return res.status(500).json({ message: 'Error creating review' });
  } finally {
    client.release();
  }
};

export const getTopProducts = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        'id, name, description, price, category, stock, specifications, average_rating, num_reviews, created_at, updated_at,' +
          ' product_images(url, position)',
      )
      .order('average_rating', { ascending: false })
      .limit(3);

    if (error) {
      throw error;
    }

    return res.json(castProducts(data));
  } catch (error) {
    console.error('Error fetching top products:', error);
    return res.status(500).json({ message: 'Error fetching top products' });
  }
};
