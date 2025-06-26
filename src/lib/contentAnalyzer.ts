import { EnhancedVideoData, EnhancedChannelData } from './enhancedYouTubeAPI';

export interface ContentPattern {
  pattern: string;
  frequency: number;
  avgViews: number;
  avgPerformanceMultiplier: number;
  examples: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface ThemeCluster {
  theme: string;
  keywords: string[];
  videoCount: number;
  avgViews: number;
  topPerformers: EnhancedVideoData[];
  emotionalTone: 'positive' | 'negative' | 'neutral' | 'mixed';
  contentType: 'educational' | 'entertainment' | 'personal' | 'review' | 'tutorial';
}

export interface ChannelVoiceProfile {
  tone: 'professional' | 'casual' | 'humorous' | 'serious' | 'inspirational';
  personality: string[];
  vocabularyLevel: 'simple' | 'advanced' | 'mixed';
  communicationStyle: 'direct' | 'storytelling' | 'conversational' | 'instructional';
  targetAudience: string;
  uniqueElements: string[];
}

export interface ContentAnalysisResult {
  titlePatterns: ContentPattern[];
  descriptionPatterns: ContentPattern[];
  hashtagPatterns: ContentPattern[];
  themeAnalysis: ThemeCluster[];
  voiceProfile: ChannelVoiceProfile;
  contentPillars: string[];
  successIndicators: string[];
  audienceEngagementFactors: string[];
}

export class ContentAnalyzer {
  
  /**
   * Analyze comprehensive content patterns for a channel
   */
  analyzeChannelContent(channelData: EnhancedChannelData): ContentAnalysisResult {
    const videos = channelData.recentVideos;
    const topPerformers = this.getTopPerformers(videos);

    return {
      titlePatterns: this.analyzeTitlePatterns(videos),
      descriptionPatterns: this.analyzeDescriptionPatterns(videos),
      hashtagPatterns: this.analyzeHashtagPatterns(videos),
      themeAnalysis: this.analyzeThemes(videos),
      voiceProfile: this.analyzeChannelVoice(channelData),
      contentPillars: this.identifyContentPillars(videos),
      successIndicators: this.identifySuccessIndicators(topPerformers),
      audienceEngagementFactors: this.analyzeEngagementFactors(videos, topPerformers)
    };
  }

  /**
   * Analyze title patterns and their performance correlation
   */
  private analyzeTitlePatterns(videos: EnhancedVideoData[]): ContentPattern[] {
    const patterns: Map<string, { videos: EnhancedVideoData[], totalViews: number }> = new Map();
    
    videos.forEach(video => {
      const detectedPatterns = this.detectTitlePatterns(video.title);
      detectedPatterns.forEach(pattern => {
        if (!patterns.has(pattern)) {
          patterns.set(pattern, { videos: [], totalViews: 0 });
        }
        const patternData = patterns.get(pattern)!;
        patternData.videos.push(video);
        patternData.totalViews += video.viewCount;
      });
    });

    const avgChannelViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;
    
    return Array.from(patterns.entries())
      .map(([pattern, data]) => ({
        pattern,
        frequency: data.videos.length,
        avgViews: data.totalViews / data.videos.length,
        avgPerformanceMultiplier: (data.totalViews / data.videos.length) / avgChannelViews,
        examples: data.videos.slice(0, 3).map(v => v.title),
        confidence: this.calculateConfidence(data.videos.length, videos.length)
      }))
      .filter(p => p.frequency >= 2) // Only patterns that appear at least twice
      .sort((a, b) => b.avgPerformanceMultiplier - a.avgPerformanceMultiplier)
      .slice(0, 10);
  }

  /**
   * Detect specific patterns in video titles
   */
  private detectTitlePatterns(title: string): string[] {
    const patterns: string[] = [];
    const titleLower = title.toLowerCase();

    // Question patterns
    if (title.includes('?')) patterns.push('Question Format');
    if (titleLower.match(/^(how|why|what|when|where|which)/)) patterns.push('Question Starter');

    // Numbered content
    if (title.match(/\b\d+\b/)) patterns.push('Numbered Content');

    // Emotional triggers
    if (titleLower.match(/\b(shocking|amazing|incredible|unbelievable|insane|crazy)\b/)) patterns.push('Emotional Amplifier');
    
    // Personal/direct address
    if (titleLower.match(/\b(you|your|i|my|me)\b/)) patterns.push('Personal Address');

    // Urgency/time
    if (titleLower.match(/\b(now|today|urgent|immediate|quick|fast)\b/)) patterns.push('Urgency Indicator');

    // Comparison/vs
    if (titleLower.includes('vs') || titleLower.includes('versus')) patterns.push('Comparison Format');

    // Tutorial/guide
    if (titleLower.match(/\b(guide|tutorial|how to|step by step)\b/)) patterns.push('Educational Format');

    // Review/rating
    if (titleLower.match(/\b(review|rating|honest|reaction)\b/)) patterns.push('Review Format');

    // Brackets/parentheses
    if (title.includes('[') || title.includes('(')) patterns.push('Bracketed Info');

    // Capital letters emphasis
    if (title.match(/[A-Z]{2,}/)) patterns.push('Caps Emphasis');

    // Length categories
    if (title.length <= 30) patterns.push('Short Title');
    else if (title.length >= 70) patterns.push('Long Title');
    else patterns.push('Medium Title');

    return patterns;
  }

