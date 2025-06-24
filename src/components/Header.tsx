import React from 'react';
import { BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-400 mr-3" />
            <h1 className="text-2xl font-bold text-white">InsightSync</h1>
          </div>
          <div className="hidden md:block">
            <p className="text-gray-300 text-sm">
              YouTube Analytics Dashboard
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;