import React from 'react';
import { TrendingUp, DollarSign, Eye, Clock } from 'lucide-react';

interface ProjectionCardProps {
  title: string;
  views: number;
  revenue: number;
  timeframe: string;
}

const ProjectionCard: React.FC<ProjectionCardProps> = ({
  title,
  views,
  revenue,
  timeframe,
}) => {
  return (
    <div className="bg-gradient-to-br from-dark-bg-card to-dark-bg-elevated rounded-lg border border-accent-blue/30 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-sm text-dark-text-tertiary">
            <Clock className="h-4 w-4" />
            {timeframe}
          </div>
        </div>
        <div className="p-2 bg-accent-blue/20 rounded-lg">
          <TrendingUp className="h-6 w-6 text-accent-blue" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-dark-text-tertiary" />
            <span className="text-sm font-medium text-dark-text-secondary">Views</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-white break-words">
            {views.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-dark-text-tertiary" />
            <span className="text-sm font-medium text-dark-text-secondary">Revenue</span>
          </div>
          <span className="text-base sm:text-lg font-bold text-accent-green break-words">
            ${revenue.toLocaleString(undefined, { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-accent-blue/30">
        <p className="text-xs text-dark-text-tertiary">
          Based on current trends and growth patterns
        </p>
      </div>
    </div>
  );
};

export default ProjectionCard;