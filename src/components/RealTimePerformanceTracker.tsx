import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Eye, 
  Zap, 
  AlertTriangle,
  BarChart3,
  Activity,
  Target,
  Flame
} from 'lucide-react';
import { Line } from 'recharts';
import { formatDistanceToNow } from 'date-fns';

interface VideoPerformance {
  id: string;
  title: string;
  publishedAt: string;
  currentViews: number;
  viewsPerHour: number;
  viewsPerDay: number;
  momentum: 'accelerating' | 'steady' | 'declining';
  performanceVsAverage: number; // percentage
  breakoutPotential: 'high' | 'medium' | 'low';
  thumbnailUrl?: string;
}

interface RealTimePerformanceTrackerProps {
  channelId: string;
  recentVideos: any[];
  channelAverageViews: number;
}

const RealTimePerformanceTracker: React.FC<RealTimePerformanceTrackerProps> = ({
  channelId,
  recentVideos,
  channelAverageViews
}) => {
  const [trackedVideos, setTrackedVideos] = useState<VideoPerformance[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [hourlyData, setHourlyData] = useState<any[]>([]);

  useEffect(() => {
    // Filter videos published in the last 48 hours
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const recentlyPublished = recentVideos.filter(video => 
      new Date(video.publishedAt) > fortyEightHoursAgo
    ).slice(0, 5); // Track up to 5 most recent videos

    const performanceData = recentlyPublished.map(video => {
      const hoursPublished = (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60);
      const viewsPerHour = Math.round(video.views / hoursPublished);
      const viewsPerDay = viewsPerHour * 24;
      
      // Calculate momentum based on view velocity
      const expectedViewsAtThisTime = channelAverageViews * (hoursPublished / (24 * 7)); // Assuming avg is for 1 week
      const performanceRatio = video.views / expectedViewsAtThisTime;
      
      let momentum: 'accelerating' | 'steady' | 'declining' = 'steady';
      if (performanceRatio > 1.5) momentum = 'accelerating';
      else if (performanceRatio < 0.7) momentum = 'declining';

      // Calculate breakout potential
      let breakoutPotential: 'high' | 'medium' | 'low' = 'low';
      if (hoursPublished < 12 && performanceRatio > 2) breakoutPotential = 'high';
      else if (hoursPublished < 24 && performanceRatio > 1.5) breakoutPotential = 'medium';

      return {
        id: video.id,
        title: video.title,
        publishedAt: video.publishedAt,
        currentViews: video.views,
        viewsPerHour,
        viewsPerDay,
        momentum,
        performanceVsAverage: Math.round((performanceRatio - 1) * 100),
        breakoutPotential,
        thumbnailUrl: video.thumbnailUrl
      };
    });

    setTrackedVideos(performanceData);

    // Generate mock hourly data for the selected video
    if (selectedVideo && performanceData.length > 0) {
      const video = performanceData.find(v => v.id === selectedVideo);
      if (video) {
        const hours = Math.min(48, Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60)));
        const data = Array.from({ length: hours }, (_, i) => ({
          hour: i,
          views: Math.floor((video.currentViews / hours) * i * (1 + Math.random() * 0.3))
        }));
        setHourlyData(data);
      }
    }
  }, [recentVideos, channelAverageViews, selectedVideo]);

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'accelerating':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getBreakoutColor = (potential: string) => {
    switch (potential) {
      case 'high':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'medium':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (trackedVideos.length === 0) {
    return (
      <div className="bg-dark-bg-card rounded-lg shadow-lg p-6 border border-dark-border">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Real-Time Performance Tracker
        </h3>
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-dark-text-tertiary mx-auto mb-4" />
          <p className="text-dark-text-secondary">No videos published in the last 48 hours</p>
          <p className="text-sm text-dark-text-tertiary mt-2">
            Publish a new video to start tracking its real-time performance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-bg-card rounded-lg shadow-lg p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Real-Time Performance Tracker
        </h3>
        <div className="text-sm text-dark-text-secondary">
          Tracking {trackedVideos.length} recent video{trackedVideos.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Video Performance Cards */}
      <div className="space-y-4 mb-6">
        {trackedVideos.map((video) => (
          <div
            key={video.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedVideo === video.id
                ? 'border-blue-500 bg-blue-500/5'
                : 'border-dark-border hover:border-dark-text-secondary'
            }`}
            onClick={() => setSelectedVideo(video.id)}
          >
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              {video.thumbnailUrl && (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-24 h-14 object-cover rounded"
                />
              )}

              {/* Video Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm line-clamp-1 mb-1">
                  {video.title}
                </h4>
                <div className="text-xs text-dark-text-tertiary mb-2">
                  Published {formatDistanceToNow(new Date(video.publishedAt))} ago
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Current Views */}
                  <div>
                    <div className="flex items-center gap-1 text-dark-text-secondary text-xs mb-1">
                      <Eye className="h-3 w-3" />
                      Current Views
                    </div>
                    <div className="font-semibold text-white">
                      {video.currentViews.toLocaleString()}
                    </div>
                  </div>

                  {/* Views Per Hour */}
                  <div>
                    <div className="flex items-center gap-1 text-dark-text-secondary text-xs mb-1">
                      <Zap className="h-3 w-3" />
                      Per Hour
                    </div>
                    <div className="font-semibold text-white flex items-center gap-1">
                      {video.viewsPerHour.toLocaleString()}
                      {getMomentumIcon(video.momentum)}
                    </div>
                  </div>

                  {/* Performance vs Average */}
                  <div>
                    <div className="flex items-center gap-1 text-dark-text-secondary text-xs mb-1">
                      <Target className="h-3 w-3" />
                      vs Average
                    </div>
                    <div className={`font-semibold ${
                      video.performanceVsAverage > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {video.performanceVsAverage > 0 ? '+' : ''}{video.performanceVsAverage}%
                    </div>
                  </div>

                  {/* Breakout Potential */}
                  <div>
                    <div className="flex items-center gap-1 text-dark-text-secondary text-xs mb-1">
                      <Flame className="h-3 w-3" />
                      Viral Potential
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full border ${getBreakoutColor(video.breakoutPotential)}`}>
                      {video.breakoutPotential.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="mt-3 pt-3 border-t border-dark-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  {video.momentum === 'accelerating' && (
                    <span className="text-green-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Gaining momentum
                    </span>
                  )}
                  {video.breakoutPotential === 'high' && (
                    <span className="text-red-500 flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      Potential viral hit!
                    </span>
                  )}
                  {video.performanceVsAverage > 100 && (
                    <span className="text-blue-500 flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      Outperforming channel average
                    </span>
                  )}
                </div>
                <div className="text-xs text-dark-text-tertiary">
                  {video.viewsPerDay.toLocaleString()} views/day pace
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="space-y-3">
        {trackedVideos.some(v => v.breakoutPotential === 'high') && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Flame className="h-4 w-4 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Viral Alert!</p>
                <p className="text-xs text-dark-text-secondary">
                  One or more videos showing exceptional early performance. Consider promoting!
                </p>
              </div>
            </div>
          </div>
        )}

        {trackedVideos.some(v => v.momentum === 'declining') && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Performance Warning</p>
                <p className="text-xs text-dark-text-secondary">
                  Some videos are underperforming. Consider updating thumbnails or titles.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimePerformanceTracker;