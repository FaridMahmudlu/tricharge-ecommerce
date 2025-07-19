import React from 'react';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import type { CartItem } from '../types/index';
import { useAuth } from '../context/AuthContext';

const CartContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 5rem;
`;

const CartTitle = styled.h1`
  color: #2c5282;
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 700;
`;

const CartContent = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 120px 2fr 1fr 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const CartHeader = styled(CartItem)`
  background: #f8fafc;
  font-weight: 600;
  color: #2c5282;
  border-bottom: 2px solid #2c5282;
`;

const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProductName = styled.span`
  font-weight: 500;
  color: #1a202c;
  font-size: 1.1rem;
`;

const ColorVariant = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: #f7fafc;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

const ColorDot = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color.toLowerCase()};
  border: 1px solid #e2e8f0;
`;

const ColorQuantity = styled.span`
  color: #2c5282;
  font-weight: 500;
`;

const Price = styled.span`
  font-weight: 600;
  color: #2c5282;
  font-size: 1.1rem;
`;

const QuantityInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-align: center;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2c5282;
    box-shadow: 0 0 0 2px rgba(44, 82, 130, 0.1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #fee2e2;
    color: #c53030;
  }
`;

const CartSummary = styled.div`
  padding: 2rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const TotalLabel = styled.span`
  font-size: 1.25rem;
  color: #4a5568;
  font-weight: 500;
`;

const TotalAmount = styled.span`
  font-size: 1.5rem;
  color: #2c5282;
  font-weight: 700;
`;

const CheckoutButton = styled.button<{ $disabled?: boolean }>`
  background: ${props => props.$disabled ? '#cbd5e0' : 'linear-gradient(135deg, #2c5282 0%, #4299e1 100%)'};
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: ${props => props.$disabled ? 'none' : 'translateY(-1px)'};
    box-shadow: ${props => props.$disabled ? 'none' : '0 4px 6px rgba(44, 82, 130, 0.2)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const EmptyCartIllustration = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 80px;
    height: 80px;
    background: #2c5282;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.1;
  }

  &::after {
    content: '🛒';
    font-size: 4rem;
    position: relative;
    z-index: 1;
  }
`;

const EmptyCartTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2c5282;
  font-weight: 700;
`;

const EmptyCartText = styled.p`
  margin-bottom: 2rem;
  color: #4a5568;
  font-size: 1.1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const ContinueShoppingButton = styled(CheckoutButton)`
  max-width: 300px;
  margin: 0 auto;
  background: linear-gradient(135deg, #2c5282 0%, #4299e1 100%);
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Group items by color
  const groupedItems = cartItems.reduce((acc, item) => {
    const key = `${item.id}-${item.selectedColor}`;
    if (!acc[key]) {
      acc[key] = { ...item, quantity: 0 };
    }
    acc[key].quantity += item.quantity;
    return acc;
  }, {} as Record<string, CartItem>);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId: string, color: string, newQuantity: number) => {
    updateQuantity(itemId, color, newQuantity);
  };

  const handleRemoveItem = (itemId: string, color: string) => {
    removeFromCart(itemId, color);
  };

  const handleContinueShopping = () => {
    navigate('/product/1');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <CartContainer>
      <CartTitle>Shopping Cart</CartTitle>
      {cartItems.length > 0 ? (
        <CartContent>
          <CartHeader>
            <span>Product</span>
            <span>Details</span>
            <span>Price</span>
            <span>Quantity</span>
            <span></span>
          </CartHeader>
          {Object.values(groupedItems as Record<string, CartItem>).map((item: CartItem) => (
            <CartItem key={`${item.id}-${item.selectedColor}`}>
              <ProductImage src={item.image} alt={item.name} />
              <ProductInfo>
                <ProductName>{item.name}</ProductName>
                <ColorVariant>
                  <ColorDot color={item.selectedColor} />
                  <span>{item.selectedColor}</span>
                  <ColorQuantity>× {item.quantity}</ColorQuantity>
                </ColorVariant>
              </ProductInfo>
              <Price>${(item.price * item.quantity).toFixed(2)}</Price>
              <QuantityInput
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, item.selectedColor, parseInt(e.target.value))}
                min="0"
              />
              <DeleteButton onClick={() => handleRemoveItem(item.id, item.selectedColor)}>×</DeleteButton>
            </CartItem>
          ))}
          <CartSummary>
            <Total>
              <TotalLabel>Total Amount</TotalLabel>
              <TotalAmount>${total.toFixed(2)}</TotalAmount>
            </Total>
            <CheckoutButton 
              onClick={handleCheckout}
              $disabled={!isAuthenticated}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </CheckoutButton>
          </CartSummary>
        </CartContent>
      ) : (
        <EmptyCart>
          <EmptyCartIllustration />
          <EmptyCartTitle>Your Cart is Empty</EmptyCartTitle>
          <EmptyCartText>
            Looks like you haven't added any items to your cart yet.
          </EmptyCartText>
          <ContinueShoppingButton onClick={handleContinueShopping}>
            Continue Shopping
          </ContinueShoppingButton>
        </EmptyCart>
      )}
    </CartContainer>
  );
};

export default Cart; 