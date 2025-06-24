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
   * Determine if video is a Short (≤60 seconds)
   */
  private isVideoShort(duration: string): boolean {
    const durationInSeconds = this.parseDurationToSeconds(duration);
    return durationInSeconds <= 60;
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
          
          return {
            id: video.id,
            title: video.snippet.title,
            viewCount,
            duration,
            isShort: this.isVideoShort(duration),
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
}