'use client';

import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  showCursor?: boolean;
  cursorClassName?: string;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 100,
  delay = 0,
  className = '',
  showCursor = true,
  cursorClassName = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayText(text);
      setIsTypingComplete(true);
      setHasStarted(true);
      onComplete?.();
      return;
    }

    const startTyping = () => {
      setHasStarted(true);
      
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
        
        return () => clearTimeout(timer);
      } else if (!isTypingComplete) {
        setIsTypingComplete(true);
        onComplete?.();
      }
    };

    if (delay > 0 && !hasStarted) {
      const delayTimer = setTimeout(startTyping, delay);
      return () => clearTimeout(delayTimer);
    } else {
      return startTyping();
    }
  }, [currentIndex, text, speed, delay, isTypingComplete, hasStarted, onComplete]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className={`inline-block w-0.5 ml-1 ${
          isTypingComplete ? 'animate-blink' : 'bg-current'
        } ${cursorClassName}`}>
          {!isTypingComplete && <span className="opacity-0">|</span>}
          {isTypingComplete && '|'}
        </span>
      )}
    </span>
  );
};

export default TypingAnimation;