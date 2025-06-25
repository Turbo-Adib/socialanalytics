import { VideoData } from '@/src/lib/videoAnalyzer';

export interface OutlierVideo extends VideoData {
  multiplier: number; // How many times above average
  patternTags: string[]; // Detected patterns in this video
}

export interface PatternInsight {
  pattern: string; // e.g., "How to"
  description: string; // e.g., "Videos with 'How to' in title"
  avgMultiplier: number; // Average performance multiplier
  videoCount: number; // Number of videos with this pattern
  examples: string[]; // Example video titles
  avgViews: number; // Average view count for this pattern
  topPerformingExample: OutlierVideo; // Best performing video with this pattern
}

export interface TopicInsight {
  topic: string;
  avgViews: number;
  count: number;
  examples: OutlierVideo[];
  // Enhanced analysis fields
  audienceAppeal: string;
  successFactors: string[];
  recommendedActions: string[];
  trendDirection: 'rising' | 'stable' | 'declining';
  competitiveAdvantage: string;
  performanceScore: number; // 1-10 scale
}

export interface ContentTimingAnalysis {
  optimalLength: {
    range: string;
    avgViews: number;
    description: string;
  };
  uploadTiming: {
    bestDays: string[];
    worstDays: string[];
    insight: string;
  };
  seriesVsStandalone: {
    seriesPerformance: number;
    standalonePerformance: number;
    recommendation: string;
  };
}

export interface FormatAnalysis {
  totalVideos: number;
  averageViews: number;
  outliers: OutlierVideo[];
  patterns: PatternInsight[];
  recommendations: string[];
  bestPerformingTopics: TopicInsight[];
  titleAnalysis: {
    avgTitleLength: number;
    mostCommonWords: { word: string; count: number; avgViews: number }[];
    titleFormats: { format: string; count: number; avgViews: number; examples: string[] }[];
  };
  contentSpecs: ContentTimingAnalysis;
}

export interface AnalysisResults {
  longform: FormatAnalysis;
  shorts: FormatAnalysis;
  combined: {
    totalVideos: number;
    crossFormatInsights: string[];
  };
}

export class PatternAnalyzer {
  private readonly TOP_PERFORMERS_COUNT = 10; // Show top 10 videos by views

  /**
   * Calculate average views for a set of videos
   */
  private calculateAverageViews(videos: VideoData[]): number {
    if (videos.length === 0) return 0;
    const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
    return Math.round(totalViews / videos.length);
  }

  /**
   * Find top performing videos (top 5-10 by view count)
   */
  private findTopPerformers(videos: VideoData[], averageViews: number): OutlierVideo[] {
    if (videos.length === 0) return [];

    // Sort all videos by view count and take top performers
    const sortedVideos = videos
      .map(video => ({
        ...video,
        multiplier: averageViews > 0 ? Number((video.viewCount / averageViews).toFixed(1)) : 1,
        patternTags: this.extractPatternsFromTitle(video.title),
      }))
      .sort((a, b) => b.viewCount - a.viewCount);

    // Return top 5-10 videos, but ensure we have at least 5 if possible
    const minCount = Math.min(5, videos.length);
    const maxCount = Math.min(this.TOP_PERFORMERS_COUNT, videos.length);
    
    // If we have fewer than 10 videos, return all
    // If we have 10+, return the top 10
    return sortedVideos.slice(0, maxCount);
  }

