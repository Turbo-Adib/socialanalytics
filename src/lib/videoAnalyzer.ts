import axios from 'axios';
import { YouTubeAPI } from './youtube';
import { AnalysisTier } from '@/src/utils/cacheManager';

export interface VideoData {
  id: string;
  title: string;
  viewCount: number;
  duration: string; // ISO 8601 format (PT4M13S)
  isShort: boolean;
  publishedAt: Date;
  videoUrl: string;
  thumbnailUrl?: string;
}

export interface ChannelVideosResult {
  videos: VideoData[];
  totalVideos: number;
  longformVideos: VideoData[];
  shortsVideos: VideoData[];
  fetchedAll: boolean;
  tier: AnalysisTier;
}

export class VideoAnalyzer {
  private youtubeApi: YouTubeAPI;

  constructor(apiKey?: string) {
    this.youtubeApi = new YouTubeAPI(apiKey);
  }

  /**
   * Parse ISO 8601 duration to seconds
   * PT4M13S = 4 minutes 13 seconds = 253 seconds
   */
  private parseDurationToSeconds(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Robust Shorts detection with detailed logging and multiple validation layers
   * Priority: Duration → Hashtags → Title indicators → Format hints
   */
  private isVideoShort(duration: string, title?: string, description?: string, videoId?: string): boolean {
    const durationInSeconds = this.parseDurationToSeconds(duration);
    const titleLower = (title || '').toLowerCase();
    const descLower = (description || '').toLowerCase();
    
    // Debug info for logging
    const debugInfo = {
      videoId: videoId || 'unknown',
      duration: durationInSeconds,
      title: title?.substring(0, 50) + '...' || 'no title'
    };
    
    // PRIMARY: Duration ≤ 60 seconds = Shorts (guaranteed)
    if (durationInSeconds <= 60) {
      console.log(`[SHORTS DETECTION] ${debugInfo.videoId}: PRIMARY - Duration ${durationInSeconds}s ≤ 60s = SHORTS`);
      return true;
    }
    
    // SECONDARY: Duration 61-180s + hashtag detection
    if (durationInSeconds > 60 && durationInSeconds <= 180) {
      // Enhanced hashtag patterns
      const hashtagPatterns = [
        /#shorts?\b/,           // #shorts, #short
        /#youtubeshorts?\b/,    // #youtubeshorts
        /#shortsvideo\b/,       // #shortsvideo
        /#shortform\b/          // #shortform
      ];
      
      const hasHashtagIndicator = hashtagPatterns.some(pattern => 
        pattern.test(titleLower) || pattern.test(descLower)
      );
      
      if (hasHashtagIndicator) {
        console.log(`[SHORTS DETECTION] ${debugInfo.videoId}: SECONDARY - Duration ${durationInSeconds}s + hashtag = SHORTS`);
        return true;
      }
    }
    
    // TERTIARY: Title/description format indicators (for 61-180s videos)
    if (durationInSeconds > 60 && durationInSeconds <= 180) {
      const formatIndicators = [
        /\bvertical\b/,         // "vertical video"
        /\breel\b/,             // "reel"
        /\btiktok\b/,           // "tiktok style"
        /\bpov:\s/,             // "POV: when..."
        /\bwhen\s+you\b/,       // "when you..."
        /\bme\s+when\b/,        // "me when..."
        /\bmood:\s/,            // "mood: ..."
        /\bquick\s+tip\b/,      // "quick tip"
        /\b\d+\s*sec/,          // "30 sec tutorial"
        /\bfast\s+tutorial\b/,  // "fast tutorial"
        /\bshort\s+version\b/   // "short version"
      ];
      
      const hasFormatIndicator = formatIndicators.some(pattern =>
        pattern.test(titleLower) || pattern.test(descLower)
      );
      
      if (hasFormatIndicator) {
        console.log(`[SHORTS DETECTION] ${debugInfo.videoId}: TERTIARY - Duration ${durationInSeconds}s + format indicator = SHORTS`);
        return true;
      }
    }
    
    // FALLBACK: Check for additional vertical format hints (61-180s)
    if (durationInSeconds > 60 && durationInSeconds <= 180) {
      const verticalHints = [
        /\bmobile\s+first\b/,   // "mobile first"
        /\bphone\s+video\b/,    // "phone video"
        /\bstory\s+format\b/,   // "story format"
        /9:16/,                 // aspect ratio mention
        /\bportrait\s+mode\b/   // "portrait mode"
      ];
      
      const hasVerticalHint = verticalHints.some(pattern =>
        pattern.test(titleLower) || pattern.test(descLower)
      );
      
      if (hasVerticalHint) {
        console.log(`[SHORTS DETECTION] ${debugInfo.videoId}: FALLBACK - Duration ${durationInSeconds}s + vertical hint = SHORTS`);
        return true;
      }
    }
    
    // Not a Short - log the decision for videos in the gray area
    if (durationInSeconds > 60 && durationInSeconds <= 180) {
      console.log(`[SHORTS DETECTION] ${debugInfo.videoId}: NOT SHORTS - Duration ${durationInSeconds}s without indicators = LONGFORM`);
    }
    
    return false;
  }

  /**
   * Generate YouTube video URL
   */
  private generateVideoUrl(videoId: string): string {
    return `https://youtube.com/watch?v=${videoId}`;
  }

  /**
   * Fetch all videos from a channel with pagination
   * @param channelId - YouTube channel ID
   * @param tier - Analysis tier (determines max videos)
   * @param totalVideoCount - Total number of videos in channel (optional)
   */
  async fetchAllChannelVideos(
    channelId: string, 
    tier: AnalysisTier = 'free',
    totalVideoCount?: number
  ): Promise<ChannelVideosResult> {
    const allVideos: VideoData[] = [];
    let nextPageToken: string | undefined;
    let totalApiCalls = 0;
    
    // Set max videos based on tier
    const tierLimits = {
      free: 250,
      standard: 1000,
      premium: 5000
    };
    const maxVideos = tierLimits[tier];
    const maxApiCalls = Math.ceil(maxVideos / 50); // Calculate based on desired video count (50 videos per API call)

    try {
      // First get the uploads playlist ID
      const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
        params: {
          id: channelId,
          part: 'contentDetails',
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Fetch all videos from uploads playlist
      do {
        totalApiCalls++;
        if (totalApiCalls > maxApiCalls || allVideos.length >= maxVideos) {
          console.log(`Fetched ${allVideos.length} videos. ${totalApiCalls > maxApiCalls ? `Reached API calls limit (${maxApiCalls} calls = ~${maxApiCalls * 50} videos).` : `Reached requested limit of ${maxVideos} videos.`}`);
          break;
        }

        // Get video IDs from playlist
        const playlistResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
          params: {
            playlistId: uploadsPlaylistId,
            part: 'snippet',
            maxResults: 50,
            pageToken: nextPageToken,
            key: process.env.YOUTUBE_API_KEY,
          },
        });

        const videoIds = playlistResponse.data.items
          .map((item: any) => item.snippet.resourceId.videoId)
          .filter((id: string) => id); // Filter out any undefined IDs

        if (videoIds.length === 0) break;

        // Get detailed video information including statistics and duration
        const videosResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            id: videoIds.join(','),
            part: 'snippet,statistics,contentDetails',
            key: process.env.YOUTUBE_API_KEY,
          },
        });

