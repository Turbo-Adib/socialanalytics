/**
 * Minimal Viable Analytics - Core Value Only
 * Focus on accurate, actionable insights without complex historical data
 */

import { calculateLongFormRevenue, calculateShortsRevenue } from './revenueCalculations';

export interface ChannelOverview {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  estimatedAge: {
    years: number;
    months: number;
  };
  monthlyRevenue: {
    min: number;
    max: number;
    estimated: number;
  };
  niche: string;
}

export interface VideoPerformance {
  id: string;
  title: string;
  views: number;
  publishedAt: string;
  duration: number;
  isShort: boolean;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

export interface RecentPerformanceAnalysis {
  averageViews: number;
  totalVideos: number;
  bestVideo: VideoPerformance;
  worstVideo: VideoPerformance;
  uploadFrequency: number; // videos per month
  contentMix: {
    longFormPercentage: number;
    shortsPercentage: number;
  };
  revenueEstimate: {
    monthly: number;
  };
}

export interface SimpleProjections {
  subscribers: {
    nextMilestone: number;
    estimatedDays: number;
    growthRate: number; // per month
  };
  revenue: {
    nextMonth: number;
    nextYear: number;
  };
}

export interface MinimalAnalytics {
  overview: ChannelOverview;
  recentPerformance: RecentPerformanceAnalysis;
  projections: SimpleProjections;
  lastUpdated: string;
}

export class MinimalAnalyticsCalculator {
  
  /**
   * Calculate channel overview from basic YouTube data
   */
  static calculateChannelOverview(
    channelData: any,
    videos: any[],
    niche: string
  ): ChannelOverview {
    
    // Estimate channel age from oldest video (rough approximation)
    const oldestVideo = videos.length > 0 ? 
      videos.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())[0] : null;
    
    const ageInMonths = oldestVideo ? 
      Math.max(1, Math.round((Date.now() - new Date(oldestVideo.publishedAt).getTime()) / (1000 * 60 * 60 * 24 * 30))) : 12;
    
    const ageYears = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;

    // Calculate rough monthly revenue estimate
    const recentViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
    const avgMonthlyViews = Math.round(recentViews / Math.min(ageInMonths, 12));
    
    // Conservative revenue estimate
    const baseRevenue = avgMonthlyViews * 0.001; // $1 per 1000 views (conservative)
    const minRevenue = baseRevenue * 0.5;
    const maxRevenue = baseRevenue * 2;

    return {
      id: channelData.id,
      title: channelData.title,
      description: channelData.description || '',
      thumbnailUrl: channelData.thumbnailUrl || '',
      subscriberCount: channelData.subscriberCount,
      totalViews: channelData.totalViews,
      videoCount: channelData.videoCount,
      estimatedAge: {
        years: ageYears,
        months: remainingMonths
      },
      monthlyRevenue: {
        min: Math.round(minRevenue),
        max: Math.round(maxRevenue),
        estimated: Math.round(baseRevenue)
      },
      niche
    };
  }

  /**
   * Analyze recent performance from last 20 videos
   */
  static analyzeRecentPerformance(videos: any[], niche: string): RecentPerformanceAnalysis {
    if (videos.length === 0) {
      return {
        averageViews: 0,
        totalVideos: 0,
        bestVideo: {} as VideoPerformance,
        worstVideo: {} as VideoPerformance,
        uploadFrequency: 0,
        contentMix: { longFormPercentage: 0, shortsPercentage: 0 },
        revenueEstimate: { monthly: 0 }
      };
    }

    // Take last 20 videos for analysis
    const recentVideos = videos.slice(0, 20);
    
    // Calculate basic metrics
    const totalViews = recentVideos.reduce((sum, v) => sum + v.viewCount, 0);
    const averageViews = Math.round(totalViews / recentVideos.length);
    
    // Find best and worst performers
    const sortedByViews = [...recentVideos].sort((a, b) => b.viewCount - a.viewCount);
    const bestVideo = this.formatVideoPerformance(sortedByViews[0], averageViews);
    const worstVideo = this.formatVideoPerformance(sortedByViews[sortedByViews.length - 1], averageViews);
    
    // Calculate upload frequency (videos per month)
    const dates = recentVideos.map(v => new Date(v.publishedAt).getTime());
    const timeSpanDays = (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24);
    const uploadFrequency = timeSpanDays > 0 ? Math.round((recentVideos.length / timeSpanDays) * 30 * 10) / 10 : 0;
    
    // Content mix analysis
    const longFormCount = recentVideos.filter(v => !v.isShort).length;
    const shortsCount = recentVideos.length - longFormCount;
    
    // Simple revenue estimate
    const monthlyRevenue = Math.round(averageViews * uploadFrequency * 0.001);

    return {
      averageViews,
      totalVideos: recentVideos.length,
      bestVideo,
      worstVideo,
      uploadFrequency,
      contentMix: {
        longFormPercentage: Math.round((longFormCount / recentVideos.length) * 100),
        shortsPercentage: Math.round((shortsCount / recentVideos.length) * 100)
      },
      revenueEstimate: {
        monthly: monthlyRevenue
      }
    };
  }

  /**
   * Create simple projections based on recent trends
   */
  static calculateSimpleProjections(
    overview: ChannelOverview,
    recentPerformance: RecentPerformanceAnalysis
  ): SimpleProjections {
    
    // Estimate growth rate (very basic)
    const monthlyGrowthRate = Math.max(0, recentPerformance.uploadFrequency * 1000); // rough estimate
    
    // Next subscriber milestone
    const currentSubs = overview.subscriberCount;
    const nextMilestone = this.getNextMilestone(currentSubs);
    const subsToGo = nextMilestone - currentSubs;
    const estimatedDays = monthlyGrowthRate > 0 ? Math.round(subsToGo / (monthlyGrowthRate / 30)) : 365;

    // Revenue projections
    const monthlyRevenue = recentPerformance.revenueEstimate.monthly;
    const yearlyRevenue = monthlyRevenue * 12;
    
    return {
      subscribers: {
        nextMilestone,
        estimatedDays: Math.min(estimatedDays, 365),
        growthRate: monthlyGrowthRate
      },
      revenue: {
        nextMonth: monthlyRevenue,
        nextYear: yearlyRevenue
      }
    };
  }

  /**
   * Helper: Format video performance data
   */
  private static formatVideoPerformance(video: any, average: number): VideoPerformance {
    let performance: 'excellent' | 'good' | 'average' | 'poor';
    
    if (video.viewCount > average * 2) performance = 'excellent';
    else if (video.viewCount > average * 1.2) performance = 'good';
    else if (video.viewCount > average * 0.8) performance = 'average';
    else performance = 'poor';

    return {
      id: video.id,
      title: video.title,
      views: video.viewCount,
      publishedAt: video.publishedAt,
      duration: video.duration || 0,
      isShort: video.isShort || false,
      performance
    };
  }

  /**
   * Helper: Get next subscriber milestone
   */
  private static getNextMilestone(current: number): number {
    const milestones = [1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];
    return milestones.find(m => m > current) || current + 1000000;
  }
}