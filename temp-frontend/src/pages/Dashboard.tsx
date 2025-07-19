import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const DashboardWrapper = styled.div`
  max-width: 1200px;
  margin: 2.5rem auto 0 auto;
  padding: 5rem 1.5rem 2rem 1.5rem;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  color: #1a202c;
  font-weight: 700;
  margin: 0;
`;

const LogoutButton = styled.button`
  background: #e53e3e;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
  &:hover {
    background: #c53030;
    transform: translateY(-1px);
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 2rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 24px rgba(44, 82, 130, 0.07);
  border: none;
  min-height: 320px;
`;

const CardTitle = styled.h2`
  font-size: 1.15rem;
  color: #2d3748;
  font-weight: 700;
  margin-bottom: 1.25rem;
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f1f1f1;
  font-size: 0.98rem;
  &:last-child { border-bottom: none; }
`;

const InfoLabel = styled.span`
  color: #4a5568;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: #2d3748;
  font-weight: 500;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #edf2f7;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
`;

const OrderDate = styled.span`
  color: #718096;
  font-size: 0.85rem;
`;

const OrderStatus = styled.span`
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  background: #c6f6d5;
  color: #2f855a;
  margin-bottom: 0.5rem;
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.98rem;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #edf2f7;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.98rem;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f1f1f1;
  font-size: 0.98rem;
  &:last-child { border-bottom: none; }
`;

const SettingLabel = styled.span`
  color: #2d3748;
  font-weight: 500;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  width: 2.75rem;
  height: 1.5rem;
  border-radius: 9999px;
  background: ${props => props.$active ? '#48bb78' : '#e2e8f0'};
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  &::before {
    content: '';
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: white;
    top: 0.125rem;
    left: ${props => props.$active ? '1.375rem' : '0.125rem'};
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = () => {
    // Here you would call an API to update the user info
    setEditing(false);
    // Optionally update user context if needed
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DashboardWrapper>
      <DashboardHeader>
        <HeaderTitle>Welcome back, {profile.name || user?.name}</HeaderTitle>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </DashboardHeader>
      <DashboardGrid>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <CardTitle>Profile Information</CardTitle>
            {!editing && (
              <button style={{ background: '#4299e1', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setEditing(true)}>
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <ProfileInfo>
              <InfoItem>
                <InfoLabel>Name</InfoLabel>
                <input name="name" value={profile.name} onChange={handleProfileChange} style={{ flex: 1, marginLeft: 8, padding: '0.3rem', borderRadius: 4, border: '1px solid #e2e8f0' }} />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <input name="email" value={profile.email} onChange={handleProfileChange} style={{ flex: 1, marginLeft: 8, padding: '0.3rem', borderRadius: 4, border: '1px solid #e2e8f0' }} />
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <input name="phone" value={profile.phone} onChange={handleProfileChange} style={{ flex: 1, marginLeft: 8, padding: '0.3rem', borderRadius: 4, border: '1px solid #e2e8f0' }} />
              </InfoItem>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button style={{ background: '#48bb78', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }} onClick={handleProfileSave}>Save</button>
                <button style={{ background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, padding: '0.4rem 1.2rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </ProfileInfo>
          ) : (
            <ProfileInfo>
              <InfoItem><InfoLabel>Name</InfoLabel><InfoValue>{profile.name || 'Not set'}</InfoValue></InfoItem>
              <InfoItem><InfoLabel>Email</InfoLabel><InfoValue>{profile.email || 'Not set'}</InfoValue></InfoItem>
              <InfoItem><InfoLabel>Phone</InfoLabel><InfoValue>{profile.phone || 'Not set'}</InfoValue></InfoItem>
            </ProfileInfo>
          )}
        </Card>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <CardTitle>Recent Orders</CardTitle>
            <button style={{ background: '#4299e1', color: 'white', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/orders')}>
              View Details
            </button>
          </div>
          <OrderList>
            <OrderItem>
              <OrderHeader>
                <OrderId>Order #12345</OrderId>
                <OrderDate>Feb 15, 2024</OrderDate>
              </OrderHeader>
              <OrderStatus>Delivered</OrderStatus>
              <OrderDetails>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>3-in-1 Wireless Charging Station</span>
                  <span>$49.99</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span>$5.99</span>
                </div>
                <OrderTotal>
                  <span>Total</span>
                  <span>$55.98</span>
                </OrderTotal>
              </OrderDetails>
            </OrderItem>
          </OrderList>
        </Card>
        <Card>
          <CardTitle>Account Settings</CardTitle>
          <SettingsSection>
            <SettingItem>
              <SettingLabel>Email Notifications</SettingLabel>
              <ToggleButton $active={emailNotifications} onClick={() => setEmailNotifications(!emailNotifications)} />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Order Updates</SettingLabel>
              <ToggleButton $active={orderUpdates} onClick={() => setOrderUpdates(!orderUpdates)} />
            </SettingItem>
            <SettingItem>
              <SettingLabel>Marketing Emails</SettingLabel>
              <ToggleButton $active={marketingEmails} onClick={() => setMarketingEmails(!marketingEmails)} />
            </SettingItem>
          </SettingsSection>
        </Card>
      </DashboardGrid>
    </DashboardWrapper>
  );
};

export default Dashboard; 