export interface CartRow {
  id: string;
  user_id: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemRow {
  id: number;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItemRow {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export interface CartWithItems extends CartRow {
  items: CartItemWithProduct[];
}