        // Process video data
        const processedVideos: VideoData[] = videosResponse.data.items.map((video: any) => {
          const duration = video.contentDetails.duration;
          const viewCount = parseInt(video.statistics.viewCount || '0', 10);
          const title = video.snippet.title;
          const description = video.snippet.description || '';
          
          return {
            id: video.id,
            title,
            viewCount,
            duration,
            isShort: this.isVideoShort(duration, title, description, video.id),
            publishedAt: new Date(video.snippet.publishedAt),
            videoUrl: this.generateVideoUrl(video.id),
            thumbnailUrl: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
          };
        });

        allVideos.push(...processedVideos);
        nextPageToken = playlistResponse.data.nextPageToken;

        // Add small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } while (nextPageToken && totalApiCalls < maxApiCalls && allVideos.length < maxVideos);

      // Separate into Shorts and Long-form
      const longformVideos = allVideos.filter(video => !video.isShort);
      const shortsVideos = allVideos.filter(video => video.isShort);

      console.log(`Fetched ${allVideos.length} videos (${longformVideos.length} long-form, ${shortsVideos.length} shorts) from channel ${channelId} [Tier: ${tier}]`);

      // Determine if we fetched all available videos
      const fetchedAll = !nextPageToken || (totalVideoCount ? allVideos.length >= totalVideoCount : true);

