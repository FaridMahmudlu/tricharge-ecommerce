import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';

// SVG Icons as components
const SearchSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuOpenSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuCloseSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CartSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AccountSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoSvg = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="2"/>
    <path d="M16 14V20C16 21.1046 16.8954 22 18 22H22C23.1046 22 24 21.1046 24 20V14M20 22V26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Nav = styled.nav`
  background-color: #2c5282;
  padding: 1rem;
  height: 4rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
`;

const NavContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 100%;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  svg {
    width: 40px;
    height: 40px;
  }
`;

const LogoText = styled.span`
  color: white;
  font-weight: 700;
  font-size: 1.75rem;
  letter-spacing: 0.15em;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  position: relative;
  
  &::before {
    content: 'TRICHARGE';
    position: absolute;
    left: 1px;
    top: 1px;
    color: rgba(255, 255, 255, 0.3);
  }
`;

const NavList = styled.ul<{ $isOpen: boolean }>`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2c5282;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    z-index: 1000;
    padding: 2rem;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)<{ $isActive?: boolean }>`
  color: white;
  text-decoration: none;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  padding: 0.5rem;
  transition: all 0.2s ease;
  font-size: 1.1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: ${props => props.$isActive ? '100%' : '0'};
    height: 2px;
    background-color: white;
    transition: width 0.2s ease;
  }

  &:hover {
    color: #e2e8f0;
    &::after {
      width: 100%;
    }
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
  position: relative;

  @media (max-width: 768px) {
    margin: 1rem 0;
    max-width: 100%;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #111827;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
  border: 1px solid #e5e7eb;
  padding: 0.5rem;

  &.show {
    display: block;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

const SearchResultItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const ResultTitle = styled.div`
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`;

const ResultCategory = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
`;

const ResultContent = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 2000;

  svg {
    display: block;
  }
`;

const SearchIcon = styled(SearchSvg)`
  width: 16px;
  height: 16px;
`;

const MenuIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const CartContainer = styled(Link)`
  position: relative;
  color: white;
  text-decoration: none;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const CartIconWrapper = styled.div`
  color: inherit;
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 1.5;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #2c5282;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 2000;

  @media (max-width: 768px) {
    display: block;
  }

  svg {
    display: block;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AuthButton = styled.button`
  background: none;
  border: none;
  color: #2c5282;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(44, 82, 130, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #2c5282;
  font-weight: 500;
`;

const AccountContainer = styled.button`
  position: relative;
  color: white;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
`;

const AccountIconWrapper = styled.div`
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 1.5;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.875rem 1.25rem;
  border: none;
  background: none;
  color: #4a5568;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;

  &:hover {
    background-color: #f7fafc;
    color: #2c5282;
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.5;
    color: #718096;
  }

  &:hover svg {
    color: #2c5282;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemCount = 0;
  const mainProduct = products[0];
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Define searchable content
  const searchableContent = {
    features: [
      { title: 'Fast Charging Technology', content: '15W maximum output power, Multiple output options: 9V/2A, 5V/3A, 12V/1.5A, Supports 3W/5W/7.5W/10W/15W wireless output', path: '/#features' },
      { title: 'Versatile Compatibility', content: 'Compatible with smartphones, Dedicated smartwatch charging, Earphone charging support, Works with all Qi-enabled devices', path: '/#features' },
      { title: 'Smart Features', content: 'Built-in ambient night light, Foldable design for portability, Type-C input port, CE, FCC, ROHS certified', path: '/#features' },
      { title: 'Safety Features', content: 'Over-voltage protection, Temperature control, Short circuit protection, Foreign object detection', path: '/#features' },
      { title: 'Design', content: 'Space-saving 3-in-1 design, Premium build quality, Modern aesthetic appeal, Compact footprint', path: '/#features' },
      { title: 'Additional Benefits', content: 'Retail package included, Customizable logo option, 12-month warranty, Professional after-sales support', path: '/#features' }
    ],
    specifications: [
      { title: 'Output Power', content: '15W maximum, Multiple power outputs for different devices', path: '/#specifications' },
      { title: 'Compatibility', content: 'Universal compatibility with Qi-enabled devices', path: '/#specifications' },
      { title: 'Certifications', content: 'CE, FCC, ROHS certified for safety and quality', path: '/#specifications' },
      { title: 'Design', content: 'Foldable, portable design with ambient lighting', path: '/#specifications' }
    ],
    support: [
      { title: 'Email Support', content: 'Get detailed assistance from our support team, support@tricharge.com, Response within 24 hours, Available for all inquiries', path: '/support' },
      { title: 'Phone Support', content: '1-800-CHARGE, Speak directly with our product experts, Mon-Fri 9AM-6PM EST, Priority support for urgent issues', path: '/support' },
      { title: 'Feedback Form', content: 'Share your thoughts, suggestions, or concerns through our customer feedback form', path: '/support#feedback' }
    ],
    faq: [
      { title: 'Charging Compatibility', content: 'Which devices can I charge? Compatible with all Qi-enabled devices including latest smartphones, smartwatches, and wireless earbuds', path: '/support#faq' },
      { title: 'Charging Speed', content: 'How fast does it charge? Supports fast charging up to 15W with compatible devices', path: '/support#faq' },
      { title: 'Safety Features', content: 'Is it safe to use? Built-in protection against overheating, short circuits, and overcharging', path: '/support#faq' },
      { title: 'Warranty Coverage', content: 'What does the warranty cover? 12-month warranty covering manufacturing defects and hardware issues', path: '/support#faq' }
    ],
    product: [
      { title: '3-in-1 Wireless Charging Station', content: 'Premium wireless charging dock for phone, smartwatch, and earphones with 15W fast charging capability', path: '/product/1' },
      { title: 'Product Overview', content: 'Charge multiple devices simultaneously, Premium build quality, Modern design, Night light feature', path: '/product/1' },
      { title: 'Technical Details', content: 'Input: Type-C, Output: 15W/10W/7.5W/5W, Certifications: CE, FCC, ROHS', path: '/product/1#specs' }
    ]
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  // Handle search result click
  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
    setIsOpen(false);

    // If it's a section with an ID, scroll to it after navigation
    if (path.includes('#')) {
      setTimeout(() => {
        const element = document.getElementById(path.split('#')[1]);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get search results
  const getSearchResults = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    return Object.entries(searchableContent).flatMap(([category, items]) =>
      items
        .filter(item => {
          const titleMatch = item.title.toLowerCase().startsWith(query);
          const contentMatch = item.content.toLowerCase().includes(query);
          return titleMatch || contentMatch;
        })
        .map(item => ({
          ...item,
          category,
          isTitleMatch: item.title.toLowerCase().startsWith(query),
          relevance: item.title.toLowerCase().startsWith(query) ? 2 : 1
        }))
        .sort((a, b) => {
          // Sort by relevance first (title matches before content matches)
          if (a.relevance !== b.relevance) {
            return b.relevance - a.relevance;
          }
          // Then sort alphabetically
          return a.title.localeCompare(b.title);
        })
    );
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    
    if (query) {
      // Search through all content categories
      const searchResults = Object.entries(searchableContent).flatMap(([category, items]) =>
        items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
        ).map(item => ({
          ...item,
          category
        }))
      );

      if (searchResults.length > 0) {
        // Navigate to the first matching result
        const firstResult = searchResults[0];
        navigate(firstResult.path);
        
        // If it's a section with an ID, scroll to it after navigation
        if (firstResult.path.includes('#')) {
          setTimeout(() => {
            const element = document.getElementById(firstResult.path.split('#')[1]);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      } else {
        // If no matches, navigate to product page
        navigate(`/product/${mainProduct.id}`);
      }
      
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <Nav>
        <NavContainer>
          <Logo to="/">
            <LogoSvg />
            <LogoText>TRICHARGE</LogoText>
          </Logo>

          <SearchContainer>
            <SearchForm onSubmit={handleSearch}>
              <SearchIconWrapper>
                <SearchSvg />
              </SearchIconWrapper>
              <SearchInput
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <SearchResults 
                ref={searchResultsRef}
                className={showSearchResults ? 'show' : ''}
              >
                {getSearchResults().map((result, index) => (
                  <SearchResultItem 
                    key={`${result.category}-${index}`}
                    onClick={() => handleResultClick(result.path)}
                  >
                    <ResultTitle>{result.title}</ResultTitle>
                    <ResultCategory>
                      {result.category}
                    </ResultCategory>
                    <ResultContent>{result.content}</ResultContent>
                  </SearchResultItem>
                ))}
                {getSearchResults().length === 0 && searchQuery.length > 0 && (
                  <SearchResultItem style={{ cursor: 'default' }}>
                    <ResultTitle>No results found</ResultTitle>
                    <ResultContent>Try different keywords or check your spelling</ResultContent>
                  </SearchResultItem>
                )}
              </SearchResults>
            </SearchForm>
          </SearchContainer>

          <NavActions>
            <MenuButton onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              <MenuIconWrapper>
                {isOpen ? <MenuCloseSvg /> : <MenuOpenSvg />}
              </MenuIconWrapper>
            </MenuButton>
          </NavActions>

          <NavList $isOpen={isOpen}>
            <NavItem>
              <NavLink to="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to={`/product/${mainProduct.id}`}>Shop Now</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/support">Support</NavLink>
            </NavItem>
            <NavItem>
              <AccountContainer onClick={() => setIsAccountOpen(!isAccountOpen)}>
                <AccountIconWrapper>
                  <AccountSvg />
                </AccountIconWrapper>
                {isAuthenticated && user ? (
                  <span>{user.name}</span>
                ) : (
                  <span>Account</span>
                )}
              </AccountContainer>
              <DropdownMenu $isOpen={isAccountOpen}>
                {isAuthenticated ? (
                  <>
                    {location.pathname !== '/dashboard' && (
                      <DropdownItem onClick={() => { setIsAccountOpen(false); navigate('/dashboard'); }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Dashboard
                      </DropdownItem>
                    )}
                    <DropdownItem onClick={() => { setIsAccountOpen(false); handleLogout(); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 16L21 12M21 12L17 8M21 12H7M6 16.8V7.2C6 6.07989 6 5.51984 6.21799 5.09202C6.40973 4.71569 6.71569 4.40973 7.09202 4.21799C7.51984 4 8.07989 4 9.2 4H14.8C15.9201 4 16.4802 4 16.908 4.21799C17.2843 4.40973 17.5903 4.71569 17.782 5.09202C18 5.51984 18 6.07989 18 7.2V16.8C18 17.9201 18 18.4802 17.782 18.908C17.5903 19.2843 17.2843 19.5903 16.908 19.782C16.4802 20 15.9201 20 14.8 20H9.2C8.07989 20 7.51984 20 7.09202 19.782C6.71569 19.5903 6.40973 19.2843 6.21799 18.908C6 18.4802 6 17.9201 6 16.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Logout
                    </DropdownItem>
                  </>
                ) : (
                  <>
                    <DropdownItem onClick={() => navigate('/login')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Login
                    </DropdownItem>
                    <DropdownItem onClick={() => navigate('/register')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Register
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </NavItem>
            <NavItem>
              <CartContainer to="/cart">
                <CartIconWrapper>
                  <CartSvg />
                </CartIconWrapper>
                {cartItemCount > 0 && <CartCount>{cartItemCount}</CartCount>}
              </CartContainer>
            </NavItem>
          </NavList>
        </NavContainer>
      </Nav>
    </>
  );
};

export default Navbar; 