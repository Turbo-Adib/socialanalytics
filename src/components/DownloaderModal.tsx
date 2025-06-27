'use client';

import { useEffect } from 'react';
import VideoDownloader from './VideoDownloader';

interface DownloaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

export default function DownloaderModal({ isOpen, onClose, initialUrl }: DownloaderModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return <VideoDownloader onClose={onClose} initialUrl={initialUrl} />;
}