      return {
        videos: allVideos,
        totalVideos: allVideos.length,
        longformVideos,
        shortsVideos,
        fetchedAll,
        tier
      };

    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw new Error(`Failed to fetch videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch and analyze channel videos with caching
   */
  async analyzeChannelVideos(
    channelId: string, 
    tier: AnalysisTier = 'free',
    forceRefresh: boolean = false,
    totalVideoCount?: number
  ): Promise<ChannelVideosResult> {
    // For now, always fetch fresh data
    // TODO: Implement database caching based on forceRefresh parameter
    return this.fetchAllChannelVideos(channelId, tier, totalVideoCount);
  }

  /**
   * Fetch last 100 videos for outlier analysis
   * @param channelId - YouTube channel ID
   * @param formatFilter - Filter by 'longform', 'shorts', or null for both
   * @returns Channel videos result with only last 100 videos but accurate total count
   */
  async fetchLast100Videos(channelId: string, formatFilter?: 'longform' | 'shorts'): Promise<ChannelVideosResult & { actualTotalVideos: number }> {
    const allVideos: VideoData[] = [];
    let nextPageToken: string | undefined;
    let totalApiCalls = 0;
    const maxVideos = 100; // Only fetch last 100 videos
    const maxApiCalls = 2; // 2 API calls = 100 videos maximum
    
    try {
      // First get channel statistics for total video count
      const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
        params: {
          id: channelId,
          part: 'statistics,contentDetails',
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const actualTotalVideos = parseInt(channelResponse.data.items[0].statistics.videoCount || '0', 10);
      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Fetch last 100 videos
      do {
        totalApiCalls++;
        if (totalApiCalls > maxApiCalls || allVideos.length >= maxVideos) {
          break;
        }

        // Get video IDs from playlist
        const playlistResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
          params: {
            playlistId: uploadsPlaylistId,
            part: 'snippet',
            maxResults: 50,
            pageToken: nextPageToken,
            key: process.env.YOUTUBE_API_KEY,
          },
        });

        const videoIds = playlistResponse.data.items
          .map((item: any) => item.snippet.resourceId.videoId)
          .filter((id: string) => id);

        if (videoIds.length === 0) break;

        // Get detailed video information
        const videosResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
          params: {
            id: videoIds.join(','),
            part: 'snippet,statistics,contentDetails',
            key: process.env.YOUTUBE_API_KEY,
          },
        });

        // Process video data
        const processedVideos: VideoData[] = videosResponse.data.items.map((video: any) => {
          const duration = video.contentDetails.duration;
          const viewCount = parseInt(video.statistics.viewCount || '0', 10);
          const title = video.snippet.title;
          const description = video.snippet.description || '';
          const isShort = this.isVideoShort(duration, title, description, video.id);
          
          return {
            id: video.id,
            title,
            viewCount,
            duration,
            isShort,
            publishedAt: new Date(video.snippet.publishedAt),
            videoUrl: this.generateVideoUrl(video.id),
            thumbnailUrl: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
          };
        }).filter(video => {
          // Apply format filter if specified
          if (formatFilter === 'longform') return !video.isShort;
          if (formatFilter === 'shorts') return video.isShort;
          return true; // No filter, include all
        });

        allVideos.push(...processedVideos);
        nextPageToken = playlistResponse.data.nextPageToken;

        // Add small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } while (nextPageToken && totalApiCalls < maxApiCalls && allVideos.length < maxVideos);

      // Separate into Shorts and Long-form
      const longformVideos = allVideos.filter(video => !video.isShort);
      const shortsVideos = allVideos.filter(video => video.isShort);

      console.log(`Fetched ${allVideos.length} recent videos (out of ${actualTotalVideos} total) for outlier analysis${formatFilter ? ` [${formatFilter} only]` : ''}`);

      return {
        videos: allVideos,
        totalVideos: allVideos.length,
        longformVideos,
        shortsVideos,
        fetchedAll: false, // We intentionally didn't fetch all
        tier: 'free',
        actualTotalVideos
      };

    } catch (error) {
      console.error('Error fetching last 100 videos:', error);
      throw new Error(`Failed to fetch videos: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}