import { NextRequest, NextResponse } from 'next/server';
import { YouTubeAPI } from '@/lib/youtube';
import { MinimalAnalyticsCalculator, MinimalAnalytics } from '@/utils/minimalAnalytics';

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

    console.log(`=== MINIMAL ANALYTICS for ${url} ===`);

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

    // Get recent videos (20 for analysis)
    const recentVideos = await api.getRecentVideos(channel.id, 20);

    console.log(`Channel: ${channel.snippet.title}`);
    console.log(`Subscribers: ${parseInt(channel.statistics.subscriberCount).toLocaleString()}`);
    console.log(`Total Views: ${parseInt(channel.statistics.viewCount).toLocaleString()}`);
    console.log(`Recent Videos: ${recentVideos.length}`);

    // Prepare channel data
    const channelData = {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails.high?.url || '',
      subscriberCount: parseInt(channel.statistics.subscriberCount),
      totalViews: parseInt(channel.statistics.viewCount),
      videoCount: parseInt(channel.statistics.videoCount)
    };

    // Simple niche detection
    const videoTitles = recentVideos.map(v => v.title);
    const niche = api.detectChannelNiche(videoTitles);

    // Calculate minimal analytics
    const overview = await MinimalAnalyticsCalculator.calculateChannelOverview(channelData, recentVideos, niche);
    const recentPerformance = await MinimalAnalyticsCalculator.analyzeRecentPerformance(recentVideos, niche);
    const projections = MinimalAnalyticsCalculator.calculateSimpleProjections(overview, recentPerformance);

    const response: MinimalAnalytics = {
      overview,
      recentPerformance,
      projections,
      lastUpdated: new Date().toISOString()
    };

    console.log(`Analysis complete. Est. monthly revenue: $${overview.monthlyRevenue.estimated}`);
    console.log(`Average views: ${recentPerformance.averageViews.toLocaleString()}`);
    console.log(`Upload frequency: ${recentPerformance.uploadFrequency} videos/month`);
    console.log('=======================================');

    return NextResponse.json(response);
  } catch (error) {
    console.error('Simple Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to analyze channel' }, { status: 500 });
  }
}