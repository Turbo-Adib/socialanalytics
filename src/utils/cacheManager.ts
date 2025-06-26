import { prisma } from '@/lib/prisma';
import { AnalysisCache } from '@prisma/client';

export type AnalysisTier = 'free' | 'standard' | 'premium';

export interface TierConfig {
  maxVideos: number;
  description: string;
  features: string[];
}

export const TIER_CONFIGS: Record<AnalysisTier, TierConfig> = {
  free: {
    maxVideos: 250,
    description: 'Quick Insights',
    features: [
      'Analyze 250 most recent videos',
      'Basic outlier patterns',
      'View total video count',
      '48-168 hour cache'
    ]
  },
  standard: {
    maxVideos: 1000,
    description: 'Deep Analysis',
    features: [
      'Analyze 1000 videos',
      'Advanced pattern recognition',
      'Historical trend analysis',
      '24-48 hour cache'
    ]
  },
  premium: {
    maxVideos: 5000,
    description: 'Complete Analysis',
    features: [
      'Analyze up to 5000 videos',
      'Full channel history',
      'Cross-era pattern analysis',
      'Export capabilities',
      '24 hour minimum cache'
    ]
  }
};

export class CacheManager {
  /**
   * Calculate cache duration based on upload frequency
   * More active channels get shorter cache durations
   */
  static calculateCacheDuration(uploadFrequencyPerWeek: number | null): number {
    if (!uploadFrequencyPerWeek) return 168; // Default to 7 days if unknown
    
    if (uploadFrequencyPerWeek > 7) {
      return 24; // Daily uploaders: 24h cache
    } else if (uploadFrequencyPerWeek > 2) {
      return 48; // Active channels: 48h cache  
    } else if (uploadFrequencyPerWeek > 0.5) {
      return 168; // Weekly uploaders: 7 days cache
    } else {
      return 336; // Inactive channels: 14 days cache
    }
  }

  /**
   * Check if cache is still valid
   */
  static isCacheValid(cache: AnalysisCache | null): boolean {
    if (!cache) return false;
    return new Date() < cache.cacheExpiresAt;
  }

  /**
   * Get or create cache metadata for a channel
   */
  static async getOrCreateCache(
    channelId: string,
    tier: AnalysisTier = 'free',
    totalVideoCount: number,
    uploadFrequency: number | null
  ): Promise<AnalysisCache> {
    const existing = await prisma.analysisCache.findUnique({
      where: { channelId }
    });

    if (existing && this.isCacheValid(existing)) {
      return existing;
    }

    const cacheDurationHours = this.calculateCacheDuration(uploadFrequency);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + cacheDurationHours * 60 * 60 * 1000);

    const cacheData = {
      channelId,
      tier,
      videosAnalyzed: 0,
      totalVideoCount,
      lastFullFetch: now,
      cacheExpiresAt: expiresAt,
      uploadFrequency,
      cacheDurationHours
    };

    if (existing) {
      return await prisma.analysisCache.update({
        where: { channelId },
        data: cacheData
      });
    }

    return await prisma.analysisCache.create({
      data: cacheData
    });
  }

  /**
   * Update cache after fetching videos
   */
  static async updateCacheAfterFetch(
    channelId: string,
    videosAnalyzed: number,
    isIncremental: boolean = false
  ): Promise<AnalysisCache> {
    const updateData: any = {
      videosAnalyzed
    };

    if (isIncremental) {
      updateData.lastIncrementalUpdate = new Date();
    } else {
      updateData.lastFullFetch = new Date();
    }

    return await prisma.analysisCache.update({
      where: { channelId },
      data: updateData
    });
  }

  /**
   * Check if channel needs full refetch or just incremental
   */
  static async needsFullRefetch(channelId: string): Promise<boolean> {
    const cache = await prisma.analysisCache.findUnique({
      where: { channelId }
    });

    if (!cache) return true;

    // If cache expired, need full refetch
    if (!this.isCacheValid(cache)) return true;

    // If never had incremental update, can do incremental
    if (!cache.lastIncrementalUpdate) return false;

    // If last incremental was more than 24 hours ago, do full refetch
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return cache.lastIncrementalUpdate < dayAgo;
  }

  /**
   * Get videos to fetch based on tier
   */
  static getVideoLimitForTier(tier: AnalysisTier): number {
    return TIER_CONFIGS[tier].maxVideos;
  }

  /**
   * Clean up old expired caches
   */
  static async cleanupExpiredCaches(): Promise<number> {
    const result = await prisma.analysisCache.deleteMany({
      where: {
        cacheExpiresAt: {
          lt: new Date()
        }
      }
    });
    return result.count;
  }
}