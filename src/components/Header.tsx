'use client';

import React from 'react';
import { BarChart3, Calculator, TrendingUp, Play } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onShowRpmCalculator?: () => void;
  onShowOutlierAnalyzer?: () => void;
  onNavigateHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowRpmCalculator, onShowOutlierAnalyzer, onNavigateHome }) => {
  return (
    <nav className="bg-white dark:bg-dark-bg-secondary border-b border-gray-200 dark:border-dark-border transition-colors duration-300 shadow-sm">
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
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">InsightSync</h1>
                  <p className="text-xs text-gray-500 dark:text-dark-text-tertiary -mt-1">YouTube Analytics</p>
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
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">InsightSync</h1>
                  <p className="text-xs text-gray-500 dark:text-dark-text-tertiary -mt-1">YouTube Analytics</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {onShowOutlierAnalyzer && (
              <button
                onClick={onShowOutlierAnalyzer}
                className="flex items-center gap-2 px-4 py-2 bg-accent-purple/10 dark:bg-accent-purple/20 hover:bg-accent-purple/20 dark:hover:bg-accent-purple/30 text-accent-purple rounded-lg transition-all duration-200 text-sm font-medium group"
              >
                <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Outlier Analyzer</span>
              </button>
            )}
            {onShowRpmCalculator && (
              <button
                onClick={onShowRpmCalculator}
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue/10 dark:bg-accent-blue/20 hover:bg-accent-blue/20 dark:hover:bg-accent-blue/30 text-accent-blue rounded-lg transition-all duration-200 text-sm font-medium group"
              >
                <Calculator className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">RPM Calculator</span>
              </button>
            )}
            <div className="h-8 w-px bg-gray-200 dark:bg-dark-border"></div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;