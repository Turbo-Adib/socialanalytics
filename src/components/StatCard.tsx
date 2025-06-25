import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend,
  trendDirection 
}) => {
  const isPositive = trend?.startsWith('+') || trendDirection === 'up';
  const isNegative = trend?.startsWith('-') || trendDirection === 'down';

  return (
    <div className="card card-hover group">
      <div className="flex items-start justify-between">
        <div className="flex-grow">
          <p className="text-sm font-medium text-gray-500 dark:text-dark-text-tertiary mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-transform duration-200 group-hover:scale-105">{value}</p>
          <p className="text-xs text-gray-400 dark:text-dark-text-tertiary">{subtitle}</p>
        </div>
        
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
            isPositive 
              ? 'bg-green-100 dark:bg-accent-green/20 text-green-800 dark:text-accent-green' 
              : isNegative 
                ? 'bg-red-100 dark:bg-youtube-red/20 text-red-800 dark:text-youtube-red-light'
                : 'bg-gray-100 dark:bg-dark-bg-hover text-gray-800 dark:text-dark-text-secondary'
          }`}>
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;