import axios from 'axios';

export interface EnhancedVideoData {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  tags: string[];
  viewCount: number;
  publishedAt: string;
  duration: string;
  isShort: boolean;
  thumbnailUrl: string;
  channelId: string;
  captions?: string;
  categoryId: string;
  defaultLanguage?: string;
}

export interface EnhancedChannelData {
  id: string;
  title: string;
  description: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  thumbnailUrl: string;
  keywords: string[];
  recentVideos: EnhancedVideoData[];
  channelType: string;
  publishedAt: string;
}

export class EnhancedYouTubeAPI {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey: string = process.env.YOUTUBE_API_KEY || '') {
    if (!apiKey) {
      throw new Error('YouTube API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Get comprehensive channel data with enhanced content analysis
   */
  async getEnhancedChannelData(channelUrl: string): Promise<EnhancedChannelData | null> {
    try {
      const channelId = this.extractChannelIdFromUrl(channelUrl);
      if (!channelId) {
        throw new Error('Invalid YouTube channel URL');
      }

      // Get basic channel info
      const channelResponse = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          id: channelId,
          part: 'snippet,statistics,brandingSettings',
          key: this.apiKey,
        },
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        return null;
      }

      const channelData = channelResponse.data.items[0];

      // Get recent videos with enhanced data
      const recentVideos = await this.getEnhancedRecentVideos(channelId, 50);

      // Extract keywords from channel
      const keywords = this.extractKeywords(channelData.snippet.description);

      return {
        id: channelData.id,
        title: channelData.snippet.title,
        description: channelData.snippet.description || '',
        subscriberCount: parseInt(channelData.statistics.subscriberCount || '0'),
        totalViews: parseInt(channelData.statistics.viewCount || '0'),
        videoCount: parseInt(channelData.statistics.videoCount || '0'),
        thumbnailUrl: channelData.snippet.thumbnails?.high?.url || '',
        keywords,
        recentVideos,
        channelType: channelData.snippet.customUrl ? 'verified' : 'standard',
        publishedAt: channelData.snippet.publishedAt,
      };

    } catch (error) {
      console.error('Enhanced YouTube API error:', error);
      return null;
    }
  }

