import { PrismaClient } from '@prisma/client';
import { VideoAnalysis } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

interface KnowledgeBasePrinciple {
  category: string;
  principle: string;
  reference: string;
}

interface VideoMetrics {
  viewCount: number;
  duration: number;
  isShort: boolean;
  publishedAt: Date;
  title: string;
}

interface ChannelMetrics {
  uploadFrequency: number;
  avgViewsShorts: number;
  avgViewsLongform: number;
  totalVideos: number;
  niche: string;
}

export class IntelligentAnalysisEngine {
  private knowledgeBase: string = '';
  private knowledgePrinciples: KnowledgeBasePrinciple[] = [];

  async initialize() {
    // Load knowledge base
    const kbPath = path.join(process.cwd(), 'knowledge-base.txt');
    this.knowledgeBase = await fs.readFile(kbPath, 'utf-8');
    this.extractPrinciples();
  }

  private extractPrinciples() {
    // Extract key principles from knowledge base for quick reference
    const principles: KnowledgeBasePrinciple[] = [
      { category: 'hook', principle: 'First 1-3 seconds critical for retention', reference: 'Hook Engineering (First 1-3 Seconds Critical)' },
      { category: 'volume', principle: 'Volume trumps quality - 80/20 rule applies', reference: 'The 80/20 Distribution Rule' },
      { category: 'format', principle: 'Copy successful formats first, innovate later', reference: 'Copy First, Innovate Later Doctrine' },
      { category: 'niche', principle: '3-5 channels with good views = opportunity', reference: 'Market Validation Protocol' },
      { category: 'monetization', principle: 'High barrier to entry = sustainable revenue', reference: 'High-Barrier-to-Entry Evolution' },
      { category: 'production', principle: 'Under 2 hours per video for sustainability', reference: 'Quality-Volume-Sustainability (QVS) Framework' },
      { category: 'metrics', principle: 'Swipe rate 75-80%+ indicates effective hook', reference: 'Performance Metrics Focus' },
      { category: 'timeline', principle: '3 weeks minimum before judging results', reference: 'YouTube Shorts Timeline Expectations' },
    ];
    this.knowledgePrinciples = principles;
  }

