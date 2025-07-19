import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  features?: string[];
  specifications?: {
    [key: string]: any;
  };
  colors?: {
    name: string;
    image: string;
  }[];
  ratings: {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
  }[];
  averageRating: number;
  numReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide product stock'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: [{
      type: String,
      required: [true, 'Please provide at least one product image'],
    }],
    features: [{
      type: String,
    }],
    specifications: {
      type: Schema.Types.Mixed,
    },
    colors: [{
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    }],
    ratings: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: String,
    }],
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate average rating before saving
productSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
    this.numReviews = this.ratings.length;
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema); 