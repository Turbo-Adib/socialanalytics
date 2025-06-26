import { VideoData } from '@/lib/videoAnalyzer';
import fs from 'fs/promises';
import path from 'path';

interface KnowledgeBasedSuccessFactors {
  hookStrategies: string[];
  formatOptimization: string[];
  nichePositioning: string[];
  productionEfficiency: string[];
  algorithmAlignment: string[];
}

interface KnowledgeBasedRecommendations {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
  strategicAdvantage: string[];
}

interface CombinedInsight {
  category: string;
  insight: string;
  kbPrinciple: string;
  actionability: 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short-term' | 'long-term';
  expectedImpact: string;
  implementation: string[];
}

export class KnowledgeBasedAnalyzer {
  private knowledgeBase: string = '';

  async initialize() {
    const kbPath = path.join(process.cwd(), 'knowledge-base.txt');
    this.knowledgeBase = await fs.readFile(kbPath, 'utf-8');
  }

  analyzeSuccessFactorsWithKB(videos: VideoData[], topic: string): KnowledgeBasedSuccessFactors {
    const outliers = videos.filter(v => this.calculateMultiplier(v, videos) > 3);
    
    return {
      hookStrategies: this.analyzeHookStrategies(outliers),
      formatOptimization: this.analyzeFormatOptimization(outliers, topic),
      nichePositioning: this.analyzeNichePositioning(videos, topic),
      productionEfficiency: this.analyzeProductionEfficiency(videos),
      algorithmAlignment: this.analyzeAlgorithmAlignment(outliers)
    };
  }

  private analyzeHookStrategies(outliers: VideoData[]): string[] {
    const strategies = [];
    
    // Analyze title patterns based on KB principles
    const questionHooks = outliers.filter(v => 
      v.title.toLowerCase().includes('?') || 
      v.title.toLowerCase().startsWith('how') ||
      v.title.toLowerCase().startsWith('why') ||
      v.title.toLowerCase().startsWith('what')
    );
    
    if (questionHooks.length > outliers.length * 0.3) {
      strategies.push('Question-based hooks drive 3x higher engagement (Knowledge Base: Hook Engineering)');
    }

    const contrarian = outliers.filter(v => 
      v.title.toLowerCase().includes('never') ||
      v.title.toLowerCase().includes('wrong') ||
      v.title.toLowerCase().includes('myth') ||
      v.title.toLowerCase().includes('truth')
    );
    
    if (contrarian.length > 0) {
      strategies.push('Contrarian claims create pattern interrupts (Knowledge Base: Visual Hooks)');
    }

    const secrets = outliers.filter(v => 
      v.title.toLowerCase().includes('secret') ||
      v.title.toLowerCase().includes('hidden') ||
      v.title.toLowerCase().includes('unknown')
    );
    
    if (secrets.length > 0) {
      strategies.push('Teased secrets maintain retention throughout video (Knowledge Base: Retention Tactics)');
    }

    // Default KB-based strategies if no specific patterns found
    if (strategies.length === 0) {
      strategies.push(
        'Fast-paced editing removes dead time for higher retention (Knowledge Base: Retention Tactics)',
        'Visual contrasts and movement create pattern interrupts (Knowledge Base: Visual Hooks)',
        'Strong emotional triggers in first 3 seconds critical for swipe rate (Knowledge Base: Hook Engineering)'
      );
    }

    return strategies;
  }

  private analyzeFormatOptimization(outliers: VideoData[], topic: string): string[] {
    const formats = [];
    
    // Analyze duration patterns
    const avgDuration = outliers.reduce((sum, v) => sum + (this.parseDuration(v.duration) || 0), 0) / outliers.length;
    
    if (avgDuration < 60) {
      formats.push('Short-form format maximizes algorithm distribution (Knowledge Base: Spam Account Success Pattern)');
      formats.push('High volume production enables 80/20 viral distribution (Knowledge Base: The 80/20 Distribution Rule)');
    } else {
      formats.push('Long-form content achieves 10-50x higher RPM rates (Knowledge Base: Monetization Optimization)');
      formats.push('Extended content allows comprehensive value delivery (Knowledge Base: High-Barrier-to-Entry Evolution)');
    }

    // Analyze trending alignment
    const recentVideos = outliers.filter(v => {
      const publishDate = new Date(v.publishedAt);
      const monthsAgo = (Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo < 3;
    });

    if (recentVideos.length > outliers.length * 0.6) {
      formats.push('First-mover advantage on trending topics (Knowledge Base: Cross-Platform Arbitrage Identification)');
    }

    return formats;
  }

  private analyzeNichePositioning(videos: VideoData[], topic: string): string[] {
    const positioning = [];
    
    // Check niche focus
    const topicWords = topic.toLowerCase().split(' ');
    const focusedVideos = videos.filter(v => 
      topicWords.some(word => v.title.toLowerCase().includes(word))
    );
    
    const focusPercentage = focusedVideos.length / videos.length;
    
    if (focusPercentage > 0.7) {
      positioning.push('High niche specialization builds authority and trust (Knowledge Base: Personal Brand Development)');
      positioning.push('Consistent topic focus enables audience education and loyalty (Knowledge Base: The CEO Framework)');
    } else if (focusPercentage > 0.4) {
      positioning.push('Balanced content mix prevents algorithm pigeonholing (Knowledge Base: Format Adaptation Strategy)');
      positioning.push('Cross-niche adaptation expands total addressable audience (Knowledge Base: Cross-Niche Adaptation)');
    } else {
      positioning.push('Diversified content reduces dependency on single algorithm preference (Knowledge Base: Multi-Language Market Expansion)');
      positioning.push('Broad appeal strategy captures multiple audience segments (Knowledge Base: Cross-Era Recycling)');
    }

    return positioning;
  }

  private analyzeProductionEfficiency(videos: VideoData[]): string[] {
    const efficiency = [];
    
    // Analyze upload frequency
    const uploads = videos.map(v => new Date(v.publishedAt)).sort((a, b) => b.getTime() - a.getTime());
    if (uploads.length > 1) {
      const avgDaysBetween = uploads.slice(0, -1).reduce((sum, date, i) => {
        return sum + (date.getTime() - uploads[i + 1].getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / (uploads.length - 1);

      if (avgDaysBetween <= 1.5) {
        efficiency.push('Daily posting frequency leverages volume-over-quality principle (Knowledge Base: Quality-Volume-Sustainability Framework)');
        efficiency.push('Systematic production enables sustainable scaling (Knowledge Base: AI-Powered Production System)');
      } else if (avgDaysBetween <= 7) {
        efficiency.push('Weekly consistency maintains audience retention (Knowledge Base: YouTube Shorts Timeline Expectations)');
      } else {
        efficiency.push('Inconsistent upload schedule limits algorithm promotion (Knowledge Base: Volume trumps quality principle)');
      }
    }

    efficiency.push('Batch production reduces per-video time investment (Knowledge Base: Systematization Requirements)');
    efficiency.push('AI tool integration minimizes manual editing overhead (Knowledge Base: Essential AI Tool Stack)');

    return efficiency;
  }

  private analyzeAlgorithmAlignment(outliers: VideoData[]): string[] {
    const alignment = [];
    
    // Check for algorithm-friendly patterns
    const shortTitles = outliers.filter(v => v.title.length <= 60);
    if (shortTitles.length > outliers.length * 0.7) {
      alignment.push('Concise titles optimize for mobile viewing experience (Knowledge Base: Performance Metrics Focus)');
    }

    const emotionalTitles = outliers.filter(v => {
      const emotional = ['amazing', 'shocking', 'incredible', 'unbelievable', 'insane', 'crazy'];
      return emotional.some(word => v.title.toLowerCase().includes(word));
    });
    
    if (emotionalTitles.length > 0) {
      alignment.push('Emotional language triggers increase click-through rates (Knowledge Base: Verbal/Text Hooks)');
    }

    alignment.push('Fast-paced content matches platform consumption patterns (Knowledge Base: Retention Tactics)');
    alignment.push('Platform-specific optimization maximizes discovery potential (Knowledge Base: TikTok Validation Method)');

    return alignment;
  }

  generateCombinedInsights(videos: VideoData[], successFactors: KnowledgeBasedSuccessFactors): CombinedInsight[] {
    const insights: CombinedInsight[] = [];

    // Hook optimization insight
    insights.push({
      category: 'Hook Optimization',
      insight: 'First 3 seconds determine 75%+ of video success through swipe rate optimization',
      kbPrinciple: 'Hook Engineering (First 1-3 Seconds Critical)',
      actionability: 'high',
      timeframe: 'immediate',
      expectedImpact: '2-3x retention improvement',
      implementation: [
        'Start videos with strong question or contrarian statement',
        'Use pattern interrupts (fast cuts, visual contrasts)',
        'Test multiple hook variations for same content',
        'Remove all introductory fluff and jump directly to value'
      ]
    });

    // Volume strategy insight
    insights.push({
      category: 'Volume Strategy',
      insight: 'Daily posting leverages 80/20 rule where 20% of videos generate 80% of results',
      kbPrinciple: 'The 80/20 Distribution Rule',
      actionability: 'high',
      timeframe: 'short-term',
      expectedImpact: '3-5x total channel views',
      implementation: [
        'Establish daily upload schedule using batch production',
        'Focus on volume over perfectionism initially',
        'Use AI tools to reduce production time to under 2 hours',
        'Create content templates for systematic reproduction'
      ]
    });

    // Format adaptation insight
    insights.push({
      category: 'Format Intelligence',
      insight: 'Copy successful formats first, then innovate to create competitive moats',
      kbPrinciple: 'Copy First, Innovate Later Doctrine',
      actionability: 'high',
      timeframe: 'immediate',
      expectedImpact: '10x faster market entry',
      implementation: [
        'Monitor trending formats daily across platforms',
        'Implement successful formats within 24 hours',
        'Add unique elements once traction is gained',
        'Build defensible advantages through specialization'
      ]
    });

    // Niche positioning insight
    insights.push({
      category: 'Market Positioning',
      insight: 'Strategic niche selection between oversaturation and opportunity gaps',
      kbPrinciple: 'Market Validation Protocol',
      actionability: 'medium',
      timeframe: 'short-term',
      expectedImpact: '5-10x reduced competition',
      implementation: [
        'Analyze competitor density in target niches',
        'Identify 3-5 successful channels as opportunity signal',
        'Avoid niches with 20+ channels and few winners',
        'Use cross-platform arbitrage for first-mover advantage'
      ]
    });

    // Production efficiency insight
    insights.push({
      category: 'Production System',
      insight: 'Sustainable production requires systematic workflows and AI assistance',
      kbPrinciple: 'Quality-Volume-Sustainability (QVS) Framework',
      actionability: 'medium',
      timeframe: 'short-term',
      expectedImpact: '50-70% time reduction',
      implementation: [
        'Build curated asset libraries for quick access',
        'Implement AI tools for scripts, voiceovers, editing',
        'Create production presets and templates',
        'Batch similar content types in single sessions'
      ]
    });

    // Algorithm optimization insight
    insights.push({
      category: 'Algorithm Mastery',
      insight: 'Platform algorithms reward consistent engagement patterns and retention metrics',
      kbPrinciple: 'Performance Metrics Focus',
      actionability: 'high',
      timeframe: 'immediate',
      expectedImpact: '2-4x algorithm distribution',
      implementation: [
        'Optimize for 75-80%+ swipe-through rates',
        'Target 150%+ watch-through for 20s videos',
        'Use captions for muted viewing optimization',
        'Implement fast-paced editing with sound effects'
      ]
    });

    // Monetization strategy insight
    insights.push({
      category: 'Revenue Optimization',
      insight: 'Strategic format mixing maximizes both reach (shorts) and revenue (long-form)',
      kbPrinciple: 'Monetization Optimization',
      actionability: 'medium',
      timeframe: 'long-term',
      expectedImpact: '10-50x revenue per view',
      implementation: [
        'Use shorts for audience building and discovery',
        'Create long-form deep-dives on successful topics',
        'Maintain 70/30 split favoring shorts for growth',
        'Cross-promote long-form content in shorts'
      ]
    });

    return insights;
  }

  private calculateMultiplier(video: VideoData, allVideos: VideoData[]): number {
    const avgViews = allVideos.reduce((sum, v) => sum + v.viewCount, 0) / allVideos.length;
    return video.viewCount / avgViews;
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration format (PT4M13S) to seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }
}