  /**
   * Enhanced pattern extraction with power words, title structures, and emotional triggers
   */
  private extractPatternsFromTitle(title: string): string[] {
    const patterns: string[] = [];
    const lowercaseTitle = title.toLowerCase();

    // ADVANCED TITLE STRUCTURES
    const titleStructures = {
      // Listicle formats
      'numbered-list': /\b\d+\s+(ways|reasons|tips|tricks|things|secrets|mistakes|facts|steps)\b/,
      'ultimate-guide': /\b(ultimate|complete|comprehensive|definitive)\s+(guide|tutorial|course)\b/,
      
      // Question formats
      'why-question': /^why\s+/,
      'how-question': /^how\s+/,
      'what-question': /^what\s+/,
      'which-question': /^which\s+/,
      
      // Comparison structures
      'vs-comparison': /\bvs\.?\b|\bversus\b/,
      'better-than': /\b(better than|beats|destroys|crushes)\b/,
      'alternative': /\b(alternative|replacement|substitute)\s+to\b/,
      
      // Time-based promises
      'time-specific': /\bin\s+\d+\s+(minutes?|seconds?|hours?|days?)\b/,
      'quick-format': /\b(quick|fast|rapid|instant|immediate)\b/,
      
      // Authority patterns
      'expert-says': /\b(expert|pro|professional|guru|master)\s+(says|reveals|explains)\b/,
      'insider-info': /\b(insider|behind.scenes|secret|exclusive|leaked)\b/,
      
      // Social proof
      'trending': /\b(viral|trending|popular|everyone.is|millions.of)\b/,
      'tested': /\b(tested|tried|reviewed|analyzed|compared)\b/,
    };

    // POWER WORDS & EMOTIONAL TRIGGERS
    const powerWords = {
      // Urgency triggers
      'urgency': /\b(now|urgent|immediately|before|deadline|limited|expires|ending)\b/,
      'scarcity': /\b(only|exclusive|rare|limited|few|secret|hidden|private)\b/,
      
      // Curiosity gaps
      'curiosity': /\b(secret|hidden|truth|reality|exposed|revealed|shocking|surprising)\b/,
      'intrigue': /\b(you.won.t.believe|will.shock.you|nobody.tells.you|they.don.t.want)\b/,
      
      // Achievement promises
      'transformation': /\b(transform|change|improve|boost|increase|maximize|optimize)\b/,
      'mastery': /\b(master|dominate|crush|destroy|demolish|obliterate)\b/,
      
      // Negative emotion (problems)
      'problem-focused': /\b(mistake|error|wrong|avoid|stop|quit|fail|terrible|worst)\b/,
      'frustration': /\b(annoying|frustrating|difficult|hard|impossible|struggle)\b/,
      
      // Positive emotion (solutions)
      'easy-solution': /\b(easy|simple|effortless|automatic|foolproof|guaranteed)\b/,
      'success-oriented': /\b(success|win|profit|gain|achieve|accomplish|reach)\b/,
    };

    // CONTENT TYPE PATTERNS (Enhanced)
    const contentTypes = {
      'tutorial': /\b(tutorial|how.to|step.by.step|walkthrough|guide)\b/,
      'review': /\b(review|unboxing|first.look|hands.on|tested)\b/,
      'reaction': /\b(reaction|responds?|reacts?|watches|listens)\b/,
      'challenge': /\b(challenge|attempt|trying|experiment|test)\b/,
      'educational': /\b(explain|learn|understand|teach|course|lesson)\b/,
      'entertainment': /\b(funny|hilarious|comedy|prank|meme|troll)\b/,
    };

    // FORMAT INDICATORS
    const formatIndicators = {
      'series-content': /\b(part\s*\d+|episode\s*\d+|chapter\s*\d+|season\s*\d+)\b/,
      'live-content': /\b(live|streaming|stream|broadcast)\b/,
      'update-content': /\b(update|news|announcement|breaking|latest)\b/,
      'collaboration': /\b(with|featuring|ft\.?|collaboration|collab|guest)\b/,
    };

    // SHORTS-SPECIFIC PATTERNS
    const shortsPatterns = {
      'pov-content': /\bpov:\s*/,
      'when-scenario': /\b(when|me.when|that.moment.when)\b/,
      'mood-content': /\bmood:\s*/,
      'wait-reveal': /\b(wait.for.it|plot.twist|unexpected|surprise)\b/,
      'quick-tip': /\b(quick.tip|life.hack|pro.tip|did.you.know)\b/,
      'trend-format': /\b(tell.me|show.me|pov|this.or.that|choose.your)\b/,
    };

    // Extract all patterns
    const allPatternMaps = {
      ...titleStructures,
      ...powerWords,
      ...contentTypes,
      ...formatIndicators,
      ...shortsPatterns
    };

    for (const [pattern, regex] of Object.entries(allPatternMaps)) {
      if (regex.test(lowercaseTitle)) {
        patterns.push(pattern);
      }
    }

    // SPECIAL STRUCTURE DETECTION
    
    // Clickbait structure detection
    if (/\b(you.won.t.believe|will.blow.your.mind|doctors.hate|one.weird.trick)\b/.test(lowercaseTitle)) {
      patterns.push('clickbait-structure');
    }
    
    // Authority mentioning
    if (/\b(according.to|study.shows|research.proves|scientists.say)\b/.test(lowercaseTitle)) {
      patterns.push('authority-backed');
    }
    
    // Personal story indicators
    if (/\b(my|i\s+|personal|story|experience|journey)\b/.test(lowercaseTitle)) {
      patterns.push('personal-story');
    }
    
    // Call-to-action patterns
    if (/\b(watch|see|check|look|discover|find.out|learn)\b/.test(lowercaseTitle)) {
      patterns.push('cta-driven');
    }

    return patterns;
  }

  /**
   * Analyze patterns across top performing videos
   */
  private analyzePatterns(topPerformers: OutlierVideo[]): PatternInsight[] {
    const patternStats = new Map<string, {
      videos: OutlierVideo[];
      totalMultiplier: number;
    }>();

    // Collect pattern statistics from top performers
    topPerformers.forEach(video => {
      video.patternTags.forEach(pattern => {
        if (!patternStats.has(pattern)) {
          patternStats.set(pattern, { videos: [], totalMultiplier: 0 });
        }
        const stats = patternStats.get(pattern)!;
        stats.videos.push(video);
        stats.totalMultiplier += video.multiplier;
      });
    });

    // Convert to insights, sorted by average views (not multiplier)
    const insights: PatternInsight[] = Array.from(patternStats.entries())
      .filter(([_, stats]) => stats.videos.length >= 1) // Lower threshold since we have fewer top performers
      .map(([pattern, stats]) => {
        const sortedVideos = stats.videos.sort((a, b) => b.viewCount - a.viewCount);
        const avgViews = Math.round(stats.videos.reduce((sum, v) => sum + v.viewCount, 0) / stats.videos.length);
        
        return {
          pattern,
          description: this.getPatternDescription(pattern),
          avgMultiplier: Number((stats.totalMultiplier / stats.videos.length).toFixed(1)),
          videoCount: stats.videos.length,
          examples: stats.videos.slice(0, 3).map(v => v.title),
          avgViews,
          topPerformingExample: sortedVideos[0]
        };
      })
      .sort((a, b) => b.avgViews - a.avgViews) // Sort by average views instead of multiplier
      .slice(0, 10); // Top 10 patterns

    return insights;
  }

