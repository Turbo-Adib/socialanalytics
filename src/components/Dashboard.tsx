import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ChannelAnalytics } from '@/src/types/youtube';
import ChannelProfileCard from './ChannelProfileCard';
import StatCard from './StatCard';
import HistoricalChart from './HistoricalChart';
import ProjectionCard from './ProjectionCard';
import RecentVideos from './RecentVideos';
import RevenueTransparency from './RevenueTransparency';
import DataQualityIndicator from './DataQualityIndicator';
import DataTransparency from './DataTransparency';
import TimeframeToggle from './TimeframeToggle';

interface DashboardProps {
  analytics: ChannelAnalytics;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analytics, onReset }) => {
  const [viewsTimeframe, setViewsTimeframe] = useState<'daily' | 'monthly'>('daily');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'daily' | 'monthly'>('daily');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onReset}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Analyze Another Channel
        </button>

        {/* Channel Profile */}
        <div className="mb-8">
          <ChannelProfileCard channel={analytics.channel} />
        </div>

        {/* Data Transparency */}
        <DataTransparency analytics={analytics} />

        {/* Current Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Channel Views"
            value={analytics.channel.totalViews.toLocaleString()}
            subtitle="Lifetime (YouTube API)"
            trend=""
          />
          <StatCard
            title="Subscribers"
            value={analytics.channel.subscriberCount.toLocaleString()}
            subtitle="Current (YouTube API)"
            trend=""
          />
          <StatCard
            title="Long-form Views"
            value={analytics.currentStats.longFormViews.toLocaleString()}
            subtitle={`${(analytics as any).dataQuality?.viewCountDebug?.videosAnalyzed || 'Recent'} videos analyzed`}
            trend=""
          />
          <StatCard
            title="Shorts Views"
            value={analytics.currentStats.shortsViews.toLocaleString()}
            subtitle={`${(analytics as any).dataQuality?.viewCountDebug?.videosAnalyzed || 'Recent'} videos analyzed`}
            trend=""
          />
        </div>

        {/* Charts and Projections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {viewsTimeframe === 'daily' ? 'Daily' : 'Monthly'} Views Trend
              </h3>
              <TimeframeToggle 
                value={viewsTimeframe} 
                onChange={setViewsTimeframe} 
              />
            </div>
            <HistoricalChart 
              data={viewsTimeframe === 'daily' ? analytics.dailyData || analytics.historicalData : analytics.historicalData}
              dataKeys={['longFormViews', 'shortsViews']}
              colors={['#3B82F6', '#10B981']}
              timeframe={viewsTimeframe}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {revenueTimeframe === 'daily' ? 'Daily' : 'Monthly'} Revenue Trend
              </h3>
              <TimeframeToggle 
                value={revenueTimeframe} 
                onChange={setRevenueTimeframe} 
              />
            </div>
            <HistoricalChart 
              data={revenueTimeframe === 'daily' ? analytics.dailyData || analytics.historicalData : analytics.historicalData}
              dataKeys={['estRevenueLong', 'estRevenueShorts']}
              colors={['#8B5CF6', '#F59E0B']}
              formatValue={(value) => `$${value.toFixed(0)}`}
              timeframe={revenueTimeframe}
            />
          </div>
        </div>

        {/* Projections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProjectionCard
            title="Next Month Projection"
            views={analytics.projections.nextMonth.views}
            revenue={analytics.projections.nextMonth.revenue}
            timeframe="30 days"
          />
          <ProjectionCard
            title="Next Year Projection"
            views={analytics.projections.nextYear.views}
            revenue={analytics.projections.nextYear.revenue}
            timeframe="12 months"
          />
        </div>

        {/* Data Quality Indicator */}
        {(analytics as any).dataQuality && (
          <div className="mb-8">
            <DataQualityIndicator dataQuality={(analytics as any).dataQuality} />
          </div>
        )}

        {/* Revenue Transparency */}
        {analytics.validation && (
          <div className="mb-8">
            <RevenueTransparency comparison={analytics.validation} />
          </div>
        )}

        {/* Recent Videos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <RecentVideos videos={analytics.recentVideos} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;