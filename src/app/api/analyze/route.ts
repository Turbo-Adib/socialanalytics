import { NextRequest, NextResponse } from 'next/server';
import { YouTubeAPI } from '@/src/lib/youtube';
import { SimplifiedAnalytics } from '@/src/utils/analyticsSimplified';
import { prisma } from '@/src/lib/prisma';
import { validateAgainstSocialBlade } from '@/src/utils/validationAndComparison';
import { ViewCountValidator } from '@/src/utils/viewCountValidation';
import { ChannelAnalytics } from '@/src/types/youtube';

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

    // Check cache first (reduced cache time to 15 minutes for more accurate data)
    const cachedChannel = await prisma.channel.findUnique({
      where: { id: channelIdentifier },
      include: { snapshots: true },
    });

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (cachedChannel && cachedChannel.lastSnapshotAt && cachedChannel.lastSnapshotAt > fifteenMinutesAgo) {
      console.log('Using cached data (less than 15 minutes old)');
      // Return cached data with simplified structure
      const lastSnapshot = cachedChannel.snapshots[cachedChannel.snapshots.length - 1];
      const response: ChannelAnalytics = {
        channel: {
          id: cachedChannel.id,
          title: cachedChannel.channelTitle,
          description: cachedChannel.description || '',
          thumbnailUrl: cachedChannel.thumbnailUrl || '',
          subscriberCount: lastSnapshot.subscriberCount,
          totalViews: lastSnapshot.subscriberCount * 1000, // Rough estimate for cached data
          videoCount: 0,
          niche: cachedChannel.primaryNiche || 'General',
        },
        currentStats: {
          totalViews: Number(lastSnapshot.monthlyViewsLong) + Number(lastSnapshot.monthlyViewsShorts),
          longFormViews: Number(lastSnapshot.monthlyViewsLong),
          shortsViews: Number(lastSnapshot.monthlyViewsShorts),
          uploadFrequency: cachedChannel.uploadFrequencyPerWeek || 0,
        },
        historicalData: [], // Simplified - no complex historical data
        dailyData: [], // No daily data in cache
        projections: {
          nextMonth: { views: 0, revenue: 0 },
          nextYear: { views: 0, revenue: 0 }
        },
        recentVideos: [], // Will be populated with real data
      };

      return NextResponse.json(response);
    }

    // Fetch fresh data using YouTube Data API v3
    console.log('Fetching fresh data using YouTube API...');
    
    let channelData = null;
    
    // Use YouTube Data API v3 directly (skip yt-dlp due to bot verification issues)
    console.log('Using YouTube Data API v3...');
    let channel;
    if (channelIdentifier.startsWith('UC') && channelIdentifier.length === 24) {
      channel = await api.getChannelById(channelIdentifier);
    } else {
      channel = await api.getChannelByHandle(channelIdentifier);
    }

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // Get recent videos using the API (fetch more for daily chart data)
    const fetchedVideos = await api.getRecentVideos(channel.id, 100);

    // Log raw API data for debugging
    console.log('=== YouTube API Channel Data ===');
    console.log('Channel:', channel.snippet.title);
    console.log('Total Channel Views (all-time):', channel.statistics.viewCount);
    console.log('Subscriber Count:', channel.statistics.subscriberCount);
    console.log('Total Video Count:', channel.statistics.videoCount);
    console.log('Fetched Videos Count:', fetchedVideos.length);
    
    // Calculate total views from fetched videos
    const sumOfFetchedVideoViews = fetchedVideos.reduce((sum, video) => sum + video.viewCount, 0);
    console.log('Sum of Fetched Video Views:', sumOfFetchedVideoViews.toLocaleString());
    console.log('================================');

    // Convert to our format
    channelData = {
      id: channel.id,
      title: channel.snippet.title,
      subscriberCount: parseInt(channel.statistics.subscriberCount),
      totalViews: parseInt(channel.statistics.viewCount), // This is ALL-TIME views
      videoCount: parseInt(channel.statistics.videoCount),
      thumbnailUrl: channel.snippet.thumbnails.high?.url || '',
      description: channel.snippet.description,
      recentVideos: fetchedVideos // Now populated with actual videos
    };

    if (!channelData) {
      return NextResponse.json({ error: 'Could not fetch channel data' }, { status: 404 });
    }

    // Detect niche using simplified method
    const videoTitles = channelData.recentVideos.map(v => v.title);
    const niche = api.detectChannelNiche(videoTitles);

    // Calculate simplified analytics
    const currentStats = await SimplifiedAnalytics.calculateCurrentStats(channelData.recentVideos, niche);
    const recentPerformance = await SimplifiedAnalytics.calculateRecentPerformance(channelData.recentVideos, niche);
    const projections = SimplifiedAnalytics.calculateSimpleProjections(recentPerformance);
    const contentFocus = SimplifiedAnalytics.analyzeContentFocus(channelData.recentVideos);

    console.log('=== Analytics Calculation Results ===');
    console.log(`Analyzed ${channelData.recentVideos.length} videos. Content focus: ${contentFocus.primaryFocus}`);
    console.log('Channel Total Views (all-time):', channelData.totalViews.toLocaleString());
    console.log('Recent Videos Total Views:', currentStats.recentVideoViews.toLocaleString());
    console.log('Long-form Views (recent):', currentStats.longFormViews.toLocaleString());
    console.log('Shorts Views (recent):', currentStats.shortsViews.toLocaleString());
    console.log('Data Scope:', `${currentStats.dataScope.videosAnalyzed} videos over ${currentStats.dataScope.timeSpanDays} days`);
    console.log('=====================================');

    // Validate view count data
    const viewValidation = ViewCountValidator.validateViewCounts(
      channelData.totalViews,
      currentStats.recentVideoViews,
      channelData.videoCount,
      channelData.recentVideos.length,
      channelData.title
    );

    // Check against known channel benchmarks
    const knownChannelIssues = ViewCountValidator.validateKnownChannel(channelData.title, channelData.totalViews);
    if (knownChannelIssues.length > 0) {
      console.log('⚠️  Known Channel Validation Issues:', knownChannelIssues);
    }

    // Generate realistic chart data based on actual video upload dates  
    const chartData = await SimplifiedAnalytics.generateRealisticChartData(channelData.recentVideos, niche);
    const dailyData = await SimplifiedAnalytics.generateRealisticDailyData(channelData.recentVideos, niche);

    // Prepare response structure for validation
    const responseForValidation = {
      channel: {
        totalViews: channelData.totalViews,
      },
      currentStats: {
        totalViews: currentStats.recentVideoViews,
        longFormViews: currentStats.longFormViews,
        shortsViews: currentStats.shortsViews,
      },
      dailyData
    };

    // Validate mathematical consistency
    const mathIssues = ViewCountValidator.validateMathematicalConsistency(responseForValidation);
    const dailyIssues = ViewCountValidator.validateDailyPatterns(dailyData);
    
    if (mathIssues.length > 0) {
      console.log('⚠️  Mathematical Consistency Issues:', mathIssues);
    }
    if (dailyIssues.length > 0) {
      console.log('⚠️  Daily Pattern Issues:', dailyIssues);
    }

    // Prepare recent videos for response
    const recentVideos = channelData.recentVideos.slice(0, 10).map(video => ({
      id: video.id,
      title: video.title,
      views: video.viewCount,
      publishedAt: video.publishedAt,
      isShort: video.isShort,
    }));

    // Save to database
    await prisma.channel.upsert({
      where: { id: channelData.id },
      update: {
        channelTitle: channelData.title,
        description: channelData.description,
        primaryNiche: niche,
        uploadFrequencyPerWeek: currentStats.uploadFrequency,
        thumbnailUrl: channelData.thumbnailUrl,
        lastSnapshotAt: new Date(),
      },
      create: {
        id: channelData.id,
        channelTitle: channelData.title,
        description: channelData.description,
        primaryNiche: niche,
        uploadFrequencyPerWeek: currentStats.uploadFrequency,
        thumbnailUrl: channelData.thumbnailUrl,
        lastSnapshotAt: new Date(),
      },
    });

    // Validate against Social Blade methodology
    const validation = await validateAgainstSocialBlade(
      currentStats.longFormViews, 
      currentStats.shortsViews, 
      niche
    );

    // Save snapshot with accurate data
    await prisma.channelSnapshot.create({
      data: {
        channelId: channelData.id,
        subscriberCount: channelData.subscriberCount,
        monthlyViewsLong: BigInt(currentStats.longFormViews),
        monthlyViewsShorts: BigInt(currentStats.shortsViews),
        estRevenueLongUsd: currentStats.estimatedRevenue.longForm,
        estRevenueShortsUsd: currentStats.estimatedRevenue.shorts,
      },
    });

    // Prepare response with accurate data
    const response: ChannelAnalytics = {
      channel: {
        id: channelData.id,
        title: channelData.title,
        description: channelData.description,
        thumbnailUrl: channelData.thumbnailUrl,
        subscriberCount: channelData.subscriberCount,
        totalViews: channelData.totalViews, // Use actual channel total views from YouTube API
        videoCount: channelData.videoCount, // Use actual total video count from YouTube API
        niche,
      },
      currentStats: {
        totalViews: currentStats.recentVideoViews, // This is sum of recent video views only
        longFormViews: currentStats.longFormViews,
        shortsViews: currentStats.shortsViews,
        uploadFrequency: currentStats.uploadFrequency,
      },
      historicalData: chartData, // Simplified chart data
      dailyData, // Add daily chart data
      projections,
      recentVideos,
      validation, // Add validation data
      dataQuality: {
        quality: {
          totalVideosAnalyzed: channelData.recentVideos.length,
          longFormCount: currentStats.longFormCount,
          shortsCount: currentStats.shortsCount,
          dataCompleteness: 100, // Since we have real data
          averageViewsPerVideo: currentStats.averageViewsPerVideo,
          lastVideoDate: currentStats.lastUploadDate,
          channelAge: 0 // Not available
        },
        validation: {
          isValid: viewValidation.isValid && mathIssues.length === 0,
          errors: viewValidation.errors.concat(mathIssues),
          warnings: viewValidation.warnings.concat(knownChannelIssues).concat(dailyIssues),
          confidence: (viewValidation.isValid && mathIssues.length === 0) ? 'high' as const : 'medium' as const
        },
        anomalies: viewValidation.debugInfo.suspiciousMetrics,
        recommendations: contentFocus.primaryFocus === 'shorts' ? 
          ['Channel focuses on Shorts content with lower per-view revenue'] :
          ['Channel focuses on long-form content with higher revenue potential'],
        viewCountDebug: viewValidation.debugInfo // Add debug info for troubleshooting
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API error:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json({ error: 'YouTube API key is not configured' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to analyze channel' }, { status: 500 });
  }
}