import { YouTubeVideo, YouTubeChannel } from '@/types/youtube';

/**
 * Data validation utilities for ensuring accurate YouTube analytics
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface DataQuality {
  totalVideosAnalyzed: number;
  shortsCount: number;
  longFormCount: number;
  videosWithoutStats: number;
  averageViewsPerVideo: number;
  dataCompleteness: number; // 0-100%
  lastVideoDate: string;
  channelAge: number; // in days
}

/**
 * Validate YouTube channel data
 */
export function validateChannelData(channel: YouTubeChannel): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!channel.id) {
    errors.push('Channel ID is missing');
  }

  if (!channel.snippet?.title) {
    errors.push('Channel title is missing');
  }

  if (!channel.statistics) {
    errors.push('Channel statistics are missing');
  } else {
    // Validate statistics
    const stats = channel.statistics;
    
    if (!stats.subscriberCount || parseInt(stats.subscriberCount) < 0) {
      warnings.push('Subscriber count appears invalid');
    }
    
    if (!stats.viewCount || parseInt(stats.viewCount) < 0) {
      warnings.push('View count appears invalid');
    }
    
    if (!stats.videoCount || parseInt(stats.videoCount) < 0) {
      warnings.push('Video count appears invalid');
    }

    // Sanity checks
    const subscribers = parseInt(stats.subscriberCount || '0');
    const views = parseInt(stats.viewCount || '0');
    const videos = parseInt(stats.videoCount || '0');

    if (subscribers > views) {
      warnings.push('Subscriber count exceeds total views (unusual)');
    }

    if (videos > 0 && views / videos < 1) {
      warnings.push('Average views per video is very low');
    }
  }

  const confidence: 'high' | 'medium' | 'low' = 
    errors.length === 0 && warnings.length === 0 ? 'high' :
    errors.length === 0 && warnings.length <= 2 ? 'medium' : 'low';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence
  };
}

/**
 * Validate individual video data
 */
export function validateVideoData(video: YouTubeVideo): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!video.id) {
    errors.push('Video ID is missing');
  }

  if (!video.snippet?.title) {
    errors.push('Video title is missing');
  }

  if (!video.snippet?.publishedAt) {
    errors.push('Video publish date is missing');
  }

  // Statistics validation
  if (!video.statistics) {
    warnings.push('Video statistics are missing');
  } else {
    const views = parseInt(video.statistics.viewCount || '0');
    
    if (views < 0) {
      errors.push('View count is negative');
    }

    // Check for suspiciously high view counts
    if (views > 10000000000) { // 10 billion views
      warnings.push('View count appears suspiciously high');
    }
  }

  // Duration validation
  if (!video.contentDetails?.duration) {
    warnings.push('Video duration is missing');
  }

  const confidence: 'high' | 'medium' | 'low' = 
    errors.length === 0 && warnings.length === 0 ? 'high' :
    errors.length === 0 && warnings.length <= 2 ? 'medium' : 'low';

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    confidence
  };
}

/**
 * Analyze data quality for a collection of videos
 */
