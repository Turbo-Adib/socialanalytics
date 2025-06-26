import { NextRequest, NextResponse } from 'next/server';
import { YouTubeAPI } from '@/lib/youtube';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    const api = new YouTubeAPI();
    const channelIdentifier = api.extractChannelIdFromUrl(url);
    
    if (!channelIdentifier) {
      return NextResponse.json({ error: 'Invalid YouTube channel URL' }, { status: 400 });
    }

    // Get channel data
    let channel;
    if (channelIdentifier.startsWith('UC') && channelIdentifier.length === 24) {
      channel = await api.getChannelById(channelIdentifier);
    } else {
      channel = await api.getChannelByHandle(channelIdentifier);
    }

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Get recent videos
    const recentVideos = await api.getRecentVideos(channel.id, 10);

    // Calculate view totals
    const totalFromVideos = recentVideos.reduce((sum, video) => sum + video.viewCount, 0);

    // Return debug information
    const debugInfo = {
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        rawStats: channel.statistics,
        parsedStats: {
          totalViews: parseInt(channel.statistics.viewCount),
          subscriberCount: parseInt(channel.statistics.subscriberCount),
          videoCount: parseInt(channel.statistics.videoCount)
        }
      },
      recentVideos: {
        count: recentVideos.length,
        totalViews: totalFromVideos,
        averageViews: recentVideos.length > 0 ? totalFromVideos / recentVideos.length : 0,
        videos: recentVideos.map(v => ({
          id: v.id,
          title: v.title,
          views: v.viewCount,
          isShort: v.isShort,
          publishedAt: v.publishedAt
        }))
      },
      comparison: {
        channelTotalViews: parseInt(channel.statistics.viewCount),
        recentVideoTotalViews: totalFromVideos,
        percentageOfTotal: (totalFromVideos / parseInt(channel.statistics.viewCount)) * 100
      }
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ error: 'Failed to fetch debug data' }, { status: 500 });
  }
}