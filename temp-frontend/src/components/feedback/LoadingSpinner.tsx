import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ $fullScreen?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ $fullScreen }) =>
    $fullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 9999;
  `}
`;

const Spinner = styled.div<{ size: string; color: string }>`
  width: ${({ size }) => {
    switch (size) {
      case 'small': return '20px';
      case 'medium': return '40px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'small': return '20px';
      case 'medium': return '40px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${({ color }) => color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3498db',
  fullScreen = false,
}) => {
  return (
    <SpinnerContainer $fullScreen={fullScreen}>
      <Spinner size={size} color={color} />
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 