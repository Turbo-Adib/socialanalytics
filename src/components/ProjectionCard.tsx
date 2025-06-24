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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {timeframe}
          </div>
        </div>
        <div className="p-2 bg-blue-100 rounded-lg">
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Views</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {views.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Revenue</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            ${revenue.toLocaleString(undefined, { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            })}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-500">
          Based on current trends and growth patterns
        </p>
      </div>
    </div>
  );
};

export default ProjectionCard;