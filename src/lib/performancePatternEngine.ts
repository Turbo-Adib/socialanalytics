import { EnhancedVideoData, EnhancedChannelData } from './enhancedYouTubeAPI';

export interface SuccessFactor {
  factor: string;
  impact: number; // Performance multiplier effect
  confidence: 'high' | 'medium' | 'low';
  evidence: {
    positiveExamples: Array<{
      video: EnhancedVideoData;
      multiplier: number;
    }>;
    negativeExamples: Array<{
      video: EnhancedVideoData;
      multiplier: number;
    }>;
  };
  actionableInsight: string;
  frequency: number; // How often this factor appears
}

export interface PerformancePattern {
  pattern: string;
  description: string;
  avgPerformanceBoost: number;
  consistency: number; // How reliable this pattern is
  applicability: 'universal' | 'niche_specific' | 'audience_dependent';
  examples: Array<{
    title: string;
    views: number;
    patternStrength: number;
  }>;
  recommendedUsage: string;
}

export interface ContentOptimizationOpportunity {
  opportunity: string;
  potentialImpact: number; // Estimated view increase percentage
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: 'immediate' | 'short_term' | 'long_term';
  specificActions: string[];
  successMetrics: string[];
  riskFactors: string[];
}

export interface AudienceEngagementPattern {
  engagementType: string;
  effectivenessScore: number;
  audienceResponse: {
    engagement: 'high' | 'medium' | 'low';
    retention: 'high' | 'medium' | 'low';
    sharing: 'high' | 'medium' | 'low';
  };
  implementationStrategy: string;
  measurableOutcomes: string[];
}

export interface PerformanceAnalysisResult {
  successFactors: SuccessFactor[];
  performancePatterns: PerformancePattern[];
  optimizationOpportunities: ContentOptimizationOpportunity[];
  engagementPatterns: AudienceEngagementPattern[];
  channelSpecificInsights: {
    uniqueSuccessDrivers: string[];
    audiencePreferences: string[];
    contentGaps: string[];
    growthPotential: number;
  };
  competitiveAdvantages: string[];
  performanceScore: number; // Overall channel performance efficiency
}

export class PerformancePatternEngine {

  /**
   * Analyze performance patterns and identify success factors
   */
  analyzePerformancePatterns(channelData: EnhancedChannelData): PerformanceAnalysisResult {
    const videos = channelData.recentVideos.filter(v => v.viewCount > 0);
    const avgViews = this.calculateAverageViews(videos);
    const topPerformers = this.getTopPerformers(videos, 0.2);
    const bottomPerformers = this.getBottomPerformers(videos, 0.2);

    return {
      successFactors: this.identifySuccessFactors(videos, avgViews, topPerformers, bottomPerformers),
      performancePatterns: this.analyzeContentPatterns(videos, avgViews),
      optimizationOpportunities: this.identifyOptimizationOpportunities(channelData, videos, avgViews),
      engagementPatterns: this.analyzeEngagementPatterns(videos, topPerformers),
      channelSpecificInsights: this.generateChannelSpecificInsights(channelData, videos, topPerformers),
      competitiveAdvantages: this.identifyCompetitiveAdvantages(channelData, topPerformers),
      performanceScore: this.calculatePerformanceScore(channelData, videos, avgViews)
    };
  }

  /**
   * Identify key success factors based on performance data
   */
  private identifySuccessFactors(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor[] {
    const factors: SuccessFactor[] = [];

    // Question titles factor
    const questionFactor = this.analyzeQuestionTitleFactor(videos, avgViews, topPerformers, bottomPerformers);
    if (questionFactor) factors.push(questionFactor);

    // Personal pronouns factor
    const personalFactor = this.analyzePersonalPronounFactor(videos, avgViews, topPerformers, bottomPerformers);
    if (personalFactor) factors.push(personalFactor);

    // Interactive content factor
    const interactiveFactor = this.analyzeInteractiveContentFactor(videos, avgViews, topPerformers, bottomPerformers);
    if (interactiveFactor) factors.push(interactiveFactor);

    // Honest/authentic language factor
    const authenticityFactor = this.analyzeAuthenticityFactor(videos, avgViews, topPerformers, bottomPerformers);
    if (authenticityFactor) factors.push(authenticityFactor);

    // Optimal title length factor
    const lengthFactor = this.analyzeTitleLengthFactor(videos, avgViews, topPerformers, bottomPerformers);
    if (lengthFactor) factors.push(lengthFactor);

    // Emotional triggers factor
    const emotionalFactor = this.analyzeEmotionalTriggerFactor(videos, avgViews, topPerformers, bottomPerformers);
    if (emotionalFactor) factors.push(emotionalFactor);

    // Niche-specific terminology factor
    const nicheFactor = this.analyzeNicheTerminologyFactor(videos, avgViews, topPerformers, bottomPerformers);
    if (nicheFactor) factors.push(nicheFactor);

    return factors
      .filter(f => f.confidence !== 'low' || f.impact > 1.3)
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 7);
  }

