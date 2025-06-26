import { EnhancedVideoData, EnhancedChannelData } from './enhancedYouTubeAPI';

export interface ActualContentAnalysis {
  videoId: string;
  title: string;
  description: string;
  hashtags: string[];
  captions?: string;
  performanceMultiplier: number;
  extractedElements: {
    topics: string[];
    emotions: string[];
    techniques: string[];
    hooks: string[];
    valuePropositions: string[];
    audienceTargeting: string[];
  };
}

export interface DynamicSuccessFactor {
  factor: string;
  description: string;
  impact: number;
  evidence: {
    videos: ActualContentAnalysis[];
    commonElements: string[];
    specificExamples: string[];
  };
  implementation: string;
  frequency: number;
}

export interface DynamicRecommendation {
  action: string;
  reasoning: string;
  basedOn: {
    successfulVideos: string[];
    specificPatterns: string[];
    actualContent: string[];
  };
  implementation: {
    immediate: string[];
    ongoing: string[];
  };
  expectedOutcome: string;
}

export interface DynamicCompetitiveAdvantage {
  advantage: string;
  uniqueElements: string[];
  evidenceFromContent: {
    titles: string[];
    descriptions: string[];
    hashtags: string[];
    transcriptSnippets: string[];
  };
  howToLeverage: string[];
  whyItWorks: string;
}

export interface ChannelSpecificInsights {
  channelId: string;
  analysisDate: string;
  successFactors: DynamicSuccessFactor[];
  recommendedActions: DynamicRecommendation[];
  competitiveAdvantages: DynamicCompetitiveAdvantage[];
  contentDNA: {
    corethemes: string[];
    communicationStyle: string[];
    audienceConnection: string[];
    uniqueApproach: string[];
  };
  optimization: {
    titleStrategies: string[];
    contentStrategies: string[];
    engagementStrategies: string[];
  };
}

export class DynamicContentAnalyzer {

  /**
   * Analyze channel content dynamically based on actual content
   */
  analyzeChannelDynamically(channelData: EnhancedChannelData): ChannelSpecificInsights {
    const videos = channelData.recentVideos;
    const avgViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;
    
    // Analyze each video's actual content
    const contentAnalyses = videos.map(video => 
      this.analyzeVideoContent(video, avgViews)
    );

    // Get top performers for insights
    const topPerformers = contentAnalyses
      .filter(analysis => analysis.performanceMultiplier > 1.2)
      .sort((a, b) => b.performanceMultiplier - a.performanceMultiplier);

    return {
      channelId: channelData.id,
      analysisDate: new Date().toISOString(),
      successFactors: this.extractDynamicSuccessFactors(topPerformers, contentAnalyses),
      recommendedActions: this.generateDynamicRecommendations(topPerformers, contentAnalyses),
      competitiveAdvantages: this.identifyDynamicCompetitiveAdvantages(topPerformers, channelData),
      contentDNA: this.extractContentDNA(topPerformers),
      optimization: this.generateOptimizationStrategies(topPerformers, contentAnalyses)
    };
  }

  /**
   * Analyze individual video content deeply
   */
  private analyzeVideoContent(video: EnhancedVideoData, avgViews: number): ActualContentAnalysis {
    const allText = `${video.title} ${video.description} ${video.hashtags.join(' ')} ${video.captions || ''}`.toLowerCase();
    
    return {
      videoId: video.id,
      title: video.title,
      description: video.description,
      hashtags: video.hashtags,
      captions: video.captions,
      performanceMultiplier: video.viewCount / avgViews,
      extractedElements: {
        topics: this.extractActualTopics(allText, video.title),
        emotions: this.extractEmotionalElements(allText, video.title),
        techniques: this.extractContentTechniques(allText, video.title, video.description),
        hooks: this.extractActualHooks(video.title, video.description),
        valuePropositions: this.extractValuePropositions(allText, video.title),
        audienceTargeting: this.extractAudienceTargeting(allText, video.title, video.description)
      }
    };
  }

