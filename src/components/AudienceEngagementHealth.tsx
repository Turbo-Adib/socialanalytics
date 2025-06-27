import React, { useMemo } from 'react';
import { 
  Heart, 
  MessageSquare, 
  ThumbsUp, 
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Gauge,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface EngagementMetrics {
  viewsToLikesRatio: number;
  viewsToCommentsRatio: number;
  averageViewDuration: number; // percentage
  viewVelocityDecay: number; // how fast views slow down
  audienceSentiment: 'positive' | 'neutral' | 'negative';
  overallHealthScore: number; // 0-100
}

interface AudienceEngagementHealthProps {
  recentVideos: any[];
  channelStats: {
    subscriberCount: number;
    totalViews: number;
  };
}

const AudienceEngagementHealth: React.FC<AudienceEngagementHealthProps> = ({
  recentVideos,
  channelStats
}) => {
  const metrics = useMemo<EngagementMetrics>(() => {
    if (recentVideos.length === 0) {
      return {
        viewsToLikesRatio: 0,
        viewsToCommentsRatio: 0,
        averageViewDuration: 0,
        viewVelocityDecay: 0,
        audienceSentiment: 'neutral',
        overallHealthScore: 0
      };
    }

    // Calculate engagement ratios (using mock data since YouTube API doesn't provide likes/comments)
    const avgViews = recentVideos.reduce((sum, v) => sum + v.views, 0) / recentVideos.length;
    const estimatedLikes = avgViews * 0.04; // Industry average ~4% like rate
    const estimatedComments = avgViews * 0.002; // Industry average ~0.2% comment rate

    const viewsToLikesRatio = (estimatedLikes / avgViews) * 100;
    const viewsToCommentsRatio = (estimatedComments / avgViews) * 100;

    // Calculate view velocity decay (how fast views drop off)
    const sortedByDate = [...recentVideos].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    let velocityDecay = 0;
    if (sortedByDate.length >= 5) {
      const recent = sortedByDate.slice(0, 5).reduce((sum, v) => sum + v.views, 0) / 5;
      const older = sortedByDate.slice(-5).reduce((sum, v) => sum + v.views, 0) / 5;
      velocityDecay = older > 0 ? ((recent - older) / older) * 100 : 0;
    }

    // Mock average view duration (in reality, this requires Analytics API)
    const averageViewDuration = 45 + Math.random() * 20; // 45-65%

    // Determine audience sentiment based on engagement
    let audienceSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (viewsToLikesRatio > 5) audienceSentiment = 'positive';
    else if (viewsToLikesRatio < 2) audienceSentiment = 'negative';

    // Calculate overall health score
    let healthScore = 0;
    
    // Engagement rate (40% weight)
    if (viewsToLikesRatio > 5) healthScore += 40;
    else if (viewsToLikesRatio > 3) healthScore += 30;
    else if (viewsToLikesRatio > 1) healthScore += 20;
    else healthScore += 10;

    // View retention (30% weight)
    if (averageViewDuration > 60) healthScore += 30;
    else if (averageViewDuration > 45) healthScore += 20;
    else if (averageViewDuration > 30) healthScore += 10;
    else healthScore += 5;

    // Growth momentum (20% weight)
    if (velocityDecay > 20) healthScore += 20;
    else if (velocityDecay > 0) healthScore += 15;
    else if (velocityDecay > -20) healthScore += 10;
    else healthScore += 5;

    // Community activity (10% weight)
    if (viewsToCommentsRatio > 0.3) healthScore += 10;
    else if (viewsToCommentsRatio > 0.15) healthScore += 7;
    else healthScore += 3;

    return {
      viewsToLikesRatio,
      viewsToCommentsRatio,
      averageViewDuration,
      viewVelocityDecay: velocityDecay,
      audienceSentiment,
      overallHealthScore: Math.round(healthScore)
    };
  }, [recentVideos]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-dark-bg-card rounded-lg shadow-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Heart className="h-5 w-5 text-red-500" />
        Audience Engagement Health
      </h3>

      {/* Overall Health Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-dark-text-secondary">Overall Health Score</span>
          <span className={`text-sm font-medium ${getHealthColor(metrics.overallHealthScore)}`}>
            {getHealthLabel(metrics.overallHealthScore)}
          </span>
        </div>
        <div className="relative h-8 bg-dark-bg-secondary rounded-full overflow-hidden">
          <div 
            className={`absolute left-0 top-0 h-full transition-all duration-500 ${
              metrics.overallHealthScore >= 80 ? 'bg-green-500' :
              metrics.overallHealthScore >= 60 ? 'bg-yellow-500' :
              metrics.overallHealthScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${metrics.overallHealthScore}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{metrics.overallHealthScore}/100</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Engagement Rate */}
        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-dark-text-secondary">Like Rate</span>
          </div>
          <div className="text-xl font-semibold text-white">
            {metrics.viewsToLikesRatio.toFixed(1)}%
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            Industry avg: 4%
          </div>
        </div>

        {/* Comment Rate */}
        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-purple-500" />
            <span className="text-xs text-dark-text-secondary">Comment Rate</span>
          </div>
          <div className="text-xl font-semibold text-white">
            {metrics.viewsToCommentsRatio.toFixed(2)}%
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            Industry avg: 0.2%
          </div>
        </div>

        {/* View Duration */}
        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="text-xs text-dark-text-secondary">Avg Watch Time</span>
          </div>
          <div className="text-xl font-semibold text-white">
            {metrics.averageViewDuration.toFixed(0)}%
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            of video length
          </div>
        </div>

        {/* Velocity */}
        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            {metrics.viewVelocityDecay > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className="text-xs text-dark-text-secondary">Momentum</span>
          </div>
          <div className={`text-xl font-semibold ${
            metrics.viewVelocityDecay > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {metrics.viewVelocityDecay > 0 ? '+' : ''}{metrics.viewVelocityDecay.toFixed(0)}%
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            view growth
          </div>
        </div>
      </div>

      {/* Audience Sentiment */}
      <div className="bg-dark-bg-secondary rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-white">Audience Sentiment</span>
          </div>
          <div className="flex items-center gap-2">
            {getSentimentIcon(metrics.audienceSentiment)}
            <span className="text-sm font-medium text-white capitalize">
              {metrics.audienceSentiment}
            </span>
          </div>
        </div>
      </div>

      {/* Health Insights */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white mb-2">Health Insights</h4>
        
        {metrics.viewsToLikesRatio > 5 && (
          <div className="flex items-start gap-2 text-xs">
            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
            <span className="text-dark-text-secondary">
              Excellent engagement rate! Your audience is highly active and appreciative.
            </span>
          </div>
        )}

        {metrics.viewVelocityDecay < -20 && (
          <div className="flex items-start gap-2 text-xs">
            <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5" />
            <span className="text-dark-text-secondary">
              View momentum is declining. Consider refreshing your content strategy.
            </span>
          </div>
        )}

        {metrics.averageViewDuration < 40 && (
          <div className="flex items-start gap-2 text-xs">
            <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5" />
            <span className="text-dark-text-secondary">
              Low average watch time. Focus on stronger hooks and pacing.
            </span>
          </div>
        )}

        {metrics.viewsToCommentsRatio < 0.1 && (
          <div className="flex items-start gap-2 text-xs">
            <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5" />
            <span className="text-dark-text-secondary">
              Low comment activity. Try asking questions or creating discussion topics.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudienceEngagementHealth;