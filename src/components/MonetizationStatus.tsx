import React from 'react';
import { DollarSign, Check, X } from 'lucide-react';

interface MonetizationStatusProps {
  isMonetized: boolean;
  estimatedRevenue?: number;
  className?: string;
}

const MonetizationStatus: React.FC<MonetizationStatusProps> = ({ 
  isMonetized, 
  estimatedRevenue,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative p-2 rounded-full ${
        isMonetized 
          ? 'bg-green-100 dark:bg-green-900/20' 
          : 'bg-red-100 dark:bg-red-900/20'
      }`}>
        <DollarSign className={`h-4 w-4 ${
          isMonetized 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`} />
        <div className={`absolute -top-1 -right-1 p-0.5 rounded-full ${
          isMonetized 
            ? 'bg-green-600 dark:bg-green-400' 
            : 'bg-red-600 dark:bg-red-400'
        }`}>
          {isMonetized ? (
            <Check className="h-2 w-2 text-white" />
          ) : (
            <X className="h-2 w-2 text-white" />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${
          isMonetized 
            ? 'text-green-700 dark:text-green-300' 
            : 'text-red-700 dark:text-red-300'
        }`}>
          {isMonetized ? 'Monetized' : 'Not Monetized'}
        </span>
        {estimatedRevenue && isMonetized && (
          <span className="text-xs text-muted-foreground">
            ~${estimatedRevenue.toLocaleString()}/month
          </span>
        )}
      </div>
    </div>
  );
};

export default MonetizationStatus;