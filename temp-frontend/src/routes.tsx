import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import LoadingSpinner from './components/feedback/LoadingSpinner';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Support = React.lazy(() => import('./pages/Support'));
const Cart = React.lazy(() => import('./pages/Cart'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Refund = React.lazy(() => import('./pages/Refund'));
const Terms = React.lazy(() => import('./pages/Terms'));
const EditProfile = React.lazy(() => import('./pages/EditProfile'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const OrderSuccess = React.lazy(() => import('./pages/OrderSuccess'));

const MainContainer = styled.main`
  min-height: 100vh;
`;

const AppRoutes: React.FC = () => {
  return (
    <MainContainer>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/support" element={<Support />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </Suspense>
    </MainContainer>
  );
};

export default AppRoutes; 