import { NextRequest, NextResponse } from 'next/server';
import { sampleMidTierChannel } from '@/data/sampleChannelData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const timeRange = searchParams.get('timeRange') || '30';
    const contentType = searchParams.get('contentType') || 'all';

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    console.log(`Demo analysis requested for: ${url}`);

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo, we always return sample data with a note
    let filteredData = { 
      ...sampleMidTierChannel,
      demoNote: 'This is sample data. Sign up for a free account to analyze real channels.',
      requestedUrl: url
    };
    
    if (contentType === 'shorts') {
      filteredData.recentVideos = filteredData.recentVideos.filter(video => video.isShort);
      filteredData.currentStats.longFormViews = 0;
    } else if (contentType === 'longform') {
      filteredData.recentVideos = filteredData.recentVideos.filter(video => !video.isShort);
      filteredData.currentStats.shortsViews = 0;
    }

    // Adjust data based on time range
    if (timeRange === '7') {
      // Show last week's data - reduce views by ~70%
      filteredData.currentStats.totalViews = Math.floor(filteredData.currentStats.totalViews * 0.3);
      filteredData.currentStats.longFormViews = Math.floor(filteredData.currentStats.longFormViews * 0.3);
      filteredData.currentStats.shortsViews = Math.floor(filteredData.currentStats.shortsViews * 0.3);
      
      // Show only recent videos from last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      filteredData.recentVideos = filteredData.recentVideos.filter(video => 
        new Date(video.publishedAt) > sevenDaysAgo
      );
    } else if (timeRange === '90') {
      // Show 90 days data - increase views by ~50%
      filteredData.currentStats.totalViews = Math.floor(filteredData.currentStats.totalViews * 1.5);
      filteredData.currentStats.longFormViews = Math.floor(filteredData.currentStats.longFormViews * 1.5);
      filteredData.currentStats.shortsViews = Math.floor(filteredData.currentStats.shortsViews * 1.5);
    }

    // Transform to MinimalAnalytics format expected by MinimalDashboard
    const minimalAnalytics = {
      overview: {
        id: filteredData.channel.id,
        title: filteredData.channel.title,
        description: filteredData.channel.description,
        thumbnailUrl: filteredData.channel.thumbnailUrl,
        subscriberCount: filteredData.channel.subscriberCount,
        totalViews: filteredData.channel.totalViews,
        videoCount: filteredData.channel.videoCount,
        estimatedAge: {
          years: 3,
          months: 6
        },
        monthlyRevenue: {
          min: 500,
          max: 2000,
          estimated: 1200
        },
        niche: filteredData.channel.niche
      },
      recentPerformance: {
        averageViews: Math.floor(filteredData.currentStats.totalViews / filteredData.recentVideos.length),
        totalVideos: filteredData.recentVideos.length,
        bestVideo: filteredData.recentVideos.reduce((best, video) => 
          video.views > best.views ? video : best, filteredData.recentVideos[0]),
        worstVideo: filteredData.recentVideos.reduce((worst, video) => 
          video.views < worst.views ? video : worst, filteredData.recentVideos[0]),
        uploadFrequency: filteredData.currentStats.uploadFrequency,
        contentMix: {
          longFormPercentage: Math.round((filteredData.currentStats.longFormViews / filteredData.currentStats.totalViews) * 100),
          shortsPercentage: Math.round((filteredData.currentStats.shortsViews / filteredData.currentStats.totalViews) * 100)
        },
        revenueEstimate: {
          monthly: 1200
        }
      },
      projections: {
        subscribers: {
          nextMilestone: Math.ceil(filteredData.channel.subscriberCount / 100000) * 100000,
          estimatedDays: 180,
          growthRate: 5000
        },
        revenue: {
          nextMonth: filteredData.projections.nextMonth.revenue,
          nextYear: filteredData.projections.nextYear.revenue
        }
      },
      socialInsights: [
        "Focus on mobile-first content strategy",
        "Engage more with your community",
        "Consider diversifying content types"
      ],
      demoNote: filteredData.demoNote,
      requestedUrl: filteredData.requestedUrl
    };

    return NextResponse.json(minimalAnalytics);
  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json({ error: 'Failed to load demo data' }, { status: 500 });
  }
}