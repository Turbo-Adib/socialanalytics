import { EnhancedVideoData, EnhancedChannelData } from './enhancedYouTubeAPI';
import { ContentAnalyzer, ContentAnalysisResult } from './contentAnalyzer';
import { TitlePatternAnalyzer, TitleOptimizationInsight, ChannelSpecificTitleStrategy } from './titlePatternAnalyzer';
import { ChannelPersonalityAnalyzer, PersonalityAnalysisResult } from './channelPersonalityAnalyzer';
import { PerformancePatternEngine, PerformanceAnalysisResult } from './performancePatternEngine';

export interface DynamicInsight {
  id: string;
  category: 'title_optimization' | 'content_strategy' | 'audience_engagement' | 'performance_boost' | 'competitive_advantage';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidenceBased: {
    dataPoints: string[];
    supportingVideos: Array<{
      title: string;
      views: number;
      successFactor: string;
    }>;
    statisticalSupport: string;
  };
  actionableSteps: Array<{
    step: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeToImplement: string;
    expectedImpact: string;
  }>;
  potentialImpact: {
    viewsIncrease: string;
    engagementBoost: string;
    audienceGrowth: string;
  };
  successMetrics: string[];
  riskFactors: string[];
  personalizedRecommendations: string[];
}

export interface ChannelDynamicAnalysis {
  channelId: string;
  analysisDate: string;
  overallScore: {
    current: number;
    potential: number;
    optimization: number;
  };
  keyInsights: DynamicInsight[];
  quickWins: DynamicInsight[];
  longTermStrategies: DynamicInsight[];
  uniqueAdvantages: string[];
  competitivePositioning: string;
  audienceProfile: {
    primaryCharacteristics: string[];
    contentPreferences: string[];
    engagementPatterns: string[];
  };
  contentStrategy: {
    corePillars: string[];
    contentGaps: string[];
    formatRecommendations: string[];
  };
  nextSteps: Array<{
    action: string;
    priority: number;
    timeline: string;
    dependency?: string;
  }>;
}

export class DynamicInsightGenerator {
  private contentAnalyzer: ContentAnalyzer;
  private titleAnalyzer: TitlePatternAnalyzer;
  private personalityAnalyzer: ChannelPersonalityAnalyzer;
  private performanceEngine: PerformancePatternEngine;

  constructor() {
    this.contentAnalyzer = new ContentAnalyzer();
    this.titleAnalyzer = new TitlePatternAnalyzer();
    this.personalityAnalyzer = new ChannelPersonalityAnalyzer();
    this.performanceEngine = new PerformancePatternEngine();
  }

  /**
   * Generate comprehensive dynamic insights for a channel
   */
  async generateChannelAnalysis(channelData: EnhancedChannelData): Promise<ChannelDynamicAnalysis> {
    // Run all analysis components
    const contentAnalysis = this.contentAnalyzer.analyzeChannelContent(channelData);
    const titleAnalysis = this.titleAnalyzer.analyzeTitleOptimization(channelData.recentVideos);
    const personalityAnalysis = this.personalityAnalyzer.analyzeChannelPersonality(channelData);
    const performanceAnalysis = this.performanceEngine.analyzePerformancePatterns(channelData);

    // Generate dynamic insights
    const insights = this.generateDynamicInsights(
      channelData,
      contentAnalysis,
      titleAnalysis,
      personalityAnalysis,
      performanceAnalysis
    );

    // Categorize and prioritize insights
    const categorizedInsights = this.categorizeInsights(insights);
    const quickWins = this.identifyQuickWins(insights);
    const longTermStrategies = this.identifyLongTermStrategies(insights);

    return {
      channelId: channelData.id,
      analysisDate: new Date().toISOString(),
      overallScore: this.calculateOverallScore(performanceAnalysis, personalityAnalysis),
      keyInsights: categorizedInsights.slice(0, 8),
      quickWins: quickWins.slice(0, 5),
      longTermStrategies: longTermStrategies.slice(0, 4),
      uniqueAdvantages: this.extractUniqueAdvantages(personalityAnalysis, performanceAnalysis),
      competitivePositioning: personalityAnalysis.competitivePositioning,
      audienceProfile: this.buildAudienceProfile(personalityAnalysis, performanceAnalysis),
      contentStrategy: this.buildContentStrategy(contentAnalysis, titleAnalysis, performanceAnalysis),
      nextSteps: this.generateNextSteps(quickWins, longTermStrategies)
    };
  }

  /**
   * Generate dynamic insights by combining all analysis results
   */
  private generateDynamicInsights(
    channelData: EnhancedChannelData,
    contentAnalysis: ContentAnalysisResult,
    titleAnalysis: { insights: TitleOptimizationInsight[], channelStrategy: ChannelSpecificTitleStrategy },
    personalityAnalysis: PersonalityAnalysisResult,
    performanceAnalysis: PerformanceAnalysisResult
  ): DynamicInsight[] {
    const insights: DynamicInsight[] = [];

    // Generate title optimization insights
    insights.push(...this.generateTitleOptimizationInsights(titleAnalysis, performanceAnalysis));

    // Generate content strategy insights
    insights.push(...this.generateContentStrategyInsights(contentAnalysis, performanceAnalysis));

    // Generate audience engagement insights
    insights.push(...this.generateAudienceEngagementInsights(personalityAnalysis, performanceAnalysis));

    // Generate performance boost insights
    insights.push(...this.generatePerformanceBoostInsights(performanceAnalysis, channelData));

    // Generate competitive advantage insights
    insights.push(...this.generateCompetitiveAdvantageInsights(personalityAnalysis, performanceAnalysis));

    return insights.sort((a, b) => this.calculateInsightPriority(b) - this.calculateInsightPriority(a));
  }

  /**
   * Generate title optimization insights
   */
  private generateTitleOptimizationInsights(
    titleAnalysis: { insights: TitleOptimizationInsight[], channelStrategy: ChannelSpecificTitleStrategy },
    performanceAnalysis: PerformanceAnalysisResult
  ): DynamicInsight[] {
    const insights: DynamicInsight[] = [];

    // Top performing title pattern insight
    const topTitleInsight = titleAnalysis.insights[0];
    if (topTitleInsight && topTitleInsight.performanceMultiplier > 1.2) {
      insights.push({
        id: 'title-optimization-pattern',
        category: 'title_optimization',
        priority: 'high',
        title: `${topTitleInsight.pattern} Titles Drive ${Math.round((topTitleInsight.performanceMultiplier - 1) * 100)}% More Views`,
        description: `Your ${topTitleInsight.pattern.toLowerCase()} format consistently outperforms average content, generating ${topTitleInsight.performanceMultiplier.toFixed(1)}x more views than typical titles.`,
        evidenceBased: {
          dataPoints: [
            `${topTitleInsight.frequency} videos analyzed with this pattern`,
            `${Math.round((topTitleInsight.performanceMultiplier - 1) * 100)}% average performance boost`,
            `${topTitleInsight.confidence} confidence level based on sample size`
          ],
          supportingVideos: topTitleInsight.bestExamples.map(ex => ({
            title: ex.title,
            views: ex.views,
            successFactor: `${ex.multiplier.toFixed(1)}x above average performance`
          })),
          statisticalSupport: `Based on analysis of ${topTitleInsight.frequency} videos with this pattern showing consistent outperformance`
        },
        actionableSteps: [
          {
            step: `Apply ${topTitleInsight.pattern.toLowerCase()} format to 3-4 upcoming videos`,
            difficulty: 'easy',
            timeToImplement: 'Immediate',
            expectedImpact: `${Math.round((topTitleInsight.performanceMultiplier - 1) * 100)}% view increase`
          },
          {
            step: 'A/B test different variations of this format',
            difficulty: 'medium',
            timeToImplement: '2-3 weeks',
            expectedImpact: 'Optimized format effectiveness'
          },
          {
            step: 'Create title templates based on top performers',
            difficulty: 'easy',
            timeToImplement: '1 day',
            expectedImpact: 'Consistent high-performing titles'
          }
        ],
        potentialImpact: {
          viewsIncrease: `${Math.round((topTitleInsight.performanceMultiplier - 1) * 100)}%`,
          engagementBoost: '15-25%',
          audienceGrowth: '10-20%'
        },
        successMetrics: [
          'Click-through rate improvement',
          'Average view count increase',
          'Subscriber conversion rate'
        ],
        riskFactors: [
          'Overuse may reduce effectiveness',
          'Must maintain genuine relevance to content'
        ],
        personalizedRecommendations: topTitleInsight.optimizationTips
      });
    }

    // Channel-specific title strategy insight
    if (titleAnalysis.channelStrategy.uniqueSuccessPatterns.length > 0) {
      insights.push({
        id: 'channel-signature-titles',
        category: 'competitive_advantage',
        priority: 'high',
        title: 'Your Signature Title Style is Your Competitive Edge',
        description: `Your unique approach to titling creates distinct audience expectations and drives superior engagement through authentic voice.`,
        evidenceBased: {
          dataPoints: titleAnalysis.channelStrategy.uniqueSuccessPatterns,
          supportingVideos: [], // Would need top performers here
          statisticalSupport: 'Based on analysis of your highest-performing content patterns'
        },
        actionableSteps: [
          {
            step: 'Document your signature title elements for consistency',
            difficulty: 'easy',
            timeToImplement: '2 hours',
            expectedImpact: 'Brand consistency and recognition'
          },
          {
            step: 'Train any team members on your unique style',
            difficulty: 'medium',
            timeToImplement: '1 week',
            expectedImpact: 'Consistent brand voice across all content'
          }
        ],
        potentialImpact: {
          viewsIncrease: '20-30%',
          engagementBoost: '25-40%',
          audienceGrowth: '15-25%'
        },
        successMetrics: ['Brand recognition', 'Audience loyalty', 'Engagement consistency'],
        riskFactors: ['Risk of becoming too formulaic'],
        personalizedRecommendations: titleAnalysis.channelStrategy.channelSpecificOptimizations
      });
    }

    return insights;
  }

