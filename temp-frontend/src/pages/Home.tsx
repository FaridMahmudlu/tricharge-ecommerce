import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { products } from '../data/products';
import { Link } from 'react-router-dom';
import { Product } from '../types/index';
import { motion } from 'framer-motion';

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

const HomeContainer = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 6rem 2rem 4rem 2rem;
  color: white;
  text-align: center;
  background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const VideoContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transform: translateY(0);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const VideoIframe = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 1.5rem 0;
  max-width: 800px;
  text-align: center;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  color: #2c5282;
  border: none;
  border-radius: 50px;
  padding: 1.2rem 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    color: #1a365d;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const MainProductSection = styled.section`
  max-width: 1200px;
  margin: 2rem auto 4rem;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProductName = styled.h2`
  font-size: 2rem;
  color: #2c5282;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: 600;
  color: #2c5282;
  margin: 1rem 0;

  &::before {
    content: '$';
    font-size: 1.2rem;
    opacity: 0.8;
  }
`;

const ProductDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #4a5568;
  margin-bottom: 2rem;
`;

const ShopButton = styled.button`
  background: #2c5282;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1a365d;
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  background: #f7fafc;
  padding: 4rem 2rem;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #2c5282;
  text-align: center;
  margin-bottom: 3rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const KeyFeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #2c5282 0%, #4299e1 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: white;
  }

  h3 {
    color: #2d3748;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: #4a5568;
    line-height: 1.6;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;

    li {
      color: #4a5568;
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
      
      &:before {
        content: "✓";
        color: #4299e1;
        margin-right: 0.5rem;
        font-weight: bold;
      }
    }
  }
`;

const SpecsSection = styled.section`
  padding: 4rem 2rem;
`;

const SpecsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SpecsContent = styled.div``;

const SpecsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const SpecsItem = styled.li`
  font-size: 1.1rem;
  color: #4a5568;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #2c5282;
  }
`;

const ProductImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const TestimonialSection = styled.section`
  background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
  padding: 4rem 2rem;
  color: white;
`;

const TestimonialContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;

  ${SectionTitle} {
    color: white;
  }
`;

const Testimonial = styled.p`
  font-size: 1.3rem;
  font-style: italic;
  margin: 2rem 0;
  line-height: 1.6;
`;

const Author = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
`;

const KeyFeaturesSection = styled.section`
  padding: 5rem 2rem;
  background: #f8fafc;
`;

const KeyFeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;

  h2 {
    font-size: 2.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    color: #4a5568;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonSection = styled.section`
  padding: 5rem 2rem;
  background: white;
`;

const ComparisonContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  font-size: 1.05rem;
  box-shadow: 0 6px 24px rgba(44, 82, 130, 0.08);
  border-radius: 16px;
  overflow: hidden;

  th, td {
    padding: 1.5rem 1.25rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
    transition: background 0.2s;
  }

  th {
    background: #2c5282;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    white-space: nowrap;
    border-bottom: 2px solid #2c5282;
    letter-spacing: 0.02em;
    &:first-child {
      border-top-left-radius: 16px;
    }
    &:last-child {
      border-top-right-radius: 16px;
    }
  }

  tr {
    &:nth-child(even) {
      background: #f7fafc;
    }
    &:hover td {
      background: #e6f0fa;
    }
    &:last-child td {
      border-bottom: none;
    }
  }

  td {
    font-size: 1.05rem;
    &:first-child {
      font-weight: 600;
      color: #2c5282;
      background: #f1f6fb;
      border-left: 4px solid #2c5282;
    }
    &:nth-child(2) {
      background: #e6f0fa;
      font-weight: 600;
      color: #2c5282;
      border-right: 2px solid #b2c6e6;
    }
    .check {
      color: #38a169;
      font-size: 1.3rem;
      vertical-align: middle;
      margin-right: 0.3rem;
    }
    .x {
      color: #e53e3e;
      font-size: 1.3rem;
      vertical-align: middle;
      margin-right: 0.3rem;
    }
  }

  @media (max-width: 900px) {
    th, td {
      padding: 1rem 0.5rem;
      font-size: 0.98rem;
    }
    th {
      font-size: 1rem;
    }
  }
`;

