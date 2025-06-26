export interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string; // Channel creation date
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics?: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails?: {
    duration: string;
  };
}

export interface ChannelAnalytics {
  channel: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    subscriberCount: number;
    totalViews: number;
    videoCount: number;
    niche?: string;
    monetization?: {
      isMonetized: boolean;
      status: string;
      lastChecked: string | null;
      badge: string;
    } | null;
  };
  currentStats: {
    totalViews: number;
    longFormViews: number;
    shortsViews: number;
    uploadFrequency: number;
  };
  historicalData: {
    month: string;
    longFormViews: number;
    shortsViews: number;
    estRevenueLong: number;
    estRevenueShorts: number;
  }[];
  projections: {
    nextMonth: {
      views: number;
      revenue: number;
    };
    nextYear: {
      views: number;
      revenue: number;
    };
  };
  recentVideos: {
    id: string;
    title: string;
    views: number;
    publishedAt: string;
    isShort: boolean;
  }[];
  validation?: any; // ValidationComparison from validationAndComparison.ts
  dataQuality?: any; // DataQualityReport from dataValidation.ts
  dailyData?: any[]; // Daily chart data
}