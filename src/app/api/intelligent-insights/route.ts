import { NextRequest, NextResponse } from 'next/server';
import { IntelligentAnalysisEngine } from '@/lib/intelligentAnalysis';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const channelId = searchParams.get('channelId');

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    const engine = new IntelligentAnalysisEngine();
    await engine.initialize();

    // Get existing insights or trigger new analysis if needed
    const insights = await engine.getChannelInsights(channelId);

    return NextResponse.json({
      success: true,
      data: insights,
      meta: {
        timestamp: new Date().toISOString(),
        analysisVersion: '1.0.0'
      }
    });
  } catch (error) {
    console.error('Intelligent Insights API Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve insights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { channelId } = await request.json();

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    const engine = new IntelligentAnalysisEngine();
    await engine.initialize();

    // Trigger fresh analysis
    await engine.analyzeChannel(channelId);
    
    // Return new insights
    const insights = await engine.getChannelInsights(channelId);

    return NextResponse.json({
      success: true,
      data: insights,
      meta: {
        timestamp: new Date().toISOString(),
        analysisType: 'fresh',
        analysisVersion: '1.0.0'
      }
    });
  } catch (error) {
    console.error('Intelligent Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze channel' },
      { status: 500 }
    );
  }
}