  /**
   * Get human-readable description for enhanced patterns
   */
  private getPatternDescription(pattern: string): string {
    const descriptions: Record<string, string> = {
      // Advanced Title Structures
      'numbered-list': 'Numbered lists (X ways/reasons/tips)',
      'ultimate-guide': 'Ultimate/Complete guide format',
      'why-question': 'Why-based question titles',
      'how-question': 'How-based question titles',
      'what-question': 'What-based question titles',
      'which-question': 'Which-based question titles',
      'vs-comparison': 'Direct comparison videos (X vs Y)',
      'better-than': 'Superiority claims (better than/beats)',
      'alternative': 'Alternative solution content',
      'time-specific': 'Time-bound promises (in X minutes)',
      'quick-format': 'Quick/fast format promises',
      'expert-says': 'Expert authority content',
      'insider-info': 'Insider/exclusive information',
      'trending': 'Viral/trending content',
      'tested': 'Tested/reviewed format',

      // Power Words & Emotional Triggers
      'urgency': 'Urgency-driven titles',
      'scarcity': 'Scarcity/exclusivity messaging',
      'curiosity': 'Curiosity gap triggers',
      'intrigue': 'High-intrigue clickbait',
      'transformation': 'Transformation promises',
      'mastery': 'Mastery/domination language',
      'problem-focused': 'Problem-highlighting content',
      'frustration': 'Frustration-addressing content',
      'easy-solution': 'Easy solution promises',
      'success-oriented': 'Success/achievement focused',

      // Enhanced Content Types
      'tutorial': 'Tutorial and how-to content',
      'review': 'Review and unboxing content',
      'reaction': 'Reaction and response videos',
      'challenge': 'Challenge and experiment content',
      'educational': 'Educational and learning content',
      'entertainment': 'Comedy and entertainment content',

      // Format Indicators
      'series-content': 'Series and episodic content',
      'live-content': 'Live streaming content',
      'update-content': 'News and update content',
      'collaboration': 'Collaboration and guest content',

      // Shorts-Specific Patterns
      'pov-content': 'POV (Point of View) content',
      'when-scenario': 'When/scenario-based content',
      'mood-content': 'Mood and vibe content',
      'wait-reveal': 'Suspense and reveal content',
      'quick-tip': 'Quick tips and life hacks',
      'trend-format': 'Trending format content',

      // Special Structures
      'clickbait-structure': 'Clickbait-style titles',
      'authority-backed': 'Authority-backed claims',
      'personal-story': 'Personal story content',
      'cta-driven': 'Call-to-action driven titles',
    };

    return descriptions[pattern] || `"${pattern}" pattern content`;
  }

  /**
   * Generate actionable, specific recommendations based on comprehensive analysis
   */
  private generateRecommendations(
    patterns: PatternInsight[],
    topPerformers: OutlierVideo[],
    isShorts: boolean
  ): string[] {
    const recommendations: string[] = [];

    if (patterns.length === 0) {
      recommendations.push(
        isShorts 
          ? '🎯 Create more Shorts with strong hooks in the first 3 seconds and trending audio'
          : '📚 Focus on tutorial and how-to content for better performance'
      );
      return recommendations;
    }

    const formatViews = (views: number) => views >= 1000000 ? `${(views / 1000000).toFixed(1)}M` : views >= 1000 ? `${(views / 1000).toFixed(0)}K` : views.toString();

    // TOP PERFORMING PATTERN - Specific Action
    const topPattern = patterns[0];
    if (topPattern.avgViews > 0) {
      const improvementPercent = topPerformers.length > 0 
        ? Math.round(((topPattern.avgViews - (topPerformers.reduce((sum, v) => sum + v.viewCount, 0) / topPerformers.length)) / (topPerformers.reduce((sum, v) => sum + v.viewCount, 0) / topPerformers.length)) * 100)
        : 0;
      
      recommendations.push(
        `🏆 WINNING FORMULA: "${topPattern.description}" averages ${formatViews(topPattern.avgViews)} views - create 3-5 more videos using this exact pattern`
      );
    }

    // POWER WORD RECOMMENDATIONS
    const powerWordPatterns = patterns.filter(p => 
      ['urgency', 'scarcity', 'curiosity', 'transformation', 'mastery', 'easy-solution'].includes(p.pattern)
    );
    
    if (powerWordPatterns.length > 0) {
      const bestPowerWord = powerWordPatterns[0];
      recommendations.push(
        `💥 TITLE BOOST: Use "${bestPowerWord.pattern}" words in titles - they increase views by ${Math.round((bestPowerWord.avgViews / (topPerformers.reduce((sum, v) => sum + v.viewCount, 0) / topPerformers.length)) * 100)}%`
      );
    }

    // FORMAT-SPECIFIC TACTICAL ADVICE
    if (isShorts) {
      // Shorts-specific recommendations
      const shortsPatterns = patterns.filter(p => 
        ['pov-content', 'when-scenario', 'quick-tip', 'trend-format'].includes(p.pattern)
      );
      
      if (shortsPatterns.length > 0) {
        recommendations.push(`⚡ SHORTS STRATEGY: "${shortsPatterns[0].description}" performs best - film 10 videos using this format`);
      }
      
      if (patterns.some(p => p.pattern === 'numbered-list')) {
        recommendations.push('📝 LIST FORMAT: "X Ways/Tips/Reasons" titles boost Shorts engagement - create numbered content');
      }
      
      if (patterns.some(p => p.pattern === 'curiosity')) {
        recommendations.push('🎭 CURIOSITY HOOK: Use "You Won\'t Believe" or "Secret" in first 3 seconds to increase watch time');
      }
    } else {
      // Long-form specific recommendations
      if (patterns.some(p => p.pattern === 'tutorial')) {
        recommendations.push('🎓 TUTORIAL GOLD: Step-by-step tutorials are your strength - create comprehensive guides with timestamps');
      }
      
      if (patterns.some(p => p.pattern === 'vs-comparison')) {
        recommendations.push('⚔️ COMPARISON CONTENT: "X vs Y" videos perform 2x better - compare products/methods in your niche');
      }
      
      if (patterns.some(p => p.pattern === 'ultimate-guide')) {
        recommendations.push('📖 COMPLETE GUIDES: "Ultimate/Complete" guides get high engagement - create 15+ minute comprehensive content');
      }
    }

    // TOPIC-SPECIFIC RECOMMENDATIONS
    const questionPatterns = patterns.filter(p => 
      ['why-question', 'how-question', 'what-question'].includes(p.pattern)
    );
    
    if (questionPatterns.length > 0) {
      recommendations.push(`❓ QUESTION POWER: "${questionPatterns[0].description}" get ${formatViews(questionPatterns[0].avgViews)} views - ask questions your audience searches for`);
    }

    // TIMING AND FREQUENCY RECOMMENDATIONS
    if (topPerformers.length >= 5) {
      const avgTopViews = topPerformers.reduce((sum, v) => sum + v.viewCount, 0) / topPerformers.length;
      const channelAvg = topPerformers.reduce((sum, v) => sum + v.viewCount, 0) / topPerformers.length; // This would be better with full channel data
      
      if (avgTopViews > 100000) {
        recommendations.push(`🎯 SUCCESS PATTERN: Your top content averages ${formatViews(avgTopViews)} views - analyze these ${topPerformers.length} videos and create similar content weekly`);
      }
    }

    // CONTENT GAP OPPORTUNITIES
    const missingPatterns = this.identifyContentGaps(patterns, isShorts);
    if (missingPatterns.length > 0) {
      recommendations.push(`💡 OPPORTUNITY: Missing "${missingPatterns[0]}" content - this format is trending in your niche`);
    }

    // ENGAGEMENT OPTIMIZATION
    if (patterns.some(p => p.pattern === 'cta-driven')) {
      recommendations.push('📢 CTA BOOST: Videos with clear calls-to-action perform better - end with specific next steps');
    }

    return recommendations.slice(0, 7); // Top 7 specific recommendations
  }

