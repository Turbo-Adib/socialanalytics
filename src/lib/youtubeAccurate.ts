import YTDlpWrap from 'yt-dlp-wrap';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface AccurateVideoData {
  id: string;
  title: string;
  viewCount: number;
  publishedAt: string;
  duration: number; // in seconds
  isShort: boolean;
  thumbnailUrl: string;
  channelId: string;
  description?: string;
}

export interface AccurateChannelData {
  id: string;
  title: string;
  subscriberCount: number;
  totalViews: number;
  videoCount: number;
  thumbnailUrl: string;
  description: string;
  recentVideos: AccurateVideoData[];
}

export class YouTubeAccurateAPI {
  private ytDlp: YTDlpWrap;

  constructor() {
    this.ytDlp = new YTDlpWrap();
  }

  /**
   * Get accurate channel data using yt-dlp
   */
  async getAccurateChannelData(channelUrl: string): Promise<AccurateChannelData | null> {
    try {
      console.log(`Fetching accurate data for: ${channelUrl}`);
      
      // Get channel info and recent videos using yt-dlp
      const channelInfo = await this.ytDlp.execPromise([
        '--dump-json',
        '--flat-playlist',
        '--playlist-items', '1:50', // Get latest 50 videos
        channelUrl
      ]);

      const lines = channelInfo.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        throw new Error('No data returned from yt-dlp');
      }

      // Parse each video entry
      const videos: AccurateVideoData[] = [];
      let channelData: any = null;

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          
          // Skip if this is channel metadata (not a video)
          if (data._type === 'playlist') {
            channelData = data;
            continue;
          }

          // Get detailed video info
          const videoDetails = await this.getVideoDetails(data.url || data.id);
          if (videoDetails) {
            videos.push(videoDetails);
          }
        } catch (error) {
          console.warn('Failed to parse line:', line.substring(0, 100));
          continue;
        }
      }

      if (!channelData) {
        throw new Error('Channel metadata not found');
      }

      // Calculate aggregated stats
      const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
      const subscriberCount = channelData.subscriber_count || 0;

      return {
        id: channelData.id || '',
        title: channelData.title || channelData.uploader || '',
        subscriberCount,
        totalViews,
        videoCount: videos.length,
        thumbnailUrl: channelData.thumbnail || videos[0]?.thumbnailUrl || '',
        description: channelData.description || '',
        recentVideos: videos
      };

    } catch (error) {
      console.error('yt-dlp error:', error);
      return null;
    }
  }

  /**
   * Get detailed video information including accurate view count
   */
  async getVideoDetails(videoUrl: string): Promise<AccurateVideoData | null> {
    try {
      const videoInfo = await this.ytDlp.execPromise([
        '--dump-json',
        '--no-download',
        videoUrl
      ]);

      const data = JSON.parse(videoInfo);

      return {
        id: data.id,
        title: data.title,
        viewCount: data.view_count || 0,
        publishedAt: data.upload_date ? this.formatDate(data.upload_date) : new Date().toISOString(),
        duration: data.duration || 0,
        isShort: this.classifyVideoType(data.title, data.duration || 0),
        thumbnailUrl: data.thumbnail || '',
        channelId: data.channel_id || '',
        description: data.description || ''
      };

    } catch (error) {
      console.warn('Failed to get video details:', videoUrl, error);
      return null;
    }
  }

  /**
   * Get recent videos using YouTube RSS feed (fastest method)
   */
  async getRecentVideosFromRSS(channelId: string): Promise<AccurateVideoData[]> {
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const response = await axios.get(rssUrl);
      
      const parser = new XMLParser();
      const xmlData = parser.parse(response.data);
      
      const entries = xmlData.feed?.entry || [];
      const videos: AccurateVideoData[] = [];

      for (const entry of entries.slice(0, 15)) { // RSS only provides last 15
        try {
          const videoId = entry.id?.split(':').pop();
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          
          // Get accurate view count using yt-dlp
          const videoDetails = await this.getVideoDetails(videoUrl);
          if (videoDetails) {
            videos.push(videoDetails);
          }
        } catch (error) {
          console.warn('Failed to process RSS entry:', error);
          continue;
        }
      }

      return videos;

    } catch (error) {
      console.error('RSS feed error:', error);
      return [];
    }
  }

  /**
   * Simplified content classification based on title and duration
   */
  private classifyVideoType(title: string, duration: number): boolean {
    const titleLower = title.toLowerCase();
    
    // Strong indicators for Shorts
    const shortsKeywords = [
      '#shorts', '#short', '#viral', '#trending',
      'quick', 'fast', 'in 60 seconds', 'in 1 minute',
      'vs', 'pov', 'when', 'me when', 'irl'
    ];

    // Check for explicit Shorts indicators in title
    const hasShortIndicator = shortsKeywords.some(keyword => 
      titleLower.includes(keyword)
    );

    // Title length analysis (Shorts typically have shorter, punchier titles)
    const isShortTitle = title.length <= 50;

    // Duration check (≤ 3 minutes)
    const isShortDuration = duration <= 180;

    // Simple emoji check (common emojis in Shorts titles)
    const commonEmojis = ['😂', '🔥', '💀', '🎵', '🎬', '✨', '👀', '❤️', '💯', '🎯'];
    const hasEmojis = commonEmojis.some(emoji => title.includes(emoji));

    // Classification logic
    if (hasShortIndicator) return true;
    if (duration <= 60) return true; // Very short videos are definitely Shorts
    if (isShortDuration && (isShortTitle || hasEmojis)) return true;

    return false;
  }

  /**
   * Extract channel ID from various YouTube URL formats
   */
  extractChannelId(url: string): string | null {
    // Handle different YouTube URL formats
    const patterns = [
      /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/@([a-zA-Z0-9_.-]+)/,
      /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
      /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // If no pattern matches, check if it's already a channel ID or handle
    if (url.startsWith('UC') && url.length === 24) {
      return url;
    }

    // Check if it's a handle
    if (url.startsWith('@') || !url.includes('/')) {
      return url;
    }

    return null;
  }

  /**
   * Format yt-dlp date to ISO string
   */
  private formatDate(uploadDate: string): string {
    // yt-dlp returns dates in YYYYMMDD format
    if (uploadDate.length === 8) {
      const year = uploadDate.substring(0, 4);
      const month = uploadDate.substring(4, 6);
      const day = uploadDate.substring(6, 8);
      return new Date(`${year}-${month}-${day}`).toISOString();
    }
    return new Date().toISOString();
  }

  /**
   * Detect channel niche from video titles (simplified)
   */
  detectChannelNiche(videoTitles: string[]): string {
    const allTitles = videoTitles.join(' ').toLowerCase();
    
    const niches = {
      'Gaming': ['game', 'gaming', 'gameplay', 'play', 'minecraft', 'fortnite', 'valorant', 'gta'],
      'Tech': ['tech', 'review', 'iphone', 'android', 'laptop', 'computer', 'coding', 'programming'],
      'Finance': ['money', 'invest', 'stock', 'crypto', 'bitcoin', 'trading', 'financial'],
      'Education': ['learn', 'tutorial', 'how to', 'explain', 'course', 'math', 'science'],
      'Entertainment': ['funny', 'comedy', 'react', 'prank', 'meme', 'tiktok'],
      'Beauty': ['makeup', 'skincare', 'fashion', 'outfit', 'style', 'beauty'],
      'Fitness': ['workout', 'gym', 'exercise', 'diet', 'weight', 'muscle'],
      'Food': ['recipe', 'cooking', 'food', 'kitchen', 'baking', 'eating'],
      'Music': ['music', 'song', 'cover', 'singing', 'guitar', 'piano'],
      'Travel': ['travel', 'trip', 'vacation', 'explore', 'adventure', 'destination']
    };

    let maxScore = 0;
    let detectedNiche = 'General';

    for (const [niche, keywords] of Object.entries(niches)) {
      const score = keywords.filter(keyword => allTitles.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedNiche = niche;
      }
    }

    return detectedNiche;
  }
}