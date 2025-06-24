import axios from 'axios';
import { YouTubeChannel, YouTubeVideo } from '@/src/types/youtube';

const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

export class YouTubeAPI {
  private apiKey: string;

  constructor(apiKey: string = API_KEY || '') {
    if (!apiKey) {
      throw new Error('YouTube API key is required');
    }
    this.apiKey = apiKey;
  }

  async getChannelByHandle(handle: string): Promise<YouTubeChannel | null> {
    try {
      // Remove @ symbol if present
      const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
      
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
        params: {
          forHandle: cleanHandle,
          part: 'snippet,statistics',
          key: this.apiKey,
        },
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching channel by handle:', error);
      throw error;
    }
  }

  async getChannelById(channelId: string): Promise<YouTubeChannel | null> {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
        params: {
          id: channelId,
          part: 'snippet,statistics',
          key: this.apiKey,
        },
      });

      if (response.data.items && response.data.items.length > 0) {
        return response.data.items[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching channel by ID:', error);
      throw error;
    }
  }

  async getChannelVideos(channelId: string, maxResults: number = 500): Promise<YouTubeVideo[]> {
    try {
      // First, get the uploads playlist ID
      const channelResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/channels`, {
        params: {
          id: channelId,
          part: 'contentDetails',
          key: this.apiKey,
        },
      });

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        return [];
      }

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Implement pagination to get more videos (API limit is 50 per request)
      const allVideos: YouTubeVideo[] = [];
      let nextPageToken: string | undefined;
      const maxPerRequest = 50; // YouTube API limit
      
      do {
        // Get videos from the uploads playlist with pagination
        const videosResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/playlistItems`, {
          params: {
            playlistId: uploadsPlaylistId,
            part: 'snippet',
            maxResults: maxPerRequest,
            pageToken: nextPageToken,
            key: this.apiKey,
          },
        });

        if (!videosResponse.data.items || videosResponse.data.items.length === 0) {
          break;
        }

        // Get video IDs for this batch
        const videoIds = videosResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);

        // Get detailed video statistics for this batch
        const detailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
          params: {
            id: videoIds.join(','),
            part: 'snippet,statistics,contentDetails',
            key: this.apiKey,
          },
        });

        if (detailsResponse.data.items) {
          allVideos.push(...detailsResponse.data.items);
        }

        nextPageToken = videosResponse.data.nextPageToken;
        
        // Stop if we've reached our desired limit
        if (allVideos.length >= maxResults) {
          break;
        }
        
      } while (nextPageToken && allVideos.length < maxResults);

      // Return up to maxResults videos
      return allVideos.slice(0, maxResults);
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw error;
    }
  }

  extractChannelIdFromUrl(url: string): string | null {
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

  isVideoShort(video: YouTubeVideo): boolean {
    // YouTube Shorts can be up to 3 minutes (180 seconds) as of 2024
    const duration = video.contentDetails?.duration || '';
    
    // Parse ISO 8601 duration format (PT1M30S = 1 minute 30 seconds)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || '0');
      const seconds = parseInt(match[3] || '0');
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      
      // YouTube Shorts: ≤ 180 seconds (3 minutes)
      if (totalSeconds <= 180) {
        // Additional validation: check if it's actually marked as a Short
        // Check title/description for #Shorts indicator
        const title = video.snippet?.title?.toLowerCase() || '';
        const description = video.snippet?.description?.toLowerCase() || '';
        const hasShortIndicator = title.includes('#short') || description.includes('#short');
        
        // For videos 61-180 seconds, require #shorts indicator for classification
        // For videos ≤60 seconds, assume they're Shorts (legacy logic)
        if (totalSeconds <= 60) {
          return true;
        } else if (totalSeconds <= 180 && hasShortIndicator) {
          return true;
        }
      }
    }
    
    return false;
  }

  detectNiche(channelTitle: string, channelDescription: string, videoTitles: string[]): string {
    const text = `${channelTitle} ${channelDescription} ${videoTitles.join(' ')}`.toLowerCase();
    
    const niches = {
      'Gaming': ['game', 'gaming', 'gameplay', 'gamer', 'play', 'stream', 'twitch', 'console', 'pc'],
      'Tech': ['tech', 'technology', 'review', 'gadget', 'computer', 'software', 'hardware', 'code', 'programming'],
      'Education': ['learn', 'tutorial', 'how to', 'explain', 'course', 'lesson', 'teach', 'study'],
      'Entertainment': ['funny', 'comedy', 'laugh', 'prank', 'react', 'reaction', 'vlog', 'daily'],
      'Music': ['music', 'song', 'sing', 'cover', 'lyrics', 'album', 'artist', 'band'],
      'Beauty': ['makeup', 'beauty', 'cosmetic', 'skincare', 'fashion', 'style', 'outfit'],
      'Finance': ['money', 'finance', 'invest', 'stock', 'crypto', 'trading', 'economy', 'business'],
      'Fitness': ['fitness', 'workout', 'exercise', 'gym', 'health', 'diet', 'nutrition', 'weight'],
      'Food': ['food', 'cook', 'recipe', 'kitchen', 'restaurant', 'eat', 'taste', 'chef'],
      'Travel': ['travel', 'trip', 'tour', 'visit', 'explore', 'adventure', 'destination', 'journey']
    };

    let maxScore = 0;
    let detectedNiche = 'General';

    for (const [niche, keywords] of Object.entries(niches)) {
      const score = keywords.filter(keyword => text.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedNiche = niche;
      }
    }

    return detectedNiche;
  }
}