  async analyzeChannel(channelId: string): Promise<void> {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { videoAnalysis: true }
    });

    if (!channel) return;

    // Clear old insights
    await prisma.intelligentInsight.deleteMany({
      where: { 
        channelId,
        expiresAt: { lt: new Date() }
      }
    });

    // Analyze different aspects
    await this.analyzeContentOutliers(channelId, channel.videoAnalysis);
    await this.analyzeChannelStrategy(channelId, channel);
    await this.generateRecommendations(channelId, channel);
    await this.analyzeNicheSaturation(channel.primaryNiche || 'general');
  }

  private async analyzeContentOutliers(channelId: string, videos: VideoAnalysis[]) {
    if (videos.length === 0) return;

    // Separate shorts and long-form
    const shorts = videos.filter(v => v.isShort);
    const longform = videos.filter(v => !v.isShort);

    // Calculate averages
    const avgViewsShorts = shorts.length > 0 
      ? shorts.reduce((acc, v) => acc + Number(v.viewCount), 0) / shorts.length 
      : 0;
    const avgViewsLongform = longform.length > 0 
      ? longform.reduce((acc, v) => acc + Number(v.viewCount), 0) / longform.length 
      : 0;

    // Identify outliers and explain why using knowledge base
    for (const video of videos) {
      const avgViews = video.isShort ? avgViewsShorts : avgViewsLongform;
      const multiplier = Number(video.viewCount) / avgViews;

      if (multiplier >= 3) {
        // This is an outlier - analyze why
        const insights = await this.explainOutlierSuccess(video, multiplier, avgViews);
        
        await prisma.intelligentInsight.create({
          data: {
            channelId,
            insightType: 'outlier',
            category: 'growth',
            title: `"${video.title}" outperformed by ${multiplier.toFixed(1)}x`,
            description: insights.explanation,
            knowledgeBaseRef: insights.kbRef,
            severity: multiplier >= 5 ? 'critical' : 'high',
            score: Math.min(multiplier * 20, 100),
            relatedVideoIds: JSON.stringify([video.videoId]),
            metrics: JSON.stringify({
              viewCount: Number(video.viewCount),
              avgViews,
              multiplier,
              factors: insights.factors
            }),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        });
      } else if (multiplier <= 0.2) {
        // Underperformer - analyze why
        const insights = await this.explainUnderperformance(video, multiplier, avgViews);
        
        await prisma.intelligentInsight.create({
          data: {
            channelId,
            insightType: 'warning',
            category: 'growth',
            title: `"${video.title}" underperformed at ${multiplier.toFixed(1)}x average`,
            description: insights.explanation,
            knowledgeBaseRef: insights.kbRef,
            severity: 'medium',
            score: 40,
            relatedVideoIds: JSON.stringify([video.videoId]),
            metrics: JSON.stringify({
              viewCount: Number(video.viewCount),
              avgViews,
              multiplier,
              issues: insights.issues
            }),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      }
    }
  }

  private async explainOutlierSuccess(video: VideoAnalysis, multiplier: number, avgViews: number) {
    const factors = [];
    let primaryKbRef = 'Hook Engineering (First 1-3 Seconds Critical)';
    
    // Analyze title for hook patterns
    const hookPatterns = ['?', 'how', 'why', 'secret', 'never', 'always', 'hack', 'trick'];
    const hasStrongHook = hookPatterns.some(pattern => 
      video.title.toLowerCase().includes(pattern)
    );
    
    if (hasStrongHook) {
      factors.push('Strong hook in title using question/curiosity pattern');
    }

    // Check if it's riding a trend (published recently with high views)
    const daysSincePublish = (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublish < 30 && multiplier > 5) {
      factors.push('Captured trending topic with first-mover advantage');
      primaryKbRef = 'Cross-Platform Arbitrage Identification';
    }

    // Check format alignment
    if (video.isShort && multiplier > 3) {
      factors.push('Optimized for short-form algorithm with high swipe-through potential');
      primaryKbRef = 'Spam Account Success Pattern';
    }

    const explanation = `This video succeeded due to: ${factors.join(', ')}. 
    According to the knowledge base principle "${primaryKbRef}", this aligns with proven success patterns. 
    The ${multiplier.toFixed(1)}x performance suggests effective implementation of viral mechanics.`;

    return {
      explanation,
      kbRef: primaryKbRef,
      factors
    };
  }

  private async explainUnderperformance(video: VideoAnalysis, multiplier: number, avgViews: number) {
    const issues = [];
    let primaryKbRef = 'Hook Engineering (First 1-3 Seconds Critical)';
    
    // Weak title analysis
    if (video.title.length > 60) {
      issues.push('Title too long for mobile optimization');
    }
    
    if (!video.title.match(/[A-Z]/)) {
      issues.push('No capitalization in title reduces click-through rate');
    }

    // Check if it's in oversaturated format
    const commonWords = ['vlog', 'day in', 'morning routine', 'haul'];
    const hasOversaturatedFormat = commonWords.some(word => 
      video.title.toLowerCase().includes(word)
    );
    
    if (hasOversaturatedFormat) {
      issues.push('Uses oversaturated format with high competition');
      primaryKbRef = 'Market Validation Protocol';
    }

    const explanation = `This video underperformed due to: ${issues.join(', ')}. 
    The knowledge base warns about "${primaryKbRef}" - this video violates key principles. 
    Consider applying the "Copy First, Innovate Later" doctrine to proven formats.`;

    return {
      explanation,
      kbRef: primaryKbRef,
      issues
    };
  }

  private async analyzeChannelStrategy(channelId: string, channel: any) {
    const uploadFreq = channel.uploadFrequencyPerWeek || 0;
    
    // Check upload frequency against QVS framework
    if (uploadFreq < 7) {
      await prisma.intelligentInsight.create({
        data: {
          channelId,
          insightType: 'opportunity',
          category: 'growth',
          title: 'Increase upload frequency for algorithm boost',
          description: `Current upload frequency: ${uploadFreq.toFixed(1)}/week. The knowledge base emphasizes "Volume trumps quality" - channels posting daily (7+/week) see 3-5x more total views. The 80/20 rule means more uploads = more chances for viral hits.`,
          knowledgeBaseRef: 'The 80/20 Distribution Rule',
          severity: 'high',
          score: 85,
          actionable: true,
          metrics: JSON.stringify({
            currentFrequency: uploadFreq,
            recommendedFrequency: 7,
            potentialViewIncrease: '3-5x'
          }),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    // Check monetization status
    if (!channel.isMonetized && channel.subscriberCount >= 1000) {
      await prisma.intelligentInsight.create({
        data: {
          channelId,
          insightType: 'opportunity',
          category: 'monetization',
          title: 'Channel eligible for monetization',
          description: 'Channel meets subscriber requirements. Focus on watch time and content compliance to enable monetization. Ensure all content passes transformation requirements to avoid reused content flags.',
          knowledgeBaseRef: 'Platform Policy Navigation (Critical Business Risk)',
          severity: 'critical',
          score: 95,
          actionable: true,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  private async generateRecommendations(channelId: string, channel: any) {
    const recommendations = [];

    // Volume optimization
    if (channel.uploadFrequencyPerWeek < 7) {
      recommendations.push({
        channelId,
        priority: 1,
        recommendationType: 'strategy',
        title: 'Implement Daily Upload Schedule',
        description: 'Create a content production system targeting 1 video daily. Use AI tools (Gemini for scripts, ElevenLabs for voiceover) to reduce production time to under 2 hours per video.',
        expectedImpact: '3-5x total channel views within 30 days',
        implementationSteps: JSON.stringify([
          'Set up AI tool stack (Gemini, ElevenLabs, CapCut)',
          'Create 20+ content templates for your niche',
          'Batch produce 7 videos every Sunday',
          'Schedule daily releases at optimal times'
        ]),
        requiredResources: JSON.stringify({
          tools: ['Gemini', 'ElevenLabs', 'CapCut'],
          time: '2 hours/day',
          cost: '$50-100/month for AI tools'
        }),
        difficultyLevel: 'medium',
        timeToImplement: '1 week setup',
        knowledgeBaseRef: 'Quality-Volume-Sustainability (QVS) Framework',
        potentialScore: 85
      });
    }

    // Format diversification
    const videos = await prisma.videoAnalysis.findMany({
      where: { channelId },
      orderBy: { viewCount: 'desc' },
      take: 10
    });

    const hasOnlyShorts = videos.every(v => v.isShort);
    if (hasOnlyShorts) {
      recommendations.push({
        channelId,
        priority: 2,
        recommendationType: 'content',
        title: 'Test Long-form Content for Higher RPM',
        description: 'While shorts drive views, long-form content has 10-50x higher RPM. Test 8-10 minute videos on your best-performing topics.',
        expectedImpact: '10x revenue per view on successful videos',
        implementationSteps: JSON.stringify([
          'Identify top 3 performing shorts topics',
          'Expand each into 8-10 minute deep-dive',
          'Maintain same hook style from shorts',
          'Cross-promote in shorts'
        ]),
        difficultyLevel: 'medium',
        timeToImplement: '2-3 days per video',
        knowledgeBaseRef: 'Monetization Optimization',
        potentialScore: 75
      });
    }

    // Cross-platform arbitrage
    recommendations.push({
      channelId,
      priority: 3,
      recommendationType: 'strategy',
      title: 'Implement Cross-Platform Content Arbitrage',
      description: 'Monitor trending formats on TikTok daily and quickly adapt to YouTube Shorts. First-mover advantage can yield 10-100x normal views.',
      expectedImpact: '1-2 viral videos per month (1M+ views)',
      implementationSteps: JSON.stringify([
        'Create fresh TikTok account for research',
        'Spend 30 min daily identifying trends',
        'Test trending formats within 24 hours',
        'Track which trends transfer successfully'
      ]),
      difficultyLevel: 'easy',
      timeToImplement: '30 min daily',
      knowledgeBaseRef: 'Cross-Platform Arbitrage Identification',
      potentialScore: 90
    });

    // Save all recommendations
    for (const rec of recommendations) {
      await prisma.contentRecommendation.create({ data: rec });
    }
  }

  private async analyzeNicheSaturation(niche: string) {
    // Check if we already have recent analysis
    const existingAnalysis = await prisma.nicheAnalysis.findUnique({
      where: { niche },
    });

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (existingAnalysis && existingAnalysis.lastUpdated > oneWeekAgo) {
      return; // Use existing analysis
    }

    // Count competitors in niche
    const competitors = await prisma.channel.count({
      where: { primaryNiche: niche }
    });

    // Calculate average performance
    const channelStats = await prisma.channel.findMany({
      where: { primaryNiche: niche },
      include: {
        videoAnalysis: {
          orderBy: { publishedAt: 'desc' },
          take: 10
        }
      }
    });

    let totalViews = 0;
    let videoCount = 0;
    const topPerformers: string[] = [];

    for (const channel of channelStats) {
      const channelViews = channel.videoAnalysis.reduce((sum, v) => sum + Number(v.viewCount), 0);
      if (channelViews > 1000000) {
        topPerformers.push(channel.id);
      }
      totalViews += channelViews;
      videoCount += channel.videoAnalysis.length;
    }

    const avgViewsPerVideo = videoCount > 0 ? Math.floor(totalViews / videoCount) : 0;

    // Determine saturation level
    let saturationLevel = 50; // Base level
    if (competitors > 20 && topPerformers.length < 5) {
      saturationLevel = 90; // Oversaturated
    } else if (competitors < 5 && topPerformers.length >= 2) {
      saturationLevel = 20; // Good opportunity
    }

    // Determine entry barrier based on average performance
    let entryBarrier = 'medium';
    if (avgViewsPerVideo > 100000) entryBarrier = 'high';
    else if (avgViewsPerVideo < 10000) entryBarrier = 'low';

    await prisma.nicheAnalysis.upsert({
      where: { niche },
      update: {
        saturationLevel,
        competitorCount: competitors,
        avgViewsPerVideo,
        topPerformers: JSON.stringify(topPerformers),
        entryBarrier,
        monetizationPotential: 100 - saturationLevel,
        recommendedFormats: JSON.stringify([
          'Educational explainers',
          'Quick tips/hacks',
          'Reaction content',
          'Comparison videos'
        ]),
        lastUpdated: new Date()
      },
      create: {
        niche,
        saturationLevel,
        competitorCount: competitors,
        avgViewsPerVideo,
        topPerformers: JSON.stringify(topPerformers),
        entryBarrier,
        monetizationPotential: 100 - saturationLevel,
        recommendedFormats: JSON.stringify([
          'Educational explainers',
          'Quick tips/hacks',
          'Reaction content',
          'Comparison videos'
        ])
      }
    });
  }

  async getChannelInsights(channelId: string) {
    const insights = await prisma.intelligentInsight.findMany({
      where: { 
        channelId,
        expiresAt: { gt: new Date() }
      },
      orderBy: { score: 'desc' }
    });

    const recommendations = await prisma.contentRecommendation.findMany({
      where: { 
        channelId,
        status: 'pending'
      },
      orderBy: { priority: 'asc' }
    });

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: { videoAnalysis: true }
    });

    const nicheAnalysis = channel?.primaryNiche 
      ? await prisma.nicheAnalysis.findUnique({
          where: { niche: channel.primaryNiche }
        })
      : null;

    return {
      insights,
      recommendations,
      nicheAnalysis,
      summary: this.generateExecutiveSummary(insights, recommendations, nicheAnalysis)
    };
  }

  private generateExecutiveSummary(insights: any[], recommendations: any[], nicheAnalysis: any) {
    const criticalInsights = insights.filter(i => i.severity === 'critical');
    const topRecommendation = recommendations[0];
    
    let summary = 'Channel Analysis Summary:\n\n';
    
    if (criticalInsights.length > 0) {
      summary += `🚨 Critical Findings: ${criticalInsights.length} issues requiring immediate attention\n`;
    }
    
    if (topRecommendation) {
      summary += `📈 Top Opportunity: ${topRecommendation.title} - ${topRecommendation.expectedImpact}\n`;
    }
    
    if (nicheAnalysis) {
      summary += `🎯 Niche Status: ${nicheAnalysis.saturationLevel < 50 ? 'Good opportunity' : 'Highly competitive'} `;
      summary += `(${nicheAnalysis.competitorCount} competitors, ${nicheAnalysis.avgViewsPerVideo.toLocaleString()} avg views)\n`;
    }
    
    return summary;
  }
}