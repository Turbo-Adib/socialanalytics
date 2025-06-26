import { AccurateVideoData } from '@/lib/youtubeAccurate';
import { calculateLongFormRevenue, calculateShortsRevenue } from '@/utils/revenueCalculations';

export interface SimplifiedStats {
  recentVideoViews: number; // Sum of analyzed recent videos only
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
  dataScope: {
    videosAnalyzed: number;
    oldestVideoDate: string;
    newestVideoDate: string;
    timeSpanDays: number;
  };
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
    
    if (videos.length === 0) {
      return {
        recentVideoViews: 0,
        longFormViews: 0,
        shortsViews: 0,
        longFormCount: 0,
        shortsCount: 0,
        averageViewsPerVideo: 0,
        estimatedRevenue: { longForm: 0, shorts: 0, total: 0 },
        uploadFrequency: 0,
        lastUploadDate: new Date().toISOString(),
        dataScope: {
          videosAnalyzed: 0,
          oldestVideoDate: new Date().toISOString(),
          newestVideoDate: new Date().toISOString(),
          timeSpanDays: 0
        }
      };
    }
    
    const longFormVideos = videos.filter(v => !v.isShort);
    const shortsVideos = videos.filter(v => v.isShort);
    
    const longFormViews = longFormVideos.reduce((sum, v) => sum + v.viewCount, 0);
    const shortsViews = shortsVideos.reduce((sum, v) => sum + v.viewCount, 0);
    const recentVideoViews = longFormViews + shortsViews;
    
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
    
    // Calculate data scope for transparency
    const dates = videos.map(v => new Date(v.publishedAt).getTime()).sort((a, b) => a - b);
    const oldestDate = new Date(dates[0]);
    const newestDate = new Date(dates[dates.length - 1]);
    const timeSpanDays = Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const lastUploadDate = videos.length > 0 ? 
      videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0].publishedAt :
      new Date().toISOString();
    
    return {
      recentVideoViews, // This is ONLY the sum of analyzed videos, not total channel views
      longFormViews,
      shortsViews,
      longFormCount: longFormVideos.length,
      shortsCount: shortsVideos.length,
      averageViewsPerVideo: videos.length > 0 ? recentVideoViews / videos.length : 0,
      estimatedRevenue: {
        longForm: longFormRevenue,
        shorts: shortsRevenue,
        total: longFormRevenue + shortsRevenue
      },
      uploadFrequency,
      lastUploadDate,
      dataScope: {
        videosAnalyzed: videos.length,
        oldestVideoDate: oldestDate.toISOString(),
        newestVideoDate: newestDate.toISOString(),
        timeSpanDays
      }
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
    const weeklyViews = last7Days.recentVideoViews;
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
   * Generate realistic month-by-month data based on actual video upload dates
   */
  static async generateRealisticChartData(videos: AccurateVideoData[], niche: string) {
    if (videos.length === 0) {
      return [];
    }

    const chartData = [];
    
    // Get the actual date range of videos
    const dates = videos.map(v => new Date(v.publishedAt)).sort((a, b) => a.getTime() - b.getTime());
    const oldestDate = dates[0];
    const newestDate = dates[dates.length - 1];
    
    // Calculate months to include based on actual video data
    const startMonth = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), 1);
    const endMonth = new Date(newestDate.getFullYear(), newestDate.getMonth() + 1, 0);
    
    // Limit to last 12 months maximum for chart readability
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const chartStartDate = startMonth > twelveMonthsAgo ? startMonth : twelveMonthsAgo;
    
    const currentMonth = new Date(chartStartDate);
    
    while (currentMonth <= endMonth) {
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const monthVideos = videos.filter(v => {
        const publishDate = new Date(v.publishedAt);
        return publishDate >= monthStart && publishDate <= monthEnd;
      });
      
      // Only include months with actual videos
      if (monthVideos.length > 0) {
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
          estRevenueShorts,
          videoCount: monthVideos.length,
          longFormCount: longFormVideos.length,
          shortsCount: shortsVideos.length
        });
      }
      
      // Move to next month
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    console.log(`Generated realistic chart data for ${chartData.length} months based on actual video uploads`);
    return chartData;
  }
  
  /**
   * Generate realistic daily data based on actual video upload patterns
   */
  static async generateRealisticDailyData(videos: AccurateVideoData[], niche: string) {
    if (videos.length === 0) {
      return [];
    }

    const chartData = [];
    
    // Get the actual date range, limited to last 60 days for daily view
    const now = new Date();
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    // Filter videos to last 60 days only
    const recentVideos = videos.filter(v => new Date(v.publishedAt) >= sixtyDaysAgo);
    
    if (recentVideos.length === 0) {
      console.log('No videos found in last 60 days for daily chart');
      return [];
    }
    
    // Get actual upload dates
    const uniqueDates = new Set(recentVideos.map(v => 
      new Date(v.publishedAt).toISOString().substring(0, 10)
    ));
    const uploadDates = Array.from(uniqueDates).sort();
    
    // Only show days with actual uploads (not every day)
    for (const dateStr of uploadDates) {
      const date = new Date(dateStr);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayVideos = recentVideos.filter(v => {
        const publishDate = new Date(v.publishedAt);
        const publishDateStr = publishDate.toISOString().substring(0, 10);
        return publishDateStr === dateStr;
      });
      
      if (dayVideos.length > 0) {
        const longFormVideos = dayVideos.filter(v => !v.isShort);
        const shortsVideos = dayVideos.filter(v => v.isShort);
        
        const longFormViews = longFormVideos.reduce((sum, v) => sum + v.viewCount, 0);
        const shortsViews = shortsVideos.reduce((sum, v) => sum + v.viewCount, 0);
        
        // Calculate revenue for this day
        const estRevenueLong = longFormViews > 0 ? await calculateLongFormRevenue(longFormViews, niche) : 0;
        const estRevenueShorts = shortsViews > 0 ? calculateShortsRevenue(shortsViews) : 0;
        
        chartData.push({
          date: dateStr, // YYYY-MM-DD format
          longFormViews,
          shortsViews,
          estRevenueLong,
          estRevenueShorts,
          videoCount: dayVideos.length,
          longFormCount: longFormVideos.length,
          shortsCount: shortsVideos.length
        });
      }
    }
    
    console.log(`Generated realistic daily data for ${chartData.length} days with actual uploads`);
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