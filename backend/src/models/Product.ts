export interface ProductRow {
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
}

export interface ProductImageRow {
  id: number;
  product_id: string;
  url: string;
  position: number;
}

export interface ProductFeatureRow {
  id: number;
  product_id: string;
  feature: string;
}

export interface ProductColorRow {
  id: number;
  product_id: string;
  name: string;
  image: string;
}

export interface ProductRatingRow {
  id: number;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ProductWithRelations extends ProductRow {
  images: ProductImageRow[];
  features: ProductFeatureRow[];
  colors: ProductColorRow[];
  ratings: ProductRatingRow[];
}
