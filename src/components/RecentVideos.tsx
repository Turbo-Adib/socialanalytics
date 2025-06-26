import React from 'react';
import { Play, Eye, Calendar, Zap, TrendingUp, TrendingDown, DollarSign, ThumbsUp, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentVideo {
  id: string;
  title: string;
  views: number;
  publishedAt: string;
  isShort: boolean;
  likeCount?: number;
  commentCount?: number;
  estimatedRevenue?: number;
  performance?: 'high' | 'average' | 'low';
  engagementRate?: number;
}

interface RecentVideosProps {
  videos: RecentVideo[];
}

const RecentVideos: React.FC<RecentVideosProps> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-8">
        <Play className="mx-auto h-12 w-12 text-dark-text-tertiary" />
        <h3 className="mt-2 text-sm font-medium text-white">No recent videos</h3>
        <p className="mt-1 text-sm text-dark-text-secondary">
          Recent videos will appear here once the channel is analyzed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Play className="h-5 w-5" />
          Recent Videos Performance
        </h3>
        <div className="text-xs text-dark-text-secondary">
          {videos.length} videos analyzed
        </div>
      </div>
      
      <div className="space-y-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 p-4 bg-dark-bg-secondary rounded-lg hover:bg-dark-bg-hover transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-16 h-12 bg-dark-bg-primary rounded flex items-center justify-center">
                {video.isShort ? (
                  <Zap className="h-6 w-6 text-accent-yellow" />
                ) : (
                  <Play className="h-6 w-6 text-dark-text-tertiary" />
                )}
              </div>
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-medium text-white truncate pr-2">
                  {video.title}
                </h4>
                {video.performance && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {video.performance === 'high' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : video.performance === 'low' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4 bg-yellow-500 rounded-full" />
                    )}
                    <span className={`text-xs font-medium ${
                      video.performance === 'high' ? 'text-green-600' :
                      video.performance === 'low' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {video.performance.charAt(0).toUpperCase() + video.performance.slice(1)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-xs text-dark-text-secondary">
                  <Eye className="h-3 w-3" />
                  {video.views.toLocaleString()} views
                </div>
                {video.likeCount && (
                  <div className="flex items-center gap-1 text-xs text-dark-text-secondary">
                    <ThumbsUp className="h-3 w-3" />
                    {video.likeCount.toLocaleString()}
                  </div>
                )}
                {video.commentCount && (
                  <div className="flex items-center gap-1 text-xs text-dark-text-secondary">
                    <MessageCircle className="h-3 w-3" />
                    {video.commentCount.toLocaleString()}
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-dark-text-secondary">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-2">
                {video.isShort && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-yellow/20 text-accent-yellow">
                    Short
                  </span>
                )}
                {video.estimatedRevenue && (
                  <div className="flex items-center gap-1 text-xs text-accent-green">
                    <DollarSign className="h-3 w-3" />
                    ${video.estimatedRevenue.toFixed(2)}
                  </div>
                )}
                {video.engagementRate && (
                  <span className="text-xs text-accent-blue font-medium">
                    {(video.engagementRate * 100).toFixed(1)}% engagement
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentVideos;