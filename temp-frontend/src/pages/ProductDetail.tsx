import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { products } from '../data/products';
import { Product } from '../types/index';
import { useCart } from '../context/CartContext';
import Reviews from '../components/Reviews';
import { api } from '../services/api';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  padding: 6rem 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: #f7fafc;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: grab;
  touch-action: pan-y pinch-zoom;

  &:active {
    cursor: grabbing;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  padding: 1rem;
  user-select: none;
  -webkit-user-drag: none;
`;

const NavigationArrow = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 2;
  opacity: 0;
  ${MainImageContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    background: white;
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &::before {
    content: '';
    width: 16px;
    height: 16px;
    border-top: 3px solid #2c5282;
    border-right: 3px solid #2c5282;
    transform: ${props => props.direction === 'left' ? 'rotate(-135deg)' : 'rotate(45deg)'};
  }
`;

const ThumbnailRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Thumbnail = styled.img<{ $active: boolean }>`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: ${props => props.$active ? '2px solid #2c5282' : '2px solid transparent'};
  opacity: ${props => props.$active ? 1 : 0.7};
  padding: 2px;
  
  &:hover {
    opacity: 1;
    transform: translateY(-2px);
  }
`;

const ColorThumbnails = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
`;

const ProductInfo = styled.div`
  padding: 3rem 2rem;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  color: #1a365d;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #2c5282;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '$';
    font-size: 1.4rem;
    opacity: 0.8;
  }
`;

const ProductDescription = styled.p`
  color: #4a5568;
  line-height: 1.8;
  font-size: 1.1rem;
  margin: 1.5rem 0;
`;

const FeaturesList = styled.ul`
  list-style: none;
  margin: 2rem 0;
  padding: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #4a5568;
  font-size: 1.1rem;

  &:before {
    content: "✓";
    color: #2c5282;
    font-weight: bold;
    margin-right: 1rem;
  }
`;

const SpecificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 12px;
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SpecLabel = styled.span`
  font-size: 0.9rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SpecValue = styled.span`
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 500;
`;

const Button = styled.button`
  background-color: #2c5282;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #2b6cb0;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const QuantityButton = styled.button`
  background: #edf2f7;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
`;

const ColorSection = styled.div`
  margin: 2rem 0;
`;

const ColorLabel = styled.p`
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$selected ? '#2c5282' : '#e2e8f0'};
  border-radius: 8px;
  background: ${props => props.$selected ? '#ebf8ff' : 'white'};
  color: ${props => props.$selected ? '#2c5282' : '#4a5568'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2c5282;
    background: ${props => props.$selected ? '#ebf8ff' : '#f7fafc'};
  }
`;

const ArrowWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const BackButtonText = styled.span`
  margin-left: 0.5rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  color: #2c5282;
  font-size: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  transition: color 0.2s;

  &:hover {
    color: #2b6cb0;
  }