  /**
   * Generate content strategy insights
   */
  private generateContentStrategyInsights(
    contentAnalysis: ContentAnalysisResult,
    performanceAnalysis: PerformanceAnalysisResult
  ): DynamicInsight[] {
    const insights: DynamicInsight[] = [];

    // Content pillar optimization
    if (contentAnalysis.contentPillars.length > 0) {
      const topPillar = contentAnalysis.contentPillars[0];
      insights.push({
        id: 'content-pillar-focus',
        category: 'content_strategy',
        priority: 'medium',
        title: `Double Down on ${topPillar} Content`,
        description: `${topPillar} content represents your strongest content pillar and should be expanded for maximum audience growth.`,
        evidenceBased: {
          dataPoints: [
            `${topPillar} identified as primary content strength`,
            'Consistent audience engagement in this area',
            'Natural alignment with your personality and expertise'
          ],
          supportingVideos: [], // Would extract from theme analysis
          statisticalSupport: 'Based on content theme clustering and performance correlation'
        },
        actionableSteps: [
          {
            step: `Plan 60% of upcoming content around ${topPillar}`,
            difficulty: 'medium',
            timeToImplement: '2 weeks',
            expectedImpact: '25-40% engagement increase'
          },
          {
            step: `Create series or recurring formats for ${topPillar} content`,
            difficulty: 'medium',
            timeToImplement: '1 month',
            expectedImpact: 'Audience expectation and loyalty'
          }
        ],
        potentialImpact: {
          viewsIncrease: '20-35%',
          engagementBoost: '30-45%',
          audienceGrowth: '15-30%'
        },
        successMetrics: ['Content series success', 'Audience retention', 'Engagement rates'],
        riskFactors: ['Risk of content monotony', 'Need to maintain variety'],
        personalizedRecommendations: [`Focus on ${topPillar} while maintaining authentic voice`]
      });
    }

    // Voice profile insights
    if (contentAnalysis.voiceProfile.uniqueElements.length > 0) {
      insights.push({
        id: 'unique-voice-amplification',
        category: 'competitive_advantage',
        priority: 'high',
        title: 'Amplify Your Unique Voice Elements',
        description: `Your distinctive communication style creates authentic connection that competitors cannot replicate.`,
        evidenceBased: {
          dataPoints: contentAnalysis.voiceProfile.uniqueElements,
          supportingVideos: [],
          statisticalSupport: 'Based on voice analysis across all content'
        },
        actionableSteps: [
          {
            step: 'Consciously integrate unique elements into all content',
            difficulty: 'easy',
            timeToImplement: 'Ongoing',
            expectedImpact: 'Stronger brand identity'
          }
        ],
        potentialImpact: {
          viewsIncrease: '15-25%',
          engagementBoost: '35-50%',
          audienceGrowth: '20-35%'
        },
        successMetrics: ['Brand recognition', 'Audience loyalty', 'Unique positioning'],
        riskFactors: ['Must remain authentic', 'Avoid forced implementation'],
        personalizedRecommendations: contentAnalysis.voiceProfile.uniqueElements
      });
    }

    return insights;
  }

  /**
   * Generate audience engagement insights
   */
  private generateAudienceEngagementInsights(
    personalityAnalysis: PersonalityAnalysisResult,
    performanceAnalysis: PerformanceAnalysisResult
  ): DynamicInsight[] {
    const insights: DynamicInsight[] = [];

    // Top personality trait insight
    const topTrait = personalityAnalysis.personalityTraits[0];
    if (topTrait && topTrait.strength > 70) {
      insights.push({
        id: 'personality-strength-leverage',
        category: 'audience_engagement',
        priority: 'high',
        title: `Leverage Your ${topTrait.trait} for Deeper Audience Connection`,
        description: `Your ${topTrait.trait.toLowerCase()} is a core strength (${topTrait.strength}/100) that creates unique audience resonance.`,
        evidenceBased: {
          dataPoints: [
            `${topTrait.strength}/100 strength score for ${topTrait.trait}`,
            `${topTrait.audienceImpact} audience impact`,
            `Evidence across ${topTrait.evidence.length} content instances`
          ],
          supportingVideos: [], // Would need to extract from evidence
          statisticalSupport: `${topTrait.trait} consistently demonstrates ${topTrait.audienceImpact} audience response`
        },
        actionableSteps: [
          {
            step: `Consciously showcase ${topTrait.trait.toLowerCase()} in upcoming content`,
            difficulty: 'easy',
            timeToImplement: 'Immediate',
            expectedImpact: 'Enhanced audience connection'
          },
          {
            step: 'Create content series highlighting this strength',
            difficulty: 'medium',
            timeToImplement: '2-3 weeks',
            expectedImpact: 'Brand differentiation'
          }
        ],
        potentialImpact: {
          viewsIncrease: '15-25%',
          engagementBoost: '40-60%',
          audienceGrowth: '25-40%'
        },
        successMetrics: ['Comment quality improvement', 'Audience retention', 'Community growth'],
        riskFactors: ['Avoid overemphasizing single trait'],
        personalizedRecommendations: [topTrait.manifestation]
      });
    }

    // Engagement pattern insights
    const topEngagementPattern = performanceAnalysis.engagementPatterns[0];
    if (topEngagementPattern && topEngagementPattern.effectivenessScore > 120) {
      insights.push({
        id: 'engagement-pattern-optimization',
        category: 'audience_engagement',
        priority: 'medium',
        title: `Maximize ${topEngagementPattern.engagementType} for Superior Results`,
        description: `Your ${topEngagementPattern.engagementType.toLowerCase()} approach achieves ${topEngagementPattern.effectivenessScore}% effectiveness.`,
        evidenceBased: {
          dataPoints: [
            `${topEngagementPattern.effectivenessScore}% effectiveness score`,
            `${topEngagementPattern.audienceResponse.engagement} audience engagement`,
            `${topEngagementPattern.audienceResponse.retention} retention rates`
          ],
          supportingVideos: [],
          statisticalSupport: 'Based on engagement pattern analysis across content'
        },
        actionableSteps: [
          {
            step: topEngagementPattern.implementationStrategy,
            difficulty: 'medium',
            timeToImplement: '1-2 weeks',
            expectedImpact: 'Improved engagement metrics'
          }
        ],
        potentialImpact: {
          viewsIncrease: '10-20%',
          engagementBoost: '30-50%',
          audienceGrowth: '15-25%'
        },
        successMetrics: topEngagementPattern.measurableOutcomes,
        riskFactors: ['Requires consistent implementation'],
        personalizedRecommendations: [topEngagementPattern.implementationStrategy]
      });
    }

    return insights;
  }

  /**
   * Generate performance boost insights
   */
  private generatePerformanceBoostInsights(
    performanceAnalysis: PerformanceAnalysisResult,
    channelData: EnhancedChannelData
  ): DynamicInsight[] {
    const insights: DynamicInsight[] = [];

    // Top success factor insight
    const topSuccessFactor = performanceAnalysis.successFactors[0];
    if (topSuccessFactor && topSuccessFactor.impact > 1.3) {
      insights.push({
        id: 'top-success-factor',
        category: 'performance_boost',
        priority: 'critical',
        title: `${topSuccessFactor.factor} Increases Views by ${Math.round((topSuccessFactor.impact - 1) * 100)}%`,
        description: `${topSuccessFactor.factor} is your most powerful performance driver with ${topSuccessFactor.impact.toFixed(1)}x multiplier effect.`,
        evidenceBased: {
          dataPoints: [
            `${topSuccessFactor.impact.toFixed(1)}x performance multiplier`,
            `${topSuccessFactor.frequency} videos demonstrate this factor`,
            `${topSuccessFactor.confidence} confidence level`
          ],
          supportingVideos: topSuccessFactor.evidence.positiveExamples.map(ex => ({
            title: ex.video.title,
            views: ex.video.viewCount,
            successFactor: `${ex.multiplier.toFixed(1)}x multiplier`
          })),
          statisticalSupport: `${topSuccessFactor.confidence} confidence based on ${topSuccessFactor.frequency} video sample`
        },
        actionableSteps: [
          {
            step: 'Apply this factor to next 5 videos',
            difficulty: 'easy',
            timeToImplement: 'Immediate',
            expectedImpact: `${Math.round((topSuccessFactor.impact - 1) * 100)}% view boost`
          },
          {
            step: 'Analyze why this factor works for your audience',
            difficulty: 'medium',
            timeToImplement: '1 week',
            expectedImpact: 'Deeper audience understanding'
          }
        ],
        potentialImpact: {
          viewsIncrease: `${Math.round((topSuccessFactor.impact - 1) * 100)}%`,
          engagementBoost: '20-35%',
          audienceGrowth: '15-30%'
        },
        successMetrics: ['View count improvement', 'Engagement rate increase'],
        riskFactors: ['Must maintain authenticity', 'Avoid overuse'],
        personalizedRecommendations: [topSuccessFactor.actionableInsight]
      });
    }

    // Optimization opportunity insight
    const topOpportunity = performanceAnalysis.optimizationOpportunities[0];
    if (topOpportunity && topOpportunity.potentialImpact > 25) {
      insights.push({
        id: 'optimization-opportunity',
        category: 'performance_boost',
        priority: 'high',
        title: `${topOpportunity.opportunity}: ${topOpportunity.potentialImpact}% Growth Potential`,
        description: `This ${topOpportunity.difficulty} optimization can boost performance by ${topOpportunity.potentialImpact}% within ${topOpportunity.timeframe}.`,
        evidenceBased: {
          dataPoints: [
            `${topOpportunity.potentialImpact}% estimated impact`,
            `${topOpportunity.difficulty} implementation difficulty`,
            `${topOpportunity.timeframe} timeframe for results`
          ],
          supportingVideos: [],
          statisticalSupport: 'Based on performance gap analysis and successful pattern identification'
        },
        actionableSteps: topOpportunity.specificActions.map(action => ({
          step: action,
          difficulty: topOpportunity.difficulty,
          timeToImplement: topOpportunity.timeframe === 'immediate' ? '1-3 days' : '1-2 weeks',
          expectedImpact: `Part of ${topOpportunity.potentialImpact}% total improvement`
        })),
        potentialImpact: {
          viewsIncrease: `${topOpportunity.potentialImpact}%`,
          engagementBoost: '15-25%',
          audienceGrowth: '10-20%'
        },
        successMetrics: topOpportunity.successMetrics,
        riskFactors: topOpportunity.riskFactors,
        personalizedRecommendations: topOpportunity.specificActions
      });
    }

    return insights;
  }

