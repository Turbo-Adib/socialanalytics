import React from 'react';
import { BarChart3, Calculator, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onShowRpmCalculator?: () => void;
  onShowOutlierAnalyzer?: () => void;
  onNavigateHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowRpmCalculator, onShowOutlierAnalyzer, onNavigateHome }) => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {onNavigateHome ? (
              <button 
                onClick={onNavigateHome}
                className="flex items-center hover:opacity-80 transition-opacity"
              >
                <BarChart3 className="h-8 w-8 text-blue-400 mr-3" />
                <h1 className="text-2xl font-bold text-white">InsightSync</h1>
              </button>
            ) : (
              <>
                <BarChart3 className="h-8 w-8 text-blue-400 mr-3" />
                <h1 className="text-2xl font-bold text-white">InsightSync</h1>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {onShowOutlierAnalyzer && (
              <button
                onClick={onShowOutlierAnalyzer}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <TrendingUp className="h-4 w-4" />
                Outlier Analyzer
              </button>
            )}
            {onShowRpmCalculator && (
              <button
                onClick={onShowRpmCalculator}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Calculator className="h-4 w-4" />
                RPM Calculator
              </button>
            )}
            <div className="hidden md:block">
              <p className="text-gray-300 text-sm">
                Simple YouTube Analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;