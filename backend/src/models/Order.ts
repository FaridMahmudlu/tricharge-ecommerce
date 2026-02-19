export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderRow {
  id: string;
  user_id: string;
  payment_method: string;
  items_price: number;
  shipping_price: number;
  total_price: number;
  is_paid: boolean;
  paid_at: string | null;
  is_delivered: boolean;
  delivered_at: string | null;
  status: OrderStatus;
  shipping_address: Record<string, unknown>;
  payment_result: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: number;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface OrderItemWithProduct extends OrderItemRow {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export interface OrderWithItems extends OrderRow {
  items: OrderItemWithProduct[];
}
