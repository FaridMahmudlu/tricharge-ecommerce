import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: #48bb78;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3182ce;
    transform: translateY(-1px);
  }
`;

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <SuccessIcon>✓</SuccessIcon>
      <Title>Thank You for Your Order!</Title>
      <Message>
        Your order has been successfully placed. We'll send you a confirmation email with your order details shortly.
      </Message>
      <Button onClick={() => navigate('/')}>
        Continue Shopping
      </Button>
    </Container>
  );
};

export default OrderSuccess; 