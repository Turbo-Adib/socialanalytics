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
}

export interface FormatAnalysis {
  totalVideos: number;
  averageViews: number;
  outliers: OutlierVideo[];
  patterns: PatternInsight[];
  recommendations: string[];
  bestPerformingTopics: { topic: string; avgViews: number; count: number }[];
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
  private readonly OUTLIER_THRESHOLD = 2.0; // 2x average views

  /**
   * Calculate average views for a set of videos
   */
  private calculateAverageViews(videos: VideoData[]): number {
    if (videos.length === 0) return 0;
    const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
    return Math.round(totalViews / videos.length);
  }

  /**
   * Identify outlier videos (2x+ average views)
   */
  private findOutliers(videos: VideoData[], averageViews: number): OutlierVideo[] {
    if (averageViews === 0) return [];

    return videos
      .filter(video => video.viewCount >= averageViews * this.OUTLIER_THRESHOLD)
      .map(video => ({
        ...video,
        multiplier: Number((video.viewCount / averageViews).toFixed(1)),
        patternTags: this.extractPatternsFromTitle(video.title),
      }))
      .sort((a, b) => b.multiplier - a.multiplier);
  }

  /**
   * Extract patterns from video title
   */
  private extractPatternsFromTitle(title: string): string[] {
    const patterns: string[] = [];
    const lowercaseTitle = title.toLowerCase();

    // Common patterns to detect
    const patternMap = {
      'how-to': /\bhow to\b/,
      'tutorial': /\btutorial\b/,
      'guide': /\bguide\b/,
      'tips': /\btips?\b/,
      'tricks': /\btricks?\b/,
      'vs': /\bvs\.?\b|\bversus\b/,
      'review': /\breview\b/,
      'best': /\bbest\b/,
      'top': /\btop\b/,
      'complete': /\bcomplete\b/,
      'ultimate': /\bultimate\b/,
      'beginner': /\bbeginner\b/,
      'advanced': /\badvanced\b/,
      'secret': /\bsecret\b/,
      'revealed': /\brevealed?\b/,
      'minutes': /\b\d+\s*minutes?\b/,
      'quick': /\bquick\b/,
      'easy': /\beasy\b/,
      'step-by-step': /\bstep.by.step\b/,
      'reaction': /\breaction\b/,
      'first-time': /\bfirst.time\b/,
      'challenge': /\bchallenge\b/,
      'part': /\bpart\s*\d+\b/,
      'series': /\bseries\b/,
      'episode': /\bepisode\b/,
      'live': /\blive\b/,
      'update': /\bupdate\b/,
      'new': /\bnew\b/,
      'question': /\?/,
      'exclamation': /!/,
      'numbers': /\b\d+\b/,
      'year': /\b20\d{2}\b/,
    };

    for (const [pattern, regex] of Object.entries(patternMap)) {
      if (regex.test(lowercaseTitle)) {
        patterns.push(pattern);
      }
    }

    // Additional Shorts-specific patterns
    if (lowercaseTitle.includes('wait for it')) patterns.push('wait-for-it');
    if (lowercaseTitle.includes('part 2')) patterns.push('multi-part');
    if (lowercaseTitle.includes('pov:')) patterns.push('pov');
    if (lowercaseTitle.includes('when')) patterns.push('when-scenario');

    return patterns;
  }

  /**
   * Analyze patterns across outlier videos
   */
  private analyzePatterns(outliers: OutlierVideo[]): PatternInsight[] {
    const patternStats = new Map<string, {
      videos: OutlierVideo[];
      totalMultiplier: number;
    }>();

    // Collect pattern statistics
    outliers.forEach(video => {
      video.patternTags.forEach(pattern => {
        if (!patternStats.has(pattern)) {
          patternStats.set(pattern, { videos: [], totalMultiplier: 0 });
        }
        const stats = patternStats.get(pattern)!;
        stats.videos.push(video);
        stats.totalMultiplier += video.multiplier;
      });
    });

    // Convert to insights, sorted by average multiplier
    const insights: PatternInsight[] = Array.from(patternStats.entries())
      .filter(([_, stats]) => stats.videos.length >= 2) // At least 2 videos for reliability
      .map(([pattern, stats]) => ({
        pattern,
        description: this.getPatternDescription(pattern),
        avgMultiplier: Number((stats.totalMultiplier / stats.videos.length).toFixed(1)),
        videoCount: stats.videos.length,
        examples: stats.videos.slice(0, 3).map(v => v.title),
      }))
      .sort((a, b) => b.avgMultiplier - a.avgMultiplier)
      .slice(0, 10); // Top 10 patterns

    return insights;
  }