  /**
   * Generate competitive advantage insights
   */
  private generateCompetitiveAdvantageInsights(
    personalityAnalysis: PersonalityAnalysisResult,
    performanceAnalysis: PerformanceAnalysisResult
  ): DynamicInsight[] {
    const insights: DynamicInsight[] = [];

    // Brand archetype insight
    if (personalityAnalysis.brandArchetype) {
      insights.push({
        id: 'brand-archetype-advantage',
        category: 'competitive_advantage',
        priority: 'medium',
        title: `Your "${personalityAnalysis.brandArchetype}" Brand Archetype Creates Unique Position`,
        description: `As "${personalityAnalysis.brandArchetype}", you occupy a distinct position that attracts specific audience segments and builds strong loyalty.`,
        evidenceBased: {
          dataPoints: [
            `${personalityAnalysis.brandArchetype} archetype identification`,
            `${personalityAnalysis.personalityScore}/100 distinctiveness score`,
            'Unique positioning in competitive landscape'
          ],
          supportingVideos: [],
          statisticalSupport: 'Based on comprehensive personality and voice analysis'
        },
        actionableSteps: [
          {
            step: `Strengthen ${personalityAnalysis.brandArchetype} characteristics in content`,
            difficulty: 'medium',
            timeToImplement: '2-4 weeks',
            expectedImpact: 'Enhanced brand differentiation'
          },
          {
            step: 'Create content that reinforces this archetype',
            difficulty: 'medium',
            timeToImplement: 'Ongoing',
            expectedImpact: 'Stronger audience attraction and retention'
          }
        ],
        potentialImpact: {
          viewsIncrease: '15-25%',
          engagementBoost: '25-40%',
          audienceGrowth: '20-35%'
        },
        successMetrics: ['Brand recognition', 'Audience loyalty', 'Competitive differentiation'],
        riskFactors: ['Must remain authentic to personality'],
        personalizedRecommendations: personalityAnalysis.recommendedVoiceAdjustments
      });
    }

    // Competitive advantages insight
    if (performanceAnalysis.competitiveAdvantages.length > 0) {
      insights.push({
        id: 'competitive-advantages',
        category: 'competitive_advantage',
        priority: 'high',
        title: 'Your Unique Competitive Advantages',
        description: 'You have distinct advantages that create barriers for competitors and drive audience loyalty.',
        evidenceBased: {
          dataPoints: performanceAnalysis.competitiveAdvantages,
          supportingVideos: [],
          statisticalSupport: 'Based on performance analysis and unique pattern identification'
        },
        actionableSteps: [
          {
            step: 'Consciously emphasize these advantages in content',
            difficulty: 'easy',
            timeToImplement: 'Immediate',
            expectedImpact: 'Strengthened competitive position'
          },
          {
            step: 'Build content series around these advantages',
            difficulty: 'medium',
            timeToImplement: '2-3 weeks',
            expectedImpact: 'Market differentiation'
          }
        ],
        potentialImpact: {
          viewsIncrease: '20-30%',
          engagementBoost: '30-50%',
          audienceGrowth: '25-40%'
        },
        successMetrics: ['Market position', 'Audience loyalty', 'Brand strength'],
        riskFactors: ['Competitors may attempt to copy'],
        personalizedRecommendations: performanceAnalysis.competitiveAdvantages
      });
    }

    return insights;
  }

  /**
   * Categorize insights by priority and impact
   */
  private categorizeInsights(insights: DynamicInsight[]): DynamicInsight[] {
    return insights.sort((a, b) => {
      const priorityScore = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityScore[a.priority];
      const bPriority = priorityScore[b.priority];
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      // Secondary sort by potential impact
      const aImpact = this.parseImpactValue(a.potentialImpact.viewsIncrease);
      const bImpact = this.parseImpactValue(b.potentialImpact.viewsIncrease);
      
      return bImpact - aImpact;
    });
  }

  /**
   * Identify quick win opportunities
   */
  private identifyQuickWins(insights: DynamicInsight[]): DynamicInsight[] {
    return insights.filter(insight => 
      insight.actionableSteps.some(step => 
        step.difficulty === 'easy' && 
        (step.timeToImplement.includes('Immediate') || step.timeToImplement.includes('1 day'))
      )
    ).sort((a, b) => this.calculateInsightPriority(b) - this.calculateInsightPriority(a));
  }

