'use client';

import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  preserveValue?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  start = 0,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
  preserveValue = false
}) => {
  const [currentValue, setCurrentValue] = useState(preserveValue ? end : start);
  const [hasStarted, setHasStarted] = useState(false);
  const { ref, isVisible, hasAnimated } = useScrollAnimation({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (isVisible && !hasStarted) {
      setHasStarted(true);
      let startTime: number | null = null;
      const startValue = start;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Use easeOutQuart easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const value = startValue + (end - startValue) * easeOutQuart;
        
        setCurrentValue(value);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isVisible, hasStarted, start, end, duration]);

  const formatValue = (value: number) => {
    const formattedValue = decimals > 0 
      ? value.toFixed(decimals)
      : Math.round(value).toString();
    
    return `${prefix}${formattedValue}${suffix}`;
  };

  return (
    <span 
      ref={ref as React.RefObject<HTMLSpanElement>} 
      className={`inline-block ${isVisible ? 'animate-counter-up' : 'opacity-0'} ${className}`}
    >
      {formatValue(currentValue)}
    </span>
  );
};

export default AnimatedCounter;