  /**
   * Get human-readable description for pattern
   */
  private getPatternDescription(pattern: string): string {
    const descriptions: Record<string, string> = {
      'how-to': 'Videos with "How to" in title',
      'tutorial': 'Tutorial-style content',
      'guide': 'Guide and walkthrough videos',
      'tips': 'Tips and advice content',
      'tricks': 'Tricks and hacks videos',
      'vs': 'Comparison videos (vs/versus)',
      'review': 'Review and evaluation content',
      'best': 'Best of/top picks videos',
      'top': 'Top lists and rankings',
      'complete': 'Complete guides and courses',
      'ultimate': 'Ultimate guides and resources',
      'beginner': 'Beginner-friendly content',
      'advanced': 'Advanced level content',
      'secret': 'Secret tips and hidden knowledge',
      'revealed': 'Revealing or exposing content',
      'minutes': 'Time-bound content (X minutes)',
      'quick': 'Quick tips and fast content',
      'easy': 'Easy and simple tutorials',
      'step-by-step': 'Step-by-step instructions',
      'reaction': 'Reaction and response videos',
      'first-time': 'First-time experiences',
      'challenge': 'Challenge and competition videos',
      'part': 'Multi-part series content',
      'series': 'Series and episodic content',
      'episode': 'Episode-based content',
      'live': 'Live streaming content',
      'update': 'Updates and news content',
      'new': 'New releases and announcements',
      'question': 'Question-based titles',
      'exclamation': 'Exciting/emphatic titles',
      'numbers': 'Number-driven content',
      'year': 'Year-specific content',
      'wait-for-it': 'Suspense and reveal content',
      'multi-part': 'Multi-part storytelling',
      'pov': 'Point-of-view content',
      'when-scenario': 'Scenario-based content',
    };

    return descriptions[pattern] || `Content with "${pattern}" pattern`;
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    patterns: PatternInsight[],
    outliers: OutlierVideo[],
    isShorts: boolean
  ): string[] {
    const recommendations: string[] = [];

    if (patterns.length === 0) {
      recommendations.push(
        isShorts 
          ? 'Create more Shorts with strong hooks in the first 3 seconds'
          : 'Focus on tutorial and how-to content for better performance'
      );
      return recommendations;
    }

    // Top performing pattern recommendation
    const topPattern = patterns[0];
    if (topPattern.avgMultiplier > 2.5) {
      recommendations.push(
        `${topPattern.description} get ${topPattern.avgMultiplier}x more views - create more content like this`
      );
    }

    // Pattern-specific recommendations
    if (patterns.some(p => p.pattern === 'how-to')) {
      recommendations.push('Continue creating "How to" tutorials - they consistently outperform other formats');
    }

    if (patterns.some(p => p.pattern === 'vs')) {
      recommendations.push('Comparison videos perform well - try more "X vs Y" content');
    }

    if (isShorts) {
      if (patterns.some(p => p.pattern === 'quick')) {
        recommendations.push('Quick tips format works well for Shorts - keep videos under 30 seconds');
      }
      if (patterns.some(p => p.pattern === 'tutorial')) {
        recommendations.push('Tutorial Shorts are performing well - break down complex topics into bite-sized videos');
      }
    } else {
      if (patterns.some(p => p.pattern === 'complete')) {
        recommendations.push('Complete guides perform well - create comprehensive, in-depth content');
      }
      if (patterns.some(p => p.pattern === 'minutes')) {
        recommendations.push('Time-bound content works well - consider adding time frames to your titles');
      }
    }

    // View count recommendations
    const avgOutlierViews = outliers.reduce((sum, v) => sum + v.viewCount, 0) / outliers.length;
    if (avgOutlierViews > 100000) {
      recommendations.push(`Your outlier videos average ${Math.round(avgOutlierViews / 1000)}K views - replicate their format`);
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }

  /**
   * Extract top performing topics
   */
  private extractTopics(outliers: OutlierVideo[]): { topic: string; avgViews: number; count: number }[] {
    const topicStats = new Map<string, { totalViews: number; count: number }>();

    outliers.forEach(video => {
      // Simple topic extraction from title (first 2-3 words, common keywords)
      const words = video.title.toLowerCase().split(' ');
      const topics: string[] = [];

      // Extract potential topics
      words.forEach((word, index) => {
        if (word.length > 3 && !['how', 'the', 'and', 'for', 'with', 'this', 'that', 'best', 'top'].includes(word)) {
          topics.push(word);
          if (index < words.length - 1) {
            const twoWordTopic = `${word} ${words[index + 1]}`;
            if (twoWordTopic.length < 20) {
              topics.push(twoWordTopic);
            }
          }
        }
      });

      topics.forEach(topic => {
        if (!topicStats.has(topic)) {
          topicStats.set(topic, { totalViews: 0, count: 0 });
        }
        const stats = topicStats.get(topic)!;
        stats.totalViews += video.viewCount;
        stats.count += 1;
      });
    });

    return Array.from(topicStats.entries())
      .filter(([_, stats]) => stats.count >= 2) // At least 2 videos
      .map(([topic, stats]) => ({
        topic,
        avgViews: Math.round(stats.totalViews / stats.count),
        count: stats.count,
      }))
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 5); // Top 5 topics
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
      };
    }

    const averageViews = this.calculateAverageViews(videos);
    const outliers = this.findOutliers(videos, averageViews);
    const patterns = this.analyzePatterns(outliers);
    const recommendations = this.generateRecommendations(patterns, outliers, formatName === 'Shorts');
    const bestPerformingTopics = this.extractTopics(outliers);

    return {
      totalVideos: videos.length,
      averageViews,
      outliers: outliers.slice(0, 10), // Top 10 outliers
      patterns,
      recommendations,
      bestPerformingTopics,
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