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

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter data based on content type if needed
    let filteredData = { ...sampleMidTierChannel };
    
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

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json({ error: 'Failed to load demo data' }, { status: 500 });
  }
}