export function analyzeDataQuality(videos: YouTubeVideo[], channel: YouTubeChannel): DataQuality {
  const validVideos = videos.filter(video => validateVideoData(video).isValid);
  const shortsCount = videos.filter(video => {
    const duration = video.contentDetails?.duration || '';
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      return totalSeconds <= 180;
    }
    return false;
  }).length;

  const longFormCount = validVideos.length - shortsCount;
  const videosWithoutStats = videos.filter(video => !video.statistics?.viewCount).length;
  
  const totalViews = videos.reduce((sum, video) => {
    return sum + parseInt(video.statistics?.viewCount || '0');
  }, 0);
  
  const averageViewsPerVideo = validVideos.length > 0 ? totalViews / validVideos.length : 0;
  
  // Calculate data completeness
  const requiredFields = ['id', 'snippet.title', 'snippet.publishedAt', 'statistics.viewCount', 'contentDetails.duration'];
  let totalFields = 0;
  let completeFields = 0;
  
  videos.forEach(video => {
    totalFields += requiredFields.length;
    if (video.id) completeFields++;
    if (video.snippet?.title) completeFields++;
    if (video.snippet?.publishedAt) completeFields++;
    if (video.statistics?.viewCount) completeFields++;
    if (video.contentDetails?.duration) completeFields++;
  });
  
  const dataCompleteness = totalFields > 0 ? (completeFields / totalFields) * 100 : 0;
  
  // Calculate channel age (channel creation date not available in basic API)
  let channelAge = 0;
  // Channel creation date requires additional API call, skip for now
  
  // Get last video date
  const sortedVideos = videos
    .filter(v => v.snippet?.publishedAt)
    .sort((a, b) => new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime());
  
  const lastVideoDate = sortedVideos.length > 0 ? sortedVideos[0].snippet.publishedAt : '';

  return {
    totalVideosAnalyzed: videos.length,
    shortsCount,
    longFormCount,
    videosWithoutStats,
    averageViewsPerVideo,
    dataCompleteness,
    lastVideoDate,
    channelAge
  };
}

/**
 * Detect data anomalies and inconsistencies
 */
export function detectAnomalies(videos: YouTubeVideo[], channel: YouTubeChannel): string[] {
  const anomalies: string[] = [];
  
  // Check for view count inconsistencies
  const totalVideoViews = videos.reduce((sum, video) => {
    return sum + parseInt(video.statistics?.viewCount || '0');
  }, 0);
  
  const channelTotalViews = parseInt(channel.statistics?.viewCount || '0');
  
  if (Math.abs(totalVideoViews - channelTotalViews) / channelTotalViews > 0.5) {
    anomalies.push('Significant discrepancy between sum of video views and channel total views');
  }
  
  // Check for upload patterns
  const videosByMonth = new Map<string, number>();
  videos.forEach(video => {
    if (video.snippet?.publishedAt) {
      const monthKey = video.snippet.publishedAt.substring(0, 7); // YYYY-MM
      videosByMonth.set(monthKey, (videosByMonth.get(monthKey) || 0) + 1);
    }
  });
  
  // Detect sudden spikes in upload frequency
  const uploadCounts = Array.from(videosByMonth.values());
  const averageUploads = uploadCounts.reduce((a, b) => a + b, 0) / uploadCounts.length;
  const maxUploads = Math.max(...uploadCounts);
  
  if (maxUploads > averageUploads * 5) {
    anomalies.push('Detected unusual spike in upload frequency');
  }
  
  // Check for videos with zero views (might indicate private/unlisted videos)
  const zeroViewVideos = videos.filter(video => parseInt(video.statistics?.viewCount || '0') === 0);
  if (zeroViewVideos.length > videos.length * 0.1) {
    anomalies.push('High percentage of videos with zero views');
  }
  
  return anomalies;
}

/**
 * Generate data quality report
 */
export function generateDataQualityReport(videos: YouTubeVideo[], channel: YouTubeChannel): {
  quality: DataQuality;
  validation: ValidationResult;
  anomalies: string[];
  recommendations: string[];
} {
  const quality = analyzeDataQuality(videos, channel);
  const validation = validateChannelData(channel);
  const anomalies = detectAnomalies(videos, channel);
  
  const recommendations: string[] = [];
  
  if (quality.dataCompleteness < 80) {
    recommendations.push('Data completeness is low - some metrics may be inaccurate');
  }
  
  if (quality.totalVideosAnalyzed < 10) {
    recommendations.push('Limited video data available - analysis may not be representative');
  }
  
  if (quality.videosWithoutStats > quality.totalVideosAnalyzed * 0.2) {
    recommendations.push('Many videos missing statistics - results may be incomplete');
  }
  
  if (anomalies.length > 0) {
    recommendations.push('Data anomalies detected - manual review recommended');
  }
  
  if (validation.confidence === 'low') {
    recommendations.push('Data quality is low - treat results with caution');
  }
  
  return {
    quality,
    validation,
    anomalies,
    recommendations
  };
}