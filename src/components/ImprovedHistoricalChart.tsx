import React from 'react';
import { TrendingUp, TrendingDown, Minus, DollarSign, Eye, Video } from 'lucide-react';

interface ImprovedChartData {
  month: string;
  averageViews: number;
  totalRevenue: number;
  videoCount: number;
  contentMix: {
    longFormPercentage: number;
    shortsPercentage: number;
  };
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface ImprovedHistoricalChartProps {
  data: ImprovedChartData[];
  title?: string;
}

const ImprovedHistoricalChart: React.FC<ImprovedHistoricalChartProps> = ({ 
  data, 
  title = "Channel Performance Overview" 
}) => {
  if (data.length === 0) {
    return (
      <div className="bg-dark-bg-card rounded-lg p-6 border border-dark-border">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <p className="text-dark-text-secondary">No data available for chart</p>
      </div>
    );
  }

  // Calculate max values for scaling
  const maxViews = Math.max(...data.map(d => d.averageViews));
  const maxRevenue = Math.max(...data.map(d => d.totalRevenue));

  // Format month for display
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  // Get performance color
  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-accent-green';
      case 'good': return 'text-accent-blue';
      case 'average': return 'text-accent-yellow';
      case 'poor': return 'text-accent-red';
      default: return 'text-dark-text-secondary';
    }
  };

  return (
    <div className="bg-dark-bg-card rounded-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
      
      {/* Chart Grid */}
      <div className="space-y-4">
        {data.map((monthData, index) => {
          const viewsBarWidth = (monthData.averageViews / maxViews) * 100;
          const revenueBarWidth = (monthData.totalRevenue / maxRevenue) * 100;
          
          // Determine trend vs previous month
          let trend = null;
          if (index > 0) {
            const prevMonth = data[index - 1];
            const viewChange = ((monthData.averageViews - prevMonth.averageViews) / prevMonth.averageViews) * 100;
            if (viewChange > 5) trend = 'up';
            else if (viewChange < -5) trend = 'down';
            else trend = 'stable';
          }

          return (
            <div key={monthData.month} className="space-y-2">
              {/* Month Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white w-16">
                    {formatMonth(monthData.month)}
                  </span>
                  <div className="flex items-center gap-2">
                    <Video className="h-3 w-3 text-dark-text-tertiary" />
                    <span className="text-xs text-dark-text-tertiary">
                      {monthData.videoCount} videos
                    </span>
                  </div>
                  <span className={`text-xs font-medium ${getPerformanceColor(monthData.performance)}`}>
                    {monthData.performance}
                  </span>
                  {trend && (
                    <div className="flex items-center">
                      {trend === 'up' && <TrendingUp className="h-3 w-3 text-accent-green" />}
                      {trend === 'down' && <TrendingDown className="h-3 w-3 text-accent-red" />}
                      {trend === 'stable' && <Minus className="h-3 w-3 text-dark-text-tertiary" />}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-dark-text-tertiary">
                    {monthData.contentMix.longFormPercentage}% Long / {monthData.contentMix.shortsPercentage}% Shorts
                  </div>
                </div>
              </div>

              {/* Views Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-dark-text-tertiary" />
                    <span className="text-xs text-dark-text-tertiary">Avg Views</span>
                  </div>
                  <span className="text-xs font-medium text-white">
                    {monthData.averageViews.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                  <div
                    className="bg-accent-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${viewsBarWidth}%` }}
                  />
                </div>
              </div>

              {/* Revenue Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-dark-text-tertiary" />
                    <span className="text-xs text-dark-text-tertiary">Revenue</span>
                  </div>
                  <span className="text-xs font-medium text-accent-green">
                    ${monthData.totalRevenue.toFixed(0)}
                  </span>
                </div>
                <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                  <div
                    className="bg-accent-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${revenueBarWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-dark-border grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-dark-text-tertiary mb-1">Avg Monthly Views</p>
          <p className="text-sm font-medium text-white">
            {Math.round(data.reduce((sum, d) => sum + d.averageViews, 0) / data.length).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-text-tertiary mb-1">Avg Monthly Revenue</p>
          <p className="text-sm font-medium text-accent-green">
            ${Math.round(data.reduce((sum, d) => sum + d.totalRevenue, 0) / data.length).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-dark-text-tertiary mb-1">Total Videos</p>
          <p className="text-sm font-medium text-white">
            {data.reduce((sum, d) => sum + d.videoCount, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImprovedHistoricalChart;