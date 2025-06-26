'use client';

import React from 'react';
import { useScrollProgress } from '@/hooks/useScrollAnimation';

interface ScrollProgressProps {
  className?: string;
  color?: string;
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({ 
  className = '',
  color = 'bg-youtube-red'
}) => {
  const progress = useScrollProgress();

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 h-1 bg-border/20 ${className}`}>
      <div 
        className={`h-full ${color} transition-all duration-150 ease-out`}
        style={{ 
          width: `${progress}%`,
          transition: 'width 0.1s ease-out'
        }}
      />
    </div>
  );
};

export default ScrollProgress;