import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const MainContainer = styled.main`
`;

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!);

const App: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <CartProvider>
          <GlobalStyles />
          <Router>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <Navbar />
            <MainContainer id="main-content">
              <AppRoutes />
            </MainContainer>
          </Router>
        </CartProvider>
      </AuthProvider>
    </Elements>
  );
};

export default App;
