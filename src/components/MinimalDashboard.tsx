import React from 'react';
import { ArrowLeft, Users, Eye, Video, Calendar, TrendingUp, DollarSign, Star, AlertTriangle } from 'lucide-react';

interface MinimalDashboardProps {
  analytics: any; // MinimalAnalytics type
  onReset: () => void;
}

const MinimalDashboard: React.FC<MinimalDashboardProps> = ({ analytics, onReset }) => {
  const { overview, recentPerformance, projections } = analytics;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Back button */}
        <button
          onClick={onReset}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-white transition-all duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Analyze Another Channel
        </button>

        {/* Channel Header */}
        <div className="card mb-6">
          <div className="flex items-start gap-4">
            <img
              src={overview.thumbnailUrl}
              alt={overview.title}
              className="w-20 h-20 rounded-full ring-2 ring-youtube-red ring-offset-2 dark:ring-offset-dark-bg-card"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{overview.title}</h1>
              <p className="text-gray-600 dark:text-dark-text-secondary mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-youtube-red rounded-full"></span>
                {overview.niche} Channel
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mt-2">
                Channel Age: {overview.estimatedAge.years}y {overview.estimatedAge.months}m
              </p>
            </div>
          </div>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card card-hover group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-blue/10 dark:bg-accent-blue/20 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-accent-blue" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-all">
                  {overview.subscriberCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">Subscribers</p>
              </div>
            </div>
          </div>

          <div className="card card-hover group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-green/10 dark:bg-accent-green/20 rounded-lg group-hover:scale-110 transition-transform">
                <Eye className="h-6 w-6 text-accent-green" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-all">
                  {overview.totalViews.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">Total Views</p>
              </div>
            </div>
          </div>

          <div className="card card-hover group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-lg group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6 text-accent-purple" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-all">
                  {overview.videoCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">Total Videos</p>
              </div>
            </div>
          </div>

          <div className="card card-hover group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-yellow/10 dark:bg-accent-yellow/20 rounded-lg group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6 text-accent-yellow" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-all">
                  ${overview.monthlyRevenue.estimated.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">Monthly Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent-blue" />
            Recent Performance
            <span className="text-sm font-normal text-gray-500 dark:text-dark-text-tertiary">
              (Last {recentPerformance.totalVideos} videos)
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-1">Average Views</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-all">
                {recentPerformance.averageViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mt-1">
                Upload frequency: {recentPerformance.uploadFrequency} videos/month
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-1">Content Mix</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {recentPerformance.contentMix.longFormPercentage}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-tertiary">Long-form</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {recentPerformance.contentMix.shortsPercentage}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-tertiary">Shorts</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-1">Revenue Estimate</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-all">
                ${recentPerformance.revenueEstimate.monthly.toLocaleString()}/month
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-1">
                Range: ${overview.monthlyRevenue.min} - ${overview.monthlyRevenue.max}
              </p>
            </div>
          </div>
        </div>

        {/* Best/Worst Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent-green" />
              Best Performer
            </h3>
            <div>
              <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                {recentPerformance.bestVideo.title}
              </p>
              <p className="text-lg font-bold text-accent-green mt-2">
                {recentPerformance.bestVideo.views?.toLocaleString()} views
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recentPerformance.bestVideo.performance === 'excellent' ? 'bg-accent-green/20 text-accent-green' :
                  recentPerformance.bestVideo.performance === 'good' ? 'bg-accent-blue/20 text-accent-blue' :
                  'bg-dark-bg-secondary text-dark-text-secondary'
                }`}>
                  {recentPerformance.bestVideo.performance}
                </span>
                <span className="text-xs text-gray-500 dark:text-dark-text-tertiary">
                  {recentPerformance.bestVideo.isShort ? 'Short' : 'Long-form'}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-youtube-red" />
              Needs Improvement
            </h3>
            <div>
              <p className="font-medium text-gray-900 dark:text-white line-clamp-2">
                {recentPerformance.worstVideo.title}
              </p>
              <p className="text-lg font-bold text-youtube-red mt-2">
                {recentPerformance.worstVideo.views?.toLocaleString()} views
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recentPerformance.worstVideo.performance === 'poor' ? 'bg-youtube-red/20 text-youtube-red' :
                  'bg-dark-bg-secondary text-dark-text-secondary'
                }`}>
                  {recentPerformance.worstVideo.performance}
                </span>
                <span className="text-xs text-gray-500 dark:text-dark-text-tertiary">
                  {recentPerformance.worstVideo.isShort ? 'Short' : 'Long-form'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Projections */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-purple" />
            Growth Projections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-2">Next Subscriber Milestone</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {projections.subscribers.nextMilestone.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                {projections.subscribers.estimatedDays} days to reach
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-1">
                Growth rate: {projections.subscribers.growthRate.toLocaleString()}/month
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-2">Revenue Projections</p>
              <div className="space-y-2">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${projections.revenue.nextMonth.toLocaleString()}/month
                  </p>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                    ${projections.revenue.nextYear.toLocaleString()}/year
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MinimalDashboard;