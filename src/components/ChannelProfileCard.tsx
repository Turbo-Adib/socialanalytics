import React from 'react';
import { Users, Video, Calendar, Tag } from 'lucide-react';

interface ChannelProfileCardProps {
  channel: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    subscriberCount: number;
    videoCount: number;
    niche?: string;
  };
}

const ChannelProfileCard: React.FC<ChannelProfileCardProps> = ({ channel }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          <img
            src={channel.thumbnailUrl || '/default-avatar.png'}
            alt={channel.title}
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
          />
        </div>

        {/* Channel Info */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {channel.title}
              </h1>
              {channel.niche && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                  <Tag className="h-3 w-3" />
                  {channel.niche}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {channel.description || 'No description available.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {channel.subscriberCount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Subscribers</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {channel.videoCount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Videos</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Active
                </p>
                <p className="text-xs text-gray-500">Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfileCard;