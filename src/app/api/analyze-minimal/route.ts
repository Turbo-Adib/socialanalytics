import { NextRequest, NextResponse } from 'next/server';
import { YouTubeAPI } from '@/lib/youtube';
import { MinimalAnalyticsCalculator, MinimalAnalytics } from '@/utils/minimalAnalytics';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    const api = new YouTubeAPI();
    
    // Extract channel ID or handle from URL
    const channelIdentifier = api.extractChannelIdFromUrl(url);
    if (!channelIdentifier) {
      return NextResponse.json({ error: 'Invalid YouTube channel URL' }, { status: 400 });
    }

    console.log(`Analyzing channel: ${url} (${channelIdentifier})`);

    // Check cache first (1-hour cache for optimal performance)
    const cachedChannel = await prisma.channel.findUnique({
      where: { id: channelIdentifier },
      include: { 
        snapshots: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
    });

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    // Helper method for getting next milestone
    const getNextMilestone = (current: number): number => {
      const milestones = [1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];
      return milestones.find(m => m > current) || current + 1000000;
    };
    
    if (cachedChannel && cachedChannel.lastSnapshotAt && cachedChannel.lastSnapshotAt > oneHourAgo) {
      console.log('Using cached data (less than 1 hour old)');
      
      const lastSnapshot = cachedChannel.snapshots[0];
      if (lastSnapshot) {
        // Construct minimal analytics from cached data
        const cachedAnalytics: MinimalAnalytics = {
          overview: {
            id: cachedChannel.id,
            title: cachedChannel.channelTitle,
            description: cachedChannel.description || '',
            thumbnailUrl: cachedChannel.thumbnailUrl || '',
            subscriberCount: lastSnapshot.subscriberCount,
            totalViews: lastSnapshot.subscriberCount * 1000, // Rough estimate
            videoCount: 0, // Not stored in cache
            estimatedAge: { years: 1, months: 0 }, // Default
            monthlyRevenue: {
              min: Math.round(Number(lastSnapshot.estRevenueLongUsd) * 0.5),
              max: Math.round(Number(lastSnapshot.estRevenueLongUsd) * 2),
              estimated: Math.round(Number(lastSnapshot.estRevenueLongUsd))
            },
            niche: cachedChannel.primaryNiche || 'General'
          },
          recentPerformance: {
            averageViews: Math.round((Number(lastSnapshot.monthlyViewsLong) + Number(lastSnapshot.monthlyViewsShorts)) / 20),
            totalVideos: 20,
            bestVideo: {
              id: 'cached',
              title: 'Best Performing Video',
              views: Math.round((Number(lastSnapshot.monthlyViewsLong) + Number(lastSnapshot.monthlyViewsShorts)) / 10),
              publishedAt: new Date().toISOString(),
              duration: 600,
              isShort: false,
              performance: 'good' as const
            },
            worstVideo: {
              id: 'cached',
              title: 'Lower Performing Video',
              views: Math.round((Number(lastSnapshot.monthlyViewsLong) + Number(lastSnapshot.monthlyViewsShorts)) / 50),
              publishedAt: new Date().toISOString(),
              duration: 300,
              isShort: true,
              performance: 'average' as const
            },
            uploadFrequency: cachedChannel.uploadFrequencyPerWeek ? cachedChannel.uploadFrequencyPerWeek * 4.33 : 8,
            contentMix: {
              longFormPercentage: Number(lastSnapshot.monthlyViewsLong) > Number(lastSnapshot.monthlyViewsShorts) ? 70 : 30,
              shortsPercentage: Number(lastSnapshot.monthlyViewsShorts) > Number(lastSnapshot.monthlyViewsLong) ? 70 : 30
            },
            revenueEstimate: {
              monthly: Math.round(Number(lastSnapshot.estRevenueLongUsd) + Number(lastSnapshot.estRevenueShortsUsd))
            }
          },
          projections: {
            subscribers: {
              nextMilestone: getNextMilestone(lastSnapshot.subscriberCount),
              estimatedDays: 90,
              growthRate: Math.round(lastSnapshot.subscriberCount * 0.05)
            },
            revenue: {
              nextMonth: Math.round(Number(lastSnapshot.estRevenueLongUsd) + Number(lastSnapshot.estRevenueShortsUsd)),
              nextYear: Math.round((Number(lastSnapshot.estRevenueLongUsd) + Number(lastSnapshot.estRevenueShortsUsd)) * 12)
            }
          },
          lastUpdated: cachedChannel.lastSnapshotAt.toISOString()
        };

        return NextResponse.json(cachedAnalytics);
      }
    }

    // Fetch fresh data using YouTube Data API v3
    console.log('Fetching fresh data using YouTube API...');
    
    let channel;
    if (channelIdentifier.startsWith('UC') && channelIdentifier.length === 24) {
      channel = await api.getChannelById(channelIdentifier);
    } else {
      channel = await api.getChannelByHandle(channelIdentifier);
    }

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Get recent videos (20 videos for minimal analysis)
    const fetchedVideos = await api.getRecentVideos(channel.id, 20);

    console.log('=== YouTube API Data ===');
    console.log('Channel:', channel.snippet.title);
    console.log('Subscribers:', channel.statistics.subscriberCount);
    console.log('Total Views:', channel.statistics.viewCount);
    console.log('Videos Fetched:', fetchedVideos.length);
    console.log('=======================');

    // Convert to our format
    const channelData = {
      id: channel.id,
      title: channel.snippet.title,
      subscriberCount: parseInt(channel.statistics.subscriberCount),
      totalViews: parseInt(channel.statistics.viewCount),
      videoCount: parseInt(channel.statistics.videoCount),
      thumbnailUrl: channel.snippet.thumbnails.high?.url || '',
      description: channel.snippet.description || ''
    };

    // Detect niche
    const videoTitles = fetchedVideos.map(v => v.title);
    const niche = api.detectChannelNiche(videoTitles);

    // Calculate minimal analytics
    const overview = await MinimalAnalyticsCalculator.calculateChannelOverview(
      channelData, 
      fetchedVideos, 
      niche
    );
    
    const recentPerformance = await MinimalAnalyticsCalculator.analyzeRecentPerformance(
      fetchedVideos, 
      niche
    );
    
    const projections = MinimalAnalyticsCalculator.calculateSimpleProjections(
      overview, 
      recentPerformance
    );

    // Prepare final analytics response
    const analytics: MinimalAnalytics = {
      overview,
      recentPerformance,
      projections,
      lastUpdated: new Date().toISOString()
    };

    // Save to database for caching
    await prisma.channel.upsert({
      where: { id: channelData.id },
      update: {
        channelTitle: channelData.title,
        description: channelData.description,
        primaryNiche: niche,
        uploadFrequencyPerWeek: recentPerformance.uploadFrequency / 4.33, // Convert monthly to weekly
        thumbnailUrl: channelData.thumbnailUrl,
        lastSnapshotAt: new Date(),
      },
      create: {
        id: channelData.id,
        channelTitle: channelData.title,
        description: channelData.description,
        primaryNiche: niche,
        uploadFrequencyPerWeek: recentPerformance.uploadFrequency / 4.33,
        thumbnailUrl: channelData.thumbnailUrl,
        lastSnapshotAt: new Date(),
      },
    });

    // Save snapshot
    await prisma.channelSnapshot.create({
      data: {
        channelId: channelData.id,
        subscriberCount: channelData.subscriberCount,
        monthlyViewsLong: BigInt(Math.round(recentPerformance.averageViews * recentPerformance.uploadFrequency * (recentPerformance.contentMix.longFormPercentage / 100))),
        monthlyViewsShorts: BigInt(Math.round(recentPerformance.averageViews * recentPerformance.uploadFrequency * (recentPerformance.contentMix.shortsPercentage / 100))),
        estRevenueLongUsd: overview.monthlyRevenue.estimated * (recentPerformance.contentMix.longFormPercentage / 100),
        estRevenueShortsUsd: overview.monthlyRevenue.estimated * (recentPerformance.contentMix.shortsPercentage / 100),
      },
    });

    console.log('Analytics calculated and cached successfully');
    return NextResponse.json(analytics);

  } catch (error) {
    console.error('API error:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to analyze channel' }, { status: 500 });
  }
}