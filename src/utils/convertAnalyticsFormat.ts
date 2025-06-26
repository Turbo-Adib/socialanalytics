import { ChannelAnalytics } from '@/types/youtube';
import { MinimalAnalytics } from '@/utils/minimalAnalytics';

/**
 * Convert ChannelAnalytics format (from /api/analyze) to MinimalAnalytics format (for MinimalDashboard)
 */
export function convertToMinimalAnalytics(analytics: ChannelAnalytics): MinimalAnalytics {
  // Calculate revenue estimate from historical data
  const recentMonthlyRevenue = analytics.historicalData && analytics.historicalData.length > 0
    ? analytics.historicalData[analytics.historicalData.length - 1].estRevenueLong + 
      analytics.historicalData[analytics.historicalData.length - 1].estRevenueShorts
    : 0;
  
  // Find best and worst performing videos
  const sortedVideos = [...(analytics.recentVideos || [])].sort((a, b) => b.views - a.views);
  const bestVideo = sortedVideos[0];
  const worstVideo = sortedVideos[sortedVideos.length - 1];
  
  // Calculate content mix
  const longFormVideos = analytics.recentVideos?.filter(v => !v.isShort) || [];
  const shortVideos = analytics.recentVideos?.filter(v => v.isShort) || [];
  const totalVideos = analytics.recentVideos?.length || 0;
  
  // Calculate average views
  const averageViews = totalVideos > 0
    ? Math.round(analytics.recentVideos!.reduce((sum, v) => sum + v.views, 0) / totalVideos)
    : 0;
  
  // Calculate channel age (estimate from video count and upload frequency if channel creation date not available)
  const channelAge = { years: 1, months: 0 }; // Default estimate
  if (analytics.channel.videoCount > 0 && analytics.currentStats.uploadFrequency > 0) {
    // Estimate based on total videos and upload frequency
    const weeksOfContent = analytics.channel.videoCount / analytics.currentStats.uploadFrequency;
    const monthsOfContent = Math.round(weeksOfContent * 0.23); // Convert weeks to months
    channelAge.years = Math.floor(monthsOfContent / 12);
    channelAge.months = monthsOfContent % 12;
  }
  
  return {
    overview: {
      id: analytics.channel.id,
      title: analytics.channel.title,
      description: analytics.channel.description || '',
      thumbnailUrl: analytics.channel.thumbnailUrl || '',
      subscriberCount: analytics.channel.subscriberCount,
      totalViews: analytics.channel.totalViews,
      videoCount: analytics.channel.videoCount,
      estimatedAge: channelAge,
      monthlyRevenue: {
        min: Math.round(recentMonthlyRevenue * 0.7),
        max: Math.round(recentMonthlyRevenue * 1.3),
        estimated: Math.round(recentMonthlyRevenue)
      },
      niche: analytics.channel.niche
    },
    recentPerformance: {
      averageViews,
      totalVideos,
      bestVideo: bestVideo ? {
        id: bestVideo.id,
        title: bestVideo.title,
        views: bestVideo.views,
        publishedAt: bestVideo.publishedAt,
        duration: 0, // Not available in current format
        isShort: bestVideo.isShort,
        performance: bestVideo.views > averageViews * 2 ? 'excellent' : 
                    bestVideo.views > averageViews * 1.5 ? 'good' :
                    bestVideo.views > averageViews * 0.5 ? 'average' : 'poor'
      } : {
        id: '',
        title: 'No videos found',
        views: 0,
        publishedAt: new Date().toISOString(),
        duration: 0,
        isShort: false,
        performance: 'average' as const
      },
      worstVideo: worstVideo ? {
        id: worstVideo.id,
        title: worstVideo.title,
        views: worstVideo.views,
        publishedAt: worstVideo.publishedAt,
        duration: 0,
        isShort: worstVideo.isShort,
        performance: worstVideo.views > averageViews * 0.5 ? 'average' : 'poor'
      } : {
        id: '',
        title: 'No videos found',
        views: 0,
        publishedAt: new Date().toISOString(),
        duration: 0,
        isShort: false,
        performance: 'average' as const
      },
      uploadFrequency: analytics.currentStats.uploadFrequency,
      contentMix: {
        longFormPercentage: totalVideos > 0 ? Math.round((longFormVideos.length / totalVideos) * 100) : 0,
        shortsPercentage: totalVideos > 0 ? Math.round((shortVideos.length / totalVideos) * 100) : 0
      },
      revenueEstimate: {
        monthly: recentMonthlyRevenue
      }
    },
    projections: {
      subscribers: {
        nextMilestone: Math.ceil(analytics.channel.subscriberCount / 1000000) * 1000000,
        estimatedDays: 180, // Default estimate
        growthRate: 10 // Default 10% per month
      },
      revenue: {
        nextMonth: analytics.projections?.nextMonth?.revenue || recentMonthlyRevenue,
        nextYear: analytics.projections?.nextYear?.revenue || (recentMonthlyRevenue * 12)
      }
    },
    lastUpdated: new Date().toISOString()
  };
}