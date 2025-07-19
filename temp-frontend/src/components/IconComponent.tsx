import React from 'react';
import styled from 'styled-components';

interface IconWrapperProps {
  color?: string;
  size?: number;
}

const IconWrapper = styled.span<IconWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'inherit'};
  font-size: ${props => props.size ? `${props.size}px` : 'inherit'};
`;

interface IconProps {
  color?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ color, size }) => (
  <IconWrapper color={color} size={size}>
    ★
  </IconWrapper>
);

export default Icon; 