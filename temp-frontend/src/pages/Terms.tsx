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

const Terms: React.FC = () => {
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
        <Title>Terms of Service</Title>
        <LastUpdated>Last Updated: February 20, 2025</LastUpdated>
      </PolicyHeader>

      <Section>
        <SectionTitle>1. Acceptance of Terms</SectionTitle>
        <Paragraph>
          By accessing and using this website, you accept and agree to be bound by the terms and conditions of this agreement.
        </Paragraph>
        <Paragraph>
          If you do not agree to these terms, please do not use our website.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>2. Use License</SectionTitle>
        <Paragraph>
          Permission is granted to temporarily download one copy of the materials (information or software) on 3in1Charger's website for personal, non-commercial transitory viewing only.
        </Paragraph>
        <Paragraph>
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by 3in1Charger at any time.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>3. User Account</SectionTitle>
        <Paragraph>
          To make purchases on our website, you must:
        </Paragraph>
        <List>
          <ListItem>Be at least 18 years old</ListItem>
          <ListItem>Provide accurate and complete information</ListItem>
          <ListItem>Maintain the security of your account</ListItem>
          <ListItem>Accept responsibility for all activities under your account</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>4. Product Information</SectionTitle>
        <Paragraph>
          We strive to provide accurate product information, including:
        </Paragraph>
        <List>
          <ListItem>Product descriptions and specifications</ListItem>
          <ListItem>Pricing and availability</ListItem>
          <ListItem>Shipping and delivery information</ListItem>
          <ListItem>Product images and videos</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>5. Payment Terms</SectionTitle>
        <Paragraph>
          All payments must be made in full at the time of purchase. We accept:
        </Paragraph>
        <List>
          <ListItem>Credit and debit cards</ListItem>
          <ListItem>PayPal</ListItem>
          <ListItem>Other payment methods as specified</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>6. Shipping and Delivery</SectionTitle>
        <Paragraph>
          We ship to most countries worldwide. Shipping terms include:
        </Paragraph>
        <List>
          <ListItem>Delivery timeframes</ListItem>
          <ListItem>Shipping costs and methods</ListItem>
          <ListItem>Tracking information</ListItem>
          <ListItem>International shipping restrictions</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>7. Intellectual Property</SectionTitle>
        <Paragraph>
          All content on this website is the property of 3in1Charger and is protected by:
        </Paragraph>
        <List>
          <ListItem>Copyright laws</ListItem>
          <ListItem>Trademark laws</ListItem>
          <ListItem>Other intellectual property rights</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>8. Limitation of Liability</SectionTitle>
        <Paragraph>
          In no event shall 3in1Charger be liable for any damages arising out of:
        </Paragraph>
        <List>
          <ListItem>Use or inability to use the website</ListItem>
          <ListItem>Any products purchased through the website</ListItem>
          <ListItem>Any third-party websites linked to our website</ListItem>
          <ListItem>Any errors or omissions in the website content</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>9. Governing Law</SectionTitle>
        <Paragraph>
          These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 3in1Charger operates, without regard to its conflict of law provisions.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>10. Changes to Terms</SectionTitle>
        <Paragraph>
          We reserve the right to modify these terms at any time. We will notify users of any material changes by:
        </Paragraph>
        <List>
          <ListItem>Posting the new terms on this page</ListItem>
          <ListItem>Sending an email notification</ListItem>
          <ListItem>Updating the "Last Updated" date</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>11. Contact Information</SectionTitle>
        <Paragraph>
          If you have any questions about these Terms of Service, please contact us:
        </Paragraph>
        <ContactInfo>
          <p>Email: legal@3in1charger.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Hours: Monday - Friday, 9:00 AM - 6:00 PM EST</p>
        </ContactInfo>
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

export default Terms; 