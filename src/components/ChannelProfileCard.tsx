import React from 'react';
import { Users, Video, Calendar, Tag, DollarSign } from 'lucide-react';

interface ChannelProfileCardProps {
  channel: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    subscriberCount: number;
    videoCount: number;
    niche?: string;
    monetization?: {
      isMonetized: boolean;
      status: string;
      lastChecked: string | null;
      badge: string;
    } | null;
  };
}

const ChannelProfileCard: React.FC<ChannelProfileCardProps> = ({ channel }) => {
  return (
    <div className="bg-dark-bg-card rounded-xl shadow-sm border border-dark-border p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Channel Avatar */}
        <div className="flex-shrink-0">
          {channel.thumbnailUrl ? (
            <img
              src={channel.thumbnailUrl}
              alt={channel.title}
              className="w-24 h-24 rounded-full object-cover border-4 border-dark-border"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const defaultAvatar = document.createElement('div');
                  defaultAvatar.className = 'w-24 h-24 rounded-full border-4 border-dark-border bg-gradient-to-br from-youtube-red to-youtube-red-hover flex items-center justify-center text-white font-bold text-3xl';
                  defaultAvatar.textContent = channel.title?.charAt(0).toUpperCase() || 'Y';
                  parent.appendChild(defaultAvatar);
                }
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-dark-border bg-gradient-to-br from-youtube-red to-youtube-red-hover flex items-center justify-center text-white font-bold text-3xl">
              {channel.title?.charAt(0).toUpperCase() || 'Y'}
            </div>
          )}
        </div>

        {/* Channel Info */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {channel.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {channel.niche && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium">
                    <Tag className="h-3 w-3" />
                    {channel.niche}
                  </div>
                )}
                {channel.monetization && (
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    channel.monetization.isMonetized 
                      ? 'bg-accent-green/20 text-accent-green' 
                      : 'bg-dark-bg-secondary text-dark-text-tertiary'
                  }`}>
                    <DollarSign className="h-3 w-3" />
                    {channel.monetization.status}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-dark-text-secondary mb-4 line-clamp-3">
            {channel.description || 'No description available.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-dark-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-white break-words">
                  {channel.subscriberCount.toLocaleString()}
                </p>
                <p className="text-xs text-dark-text-tertiary">Subscribers</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-dark-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-white break-words">
                  {channel.videoCount.toLocaleString()}
                </p>
                <p className="text-xs text-dark-text-tertiary">Videos</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-dark-text-tertiary" />
              <div>
                <p className="text-sm font-medium text-white">
                  Active
                </p>
                <p className="text-xs text-dark-text-tertiary">Status</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfileCard;