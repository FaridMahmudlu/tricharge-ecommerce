export interface Product {
  id: string; // Change to string to match backend
  _id?: string; // MongoDB string id for backend sync
  name: string;
  price: number;
  description: string;
  image?: string; // Make image optional
  features?: string[]; // Make features optional
  specifications?: {
    material?: string;
    input?: string;
    output?: string;
    chargingDistance?: string;
    warranty?: string;
    protection?: string[];
  };
  colors?: { name: string; image: string }[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  _id?: string; // MongoDB string id for backend sync
}

export {}; 