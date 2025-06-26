'use client';

import React from 'react';
import { BarChart3, Calculator, TrendingUp, Play, Palette } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface HeaderProps {
  onShowRpmCalculator?: () => void;
  onShowOutlierAnalyzer?: () => void;
  onNavigateHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowRpmCalculator, onShowOutlierAnalyzer, onNavigateHome }) => {
  return (
    <nav className="bg-background border-b border-border transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {onNavigateHome ? (
              <button 
                onClick={onNavigateHome}
                className="flex items-center group"
              >
                <div className="relative mr-3">
                  <div className="absolute -inset-1 bg-youtube-red rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
                  <div className="relative bg-youtube-red p-2 rounded-lg">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">InsightSync</h1>
                  <p className="text-xs text-dark-text-tertiary -mt-1">YouTube Analytics</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="absolute -inset-1 bg-youtube-red rounded-lg blur opacity-25"></div>
                  <div className="relative bg-youtube-red p-2 rounded-lg">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">InsightSync</h1>
                  <p className="text-xs text-dark-text-tertiary -mt-1">YouTube Analytics</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/design-system">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-accent-green hover:bg-accent-green/10 group"
              >
                <Palette className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Design System</span>
              </Button>
            </Link>
            {onShowOutlierAnalyzer && (
              <Button
                onClick={onShowOutlierAnalyzer}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-accent-purple hover:bg-accent-purple/10 group"
              >
                <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Outlier Analyzer</span>
              </Button>
            )}
            {onShowRpmCalculator && (
              <Button
                onClick={onShowRpmCalculator}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-accent-blue hover:bg-accent-blue/10 group"
              >
                <Calculator className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">RPM Calculator</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;