  /**
   * Identify content gaps based on missing high-performing patterns
   */
  private identifyContentGaps(patterns: PatternInsight[], isShorts: boolean): string[] {
    const existingPatterns = new Set(patterns.map(p => p.pattern));
    const gaps: string[] = [];

    if (isShorts) {
      const shortsOpportunities = [
        'pov-content', 'when-scenario', 'quick-tip', 'trend-format', 
        'transformation', 'curiosity', 'numbered-list'
      ];
      
      shortsOpportunities.forEach(pattern => {
        if (!existingPatterns.has(pattern)) {
          gaps.push(pattern);
        }
      });
    } else {
      const longformOpportunities = [
        'ultimate-guide', 'vs-comparison', 'tutorial', 'why-question',
        'numbered-list', 'transformation', 'authority-backed'
      ];
      
      longformOpportunities.forEach(pattern => {
        if (!existingPatterns.has(pattern)) {
          gaps.push(pattern);
        }
      });
    }

    return gaps.slice(0, 3); // Top 3 content gaps
  }

  /**
   * Enhanced topic extraction with smart categorization and niche detection
   */
  private extractTopics(topPerformers: OutlierVideo[]): TopicInsight[] {
    const topicStats = new Map<string, { totalViews: number; count: number; videos: OutlierVideo[] }>();

    topPerformers.forEach(video => {
      const extractedTopics = this.extractTopicsFromTitle(video.title);
      
      extractedTopics.forEach(topic => {
        if (!topicStats.has(topic)) {
          topicStats.set(topic, { totalViews: 0, count: 0, videos: [] });
        }
        const stats = topicStats.get(topic)!;
        stats.totalViews += video.viewCount;
        stats.count += 1;
        stats.videos.push(video);
      });
    });

    return Array.from(topicStats.entries())
      .filter(([_, stats]) => stats.count >= 2) // At least 2 videos
      .map(([topic, stats]) => {
        const avgViews = Math.round(stats.totalViews / stats.count);
        const examples = stats.videos.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
        
        return {
          topic,
          avgViews,
          count: stats.count,
          examples,
          ...this.analyzeTopicInsights(topic, examples, avgViews)
        };
      })
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 8); // Top 8 topics for better insights
  }

  /**
   * Smart topic extraction from video titles using contextual analysis
   */
  private extractTopicsFromTitle(title: string): string[] {
    const topics: string[] = [];
    const cleanTitle = title.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ')      // Normalize spaces
      .trim();

    // TECHNOLOGY & GADGETS TOPICS
    const techTopics = {
      'iPhone': /\biphone\s*\d*\s*(pro|max|mini)?\b/,
      'Android': /\b(android|galaxy|pixel|oneplus|samsung)\b/,
      'Gaming': /\b(gaming|gamer|game|playstation|xbox|nintendo|pc.gaming)\b/,
      'AI & Tech': /\b(ai|artificial.intelligence|chatgpt|machine.learning|tech|technology)\b/,
      'Cryptocurrency': /\b(crypto|bitcoin|ethereum|blockchain|nft|defi)\b/,
      'Software': /\b(app|software|program|code|coding|programming|development)\b/,
      'Hardware': /\b(laptop|computer|pc|mac|processor|gpu|cpu|hardware)\b/,
    };

    // LIFESTYLE & PERSONAL TOPICS
    const lifestyleTopics = {
      'Fitness & Health': /\b(workout|fitness|health|diet|nutrition|exercise|gym|weight.loss)\b/,
      'Beauty & Fashion': /\b(makeup|beauty|skincare|fashion|style|outfit|hair|nails)\b/,
      'Food & Cooking': /\b(recipe|cooking|food|kitchen|meal|chef|restaurant|baking)\b/,
      'Travel': /\b(travel|trip|vacation|tour|destination|flight|hotel|explore)\b/,
      'Home & DIY': /\b(home|diy|decoration|furniture|cleaning|organization|interior)\b/,
      'Relationships': /\b(relationship|dating|love|marriage|family|parenting|kids)\b/,
    };

    // BUSINESS & FINANCE TOPICS
    const businessTopics = {
      'Investing': /\b(invest|stock|trading|portfolio|market|finance|money|wealth)\b/,
      'Entrepreneurship': /\b(business|startup|entrepreneur|company|marketing|sales)\b/,
      'Career': /\b(career|job|work|resume|interview|salary|promotion|skills)\b/,
      'Real Estate': /\b(real.estate|property|house|mortgage|rent|buying.home)\b/,
    };

    // ENTERTAINMENT & MEDIA TOPICS
    const entertainmentTopics = {
      'Movies & TV': /\b(movie|film|series|netflix|disney|marvel|tv.show|actor)\b/,
      'Music': /\b(music|song|album|artist|concert|spotify|guitar|piano)\b/,
      'Celebrity News': /\b(celebrity|famous|star|hollywood|red.carpet|award)\b/,
      'Sports': /\b(football|basketball|soccer|baseball|sports|athlete|team|championship)\b/,
    };

    // EDUCATIONAL TOPICS
    const educationalTopics = {
      'Science': /\b(science|physics|chemistry|biology|space|nasa|research|study)\b/,
      'History': /\b(history|historical|ancient|war|civilization|culture|museum)\b/,
      'Language Learning': /\b(language|learn|spanish|french|english|grammar|vocabulary)\b/,
      'Personal Development': /\b(motivation|productivity|self.improvement|goals|habits|mindset)\b/,
    };

    // PRODUCT & REVIEW TOPICS
    const productTopics = {
      'Product Reviews': /\b(review|unboxing|test|comparison|vs|worth.it|honest.review)\b/,
      'Shopping & Deals': /\b(amazon|shopping|deal|discount|sale|cheap|expensive|price)\b/,
      'Cars & Automotive': /\b(car|auto|vehicle|driving|tesla|bmw|mercedes|ford)\b/,
    };

    // Merge all topic categories
    const allTopics = {
      ...techTopics,
      ...lifestyleTopics,
      ...businessTopics,
      ...entertainmentTopics,
      ...educationalTopics,
      ...productTopics
    };

    // Extract topics using pattern matching
    for (const [topicName, pattern] of Object.entries(allTopics)) {
      if (pattern.test(cleanTitle)) {
        topics.push(topicName);
      }
    }

    // CONTEXTUAL TOPIC EXTRACTION
    // Extract meaningful keywords that appear with high frequency
    const words = cleanTitle.split(' ').filter(word => 
      word.length > 3 && 
      !this.isStopWord(word) &&
      !this.isGenericWord(word)
    );

    // Add significant individual words as topics
    words.forEach(word => {
      if (this.isSignificantTopic(word)) {
        topics.push(this.capitalizeFirst(word));
      }
    });

    // Add meaningful two-word combinations
    for (let i = 0; i < words.length - 1; i++) {
      const twoWordTopic = `${words[i]} ${words[i + 1]}`;
      if (this.isSignificantTopic(twoWordTopic)) {
        topics.push(this.capitalizeFirst(twoWordTopic));
      }
    }

    return [...new Set(topics)]; // Remove duplicates
  }

  /**
   * Check if word is a stop word (common words to ignore)
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been',
      'will', 'more', 'when', 'what', 'where', 'why', 'how', 'all', 'any', 'can',
      'could', 'should', 'would', 'also', 'just', 'only', 'even', 'much', 'most',
      'very', 'still', 'way', 'well', 'may', 'might', 'said', 'make', 'take',
      'come', 'know', 'see', 'get', 'use', 'find', 'give', 'tell', 'ask', 'seem',
      'feel', 'try', 'leave', 'call'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  /**
   * Check if word is too generic to be a meaningful topic
   */
  private isGenericWord(word: string): boolean {
    const genericWords = new Set([
      'video', 'videos', 'youtube', 'channel', 'subscribe', 'like', 'comment',
      'watch', 'viewer', 'content', 'episode', 'part', 'series', 'show',
      'best', 'top', 'good', 'great', 'amazing', 'awesome', 'perfect', 'ultimate',
      'complete', 'full', 'new', 'latest', 'update', 'first', 'last', 'final'
    ]);
    return genericWords.has(word.toLowerCase());
  }

  /**
   * Check if a word or phrase is significant enough to be a topic
   */
  private isSignificantTopic(topic: string): boolean {
    const cleanTopic = topic.toLowerCase().trim();
    
    // Must be at least 4 characters
    if (cleanTopic.length < 4) return false;
    
    // Must not be all numbers
    if (/^\d+$/.test(cleanTopic)) return false;
    
    // Must not be a year
    if (/^20\d{2}$/.test(cleanTopic)) return false;
    
    // Must contain at least one meaningful character
    if (!/[a-z]/.test(cleanTopic)) return false;
    
    return true;
  }

  /**
   * Capitalize first letter of each word
   */
  private capitalizeFirst(text: string): string {
    return text.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Generate deep insights for a specific topic
   */
  private analyzeTopicInsights(topic: string, examples: OutlierVideo[], avgViews: number): Omit<TopicInsight, 'topic' | 'avgViews' | 'count' | 'examples'> {
    // Calculate performance score (1-10 scale based on relative performance)
    const maxViews = Math.max(...examples.map(v => v.viewCount));
    const performanceScore = Math.min(10, Math.max(1, Math.round((avgViews / 10000) * 2)));

    // Analyze topic characteristics for insights
    const topicLower = topic.toLowerCase();
    
    // Determine audience appeal based on topic
    let audienceAppeal: string;
    let successFactors: string[];
    let recommendedActions: string[];
    let competitiveAdvantage: string;

    if (topicLower.includes('unboxing')) {
      audienceAppeal = "Tech enthusiasts, potential buyers, and product researchers";
      successFactors = ["First impressions excitement", "Product discovery", "Authentic reactions"];
      recommendedActions = ["Show clear product shots", "Highlight unique features", "Include size comparisons"];
      competitiveAdvantage = "Builds trust through authentic first-time reactions and detailed product showcase";
    } else if (topicLower.includes('review')) {
      audienceAppeal = "Purchase decision-makers and product comparison shoppers";
      successFactors = ["Honest assessment", "Detailed analysis", "Real-world testing"];
      recommendedActions = ["Test in realistic scenarios", "Compare with alternatives", "Share pros and cons"];
      competitiveAdvantage = "Provides valuable buying guidance that viewers actively seek out";
    } else if (topicLower.includes('tutorial') || topicLower.includes('how')) {
      audienceAppeal = "Learners and problem-solvers seeking step-by-step guidance";
      successFactors = ["Clear instructions", "Visual demonstrations", "Problem-solving focus"];
      recommendedActions = ["Break down complex steps", "Show common mistakes", "Provide alternative methods"];
      competitiveAdvantage = "Offers practical value that viewers bookmark and share";
    } else if (topicLower.includes('gaming') || topicLower.includes('game')) {
      audienceAppeal = "Gamers, entertainment seekers, and gaming community members";
      successFactors = ["Engaging gameplay", "Skill demonstration", "Community connection"];
      recommendedActions = ["Show impressive moments", "Explain strategies", "Engage with comments"];
      competitiveAdvantage = "Taps into passionate gaming community with high engagement rates";
    } else if (topicLower.match(/\b(phone|smartphone|tablet|laptop|computer)\b/)) {
      audienceAppeal = "Tech consumers researching purchases and upgrades";
      successFactors = ["Latest technology focus", "Performance comparisons", "Value assessment"];
      recommendedActions = ["Test real-world performance", "Compare with competitors", "Discuss pricing"];
      competitiveAdvantage = "Serves high-intent audience actively making purchase decisions";
    } else {
      // Generic analysis for other topics
      audienceAppeal = "Engaged viewers interested in specialized content";
      successFactors = ["Niche expertise", "Consistent quality", "Community building"];
      recommendedActions = ["Develop topic expertise", "Create series content", "Engage with niche community"];
      competitiveAdvantage = "Establishes authority in specific content vertical";
    }

    // Determine trend direction based on recent performance
    // For now, marking all as stable since we'd need historical data for trend analysis
    const trendDirection: 'rising' | 'stable' | 'declining' = 'stable';

    return {
      audienceAppeal,
      successFactors,
      recommendedActions,
      trendDirection,
      competitiveAdvantage,
      performanceScore
    };
  }

  /**
   * Analyze title patterns and formats
   */
  private analyzeTitlePatterns(topPerformers: OutlierVideo[]) {
    if (topPerformers.length === 0) {
      return {
        avgTitleLength: 0,
        mostCommonWords: [],
        titleFormats: []
      };
    }

    // Calculate average title length
    const avgTitleLength = Math.round(
      topPerformers.reduce((sum, video) => sum + video.title.length, 0) / topPerformers.length
    );

    // Extract most common words
    const wordStats = new Map<string, { count: number; totalViews: number }>();
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an']);

    topPerformers.forEach(video => {
      const words = video.title.toLowerCase().match(/\b\w+\b/g) || [];
      words.forEach(word => {
        if (word.length > 2 && !stopWords.has(word)) {
          if (!wordStats.has(word)) {
            wordStats.set(word, { count: 0, totalViews: 0 });
          }
          const stats = wordStats.get(word)!;
          stats.count += 1;
          stats.totalViews += video.viewCount;
        }
      });
    });

    const mostCommonWords = Array.from(wordStats.entries())
      .filter(([_, stats]) => stats.count >= 2)
      .map(([word, stats]) => ({
        word,
        count: stats.count,
        avgViews: Math.round(stats.totalViews / stats.count)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Identify title formats
    const formatStats = new Map<string, { count: number; totalViews: number; examples: string[] }>();

    topPerformers.forEach(video => {
      const title = video.title;
      let format = 'other';

      if (title.includes('|') || title.includes(' - ')) {
        format = 'Title with separator (| or -)';
      } else if (title.match(/^\d+/)) {
        format = 'Starts with number';
      } else if (title.includes('?')) {
        format = 'Question format';
      } else if (title.includes('!')) {
        format = 'Exclamation format';
      } else if (title.toUpperCase() === title) {
        format = 'ALL CAPS';
      } else if (title.match(/\b(how to|tutorial|guide)\b/i)) {
        format = 'How-to/Tutorial format';
      } else if (title.match(/\b(vs|versus)\b/i)) {
        format = 'Comparison format';
      } else if (title.match(/\b(review|unboxing)\b/i)) {
        format = 'Review/Unboxing format';
      }

      if (!formatStats.has(format)) {
        formatStats.set(format, { count: 0, totalViews: 0, examples: [] });
      }
      const stats = formatStats.get(format)!;
      stats.count += 1;
      stats.totalViews += video.viewCount;
      if (stats.examples.length < 3) {
        stats.examples.push(title);
      }
    });

    const titleFormats = Array.from(formatStats.entries())
      .filter(([_, stats]) => stats.count >= 2)
      .map(([format, stats]) => ({
        format,
        count: stats.count,
        avgViews: Math.round(stats.totalViews / stats.count),
        examples: stats.examples
      }))
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 8);

    return {
      avgTitleLength,
      mostCommonWords,
      titleFormats
    };
  }

  /**
   * Analyze content timing, length, and format specifications
   */
  private analyzeContentSpecs(topPerformers: OutlierVideo[], isShorts: boolean): ContentTimingAnalysis {
    if (topPerformers.length === 0) {
      return {
        optimalLength: {
          range: 'Insufficient data',
          avgViews: 0,
          description: 'Need more videos for analysis'
        },
        uploadTiming: {
          bestDays: [],
          worstDays: [],
          insight: 'Not enough data to determine optimal upload timing'
        },
        seriesVsStandalone: {
          seriesPerformance: 0,
          standalonePerformance: 0,
          recommendation: 'Insufficient data for series analysis'
        }
      };
    }

    // OPTIMAL LENGTH ANALYSIS
    const lengthAnalysis = this.analyzeDurationPatterns(topPerformers, isShorts);
    
    // UPLOAD TIMING ANALYSIS
    const timingAnalysis = this.analyzeUploadTiming(topPerformers);
    
    // SERIES VS STANDALONE ANALYSIS
    const seriesAnalysis = this.analyzeSeriesVsStandalone(topPerformers);

    return {
      optimalLength: lengthAnalysis,
      uploadTiming: timingAnalysis,
      seriesVsStandalone: seriesAnalysis
    };
  }

  /**
   * Analyze optimal video duration patterns
   */
  private analyzeDurationPatterns(videos: OutlierVideo[], isShorts: boolean): ContentTimingAnalysis['optimalLength'] {
    if (isShorts) {
      // For Shorts, analyze duration patterns within 0-60 seconds
      const durationBuckets = new Map<string, { videos: OutlierVideo[]; totalViews: number }>();
      
      videos.forEach(video => {
        const seconds = this.parseDurationToSeconds(video.duration);
        let bucket = '51-60s';
        
        if (seconds <= 15) bucket = '0-15s';
        else if (seconds <= 30) bucket = '16-30s';
        else if (seconds <= 45) bucket = '31-45s';
        else if (seconds <= 60) bucket = '46-60s';
        
        if (!durationBuckets.has(bucket)) {
          durationBuckets.set(bucket, { videos: [], totalViews: 0 });
        }
        const bucketData = durationBuckets.get(bucket)!;
        bucketData.videos.push(video);
        bucketData.totalViews += video.viewCount;
      });

      // Find best performing duration range
      let bestRange = '31-45s';
      let bestAvgViews = 0;

      for (const [range, data] of durationBuckets.entries()) {
        if (data.videos.length >= 2) { // Need at least 2 videos for confidence
          const avgViews = data.totalViews / data.videos.length;
          if (avgViews > bestAvgViews) {
            bestAvgViews = avgViews;
            bestRange = range;
          }
        }
      }

      return {
        range: bestRange,
        avgViews: Math.round(bestAvgViews),
        description: `Shorts in ${bestRange} range perform best for this channel`
      };
    } else {
      // For long-form, analyze duration patterns in minutes
      const durationBuckets = new Map<string, { videos: OutlierVideo[]; totalViews: number }>();
      
      videos.forEach(video => {
        const seconds = this.parseDurationToSeconds(video.duration);
        const minutes = Math.floor(seconds / 60);
        let bucket = '15+ min';
        
        if (minutes <= 3) bucket = '1-3 min';
        else if (minutes <= 6) bucket = '4-6 min';
        else if (minutes <= 10) bucket = '7-10 min';
        else if (minutes <= 15) bucket = '11-15 min';
        
        if (!durationBuckets.has(bucket)) {
          durationBuckets.set(bucket, { videos: [], totalViews: 0 });
        }
        const bucketData = durationBuckets.get(bucket)!;
        bucketData.videos.push(video);
        bucketData.totalViews += video.viewCount;
      });

      // Find best performing duration range
      let bestRange = '7-10 min';
      let bestAvgViews = 0;

      for (const [range, data] of durationBuckets.entries()) {
        if (data.videos.length >= 1) {
          const avgViews = data.totalViews / data.videos.length;
          if (avgViews > bestAvgViews) {
            bestAvgViews = avgViews;
            bestRange = range;
          }
        }
      }

      return {
        range: bestRange,
        avgViews: Math.round(bestAvgViews),
        description: `Videos in ${bestRange} range perform best for this channel`
      };
    }
  }

  /**
   * Analyze upload timing patterns
   */
  private analyzeUploadTiming(videos: OutlierVideo[]): ContentTimingAnalysis['uploadTiming'] {
    const dayPerformance = new Map<string, { count: number; totalViews: number }>();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    videos.forEach(video => {
      const dayOfWeek = days[video.publishedAt.getDay()];
      if (!dayPerformance.has(dayOfWeek)) {
        dayPerformance.set(dayOfWeek, { count: 0, totalViews: 0 });
      }
      const dayData = dayPerformance.get(dayOfWeek)!;
      dayData.count += 1;
      dayData.totalViews += video.viewCount;
    });

    // Calculate average views per day
    const dayAverages = Array.from(dayPerformance.entries())
      .map(([day, data]) => ({
        day,
        avgViews: data.count > 0 ? data.totalViews / data.count : 0,
        count: data.count
      }))
      .filter(item => item.count >= 1) // Only include days with at least 1 video
      .sort((a, b) => b.avgViews - a.avgViews);

    const bestDays = dayAverages.slice(0, 2).map(item => item.day);
    const worstDays = dayAverages.slice(-2).map(item => item.day);
    
    let insight = 'Not enough data for timing insights';
    if (dayAverages.length >= 3) {
      const bestDay = dayAverages[0];
      const worstDay = dayAverages[dayAverages.length - 1];
      const improvementPercent = Math.round(((bestDay.avgViews - worstDay.avgViews) / worstDay.avgViews) * 100);
      insight = `${bestDay.day} uploads average ${improvementPercent}% more views than ${worstDay.day}`;
    }

    return {
      bestDays,
      worstDays,
      insight
    };
  }

  /**
   * Analyze series vs standalone content performance
   */
  private analyzeSeriesVsStandalone(videos: OutlierVideo[]): ContentTimingAnalysis['seriesVsStandalone'] {
    const seriesVideos: OutlierVideo[] = [];
    const standaloneVideos: OutlierVideo[] = [];
    
    videos.forEach(video => {
      const title = video.title.toLowerCase();
      const isSeries = /\b(part\s*\d+|episode\s*\d+|chapter\s*\d+|season\s*\d+|series)\b/.test(title) ||
                     video.patternTags.includes('series-content');
      
      if (isSeries) {
        seriesVideos.push(video);
      } else {
        standaloneVideos.push(video);
      }
    });

    const seriesAvg = seriesVideos.length > 0 
      ? seriesVideos.reduce((sum, v) => sum + v.viewCount, 0) / seriesVideos.length 
      : 0;
    
    const standaloneAvg = standaloneVideos.length > 0 
      ? standaloneVideos.reduce((sum, v) => sum + v.viewCount, 0) / standaloneVideos.length 
      : 0;

    let recommendation = 'Insufficient data for series analysis';
    
    if (seriesVideos.length >= 2 && standaloneVideos.length >= 2) {
      if (seriesAvg > standaloneAvg * 1.2) {
        recommendation = 'Series content performs significantly better - consider creating more multi-part content';
      } else if (standaloneAvg > seriesAvg * 1.2) {
        recommendation = 'Standalone videos perform better - focus on complete, self-contained content';
      } else {
        recommendation = 'Series and standalone content perform similarly - maintain current mix';
      }
    }

    return {
      seriesPerformance: Math.round(seriesAvg),
      standalonePerformance: Math.round(standaloneAvg),
      recommendation
    };
  }

  /**
   * Parse ISO 8601 duration to seconds (helper method)
   */
  private parseDurationToSeconds(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Analyze format-specific content
   */
  private analyzeFormat(videos: VideoData[], formatName: string): FormatAnalysis {
    if (videos.length === 0) {
      return {
        totalVideos: 0,
        averageViews: 0,
        outliers: [],
        patterns: [],
        recommendations: [`Create more ${formatName.toLowerCase()} content to enable analysis`],
        bestPerformingTopics: [],
        titleAnalysis: {
          avgTitleLength: 0,
          mostCommonWords: [],
          titleFormats: []
        },
        contentSpecs: {
          optimalLength: {
            range: 'Insufficient data',
            avgViews: 0,
            description: 'Need more videos for analysis'
          },
          uploadTiming: {
            bestDays: [],
            worstDays: [],
            insight: 'Not enough data to determine optimal upload timing'
          },
          seriesVsStandalone: {
            seriesPerformance: 0,
            standalonePerformance: 0,
            recommendation: 'Insufficient data for series analysis'
          }
        }
      };
    }

    const averageViews = this.calculateAverageViews(videos);
    const topPerformers = this.findTopPerformers(videos, averageViews);
    const patterns = this.analyzePatterns(topPerformers);
    const recommendations = this.generateRecommendations(patterns, topPerformers, formatName === 'Shorts');
    const bestPerformingTopics = this.extractTopics(topPerformers);
    const titleAnalysis = this.analyzeTitlePatterns(topPerformers);
    const contentSpecs = this.analyzeContentSpecs(topPerformers, formatName === 'Shorts');

    return {
      totalVideos: videos.length,
      averageViews,
      outliers: topPerformers, // Now contains top 5-10 performers regardless of multiplier
      patterns,
      recommendations,
      bestPerformingTopics,
      titleAnalysis,
      contentSpecs
    };
  }

  /**
   * Generate cross-format insights
   */
  private generateCrossFormatInsights(longform: FormatAnalysis, shorts: FormatAnalysis): string[] {
    const insights: string[] = [];

    // Compare performance
    if (shorts.averageViews > longform.averageViews * 1.5) {
      insights.push(`Shorts average ${Math.round(shorts.averageViews / 1000)}K views vs ${Math.round(longform.averageViews / 1000)}K for long-form - focus more on Shorts`);
    } else if (longform.averageViews > shorts.averageViews * 1.5) {
      insights.push(`Long-form videos average ${Math.round(longform.averageViews / 1000)}K views vs ${Math.round(shorts.averageViews / 1000)}K for Shorts - long-form content resonates better`);
    }

    // Cross-format content suggestions
    const longformTopTopics = longform.bestPerformingTopics.slice(0, 3).map(t => t.topic);
    const shortsTopTopics = shorts.bestPerformingTopics.slice(0, 3).map(t => t.topic);

    const commonTopics = longformTopTopics.filter(topic => 
      shortsTopTopics.some(sTopic => sTopic.includes(topic) || topic.includes(sTopic))
    );

    if (commonTopics.length > 0) {
      insights.push(`Topics that work well in both formats: ${commonTopics.slice(0, 2).join(', ')} - create more content around these`);
    }

    // Content repurposing suggestions
    if (longform.outliers.length > 0 && shorts.totalVideos < longform.totalVideos * 0.5) {
      insights.push('Turn your best long-form content into Short clips for wider reach');
    }

    if (shorts.outliers.length > 0 && longform.totalVideos < shorts.totalVideos) {
      insights.push('Expand your best Shorts into detailed long-form tutorials');
    }

    return insights.slice(0, 5);
  }

  /**
   * Main analysis function
   */
  analyze(longformVideos: VideoData[], shortsVideos: VideoData[]): AnalysisResults {
    const longformAnalysis = this.analyzeFormat(longformVideos, 'Long-form');
    const shortsAnalysis = this.analyzeFormat(shortsVideos, 'Shorts');
    const crossFormatInsights = this.generateCrossFormatInsights(longformAnalysis, shortsAnalysis);

    return {
      longform: longformAnalysis,
      shorts: shortsAnalysis,
      combined: {
        totalVideos: longformVideos.length + shortsVideos.length,
        crossFormatInsights,
      },
    };
  }
}