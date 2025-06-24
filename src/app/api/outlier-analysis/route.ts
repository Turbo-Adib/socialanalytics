import { NextRequest, NextResponse } from 'next/server';
import { YouTubeAPI } from '@/src/lib/youtube';
import { VideoAnalyzer } from '@/src/lib/videoAnalyzer';
import { PatternAnalyzer, AnalysisResults } from '@/src/utils/patternAnalyzer';
import { prisma } from '@/src/lib/prisma';
import { CacheManager, AnalysisTier } from '@/src/utils/cacheManager';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const forceRefresh = searchParams.get('force') === 'true';
    const tier = (searchParams.get('tier') || 'free') as AnalysisTier;
    
    // Validate tier
    if (!['free', 'standard', 'premium'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier. Must be free, standard, or premium' }, { status: 400 });
    }

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    const api = new YouTubeAPI();
    
    // Extract channel ID or handle from URL
    const channelIdentifier = api.extractChannelIdFromUrl(url);
    if (!channelIdentifier) {
      return NextResponse.json({ error: 'Invalid YouTube channel URL' }, { status: 400 });
    }

    console.log(`Analyzing outlier patterns for channel: ${url} (${channelIdentifier}, tier: ${tier})`);

    // Get channel info first to determine upload frequency
    let channel;
    if (channelIdentifier.startsWith('UC') && channelIdentifier.length === 24) {
      channel = await api.getChannelById(channelIdentifier);
    } else {
      channel = await api.getChannelByHandle(channelIdentifier);
    }
    
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const totalVideoCount = parseInt(channel.statistics.videoCount, 10);
    const uploadFrequency = null; // We'll calculate this from video data later
    
    // Check intelligent cache
    if (!forceRefresh) {
      const cacheMetadata = await CacheManager.getOrCreateCache(
        channelIdentifier,
        tier,
        totalVideoCount,
        uploadFrequency
      );

      if (CacheManager.isCacheValid(cacheMetadata)) {
        console.log(`Using cached outlier analysis (tier: ${tier}, expires: ${cacheMetadata.cacheExpiresAt})`);
        
        // Fetch cached video analyses for this channel
        const maxVideosForTier = CacheManager.getVideoLimitForTier(tier);
        const cachedVideos = await prisma.videoAnalysis.findMany({
          where: { channelId: channelIdentifier },
          orderBy: { publishedAt: 'desc' },
          take: maxVideosForTier
        });

        if (cachedVideos.length > 0) {
          // Convert to VideoData format and analyze
          const videoData = cachedVideos.map(video => ({
            id: video.videoId,
            title: video.title,
            viewCount: Number(video.viewCount),
            duration: video.duration,
            isShort: video.isShort,
            publishedAt: video.publishedAt,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl || undefined,
          }));

          const longformVideos = videoData.filter(v => !v.isShort);
          const shortsVideos = videoData.filter(v => v.isShort);

          const analyzer = new PatternAnalyzer();
          const results = analyzer.analyze(longformVideos, shortsVideos);

          return NextResponse.json({
            channelId: channelIdentifier,
            fromCache: true,
            analyzedAt: cacheMetadata.lastFullFetch,
            tier,
            totalVideoCount,
            videosAnalyzed: videoData.length,
            ...results
          });
        }
      }
    }

    // Fetch fresh data
    console.log(`Fetching fresh video data for outlier analysis... (tier: ${tier})`);

    const videoAnalyzer = new VideoAnalyzer();
    const videosResult = await videoAnalyzer.fetchAllChannelVideos(channel.id, tier, totalVideoCount);

    if (videosResult.totalVideos === 0) {
      return NextResponse.json({ 
        error: 'No videos found for this channel',
        channelId: channel.id,
        totalVideos: 0
      }, { status: 200 });
    }

    // Store video analysis in database for caching
    console.log(`Storing ${videosResult.totalVideos} videos in database for caching...`);
    
    // Clear old analyses for this channel first
    await prisma.videoAnalysis.deleteMany({
      where: { channelId: channel.id }
    });

    // Store new video data
    const videoAnalysisData = videosResult.videos.map(video => ({
      channelId: channel.id,
      videoId: video.id,
      title: video.title,
      viewCount: BigInt(video.viewCount),
      duration: video.duration,
      isShort: video.isShort,
      publishedAt: video.publishedAt,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
    }));

    // Batch insert video analyses
    await prisma.videoAnalysis.createMany({
      data: videoAnalysisData
    });

    // Perform pattern analysis
    const analyzer = new PatternAnalyzer();
    const results = analyzer.analyze(videosResult.longformVideos, videosResult.shortsVideos);

    // Update outlier flags and multipliers in database
    console.log('Updating outlier flags in database...');
    
    // Update longform outliers
    for (const outlier of results.longform.outliers) {
      await prisma.videoAnalysis.updateMany({
        where: { 
          channelId: channel.id,
          videoId: outlier.id 
        },
        data: {
          isOutlierLongform: true,
          longformMultiplier: outlier.multiplier,
          extractedPatterns: JSON.stringify(outlier.patternTags)
        }
      });
    }

    // Update shorts outliers
    for (const outlier of results.shorts.outliers) {
      await prisma.videoAnalysis.updateMany({
        where: { 
          channelId: channel.id,
          videoId: outlier.id 
        },
        data: {
          isOutlierShorts: true,
          shortsMultiplier: outlier.multiplier,
          extractedPatterns: JSON.stringify(outlier.patternTags)
        }
      });
    }

    console.log(`Outlier analysis complete: ${results.longform.outliers.length} long-form outliers, ${results.shorts.outliers.length} shorts outliers`);

    // Update cache metadata
    await CacheManager.updateCacheAfterFetch(channel.id, videosResult.totalVideos, false);

    return NextResponse.json({
      channelId: channel.id,
      fromCache: false,
      analyzedAt: new Date(),
      tier,
      totalVideoCount,
      videosAnalyzed: videosResult.totalVideos,
      fetchedAll: videosResult.fetchedAll,
      ...results
    });

  } catch (error) {
    console.error('Outlier analysis error:', error);
    
    return NextResponse.json({
      error: 'Failed to analyze channel',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Health check endpoint
export async function POST(request: NextRequest) {
  try {
    const { channelId } = await request.json();
    
    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    // Get analysis status
    const analysisCount = await prisma.videoAnalysis.count({
      where: { channelId }
    });

    const lastAnalysis = await prisma.videoAnalysis.findFirst({
      where: { channelId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      channelId,
      videosAnalyzed: analysisCount,
      lastAnalyzed: lastAnalysis?.createdAt || null,
      status: analysisCount > 0 ? 'analyzed' : 'not_analyzed'
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
  }
}