  /**
   * Identify long-term strategic opportunities
   */
  private identifyLongTermStrategies(insights: DynamicInsight[]): DynamicInsight[] {
    return insights.filter(insight =>
      insight.category === 'competitive_advantage' ||
      insight.actionableSteps.some(step => 
        step.timeToImplement.includes('month') || 
        step.timeToImplement.includes('Ongoing')
      )
    ).sort((a, b) => this.calculateInsightPriority(b) - this.calculateInsightPriority(a));
  }

  /**
   * Calculate overall performance scores
   */
  private calculateOverallScore(
    performanceAnalysis: PerformanceAnalysisResult,
    personalityAnalysis: PersonalityAnalysisResult
  ): { current: number; potential: number; optimization: number } {
    const current = performanceAnalysis.performanceScore;
    const personalityStrength = personalityAnalysis.personalityScore;
    const potential = Math.min(current + (personalityStrength * 0.3), 95);
    const optimization = Math.round((potential - current) / potential * 100);

    return {
      current: Math.round(current),
      potential: Math.round(potential),
      optimization: Math.round(optimization)
    };
  }

  /**
   * Extract unique competitive advantages
   */
  private extractUniqueAdvantages(
    personalityAnalysis: PersonalityAnalysisResult,
    performanceAnalysis: PerformanceAnalysisResult
  ): string[] {
    return [
      ...performanceAnalysis.competitiveAdvantages,
      ...personalityAnalysis.personalityTraits.slice(0, 2).map(trait => trait.trait),
      personalityAnalysis.brandArchetype
    ].filter(Boolean).slice(0, 5);
  }

  /**
   * Build audience profile summary
   */
  private buildAudienceProfile(
    personalityAnalysis: PersonalityAnalysisResult,
    performanceAnalysis: PerformanceAnalysisResult
  ): ChannelDynamicAnalysis['audienceProfile'] {
    return {
      primaryCharacteristics: personalityAnalysis.audienceResonance.targetDemographic.interests,
      contentPreferences: personalityAnalysis.audienceResonance.contentExpectations.preferredFormats,
      engagementPatterns: performanceAnalysis.engagementPatterns.map(p => p.engagementType)
    };
  }

  /**
   * Build content strategy recommendations
   */
  private buildContentStrategy(
    contentAnalysis: ContentAnalysisResult,
    titleAnalysis: { channelStrategy: ChannelSpecificTitleStrategy },
    performanceAnalysis: PerformanceAnalysisResult
  ): ChannelDynamicAnalysis['contentStrategy'] {
    return {
      corePillars: contentAnalysis.contentPillars,
      contentGaps: performanceAnalysis.channelSpecificInsights.contentGaps,
      formatRecommendations: titleAnalysis.channelStrategy.audienceAlignedFormats
    };
  }

  /**
   * Generate prioritized next steps
   */
  private generateNextSteps(
    quickWins: DynamicInsight[],
    longTermStrategies: DynamicInsight[]
  ): ChannelDynamicAnalysis['nextSteps'] {
    const steps: ChannelDynamicAnalysis['nextSteps'] = [];
    
    // Add top quick wins
    quickWins.slice(0, 3).forEach((insight, index) => {
      const topStep = insight.actionableSteps[0];
      steps.push({
        action: topStep.step,
        priority: index + 1,
        timeline: topStep.timeToImplement
      });
    });

    // Add top long-term strategy
    if (longTermStrategies.length > 0) {
      const strategicStep = longTermStrategies[0].actionableSteps[0];
      steps.push({
        action: strategicStep.step,
        priority: 4,
        timeline: strategicStep.timeToImplement,
        dependency: 'Complete quick wins first'
      });
    }

    return steps;
  }

  // Helper utility methods

  private calculateInsightPriority(insight: DynamicInsight): number {
    const priorityWeight = { critical: 40, high: 30, medium: 20, low: 10 };
    const impactValue = this.parseImpactValue(insight.potentialImpact.viewsIncrease);
    return priorityWeight[insight.priority] + (impactValue * 0.5);
  }

  private parseImpactValue(impactString: string): number {
    const match = impactString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}