import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped';
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  color: #1a202c;
  font-weight: 600;
  margin: 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
    transform: translateY(-1px);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.$active ? '#4299e1' : '#e2e8f0'};
  background: ${props => props.$active ? '#ebf8ff' : 'white'};
  color: ${props => props.$active ? '#2b6cb0' : '#4a5568'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#ebf8ff' : '#f7fafc'};
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    border-color: #4299e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const OrderInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
`;

const OrderDate = styled.span`
  color: #718096;
  font-size: 0.875rem;
`;

const OrderStatus = styled.span<{ $status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'Delivered':
        return '#c6f6d5';
      case 'Processing':
        return '#fefcbf';
      case 'Shipped':
        return '#bee3f8';
      default:
        return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'Delivered':
        return '#2f855a';
      case 'Processing':
        return '#975a16';
      case 'Shipped':
        return '#2b6cb0';
      default:
        return '#4a5568';
    }
  }};
`;

const OrderContent = styled.div`
  padding: 1rem;
`;

const ItemsList = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 0.375rem;
`;

const ItemInfo = styled.div`
  display: grid;
  gap: 0.25rem;
`;

const ItemName = styled.span`
  color: #2d3748;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ItemQuantity = styled.span`
  color: #718096;
  font-size: 0.75rem;
`;

const ItemPrice = styled.span`
  color: #2d3748;
  font-weight: 500;
  font-size: 0.875rem;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  font-weight: 600;
  color: #2d3748;
`;

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [filter, setFilter] = useState<string>('all');

  // Mock data - replace with actual API call
  const orders: Order[] = [
    {
      id: '12345',
      date: 'Feb 15, 2024',
      status: 'Delivered',
      items: [
        { name: '3-in-1 Wireless Charging Station', price: 49.99, quantity: 1 },
        { name: 'Shipping', price: 5.99, quantity: 1 }
      ],
      total: 55.98
    },
    {
      id: '12344',
      date: 'Feb 10, 2024',
      status: 'Processing',
      items: [
        { name: 'Smart LED Strip Lights', price: 29.99, quantity: 2 },
        { name: 'Shipping', price: 5.99, quantity: 1 }
      ],
      total: 65.97
    }
  ];

  if (id) {
    const order = orders.find(o => o.id === id);
    if (!order) return <div style={{ padding: 32 }}>Order not found.</div>;
    return (
      <Container>
        <Header>
          <Title>Order Details</Title>
          <BackButton onClick={() => navigate('/orders')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Orders
          </BackButton>
        </Header>
        <OrderCard>
          <OrderHeader>
            <OrderInfo>
              <OrderId>Order #{order.id}</OrderId>
              <OrderDate>{order.date}</OrderDate>
            </OrderInfo>
            <OrderStatus $status={order.status}>{order.status}</OrderStatus>
          </OrderHeader>
          <OrderContent>
            <ItemsList>
              {order.items.map((item, index) => (
                <OrderItem key={index}>
                  <ItemInfo>
                    <ItemName>{item.name}</ItemName>
                    <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                  </ItemInfo>
                  <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                </OrderItem>
              ))}
            </ItemsList>
            <OrderTotal>
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </OrderTotal>
          </OrderContent>
        </OrderCard>
      </Container>
    );
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filter);

  return (
    <Container>
      <Header>
        <Title>Your Orders</Title>
        <BackButton onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </BackButton>
      </Header>

      <FiltersContainer>
        <FilterButton 
          $active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All Orders
        </FilterButton>
        <FilterButton 
          $active={filter === 'processing'} 
          onClick={() => setFilter('processing')}
        >
          Processing
        </FilterButton>
        <FilterButton 
          $active={filter === 'shipped'} 
          onClick={() => setFilter('shipped')}
        >
          Shipped
        </FilterButton>
        <FilterButton 
          $active={filter === 'delivered'} 
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </FilterButton>
      </FiltersContainer>

      <OrdersGrid>
        {filteredOrders.map(order => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <OrderInfo>
                <OrderId>Order #{order.id}</OrderId>
                <OrderDate>{order.date}</OrderDate>
              </OrderInfo>
              <OrderStatus $status={order.status}>
                {order.status}
              </OrderStatus>
            </OrderHeader>
            <OrderContent>
              <ItemsList>
                {order.items.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemInfo>
                      <ItemName>{item.name}</ItemName>
                      <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                    </ItemInfo>
                    <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                  </OrderItem>
                ))}
              </ItemsList>
              <OrderTotal>
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </OrderTotal>
            </OrderContent>
          </OrderCard>
        ))}
      </OrdersGrid>
    </Container>
  );
};

export default Orders; 