import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
`;

const MainSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SideSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #e2e8f0;
    z-index: 1;
  }
`;

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const StepNumber = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${props => 
    props.$completed ? '#48bb78' : 
    props.$active ? '#4299e1' : '#e2e8f0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const StepLabel = styled.span<{ $active?: boolean; $completed?: boolean }>`
  font-size: 0.875rem;
  color: ${props => 
    props.$completed ? '#48bb78' : 
    props.$active ? '#4299e1' : '#718096'};
  font-weight: ${props => props.$active ? '600' : '400'};
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const OrderSummary = styled.div`
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$variant === 'primary' ? '#4299e1' : '#fff'};
  color: ${props => props.$variant === 'primary' ? '#fff' : '#4a5568'};
  border: ${props => props.$variant === 'primary' ? 'none' : '1px solid #e2e8f0'};

  &:hover {
    transform: translateY(-1px);
    ${props => props.$variant === 'primary' 
      ? 'background: #3182ce;' 
      : 'background: #f7fafc;'}
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PhoneInputGroup = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.5rem;
`;

const CountrySelect = styled.select`
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: white;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }
`;

const CalendarWrapper = styled.div`
  position: relative;
`;

const CalendarDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 240px;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`;

const CalendarButton = styled.button<{ $selected?: boolean }>`
  padding: 0.5rem;
  text-align: center;
  border: 1px solid ${props => props.$selected ? '#4299e1' : '#e2e8f0'};
  border-radius: 0.25rem;
  background: ${props => props.$selected ? '#ebf8ff' : 'white'};
  color: ${props => props.$selected ? '#4299e1' : '#4a5568'};
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.$selected ? '#ebf8ff' : '#f7fafc'};
  }

  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const YearSelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const YearButton = styled.button`
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:hover {
    color: #4299e1;
  }

  &:disabled {
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    countryCode: '+1',  // Default to US
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handleYearChange = (increment: number) => {
    setSelectedYear(prev => prev + increment);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    const monthStr = String(monthIndex + 1).padStart(2, '0');
    const yearStr = String(selectedYear).slice(-2);
    setFormData(prev => ({
      ...prev,
      expiryDate: `${monthStr}/${yearStr}`
    }));
    setShowCalendar(false);
  };

  const isMonthDisabled = (monthIndex: number) => {
    if (selectedYear === currentYear) {
      return monthIndex < currentMonth;
    }
    return false;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.calendar-wrapper')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add country codes data
  const countryCodes = [
    { code: '+93', country: 'Afghanistan' },
    { code: '+355', country: 'Albania' },
    { code: '+213', country: 'Algeria' },
    { code: '+376', country: 'Andorra' },
    { code: '+244', country: 'Angola' },
    { code: '+1', country: 'Antigua and Barbuda' },
    { code: '+54', country: 'Argentina' },
    { code: '+374', country: 'Armenia' },
    { code: '+61', country: 'Australia' },
    { code: '+43', country: 'Austria' },
    { code: '+994', country: 'Azerbaijan' },
    { code: '+1', country: 'Bahamas' },
    { code: '+973', country: 'Bahrain' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+1', country: 'Barbados' },
    { code: '+375', country: 'Belarus' },
    { code: '+32', country: 'Belgium' },
    { code: '+501', country: 'Belize' },
    { code: '+229', country: 'Benin' },
    { code: '+975', country: 'Bhutan' },
    { code: '+591', country: 'Bolivia' },
    { code: '+387', country: 'Bosnia and Herzegovina' },
    { code: '+267', country: 'Botswana' },
    { code: '+55', country: 'Brazil' },
    { code: '+673', country: 'Brunei' },
    { code: '+359', country: 'Bulgaria' },
    { code: '+226', country: 'Burkina Faso' },
    { code: '+257', country: 'Burundi' },
    { code: '+855', country: 'Cambodia' },
    { code: '+237', country: 'Cameroon' },
    { code: '+1', country: 'Canada' },
    { code: '+238', country: 'Cape Verde' },
    { code: '+236', country: 'Central African Republic' },
    { code: '+235', country: 'Chad' },
    { code: '+56', country: 'Chile' },
    { code: '+86', country: 'China' },
    { code: '+57', country: 'Colombia' },
    { code: '+269', country: 'Comoros' },
    { code: '+242', country: 'Congo' },
    { code: '+243', country: 'Congo, Democratic Republic of the' },
    { code: '+506', country: 'Costa Rica' },
    { code: '+225', country: "Côte d'Ivoire" },
    { code: '+385', country: 'Croatia' },
    { code: '+53', country: 'Cuba' },
    { code: '+357', country: 'Cyprus' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+45', country: 'Denmark' },
    { code: '+253', country: 'Djibouti' },
    { code: '+1', country: 'Dominica' },
    { code: '+1', country: 'Dominican Republic' },
    { code: '+670', country: 'East Timor' },
    { code: '+593', country: 'Ecuador' },
    { code: '+20', country: 'Egypt' },
    { code: '+503', country: 'El Salvador' },
    { code: '+240', country: 'Equatorial Guinea' },
    { code: '+291', country: 'Eritrea' },
    { code: '+372', country: 'Estonia' },
    { code: '+251', country: 'Ethiopia' },
    { code: '+679', country: 'Fiji' },
    { code: '+358', country: 'Finland' },
    { code: '+33', country: 'France' },
    { code: '+241', country: 'Gabon' },
    { code: '+220', country: 'Gambia' },
    { code: '+995', country: 'Georgia' },
    { code: '+49', country: 'Germany' },
    { code: '+233', country: 'Ghana' },
    { code: '+30', country: 'Greece' },
    { code: '+1', country: 'Grenada' },
    { code: '+502', country: 'Guatemala' },
    { code: '+224', country: 'Guinea' },
    { code: '+245', country: 'Guinea-Bissau' },
    { code: '+592', country: 'Guyana' },
    { code: '+509', country: 'Haiti' },
    { code: '+504', country: 'Honduras' },
    { code: '+852', country: 'Hong Kong' },
    { code: '+36', country: 'Hungary' },
    { code: '+354', country: 'Iceland' },
    { code: '+91', country: 'India' },
    { code: '+62', country: 'Indonesia' },
    { code: '+98', country: 'Iran' },
    { code: '+964', country: 'Iraq' },
    { code: '+353', country: 'Ireland' },
    { code: '+972', country: 'Israel' },
    { code: '+39', country: 'Italy' },
    { code: '+1', country: 'Jamaica' },
    { code: '+81', country: 'Japan' },
    { code: '+962', country: 'Jordan' },
    { code: '+7', country: 'Kazakhstan' },
    { code: '+254', country: 'Kenya' },
    { code: '+686', country: 'Kiribati' },
    { code: '+850', country: 'Korea, North' },
    { code: '+82', country: 'Korea, South' },
    { code: '+383', country: 'Kosovo' },
    { code: '+965', country: 'Kuwait' },
    { code: '+996', country: 'Kyrgyzstan' },
    { code: '+856', country: 'Laos' },
    { code: '+371', country: 'Latvia' },
    { code: '+961', country: 'Lebanon' },
    { code: '+266', country: 'Lesotho' },
    { code: '+231', country: 'Liberia' },
    { code: '+218', country: 'Libya' },
    { code: '+423', country: 'Liechtenstein' },
    { code: '+370', country: 'Lithuania' },
    { code: '+352', country: 'Luxembourg' },
    { code: '+853', country: 'Macau' },
    { code: '+389', country: 'Macedonia' },
    { code: '+261', country: 'Madagascar' },
    { code: '+265', country: 'Malawi' },
    { code: '+60', country: 'Malaysia' },
    { code: '+960', country: 'Maldives' },
    { code: '+223', country: 'Mali' },
    { code: '+356', country: 'Malta' },
    { code: '+692', country: 'Marshall Islands' },
    { code: '+222', country: 'Mauritania' },
    { code: '+230', country: 'Mauritius' },
    { code: '+52', country: 'Mexico' },
    { code: '+691', country: 'Micronesia' },
    { code: '+373', country: 'Moldova' },
    { code: '+377', country: 'Monaco' },
    { code: '+976', country: 'Mongolia' },
    { code: '+382', country: 'Montenegro' },
    { code: '+212', country: 'Morocco' },
    { code: '+258', country: 'Mozambique' },
    { code: '+95', country: 'Myanmar' },
    { code: '+264', country: 'Namibia' },
    { code: '+674', country: 'Nauru' },
    { code: '+977', country: 'Nepal' },
    { code: '+31', country: 'Netherlands' },
    { code: '+64', country: 'New Zealand' },
    { code: '+505', country: 'Nicaragua' },
    { code: '+227', country: 'Niger' },
    { code: '+234', country: 'Nigeria' },
    { code: '+47', country: 'Norway' },
    { code: '+968', country: 'Oman' },
    { code: '+92', country: 'Pakistan' },
    { code: '+680', country: 'Palau' },
    { code: '+970', country: 'Palestine' },
    { code: '+507', country: 'Panama' },
    { code: '+675', country: 'Papua New Guinea' },
    { code: '+595', country: 'Paraguay' },
    { code: '+51', country: 'Peru' },
    { code: '+63', country: 'Philippines' },
    { code: '+48', country: 'Poland' },
    { code: '+351', country: 'Portugal' },
    { code: '+974', country: 'Qatar' },
    { code: '+40', country: 'Romania' },
    { code: '+7', country: 'Russia' },
    { code: '+250', country: 'Rwanda' },
    { code: '+1', country: 'Saint Kitts and Nevis' },
    { code: '+1', country: 'Saint Lucia' },
    { code: '+1', country: 'Saint Vincent and the Grenadines' },
    { code: '+685', country: 'Samoa' },
    { code: '+378', country: 'San Marino' },
    { code: '+239', country: 'São Tomé and Príncipe' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+221', country: 'Senegal' },
    { code: '+381', country: 'Serbia' },
    { code: '+248', country: 'Seychelles' },
    { code: '+232', country: 'Sierra Leone' },
    { code: '+65', country: 'Singapore' },
    { code: '+421', country: 'Slovakia' },
    { code: '+386', country: 'Slovenia' },
    { code: '+677', country: 'Solomon Islands' },
    { code: '+252', country: 'Somalia' },
    { code: '+27', country: 'South Africa' },
    { code: '+211', country: 'South Sudan' },
    { code: '+34', country: 'Spain' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+249', country: 'Sudan' },
    { code: '+597', country: 'Suriname' },
    { code: '+268', country: 'Swaziland' },
    { code: '+46', country: 'Sweden' },
    { code: '+41', country: 'Switzerland' },
    { code: '+963', country: 'Syria' },
    { code: '+886', country: 'Taiwan' },
    { code: '+992', country: 'Tajikistan' },
    { code: '+255', country: 'Tanzania' },
    { code: '+66', country: 'Thailand' },
    { code: '+228', country: 'Togo' },
    { code: '+676', country: 'Tonga' },
    { code: '+1', country: 'Trinidad and Tobago' },
    { code: '+216', country: 'Tunisia' },
    { code: '+90', country: 'Turkey' },
    { code: '+993', country: 'Turkmenistan' },
    { code: '+688', country: 'Tuvalu' },
    { code: '+256', country: 'Uganda' },
    { code: '+380', country: 'Ukraine' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+1', country: 'United States' },
    { code: '+598', country: 'Uruguay' },
    { code: '+998', country: 'Uzbekistan' },
    { code: '+678', country: 'Vanuatu' },
    { code: '+379', country: 'Vatican City' },
    { code: '+58', country: 'Venezuela' },
    { code: '+84', country: 'Vietnam' },
    { code: '+967', country: 'Yemen' },
    { code: '+260', country: 'Zambia' },
    { code: '+263', country: 'Zimbabwe' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'phone' || e.target.name === 'cvv') {
      // Only allow numbers for phone and CVV
      const value = e.target.value.replace(/[^0-9]/g, '');
      // Limit CVV to 3 or 4 digits
      if (e.target.name === 'cvv' && value.length > 4) {
        return;
      }
      setFormData(prev => ({
        ...prev,
        [e.target.name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      // Create order in backend after shipping info
      try {
        const shippingAddress = `${formData.address}, ${formData.city}, ${formData.country}, ${formData.zipCode}`;
        const orderResponse = await api.createOrder({
          shippingAddress,
          paymentMethod: 'card',
        });
        if (orderResponse.status === 'success' && orderResponse.data?.id) {
          setOrderId(orderResponse.data.id);
          setCurrentStep(3);
        } else {
          alert(orderResponse.message || 'Failed to create order.');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to create order.');
      }
      return;
    }
    // Payment step
    setPaymentError(null);
    setPaymentProcessing(true);
    if (!stripe || !elements) {
      setPaymentError('Stripe has not loaded yet.');
      setPaymentProcessing(false);
      return;
    }
    try {
      if (!orderId) {
        setPaymentError('Order ID is missing.');
        setPaymentProcessing(false);
        return;
      }
      const response = await api.createPaymentIntent(orderId);
      if (response.status !== 'success' || !response.data?.clientSecret) {
        setPaymentError('Failed to create payment intent.');
        setPaymentProcessing(false);
        return;
      }
      const clientSecret = response.data.clientSecret;
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setPaymentError('Card element not found.');
        setPaymentProcessing(false);
        return;
      }
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.cardName,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.zipCode,
              country: formData.country,
            },
          },
        },
      });
      if (error) {
        setPaymentError(error.message || 'Payment failed.');
        setPaymentProcessing(false);
        return;
      }
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        clearCart();
        navigate('/order-success');
      } else {
        setPaymentError('Payment was not successful.');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment failed.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">Phone</Label>
              <PhoneInputGroup>
                <CountrySelect
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  {countryCodes.map(({ code, country }) => (
                    <option key={code + '-' + country} value={code}>
                      {code} ({country})
                    </option>
                  ))}
                </CountrySelect>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  required
                />
              </PhoneInputGroup>
            </FormGroup>
          </>
        );
      case 2:
        return (
          <>
            <FormGroup>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="country">Country</Label>
              <CountrySelect
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select a country</option>
                {countryCodes.map(({ code, country }) => (
                  <option key={code + '-' + country} value={country}>
                    {country}
                  </option>
                ))}
              </CountrySelect>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </>
        );
      case 3:
        return (
          <>
            <FormGroup>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Card Details</Label>
              <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fafbfc' }}>
                <CardElement options={{ hidePostalCode: true }} />
              </div>
            </FormGroup>
            {paymentError && <div style={{ color: 'red', marginTop: '1rem' }}>{paymentError}</div>}
            {paymentProcessing && <div style={{ color: '#4299e1', marginTop: '1rem' }}>Processing payment...</div>}
            {paymentSuccess && <div style={{ color: 'green', marginTop: '1rem' }}>Payment successful!</div>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Container>
      <Title>Checkout</Title>
      
      <StepIndicator>
        <Step $active={currentStep === 1} $completed={currentStep > 1}>
          <StepNumber $active={currentStep === 1} $completed={currentStep > 1}>1</StepNumber>
          <StepLabel $active={currentStep === 1} $completed={currentStep > 1}>Contact Info</StepLabel>
        </Step>
        <Step $active={currentStep === 2} $completed={currentStep > 2}>
          <StepNumber $active={currentStep === 2} $completed={currentStep > 2}>2</StepNumber>
          <StepLabel $active={currentStep === 2} $completed={currentStep > 2}>Shipping</StepLabel>
        </Step>
        <Step $active={currentStep === 3} $completed={currentStep > 3}>
          <StepNumber $active={currentStep === 3} $completed={currentStep > 3}>3</StepNumber>
          <StepLabel $active={currentStep === 3} $completed={currentStep > 3}>Payment</StepLabel>
        </Step>
      </StepIndicator>

      <CheckoutGrid>
        <MainSection>
          <Form onSubmit={handleSubmit}>
            {renderStep()}
            <ButtonGroup>
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Back
                </Button>
              )}
              <Button type="submit" $variant="primary">
                {currentStep === 3 ? 'Place Order' : 'Continue'}
              </Button>
            </ButtonGroup>
          </Form>
        </MainSection>

        <SideSection>
          <Title>Order Summary</Title>
          <OrderSummary>
            {items.map((item: CartItem) => (
              <SummaryItem key={item.id}>
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </SummaryItem>
            ))}
            <SummaryItem>
              <span>Shipping</span>
              <span>Free</span>
            </SummaryItem>
            <SummaryTotal>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </SummaryTotal>
          </OrderSummary>
        </SideSection>
      </CheckoutGrid>
    </Container>
  );
};

export default Checkout; 