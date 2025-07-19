import styled from 'styled-components';

export const PolicyContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const PolicyHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
`;

export const Title = styled.h1`
  color: #2c5282;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

export const LastUpdated = styled.p`
  color: #718096;
  font-size: 0.9rem;
`;

export const Section = styled.section`
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const SectionTitle = styled.h2`
  color: #2c5282;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 24px;
    background: #2c5282;
    border-radius: 2px;
  }
`;

export const Paragraph = styled.p`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const List = styled.ul`
  list-style-type: none;
  margin-left: 1rem;
  margin-bottom: 1rem;
`;

export const ListItem = styled.li`
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;

  &::before {
    content: '•';
    color: #2c5282;
    font-weight: bold;
  }
`;

export const ContactInfo = styled.div`
  background: #ebf8ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;

  p {
    margin: 0.5rem 0;
    color: #2c5282;
    font-weight: 500;
  }
`;

export const BackToTop = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #2c5282;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #1a365d;
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`; 