  /**
   * Analyze question title success factor
   */
  private analyzeQuestionTitleFactor(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor | null {
    const questionVideos = videos.filter(v => v.title.includes('?'));
    if (questionVideos.length < 2) return null;

    const questionAvgViews = questionVideos.reduce((sum, v) => sum + v.viewCount, 0) / questionVideos.length;
    const impact = questionAvgViews / avgViews;

    const positiveExamples = questionVideos
      .filter(v => v.viewCount > avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 3);

    const negativeExamples = questionVideos
      .filter(v => v.viewCount < avgViews * 0.7)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(0, 2);

    return {
      factor: 'Question-Based Titles',
      impact: Math.round(impact * 100) / 100,
      confidence: this.calculateConfidence(questionVideos.length, videos.length, impact),
      evidence: { positiveExamples, negativeExamples },
      actionableInsight: this.generateQuestionInsight(positiveExamples, topPerformers),
      frequency: questionVideos.length
    };
  }

  /**
   * Analyze personal pronoun usage factor
   */
  private analyzePersonalPronounFactor(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor | null {
    const personalVideos = videos.filter(v => /\b(you|your|my|i|me)\b/i.test(v.title));
    if (personalVideos.length < 3) return null;

    const personalAvgViews = personalVideos.reduce((sum, v) => sum + v.viewCount, 0) / personalVideos.length;
    const impact = personalAvgViews / avgViews;

    const positiveExamples = personalVideos
      .filter(v => v.viewCount > avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 3);

    const negativeExamples = personalVideos
      .filter(v => v.viewCount < avgViews * 0.7)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(0, 2);

    return {
      factor: 'Personal Address (You/Your/My)',
      impact: Math.round(impact * 100) / 100,
      confidence: this.calculateConfidence(personalVideos.length, videos.length, impact),
      evidence: { positiveExamples, negativeExamples },
      actionableInsight: this.generatePersonalPronounInsight(positiveExamples, personalVideos),
      frequency: personalVideos.length
    };
  }

  /**
   * Analyze interactive content factor
   */
  private analyzeInteractiveContentFactor(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor | null {
    const interactiveVideos = videos.filter(v => 
      /\b(rating|rate|ranking|review|subscribers|community|react)\b/i.test(v.title)
    );
    if (interactiveVideos.length < 2) return null;

    const interactiveAvgViews = interactiveVideos.reduce((sum, v) => sum + v.viewCount, 0) / interactiveVideos.length;
    const impact = interactiveAvgViews / avgViews;

    const positiveExamples = interactiveVideos
      .filter(v => v.viewCount > avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 3);

    const negativeExamples = interactiveVideos
      .filter(v => v.viewCount < avgViews * 0.7)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(0, 2);

    return {
      factor: 'Interactive Community Content',
      impact: Math.round(impact * 100) / 100,
      confidence: this.calculateConfidence(interactiveVideos.length, videos.length, impact),
      evidence: { positiveExamples, negativeExamples },
      actionableInsight: this.generateInteractiveInsight(positiveExamples, topPerformers),
      frequency: interactiveVideos.length
    };
  }

  /**
   * Analyze authenticity/honesty factor
   */
  private analyzeAuthenticityFactor(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor | null {
    const authenticVideos = videos.filter(v => 
      /\b(honest|real|truth|genuine|authentic|brutal|actually)\b/i.test(v.title)
    );
    if (authenticVideos.length < 2) return null;

    const authenticAvgViews = authenticVideos.reduce((sum, v) => sum + v.viewCount, 0) / authenticVideos.length;
    const impact = authenticAvgViews / avgViews;

    const positiveExamples = authenticVideos
      .filter(v => v.viewCount > avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 3);

    const negativeExamples = authenticVideos
      .filter(v => v.viewCount < avgViews * 0.7)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(0, 2);

    return {
      factor: 'Authentic/Honest Language',
      impact: Math.round(impact * 100) / 100,
      confidence: this.calculateConfidence(authenticVideos.length, videos.length, impact),
      evidence: { positiveExamples, negativeExamples },
      actionableInsight: this.generateAuthenticityInsight(positiveExamples, topPerformers),
      frequency: authenticVideos.length
    };
  }

  /**
   * Analyze title length factor
   */
  private analyzeTitleLengthFactor(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor | null {
    const optimalLength = this.findOptimalTitleLength(videos, avgViews);
    if (!optimalLength) return null;

    const optimalVideos = videos.filter(v => 
      v.title.length >= optimalLength.range.min && 
      v.title.length <= optimalLength.range.max
    );

    const positiveExamples = optimalVideos
      .filter(v => v.viewCount > avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 3);

    const negativeExamples = videos
      .filter(v => v.title.length < optimalLength.range.min || v.title.length > optimalLength.range.max)
      .filter(v => v.viewCount < avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(0, 2);

    return {
      factor: `Optimal Title Length (${optimalLength.range.min}-${optimalLength.range.max} chars)`,
      impact: optimalLength.impact,
      confidence: this.calculateConfidence(optimalVideos.length, videos.length, optimalLength.impact),
      evidence: { positiveExamples, negativeExamples },
      actionableInsight: `Titles between ${optimalLength.range.min}-${optimalLength.range.max} characters perform ${optimalLength.impact.toFixed(1)}x better for your audience`,
      frequency: optimalVideos.length
    };
  }

  /**
   * Analyze emotional trigger factor
   */
  private analyzeEmotionalTriggerFactor(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor | null {
    const emotionalVideos = videos.filter(v => 
      /\b(amazing|incredible|shocking|unbelievable|insane|crazy|awesome|fantastic)\b/i.test(v.title)
    );
    if (emotionalVideos.length < 2) return null;

    const emotionalAvgViews = emotionalVideos.reduce((sum, v) => sum + v.viewCount, 0) / emotionalVideos.length;
    const impact = emotionalAvgViews / avgViews;

    const positiveExamples = emotionalVideos
      .filter(v => v.viewCount > avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 3);

    const negativeExamples = emotionalVideos
      .filter(v => v.viewCount < avgViews * 0.7)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(0, 2);

    return {
      factor: 'Emotional Amplifier Words',
      impact: Math.round(impact * 100) / 100,
      confidence: this.calculateConfidence(emotionalVideos.length, videos.length, impact),
      evidence: { positiveExamples, negativeExamples },
      actionableInsight: this.generateEmotionalInsight(positiveExamples, emotionalVideos),
      frequency: emotionalVideos.length
    };
  }

  /**
   * Analyze niche-specific terminology factor
   */
  private analyzeNicheTerminologyFactor(
    videos: EnhancedVideoData[], 
    avgViews: number, 
    topPerformers: EnhancedVideoData[], 
    bottomPerformers: EnhancedVideoData[]
  ): SuccessFactor | null {
    const nicheTerms = this.extractNicheTerminology(videos);
    if (nicheTerms.length === 0) return null;

    const nicheVideos = videos.filter(v => 
      nicheTerms.some(term => v.title.toLowerCase().includes(term.toLowerCase()))
    );

    const nicheAvgViews = nicheVideos.reduce((sum, v) => sum + v.viewCount, 0) / nicheVideos.length;
    const impact = nicheAvgViews / avgViews;

    const positiveExamples = nicheVideos
      .filter(v => v.viewCount > avgViews)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => b.multiplier - a.multiplier)
      .slice(0, 3);

    const negativeExamples = nicheVideos
      .filter(v => v.viewCount < avgViews * 0.7)
      .map(v => ({ video: v, multiplier: v.viewCount / avgViews }))
      .sort((a, b) => a.multiplier - b.multiplier)
      .slice(0, 2);

    return {
      factor: 'Niche-Specific Terminology',
      impact: Math.round(impact * 100) / 100,
      confidence: this.calculateConfidence(nicheVideos.length, videos.length, impact),
      evidence: { positiveExamples, negativeExamples },
      actionableInsight: this.generateNicheTerminologyInsight(nicheTerms, positiveExamples),
      frequency: nicheVideos.length
    };
  }

  /**
   * Analyze performance patterns across videos
   */
  private analyzeContentPatterns(videos: EnhancedVideoData[], avgViews: number): PerformancePattern[] {
    const patterns: PerformancePattern[] = [];

    // Analyze different content patterns
    patterns.push(...this.analyzeContentFormatPatterns(videos, avgViews));
    patterns.push(...this.analyzeTopicPatterns(videos, avgViews));
    patterns.push(...this.analyzeEngagementPerformancePatterns(videos, avgViews));

    return patterns
      .filter(p => p.avgPerformanceBoost > 1.1 && p.consistency > 0.6)
      .sort((a, b) => b.avgPerformanceBoost - a.avgPerformanceBoost)
      .slice(0, 8);
  }

  /**
   * Identify optimization opportunities
   */
  private identifyOptimizationOpportunities(
    channelData: EnhancedChannelData, 
    videos: EnhancedVideoData[], 
    avgViews: number
  ): ContentOptimizationOpportunity[] {
    const opportunities: ContentOptimizationOpportunity[] = [];

    // Title optimization opportunities
    const titleOpps = this.identifyTitleOptimizationOpportunities(videos, avgViews);
    opportunities.push(...titleOpps);

    // Content format opportunities
    const formatOpps = this.identifyFormatOptimizationOpportunities(videos, avgViews);
    opportunities.push(...formatOpps);

    // Engagement optimization opportunities
    const engagementOpps = this.identifyEngagementOptimizationOpportunities(channelData, videos);
    opportunities.push(...engagementOpps);

    return opportunities
      .sort((a, b) => b.potentialImpact - a.potentialImpact)
      .slice(0, 6);
  }

  /**
   * Analyze audience engagement patterns
   */
  private analyzeEngagementPatterns(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): AudienceEngagementPattern[] {
    const patterns: AudienceEngagementPattern[] = [];

    // Interactive content pattern
    const interactivePattern = this.analyzeInteractiveEngagementPattern(videos, topPerformers);
    if (interactivePattern) patterns.push(interactivePattern);

    // Personal connection pattern
    const personalPattern = this.analyzePersonalConnectionPattern(videos, topPerformers);
    if (personalPattern) patterns.push(personalPattern);

    // Educational value pattern
    const educationalPattern = this.analyzeEducationalEngagementPattern(videos, topPerformers);
    if (educationalPattern) patterns.push(educationalPattern);

    return patterns;
  }

  // Helper methods for generating insights

  private generateQuestionInsight(positiveExamples: any[], topPerformers: EnhancedVideoData[]): string {
    if (positiveExamples.length === 0) return 'Question titles show potential but need optimization';
    
    const bestExample = positiveExamples[0];
    const avgMultiplier = positiveExamples.reduce((sum, ex) => sum + ex.multiplier, 0) / positiveExamples.length;
    
    return `Question format highly effective (${avgMultiplier.toFixed(1)}x avg performance). Best example: "${bestExample.video.title}" performed ${bestExample.multiplier.toFixed(1)}x above average. Questions should address specific audience pain points.`;
  }

  private generatePersonalPronounInsight(positiveExamples: any[], personalVideos: EnhancedVideoData[]): string {
    if (positiveExamples.length === 0) return 'Personal pronouns need more strategic usage';
    
    const youUsage = personalVideos.filter(v => /\byou\b/i.test(v.title)).length;
    const myUsage = personalVideos.filter(v => /\bmy\b/i.test(v.title)).length;
    
    if (youUsage > myUsage) {
      return `"You" addressing audience directly is highly effective. Continue using direct address to create personal connection and relevance.`;
    } else {
      return `Personal stories with "my" create strong authenticity. Share more personal experiences to build deeper audience connection.`;
    }
  }

  private generateInteractiveInsight(positiveExamples: any[], topPerformers: EnhancedVideoData[]): string {
    if (positiveExamples.length === 0) return 'Interactive content shows promise but needs refinement';
    
    const ratingContent = positiveExamples.filter(ex => ex.video.title.toLowerCase().includes('rating')).length;
    const communityContent = positiveExamples.filter(ex => ex.video.title.toLowerCase().includes('subscribers')).length;
    
    if (ratingContent > 0 && communityContent > 0) {
      return `Subscriber rating format is your signature strength. This unique interactive approach creates unparalleled audience engagement. Continue and expand this format.`;
    }
    
    return `Interactive community content drives exceptional engagement. Focus on formats that involve audience participation and feedback.`;
  }

  private generateAuthenticityInsight(positiveExamples: any[], topPerformers: EnhancedVideoData[]): string {
    if (positiveExamples.length === 0) return 'Authentic language shows potential';
    
    const honestContent = positiveExamples.filter(ex => ex.video.title.toLowerCase().includes('honest')).length;
    const brutalContent = positiveExamples.filter(ex => ex.video.title.toLowerCase().includes('brutal')).length;
    
    if (brutalContent > 0) {
      return `"Brutal" honesty is your competitive advantage. Audiences crave unfiltered opinions in an overly-polished digital world. Lean into this authentic voice.`;
    }
    
    return `Authentic, honest communication resonates strongly. Continue being genuine and transparent - it builds unique trust with your audience.`;
  }

  private generateEmotionalInsight(positiveExamples: any[], emotionalVideos: EnhancedVideoData[]): string {
    if (positiveExamples.length === 0) return 'Emotional triggers need more strategic implementation';
    
    const avgMultiplier = positiveExamples.reduce((sum, ex) => sum + ex.multiplier, 0) / positiveExamples.length;
    return `Emotional amplifiers boost performance by ${avgMultiplier.toFixed(1)}x. Use sparingly for maximum impact - overuse reduces effectiveness.`;
  }

  private generateNicheTerminologyInsight(nicheTerms: string[], positiveExamples: any[]): string {
    if (positiveExamples.length === 0) return 'Niche terminology needs strategic application';
    
    const topTerms = nicheTerms.slice(0, 3).join(', ');
    return `Specialized terminology (${topTerms}) attracts dedicated niche audience. This creates authority and filters for highly engaged viewers.`;
  }

  // Helper utility methods

  private calculateAverageViews(videos: EnhancedVideoData[]): number {
    if (videos.length === 0) return 0;
    return videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;
  }

  private getTopPerformers(videos: EnhancedVideoData[], percentage: number): EnhancedVideoData[] {
    return videos
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, Math.max(1, Math.floor(videos.length * percentage)));
  }

  private getBottomPerformers(videos: EnhancedVideoData[], percentage: number): EnhancedVideoData[] {
    return videos
      .sort((a, b) => a.viewCount - b.viewCount)
      .slice(0, Math.max(1, Math.floor(videos.length * percentage)));
  }

  private calculateConfidence(frequency: number, totalVideos: number, impact: number): 'high' | 'medium' | 'low' {
    const sampleRatio = frequency / totalVideos;
    
    if (sampleRatio >= 0.3 && impact >= 1.3) return 'high';
    if (sampleRatio >= 0.15 && impact >= 1.15) return 'medium';
    return 'low';
  }

  private findOptimalTitleLength(videos: EnhancedVideoData[], avgViews: number): { range: { min: number, max: number }, impact: number } | null {
    const lengthBuckets = [
      { min: 0, max: 30, videos: videos.filter(v => v.title.length <= 30) },
      { min: 31, max: 50, videos: videos.filter(v => v.title.length > 30 && v.title.length <= 50) },
      { min: 51, max: 70, videos: videos.filter(v => v.title.length > 50 && v.title.length <= 70) },
      { min: 71, max: 100, videos: videos.filter(v => v.title.length > 70) }
    ];

    let bestBucket = null;
    let bestPerformance = 0;

    for (const bucket of lengthBuckets) {
      if (bucket.videos.length >= 2) {
        const bucketAvg = bucket.videos.reduce((sum, v) => sum + v.viewCount, 0) / bucket.videos.length;
        const performance = bucketAvg / avgViews;
        
        if (performance > bestPerformance && performance > 1.1) {
          bestPerformance = performance;
          bestBucket = { range: { min: bucket.min, max: bucket.max }, impact: performance };
        }
      }
    }

    return bestBucket;
  }

  private extractNicheTerminology(videos: EnhancedVideoData[]): string[] {
    const allTitles = videos.map(v => v.title.toLowerCase()).join(' ');
    const nicheTerms: string[] = [];
    
    // Beauty/appearance terms
    if (allTitles.includes('looksmax') || allTitles.includes('debloat')) {
      nicheTerms.push('looksmax', 'debloat');
    }
    
    // Rating/interaction terms
    if (allTitles.includes('rating') && allTitles.includes('subscribers')) {
      nicheTerms.push('rating subscribers');
    }
    
    // Add more niche detection logic based on content
    return nicheTerms;
  }

  private analyzeContentFormatPatterns(videos: EnhancedVideoData[], avgViews: number): PerformancePattern[] {
    const patterns: PerformancePattern[] = [];
    
    // Question format pattern
    const questionVideos = videos.filter(v => v.title.includes('?'));
    if (questionVideos.length >= 2) {
      const avgPerformance = (questionVideos.reduce((sum, v) => sum + v.viewCount, 0) / questionVideos.length) / avgViews;
      const consistency = this.calculatePatternConsistency(questionVideos, avgViews);
      
      patterns.push({
        pattern: 'Question Format',
        description: 'Titles ending with questions to create curiosity',
        avgPerformanceBoost: avgPerformance,
        consistency,
        applicability: 'universal',
        examples: questionVideos.slice(0, 3).map(v => ({
          title: v.title,
          views: v.viewCount,
          patternStrength: v.viewCount / avgViews
        })),
        recommendedUsage: 'Use for content that solves specific problems or addresses audience curiosity'
      });
    }
    
    return patterns;
  }

  private analyzeTopicPatterns(videos: EnhancedVideoData[], avgViews: number): PerformancePattern[] {
    const patterns: PerformancePattern[] = [];
    
    // Interactive content pattern
    const interactiveVideos = videos.filter(v => 
      /\b(rating|interactive|subscribers|community)\b/i.test(v.title)
    );
    
    if (interactiveVideos.length >= 2) {
      const avgPerformance = (interactiveVideos.reduce((sum, v) => sum + v.viewCount, 0) / interactiveVideos.length) / avgViews;
      const consistency = this.calculatePatternConsistency(interactiveVideos, avgViews);
      
      patterns.push({
        pattern: 'Interactive Community Content',
        description: 'Content that directly involves audience participation',
        avgPerformanceBoost: avgPerformance,
        consistency,
        applicability: 'niche_specific',
        examples: interactiveVideos.slice(0, 3).map(v => ({
          title: v.title,
          views: v.viewCount,
          patternStrength: v.viewCount / avgViews
        })),
        recommendedUsage: 'Perfect for building community engagement and creating unique content experiences'
      });
    }
    
    return patterns;
  }

  private analyzeEngagementPerformancePatterns(videos: EnhancedVideoData[], avgViews: number): PerformancePattern[] {
    // This method would analyze engagement-specific patterns
    // Implementation would depend on having engagement data
    return [];
  }

  private calculatePatternConsistency(patternVideos: EnhancedVideoData[], avgViews: number): number {
    const performances = patternVideos.map(v => v.viewCount / avgViews);
    const avgPerformance = performances.reduce((sum, p) => sum + p, 0) / performances.length;
    
    // Calculate how consistently videos perform above average
    const consistentPerformers = performances.filter(p => p > 1.0).length;
    return consistentPerformers / patternVideos.length;
  }

  private identifyTitleOptimizationOpportunities(videos: EnhancedVideoData[], avgViews: number): ContentOptimizationOpportunity[] {
    const opportunities: ContentOptimizationOpportunity[] = [];
    
    // Check if more question titles could help
    const questionVideos = videos.filter(v => v.title.includes('?'));
    const questionSuccess = questionVideos.length > 0 ? 
      (questionVideos.reduce((sum, v) => sum + v.viewCount, 0) / questionVideos.length) / avgViews : 0;
    
    if (questionSuccess > 1.2 && questionVideos.length < videos.length * 0.5) {
      opportunities.push({
        opportunity: 'Increase Question-Based Titles',
        potentialImpact: Math.round((questionSuccess - 1) * 100),
        difficulty: 'easy',
        timeframe: 'immediate',
        specificActions: [
          'Convert 2-3 upcoming video titles to question format',
          'Focus questions on audience pain points or curiosity gaps',
          'Test question placement at beginning vs end of title'
        ],
        successMetrics: ['View count increase of 20-40%', 'Higher click-through rates'],
        riskFactors: ['Overuse may reduce effectiveness', 'Questions must be genuinely relevant']
      });
    }
    
    return opportunities;
  }

  private identifyFormatOptimizationOpportunities(videos: EnhancedVideoData[], avgViews: number): ContentOptimizationOpportunity[] {
    const opportunities: ContentOptimizationOpportunity[] = [];
    
    // Check for interactive content opportunities
    const interactiveVideos = videos.filter(v => 
      /\b(rating|interactive|community)\b/i.test(v.title)
    );
    
    if (interactiveVideos.length > 0 && interactiveVideos.length < videos.length * 0.4) {
      const interactiveSuccess = (interactiveVideos.reduce((sum, v) => sum + v.viewCount, 0) / interactiveVideos.length) / avgViews;
      
      if (interactiveSuccess > 1.3) {
        opportunities.push({
          opportunity: 'Expand Interactive Community Content',
          potentialImpact: Math.round((interactiveSuccess - 1) * 100),
          difficulty: 'medium',
          timeframe: 'short_term',
          specificActions: [
            'Create more subscriber rating content',
            'Develop community challenge series',
            'Implement viewer choice/voting elements'
          ],
          successMetrics: ['Engagement rate increase', 'Community growth', 'Repeat viewership'],
          riskFactors: ['Requires consistent community management', 'May not scale with larger audiences']
        });
      }
    }
    
    return opportunities;
  }

  private identifyEngagementOptimizationOpportunities(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): ContentOptimizationOpportunity[] {
    const opportunities: ContentOptimizationOpportunity[] = [];
    
    // Analyze authenticity opportunities
    const authenticVideos = videos.filter(v => 
      /\b(honest|real|authentic|genuine)\b/i.test(v.title)
    );
    
    if (authenticVideos.length > 0 && authenticVideos.length < videos.length * 0.3) {
      opportunities.push({
        opportunity: 'Amplify Authentic Voice',
        potentialImpact: 35,
        difficulty: 'easy',
        timeframe: 'immediate',
        specificActions: [
          'Share more personal experiences and opinions',
          'Use "honest review" format for product/service content',
          'Show vulnerability and authentic reactions'
        ],
        successMetrics: ['Higher engagement rates', 'Stronger audience loyalty', 'More comments and shares'],
        riskFactors: ['Must maintain genuine authenticity', 'Personal boundaries important']
      });
    }
    
    return opportunities;
  }

  private analyzeInteractiveEngagementPattern(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): AudienceEngagementPattern | null {
    const interactiveVideos = videos.filter(v => 
      /\b(rating|interactive|community|subscribers)\b/i.test(v.title)
    );
    
    if (interactiveVideos.length < 2) return null;
    
    const avgViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;
    const interactiveAvgViews = interactiveVideos.reduce((sum, v) => sum + v.viewCount, 0) / interactiveVideos.length;
    const effectiveness = (interactiveAvgViews / avgViews) * 100;
    
    return {
      engagementType: 'Interactive Community Participation',
      effectivenessScore: Math.round(effectiveness),
      audienceResponse: {
        engagement: effectiveness > 130 ? 'high' : effectiveness > 110 ? 'medium' : 'low',
        retention: 'high', // Assumed based on interactive nature
        sharing: 'medium'
      },
      implementationStrategy: 'Create content that directly involves audience (rating, voting, challenges)',
      measurableOutcomes: ['Higher comment rates', 'Increased subscriber interaction', 'Community growth']
    };
  }

  private analyzePersonalConnectionPattern(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): AudienceEngagementPattern | null {
    const personalVideos = videos.filter(v => 
      /\b(my|personal|story|experience)\b/i.test(v.title)
    );
    
    if (personalVideos.length < 2) return null;
    
    const avgViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;
    const personalAvgViews = personalVideos.reduce((sum, v) => sum + v.viewCount, 0) / personalVideos.length;
    const effectiveness = (personalAvgViews / avgViews) * 100;
    
    return {
      engagementType: 'Personal Story Connection',
      effectivenessScore: Math.round(effectiveness),
      audienceResponse: {
        engagement: effectiveness > 120 ? 'high' : effectiveness > 105 ? 'medium' : 'low',
        retention: 'high',
        sharing: 'high'
      },
      implementationStrategy: 'Share authentic personal experiences and vulnerable moments',
      measurableOutcomes: ['Deeper audience connection', 'Higher emotional engagement', 'Brand loyalty']
    };
  }

  private analyzeEducationalEngagementPattern(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): AudienceEngagementPattern | null {
    const educationalVideos = videos.filter(v => 
      /\b(tips|guide|how to|tutorial|advice)\b/i.test(v.title)
    );
    
    if (educationalVideos.length < 2) return null;
    
    const avgViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;
    const educationalAvgViews = educationalVideos.reduce((sum, v) => sum + v.viewCount, 0) / educationalVideos.length;
    const effectiveness = (educationalAvgViews / avgViews) * 100;
    
    return {
      engagementType: 'Educational Value Delivery',
      effectivenessScore: Math.round(effectiveness),
      audienceResponse: {
        engagement: effectiveness > 115 ? 'high' : effectiveness > 100 ? 'medium' : 'low',
        retention: 'medium',
        sharing: 'high'
      },
      implementationStrategy: 'Provide actionable, practical advice with clear value propositions',
      measurableOutcomes: ['Knowledge transfer', 'Practical application', 'Authority building']
    };
  }

  private generateChannelSpecificInsights(
    channelData: EnhancedChannelData, 
    videos: EnhancedVideoData[], 
    topPerformers: EnhancedVideoData[]
  ): PerformanceAnalysisResult['channelSpecificInsights'] {
    const uniqueDrivers = this.identifyUniqueSuccessDrivers(topPerformers);
    const audiencePrefs = this.analyzeAudiencePreferences(topPerformers);
    const contentGaps = this.identifyContentGaps(videos, topPerformers);
    const growthPotential = this.calculateGrowthPotential(channelData, videos);
    
    return {
      uniqueSuccessDrivers: uniqueDrivers,
      audiencePreferences: audiencePrefs,
      contentGaps: contentGaps,
      growthPotential: growthPotential
    };
  }

  private identifyUniqueSuccessDrivers(topPerformers: EnhancedVideoData[]): string[] {
    const drivers: string[] = [];
    const titles = topPerformers.map(v => v.title.toLowerCase()).join(' ');
    
    if (titles.includes('rating') && titles.includes('subscribers')) {
      drivers.push('Interactive subscriber rating format creates unique engagement');
    }
    
    if (titles.includes('honest') || titles.includes('brutal')) {
      drivers.push('Unfiltered authentic opinions differentiate from competition');
    }
    
    if (titles.includes('personal') || titles.includes('my')) {
      drivers.push('Personal storytelling builds genuine connection');
    }
    
    return drivers;
  }

  private analyzeAudiencePreferences(topPerformers: EnhancedVideoData[]): string[] {
    const preferences: string[] = [];
    const content = topPerformers.map(v => v.title.toLowerCase()).join(' ');
    
    if (content.includes('rating') || content.includes('interactive')) {
      preferences.push('Interactive and participatory content');
    }
    
    if (content.includes('honest') || content.includes('real')) {
      preferences.push('Authentic and unfiltered opinions');
    }
    
    if (content.includes('tips') || content.includes('advice')) {
      preferences.push('Actionable advice and practical tips');
    }
    
    return preferences;
  }

  private identifyContentGaps(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): string[] {
    const gaps: string[] = [];
    
    // Check for successful patterns that aren't being used enough
    const interactiveSuccess = topPerformers.filter(v => 
      /\b(rating|interactive)\b/i.test(v.title)
    ).length;
    
    const totalInteractive = videos.filter(v => 
      /\b(rating|interactive)\b/i.test(v.title)
    ).length;
    
    if (interactiveSuccess > 0 && totalInteractive < videos.length * 0.4) {
      gaps.push('Underutilizing successful interactive content format');
    }
    
    // Check for educational content gaps
    const educationalInTop = topPerformers.filter(v =>
      /\b(tips|guide|how to)\b/i.test(v.title)
    ).length;
    
    if (educationalInTop === 0) {
      gaps.push('Opportunity to add educational/tutorial content');
    }
    
    return gaps;
  }

  private calculateGrowthPotential(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): number {
    const avgViews = this.calculateAverageViews(videos);
    const topPerformers = this.getTopPerformers(videos, 0.2);
    const topAvgViews = topPerformers.reduce((sum, v) => sum + v.viewCount, 0) / topPerformers.length;
    
    const consistency = videos.filter(v => v.viewCount > avgViews * 0.8).length / videos.length;
    const topPerformanceRatio = topAvgViews / avgViews;
    
    // Calculate potential based on top performance and consistency
    const potential = Math.min((topPerformanceRatio * consistency) * 20, 95);
    
    return Math.round(potential);
  }

  private identifyCompetitiveAdvantages(channelData: EnhancedChannelData, topPerformers: EnhancedVideoData[]): string[] {
    const advantages: string[] = [];
    const content = topPerformers.map(v => v.title.toLowerCase()).join(' ');
    
    if (content.includes('rating') && content.includes('subscribers')) {
      advantages.push('Unique subscriber rating format creates unmatched community engagement');
    }
    
    if (content.includes('honest') && content.includes('brutal')) {
      advantages.push('Fearless authenticity in an over-polished digital landscape');
    }
    
    if (content.includes('personal') || content.includes('my')) {
      advantages.push('Genuine personal connection building through vulnerability');
    }
    
    return advantages;
  }

  private calculatePerformanceScore(channelData: EnhancedChannelData, videos: EnhancedVideoData[], avgViews: number): number {
    const topPerformers = this.getTopPerformers(videos, 0.2);
    const consistency = videos.filter(v => v.viewCount > avgViews * 0.7).length / videos.length;
    const topPerformance = topPerformers.reduce((sum, v) => sum + v.viewCount, 0) / topPerformers.length;
    const topRatio = topPerformance / avgViews;
    
    // Scoring based on consistency and peak performance
    const consistencyScore = consistency * 40;
    const peakScore = Math.min((topRatio - 1) * 30, 40);
    const baseScore = 20; // Base score for having content
    
    return Math.round(consistencyScore + peakScore + baseScore);
  }
}