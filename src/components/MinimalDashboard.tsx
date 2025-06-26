import React from 'react';
import { ArrowLeft, Users, Eye, Video, Calendar, TrendingUp, DollarSign, Star, AlertTriangle } from 'lucide-react';

interface MinimalDashboardProps {
  analytics: any; // MinimalAnalytics type
  onReset: () => void;
}

const MinimalDashboard: React.FC<MinimalDashboardProps> = ({ analytics, onReset }) => {
  const { overview, recentPerformance, projections, demoNote, requestedUrl } = analytics;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Demo Notice */}
        {demoNote && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Demo Mode - Sample Data
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  {demoNote}
                </p>
                {requestedUrl && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    You requested: {requestedUrl}
                  </p>
                )}
                <a 
                  href="/auth/signup" 
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-yellow-900 dark:text-yellow-100 hover:underline"
                >
                  Sign up for free to analyze real channels →
                </a>
              </div>
            </div>
          </div>
        )}

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
            {overview.thumbnailUrl ? (
              <img
                src={overview.thumbnailUrl}
                alt={overview.title}
                className="w-20 h-20 rounded-full ring-2 ring-youtube-red ring-offset-2 dark:ring-offset-dark-bg-card object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const defaultAvatar = document.createElement('div');
                    defaultAvatar.className = 'w-20 h-20 rounded-full ring-2 ring-youtube-red ring-offset-2 dark:ring-offset-dark-bg-card bg-gradient-to-br from-youtube-red to-youtube-red-hover flex items-center justify-center text-white font-bold text-2xl';
                    defaultAvatar.textContent = overview.title?.charAt(0).toUpperCase() || 'Y';
                    parent.appendChild(defaultAvatar);
                  }
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full ring-2 ring-youtube-red ring-offset-2 dark:ring-offset-dark-bg-card bg-gradient-to-br from-youtube-red to-youtube-red-hover flex items-center justify-center text-white font-bold text-2xl">
                {overview.title?.charAt(0).toUpperCase() || 'Y'}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{overview.title}</h1>
              <p className="text-gray-600 dark:text-dark-text-secondary mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-youtube-red rounded-full"></span>
                {overview.niche} Channel
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mt-2">
                Channel Age: {overview?.estimatedAge?.years || 0}y {overview?.estimatedAge?.months || 0}m
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
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {overview?.subscriberCount?.toLocaleString() || '0'}
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
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {overview?.totalViews?.toLocaleString() || '0'}
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
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {overview?.videoCount?.toLocaleString() || '0'}
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
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  ${overview?.monthlyRevenue?.estimated?.toLocaleString() || '0'}
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
              (Last {recentPerformance?.totalVideos || 0} videos)
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-1">Average Views</p>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {recentPerformance?.averageViews?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mt-1">
                Upload frequency: {recentPerformance?.uploadFrequency || 0} videos/month
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-1">Content Mix</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {recentPerformance?.contentMix?.longFormPercentage || 0}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-tertiary">Long-form</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {recentPerformance?.contentMix?.shortsPercentage || 0}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-tertiary">Shorts</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-1">Revenue Estimate</p>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                ${recentPerformance?.revenueEstimate?.monthly?.toLocaleString() || '0'}/mo
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-1">
                Range: ${overview?.monthlyRevenue?.min || 0} - ${overview?.monthlyRevenue?.max || 0}
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
                {recentPerformance?.bestVideo?.title || 'No videos found'}
              </p>
              <p className="text-lg font-bold text-accent-green mt-2">
                {recentPerformance?.bestVideo?.views?.toLocaleString() || '0'} views
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recentPerformance?.bestVideo?.performance === 'excellent' ? 'bg-accent-green/20 text-accent-green' :
                  recentPerformance?.bestVideo?.performance === 'good' ? 'bg-accent-blue/20 text-accent-blue' :
                  'bg-dark-bg-secondary text-dark-text-secondary'
                }`}>
                  {recentPerformance?.bestVideo?.performance || 'average'}
                </span>
                <span className="text-xs text-gray-500 dark:text-dark-text-tertiary">
                  {recentPerformance?.bestVideo?.isShort ? 'Short' : 'Long-form'}
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
                {recentPerformance?.worstVideo?.title || 'No videos found'}
              </p>
              <p className="text-lg font-bold text-youtube-red mt-2">
                {recentPerformance?.worstVideo?.views?.toLocaleString() || '0'} views
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recentPerformance?.worstVideo?.performance === 'poor' ? 'bg-youtube-red/20 text-youtube-red' :
                  'bg-dark-bg-secondary text-dark-text-secondary'
                }`}>
                  {recentPerformance?.worstVideo?.performance || 'average'}
                </span>
                <span className="text-xs text-gray-500 dark:text-dark-text-tertiary">
                  {recentPerformance?.worstVideo?.isShort ? 'Short' : 'Long-form'}
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
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {projections?.subscribers?.nextMilestone?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                {projections?.subscribers?.estimatedDays || '0'} days to reach
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-1">
                Growth rate: {projections?.subscribers?.growthRate?.toLocaleString() || '0'}/month
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-2">Revenue Projections</p>
              <div className="space-y-2">
                <div>
                  <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    ${projections?.revenue?.nextMonth?.toLocaleString() || '0'}/mo
                  </p>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                    ${projections?.revenue?.nextYear?.toLocaleString() || '0'}/yr
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