  /**
   * Extract actual topics from content, not predefined categories
   */
  private extractActualTopics(allText: string, title: string): string[] {
    const topics: string[] = [];
    
    // Extract nouns and noun phrases that appear significant
    const words = allText.split(/\s+/).filter(word => word.length > 3);
    const titleWords = title.toLowerCase().split(/\s+/);
    
    // Find repeated concepts across title, description, hashtags
    const conceptCounts = new Map<string, number>();
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !this.isStopWord(cleanWord)) {
        conceptCounts.set(cleanWord, (conceptCounts.get(cleanWord) || 0) + 1);
      }
    });

    // Prioritize concepts that appear in title
    titleWords.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !this.isStopWord(cleanWord)) {
        conceptCounts.set(cleanWord, (conceptCounts.get(cleanWord) || 0) + 3); // Title weight
      }
    });

    // Extract multi-word phrases from title
    const titlePhrases = this.extractMeaningfulPhrases(title);
    topics.push(...titlePhrases);

    // Get top concepts
    const sortedConcepts = Array.from(conceptCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([concept]) => this.capitalize(concept));

    topics.push(...sortedConcepts);

    return Array.from(new Set(topics));
  }

  /**
   * Extract emotional elements actually used in the content
   */
  private extractEmotionalElements(allText: string, title: string): string[] {
    const emotions: string[] = [];
    
    // Detect emotional language patterns actually used
    const emotionalPatterns = {
      excitement: /\b(amazing|incredible|awesome|mind-blowing|unbelievable|insane|crazy|epic)\b/g,
      curiosity: /\b(secret|hidden|mystery|revealed|exposed|shocking|surprising|nobody knows)\b/g,
      urgency: /\b(now|immediately|urgent|before|deadline|limited time|don't wait|hurry)\b/g,
      personal: /\b(my|personal|story|journey|experience|honest|real|authentic)\b/g,
      authority: /\b(expert|professional|proven|tested|research|study|facts|truth)\b/g,
      community: /\b(we|us|together|community|family|subscribers|audience)\b/g,
      transformation: /\b(change|transform|improve|boost|upgrade|level up|glow up)\b/g,
      problem: /\b(problem|issue|struggle|difficulty|challenge|mistake|wrong|fail)\b/g
    };

    Object.entries(emotionalPatterns).forEach(([emotion, pattern]) => {
      const matches = allText.match(pattern);
      if (matches && matches.length > 0) {
        emotions.push(`${emotion}: ${matches.slice(0, 3).join(', ')}`);
      }
    });

    return emotions;
  }

  /**
   * Extract content techniques actually used
   */
  private extractContentTechniques(allText: string, title: string, description: string): string[] {
    const techniques: string[] = [];
    
    // Analyze actual structural techniques
    if (title.includes('?')) {
      techniques.push(`Question format: "${title}"`);
    }
    
    if (/\b\d+\b/.test(title)) {
      const numbers = title.match(/\b\d+\b/g);
      techniques.push(`Numbered content: Uses ${numbers?.join(', ')}`);
    }

    if (title.includes('vs') || title.includes('versus')) {
      techniques.push(`Comparison format: "${title}"`);
    }

    if (/\b(how to|tutorial|guide|step by step)\b/i.test(title)) {
      techniques.push(`Educational format: "${title}"`);
    }

    if (/\b(review|honest|rating|reaction)\b/i.test(title)) {
      techniques.push(`Review/reaction format: "${title}"`);
    }

    // Analyze description structure
    if (description.includes('\n\n')) {
      techniques.push('Multi-paragraph description structure');
    }

    if (description.match(/\d+:\d+/)) {
      techniques.push('Timestamp organization in description');
    }

    if (description.toLowerCase().includes('subscribe')) {
      techniques.push('Subscribe call-to-action in description');
    }

    return techniques;
  }

  /**
   * Extract actual hooks used in titles and openings
   */
  private extractActualHooks(title: string, description: string): string[] {
    const hooks: string[] = [];
    
    // Title hook patterns
    if (title.startsWith('Why ')) {
      hooks.push(`Why-hook: "${title}"`);
    }
    
    if (title.startsWith('How ')) {
      hooks.push(`How-hook: "${title}"`);
    }

    if (title.startsWith('What ')) {
      hooks.push(`What-hook: "${title}"`);
    }

    if (/\b(you won't believe|will shock you|nobody tells you)\b/i.test(title)) {
      hooks.push(`Curiosity gap: "${title}"`);
    }

    if (/\b(before|after|vs|better than)\b/i.test(title)) {
      hooks.push(`Comparison hook: "${title}"`);
    }

    if (/\b(mistake|wrong|avoid|don't)\b/i.test(title)) {
      hooks.push(`Problem prevention: "${title}"`);
    }

    if (/\b(secret|hidden|revealed|exposed)\b/i.test(title)) {
      hooks.push(`Exclusive information: "${title}"`);
    }

    return hooks;
  }

  /**
   * Extract value propositions actually offered
   */
  private extractValuePropositions(allText: string, title: string): string[] {
    const values: string[] = [];
    
    // Educational value
    if (/\b(learn|teach|show|explain|understand)\b/i.test(allText)) {
      values.push('Educational value: Teaching and explanation');
    }

    // Entertainment value
    if (/\b(funny|hilarious|entertaining|reaction|comedy)\b/i.test(allText)) {
      values.push('Entertainment value: Humor and engagement');
    }

    // Transformation value
    if (/\b(improve|better|change|transform|upgrade)\b/i.test(allText)) {
      values.push('Transformation value: Personal improvement');
    }

    // Information value
    if (/\b(news|update|latest|breaking|announcement)\b/i.test(allText)) {
      values.push('Information value: News and updates');
    }

    // Community value
    if (/\b(subscribers|community|together|rating|feedback)\b/i.test(allText)) {
      values.push('Community value: Interaction and belonging');
    }

    // Authenticity value
    if (/\b(honest|real|authentic|personal|story)\b/i.test(allText)) {
      values.push('Authenticity value: Genuine personal sharing');
    }

    return values;
  }

  /**
   * Extract audience targeting actually used
   */
  private extractAudienceTargeting(allText: string, title: string, description: string): string[] {
    const targeting: string[] = [];
    
    // Direct address patterns
    if (/\byou\b/gi.test(title)) {
      const youCount = (title.match(/\byou\b/gi) || []).length;
      targeting.push(`Direct audience address: Uses "you" ${youCount} times in title`);
    }

    // Demographic targeting
    if (/\b(beginner|starter|newbie|first time)\b/i.test(allText)) {
      targeting.push('Beginner-focused content');
    }

    if (/\b(advanced|expert|professional|pro)\b/i.test(allText)) {
      targeting.push('Advanced audience targeting');
    }

    if (/\b(teen|young|student|college)\b/i.test(allText)) {
      targeting.push('Young audience targeting');
    }

    // Interest-based targeting
    if (/\b(if you|for people who|anyone who)\b/i.test(description)) {
      targeting.push('Conditional targeting in description');
    }

    // Problem-based targeting
    if (/\b(struggling with|having trouble|need help)\b/i.test(allText)) {
      targeting.push('Problem-focused audience targeting');
    }

    return targeting;
  }

  /**
   * Extract dynamic success factors from top performers
   */
  private extractDynamicSuccessFactors(topPerformers: ActualContentAnalysis[], allAnalyses: ActualContentAnalysis[]): DynamicSuccessFactor[] {
    const factors: DynamicSuccessFactor[] = [];
    
    if (topPerformers.length === 0) return factors;

    // Analyze common elements in top performers
    const commonTopics = this.findCommonElements(topPerformers.map(p => p.extractedElements.topics));
    const commonEmotions = this.findCommonElements(topPerformers.map(p => p.extractedElements.emotions));
    const commonTechniques = this.findCommonElements(topPerformers.map(p => p.extractedElements.techniques));
    const commonHooks = this.findCommonElements(topPerformers.map(p => p.extractedElements.hooks));

    // Topic-based success factor
    if (commonTopics.length > 0) {
      const topTopic = commonTopics[0];
      const relevantVideos = topPerformers.filter(p => 
        p.extractedElements.topics.some(topic => topic.toLowerCase().includes(topTopic.toLowerCase()))
      );
      
      factors.push({
        factor: `"${topTopic}" Content Focus`,
        description: `Videos featuring "${topTopic}" consistently outperform average content`,
        impact: relevantVideos.reduce((sum, v) => sum + v.performanceMultiplier, 0) / relevantVideos.length,
        evidence: {
          videos: relevantVideos,
          commonElements: relevantVideos.map(v => v.title),
          specificExamples: relevantVideos.map(v => `"${v.title}" - ${v.performanceMultiplier.toFixed(1)}x multiplier`)
        },
        implementation: `Create more content around "${topTopic}" using similar approaches to: ${relevantVideos[0]?.title}`,
        frequency: relevantVideos.length
      });
    }

    // Emotional pattern success factor
    if (commonEmotions.length > 0) {
      const topEmotion = commonEmotions[0];
      const relevantVideos = topPerformers.filter(p => 
        p.extractedElements.emotions.some(emotion => emotion.includes(topEmotion.split(':')[0]))
      );

      if (relevantVideos.length > 0) {
        factors.push({
          factor: `${topEmotion.split(':')[0]} Emotional Trigger`,
          description: `Using ${topEmotion.split(':')[0].toLowerCase()} language significantly boosts performance`,
          impact: relevantVideos.reduce((sum, v) => sum + v.performanceMultiplier, 0) / relevantVideos.length,
          evidence: {
            videos: relevantVideos,
            commonElements: [topEmotion],
            specificExamples: relevantVideos.map(v => `"${v.title}" uses ${topEmotion}`)
          },
          implementation: `Incorporate more ${topEmotion.split(':')[0].toLowerCase()} language in titles and descriptions`,
          frequency: relevantVideos.length
        });
      }
    }

    // Technical approach success factor
    if (commonTechniques.length > 0) {
      const topTechnique = commonTechniques[0];
      const relevantVideos = topPerformers.filter(p => 
        p.extractedElements.techniques.some(tech => tech.includes(topTechnique.split(':')[0]))
      );

      if (relevantVideos.length > 0) {
        factors.push({
          factor: topTechnique.split(':')[0],
          description: `This specific format/technique drives superior engagement`,
          impact: relevantVideos.reduce((sum, v) => sum + v.performanceMultiplier, 0) / relevantVideos.length,
          evidence: {
            videos: relevantVideos,
            commonElements: relevantVideos.map(v => v.extractedElements.techniques.find(t => t.includes(topTechnique.split(':')[0])) || ''),
            specificExamples: relevantVideos.map(v => `"${v.title}" - ${topTechnique}`)
          },
          implementation: `Apply this exact format to upcoming videos, especially for topics similar to your best performers`,
          frequency: relevantVideos.length
        });
      }
    }

    return factors.sort((a, b) => b.impact - a.impact).slice(0, 5);
  }

  /**
   * Generate dynamic recommendations based on actual content analysis
   */
  private generateDynamicRecommendations(topPerformers: ActualContentAnalysis[], allAnalyses: ActualContentAnalysis[]): DynamicRecommendation[] {
    const recommendations: DynamicRecommendation[] = [];
    
    if (topPerformers.length === 0) return recommendations;

    // Title strategy recommendation based on actual successful titles
    const successfulTitlePatterns = this.analyzeSuccessfulTitlePatterns(topPerformers);
    if (successfulTitlePatterns.length > 0) {
      const pattern = successfulTitlePatterns[0];
      recommendations.push({
        action: `Apply "${pattern.pattern}" Title Strategy`,
        reasoning: `Your ${pattern.examples.length} highest-performing videos all use this exact title approach`,
        basedOn: {
          successfulVideos: pattern.examples,
          specificPatterns: [pattern.pattern],
          actualContent: pattern.examples.map(title => `Successful example: "${title}"`)
        },
        implementation: {
          immediate: [
            `Create 3 new video titles following this exact pattern: ${pattern.pattern}`,
            `Use similar keywords and phrasing as your top performer: "${pattern.examples[0]}"`
          ],
          ongoing: [
            'Track performance of new videos using this pattern',
            'Refine the pattern based on what works best for your specific audience'
          ]
        },
        expectedOutcome: `Expected ${pattern.avgMultiplier.toFixed(1)}x performance boost based on your historical data`
      });
    }

    // Content topic recommendation based on actual successful topics
    const topTopics = this.extractTopSuccessfulTopics(topPerformers);
    if (topTopics.length > 0) {
      const topic = topTopics[0];
      recommendations.push({
        action: `Double Down on "${topic.topic}" Content`,
        reasoning: `This topic appears in ${topic.frequency} of your top performers with ${topic.avgMultiplier.toFixed(1)}x average performance`,
        basedOn: {
          successfulVideos: topic.examples.map(v => v.title),
          specificPatterns: topic.examples.map(v => `${topic.topic} in "${v.title}"`),
          actualContent: topic.examples.map(v => `"${v.title}" - ${v.performanceMultiplier.toFixed(1)}x multiplier`)
        },
        implementation: {
          immediate: [
            `Plan 5 new videos specifically around "${topic.topic}"`,
            `Study what made "${topic.examples[0].title}" successful and replicate those elements`
          ],
          ongoing: [
            `Build a content series around "${topic.topic}"`,
            'Explore different angles and approaches within this topic'
          ]
        },
        expectedOutcome: `Build authority in "${topic.topic}" while leveraging proven audience interest`
      });
    }

    // Engagement technique recommendation based on actual successful approaches
    const engagementTechniques = this.analyzeEngagementTechniques(topPerformers);
    if (engagementTechniques.length > 0) {
      const technique = engagementTechniques[0];
      recommendations.push({
        action: `Implement "${technique.technique}" Engagement Strategy`,
        reasoning: `Videos using this approach average ${technique.avgMultiplier.toFixed(1)}x performance`,
        basedOn: {
          successfulVideos: technique.examples.map(v => v.title),
          specificPatterns: technique.examples.map(v => technique.technique),
          actualContent: technique.examples.map(v => `"${v.title}" uses ${technique.technique}`)
        },
        implementation: {
          immediate: [
            `Apply this exact technique to your next 3 videos`,
            `Study how "${technique.examples[0].title}" implements this approach`
          ],
          ongoing: [
            'Make this technique a signature element of your content',
            'Experiment with variations while maintaining core approach'
          ]
        },
        expectedOutcome: `Improved audience engagement and retention based on proven channel performance`
      });
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Identify dynamic competitive advantages from actual content
   */
  private identifyDynamicCompetitiveAdvantages(topPerformers: ActualContentAnalysis[], channelData: EnhancedChannelData): DynamicCompetitiveAdvantage[] {
    const advantages: DynamicCompetitiveAdvantage[] = [];
    
    if (topPerformers.length === 0) return advantages;

    // Unique content approach advantage
    const uniqueApproaches = this.identifyUniqueContentApproaches(topPerformers);
    if (uniqueApproaches.length > 0) {
      const approach = uniqueApproaches[0];
      advantages.push({
        advantage: approach.approach,
        uniqueElements: approach.elements,
        evidenceFromContent: {
          titles: approach.examples.map(v => v.title),
          descriptions: approach.examples.map(v => v.description.substring(0, 100) + '...'),
          hashtags: approach.examples.flatMap(v => v.hashtags).slice(0, 10),
          transcriptSnippets: approach.examples
            .filter(v => v.captions)
            .map(v => v.captions!.substring(0, 100) + '...')
            .slice(0, 3)
        },
        howToLeverage: [
          `Emphasize this unique approach in all content: ${approach.approach}`,
          `Build brand identity around: ${approach.elements.join(', ')}`,
          'Create content series that showcase this differentiation'
        ],
        whyItWorks: `This approach consistently generates ${approach.avgMultiplier.toFixed(1)}x above-average performance because it differentiates you from competitors while resonating with your specific audience`
      });
    }

    // Communication style advantage
    const communicationStyle = this.identifyUniqueCommunicationStyle(topPerformers);
    if (communicationStyle) {
      advantages.push({
        advantage: `Distinctive ${communicationStyle.style} Communication Style`,
        uniqueElements: communicationStyle.characteristics,
        evidenceFromContent: {
          titles: communicationStyle.examples.map(v => v.title),
          descriptions: communicationStyle.examples.map(v => v.description.substring(0, 100) + '...'),
          hashtags: communicationStyle.examples.flatMap(v => v.hashtags).slice(0, 10),
          transcriptSnippets: communicationStyle.examples
            .filter(v => v.captions)
            .map(v => v.captions!.substring(0, 100) + '...')
            .slice(0, 3)
        },
        howToLeverage: [
          `Maintain consistent ${communicationStyle.style.toLowerCase()} tone across all content`,
          'Train any team members or collaborators on this specific style',
          'Use this style as a brand differentiator in titles and thumbnails'
        ],
        whyItWorks: `This communication style creates authentic connection with your audience that competitors cannot easily replicate`
      });
    }

    return advantages;
  }

  /**
   * Extract content DNA from top performers
   */
  private extractContentDNA(topPerformers: ActualContentAnalysis[]): ChannelSpecificInsights['contentDNA'] {
    if (topPerformers.length === 0) {
      return {
        corethemes: [],
        communicationStyle: [],
        audienceConnection: [],
        uniqueApproach: []
      };
    }

    const allTopics = topPerformers.flatMap(p => p.extractedElements.topics);
    const allEmotions = topPerformers.flatMap(p => p.extractedElements.emotions);
    const allTechniques = topPerformers.flatMap(p => p.extractedElements.techniques);
    const allValues = topPerformers.flatMap(p => p.extractedElements.valuePropositions);

    return {
      corethemes: this.findMostCommon(allTopics).slice(0, 5),
      communicationStyle: this.findMostCommon(allEmotions).slice(0, 3),
      audienceConnection: this.findMostCommon(allValues).slice(0, 3),
      uniqueApproach: this.findMostCommon(allTechniques).slice(0, 4)
    };
  }

  /**
   * Generate optimization strategies based on actual content performance
   */
  private generateOptimizationStrategies(topPerformers: ActualContentAnalysis[], allAnalyses: ActualContentAnalysis[]): ChannelSpecificInsights['optimization'] {
    if (topPerformers.length === 0) {
      return {
        titleStrategies: [],
        contentStrategies: [],
        engagementStrategies: []
      };
    }

    return {
      titleStrategies: this.generateTitleStrategies(topPerformers),
      contentStrategies: this.generateContentStrategies(topPerformers),
      engagementStrategies: this.generateEngagementStrategies(topPerformers)
    };
  }

  // Helper methods

  private extractMeaningfulPhrases(title: string): string[] {
    const phrases: string[] = [];
    const words = title.split(' ');
    
    // Extract 2-3 word phrases that seem meaningful
    for (let i = 0; i < words.length - 1; i++) {
      const twoWord = `${words[i]} ${words[i + 1]}`.replace(/[^\w\s]/g, '').toLowerCase();
      if (twoWord.length > 6 && !this.isGenericPhrase(twoWord)) {
        phrases.push(this.capitalize(twoWord));
      }
      
      if (i < words.length - 2) {
        const threeWord = `${words[i]} ${words[i + 1]} ${words[i + 2]}`.replace(/[^\w\s]/g, '').toLowerCase();
        if (threeWord.length > 10 && !this.isGenericPhrase(threeWord)) {
          phrases.push(this.capitalize(threeWord));
        }
      }
    }
    
    return phrases.slice(0, 3);
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been',
      'will', 'more', 'when', 'what', 'where', 'why', 'how', 'all', 'any', 'can',
      'could', 'should', 'would', 'also', 'just', 'only', 'even', 'much', 'most',
      'very', 'still', 'way', 'well', 'may', 'might', 'said', 'make', 'take',
      'video', 'youtube', 'subscribe', 'like', 'comment', 'watch'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  private isGenericPhrase(phrase: string): boolean {
    const genericPhrases = ['in this', 'of the', 'to the', 'for the', 'with the', 'on the'];
    return genericPhrases.some(generic => phrase.includes(generic));
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private findCommonElements(elementArrays: string[][]): string[] {
    const counts = new Map<string, number>();
    elementArrays.forEach(elements => {
      elements.forEach(element => {
        counts.set(element, (counts.get(element) || 0) + 1);
      });
    });
    
    return Array.from(counts.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([element]) => element);
  }

  private findMostCommon(elements: string[]): string[] {
    const counts = new Map<string, number>();
    elements.forEach(element => {
      counts.set(element, (counts.get(element) || 0) + 1);
    });
    
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([element]) => element);
  }

  private analyzeSuccessfulTitlePatterns(topPerformers: ActualContentAnalysis[]): Array<{
    pattern: string;
    examples: string[];
    avgMultiplier: number;
  }> {
    const patterns: Array<{
      pattern: string;
      examples: string[];
      avgMultiplier: number;
    }> = [];

    // Analyze actual title structures
    const titleStructures = new Map<string, { examples: string[]; multipliers: number[] }>();

    topPerformers.forEach(performer => {
      const title = performer.title;
      let structure = '';

      if (title.includes('?')) {
        structure = 'Question format ending with "?"';
      } else if (/^\d+/.test(title)) {
        structure = 'Starts with number (list format)';
      } else if (title.toLowerCase().includes('how to')) {
        structure = 'How-to instructional format';
      } else if (/\b(vs|versus)\b/i.test(title)) {
        structure = 'Comparison format (X vs Y)';
      } else if (/\b(rating|review)\b/i.test(title)) {
        structure = 'Rating/review format';
      } else {
        structure = 'Direct statement format';
      }

      if (!titleStructures.has(structure)) {
        titleStructures.set(structure, { examples: [], multipliers: [] });
      }
      const data = titleStructures.get(structure)!;
      data.examples.push(title);
      data.multipliers.push(performer.performanceMultiplier);
    });

    Array.from(titleStructures.entries()).forEach(([structure, data]) => {
      if (data.examples.length >= 2) {
        patterns.push({
          pattern: structure,
          examples: data.examples,
          avgMultiplier: data.multipliers.reduce((sum, m) => sum + m, 0) / data.multipliers.length
        });
      }
    });

    return patterns.sort((a, b) => b.avgMultiplier - a.avgMultiplier);
  }

  private extractTopSuccessfulTopics(topPerformers: ActualContentAnalysis[]): Array<{
    topic: string;
    frequency: number;
    avgMultiplier: number;
    examples: ActualContentAnalysis[];
  }> {
    const topicStats = new Map<string, { examples: ActualContentAnalysis[]; multipliers: number[] }>();

    topPerformers.forEach(performer => {
      performer.extractedElements.topics.forEach(topic => {
        if (!topicStats.has(topic)) {
          topicStats.set(topic, { examples: [], multipliers: [] });
        }
        const data = topicStats.get(topic)!;
        data.examples.push(performer);
        data.multipliers.push(performer.performanceMultiplier);
      });
    });

    return Array.from(topicStats.entries())
      .filter(([_, data]) => data.examples.length >= 2)
      .map(([topic, data]) => ({
        topic,
        frequency: data.examples.length,
        avgMultiplier: data.multipliers.reduce((sum, m) => sum + m, 0) / data.multipliers.length,
        examples: data.examples
      }))
      .sort((a, b) => b.avgMultiplier - a.avgMultiplier);
  }

  private analyzeEngagementTechniques(topPerformers: ActualContentAnalysis[]): Array<{
    technique: string;
    examples: ActualContentAnalysis[];
    avgMultiplier: number;
  }> {
    const techniques: Array<{
      technique: string;
      examples: ActualContentAnalysis[];
      avgMultiplier: number;
    }> = [];

    const techniqueStats = new Map<string, { examples: ActualContentAnalysis[]; multipliers: number[] }>();

    topPerformers.forEach(performer => {
      performer.extractedElements.techniques.forEach(technique => {
        const techName = technique.split(':')[0];
        if (!techniqueStats.has(techName)) {
          techniqueStats.set(techName, { examples: [], multipliers: [] });
        }
        const data = techniqueStats.get(techName)!;
        data.examples.push(performer);
        data.multipliers.push(performer.performanceMultiplier);
      });
    });

    Array.from(techniqueStats.entries()).forEach(([technique, data]) => {
      if (data.examples.length >= 2) {
        techniques.push({
          technique,
          examples: data.examples,
          avgMultiplier: data.multipliers.reduce((sum, m) => sum + m, 0) / data.multipliers.length
        });
      }
    });

    return techniques.sort((a, b) => b.avgMultiplier - a.avgMultiplier);
  }

  private identifyUniqueContentApproaches(topPerformers: ActualContentAnalysis[]): Array<{
    approach: string;
    elements: string[];
    examples: ActualContentAnalysis[];
    avgMultiplier: number;
  }> {
    // Analyze what makes this channel's approach unique
    const approaches: Array<{
      approach: string;
      elements: string[];
      examples: ActualContentAnalysis[];
      avgMultiplier: number;
    }> = [];

    // Look for patterns across multiple elements
    const allTitles = topPerformers.map(p => p.title).join(' ').toLowerCase();
    
    if (allTitles.includes('rating') && allTitles.includes('subscribers')) {
      approaches.push({
        approach: 'Interactive Subscriber Rating Format',
        elements: ['Community interaction', 'Direct feedback', 'Subscriber participation'],
        examples: topPerformers.filter(p => p.title.toLowerCase().includes('rating')),
        avgMultiplier: topPerformers
          .filter(p => p.title.toLowerCase().includes('rating'))
          .reduce((sum, p) => sum + p.performanceMultiplier, 0) / 
          topPerformers.filter(p => p.title.toLowerCase().includes('rating')).length
      });
    }

    if (allTitles.includes('honest') || allTitles.includes('brutal')) {
      approaches.push({
        approach: 'Brutally Honest Review Style',
        elements: ['Unfiltered opinions', 'Authentic feedback', 'Direct communication'],
        examples: topPerformers.filter(p => /\b(honest|brutal)\b/i.test(p.title)),
        avgMultiplier: topPerformers
          .filter(p => /\b(honest|brutal)\b/i.test(p.title))
          .reduce((sum, p) => sum + p.performanceMultiplier, 0) / 
          topPerformers.filter(p => /\b(honest|brutal)\b/i.test(p.title)).length
      });
    }

    return approaches.filter(a => a.examples.length > 0);
  }

  private identifyUniqueCommunicationStyle(topPerformers: ActualContentAnalysis[]): {
    style: string;
    characteristics: string[];
    examples: ActualContentAnalysis[];
  } | null {
    const allText = topPerformers.map(p => `${p.title} ${p.description}`).join(' ').toLowerCase();
    
    // Analyze communication patterns
    const directCount = (allText.match(/\b(you|your)\b/g) || []).length;
    const personalCount = (allText.match(/\b(my|i|me)\b/g) || []).length;
    const emotionalCount = (allText.match(/\b(amazing|incredible|love|hate|feel)\b/g) || []).length;
    
    if (directCount > personalCount * 2) {
      return {
        style: 'Direct Audience-Focused',
        characteristics: ['Uses "you" frequently', 'Addresses audience directly', 'Creates personal connection'],
        examples: topPerformers.filter(p => /\byou\b/i.test(p.title))
      };
    } else if (personalCount > directCount) {
      return {
        style: 'Personal Storytelling',
        characteristics: ['Shares personal experiences', 'Uses "my" and "I" frequently', 'Authentic self-sharing'],
        examples: topPerformers.filter(p => /\b(my|i)\b/i.test(p.title))
      };
    } else if (emotionalCount > 10) {
      return {
        style: 'Emotionally Expressive',
        characteristics: ['Uses emotional language', 'Expressive communication', 'High energy delivery'],
        examples: topPerformers
      };
    }

    return null;
  }

  private generateTitleStrategies(topPerformers: ActualContentAnalysis[]): string[] {
    const strategies: string[] = [];
    
    const avgTitleLength = topPerformers.reduce((sum, p) => sum + p.title.length, 0) / topPerformers.length;
    strategies.push(`Maintain ${Math.round(avgTitleLength)}-character titles (your optimal length)`);
    
    const questionTitles = topPerformers.filter(p => p.title.includes('?'));
    if (questionTitles.length > 0) {
      strategies.push(`Use question format like "${questionTitles[0].title}" - proven ${questionTitles[0].performanceMultiplier.toFixed(1)}x multiplier`);
    }

    const numberTitles = topPerformers.filter(p => /\d+/.test(p.title));
    if (numberTitles.length > 0) {
      strategies.push(`Include numbers like "${numberTitles[0].title}" - drives structured content expectation`);
    }

    return strategies;
  }

  private generateContentStrategies(topPerformers: ActualContentAnalysis[]): string[] {
    const strategies: string[] = [];
    
    const topTopics = this.extractTopSuccessfulTopics(topPerformers);
    if (topTopics.length > 0) {
      strategies.push(`Focus 60% of content on "${topTopics[0].topic}" - your highest-performing topic`);
    }

    const valueProps = topPerformers.flatMap(p => p.extractedElements.valuePropositions);
    const topValue = this.findMostCommon(valueProps)[0];
    if (topValue) {
      strategies.push(`Emphasize ${topValue.toLowerCase()} in all content - your audience's primary value expectation`);
    }

    return strategies;
  }

  private generateEngagementStrategies(topPerformers: ActualContentAnalysis[]): string[] {
    const strategies: string[] = [];
    
    const targeting = topPerformers.flatMap(p => p.extractedElements.audienceTargeting);
    const topTargeting = this.findMostCommon(targeting)[0];
    if (topTargeting) {
      strategies.push(`Continue ${topTargeting.toLowerCase()} - this audience connection drives your success`);
    }

    const hooks = topPerformers.flatMap(p => p.extractedElements.hooks);
    const topHook = this.findMostCommon(hooks)[0];
    if (topHook) {
      strategies.push(`Use ${topHook.toLowerCase()} in titles and openings - your most effective hook type`);
    }

    return strategies;
  }
}