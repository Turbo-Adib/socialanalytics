import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Eye, 
  Video,
  BarChart3,
  Target,
  Zap,
  AlertCircle,
  Search,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface CompetitorChannel {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount: number;
  videoCount: number;
  totalViews: number;
  avgViewsPerVideo: number;
  uploadFrequency: number; // videos per week
  growthRate: number; // percentage monthly
  contentFocus: string[];
  strengths: string[];
}

interface CompetitionBenchmarkProps {
  currentChannel: {
    id: string;
    title: string;
    subscriberCount: number;
    videoCount: number;
    totalViews: number;
    niche?: string;
  };
  recentVideos: any[];
}

const CompetitionBenchmark: React.FC<CompetitionBenchmarkProps> = ({
  currentChannel,
  recentVideos
}) => {
  const [competitors, setCompetitors] = useState<CompetitorChannel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  useEffect(() => {
    // Generate mock competitor data based on niche
    generateCompetitors();
  }, [currentChannel.niche]);

  const generateCompetitors = () => {
    // In a real implementation, this would use YouTube API to find similar channels
    const mockCompetitors: CompetitorChannel[] = [
      {
        id: 'comp1',
        name: 'TechReview Pro',
        thumbnailUrl: 'https://via.placeholder.com/88',
        subscriberCount: currentChannel.subscriberCount * 1.5,
        videoCount: 450,
        totalViews: currentChannel.totalViews * 2,
        avgViewsPerVideo: 125000,
        uploadFrequency: 3.5,
        growthRate: 12,
        contentFocus: ['Product Reviews', 'Unboxings', 'Comparisons'],
        strengths: ['Consistent upload schedule', 'High production quality', 'Strong SEO']
      },
      {
        id: 'comp2',
        name: 'Digital Insights',
        thumbnailUrl: 'https://via.placeholder.com/88',
        subscriberCount: currentChannel.subscriberCount * 0.8,
        videoCount: 320,
        totalViews: currentChannel.totalViews * 0.9,
        avgViewsPerVideo: 85000,
        uploadFrequency: 2.5,
        growthRate: 8,
        contentFocus: ['Tutorials', 'News', 'Analysis'],
        strengths: ['Deep technical content', 'Loyal audience', 'Long-form content']
      },
      {
        id: 'comp3',
        name: 'Tech Daily',
        thumbnailUrl: 'https://via.placeholder.com/88',
        subscriberCount: currentChannel.subscriberCount * 2.1,
        videoCount: 890,
        totalViews: currentChannel.totalViews * 3.5,
        avgViewsPerVideo: 200000,
        uploadFrequency: 7,
        growthRate: 25,
        contentFocus: ['News', 'Shorts', 'Quick Reviews'],
        strengths: ['Daily uploads', 'Trending topics', 'High engagement']
      }
    ];

    setCompetitors(mockCompetitors);
  };

  const calculateComparison = (yourValue: number, competitorValue: number) => {
    const diff = ((yourValue - competitorValue) / competitorValue) * 100;
    return {
      value: diff,
      icon: diff > 5 ? <ArrowUp className="h-3 w-3" /> : 
            diff < -5 ? <ArrowDown className="h-3 w-3" /> : 
            <Minus className="h-3 w-3" />,
      color: diff > 5 ? 'text-green-500' : 
             diff < -5 ? 'text-red-500' : 
             'text-yellow-500'
    };
  };

  const getMarketPosition = () => {
    const avgCompetitorSubs = competitors.reduce((sum, c) => sum + c.subscriberCount, 0) / competitors.length;
    const position = (currentChannel.subscriberCount / avgCompetitorSubs) * 100;
    
    if (position > 120) return { label: 'Market Leader', color: 'text-green-500' };
    if (position > 80) return { label: 'Strong Competitor', color: 'text-blue-500' };
    if (position > 50) return { label: 'Growing Channel', color: 'text-yellow-500' };
    return { label: 'Emerging Channel', color: 'text-orange-500' };
  };

  const marketPosition = getMarketPosition();

  return (
    <div className="bg-dark-bg-card rounded-lg shadow-lg p-6 border border-dark-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Competition Benchmark
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-dark-text-secondary">Market Position:</span>
          <span className={`text-sm font-medium ${marketPosition.color}`}>
            {marketPosition.label}
          </span>
        </div>
      </div>

      {/* Your Channel Summary */}
      <div className="bg-dark-bg-secondary rounded-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h4 className="font-medium text-white mb-2">{currentChannel.title}</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-dark-text-tertiary">Subscribers</span>
                <div className="font-semibold text-white">
                  {currentChannel.subscriberCount.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-dark-text-tertiary">Total Views</span>
                <div className="font-semibold text-white">
                  {(currentChannel.totalViews / 1000000).toFixed(1)}M
                </div>
              </div>
              <div>
                <span className="text-dark-text-tertiary">Videos</span>
                <div className="font-semibold text-white">
                  {currentChannel.videoCount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Comparison */}
      <div className="space-y-4 mb-6">
        {competitors.map((competitor) => {
          const subComparison = calculateComparison(currentChannel.subscriberCount, competitor.subscriberCount);
          const viewComparison = calculateComparison(currentChannel.totalViews, competitor.totalViews);
          const avgViewsPerVideo = currentChannel.totalViews / currentChannel.videoCount;
          const avgViewComparison = calculateComparison(avgViewsPerVideo, competitor.avgViewsPerVideo);

          return (
            <div
              key={competitor.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedCompetitor === competitor.id
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-dark-border hover:border-dark-text-secondary'
              }`}
              onClick={() => setSelectedCompetitor(
                selectedCompetitor === competitor.id ? null : competitor.id
              )}
            >
              <div className="flex items-start gap-4">
                <img
                  src={competitor.thumbnailUrl}
                  alt={competitor.name}
                  className="w-16 h-16 rounded-full"
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{competitor.name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-green-500">+{competitor.growthRate}%/mo</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-dark-text-tertiary">Subscribers</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-white">
                          {(competitor.subscriberCount / 1000000).toFixed(1)}M
                        </span>
                        <span className={`flex items-center ${subComparison.color}`}>
                          {subComparison.icon}
                          {Math.abs(subComparison.value).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-dark-text-tertiary">Total Views</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-white">
                          {(competitor.totalViews / 1000000).toFixed(1)}M
                        </span>
                        <span className={`flex items-center ${viewComparison.color}`}>
                          {viewComparison.icon}
                          {Math.abs(viewComparison.value).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-dark-text-tertiary">Avg Views</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-white">
                          {(competitor.avgViewsPerVideo / 1000).toFixed(0)}K
                        </span>
                        <span className={`flex items-center ${avgViewComparison.color}`}>
                          {avgViewComparison.icon}
                          {Math.abs(avgViewComparison.value).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-dark-text-tertiary">Upload Freq</span>
                      <div className="font-medium text-white">
                        {competitor.uploadFrequency}/week
                      </div>
                    </div>
                  </div>

                  {selectedCompetitor === competitor.id && (
                    <div className="mt-4 pt-4 border-t border-dark-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-white mb-2">Content Focus</h5>
                          <div className="flex flex-wrap gap-2">
                            {competitor.contentFocus.map((focus) => (
                              <span
                                key={focus}
                                className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full"
                              >
                                {focus}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-white mb-2">Their Strengths</h5>
                          <ul className="space-y-1">
                            {competitor.strengths.map((strength) => (
                              <li key={strength} className="text-xs text-dark-text-secondary flex items-start gap-1">
                                <Zap className="h-3 w-3 text-yellow-500 mt-0.5" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Insights */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/30">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" />
          Strategic Opportunities
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5" />
            <span className="text-dark-text-secondary">
              Your upload frequency is lower than top competitors. Consider increasing to 3-4 videos/week.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3 w-3 text-blue-500 mt-0.5" />
            <span className="text-dark-text-secondary">
              Competitors focus heavily on Shorts. Balance your content mix for better reach.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-3 w-3 text-green-500 mt-0.5" />
            <span className="text-dark-text-secondary">
              Your engagement rate exceeds competitors. Leverage this for sponsorships.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionBenchmark;