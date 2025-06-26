import { EnhancedVideoData } from './enhancedYouTubeAPI';

export interface TitleOptimizationInsight {
  pattern: string;
  description: string;
  performanceMultiplier: number;
  frequency: number;
  bestExamples: Array<{
    title: string;
    views: number;
    multiplier: number;
  }>;
  optimizationTips: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface TitleStructureAnalysis {
  optimalLength: {
    range: string;
    avgViews: number;
    recommendation: string;
  };
  wordChoicePatterns: {
    powerWords: Array<{ word: string; avgMultiplier: number; frequency: number }>;
    emotionalTriggers: Array<{ trigger: string; avgViews: number; examples: string[] }>;
    personalPronouns: {
      usage: number;
      effectiveness: number;
      bestUsage: string;
    };
  };
  structuralElements: {
    punctuation: Array<{ element: string; effectiveness: number; usage: string }>;
    capitalization: {
      allCaps: { effectiveness: number; usage: number };
      titleCase: { effectiveness: number; usage: number };
      sentenceCase: { effectiveness: number; usage: number };
    };
    brackets: { effectiveness: number; commonUsage: string[] };
  };
  hookAnalysis: {
    questionHooks: { effectiveness: number; bestTypes: string[] };
    contrarian: { effectiveness: number; examples: string[] };
    curiosityGaps: { effectiveness: number; techniques: string[] };
    urgency: { effectiveness: number; words: string[] };
  };
}

export interface ChannelSpecificTitleStrategy {
  uniqueSuccessPatterns: string[];
  channelSpecificOptimizations: string[];
  audienceAlignedFormats: string[];
  competitiveAdvantage: string;
  nextVideoSuggestions: string[];
}

export class TitlePatternAnalyzer {

  /**
   * Analyze title optimization opportunities for a specific channel
   */
  analyzeTitleOptimization(videos: EnhancedVideoData[]): {
    insights: TitleOptimizationInsight[];
    structureAnalysis: TitleStructureAnalysis;
    channelStrategy: ChannelSpecificTitleStrategy;
  } {
    const topPerformers = this.getTopPerformers(videos);
    const avgViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;

    return {
      insights: this.generateOptimizationInsights(videos, avgViews),
      structureAnalysis: this.analyzeStructuralElements(videos, avgViews),
      channelStrategy: this.createChannelSpecificStrategy(videos, topPerformers)
    };
  }

  /**
   * Generate specific title optimization insights
   */
  private generateOptimizationInsights(videos: EnhancedVideoData[], avgViews: number): TitleOptimizationInsight[] {
    const insights: TitleOptimizationInsight[] = [];
    
    // Analyze question patterns
    const questionVideos = videos.filter(v => v.title.includes('?'));
    if (questionVideos.length >= 2) {
      const questionAvgViews = questionVideos.reduce((sum, v) => sum + v.viewCount, 0) / questionVideos.length;
      const multiplier = questionAvgViews / avgViews;
      
      insights.push({
        pattern: 'Question-Based Titles',
        description: 'Titles ending with question marks to create curiosity',
        performanceMultiplier: multiplier,
        frequency: questionVideos.length,
        bestExamples: questionVideos
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 3)
          .map(v => ({
            title: v.title,
            views: v.viewCount,
            multiplier: v.viewCount / avgViews
          })),
        optimizationTips: this.generateQuestionOptimizationTips(questionVideos),
        confidence: this.calculateConfidence(questionVideos.length, videos.length)
      });
    }

    // Analyze personal address patterns
    const personalVideos = videos.filter(v => 
      /\b(you|your|my|i'm|me)\b/i.test(v.title)
    );
    if (personalVideos.length >= 2) {
      const personalAvgViews = personalVideos.reduce((sum, v) => sum + v.viewCount, 0) / personalVideos.length;
      const multiplier = personalAvgViews / avgViews;
      
      insights.push({
        pattern: 'Personal Address',
        description: 'Direct personal pronouns creating connection with viewer',
        performanceMultiplier: multiplier,
        frequency: personalVideos.length,
        bestExamples: personalVideos
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 3)
          .map(v => ({
            title: v.title,
            views: v.viewCount,
            multiplier: v.viewCount / avgViews
          })),
        optimizationTips: this.generatePersonalOptimizationTips(personalVideos),
        confidence: this.calculateConfidence(personalVideos.length, videos.length)
      });
    }

    // Analyze rating/interactive patterns
    const ratingVideos = videos.filter(v => 
      /\b(rating|rate|ranking|review)\b/i.test(v.title)
    );
    if (ratingVideos.length >= 2) {
      const ratingAvgViews = ratingVideos.reduce((sum, v) => sum + v.viewCount, 0) / ratingVideos.length;
      const multiplier = ratingAvgViews / avgViews;
      
      insights.push({
        pattern: 'Rating/Interactive Format',
        description: 'Interactive content that invites audience participation',
        performanceMultiplier: multiplier,
        frequency: ratingVideos.length,
        bestExamples: ratingVideos
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 3)
          .map(v => ({
            title: v.title,
            views: v.viewCount,
            multiplier: v.viewCount / avgViews
          })),
        optimizationTips: this.generateRatingOptimizationTips(ratingVideos),
        confidence: this.calculateConfidence(ratingVideos.length, videos.length)
      });
    }

    // Analyze numbered content patterns
    const numberedVideos = videos.filter(v => /\b\d+\b/.test(v.title));
    if (numberedVideos.length >= 2) {
      const numberedAvgViews = numberedVideos.reduce((sum, v) => sum + v.viewCount, 0) / numberedVideos.length;
      const multiplier = numberedAvgViews / avgViews;
      
      insights.push({
        pattern: 'Numbered Lists',
        description: 'Titles with specific numbers promise structured content',
        performanceMultiplier: multiplier,
        frequency: numberedVideos.length,
        bestExamples: numberedVideos
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, 3)
          .map(v => ({
            title: v.title,
            views: v.viewCount,
            multiplier: v.viewCount / avgViews
          })),
        optimizationTips: this.generateNumberedOptimizationTips(numberedVideos),
        confidence: this.calculateConfidence(numberedVideos.length, videos.length)
      });
    }

    return insights
      .filter(insight => insight.frequency >= 2)
      .sort((a, b) => b.performanceMultiplier - a.performanceMultiplier)
      .slice(0, 8);
  }

  /**
   * Analyze structural elements of titles
   */
  private analyzeStructuralElements(videos: EnhancedVideoData[], avgViews: number): TitleStructureAnalysis {
    return {
      optimalLength: this.analyzeTitleLength(videos, avgViews),
      wordChoicePatterns: this.analyzeWordChoices(videos, avgViews),
      structuralElements: this.analyzeStructure(videos, avgViews),
      hookAnalysis: this.analyzeHooks(videos, avgViews)
    };
  }

  /**
   * Analyze optimal title length
   */
  private analyzeTitleLength(videos: EnhancedVideoData[], avgViews: number): TitleStructureAnalysis['optimalLength'] {
    const lengthBuckets = {
      'Short (≤30 chars)': videos.filter(v => v.title.length <= 30),
      'Medium (31-60 chars)': videos.filter(v => v.title.length > 30 && v.title.length <= 60),
      'Long (61-80 chars)': videos.filter(v => v.title.length > 60 && v.title.length <= 80),
      'Very Long (>80 chars)': videos.filter(v => v.title.length > 80)
    };

    let bestRange = 'Medium (31-60 chars)';
    let bestAvgViews = 0;

    for (const [range, vids] of Object.entries(lengthBuckets)) {
      if (vids.length >= 2) {
        const avgViews = vids.reduce((sum, v) => sum + v.viewCount, 0) / vids.length;
        if (avgViews > bestAvgViews) {
          bestAvgViews = avgViews;
          bestRange = range;
        }
      }
    }

    return {
      range: bestRange,
      avgViews: Math.round(bestAvgViews),
      recommendation: this.generateLengthRecommendation(bestRange, bestAvgViews, avgViews)
    };
  }

  /**
   * Analyze word choice patterns
   */
  private analyzeWordChoices(videos: EnhancedVideoData[], avgViews: number): TitleStructureAnalysis['wordChoicePatterns'] {
    const powerWords = this.analyzePowerWords(videos, avgViews);
    const emotionalTriggers = this.analyzeEmotionalTriggers(videos, avgViews);
    const personalPronouns = this.analyzePersonalPronouns(videos, avgViews);

    return {
      powerWords,
      emotionalTriggers,
      personalPronouns
    };
  }

  /**
   * Analyze power words performance
   */
  private analyzePowerWords(videos: EnhancedVideoData[], avgViews: number): Array<{ word: string; avgMultiplier: number; frequency: number }> {
    const powerWords = [
      'ultimate', 'best', 'worst', 'secret', 'hidden', 'shocking', 'amazing', 
      'incredible', 'unbelievable', 'insane', 'crazy', 'perfect', 'ultimate',
      'honest', 'brutal', 'real', 'truth', 'exposed', 'revealed'
    ];

    return powerWords
      .map(word => {
        const matchingVideos = videos.filter(v => 
          v.title.toLowerCase().includes(word.toLowerCase())
        );
        
        if (matchingVideos.length < 2) return null;
        
        const avgViewsForWord = matchingVideos.reduce((sum, v) => sum + v.viewCount, 0) / matchingVideos.length;
        
        return {
          word,
          avgMultiplier: avgViewsForWord / avgViews,
          frequency: matchingVideos.length
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.avgMultiplier - a!.avgMultiplier)
      .slice(0, 10) as Array<{ word: string; avgMultiplier: number; frequency: number }>;
  }

  /**
   * Analyze emotional triggers
   */
  private analyzeEmotionalTriggers(videos: EnhancedVideoData[], avgViews: number): Array<{ trigger: string; avgViews: number; examples: string[] }> {
    const triggers = [
      { name: 'Excitement', words: ['amazing', 'incredible', 'awesome', 'fantastic'] },
      { name: 'Shock', words: ['shocking', 'unbelievable', 'insane', 'crazy'] },
      { name: 'Curiosity', words: ['secret', 'hidden', 'revealed', 'exposed'] },
      { name: 'Authority', words: ['expert', 'professional', 'proven', 'tested'] },
      { name: 'Authenticity', words: ['honest', 'real', 'genuine', 'truth'] }
    ];

    return triggers
      .map(trigger => {
        const matchingVideos = videos.filter(v => 
          trigger.words.some(word => v.title.toLowerCase().includes(word))
        );
        
        if (matchingVideos.length < 1) return null;
        
        return {
          trigger: trigger.name,
          avgViews: matchingVideos.reduce((sum, v) => sum + v.viewCount, 0) / matchingVideos.length,
          examples: matchingVideos.slice(0, 2).map(v => v.title)
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.avgViews - a!.avgViews) as Array<{ trigger: string; avgViews: number; examples: string[] }>;
  }

  /**
   * Analyze personal pronouns usage
   */
  private analyzePersonalPronouns(videos: EnhancedVideoData[], avgViews: number): TitleStructureAnalysis['wordChoicePatterns']['personalPronouns'] {
    const personalVideos = videos.filter(v => /\b(you|your|my|i|me)\b/i.test(v.title));
    const usage = personalVideos.length / videos.length;
    const effectiveness = personalVideos.length > 0 
      ? (personalVideos.reduce((sum, v) => sum + v.viewCount, 0) / personalVideos.length) / avgViews
      : 0;

    let bestUsage = 'Moderate use recommended';
    if (effectiveness > 1.2) bestUsage = 'High personal pronoun usage effective for this channel';
    if (effectiveness < 0.8) bestUsage = 'Consider reducing personal pronoun usage';

    return {
      usage: Math.round(usage * 100),
      effectiveness: Math.round(effectiveness * 100) / 100,
      bestUsage
    };
  }

  /**
   * Analyze structural elements
   */
  private analyzeStructure(videos: EnhancedVideoData[], avgViews: number): TitleStructureAnalysis['structuralElements'] {
    const punctuationAnalysis = this.analyzePunctuation(videos, avgViews);
    const capitalizationAnalysis = this.analyzeCapitalization(videos, avgViews);
    const bracketsAnalysis = this.analyzeBrackets(videos, avgViews);

    return {
      punctuation: punctuationAnalysis,
      capitalization: capitalizationAnalysis,
      brackets: bracketsAnalysis
    };
  }

  /**
   * Create channel-specific title strategy
   */
  private createChannelSpecificStrategy(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): ChannelSpecificTitleStrategy {
    const uniquePatterns = this.identifyUniqueSuccessPatterns(topPerformers);
    const optimizations = this.generateChannelOptimizations(videos, topPerformers);
    const audienceFormats = this.identifyAudienceAlignedFormats(topPerformers);
    const advantage = this.identifyCompetitiveAdvantage(topPerformers);
    const suggestions = this.generateNextVideoSuggestions(topPerformers);

    return {
      uniqueSuccessPatterns: uniquePatterns,
      channelSpecificOptimizations: optimizations,
      audienceAlignedFormats: audienceFormats,
      competitiveAdvantage: advantage,
      nextVideoSuggestions: suggestions
    };
  }

  // Helper methods for optimization tips
  private generateQuestionOptimizationTips(videos: EnhancedVideoData[]): string[] {
    const tips = ['Use specific questions that address viewer pain points'];
    
    const topQuestionVideo = videos.sort((a, b) => b.viewCount - a.viewCount)[0];
    if (topQuestionVideo) {
      tips.push(`Follow pattern like "${topQuestionVideo.title}" - direct and engaging`);
    }
    
    tips.push('Place question at end of title for maximum curiosity gap');
    return tips;
  }

  private generatePersonalOptimizationTips(videos: EnhancedVideoData[]): string[] {
    return [
      'Use "you" to directly address viewer needs and problems',
      'Include "my" when sharing personal experiences or opinions',
      'Balance personal pronouns - avoid overuse in every title'
    ];
  }

  private generateRatingOptimizationTips(videos: EnhancedVideoData[]): string[] {
    return [
      'Include specific rating scales (1-10, A-F) for clarity',
      'Mention what is being rated in the title',
      'Use "honest" or "brutal" to set expectation for authenticity'
    ];
  }

  private generateNumberedOptimizationTips(videos: EnhancedVideoData[]): string[] {
    return [
      'Use odd numbers (3, 5, 7) which perform better than even numbers',
      'Keep numbers reasonable and achievable',
      'Front-load the number in your title when possible'
    ];
  }

  private generateLengthRecommendation(bestRange: string, bestAvgViews: number, avgViews: number): string {
    const multiplier = bestAvgViews / avgViews;
    return `${bestRange} titles perform ${multiplier.toFixed(1)}x better for your channel`;
  }

  private identifyUniqueSuccessPatterns(topPerformers: EnhancedVideoData[]): string[] {
    const patterns: string[] = [];
    const titles = topPerformers.map(v => v.title.toLowerCase());
    
    if (titles.some(t => t.includes('rating') && t.includes('subscribers'))) {
      patterns.push('Interactive subscriber rating format unique to channel personality');
    }
    
    if (titles.some(t => t.includes('honest') || t.includes('brutal'))) {
      patterns.push('Brutally honest critique style builds audience trust');
    }
    
    if (titles.some(t => t.includes('debloat') || t.includes('looksmax'))) {
      patterns.push('Specialized beauty/improvement terminology attracts niche audience');
    }
    
    return patterns;
  }

  private generateChannelOptimizations(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): string[] {
    const optimizations: string[] = [];
    
    const avgTitleLength = topPerformers.reduce((sum, v) => sum + v.title.length, 0) / topPerformers.length;
    optimizations.push(`Maintain ${Math.round(avgTitleLength)} character titles for optimal performance`);
    
    const hasQuestions = topPerformers.some(v => v.title.includes('?'));
    if (hasQuestions) {
      optimizations.push('Continue using question format - highly effective for your audience');
    }
    
    return optimizations;
  }

  private identifyAudienceAlignedFormats(topPerformers: EnhancedVideoData[]): string[] {
    const formats: string[] = [];
    const titles = topPerformers.map(v => v.title.toLowerCase());
    
    if (titles.some(t => t.includes('rating'))) {
      formats.push('"Rating [Subject]" format for community engagement');
    }
    
    if (titles.some(t => t.includes('tips'))) {
      formats.push('"X Tips for [Goal]" format for educational content');
    }
    
    if (titles.some(t => t.includes('how to'))) {
      formats.push('"How to [Action]" format for tutorial content');
    }
    
    return formats;
  }

  private identifyCompetitiveAdvantage(topPerformers: EnhancedVideoData[]): string {
    const titles = topPerformers.map(v => v.title.toLowerCase()).join(' ');
    
    if (titles.includes('honest') && titles.includes('rating')) {
      return 'Unique combination of brutal honesty with interactive community rating creates authentic entertainment value';
    }
    
    if (titles.includes('subscribers') && titles.includes('rating')) {
      return 'Direct subscriber interaction through rating format builds unbreakable community bonds';
    }
    
    return 'Consistent authentic voice and interactive format creates loyal audience engagement';
  }

  private generateNextVideoSuggestions(topPerformers: EnhancedVideoData[]): string[] {
    const suggestions: string[] = [];
    const successfulPatterns = topPerformers.map(v => v.title);
    
    if (successfulPatterns.some(title => title.toLowerCase().includes('rating'))) {
      suggestions.push('Rating My Subscribers\' [New Topic] + Giving Honest Feedback');
      suggestions.push('[Number] [Topic] Tips I Wish I Knew Sooner');
    }
    
    suggestions.push('How To [Improvement Goal] (Ultimate Guide)');
    suggestions.push('Honest [Subject] Review - Is It Worth It?');
    
    return suggestions.slice(0, 4);
  }

  // Utility methods
  private getTopPerformers(videos: EnhancedVideoData[], percentage: number = 0.3): EnhancedVideoData[] {
    return videos
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, Math.max(1, Math.floor(videos.length * percentage)));
  }

  private calculateConfidence(frequency: number, totalVideos: number): 'high' | 'medium' | 'low' {
    const ratio = frequency / totalVideos;
    if (ratio >= 0.3) return 'high';
    if (ratio >= 0.15) return 'medium';
    return 'low';
  }

  private analyzePunctuation(videos: EnhancedVideoData[], avgViews: number): Array<{ element: string; effectiveness: number; usage: string }> {
    const punctuationElements = [
      { symbol: '?', name: 'Question Mark' },
      { symbol: '!', name: 'Exclamation Point' },
      { symbol: '...', name: 'Ellipsis' },
      { symbol: ':', name: 'Colon' }
    ];

    return punctuationElements.map(elem => {
      const matchingVideos = videos.filter(v => v.title.includes(elem.symbol));
      const effectiveness = matchingVideos.length > 0 
        ? (matchingVideos.reduce((sum, v) => sum + v.viewCount, 0) / matchingVideos.length) / avgViews
        : 0;
      
      let usage = 'Not used';
      if (matchingVideos.length > 0) {
        usage = effectiveness > 1.1 ? 'Highly effective' : effectiveness > 0.9 ? 'Moderately effective' : 'Less effective';
      }

      return {
        element: elem.name,
        effectiveness: Math.round(effectiveness * 100) / 100,
        usage
      };
    });
  }

  private analyzeCapitalization(videos: EnhancedVideoData[], avgViews: number): TitleStructureAnalysis['structuralElements']['capitalization'] {
    const allCapsVideos = videos.filter(v => /[A-Z]{3,}/.test(v.title));
    const titleCaseVideos = videos.filter(v => /^[A-Z][a-z]/.test(v.title));
    const sentenceCaseVideos = videos.filter(v => /^[a-z]/.test(v.title));

    const calculateEffectiveness = (vids: EnhancedVideoData[]) => 
      vids.length > 0 ? (vids.reduce((sum, v) => sum + v.viewCount, 0) / vids.length) / avgViews : 0;

    return {
      allCaps: {
        effectiveness: Math.round(calculateEffectiveness(allCapsVideos) * 100) / 100,
        usage: allCapsVideos.length
      },
      titleCase: {
        effectiveness: Math.round(calculateEffectiveness(titleCaseVideos) * 100) / 100,
        usage: titleCaseVideos.length
      },
      sentenceCase: {
        effectiveness: Math.round(calculateEffectiveness(sentenceCaseVideos) * 100) / 100,
        usage: sentenceCaseVideos.length
      }
    };
  }

  private analyzeBrackets(videos: EnhancedVideoData[], avgViews: number): { effectiveness: number; commonUsage: string[] } {
    const bracketVideos = videos.filter(v => /[\[\(]/.test(v.title));
    const effectiveness = bracketVideos.length > 0 
      ? (bracketVideos.reduce((sum, v) => sum + v.viewCount, 0) / bracketVideos.length) / avgViews
      : 0;

    const commonUsage = bracketVideos
      .map(v => {
        const match = v.title.match(/[\[\(]([^[\]\)]+)[\]\)]/);
        return match ? match[1] : '';
      })
      .filter(usage => usage)
      .slice(0, 3);

    return {
      effectiveness: Math.round(effectiveness * 100) / 100,
      commonUsage
    };
  }

  private analyzeHooks(videos: EnhancedVideoData[], avgViews: number): TitleStructureAnalysis['hookAnalysis'] {
    const questionHooks = videos.filter(v => v.title.includes('?'));
    const contrarian = videos.filter(v => /\b(wrong|myth|truth|reality|actually)\b/i.test(v.title));
    const curiosityGaps = videos.filter(v => /\b(secret|hidden|never|nobody|everyone)\b/i.test(v.title));
    const urgency = videos.filter(v => /\b(now|today|immediately|urgent|quick)\b/i.test(v.title));

    const analyzeHookType = (vids: EnhancedVideoData[]) => ({
      effectiveness: vids.length > 0 ? (vids.reduce((sum, v) => sum + v.viewCount, 0) / vids.length) / avgViews : 0,
      count: vids.length
    });

    return {
      questionHooks: {
        effectiveness: Math.round(analyzeHookType(questionHooks).effectiveness * 100) / 100,
        bestTypes: questionHooks.length > 0 ? ['Direct questions', 'Problem-focused questions'] : []
      },
      contrarian: {
        effectiveness: Math.round(analyzeHookType(contrarian).effectiveness * 100) / 100,
        examples: contrarian.slice(0, 2).map(v => v.title)
      },
      curiosityGaps: {
        effectiveness: Math.round(analyzeHookType(curiosityGaps).effectiveness * 100) / 100,
        techniques: curiosityGaps.length > 0 ? ['Secret information', 'Hidden knowledge'] : []
      },
      urgency: {
        effectiveness: Math.round(analyzeHookType(urgency).effectiveness * 100) / 100,
        words: urgency.length > 0 ? ['now', 'today', 'urgent'] : []
      }
    };
  }
}