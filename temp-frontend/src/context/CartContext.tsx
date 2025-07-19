import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '../types/index';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  items: CartItem[];
  total: number;
  addToCart: (item: CartItem) => Promise<void>;
  updateQuantity: (id: string, color: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string, color: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  // Fetch cart from backend on mount or login
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.getCart();
          if (response.status === 'success' && response.data?.items) {
            setCartItems(response.data.items.map((item: any) => ({
              ...item.product,
              id: item.product.id, // local numeric id
              _id: item.product._id, // MongoDB string id
              quantity: item.quantity,
              selectedColor: item.product.selectedColor || '',
            })));
          } else {
            setCartItems([]);
          }
        } catch {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = async (item: CartItem) => {
    if (isAuthenticated) {
      await api.addToCart(item._id || String(item.id), item.quantity); // Ensure string
      // Refetch cart
      const response = await api.getCart();
      if (response.status === 'success' && response.data?.items) {
        setCartItems(response.data.items.map((item: any) => ({
          ...item.product,
          id: item.product.id,
          _id: item.product._id,
          quantity: item.quantity,
          selectedColor: item.product.selectedColor || '',
        })));
      }
    } else {
      setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i.id === item.id && i.selectedColor === item.selectedColor);
        if (existingItem) {
          return prevItems.map(i =>
            i.id === item.id && i.selectedColor === item.selectedColor
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }
        return [...prevItems, item];
      });
    }
  };

  const updateQuantity = async (id: string, color: string, quantity: number) => {
    if (isAuthenticated) {
      const backendCart = await api.getCart();
      const backendItem = backendCart.data?.items.find((item: any) => item.product.id === id && (item.product.selectedColor || '') === color);
      if (backendItem) {
        await api.updateCartItem((backendItem.product as any)._id, quantity); // Ensure string
        const response = await api.getCart();
        if (response.status === 'success' && response.data?.items) {
          setCartItems(response.data.items.map((item: any) => ({
            ...item.product,
            id: item.product.id,
            _id: item.product._id,
            quantity: item.quantity,
            selectedColor: item.product.selectedColor || '',
          })));
        }
      }
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id && item.selectedColor === color
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
      );
    }
  };

  const removeFromCart = async (id: string, color: string) => {
    if (isAuthenticated) {
      const backendCart = await api.getCart();
      const backendItem = backendCart.data?.items.find((item: any) => item.product.id === id && (item.product.selectedColor || '') === color);
      if (backendItem) {
        await api.removeFromCart((backendItem.product as any)._id); // Ensure string
        const response = await api.getCart();
        if (response.status === 'success' && response.data?.items) {
          setCartItems(response.data.items.map((item: any) => ({
            ...item.product,
            id: item.product.id,
            _id: item.product._id,
            quantity: item.quantity,
            selectedColor: item.product.selectedColor || '',
          })));
        }
      }
    } else {
      setCartItems(prevItems => 
        prevItems.filter(item => !(item.id === id && item.selectedColor === color))
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      await api.clearCart();
      setCartItems([]);
    } else {
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        items: cartItems,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 