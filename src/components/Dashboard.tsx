import React, { useState } from 'react';
import { ArrowLeft, LayoutDashboard, Trophy, DollarSign, Rocket, Activity } from 'lucide-react';
import { ChannelAnalytics } from '@/types/youtube';
import ChannelProfileCard from './ChannelProfileCard';
import StatCard from './StatCard';
import HistoricalChart from './HistoricalChart';
import ProjectionCard from './ProjectionCard';
import RecentVideos from './RecentVideos';
import RevenueTransparency from './RevenueTransparency';
import DataQualityIndicator from './DataQualityIndicator';
import DataTransparency from './DataTransparency';
import TimeframeToggle from './TimeframeToggle';
import IntelligentInsights from './IntelligentInsights';
import MonetizationStatus from './MonetizationStatus';
import RealTimePerformanceTracker from './RealTimePerformanceTracker';
import AudienceEngagementHealth from './AudienceEngagementHealth';
import CompetitionBenchmark from './CompetitionBenchmark';
import RevenueOptimizationCenter from './RevenueOptimizationCenter';
import GrowthTrajectoryAnalyzer from './GrowthTrajectoryAnalyzer';
import ImprovedHistoricalChart from './ImprovedHistoricalChart';
import { logger } from '@/lib/logger';

interface DashboardProps {
  analytics: ChannelAnalytics;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analytics, onReset }) => {
  const [viewsTimeframe, setViewsTimeframe] = useState<'daily' | 'monthly'>('daily');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'daily' | 'monthly'>('daily');
  const [activeTab, setActiveTab] = useState<'overview' | 'competition' | 'revenue' | 'growth'>('overview');

  // Debug logging to verify data structure
  logger.log('Dashboard received analytics:', analytics);
  logger.log('Channel data:', analytics?.channel);

  return (
    <div className="min-h-screen bg-dark-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onReset}
          className="mb-6 flex items-center gap-2 text-dark-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Analyze Another Channel
        </button>

        {/* Debug Info - Remove after testing */}
        <div className="mb-4 p-2 bg-green-500/20 border border-green-500 rounded text-green-400 text-xs">
          ✅ Premium Dashboard Active | Component: Dashboard.tsx | Tabs: {activeTab}
        </div>

        {/* Channel Profile with Monetization Status */}
        <div className="mb-8">
          <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6">
            <div className="flex items-start justify-between">
              <ChannelProfileCard channel={analytics.channel} />
              {analytics.channel.monetization && (
                <MonetizationStatus 
                  isMonetized={analytics.channel.monetization.isMonetized}
                  estimatedRevenue={analytics.projections.nextMonth.revenue}
                  className="ml-4 flex-shrink-0"
                />
              )}
            </div>
          </div>
        </div>

        {/* Premium Features Badge */}
        <div className="mb-4 flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            ✨ Premium Dashboard - Enhanced Analytics
          </div>
        </div>

        {/* Premium Tabs Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-dark-bg-card rounded-lg p-1 border border-dark-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-dark-bg-secondary text-white'
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('competition')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'competition'
                  ? 'bg-dark-bg-secondary text-white'
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Competition</span>
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'revenue'
                  ? 'bg-dark-bg-secondary text-white'
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Revenue</span>
            </button>
            <button
              onClick={() => setActiveTab('growth')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === 'growth'
                  ? 'bg-dark-bg-secondary text-white'
                  : 'text-dark-text-secondary hover:text-white'
              }`}
            >
              <Rocket className="h-4 w-4" />
              <span className="hidden sm:inline">Growth</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Data Transparency */}
            <DataTransparency analytics={analytics} />

            {/* Premium Performance Widgets - Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <RealTimePerformanceTracker 
                channelId={analytics.channel.id}
                recentVideos={analytics.recentVideos}
                channelAverageViews={analytics.channel.totalViews / analytics.channel.videoCount}
              />
              <AudienceEngagementHealth 
                recentVideos={analytics.recentVideos}
                channelStats={{
                  subscriberCount: analytics.channel.subscriberCount,
                  totalViews: analytics.channel.totalViews
                }}
              />
            </div>

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
        {(analytics as any).improvedChartData ? (
          // Use improved chart if available
          <div className="mb-8">
            <ImprovedHistoricalChart 
              data={(analytics as any).improvedChartData}
              title="Channel Performance Overview"
            />
          </div>
        ) : (
          // Fallback to original charts
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
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
            
            <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
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
        )}

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

        {/* Intelligent Insights */}
        <div className="mb-8">
          <IntelligentInsights channelId={analytics.channel.id} />
        </div>

            {/* Recent Videos */}
            <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6">
              <RecentVideos videos={analytics.recentVideos} />
            </div>
          </>
        )}

        {/* Competition Tab */}
        {activeTab === 'competition' && (
          <div className="space-y-6">
            <CompetitionBenchmark 
              currentChannel={analytics.channel}
              recentVideos={analytics.recentVideos}
            />
            
            {/* Intelligent Insights in Competition Context */}
            <IntelligentInsights channelId={analytics.channel.id} />
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <RevenueOptimizationCenter 
              channel={analytics.channel}
              recentVideos={analytics.recentVideos}
              currentStats={analytics.currentStats}
              historicalData={analytics.historicalData}
            />
            
            {/* Revenue Transparency in Revenue Context */}
            {analytics.validation && (
              <RevenueTransparency comparison={analytics.validation} />
            )}
          </div>
        )}

        {/* Growth Tab */}
        {activeTab === 'growth' && (
          <div className="space-y-6">
            <GrowthTrajectoryAnalyzer 
              channel={analytics.channel}
              currentStats={analytics.currentStats}
              historicalData={analytics.historicalData}
            />
            
            {/* Projections in Growth Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;