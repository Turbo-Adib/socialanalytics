import React from 'react';
import { Play, Eye, Calendar, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentVideo {
  id: string;
  title: string;
  views: number;
  publishedAt: string;
  isShort: boolean;
}

interface RecentVideosProps {
  videos: RecentVideo[];
}

const RecentVideos: React.FC<RecentVideosProps> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-8">
        <Play className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No recent videos</h3>
        <p className="mt-1 text-sm text-gray-500">
          Recent videos will appear here once the channel is analyzed.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Play className="h-5 w-5" />
        Recent Videos
      </h3>
      
      <div className="space-y-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                {video.isShort ? (
                  <Zap className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Play className="h-6 w-6 text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="flex-grow min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {video.title}
              </h4>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="h-3 w-3" />
                  {video.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
                </div>
                {video.isShort && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Short
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