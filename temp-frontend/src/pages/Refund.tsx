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

const Refund: React.FC = () => {
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
        <Title>Refund Policy</Title>
        <LastUpdated>Last Updated: February 20, 2025</LastUpdated>
      </PolicyHeader>

      <Section>
        <SectionTitle>1. Return Period</SectionTitle>
        <Paragraph>
          We offer a 30-day return window for all unused items in their original packaging. The return period begins on the date you receive your order.
        </Paragraph>
      </Section>

      <Section>
        <SectionTitle>2. Eligibility for Returns</SectionTitle>
        <Paragraph>
          To be eligible for a return, your item must be:
        </Paragraph>
        <List>
          <ListItem>Unused and in its original condition</ListItem>
          <ListItem>In its original packaging</ListItem>
          <ListItem>Accompanied by the original receipt or order confirmation</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>3. Non-Returnable Items</SectionTitle>
        <Paragraph>
          The following items cannot be returned:
        </Paragraph>
        <List>
          <ListItem>Items that have been used or damaged</ListItem>
          <ListItem>Personal care items</ListItem>
          <ListItem>Items without original packaging</ListItem>
          <ListItem>Items purchased on sale or clearance</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>4. Return Process</SectionTitle>
        <Paragraph>
          To initiate a return, please follow these steps:
        </Paragraph>
        <List>
          <ListItem>Contact our customer service team</ListItem>
          <ListItem>Provide your order number and reason for return</ListItem>
          <ListItem>Receive a return authorization number</ListItem>
          <ListItem>Ship the item back to our warehouse</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>5. Shipping Costs</SectionTitle>
        <Paragraph>
          Return shipping costs are handled as follows:
        </Paragraph>
        <List>
          <ListItem>For defective items: We cover the return shipping cost</ListItem>
          <ListItem>For change of mind: Customer is responsible for return shipping</ListItem>
          <ListItem>For incorrect items: We cover the return shipping cost</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>6. Refund Process</SectionTitle>
        <Paragraph>
          Once we receive your return:
        </Paragraph>
        <List>
          <ListItem>We inspect the item within 2 business days</ListItem>
          <ListItem>If approved, we process the refund within 5-7 business days</ListItem>
          <ListItem>You will receive an email confirmation when the refund is processed</ListItem>
          <ListItem>The refund will be issued to your original payment method</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>7. Damaged or Defective Items</SectionTitle>
        <Paragraph>
          If you receive a damaged or defective item:
        </Paragraph>
        <List>
          <ListItem>Contact us within 48 hours of delivery</ListItem>
          <ListItem>Provide photos of the damage or defect</ListItem>
          <ListItem>We will arrange for a replacement or refund</ListItem>
        </List>
      </Section>

      <Section>
        <SectionTitle>8. Contact Us</SectionTitle>
        <Paragraph>
          If you have any questions about our refund policy, please contact us:
        </Paragraph>
        <ContactInfo>
          <p>Email: returns@3in1charger.com</p>
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

export default Refund; 