`;

interface Color {
  name: string;
  image: string;
}

interface ProductWithQuantity extends Product {
  quantity: number;
  selectedColor: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.getProduct(id!);
        if (response.status === 'success' && response.data) {
          setProduct({
            ...response.data,
            colors: response.data.colors ?? [],
          });
        } else {
          // Fallback to local data if backend returns no data
          const localProduct = products.find(p => String(p.id) === String(id));
          setProduct(localProduct ?? null);
        }
      } catch {
        // Fallback to local data if backend is unavailable
        const localProduct = products.find(p => String(p.id) === String(id));
        setProduct(localProduct ?? null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      fontSize: '1.2rem',
      color: '#2c5282',
      paddingTop: '5rem'
    }}>
      Loading product...
    </div>
  );

  if (!product) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      paddingTop: '5rem',
      gap: '1rem'
    }}>
      <h2 style={{ color: '#2c5282', fontSize: '1.5rem' }}>Product Not Found</h2>
      <p style={{ color: '#4a5568' }}>The product you are looking for does not exist.</p>
      <button
        onClick={() => navigate('/')}
        style={{
          background: '#2c5282',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Back to Home
      </button>
    </div>
  );

  const productImages = [
    "https://s.alicdn.com/@sc04/kf/H4157de6f908846c8a9c3427eda5483d1P.jpg_720x720q50.jpg",
    "https://s.alicdn.com/@sc04/kf/Haf5354626af240c984aa9c5d2e2aeca0X.jpg_720x720q50.jpg",
    "https://s.alicdn.com/@sc04/kf/H85e4add518f24d4498807812d6e9a260F.jpg_720x720q50.jpg",
    "https://s.alicdn.com/@sc04/kf/H4157de6f908846c8a9c3427eda5483d1P.jpg?avif=close",
    "https://s.alicdn.com/@sc04/kf/Ha5a083aaaea8453bb941aaf1c5ee8d6fY.jpg?avif=close"
  ];

  const allImages = [...productImages, ...(product.colors as Color[]).map(color => color.image)];
  const currentIndex = currentImageIndex;

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    updateSelectedColor();
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    updateSelectedColor();
  };

  const updateSelectedColor = () => {
    if (currentImageIndex < productImages.length) {
      setSelectedColor(`view${currentImageIndex}`);
    } else {
      const colorIndex = currentImageIndex - productImages.length;
      setSelectedColor((product.colors as Color[])[colorIndex].name);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    updateSelectedColor();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart && touchEnd) {
      const diff = touchStart - touchEnd;
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          handleNextImage();
        } else {
          handlePreviousImage();
        }
      }
      setTouchStart(null);
      setTouchEnd(null);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedColor) {
      alert('Please select a color');
      return;
    }

    const productWithQuantity: ProductWithQuantity = {
      ...product,
      quantity,
      selectedColor
    };

    await addToCart(productWithQuantity);
    navigate('/cart');
  };

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <span style={{ fontSize: '16px', lineHeight: 1 }}>←</span>
        <BackButtonText>Back to Home</BackButtonText>
      </BackButton>

      <ProductLayout>
        <ImageContainer>
          <MainImageContainer
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ProductImage
              src={allImages[currentIndex]}
              alt={product.name}
            />
            <NavigationArrow direction="left" onClick={handlePreviousImage} />
            <NavigationArrow direction="right" onClick={handleNextImage} />
          </MainImageContainer>
          <ThumbnailRow>
            {allImages.map((image, index) => (
              <Thumbnail
                key={index}
                src={image}
                alt={`${product.name} view ${index + 1}`}
                $active={currentIndex === index}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </ThumbnailRow>
        </ImageContainer>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductPrice>{product.price.toFixed(2)}</ProductPrice>
          <ProductDescription>{product.description}</ProductDescription>

          <ColorSection>
            <ColorLabel>Available Colors:</ColorLabel>
            <ColorOptions>
              {(product.colors ?? []).map((color) => (
                <ColorOption
                  key={color.name}
                  $selected={selectedColor === color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setCurrentImageIndex(productImages.length + (product.colors?.findIndex(c => c.name === color.name) ?? 0));
                  }}
                >
                  {color.name}
                </ColorOption>
              ))}
            </ColorOptions>
          </ColorSection>

          <FeaturesList>
            {(product.features ?? []).map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </FeaturesList>

          <SpecificationsGrid>
            {Object.entries(product.specifications ?? {}).map(([key, value]) => (
              <SpecItem key={key}>
                <SpecLabel>{key}</SpecLabel>
                <SpecValue>
                  {Array.isArray(value) ? value.join(', ') : value}
                </SpecValue>
              </SpecItem>
            ))}
          </SpecificationsGrid>

          <QuantityContainer>
            <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton onClick={() => setQuantity(quantity + 1)}>+</QuantityButton>
          </QuantityContainer>

          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </ProductInfo>
      </ProductLayout>

      <Reviews productId={product.id as any} />
    </Container>
  );
};

export default ProductDetail; 