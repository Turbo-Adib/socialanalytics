import { YouTubeVideo } from '@/src/types/youtube';
import { YouTubeAPI } from '@/src/lib/youtube';
import { calculateLongFormRevenue, calculateShortsRevenue } from '@/src/utils/revenueCalculations';
import { subMonths, format, startOfMonth } from 'date-fns';

export async function generateHistoricalData(
  recentVideos: YouTubeVideo[],
  niche: string,
  months: number = 12
) {
  const api = new YouTubeAPI();
  const historicalData = [];
  const today = new Date();

  // Group videos by month
  const videosByMonth = new Map<string, { longForm: number; shorts: number }>();

  // Initialize months with zero views
  for (let i = months - 1; i >= 0; i--) {
    const date = startOfMonth(subMonths(today, i));
    const monthKey = format(date, 'yyyy-MM');
    videosByMonth.set(monthKey, { longForm: 0, shorts: 0 });
  }

  // Aggregate video views by month
  recentVideos.forEach((video) => {
    const publishedDate = new Date(video.snippet.publishedAt);
    const monthKey = format(publishedDate, 'yyyy-MM');
    
    if (videosByMonth.has(monthKey)) {
      const views = parseInt(video.statistics?.viewCount || '0');
      const isShort = api.isVideoShort(video);
      
      const monthData = videosByMonth.get(monthKey)!;
      if (isShort) {
        monthData.shorts += views;
      } else {
        monthData.longForm += views;
      }
    }
  });

  // Generate historical data with accurate revenue calculations (real data only)
  for (const [month, views] of Array.from(videosByMonth.entries())) {
    // Only use actual video data - no random generation
    const longFormViews = views.longForm;
    const shortsViews = views.shorts;
    
    // Skip months with no actual data
    if (longFormViews === 0 && shortsViews === 0) {
      continue;
    }
    
    // Use accurate RPM-based revenue calculations only for real data
    const estRevenueLong = longFormViews > 0 ? await calculateLongFormRevenue(longFormViews, niche) : 0;
    const estRevenueShorts = shortsViews > 0 ? calculateShortsRevenue(shortsViews) : 0;
    
    historicalData.push({
      month,
      longFormViews,
      shortsViews,
      estRevenueLong,
      estRevenueShorts,
    });
  }

  return historicalData;
}

export function calculateProjections(historicalData: any[]) {
  if (historicalData.length < 3) {
    return {
      nextMonth: { views: 0, revenue: 0 },
      nextYear: { views: 0, revenue: 0 },
    };
  }

  // Calculate average growth rate from last 3 months
  const recentMonths = historicalData.slice(-3);
  let totalViews = 0;
  let totalRevenue = 0;

  recentMonths.forEach((month) => {
    totalViews += month.longFormViews + month.shortsViews;
    totalRevenue += month.estRevenueLong + month.estRevenueShorts;
  });

  const avgMonthlyViews = totalViews / 3;
  const avgMonthlyRevenue = totalRevenue / 3;

  // Simple growth projection (10% monthly growth for demo)
  const growthRate = 1.1;

  return {
    nextMonth: {
      views: Math.floor(avgMonthlyViews * growthRate),
      revenue: avgMonthlyRevenue * growthRate,
    },
    nextYear: {
      views: Math.floor(avgMonthlyViews * Math.pow(growthRate, 12)),
      revenue: avgMonthlyRevenue * Math.pow(growthRate, 12),
    },
  };
}

export function calculateUploadFrequency(videos: YouTubeVideo[]): number {
  if (videos.length === 0) return 0;

  // Get videos from last 3 months
  const threeMonthsAgo = subMonths(new Date(), 3);
  const recentVideos = videos.filter(
    (video) => new Date(video.snippet.publishedAt) >= threeMonthsAgo
  );

  if (recentVideos.length === 0) return 0;

  // Calculate weeks between first and last video
  const sortedVideos = recentVideos.sort(
    (a, b) => new Date(a.snippet.publishedAt).getTime() - new Date(b.snippet.publishedAt).getTime()
  );

  const firstVideo = new Date(sortedVideos[0].snippet.publishedAt);
  const lastVideo = new Date(sortedVideos[sortedVideos.length - 1].snippet.publishedAt);
  const weeksDiff = Math.max(1, (lastVideo.getTime() - firstVideo.getTime()) / (1000 * 60 * 60 * 24 * 7));

  return recentVideos.length / weeksDiff;
}