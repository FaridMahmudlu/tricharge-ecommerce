// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: any[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  ratings: any[];
  averageRating: number;
  numReviews: number;
  features?: string[];
  specifications?: any;
  colors?: any[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

export interface Order {
  id: string;
  user: string;
  orderItems: CartItem[];
  shippingAddress: string;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

// HTTP Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('token');
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.clearToken();
          window.location.href = '/login';
        }
        
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.status === 'success' && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.status === 'success' && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // Products
  async getProducts(params?: {
    page?: number;
    keyword?: string;
    category?: string;
    sort?: string;
  }): Promise<ApiResponse<{
    products: Product[];
    page: number;
    pages: number;
    total: number;
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.keyword) searchParams.append('keyword', params.keyword);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async getTopProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/products/top');
  }

  // Multi-image upload
  async uploadProductImages(files: File[]): Promise<ApiResponse<{ imageUrls: string[] }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const headers: Record<string, string> = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    // DO NOT set Content-Type for FormData, let the browser set it
    const response = await fetch(`${this.baseURL}/products/upload-multiple`, {
      method: 'POST',
      headers,
      body: formData,
    });
    const data = await response.json();
    return data;
  }

  // Cart
  async getCart(): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart');
  }

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart', {
      method: 'DELETE',
    });
  }

  // Orders
  async createOrder(orderData: {
    shippingAddress: string;
    paymentMethod: string;
  }): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}`);
  }

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders/myorders');
  }

  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>('/orders');
  }

  // Payment
  async createPaymentIntent(orderId: string): Promise<ApiResponse<{ clientSecret: string }>> {
    return this.request<{ clientSecret: string }>('/payment/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  // Admin endpoints
  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }
}

// Create and export API instance
export const api = new ApiClient(API_BASE_URL); 