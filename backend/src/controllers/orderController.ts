import { Request, Response } from 'express';
import { pgPool } from '../db';
import { OrderStatus } from '../models/Order';

interface OrderRowWithUser {
  id: string;
  user_id: string;
  payment_method: string;
  items_price: string;
  shipping_price: string;
  total_price: string;
  is_paid: boolean;
  paid_at: string | null;
  is_delivered: boolean;
  delivered_at: string | null;
  status: OrderStatus;
  shipping_address: Record<string, unknown>;
  payment_result: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
}

interface OrderItemRowWithProduct {
  id: number;
  order_id: string;
  product_id: string;
  quantity: number;
  price: string;
  created_at: string;
  product_name: string;
  product_price: string;
  product_images: string | null;
}

const mapOrderResponse = (order: OrderRowWithUser, items: OrderItemRowWithProduct[]) => ({
  id: order.id,
  user: {
    id: order.user_id,
    name: order.user_name,
    email: order.user_email,
  },
  orderItems: items.map((item) => ({
    product: {
      id: item.product_id,
      name: item.product_name,
      price: Number(item.product_price),
      images: item.product_images ? JSON.parse(item.product_images) : [],
    },
    quantity: Number(item.quantity),
    price: Number(item.price),
    createdAt: item.created_at,
  })),
  shippingAddress: order.shipping_address,
  paymentMethod: order.payment_method,
  paymentResult: order.payment_result,
  itemsPrice: Number(order.items_price),
  shippingPrice: Number(order.shipping_price),
  totalPrice: Number(order.total_price),
  isPaid: order.is_paid,
  paidAt: order.paid_at,
  isDelivered: order.is_delivered,
  deliveredAt: order.delivered_at,
  status: order.status,
  createdAt: order.created_at,
  updatedAt: order.updated_at,
});

const fetchOrderWithItems = async (orderId: string) => {
  const orderResult = await pgPool.query<OrderRowWithUser>(
    `select o.*, u.name as user_name, u.email as user_email
       from public.orders o
       join public.users u on u.id = o.user_id
      where o.id = $1`,
    [orderId],
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const itemsResult = await pgPool.query<OrderItemRowWithProduct>(
    `select
        oi.*, p.name as product_name, p.price as product_price,
        coalesce(
          (select json_agg(pi.url order by pi.position)
             from public.product_images pi
            where pi.product_id = p.id),
          '[]'
        ) as product_images
       from public.order_items oi
       join public.products p on p.id = oi.product_id
      where oi.order_id = $1`,
    [orderId],
  );

  return mapOrderResponse(orderResult.rows[0], itemsResult.rows);
};

const fetchCartSnapshot = async (userId: string) => {
  const cartResult = await pgPool.query<{ id: string; total_amount: string }>(
    'select id, total_amount from public.carts where user_id = $1',
    [userId],
  );

  const cart = cartResult.rows[0];
  if (!cart) {
    return { cartId: null, items: [], total: 0 };
  }

  const itemsResult = await pgPool.query<{
    product_id: string;
    quantity: number;
    price: string;
    stock: number;
    name: string;
  }>(
    `select ci.product_id, ci.quantity, p.price::text as price, p.stock, p.name
       from public.cart_items ci
       join public.products p on p.id = ci.product_id
      where ci.cart_id = $1`,
    [cart.id],
  );

  return {
    cartId: cart.id,
    items: itemsResult.rows.map((row) => ({
      productId: row.product_id,
      quantity: Number(row.quantity),
      price: Number(row.price),
      stock: Number(row.stock),
      name: row.name,
    })),
    total: Number(cart.total_amount),
  };
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { shippingAddress, paymentMethod } = req.body as {
      shippingAddress?: Record<string, unknown>;
      paymentMethod?: string;
    };

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }

    const snapshot = await fetchCartSnapshot(req.user.id);

    if (!snapshot.cartId || snapshot.items.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    for (const item of snapshot.items) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${item.name}` });
      }
    }

    const itemsPrice = snapshot.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      const orderInsert = await client.query<{ id: string }>(
        `insert into public.orders (
            user_id, payment_method, items_price, shipping_price, total_price, shipping_address, status
         ) values ($1, $2, $3, $4, $5, $6, 'pending')
         returning id`,
        [req.user.id, paymentMethod, itemsPrice, shippingPrice, totalPrice, shippingAddress],
      );

      const orderId = orderInsert.rows[0].id;

      for (const item of snapshot.items) {
        await client.query(
          'insert into public.order_items (order_id, product_id, quantity, price) values ($1, $2, $3, $4)',
          [orderId, item.productId, item.quantity, item.price],
        );

        const stockUpdate = await client.query(
          'update public.products set stock = stock - $1 where id = $2 and stock >= $1',
          [item.quantity, item.productId],
        );

        if (stockUpdate.rowCount === 0) {
          throw new Error('Failed to update product stock');
        }
      }

      await client.query('delete from public.cart_items where cart_id = $1', [snapshot.cartId]);
      await client.query(
        "update public.carts set total_amount = 0, updated_at = timezone('utc', now()) where id = $1",
        [snapshot.cartId],
      );

      await client.query('COMMIT');

      const order = await fetchOrderWithItems(orderId);
      if (!order) {
        throw new Error('Order creation failed');
      }

      return res.status(201).json(order);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating order:', error);
      return res.status(500).json({ message: 'Error creating order' });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating order' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const order = await fetchOrderWithItems(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Error fetching order' });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const orderIds = await pgPool.query<{ id: string }>(
      'select id from public.orders where user_id = $1 order by created_at desc',
      [req.user.id],
    );

    const orders = [];
    for (const row of orderIds.rows) {
      const order = await fetchOrderWithItems(row.id);
      if (order) {
        orders.push(order);
      }
    }

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orderIds = await pgPool.query<{ id: string }>(
      'select id from public.orders order by created_at desc',
    );

    const orders = [];
    for (const row of orderIds.rows) {
      const order = await fetchOrderWithItems(row.id);
      if (order) {
        orders.push(order);
      }
    }

    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body as { status?: OrderStatus };

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    await pgPool.query(
      `update public.orders
          set status = $1,
              is_delivered = case when $1 = 'delivered' then true else is_delivered end,
              delivered_at = case when $1 = 'delivered' then timezone('utc', now()) else delivered_at end,
              updated_at = timezone('utc', now())
        where id = $2`,
      [status, req.params.id],
    );

    const order = await fetchOrderWithItems(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Error updating order status' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const order = await fetchOrderWithItems(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    if (order.user.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      for (const item of order.orderItems) {
        await client.query(
          'update public.products set stock = stock + $1 where id = $2',
          [item.quantity, item.product.id],
        );
      }

      await client.query(
        "update public.orders set status = 'cancelled', updated_at = timezone('utc', now()) where id = $1",
        [req.params.id],
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    const updatedOrder = await fetchOrderWithItems(req.params.id);
    if (!updatedOrder) {
      return res.status(500).json({ message: 'Error cancelling order' });
    }

    return res.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ message: 'Error cancelling order' });
  }
};