  /**
   * Get recent videos with comprehensive content analysis
   */
  async getEnhancedRecentVideos(channelId: string, maxResults: number = 50): Promise<EnhancedVideoData[]> {
    try {
      // Get video list
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          channelId,
          part: 'snippet',
          order: 'date',
          maxResults,
          type: 'video',
          key: this.apiKey,
        },
      });

      if (!searchResponse.data.items) {
        return [];
      }

      const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId);

      // Get detailed video information in batches of 50
      const enhancedVideos: EnhancedVideoData[] = [];
      
      for (let i = 0; i < videoIds.length; i += 50) {
        const batchIds = videoIds.slice(i, i + 50);
        const detailedVideos = await this.getDetailedVideoInfo(batchIds);
        enhancedVideos.push(...detailedVideos);
      }

      return enhancedVideos;

    } catch (error) {
      console.error('Error fetching enhanced recent videos:', error);
      return [];
    }
  }

  /**
   * Get detailed video information including descriptions, tags, and captions
   */
  async getDetailedVideoInfo(videoIds: string[]): Promise<EnhancedVideoData[]> {
    try {
      const videoResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          id: videoIds.join(','),
          part: 'snippet,statistics,contentDetails,status',
          key: this.apiKey,
        },
      });

      if (!videoResponse.data.items) {
        return [];
      }

      const enhancedVideos: EnhancedVideoData[] = [];

      for (const video of videoResponse.data.items) {
        // Extract hashtags from description
        const hashtags = this.extractHashtags(video.snippet.description || '');
        
        // Get captions if available
        let captions = '';
        try {
          captions = await this.getCaptions(video.id);
        } catch (error) {
          // Captions might not be available or auto-generated
          console.log(`Captions not available for video ${video.id}`);
        }

        const enhancedVideo: EnhancedVideoData = {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description || '',
          hashtags,
          tags: video.snippet.tags || [],
          viewCount: parseInt(video.statistics.viewCount || '0'),
          publishedAt: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
          isShort: this.isShortVideo(video.contentDetails.duration, video.snippet.title),
          thumbnailUrl: video.snippet.thumbnails?.high?.url || '',
          channelId: video.snippet.channelId,
          captions,
          categoryId: video.snippet.categoryId || '',
          defaultLanguage: video.snippet.defaultLanguage,
        };

        enhancedVideos.push(enhancedVideo);
      }

      return enhancedVideos;

    } catch (error) {
      console.error('Error getting detailed video info:', error);
      return [];
    }
  }

  /**
   * Get video captions/subtitles
   */
  async getCaptions(videoId: string): Promise<string> {
    try {
      // Get caption tracks
      const captionsResponse = await axios.get(`${this.baseUrl}/captions`, {
        params: {
          videoId,
          part: 'snippet',
          key: this.apiKey,
        },
      });

      if (!captionsResponse.data.items || captionsResponse.data.items.length === 0) {
        return '';
      }

      // Try to get English captions first, then any available
      const englishCaption = captionsResponse.data.items.find((item: any) => 
        item.snippet.language === 'en' || item.snippet.language === 'en-US'
      );
      
      const captionTrack = englishCaption || captionsResponse.data.items[0];

      // Download caption content
      const captionContent = await axios.get(`${this.baseUrl}/captions/${captionTrack.id}`, {
        params: {
          key: this.apiKey,
          tfmt: 'srt', // SubRip format
        },
      });

      return this.cleanCaptionText(captionContent.data);

    } catch (error) {
      console.log('Captions not accessible for video:', videoId);
      return '';
    }
  }

  /**
   * Extract hashtags from video description
   */
  private extractHashtags(description: string): string[] {
    const hashtagRegex = /#[\w\u00c0-\u024f\u1e00-\u1eff]+/gi;
    const matches = description.match(hashtagRegex) || [];
    return matches.map(tag => tag.toLowerCase());
  }

  /**
   * Extract keywords from text content
   */
  private extractKeywords(text: string): string[] {
    if (!text) return [];

    // Remove common stop words and extract meaningful keywords
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && 
        !stopWords.has(word) && 
        !word.match(/^\d+$/)
      );

    // Get unique keywords
    const uniqueWords = Array.from(new Set(words));
    
    // Return top 20 most relevant keywords
    return uniqueWords.slice(0, 20);
  }

  /**
   * Determine if video is a Short based on duration and title
   */
  private isShortVideo(duration: string, title: string): boolean {
    // Parse ISO 8601 duration
    const durationSeconds = this.parseDurationToSeconds(duration);
    
    // Shorts indicators
    const shortsKeywords = ['#shorts', '#short', 'short', 'shorts'];
    const hasShortKeyword = shortsKeywords.some(keyword => 
      title.toLowerCase().includes(keyword)
    );

    // Video is a Short if duration <= 60 seconds OR has shorts keyword and <= 180 seconds
    return durationSeconds <= 60 || (hasShortKeyword && durationSeconds <= 180);
  }

  /**
   * Parse ISO 8601 duration to seconds
   */
  private parseDurationToSeconds(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Clean caption text by removing timestamps and formatting
   */
  private cleanCaptionText(captionData: string): string {
    if (!captionData || typeof captionData !== 'string') return '';

    return captionData
      .replace(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/g, '') // Remove timestamps
      .replace(/^\d+$/gm, '') // Remove sequence numbers
      .replace(/\[.*?\]/g, '') // Remove stage directions
      .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
      .trim();
  }

  /**
   * Extract channel ID from various YouTube URL formats
   */
  extractChannelIdFromUrl(url: string): string | null {
    const patterns = [
      /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/@([a-zA-Z0-9_.-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }
}