const TableHighlight = styled.span`
  color: #2c5282;
  font-weight: 600;
`;

const FAQSection = styled.section`
  padding: 5rem 2rem;
  background: #f8fafc;
`;

const FAQContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FAQTitle = styled.h2`
  color: #2c5282;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const FAQQuestion = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  text-align: left;
  padding: 1.25rem;
  background: white;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 1.125rem;
  color: #2d3748;
  font-weight: 500;

  &:hover {
    background: #f7fafc;
  }

  svg {
    transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
    transition: transform 0.2s;
  }
`;

const FAQAnswer = styled.div<{ $isOpen: boolean }>`
  padding: ${props => props.$isOpen ? '0 1.25rem 1.25rem' : '0 1.25rem'};
  max-height: ${props => props.$isOpen ? '500px' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: all 0.3s;
  overflow: hidden;
  color: #4a5568;
  line-height: 1.6;
`;

interface FAQItemType {
  question: string;
  answer: string;
}

const faqData: FAQItemType[] = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment gateway."
  },
  {
    question: "How long does shipping take?",
    answer: "Domestic shipping typically takes 3-5 business days. International shipping can take 7-14 business days depending on the destination. We provide tracking information for all orders."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for all unused items in their original packaging. Simply contact our customer service team to initiate a return. Return shipping costs may apply."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can calculate shipping costs at checkout."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order through your account dashboard."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <FAQSection>
      <FAQContainer>
        <FAQTitle>Frequently Asked Questions</FAQTitle>
        <FAQList>
          {faqData.map((faq, index) => (
            <FAQItem key={index}>
              <FAQQuestion
                $isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </FAQQuestion>
              <FAQAnswer $isOpen={openIndex === index}>
                {faq.answer}
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>
      </FAQContainer>
    </FAQSection>
  );
};

const Footer = styled.footer`
  background: #2c5282;
  color: white;
  padding: 4rem 2rem 2rem;
  margin-top: 2rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: #e2e8f0;
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;

    &:hover {
      color: white;
      text-decoration: underline;
    }
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e2e8f0;
  font-size: 0.9rem;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;

  a {
    color: #e2e8f0;
    transition: color 0.2s;

    &:hover {
      color: white;
    }
  }
`;

const FooterComponent: React.FC = () => {
  return (
    <Footer>
      <FooterContainer>
        <FooterSection>
          <h3>Need Help?</h3>
          <ul>
            <li><Link to="/product/1">Shop now</Link></li>
            <li><Link to="/track-order">Track your order</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
          </ul>
        </FooterSection>
        <FooterSection>
          <h3>Policies</h3>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/refund">Refund Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </FooterSection>
      </FooterContainer>
      <FooterBottom>
        <div>© 2025 3-in-1 Wireless Charging Station. All rights reserved.</div>
        <SocialLinks>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
            </svg>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.668-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </SocialLinks>
      </FooterBottom>
    </Footer>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const product = products[0]; // Main product

  if (!product) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: '#2c5282', fontSize: '2rem' }}>No product found. Please add a product to display.</div>;
  }

  return (
    <HomeContainer>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ position: 'relative' }}
      >
        <HeroSection>
          <HeroContent>
            <HeroTitle>3-in-1 Wireless Charging Station</HeroTitle>
            <HeroSubtitle>
              Charge your phone, smartwatch, and earphones all at once with our premium 15W wireless charging dock.
            </HeroSubtitle>
            <VideoContainer>
              <VideoIframe
                src="https://video.aliexpress-media.com/play/u/ae_sg_item/p/1/e/6/t/10301/1100061102362.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            </VideoContainer>
            <CTAButton onClick={() => navigate(`/product/${product.id}`)}>Shop Now</CTAButton>
          </HeroContent>
        </HeroSection>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <KeyFeaturesSection>
          <KeyFeaturesContainer>
            <SectionHeader>
              <h2>Why Choose Our 3-in-1 Wireless Charger?</h2>
              <p>Experience the convenience of charging multiple devices simultaneously with our premium charging solution</p>
            </SectionHeader>
            <FeaturesGrid>
              <KeyFeatureCard>
                <div className="icon">⚡</div>
                <h3>Fast Charging Technology</h3>
                <p>Advanced 15W fast charging capability for optimal charging speed</p>
                <ul>
                  <li>15W maximum output power</li>
                  <li>Multiple output options: 9V/2A, 5V/3A, 12V/1.5A</li>
                  <li>Supports 3W/5W/7.5W/10W/15W wireless output</li>
                </ul>
              </KeyFeatureCard>

              <KeyFeatureCard>
                <div className="icon">🔄</div>
                <h3>Versatile Compatibility</h3>
                <p>Charge all your essential devices with one station</p>
                <ul>
                  <li>Compatible with smartphones</li>
                  <li>Dedicated smartwatch charging</li>
                  <li>Earphone charging support</li>
                  <li>Works with all Qi-enabled devices</li>
                </ul>
              </KeyFeatureCard>

              <KeyFeatureCard>
                <div className="icon">💡</div>
                <h3>Smart Features</h3>
                <p>Enhanced functionality for better user experience</p>
                <ul>
                  <li>Built-in ambient night light</li>
                  <li>Foldable design for portability</li>
                  <li>Type-C input port</li>
                  <li>CE, FCC, ROHS certified</li>
                </ul>
              </KeyFeatureCard>

              <KeyFeatureCard>
                <div className="icon">🛡️</div>
                <h3>Safety First</h3>
                <p>Advanced protection for worry-free charging</p>
                <ul>
                  <li>Over-voltage protection</li>
                  <li>Temperature control</li>
                  <li>Short circuit protection</li>
                  <li>Foreign object detection</li>
                </ul>
              </KeyFeatureCard>

              <KeyFeatureCard>
                <div className="icon">🎯</div>
                <h3>Professional Design</h3>
                <p>Thoughtfully crafted for maximum convenience</p>
                <ul>
                  <li>Space-saving 3-in-1 design</li>
                  <li>Premium build quality</li>
                  <li>Modern aesthetic appeal</li>
                  <li>Compact footprint</li>
                </ul>
              </KeyFeatureCard>

              <KeyFeatureCard>
                <div className="icon">✨</div>
                <h3>Added Benefits</h3>
                <p>Extra features that make the difference</p>
                <ul>
                  <li>Retail package included</li>
                  <li>Customizable logo option</li>
                  <li>12-month warranty</li>
                  <li>Professional after-sales support</li>
                </ul>
              </KeyFeatureCard>
            </FeaturesGrid>
          </KeyFeaturesContainer>
        </KeyFeaturesSection>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <MainProductSection>
          <ProductCard>
            <ProductImageContainer>
              <ProductImage src={product.image} alt={product.name} />
            </ProductImageContainer>
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price.toFixed(2)}</ProductPrice>
              <ProductDescription>{product.description}</ProductDescription>
              <ShopButton onClick={() => navigate(`/product/${product.id}`)}>
                View Details
              </ShopButton>
            </ProductInfo>
          </ProductCard>
        </MainProductSection>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <ComparisonSection>
          <ComparisonContainer>
            <SectionHeader>
              <h2>Why We're Different</h2>
              <p>See how our 3-in-1 wireless charger compares to other charging solutions</p>
            </SectionHeader>
            <TableContainer>
              <ComparisonTable>
                <thead>
                  <tr>
                    <th>Features</th>
                    <th>Our 3-in-1 Charger</th>
                    <th>Standard Wireless Charger</th>
                    <th>Basic Multi-Device Charger</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Fast Charging Speed</td>
                    <td><TableHighlight>15W Maximum</TableHighlight></td>
                    <td>5W-10W</td>
                    <td>5W-7.5W</td>
                  </tr>
                  <tr>
                    <td>Simultaneous Device Charging</td>
                    <td><span className="check">✓</span> Up to 3 devices</td>
                    <td><span className="x">✕</span> Single device only</td>
                    <td><span className="check">✓</span> 2 devices max</td>
                  </tr>
                  <tr>
                    <td>Smart Device Compatibility</td>
                    <td><span className="check">✓</span> Phone, Watch & Earbuds</td>
                    <td><span className="check">✓</span> Phone only</td>
                    <td><span className="check">✓</span> Limited compatibility</td>
                  </tr>
                  <tr>
                    <td>Safety Certifications</td>
                    <td><span className="check">✓</span> CE, FCC, ROHS</td>
                    <td><span className="check">✓</span> Basic certification</td>
                    <td><span className="check">✓</span> Basic certification</td>
                  </tr>
                  <tr>
                    <td>Ambient Night Light</td>
                    <td><span className="check">✓</span></td>
                    <td><span className="x">✕</span></td>
                    <td><span className="x">✕</span></td>
                  </tr>
                  <tr>
                    <td>Foldable Design</td>
                    <td><span className="check">✓</span></td>
                    <td><span className="x">✕</span></td>
                    <td><span className="x">✕</span></td>
                  </tr>
                  <tr>
                    <td>Multiple Output Options</td>
                    <td><span className="check">✓</span> 3W/5W/7.5W/10W/15W</td>
                    <td><span className="x">✕</span> Fixed output</td>
                    <td><span className="check">✓</span> Limited options</td>
                  </tr>
                  <tr>
                    <td>Protection Features</td>
                    <td><span className="check">✓</span> Comprehensive</td>
                    <td><span className="check">✓</span> Basic</td>
                    <td><span className="check">✓</span> Basic</td>
                  </tr>
                  <tr>
                    <td>Warranty Period</td>
                    <td><TableHighlight>12 Months</TableHighlight></td>
                    <td>6 Months</td>
                    <td>6 Months</td>
                  </tr>
                </tbody>
              </ComparisonTable>
            </TableContainer>
          </ComparisonContainer>
        </ComparisonSection>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <SpecsSection>
          <SpecsContainer>
            <SpecsContent>
              <SectionTitle>Technical Specifications</SectionTitle>
              <SpecsList>
                {(product.features ?? []).map((feature: string, index: number) => (
                  <SpecsItem key={index}>{feature}</SpecsItem>
                ))}
              </SpecsList>
              <ShopButton onClick={() => navigate(`/product/${product.id}`)}>
                See Full Specifications
              </ShopButton>
            </SpecsContent>
            <ProductImageGallery>
              <GalleryImage src="https://s.alicdn.com/@sc04/kf/Ha5a083aaaea8453bb941aaf1c5ee8d6fY.jpg_720x720q50.jpg" alt="Product view 1" />
              <GalleryImage src="https://s.alicdn.com/@sc04/kf/Hedb053c5b1d842b79c8887382ad7a2d0j.jpg_720x720q50.jpg" alt="Product view 2" />
              <GalleryImage src="https://s.alicdn.com/@sc04/kf/H39bf4944d26c4a1fbecb796104f6f6a0T.jpg_720x720q50.jpg" alt="Product view 3" />
              <GalleryImage src="https://s.alicdn.com/@sc04/kf/Haf5354626af240c984aa9c5d2e2aeca0X.jpg_720x720q50.jpg" alt="Product view 4" />
            </ProductImageGallery>
          </SpecsContainer>
        </SpecsSection>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <FAQ />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <FooterComponent />
      </motion.section>
    </HomeContainer>
  );
};

export default Home; 