import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
cartSchema.pre('save', async function(next) {
  if (this.items.length > 0) {
    const populatedCart = await this.populate('items.product');
    this.totalAmount = (populatedCart.items as ICartItem[]).reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  } else {
    this.totalAmount = 0;
  }
  next();
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema); 