  /**
   * Analyze description patterns
   */
  private analyzeDescriptionPatterns(videos: EnhancedVideoData[]): ContentPattern[] {
    const patterns: Map<string, { videos: EnhancedVideoData[], totalViews: number }> = new Map();
    
    videos.forEach(video => {
      if (!video.description) return;
      
      const detectedPatterns = this.detectDescriptionPatterns(video.description);
      detectedPatterns.forEach(pattern => {
        if (!patterns.has(pattern)) {
          patterns.set(pattern, { videos: [], totalViews: 0 });
        }
        const patternData = patterns.get(pattern)!;
        patternData.videos.push(video);
        patternData.totalViews += video.viewCount;
      });
    });

    const avgChannelViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;
    
    return Array.from(patterns.entries())
      .map(([pattern, data]) => ({
        pattern,
        frequency: data.videos.length,
        avgViews: data.totalViews / data.videos.length,
        avgPerformanceMultiplier: (data.totalViews / data.videos.length) / avgChannelViews,
        examples: data.videos.slice(0, 2).map(v => v.title),
        confidence: this.calculateConfidence(data.videos.length, videos.length)
      }))
      .filter(p => p.frequency >= 2)
      .sort((a, b) => b.avgPerformanceMultiplier - a.avgPerformanceMultiplier)
      .slice(0, 8);
  }

  /**
   * Detect patterns in video descriptions
   */
  private detectDescriptionPatterns(description: string): string[] {
    const patterns: string[] = [];
    const descLower = description.toLowerCase();

    // Length patterns
    if (description.length < 100) patterns.push('Short Description');
    else if (description.length > 1000) patterns.push('Long Description');
    else patterns.push('Medium Description');

    // Structure patterns
    if (description.includes('\n\n')) patterns.push('Multi-paragraph');
    if (description.match(/\d+\./)) patterns.push('Numbered List');
    if (description.includes('---') || description.includes('___')) patterns.push('Section Dividers');

    // Call-to-action patterns
    if (descLower.includes('subscribe')) patterns.push('Subscribe CTA');
    if (descLower.includes('like') && descLower.includes('comment')) patterns.push('Engagement CTA');
    if (descLower.includes('follow me') || descLower.includes('follow us')) patterns.push('Follow CTA');

    // Link patterns
    if (description.includes('http')) patterns.push('External Links');
    if (description.includes('@')) patterns.push('Social Media Tags');

    // Timestamp patterns
    if (description.match(/\d+:\d+/)) patterns.push('Timestamps');

    // Hashtag patterns
    if (description.includes('#')) patterns.push('Hashtag Heavy');

    return patterns;
  }

  /**
   * Analyze hashtag usage patterns
   */
  private analyzeHashtagPatterns(videos: EnhancedVideoData[]): ContentPattern[] {
    const hashtagFreq: Map<string, { count: number, totalViews: number, videos: EnhancedVideoData[] }> = new Map();
    
    videos.forEach(video => {
      video.hashtags.forEach(hashtag => {
        if (!hashtagFreq.has(hashtag)) {
          hashtagFreq.set(hashtag, { count: 0, totalViews: 0, videos: [] });
        }
        const data = hashtagFreq.get(hashtag)!;
        data.count++;
        data.totalViews += video.viewCount;
        data.videos.push(video);
      });
    });

    const avgChannelViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;

    return Array.from(hashtagFreq.entries())
      .map(([hashtag, data]) => ({
        pattern: hashtag,
        frequency: data.count,
        avgViews: data.totalViews / data.count,
        avgPerformanceMultiplier: (data.totalViews / data.count) / avgChannelViews,
        examples: data.videos.slice(0, 2).map(v => v.title),
        confidence: this.calculateConfidence(data.count, videos.length)
      }))
      .filter(p => p.frequency >= 2)
      .sort((a, b) => b.avgPerformanceMultiplier - a.avgPerformanceMultiplier)
      .slice(0, 10);
  }

