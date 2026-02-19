import { Request, Response } from 'express';
import { PoolClient } from 'pg';
import { pgPool } from '../db';
import { CartWithItems, CartItemWithProduct } from '../models/Cart';

const CART_QUERY = `
  select
    c.id,
    c.user_id,
    c.total_amount,
    c.created_at,
    c.updated_at,
    coalesce(jsonb_agg(
      jsonb_build_object(
        'id', ci.id,
        'cart_id', ci.cart_id,
        'product_id', ci.product_id,
        'quantity', ci.quantity,
        'created_at', ci.created_at,
        'updated_at', ci.updated_at,
        'product', jsonb_build_object(
          'id', p.id,
          'name', p.name,
          'price', p.price,
          'stock', p.stock,
          'images', coalesce(img.images, '[]'::jsonb)
        )
      ) order by ci.created_at
    ) filter (where ci.id is not null), '[]'::jsonb) as items
  from public.carts c
  left join public.cart_items ci on ci.cart_id = c.id
  left join public.products p on p.id = ci.product_id
  left join lateral (
    select jsonb_agg(pi.url order by pi.position) as images
    from public.product_images pi
    where pi.product_id = p.id
  ) img on true
  where c.user_id = $1
  group by c.id;
`;

const ensureCart = async (userId: string, client?: PoolClient) => {
  const runner = client ?? (await pgPool.connect());
  const release = () => {
    if (!client) {
      runner.release();
    }
  };

  try {
    const existing = await runner.query(
      'select id, user_id, total_amount, created_at, updated_at from public.carts where user_id = $1',
      [userId],
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const created = await runner.query(
      'insert into public.carts (user_id, total_amount) values ($1, 0) returning id, user_id, total_amount, created_at, updated_at',
      [userId],
    );

    return created.rows[0];
  } finally {
    release();
  }
};

const recalculateCartTotal = async (client: PoolClient, cartId: string) => {
  await client.query(
    "update public.carts set total_amount = (" +
      "select coalesce(sum(ci.quantity * p.price), 0) from public.cart_items ci " +
      "join public.products p on p.id = ci.product_id where ci.cart_id = public.carts.id), " +
      "updated_at = timezone('utc', now()) where id = $1",
    [cartId],
  );
};

const parseCart = (row: any): CartWithItems => {
  const items: CartItemWithProduct[] = (row.items as any[]).map((item) => ({
    id: item.id,
    cart_id: item.cart_id,
    product_id: item.product_id,
    quantity: Number(item.quantity),
    created_at: item.created_at,
    updated_at: item.updated_at,
    product: {
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      stock: Number(item.product.stock),
      images: Array.isArray(item.product.images) ? item.product.images : [],
    },
  }));

  return {
    id: row.id,
    user_id: row.user_id,
    total_amount: Number(row.total_amount),
    created_at: row.created_at,
    updated_at: row.updated_at,
    items,
  };
};

const loadCart = async (userId: string) => {
  const { rows } = await pgPool.query(CART_QUERY, [userId]);
  return rows.length > 0 ? parseCart(rows[0]) : null;
};

export const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    const baseCart = await ensureCart(req.user.id);
    const cart = (await loadCart(req.user.id)) ?? {
      id: baseCart.id,
      user_id: baseCart.user_id,
      total_amount: Number(baseCart.total_amount),
      created_at: baseCart.created_at,
      updated_at: baseCart.updated_at,
      items: [],
    };

    return res.json({ status: 'success', data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ status: 'error', message: 'Error fetching cart' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    const { productId, quantity } = req.body as { productId?: string; quantity?: number };

    if (!productId || typeof quantity !== 'number') {
      return res.status(400).json({ status: 'error', message: 'Product ID and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Quantity must be greater than 0' });
    }

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      const productResult = await client.query(
        'select id, price, stock from public.products where id = $1',
        [productId],
      );
      const product = productResult.rows[0];

      if (!product) {
        await client.query('ROLLBACK');
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      if (Number(product.stock) < quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ status: 'error', message: 'Not enough stock available' });
      }

      const cart = await ensureCart(req.user.id, client);

      const existing = await client.query(
        'select id, quantity from public.cart_items where cart_id = $1 and product_id = $2',
        [cart.id, productId],
      );

      if (existing.rows.length > 0) {
        const newQuantity = Number(existing.rows[0].quantity) + quantity;
        if (Number(product.stock) < newQuantity) {
          await client.query('ROLLBACK');
          return res.status(400).json({ status: 'error', message: 'Not enough stock available for the requested quantity' });
        }

        await client.query(
          'update public.cart_items set quantity = $1, updated_at = timezone(\'utc\', now()) where id = $2',
          [newQuantity, existing.rows[0].id],
        );
      } else {
        await client.query(
          'insert into public.cart_items (cart_id, product_id, quantity) values ($1, $2, $3)',
          [cart.id, productId, quantity],
        );
      }

      await recalculateCartTotal(client, cart.id);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const cart = await loadCart(req.user.id);
    return res.json({ status: 'success', data: cart });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ status: 'error', message: 'Error adding item to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    const { productId, quantity } = req.body as { productId?: string; quantity?: number };

    if (!productId || typeof quantity !== 'number') {
      return res.status(400).json({ status: 'error', message: 'Product ID and quantity are required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ status: 'error', message: 'Quantity must be greater than 0' });
    }

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      const productResult = await client.query('select id, stock from public.products where id = $1', [productId]);
      const product = productResult.rows[0];

      if (!product) {
        await client.query('ROLLBACK');
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      if (Number(product.stock) < quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ status: 'error', message: 'Not enough stock available' });
      }

      const cart = await ensureCart(req.user.id, client);

      const itemResult = await client.query(
        'select id from public.cart_items where cart_id = $1 and product_id = $2',
        [cart.id, productId],
      );

      if (itemResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ status: 'error', message: 'Item not found in cart' });
      }

      await client.query(
        'update public.cart_items set quantity = $1, updated_at = timezone(\'utc\', now()) where id = $2',
        [quantity, itemResult.rows[0].id],
      );

      await recalculateCartTotal(client, cart.id);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const cart = await loadCart(req.user.id);
    return res.json({ status: 'success', data: cart });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ status: 'error', message: 'Error updating cart item' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ status: 'error', message: 'Product ID is required' });
    }

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      const cart = await ensureCart(req.user.id, client);

      const deletion = await client.query(
        'delete from public.cart_items where cart_id = $1 and product_id = $2',
        [cart.id, productId],
      );

      if (deletion.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ status: 'error', message: 'Item not found in cart' });
      }

      await recalculateCartTotal(client, cart.id);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const cart = await loadCart(req.user.id);
    return res.json({ status: 'success', data: cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ status: 'error', message: 'Error removing item from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'User not authenticated' });
    }

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      const cart = await ensureCart(req.user.id, client);
      await client.query('delete from public.cart_items where cart_id = $1', [cart.id]);
      await client.query(
        "update public.carts set total_amount = 0, updated_at = timezone('utc', now()) where id = $1",
        [cart.id],
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const cart = await loadCart(req.user.id);
    return res.json({ status: 'success', data: cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ status: 'error', message: 'Error clearing cart' });
  }
};




