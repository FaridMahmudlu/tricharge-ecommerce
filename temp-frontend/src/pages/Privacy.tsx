import React, { useState, useEffect } from 'react';
import {
  PolicyContainer,
  PolicyHeader,
  Title,
  LastUpdated,
  Section,
  SectionTitle,
  Paragraph,
  List,
  ListItem,
  ContactInfo,
  BackToTop
} from '../components/PolicyStyles';

const Privacy: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PolicyContainer>
      <PolicyHeader>
        <Title>Privacy Policy</Title>
        <LastUpdated>Last Updated: February 20, 2025</LastUpdated>
      </PolicyHeader>
      
      <Section>
        <SectionTitle>1. Information We Collect</SectionTitle>
        <Paragraph>
          We collect information that you provide directly to us when you make a purchase, create an account, or contact our customer service. This may include:
        </Paragraph>
        <List>
          <ListItem>Name and contact information</ListItem>
          <ListItem>Shipping and billing addresses</ListItem>
          <ListItem>Payment information</ListItem>
          <ListItem>Email address and phone number</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>2. How We Use Your Information</SectionTitle>
        <Paragraph>
          We use the information we collect to:
        </Paragraph>
        <List>
          <ListItem>Process your orders and payments</ListItem>
          <ListItem>Send you order confirmations and shipping updates</ListItem>
          <ListItem>Respond to your customer service requests</ListItem>
          <ListItem>Send you marketing communications (with your consent)</ListItem>
          <ListItem>Improve our website and services</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>3. Information Sharing</SectionTitle>
        <Paragraph>
          We do not sell or rent your personal information to third parties. We may share your information with:
        </Paragraph>
        <List>
          <ListItem>Service providers who assist in our operations</ListItem>
          <ListItem>Shipping partners to deliver your orders</ListItem>
          <ListItem>Payment processors to handle transactions</ListItem>
          <ListItem>Law enforcement when required by law</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>4. Data Security</SectionTitle>
        <Paragraph>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Our security measures include:
        </Paragraph>
        <List>
          <ListItem>Encryption of sensitive data</ListItem>
          <ListItem>Regular security assessments</ListItem>
          <ListItem>Secure data storage systems</ListItem>
          <ListItem>Access controls and authentication</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>5. Your Rights</SectionTitle>
        <Paragraph>
          You have the right to:
        </Paragraph>
        <List>
          <ListItem>Access your personal information</ListItem>
          <ListItem>Correct inaccurate information</ListItem>
          <ListItem>Request deletion of your information</ListItem>
          <ListItem>Opt-out of marketing communications</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>6. Contact Us</SectionTitle>
        <Paragraph>
          If you have any questions about this Privacy Policy, please contact us:
        </Paragraph>
        <ContactInfo>
          <p>Email: privacy@3in1charger.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</p>
        </ContactInfo>
      </Section>

      <Section>
        <SectionTitle>7. Updates to This Policy</SectionTitle>
        <Paragraph>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Paragraph>
      </Section>

      {showBackToTop && (
        <BackToTop onClick={scrollToTop} aria-label="Back to top">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </BackToTop>
      )}
    </PolicyContainer>
  );
};

export default Privacy; 