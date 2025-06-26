/**
 * YouTube Channel Monetization Detection Utilities
 * 
 * Provides functions to detect if a YouTube channel is likely monetized
 * based on various indicators and requirements.
 */

// YouTube Partner Program requirements
const YPP_REQUIREMENTS = {
  MIN_SUBSCRIBERS: 1000,
  MIN_WATCH_HOURS_12_MONTHS: 4000, // We can't check this directly
  MIN_SHORTS_VIEWS_90_DAYS: 10000000, // 10M views in 90 days for Shorts
  MIN_UPLOADS_FREQUENCY: 0.5, // At least 1 upload every 2 weeks
};

interface ChannelData {
  subscriberCount: number;
  uploadFrequencyPerWeek?: number;
  publishedAt?: string | null;
  videoCount: number;
}

interface VideoStats {
  totalVideos?: number;
  shortVideos?: number;
  longVideos?: number;
  recentVideos?: any[];
}

interface MonetizationStatus {
  isMonetized: boolean;
  status: string;
  lastChecked: string | null;
  badge: string;
}

/**
 * Analyzes channel data to determine monetization likelihood
 */
export function detectMonetization(channelData: ChannelData, videoStats: VideoStats = {}): boolean {
  const indicators = [];
  
  // Check subscriber count requirement
  const subscriberCount = channelData.subscriberCount || 0;
  const hasMinSubscribers = subscriberCount >= YPP_REQUIREMENTS.MIN_SUBSCRIBERS;
  indicators.push({
    factor: 'subscribers',
    met: hasMinSubscribers,
    weight: 0.4, // High weight as it's a hard requirement
    value: subscriberCount
  });

  // Check upload frequency
  const uploadFrequency = channelData.uploadFrequencyPerWeek || 0;
  const hasRegularUploads = uploadFrequency >= YPP_REQUIREMENTS.MIN_UPLOADS_FREQUENCY;
  indicators.push({
    factor: 'upload_frequency',
    met: hasRegularUploads,
    weight: 0.2,
    value: uploadFrequency
  });

  // Check channel age and activity (channels need to be established)
  const channelAge = getChannelAgeInMonths(channelData.publishedAt);
  const isEstablished = channelAge >= 2; // At least 2 months old
  indicators.push({
    factor: 'channel_age',
    met: isEstablished,
    weight: 0.1,
    value: channelAge
  });

  // Check for Shorts vs Long-form content balance
  const hasBalancedContent = checkContentBalance(videoStats);
  indicators.push({
    factor: 'content_balance',
    met: hasBalancedContent,
    weight: 0.1,
    value: hasBalancedContent
  });

  // Check total video count (active channels)
  const totalVideos = channelData.videoCount || 0;
  const hasMinVideos = totalVideos >= 10;
  indicators.push({
    factor: 'video_count',
    met: hasMinVideos,
    weight: 0.1,
    value: totalVideos
  });

  // Check for consistent view patterns (monetized channels often have more consistent views)
  const hasConsistentViews = checkViewConsistency(videoStats);
  indicators.push({
    factor: 'view_consistency',
    met: hasConsistentViews,
    weight: 0.1,
    value: hasConsistentViews
  });

  // Calculate weighted score
  const totalWeight = indicators.reduce((sum, indicator) => sum + indicator.weight, 0);
  const weightedScore = indicators.reduce((sum, indicator) => {
    return sum + (indicator.met ? indicator.weight : 0);
  }, 0);

  const confidenceScore = weightedScore / totalWeight;

  // Return true if confidence is above 70%
  return confidenceScore >= 0.7;
}

/**
 * Determines if monetization data needs refresh
 */
export function needsMonetizationRefresh(lastChecked: Date | string | null): boolean {
  if (!lastChecked) return true;
  
  const now = new Date();
  const lastCheck = new Date(lastChecked);
  const hoursSinceCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);
  
  // Refresh every 24 hours
  return hoursSinceCheck >= 24;
}

/**
 * Creates a cache key for monetization data
 */
export function getMonetizationCacheKey(channelId: string): string {
  return `monetization:${channelId}`;
}

// Helper functions

function getChannelAgeInMonths(publishedAt?: string | null): number {
  if (!publishedAt) return 0;
  
  const publishDate = new Date(publishedAt);
  const now = new Date();
  const diffInMs = now.getTime() - publishDate.getTime();
  const diffInMonths = diffInMs / (1000 * 60 * 60 * 24 * 30.44); // Average days per month
  
  return Math.floor(diffInMonths);
}

function checkContentBalance(videoStats: VideoStats): boolean {
  if (!videoStats || !videoStats.totalVideos) return true; // Default to true if no data
  
  const { shortVideos = 0, longVideos = 0 } = videoStats;
  const total = shortVideos + longVideos;
  
  if (total === 0) return true;
  
  // Good balance if neither format dominates completely (at least 10% of each)
  const shortsRatio = shortVideos / total;
  const longRatio = longVideos / total;
  
  return shortsRatio >= 0.1 && longRatio >= 0.1;
}

function checkViewConsistency(videoStats: VideoStats): boolean {
  if (!videoStats || !videoStats.recentVideos) return true; // Default to true if no data
  
  const { recentVideos } = videoStats;
  if (recentVideos.length < 5) return true; // Not enough data
  
  const views = recentVideos.map(v => parseInt(v.viewCount) || 0);
  const avgViews = views.reduce((sum, v) => sum + v, 0) / views.length;
  
  if (avgViews === 0) return false;
  
  // Check if most videos are within 50% of average (indicates consistency)
  const consistentVideos = views.filter(v => {
    const deviation = Math.abs(v - avgViews) / avgViews;
    return deviation <= 0.5;
  });
  
  return consistentVideos.length >= (views.length * 0.6); // 60% within range
}

/**
 * Formats monetization status for display
 */
export function formatMonetizationStatus(isMonetized: boolean, lastChecked: Date | string | null): MonetizationStatus {
  return {
    isMonetized,
    status: isMonetized ? 'Monetized' : 'Not Monetized',
    lastChecked: lastChecked ? new Date(lastChecked).toISOString() : null,
    badge: isMonetized ? 'success' : 'neutral'
  };
}