  /**
   * Analyze content themes and clusters
   */
  private analyzeThemes(videos: EnhancedVideoData[]): ThemeCluster[] {
    const themes: Map<string, ThemeCluster> = new Map();
    
    videos.forEach(video => {
      const detectedThemes = this.detectVideoThemes(video);
      detectedThemes.forEach(theme => {
        if (!themes.has(theme.theme)) {
          themes.set(theme.theme, {
            theme: theme.theme,
            keywords: theme.keywords,
            videoCount: 0,
            avgViews: 0,
            topPerformers: [],
            emotionalTone: theme.emotionalTone,
            contentType: theme.contentType
          });
        }
        
        const themeData = themes.get(theme.theme)!;
        themeData.videoCount++;
        themeData.avgViews = ((themeData.avgViews * (themeData.videoCount - 1)) + video.viewCount) / themeData.videoCount;
        
        // Keep top 3 performers for each theme
        themeData.topPerformers.push(video);
        themeData.topPerformers.sort((a, b) => b.viewCount - a.viewCount);
        themeData.topPerformers = themeData.topPerformers.slice(0, 3);
      });
    });

    return Array.from(themes.values())
      .filter(theme => theme.videoCount >= 2)
      .sort((a, b) => b.avgViews - a.avgViews)
      .slice(0, 8);
  }

  /**
   * Detect themes in individual videos
   */
  private detectVideoThemes(video: EnhancedVideoData[]): { theme: string, keywords: string[], emotionalTone: any, contentType: any }[] {
    const title = video.title.toLowerCase();
    const description = video.description.toLowerCase();
    const content = `${title} ${description}`;
    
    const themes: { theme: string, keywords: string[], emotionalTone: any, contentType: any }[] = [];

    // Beauty/Appearance themes
    if (content.match(/\b(face|beauty|skin|hair|makeup|looks|appearance|style|fashion|rating|rate)\b/)) {
      themes.push({
        theme: 'Beauty & Appearance',
        keywords: ['face', 'beauty', 'looks', 'style', 'rating'],
        emotionalTone: 'mixed',
        contentType: 'personal'
      });
    }

    // Self-improvement themes
    if (content.match(/\b(tips|advice|guide|improvement|better|change|transform|glow.?up)\b/)) {
      themes.push({
        theme: 'Self-Improvement',
        keywords: ['tips', 'advice', 'improvement', 'better'],
        emotionalTone: 'positive',
        contentType: 'educational'
      });
    }

    // Community/Subscriber interaction
    if (content.match(/\b(subscribers?|audience|community|rating|react|response|interaction)\b/)) {
      themes.push({
        theme: 'Community Interaction',
        keywords: ['subscribers', 'community', 'rating', 'interaction'],
        emotionalTone: 'positive',
        contentType: 'entertainment'
      });
    }

    // Personal story/journey
    if (content.match(/\b(my|personal|story|journey|experience|life|about|me)\b/)) {
      themes.push({
        theme: 'Personal Content',
        keywords: ['personal', 'story', 'journey', 'experience'],
        emotionalTone: 'neutral',
        contentType: 'personal'
      });
    }

    return themes;
  }

  /**
   * Analyze channel voice and personality
   */
  private analyzeChannelVoice(channelData: EnhancedChannelData): ChannelVoiceProfile {
    const allText = [
      channelData.description,
      ...channelData.recentVideos.map(v => `${v.title} ${v.description}`)
    ].join(' ').toLowerCase();

    const tone = this.determineTone(allText);
    const personality = this.extractPersonalityTraits(allText);
    const vocabularyLevel = this.analyzeVocabularyLevel(allText);
    const communicationStyle = this.determineCommunicationStyle(allText);
    const targetAudience = this.identifyTargetAudience(channelData);
    const uniqueElements = this.extractUniqueElements(channelData);

    return {
      tone,
      personality,
      vocabularyLevel,
      communicationStyle,
      targetAudience,
      uniqueElements
    };
  }

  private determineTone(text: string): 'professional' | 'casual' | 'humorous' | 'serious' | 'inspirational' {
    const humorWords = ['lol', 'haha', 'funny', 'joke', 'laugh', 'hilarious', 'comedy'];
    const professionalWords = ['analysis', 'research', 'professional', 'expert', 'study', 'data'];
    const inspirationalWords = ['inspire', 'motivate', 'dream', 'achieve', 'success', 'goal'];
    const casualWords = ['hey', 'guys', 'awesome', 'cool', 'dude', 'like', 'literally'];

    const humorScore = humorWords.filter(word => text.includes(word)).length;
    const professionalScore = professionalWords.filter(word => text.includes(word)).length;
    const inspirationalScore = inspirationalWords.filter(word => text.includes(word)).length;
    const casualScore = casualWords.filter(word => text.includes(word)).length;

    const maxScore = Math.max(humorScore, professionalScore, inspirationalScore, casualScore);
    
    if (maxScore === humorScore && humorScore > 0) return 'humorous';
    if (maxScore === professionalScore && professionalScore > 0) return 'professional';
    if (maxScore === inspirationalScore && inspirationalScore > 0) return 'inspirational';
    if (maxScore === casualScore && casualScore > 0) return 'casual';
    
    return 'serious';
  }

