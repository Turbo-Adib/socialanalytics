import { NextRequest, NextResponse } from 'next/server';
import { sampleMidTierChannel } from '@/data/sampleChannelData';
import { generateImprovedChartData } from '@/utils/improvedChartData';

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

    // Convert recentVideos to AccurateVideoData format for generateImprovedChartData
    const accurateVideos = filteredData.recentVideos.map(video => ({
      id: video.id,
      title: video.title,
      viewCount: video.views,
      publishedAt: video.publishedAt,
      duration: video.isShort ? 30 : 600, // Approximate duration
      isShort: video.isShort,
      thumbnailUrl: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
      channelId: filteredData.channel.id,
      description: ''
    }));
    
    // Generate improved chart data for better visualization
    const improvedChartData = await generateImprovedChartData(accurateVideos, filteredData.channel.niche || 'General');
    
    // Return the data in ChannelAnalytics format expected by Dashboard component
    return NextResponse.json({
      ...filteredData,
      improvedChartData
    });
  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json({ error: 'Failed to load demo data' }, { status: 500 });
  }
}