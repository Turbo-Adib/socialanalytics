import { AccurateVideoData } from '@/src/lib/youtubeAccurate';
import { calculateLongFormRevenue, calculateShortsRevenue } from '@/src/utils/revenueCalculations';

export interface SimplifiedStats {
  totalViews: number;
  longFormViews: number;
  shortsViews: number;
  longFormCount: number;
  shortsCount: number;
  averageViewsPerVideo: number;
  estimatedRevenue: {
    longForm: number;
    shorts: number;
    total: number;
  };
  uploadFrequency: number; // videos per week
  lastUploadDate: string;
}

export interface RecentPerformance {
  last30Days: SimplifiedStats;
  last7Days: SimplifiedStats;
  mostPopularVideo: AccurateVideoData | null;
  recentTrend: 'growing' | 'stable' | 'declining';
}

/**
 * Simplified analytics focused on recent, accurate data only
 */
export class SimplifiedAnalytics {
  
  /**
   * Calculate current stats from recent videos (no historical complexity)
   */
  static async calculateCurrentStats(
    videos: AccurateVideoData[], 
    niche: string
  ): Promise<SimplifiedStats> {
    
    const longFormVideos = videos.filter(v => !v.isShort);
    const shortsVideos = videos.filter(v => v.isShort);
    
    const longFormViews = longFormVideos.reduce((sum, v) => sum + v.viewCount, 0);
    const shortsViews = shortsVideos.reduce((sum, v) => sum + v.viewCount, 0);
    const totalViews = longFormViews + shortsViews;
    
    // Calculate revenue using accurate view counts
    const longFormRevenue = longFormViews > 0 ? await calculateLongFormRevenue(longFormViews, niche) : 0;
    const shortsRevenue = shortsViews > 0 ? calculateShortsRevenue(shortsViews) : 0;
    
    // Calculate upload frequency (videos per week over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVideos = videos.filter(v => 
      new Date(v.publishedAt) >= thirtyDaysAgo
    );
    
    const uploadFrequency = recentVideos.length / 4.33; // 30 days ≈ 4.33 weeks
    
    const lastUploadDate = videos.length > 0 ? 
      videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0].publishedAt :
      new Date().toISOString();
    
    return {
      totalViews,
      longFormViews,
      shortsViews,
      longFormCount: longFormVideos.length,
      shortsCount: shortsVideos.length,
      averageViewsPerVideo: videos.length > 0 ? totalViews / videos.length : 0,
      estimatedRevenue: {
        longForm: longFormRevenue,
        shorts: shortsRevenue,
        total: longFormRevenue + shortsRevenue
      },
      uploadFrequency,
      lastUploadDate
    };
  }
  
  /**
   * Calculate performance for different time periods
   */
  static async calculateRecentPerformance(
    videos: AccurateVideoData[], 
    niche: string
  ): Promise<RecentPerformance> {
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter videos by time period
    const last30DaysVideos = videos.filter(v => 
      new Date(v.publishedAt) >= thirtyDaysAgo
    );
    
    const last7DaysVideos = videos.filter(v => 
      new Date(v.publishedAt) >= sevenDaysAgo
    );
    
    // Calculate stats for each period
    const last30Days = await this.calculateCurrentStats(last30DaysVideos, niche);
    const last7Days = await this.calculateCurrentStats(last7DaysVideos, niche);
    
    // Find most popular video (highest view count)
    const mostPopularVideo = videos.length > 0 ? 
      videos.reduce((prev, current) => 
        prev.viewCount > current.viewCount ? prev : current
      ) : null;
    
    // Determine trend (simple comparison)
    let recentTrend: 'growing' | 'stable' | 'declining' = 'stable';
    
    if (last7Days.averageViewsPerVideo > last30Days.averageViewsPerVideo * 1.2) {
      recentTrend = 'growing';
    } else if (last7Days.averageViewsPerVideo < last30Days.averageViewsPerVideo * 0.8) {
      recentTrend = 'declining';
    }
    
    return {
      last30Days,
      last7Days,
      mostPopularVideo,
      recentTrend
    };
  }
  
  /**
   * Simple projections based on recent performance (no complex calculations)
   */
  static calculateSimpleProjections(recentPerformance: RecentPerformance) {
    const { last30Days, last7Days } = recentPerformance;
    
    // Simple linear projection based on weekly performance
    const weeklyViews = last7Days.totalViews;
    const weeklyRevenue = last7Days.estimatedRevenue.total;
    
    // Project next month (4 weeks)
    const nextMonthViews = weeklyViews * 4;
    const nextMonthRevenue = weeklyRevenue * 4;
    
    // Project next year (52 weeks)
    const nextYearViews = weeklyViews * 52;
    const nextYearRevenue = weeklyRevenue * 52;
    
    return {
      nextMonth: {
        views: Math.round(nextMonthViews),
        revenue: Math.round(nextMonthRevenue * 100) / 100 // Round to 2 decimal places
      },
      nextYear: {
        views: Math.round(nextYearViews),
        revenue: Math.round(nextYearRevenue * 100) / 100
      }
    };
  }
  
  /**
   * Generate simple month-by-month data for charts (last 6 months only)
   */
  static async generateSimpleChartData(videos: AccurateVideoData[], niche: string) {
    const chartData = [];
    const now = new Date();
    
    // Only show last 6 months to keep it simple and accurate
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthVideos = videos.filter(v => {
        const publishDate = new Date(v.publishedAt);
        return publishDate >= monthStart && publishDate <= monthEnd;
      });
      
      if (monthVideos.length === 0) {
        continue; // Skip months with no videos
      }
      
      const longFormVideos = monthVideos.filter(v => !v.isShort);
      const shortsVideos = monthVideos.filter(v => v.isShort);
      
      const longFormViews = longFormVideos.reduce((sum, v) => sum + v.viewCount, 0);
      const shortsViews = shortsVideos.reduce((sum, v) => sum + v.viewCount, 0);
      
      // Calculate revenue for this month
      const estRevenueLong = longFormViews > 0 ? await calculateLongFormRevenue(longFormViews, niche) : 0;
      const estRevenueShorts = shortsViews > 0 ? calculateShortsRevenue(shortsViews) : 0;
      
      chartData.push({
        month: monthStart.toISOString().substring(0, 7), // YYYY-MM format
        longFormViews,
        shortsViews,
        estRevenueLong,
        estRevenueShorts
      });
    }
    
    return chartData;
  }
  
  /**
   * Detect content focus (what type of content performs best)
   */
  static analyzeContentFocus(videos: AccurateVideoData[]) {
    const longFormVideos = videos.filter(v => !v.isShort);
    const shortsVideos = videos.filter(v => v.isShort);
    
    const longFormAvgViews = longFormVideos.length > 0 ? 
      longFormVideos.reduce((sum, v) => sum + v.viewCount, 0) / longFormVideos.length : 0;
    
    const shortsAvgViews = shortsVideos.length > 0 ? 
      shortsVideos.reduce((sum, v) => sum + v.viewCount, 0) / shortsVideos.length : 0;
    
    const focus = longFormAvgViews > shortsAvgViews ? 'long-form' : 'shorts';
    const focusPercentage = Math.round(
      (focus === 'long-form' ? longFormVideos.length : shortsVideos.length) / 
      videos.length * 100
    );
    
    return {
      primaryFocus: focus,
      focusPercentage,
      longFormPerformance: {
        count: longFormVideos.length,
        averageViews: Math.round(longFormAvgViews)
      },
      shortsPerformance: {
        count: shortsVideos.length,
        averageViews: Math.round(shortsAvgViews)
      }
    };
  }
}