import { AccurateVideoData } from '@/lib/youtubeAccurate';
import { calculateLongFormRevenue, calculateShortsRevenue } from '@/utils/revenueCalculations';

interface ImprovedChartData {
  month: string;
  averageViews: number;
  totalRevenue: number;
  videoCount: number;
  contentMix: {
    longFormPercentage: number;
    shortsPercentage: number;
  };
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

/**
 * Generate improved chart data that shows average performance metrics
 * instead of raw view counts which can be misleading
 */
export async function generateImprovedChartData(
  videos: AccurateVideoData[],
  niche: string
): Promise<ImprovedChartData[]> {
  if (videos.length === 0) {
    return [];
  }

  const chartData: ImprovedChartData[] = [];
  
  // Group videos by month
  const videosByMonth = new Map<string, AccurateVideoData[]>();
  
  videos.forEach(video => {
    const date = new Date(video.publishedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!videosByMonth.has(monthKey)) {
      videosByMonth.set(monthKey, []);
    }
    videosByMonth.get(monthKey)!.push(video);
  });
  
  // Calculate channel average for performance comparison
  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
  const channelAverageViews = totalViews / videos.length;
  
  // Sort months chronologically and limit to last 12 months
  const sortedMonths = Array.from(videosByMonth.keys()).sort();
  const last12Months = sortedMonths.slice(-12);
  
  for (const monthKey of last12Months) {
    const monthVideos = videosByMonth.get(monthKey)!;
    const longFormVideos = monthVideos.filter(v => !v.isShort);
    const shortsVideos = monthVideos.filter(v => v.isShort);
    
    // Calculate average views for the month
    const monthTotalViews = monthVideos.reduce((sum, v) => sum + v.viewCount, 0);
    const averageViews = Math.round(monthTotalViews / monthVideos.length);
    
    // Calculate revenue
    const longFormViews = longFormVideos.reduce((sum, v) => sum + v.viewCount, 0);
    const shortsViews = shortsVideos.reduce((sum, v) => sum + v.viewCount, 0);
    
    const longFormRevenue = longFormViews > 0 ? await calculateLongFormRevenue(longFormViews, niche) : 0;
    const shortsRevenue = shortsViews > 0 ? calculateShortsRevenue(shortsViews) : 0;
    const totalRevenue = longFormRevenue + shortsRevenue;
    
    // Calculate content mix
    const longFormPercentage = monthVideos.length > 0 
      ? Math.round((longFormVideos.length / monthVideos.length) * 100)
      : 0;
    const shortsPercentage = 100 - longFormPercentage;
    
    // Determine performance rating
    let performance: 'excellent' | 'good' | 'average' | 'poor';
    if (averageViews > channelAverageViews * 1.5) {
      performance = 'excellent';
    } else if (averageViews > channelAverageViews * 1.1) {
      performance = 'good';
    } else if (averageViews > channelAverageViews * 0.7) {
      performance = 'average';
    } else {
      performance = 'poor';
    }
    
    chartData.push({
      month: monthKey,
      averageViews,
      totalRevenue,
      videoCount: monthVideos.length,
      contentMix: {
        longFormPercentage,
        shortsPercentage
      },
      performance
    });
  }
  
  return chartData;
}

/**
 * Generate performance metrics for display cards
 */
export interface PerformanceMetrics {
  bestMonth: {
    month: string;
    averageViews: number;
    revenue: number;
  };
  worstMonth: {
    month: string;
    averageViews: number;
    revenue: number;
  };
  currentTrend: 'improving' | 'stable' | 'declining';
  averageMonthlyRevenue: number;
  revenueGrowthRate: number; // percentage
}

export function calculatePerformanceMetrics(chartData: ImprovedChartData[]): PerformanceMetrics | null {
  if (chartData.length === 0) {
    return null;
  }
  
  // Find best and worst months
  const sortedByViews = [...chartData].sort((a, b) => b.averageViews - a.averageViews);
  const sortedByRevenue = [...chartData].sort((a, b) => b.totalRevenue - a.totalRevenue);
  
  const bestMonth = {
    month: sortedByRevenue[0].month,
    averageViews: sortedByRevenue[0].averageViews,
    revenue: sortedByRevenue[0].totalRevenue
  };
  
  const worstMonth = {
    month: sortedByRevenue[sortedByRevenue.length - 1].month,
    averageViews: sortedByRevenue[sortedByRevenue.length - 1].averageViews,
    revenue: sortedByRevenue[sortedByRevenue.length - 1].totalRevenue
  };
  
  // Calculate trend (last 3 months vs previous 3 months)
  let currentTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (chartData.length >= 6) {
    const last3Months = chartData.slice(-3);
    const previous3Months = chartData.slice(-6, -3);
    
    const last3Average = last3Months.reduce((sum, m) => sum + m.averageViews, 0) / 3;
    const previous3Average = previous3Months.reduce((sum, m) => sum + m.averageViews, 0) / 3;
    
    const changePercentage = ((last3Average - previous3Average) / previous3Average) * 100;
    
    if (changePercentage > 10) {
      currentTrend = 'improving';
    } else if (changePercentage < -10) {
      currentTrend = 'declining';
    }
  }
  
  // Calculate average monthly revenue
  const totalRevenue = chartData.reduce((sum, m) => sum + m.totalRevenue, 0);
  const averageMonthlyRevenue = totalRevenue / chartData.length;
  
  // Calculate revenue growth rate
  let revenueGrowthRate = 0;
  if (chartData.length >= 2) {
    const firstMonth = chartData[0].totalRevenue;
    const lastMonth = chartData[chartData.length - 1].totalRevenue;
    revenueGrowthRate = ((lastMonth - firstMonth) / firstMonth) * 100;
  }
  
  return {
    bestMonth,
    worstMonth,
    currentTrend,
    averageMonthlyRevenue,
    revenueGrowthRate
  };
}