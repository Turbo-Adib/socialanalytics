'use client';

import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  rippleColor?: string;
  className?: string;
  onPress?: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  loading = false,
  rippleColor = 'rgba(255, 255, 255, 0.6)',
  className = '',
  onPress,
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple: RippleEffect = {
      x,
      y,
      id: ++rippleIdRef.current
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      createRipple(event);
      onPress?.();
      onClick?.(event);
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden transition-all duration-200 
        ${loading ? 'cursor-not-allowed' : ''}
        ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ripple pointer-events-none"
          style={{
            left: ripple.x - 2,
            top: ripple.y - 2,
            width: 4,
            height: 4,
            backgroundColor: rippleColor,
            transform: 'scale(0)',
          }}
        />
      ))}

      {/* Button Content */}
      <span className="relative flex items-center justify-center gap-2">
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {children}
      </span>

      {/* Shimmer effect on hover (optional) */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </Button>
  );
};

export default AnimatedButton;