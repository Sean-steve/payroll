import React from 'react';
import logoAsset from '../assets/velora-logo.png.asset.json';
import symbolAsset from '../assets/velora-symbol.png.asset.json';

interface VeloraLogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  showIconOnly?: boolean;
}

export const VeloraLogo: React.FC<VeloraLogoProps> = ({
  size = 'md',
  className = '',
  showIconOnly = false,
}) => {
  const imageSize = showIconOnly
    ? { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }[size]
    : { sm: 'h-12 w-20', md: 'h-20 w-32', lg: 'h-24 w-40' }[size];

  return <img src={showIconOnly ? symbolAsset.url : logoAsset.url} alt="VeloraHR" className={`${imageSize} object-contain shrink-0 ${className}`} />;
};