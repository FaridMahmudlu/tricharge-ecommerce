import { Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Types } from 'mongoose';

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');
    
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    return res.json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error fetching cart' 
    });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Product ID and quantity are required' 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Quantity must be greater than 0' 
      });
    }

    // Validate product ID format
    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid product ID format' 
      });
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Product not found' 
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Not enough stock available' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0,
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity if product exists
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Not enough stock available for the requested quantity' 
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new item if product doesn't exist
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      const product = item.product as any;
      return total + (product.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    return res.json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error adding item to cart' 
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Quantity is required' 
      });
    }

    if (quantity < 1) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Quantity must be greater than 0' 
      });
    }

    // Validate product ID format
    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid product ID format' 
      });
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Product not found' 
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Not enough stock available' 
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Cart not found' 
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Item not found in cart' 
      });
    }

    item.quantity = quantity;

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      const product = item.product as any;
      return total + (product.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    return res.json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error updating cart item' 
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Validate product ID format
    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid product ID format' 
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Cart not found' 
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Item not found in cart' 
      });
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => {
      const product = item.product as any;
      return total + (product.price * item.quantity);
    }, 0);

    await cart.save();
    await cart.populate('items.product');

    return res.json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error removing item from cart' 
    });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Cart not found' 
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ 
      status: 'error',
      message: 'Error clearing cart' 
    });
  }
}; 