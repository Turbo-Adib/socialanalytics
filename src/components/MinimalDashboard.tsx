import React from 'react';
import { ArrowLeft, Users, Eye, Video, Calendar, TrendingUp, DollarSign, Star, AlertTriangle } from 'lucide-react';

interface MinimalDashboardProps {
  analytics: any; // MinimalAnalytics type
  onReset: () => void;
}

const MinimalDashboard: React.FC<MinimalDashboardProps> = ({ analytics, onReset }) => {
  const { overview, recentPerformance, projections } = analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={onReset}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Analyze Another Channel
        </button>

        {/* Channel Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={overview.thumbnailUrl}
              alt={overview.title}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{overview.title}</h1>
              <p className="text-gray-600 mt-1">{overview.niche} Channel</p>
              <p className="text-sm text-gray-500 mt-2">
                Channel Age: {overview.estimatedAge.years}y {overview.estimatedAge.months}m
              </p>
            </div>
          </div>
        </div>

        {/* Core Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {overview.subscriberCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Subscribers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {overview.totalViews.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <Video className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {overview.videoCount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Videos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${overview.monthlyRevenue.estimated.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Performance
            <span className="text-sm font-normal text-gray-500">
              (Last {recentPerformance.totalVideos} videos)
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Views</p>
              <p className="text-xl font-bold text-gray-900">
                {recentPerformance.averageViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Upload frequency: {recentPerformance.uploadFrequency} videos/month
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Content Mix</p>
              <div className="flex gap-4">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {recentPerformance.contentMix.longFormPercentage}%
                  </p>
                  <p className="text-xs text-gray-500">Long-form</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {recentPerformance.contentMix.shortsPercentage}%
                  </p>
                  <p className="text-xs text-gray-500">Shorts</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Revenue Estimate</p>
              <p className="text-xl font-bold text-gray-900">
                ${recentPerformance.revenueEstimate.monthly.toLocaleString()}/month
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Range: ${overview.monthlyRevenue.min} - ${overview.monthlyRevenue.max}
              </p>
            </div>
          </div>
        </div>

        {/* Best/Worst Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              Best Performer
            </h3>
            <div>
              <p className="font-medium text-gray-900 line-clamp-2">
                {recentPerformance.bestVideo.title}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">
                {recentPerformance.bestVideo.views?.toLocaleString()} views
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recentPerformance.bestVideo.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                  recentPerformance.bestVideo.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {recentPerformance.bestVideo.performance}
                </span>
                <span className="text-xs text-gray-500">
                  {recentPerformance.bestVideo.isShort ? 'Short' : 'Long-form'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Needs Improvement
            </h3>
            <div>
              <p className="font-medium text-gray-900 line-clamp-2">
                {recentPerformance.worstVideo.title}
              </p>
              <p className="text-lg font-bold text-red-600 mt-2">
                {recentPerformance.worstVideo.views?.toLocaleString()} views
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  recentPerformance.worstVideo.performance === 'poor' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {recentPerformance.worstVideo.performance}
                </span>
                <span className="text-xs text-gray-500">
                  {recentPerformance.worstVideo.isShort ? 'Short' : 'Long-form'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Projections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Growth Projections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Next Subscriber Milestone</p>
              <p className="text-2xl font-bold text-gray-900">
                {projections.subscribers.nextMilestone.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {projections.subscribers.estimatedDays} days to reach
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Growth rate: {projections.subscribers.growthRate.toLocaleString()}/month
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Revenue Projections</p>
              <div className="space-y-2">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ${projections.revenue.nextMonth.toLocaleString()}/month
                  </p>
                  <p className="text-sm text-gray-600">
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