  private extractPersonalityTraits(text: string): string[] {
    const traits: string[] = [];
    
    if (text.includes('honest') || text.includes('authentic')) traits.push('Authentic');
    if (text.includes('brutal') || text.includes('direct')) traits.push('Direct');
    if (text.includes('help') || text.includes('support')) traits.push('Helpful');
    if (text.includes('expert') || text.includes('knowledge')) traits.push('Knowledgeable');
    if (text.includes('fun') || text.includes('enjoy')) traits.push('Entertaining');
    if (text.includes('real') || text.includes('genuine')) traits.push('Genuine');
    
    return traits.slice(0, 3);
  }

  private analyzeVocabularyLevel(text: string): 'simple' | 'advanced' | 'mixed' {
    const advancedWords = text.match(/\b[a-z]{8,}\b/g) || [];
    const totalWords = text.split(/\s+/).length;
    const advancedRatio = advancedWords.length / totalWords;
    
    if (advancedRatio > 0.15) return 'advanced';
    if (advancedRatio < 0.05) return 'simple';
    return 'mixed';
  }

  private determineCommunicationStyle(text: string): 'direct' | 'storytelling' | 'conversational' | 'instructional' {
    if (text.includes('step') && text.includes('how')) return 'instructional';
    if (text.includes('story') || text.includes('once')) return 'storytelling';
    if (text.includes('you') && text.includes('your')) return 'conversational';
    return 'direct';
  }

  private identifyTargetAudience(channelData: EnhancedChannelData): string {
    const content = channelData.recentVideos.map(v => v.title.toLowerCase()).join(' ');
    
    if (content.includes('teen') || content.includes('young')) return 'Young Adults (16-25)';
    if (content.includes('beginner') || content.includes('start')) return 'Beginners';
    if (content.includes('advanced') || content.includes('expert')) return 'Advanced Users';
    
    return 'General Audience';
  }

  private extractUniqueElements(channelData: EnhancedChannelData): string[] {
    const elements: string[] = [];
    const titles = channelData.recentVideos.map(v => v.title.toLowerCase()).join(' ');
    
    if (titles.includes('rating') && titles.includes('subscribers')) {
      elements.push('Subscriber rating format');
    }
    if (titles.includes('honest') || titles.includes('brutal')) {
      elements.push('Brutally honest feedback style');
    }
    if (titles.includes('debloat') || titles.includes('looksmax')) {
      elements.push('Specialized beauty/improvement terminology');
    }
    
    return elements;
  }

  private getTopPerformers(videos: EnhancedVideoData[], percentage: number = 0.2): EnhancedVideoData[] {
    return videos
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, Math.max(1, Math.floor(videos.length * percentage)));
  }

  private identifyContentPillars(videos: EnhancedVideoData[]): string[] {
    const themes = this.analyzeThemes(videos);
    return themes.slice(0, 4).map(theme => theme.theme);
  }

  private identifySuccessIndicators(topPerformers: EnhancedVideoData[]): string[] {
    const indicators: string[] = [];
    
    const titles = topPerformers.map(v => v.title);
    const avgLength = titles.reduce((sum, title) => sum + title.length, 0) / titles.length;
    
    if (avgLength < 50) indicators.push('Concise, punchy titles');
    if (titles.some(title => title.includes('?'))) indicators.push('Question-based hooks');
    if (titles.some(title => title.toLowerCase().includes('rating'))) indicators.push('Interactive rating format');
    
    return indicators;
  }

  private analyzeEngagementFactors(videos: EnhancedVideoData[], topPerformers: EnhancedVideoData[]): string[] {
    const factors: string[] = [];
    
    const hasInteractiveContent = topPerformers.some(v => 
      v.title.toLowerCase().includes('rating') || 
      v.title.toLowerCase().includes('subscribers')
    );
    
    if (hasInteractiveContent) {
      factors.push('Community-driven interactive content');
    }
    
    const hasPersonalContent = topPerformers.some(v =>
      v.title.toLowerCase().includes('my') ||
      v.title.toLowerCase().includes('personal')
    );
    
    if (hasPersonalContent) {
      factors.push('Personal authenticity and vulnerability');
    }
    
    return factors;
  }

  private calculateConfidence(frequency: number, totalVideos: number): 'high' | 'medium' | 'low' {
    const ratio = frequency / totalVideos;
    if (ratio >= 0.3) return 'high';
    if (ratio >= 0.15) return 'medium';
    return 'low';
  }
}