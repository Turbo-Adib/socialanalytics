import { EnhancedVideoData, EnhancedChannelData } from './enhancedYouTubeAPI';

export interface PersonalityTrait {
  trait: string;
  strength: number; // 0-100 scale
  evidence: string[];
  manifestation: string;
  audienceImpact: 'positive' | 'neutral' | 'negative';
}

export interface CommunicationPattern {
  pattern: string;
  frequency: number;
  effectiveness: number;
  examples: string[];
  context: string;
}

export interface VoiceCharacteristics {
  tone: {
    primary: string;
    secondary: string[];
    consistency: number; // How consistent the tone is across content
  };
  formality: {
    level: 'very_casual' | 'casual' | 'semi_formal' | 'formal' | 'very_formal';
    score: number;
    indicators: string[];
  };
  emotionalRange: {
    dominant: string;
    range: string[];
    emotionalIntelligence: number;
  };
  authenticity: {
    score: number;
    indicators: string[];
    vulnerabilityLevel: 'low' | 'medium' | 'high';
  };
}

export interface ContentPersonality {
  authorityLevel: {
    score: number; // 0-100
    domains: string[];
    credibilityMarkers: string[];
  };
  relatability: {
    score: number;
    personalStoryUsage: number;
    audienceConnection: string[];
  };
  uniqueness: {
    score: number;
    differentiators: string[];
    signature_elements: string[];
  };
  consistency: {
    score: number;
    brandVoiceAlignment: number;
    messageClarity: string;
  };
}

export interface AudienceResonance {
  targetDemographic: {
    ageRange: string;
    interests: string[];
    painPoints: string[];
    aspirations: string[];
  };
  engagementStyle: {
    interactionType: string;
    participationLevel: 'passive' | 'active' | 'highly_active';
    communityBuilding: number;
  };
  contentExpectations: {
    preferredFormats: string[];
    contentPillars: string[];
    valueDelivery: string[];
  };
}

export interface PersonalityAnalysisResult {
  personalityTraits: PersonalityTrait[];
  communicationPatterns: CommunicationPattern[];
  voiceCharacteristics: VoiceCharacteristics;
  contentPersonality: ContentPersonality;
  audienceResonance: AudienceResonance;
  brandArchetype: string;
  competitivePositioning: string;
  recommendedVoiceAdjustments: string[];
  personalityScore: number; // Overall distinctiveness score
}

export class ChannelPersonalityAnalyzer {

  /**
   * Analyze the unique personality and voice of a channel
   */
  analyzeChannelPersonality(channelData: EnhancedChannelData): PersonalityAnalysisResult {
    const videos = channelData.recentVideos;
    const topPerformers = this.getTopPerformers(videos);
    
    return {
      personalityTraits: this.extractPersonalityTraits(channelData, videos),
      communicationPatterns: this.analyzeCommunicationPatterns(videos),
      voiceCharacteristics: this.analyzeVoiceCharacteristics(channelData, videos),
      contentPersonality: this.analyzeContentPersonality(channelData, videos),
      audienceResonance: this.analyzeAudienceResonance(channelData, topPerformers),
      brandArchetype: this.identifyBrandArchetype(channelData, videos),
      competitivePositioning: this.analyzeCompetitivePositioning(channelData, topPerformers),
      recommendedVoiceAdjustments: this.generateVoiceRecommendations(channelData, videos),
      personalityScore: this.calculatePersonalityScore(channelData, videos)
    };
  }

  /**
   * Extract core personality traits from content analysis
   */
  private extractPersonalityTraits(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): PersonalityTrait[] {
    const traits: PersonalityTrait[] = [];
    const allText = this.getAllTextContent(channelData, videos);
    
    // Authenticity Analysis
    const authenticityEvidence = this.findAuthenticityMarkers(allText, videos);
    if (authenticityEvidence.length > 0) {
      traits.push({
        trait: 'Authenticity',
        strength: this.calculateAuthenticityStrength(authenticityEvidence, videos),
        evidence: authenticityEvidence,
        manifestation: 'Shares personal experiences and honest opinions without filters',
        audienceImpact: 'positive'
      });
    }

    // Expertise Analysis
    const expertiseEvidence = this.findExpertiseMarkers(allText, videos);
    if (expertiseEvidence.length > 0) {
      traits.push({
        trait: 'Subject Matter Expertise',
        strength: this.calculateExpertiseStrength(expertiseEvidence, videos),
        evidence: expertiseEvidence,
        manifestation: 'Demonstrates deep knowledge and provides valuable insights in specific domains',
        audienceImpact: 'positive'
      });
    }

    // Humor Analysis
    const humorEvidence = this.findHumorMarkers(allText, videos);
    if (humorEvidence.length > 0) {
      traits.push({
        trait: 'Humor & Entertainment',
        strength: this.calculateHumorStrength(humorEvidence, videos),
        evidence: humorEvidence,
        manifestation: 'Uses humor to engage audience and make content memorable',
        audienceImpact: 'positive'
      });
    }

    // Directness Analysis
    const directnessEvidence = this.findDirectnessMarkers(allText, videos);
    if (directnessEvidence.length > 0) {
      traits.push({
        trait: 'Direct Communication',
        strength: this.calculateDirectnessStrength(directnessEvidence, videos),
        evidence: directnessEvidence,
        manifestation: 'Communicates clearly and directly without unnecessary fluff',
        audienceImpact: 'positive'
      });
    }

    // Empathy Analysis
    const empathyEvidence = this.findEmpathyMarkers(allText, videos);
    if (empathyEvidence.length > 0) {
      traits.push({
        trait: 'Empathy & Understanding',
        strength: this.calculateEmpathyStrength(empathyEvidence, videos),
        evidence: empathyEvidence,
        manifestation: 'Shows understanding of audience struggles and provides supportive guidance',
        audienceImpact: 'positive'
      });
    }

    return traits.sort((a, b) => b.strength - a.strength).slice(0, 5);
  }

  /**
   * Analyze communication patterns unique to the channel
   */
  private analyzeCommunicationPatterns(videos: EnhancedVideoData[]): CommunicationPattern[] {
    const patterns: CommunicationPattern[] = [];
    const avgViews = videos.reduce((sum, v) => sum + v.viewCount, 0) / videos.length;

    // Question-based engagement
    const questionPattern = this.analyzeQuestionPattern(videos, avgViews);
    if (questionPattern) patterns.push(questionPattern);

    // Personal story integration
    const storyPattern = this.analyzeStoryPattern(videos, avgViews);
    if (storyPattern) patterns.push(storyPattern);

    // Direct address patterns
    const addressPattern = this.analyzeDirectAddressPattern(videos, avgViews);
    if (addressPattern) patterns.push(addressPattern);

    // Educational structuring
    const educationalPattern = this.analyzeEducationalPattern(videos, avgViews);
    if (educationalPattern) patterns.push(educationalPattern);

    // Interactive elements
    const interactivePattern = this.analyzeInteractivePattern(videos, avgViews);
    if (interactivePattern) patterns.push(interactivePattern);

    return patterns.sort((a, b) => b.effectiveness - a.effectiveness);
  }

  /**
   * Analyze voice characteristics across all content
   */
  private analyzeVoiceCharacteristics(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): VoiceCharacteristics {
    const allText = this.getAllTextContent(channelData, videos);
    
    return {
      tone: this.analyzeToneCharacteristics(allText, videos),
      formality: this.analyzeFormalityLevel(allText),
      emotionalRange: this.analyzeEmotionalRange(allText, videos),
      authenticity: this.analyzeAuthenticityLevel(allText, videos)
    };
  }

  /**
   * Analyze content personality dimensions
   */
  private analyzeContentPersonality(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): ContentPersonality {
    return {
      authorityLevel: this.analyzeAuthorityLevel(channelData, videos),
      relatability: this.analyzeRelatability(videos),
      uniqueness: this.analyzeUniqueness(channelData, videos),
      consistency: this.analyzeConsistency(videos)
    };
  }

  /**
   * Analyze how the personality resonates with the target audience
   */
  private analyzeAudienceResonance(channelData: EnhancedChannelData, topPerformers: EnhancedVideoData[]): AudienceResonance {
    return {
      targetDemographic: this.identifyTargetDemographic(channelData, topPerformers),
      engagementStyle: this.analyzeEngagementStyle(topPerformers),
      contentExpectations: this.analyzeContentExpectations(topPerformers)
    };
  }

  // Helper methods for personality trait extraction

  private findAuthenticityMarkers(text: string, videos: EnhancedVideoData[]): string[] {
    const markers: string[] = [];
    const authKeywords = [
      'honest', 'real', 'truth', 'genuine', 'authentic', 'actually', 'personally',
      'my experience', 'to be honest', 'honestly', 'real talk', 'no filter'
    ];

    authKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        const examples = videos
          .filter(v => v.title.toLowerCase().includes(keyword) || v.description.toLowerCase().includes(keyword))
          .slice(0, 2)
          .map(v => `"${keyword}" in "${v.title}"`);
        markers.push(...examples);
      }
    });

    return markers.slice(0, 5);
  }

  private findExpertiseMarkers(text: string, videos: EnhancedVideoData[]): string[] {
    const markers: string[] = [];
    const expertKeywords = [
      'expert', 'professional', 'years of experience', 'proven', 'tested',
      'research', 'data', 'study', 'science', 'analysis', 'comprehensive'
    ];

    expertKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        const examples = videos
          .filter(v => v.title.toLowerCase().includes(keyword) || v.description.toLowerCase().includes(keyword))
          .slice(0, 2)
          .map(v => `Expertise shown in "${v.title}"`);
        markers.push(...examples);
      }
    });

    return markers.slice(0, 5);
  }

  private findHumorMarkers(text: string, videos: EnhancedVideoData[]): string[] {
    const markers: string[] = [];
    const humorKeywords = [
      'funny', 'hilarious', 'joke', 'comedy', 'laugh', 'lol', 'haha',
      'roast', 'savage', 'meme', 'cringe', 'awkward'
    ];

    humorKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        const examples = videos
          .filter(v => v.title.toLowerCase().includes(keyword))
          .slice(0, 2)
          .map(v => `Humor in "${v.title}"`);
        markers.push(...examples);
      }
    });

    return markers.slice(0, 5);
  }

  private findDirectnessMarkers(text: string, videos: EnhancedVideoData[]): string[] {
    const markers: string[] = [];
    const directKeywords = [
      'brutal', 'straight up', 'no bs', 'direct', 'blunt', 'raw',
      'unfiltered', 'harsh truth', 'reality', 'fact'
    ];

    directKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        const examples = videos
          .filter(v => v.title.toLowerCase().includes(keyword))
          .slice(0, 2)
          .map(v => `Direct approach in "${v.title}"`);
        markers.push(...examples);
      }
    });

    return markers.slice(0, 5);
  }

  private findEmpathyMarkers(text: string, videos: EnhancedVideoData[]): string[] {
    const markers: string[] = [];
    const empathyKeywords = [
      'understand', 'struggle', 'help', 'support', 'feel', 'relate',
      'been there', 'i know', 'you can', 'believe in you'
    ];

    empathyKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        const examples = videos
          .filter(v => v.title.toLowerCase().includes(keyword) || v.description.toLowerCase().includes(keyword))
          .slice(0, 2)
          .map(v => `Empathy shown in "${v.title}"`);
        markers.push(...examples);
      }
    });

    return markers.slice(0, 5);
  }

  // Strength calculation methods

  private calculateAuthenticityStrength(evidence: string[], videos: EnhancedVideoData[]): number {
    const baseStrength = Math.min(evidence.length * 15, 75);
    const consistencyBonus = evidence.length >= 3 ? 15 : 0;
    const personalContentBonus = videos.some(v => 
      v.title.toLowerCase().includes('my') || v.title.toLowerCase().includes('personal')
    ) ? 10 : 0;
    
    return Math.min(baseStrength + consistencyBonus + personalContentBonus, 100);
  }

  private calculateExpertiseStrength(evidence: string[], videos: EnhancedVideoData[]): number {
    const baseStrength = Math.min(evidence.length * 12, 60);
    const educationalContentBonus = videos.filter(v =>
      v.title.toLowerCase().includes('how to') || 
      v.title.toLowerCase().includes('guide') ||
      v.title.toLowerCase().includes('tips')
    ).length * 5;
    
    return Math.min(baseStrength + educationalContentBonus, 100);
  }

  private calculateHumorStrength(evidence: string[], videos: EnhancedVideoData[]): number {
    const baseStrength = Math.min(evidence.length * 20, 80);
    const entertainmentBonus = videos.some(v =>
      v.title.toLowerCase().includes('rating') ||
      v.title.toLowerCase().includes('reaction')
    ) ? 20 : 0;
    
    return Math.min(baseStrength + entertainmentBonus, 100);
  }

  private calculateDirectnessStrength(evidence: string[], videos: EnhancedVideoData[]): number {
    const baseStrength = Math.min(evidence.length * 18, 72);
    const honestContentBonus = videos.filter(v =>
      v.title.toLowerCase().includes('honest') ||
      v.title.toLowerCase().includes('brutal')
    ).length * 8;
    
    return Math.min(baseStrength + honestContentBonus, 100);
  }

  private calculateEmpathyStrength(evidence: string[], videos: EnhancedVideoData[]): number {
    const baseStrength = Math.min(evidence.length * 10, 50);
    const helpfulContentBonus = videos.filter(v =>
      v.title.toLowerCase().includes('help') ||
      v.title.toLowerCase().includes('tips') ||
      v.title.toLowerCase().includes('advice')
    ).length * 8;
    
    return Math.min(baseStrength + helpfulContentBonus, 100);
  }

  // Communication pattern analysis

  private analyzeQuestionPattern(videos: EnhancedVideoData[], avgViews: number): CommunicationPattern | null {
    const questionVideos = videos.filter(v => v.title.includes('?'));
    if (questionVideos.length < 2) return null;

    const effectiveness = (questionVideos.reduce((sum, v) => sum + v.viewCount, 0) / questionVideos.length) / avgViews;
    
    return {
      pattern: 'Question-Based Engagement',
      frequency: questionVideos.length,
      effectiveness: Math.round(effectiveness * 100) / 100,
      examples: questionVideos.slice(0, 3).map(v => v.title),
      context: 'Uses questions to create curiosity and direct audience engagement'
    };
  }

  private analyzeStoryPattern(videos: EnhancedVideoData[], avgViews: number): CommunicationPattern | null {
    const storyVideos = videos.filter(v => 
      /\b(my|story|journey|experience|when i|time i)\b/i.test(v.title + ' ' + v.description)
    );
    if (storyVideos.length < 2) return null;

    const effectiveness = (storyVideos.reduce((sum, v) => sum + v.viewCount, 0) / storyVideos.length) / avgViews;
    
    return {
      pattern: 'Personal Story Integration',
      frequency: storyVideos.length,
      effectiveness: Math.round(effectiveness * 100) / 100,
      examples: storyVideos.slice(0, 3).map(v => v.title),
      context: 'Incorporates personal experiences to create relatability and connection'
    };
  }

  private analyzeDirectAddressPattern(videos: EnhancedVideoData[], avgViews: number): CommunicationPattern | null {
    const directVideos = videos.filter(v => /\b(you|your)\b/i.test(v.title));
    if (directVideos.length < 3) return null;

    const effectiveness = (directVideos.reduce((sum, v) => sum + v.viewCount, 0) / directVideos.length) / avgViews;
    
    return {
      pattern: 'Direct Audience Address',
      frequency: directVideos.length,
      effectiveness: Math.round(effectiveness * 100) / 100,
      examples: directVideos.slice(0, 3).map(v => v.title),
      context: 'Directly addresses viewers to create personal connection and relevance'
    };
  }

  private analyzeEducationalPattern(videos: EnhancedVideoData[], avgViews: number): CommunicationPattern | null {
    const eduVideos = videos.filter(v => 
      /\b(how to|guide|tips|tutorial|learn|step)\b/i.test(v.title)
    );
    if (eduVideos.length < 2) return null;

    const effectiveness = (eduVideos.reduce((sum, v) => sum + v.viewCount, 0) / eduVideos.length) / avgViews;
    
    return {
      pattern: 'Educational Structure',
      frequency: eduVideos.length,
      effectiveness: Math.round(effectiveness * 100) / 100,
      examples: eduVideos.slice(0, 3).map(v => v.title),
      context: 'Structures content to deliver clear, actionable educational value'
    };
  }

  private analyzeInteractivePattern(videos: EnhancedVideoData[], avgViews: number): CommunicationPattern | null {
    const interactiveVideos = videos.filter(v => 
      /\b(rating|rate|review|reaction|subscribers|community)\b/i.test(v.title)
    );
    if (interactiveVideos.length < 2) return null;

    const effectiveness = (interactiveVideos.reduce((sum, v) => sum + v.viewCount, 0) / interactiveVideos.length) / avgViews;
    
    return {
      pattern: 'Interactive Community Elements',
      frequency: interactiveVideos.length,
      effectiveness: Math.round(effectiveness * 100) / 100,
      examples: interactiveVideos.slice(0, 3).map(v => v.title),
      context: 'Engages community through interactive formats and direct participation'
    };
  }

  // Voice characteristics analysis

  private analyzeToneCharacteristics(text: string, videos: EnhancedVideoData[]): VoiceCharacteristics['tone'] {
    const toneWords = {
      professional: ['professional', 'expert', 'analysis', 'research', 'data'],
      casual: ['hey', 'guys', 'awesome', 'cool', 'like', 'literally'],
      humorous: ['funny', 'hilarious', 'joke', 'lol', 'comedy', 'savage'],
      serious: ['important', 'serious', 'critical', 'essential', 'crucial'],
      inspirational: ['inspire', 'motivate', 'achieve', 'success', 'dream'],
      authentic: ['honest', 'real', 'genuine', 'truth', 'actually']
    };

    const scores = Object.entries(toneWords).map(([tone, words]) => ({
      tone,
      score: words.filter(word => text.toLowerCase().includes(word)).length
    }));

    const topTones = scores.sort((a, b) => b.score - a.score);
    const consistency = this.calculateToneConsistency(videos, topTones[0].tone);

    return {
      primary: topTones[0].tone,
      secondary: topTones.slice(1, 3).map(t => t.tone),
      consistency
    };
  }

  private analyzeFormalityLevel(text: string): VoiceCharacteristics['formality'] {
    const formalIndicators = ['therefore', 'furthermore', 'consequently', 'analysis', 'examination'];
    const casualIndicators = ['gonna', 'wanna', 'kinda', 'like', 'literally', 'super'];
    const contractions = (text.match(/\b\w+'\w+\b/g) || []).length;
    
    const formalScore = formalIndicators.filter(word => text.toLowerCase().includes(word)).length;
    const casualScore = casualIndicators.filter(word => text.toLowerCase().includes(word)).length + contractions * 0.1;
    
    const totalScore = formalScore - casualScore;
    
    let level: VoiceCharacteristics['formality']['level'];
    if (totalScore >= 3) level = 'very_formal';
    else if (totalScore >= 1) level = 'formal';
    else if (totalScore >= -1) level = 'semi_formal';
    else if (totalScore >= -3) level = 'casual';
    else level = 'very_casual';

    return {
      level,
      score: Math.round((totalScore + 10) * 5), // Normalize to 0-100
      indicators: [...formalIndicators.filter(word => text.includes(word)), 
                   ...casualIndicators.filter(word => text.includes(word))]
    };
  }

  private analyzeEmotionalRange(text: string, videos: EnhancedVideoData[]): VoiceCharacteristics['emotionalRange'] {
    const emotions = {
      excitement: ['amazing', 'incredible', 'awesome', 'fantastic', 'exciting'],
      empathy: ['understand', 'feel', 'relate', 'struggle', 'support'],
      confidence: ['confident', 'sure', 'definitely', 'absolutely', 'proven'],
      curiosity: ['wonder', 'interesting', 'curious', 'explore', 'discover'],
      concern: ['worried', 'concerned', 'careful', 'warning', 'danger']
    };

    const emotionScores = Object.entries(emotions).map(([emotion, words]) => ({
      emotion,
      score: words.filter(word => text.toLowerCase().includes(word)).length
    }));

    const topEmotion = emotionScores.sort((a, b) => b.score - a.score)[0];
    const activeEmotions = emotionScores.filter(e => e.score > 0).map(e => e.emotion);
    
    return {
      dominant: topEmotion.emotion,
      range: activeEmotions,
      emotionalIntelligence: Math.min(activeEmotions.length * 20, 100)
    };
  }

  private analyzeAuthenticityLevel(text: string, videos: EnhancedVideoData[]): VoiceCharacteristics['authenticity'] {
    const authenticityMarkers = [
      'honest', 'real', 'genuine', 'truth', 'actually', 'personally',
      'my experience', 'to be honest', 'honestly'
    ];
    
    const vulnerabilityMarkers = [
      'struggled', 'failed', 'mistake', 'learned', 'difficult', 'challenge'
    ];

    const authScore = authenticityMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
    const vulnScore = vulnerabilityMarkers.filter(marker => text.toLowerCase().includes(marker)).length;
    
    let vulnerabilityLevel: 'low' | 'medium' | 'high';
    if (vulnScore >= 3) vulnerabilityLevel = 'high';
    else if (vulnScore >= 1) vulnerabilityLevel = 'medium';
    else vulnerabilityLevel = 'low';

    return {
      score: Math.min((authScore + vulnScore) * 10, 100),
      indicators: [...authenticityMarkers.filter(m => text.includes(m)),
                   ...vulnerabilityMarkers.filter(m => text.includes(m))],
      vulnerabilityLevel
    };
  }

  // Content personality analysis methods

  private analyzeAuthorityLevel(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): ContentPersonality['authorityLevel'] {
    const expertiseKeywords = ['expert', 'professional', 'years', 'experience', 'proven', 'tested'];
    const credibilityMarkers = ['research', 'data', 'study', 'analysis', 'certified', 'trained'];
    
    const allText = this.getAllTextContent(channelData, videos);
    const expertiseScore = expertiseKeywords.filter(word => allText.toLowerCase().includes(word)).length;
    const credibilityScore = credibilityMarkers.filter(word => allText.toLowerCase().includes(word)).length;
    
    return {
      score: Math.min((expertiseScore + credibilityScore) * 8, 100),
      domains: this.extractDomains(videos),
      credibilityMarkers: credibilityMarkers.filter(marker => allText.includes(marker))
    };
  }

  private analyzeRelatability(videos: EnhancedVideoData[]): ContentPersonality['relatability'] {
    const personalStories = videos.filter(v => 
      /\b(my|personal|story|experience|when i|struggle)\b/i.test(v.title + ' ' + v.description)
    );
    
    const connectionMarkers = ['understand', 'relate', 'feel', 'been there', 'like you'];
    const allText = videos.map(v => v.title + ' ' + v.description).join(' ');
    
    return {
      score: Math.min(personalStories.length * 15 + connectionMarkers.filter(m => allText.includes(m)).length * 10, 100),
      personalStoryUsage: (personalStories.length / videos.length) * 100,
      audienceConnection: connectionMarkers.filter(marker => allText.toLowerCase().includes(marker))
    };
  }

  private analyzeUniqueness(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): ContentPersonality['uniqueness'] {
    const uniqueElements = this.extractUniqueElements(channelData, videos);
    const signatureElements = this.findSignatureElements(videos);
    
    return {
      score: Math.min((uniqueElements.length * 20) + (signatureElements.length * 15), 100),
      differentiators: uniqueElements,
      signature_elements: signatureElements
    };
  }

  private analyzeConsistency(videos: EnhancedVideoData[]): ContentPersonality['consistency'] {
    const titlePatterns = this.extractTitlePatterns(videos);
    const consistentPatterns = titlePatterns.filter(p => p.count >= 3);
    
    const consistencyScore = (consistentPatterns.length / titlePatterns.length) * 100;
    const brandAlignment = consistentPatterns.length >= 2 ? 85 : 60;
    
    return {
      score: Math.round(consistencyScore),
      brandVoiceAlignment: brandAlignment,
      messageClarity: consistencyScore > 70 ? 'Very clear and consistent messaging' : 'Moderate consistency in messaging'
    };
  }

  // Audience resonance analysis

  private identifyTargetDemographic(channelData: EnhancedChannelData, topPerformers: EnhancedVideoData[]): AudienceResonance['targetDemographic'] {
    const content = topPerformers.map(v => v.title.toLowerCase()).join(' ');
    
    let ageRange = 'General (18-45)';
    if (content.includes('teen') || content.includes('young')) ageRange = 'Young Adults (16-25)';
    if (content.includes('adult') || content.includes('career')) ageRange = 'Adults (25-40)';
    
    return {
      ageRange,
      interests: this.extractInterests(topPerformers),
      painPoints: this.extractPainPoints(topPerformers),
      aspirations: this.extractAspirations(topPerformers)
    };
  }

  private analyzeEngagementStyle(topPerformers: EnhancedVideoData[]): AudienceResonance['engagementStyle'] {
    const interactiveContent = topPerformers.filter(v =>
      /\b(rating|rate|comment|subscribe|community|you)\b/i.test(v.title)
    );
    
    let participationLevel: 'passive' | 'active' | 'highly_active';
    if (interactiveContent.length >= topPerformers.length * 0.6) participationLevel = 'highly_active';
    else if (interactiveContent.length >= topPerformers.length * 0.3) participationLevel = 'active';
    else participationLevel = 'passive';
    
    return {
      interactionType: interactiveContent.length > 0 ? 'Community-driven interaction' : 'Content consumption',
      participationLevel,
      communityBuilding: (interactiveContent.length / topPerformers.length) * 100
    };
  }

  private analyzeContentExpectations(topPerformers: EnhancedVideoData[]): AudienceResonance['contentExpectations'] {
    const formats = this.extractContentFormats(topPerformers);
    const pillars = this.extractContentPillars(topPerformers);
    const valueDelivery = this.extractValueDelivery(topPerformers);
    
    return {
      preferredFormats: formats,
      contentPillars: pillars,
      valueDelivery: valueDelivery
    };
  }

  // Brand archetype and positioning

  private identifyBrandArchetype(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): string {
    const allText = this.getAllTextContent(channelData, videos);
    
    const archetypes = {
      'The Expert': ['expert', 'professional', 'analysis', 'research', 'proven'],
      'The Entertainer': ['funny', 'hilarious', 'entertainment', 'comedy', 'fun'],
      'The Helper': ['help', 'tips', 'guide', 'advice', 'support'],
      'The Rebel': ['honest', 'brutal', 'real', 'unfiltered', 'truth'],
      'The Friend': ['personal', 'my', 'story', 'relate', 'understand']
    };

    const scores = Object.entries(archetypes).map(([archetype, keywords]) => ({
      archetype,
      score: keywords.filter(word => allText.toLowerCase().includes(word)).length
    }));

    return scores.sort((a, b) => b.score - a.score)[0].archetype;
  }

  private analyzeCompetitivePositioning(channelData: EnhancedChannelData, topPerformers: EnhancedVideoData[]): string {
    const uniqueElements = this.extractUniqueElements(channelData, topPerformers);
    
    if (uniqueElements.includes('Subscriber rating format')) {
      return 'Unique interactive community engagement through direct subscriber participation';
    }
    
    if (uniqueElements.includes('Brutally honest feedback')) {
      return 'Authenticity-first approach with unfiltered honest opinions in a filtered social media world';
    }
    
    return 'Distinctive voice and approach that builds genuine connection with audience';
  }

  private generateVoiceRecommendations(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): string[] {
    const recommendations: string[] = [];
    const personality = this.analyzeChannelPersonality(channelData);
    
    // Add specific recommendations based on current strengths and gaps
    if (personality.personalityScore < 70) {
      recommendations.push('Strengthen unique personality traits by being more authentic and personal in content');
    }
    
    if (personality.voiceCharacteristics.tone.consistency < 80) {
      recommendations.push('Maintain more consistent tone and messaging across all content');
    }
    
    recommendations.push('Continue leveraging interactive community engagement - it\'s your strongest differentiator');
    recommendations.push('Amplify honest and direct communication style - audiences respond well to authenticity');
    
    return recommendations;
  }

  private calculatePersonalityScore(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): number {
    const uniqueness = this.analyzeUniqueness(channelData, videos).score;
    const authenticity = this.analyzeAuthenticityLevel(this.getAllTextContent(channelData, videos), videos).score;
    const consistency = this.analyzeConsistency(videos).score;
    const relatability = this.analyzeRelatability(videos).score;
    
    return Math.round((uniqueness + authenticity + consistency + relatability) / 4);
  }

  // Helper utility methods

  private getAllTextContent(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): string {
    return [
      channelData.description,
      ...videos.map(v => `${v.title} ${v.description}`)
    ].join(' ').toLowerCase();
  }

  private getTopPerformers(videos: EnhancedVideoData[], percentage: number = 0.3): EnhancedVideoData[] {
    return videos
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, Math.max(1, Math.floor(videos.length * percentage)));
  }

  private calculateToneConsistency(videos: EnhancedVideoData[], primaryTone: string): number {
    // Simplified consistency calculation
    const consistentVideos = videos.filter(v => 
      v.title.toLowerCase().includes(primaryTone) || 
      v.description.toLowerCase().includes(primaryTone)
    );
    return Math.round((consistentVideos.length / videos.length) * 100);
  }

  private extractDomains(videos: EnhancedVideoData[]): string[] {
    const domains: string[] = [];
    const allTitles = videos.map(v => v.title.toLowerCase()).join(' ');
    
    if (allTitles.includes('beauty') || allTitles.includes('appearance')) domains.push('Beauty & Appearance');
    if (allTitles.includes('tips') || allTitles.includes('advice')) domains.push('Self-Improvement');
    if (allTitles.includes('rating') || allTitles.includes('review')) domains.push('Entertainment & Reviews');
    
    return domains;
  }

  private extractUniqueElements(channelData: EnhancedChannelData, videos: EnhancedVideoData[]): string[] {
    const elements: string[] = [];
    const allTitles = videos.map(v => v.title.toLowerCase()).join(' ');
    
    if (allTitles.includes('rating') && allTitles.includes('subscribers')) {
      elements.push('Subscriber rating format');
    }
    if (allTitles.includes('honest') || allTitles.includes('brutal')) {
      elements.push('Brutally honest feedback');
    }
    if (allTitles.includes('debloat') || allTitles.includes('looksmax')) {
      elements.push('Specialized terminology usage');
    }
    
    return elements;
  }

  private findSignatureElements(videos: EnhancedVideoData[]): string[] {
    const signatures: string[] = [];
    const titlePatterns = this.extractTitlePatterns(videos);
    
    titlePatterns
      .filter(p => p.count >= 3)
      .forEach(p => signatures.push(p.pattern));
    
    return signatures;
  }

  private extractTitlePatterns(videos: EnhancedVideoData[]): Array<{pattern: string, count: number}> {
    const patterns: Map<string, number> = new Map();
    
    videos.forEach(v => {
      if (v.title.includes('Rating')) patterns.set('Rating Format', (patterns.get('Rating Format') || 0) + 1);
      if (v.title.includes('?')) patterns.set('Question Format', (patterns.get('Question Format') || 0) + 1);
      if (/\b\d+\b/.test(v.title)) patterns.set('Numbered Content', (patterns.get('Numbered Content') || 0) + 1);
    });
    
    return Array.from(patterns.entries()).map(([pattern, count]) => ({pattern, count}));
  }

  private extractInterests(videos: EnhancedVideoData[]): string[] {
    const interests: string[] = [];
    const content = videos.map(v => v.title.toLowerCase()).join(' ');
    
    if (content.includes('beauty') || content.includes('appearance')) interests.push('Beauty & Self-Image');
    if (content.includes('improvement') || content.includes('tips')) interests.push('Self-Improvement');
    if (content.includes('entertainment') || content.includes('rating')) interests.push('Entertainment');
    
    return interests;
  }

  private extractPainPoints(videos: EnhancedVideoData[]): string[] {
    const painPoints: string[] = [];
    const content = videos.map(v => v.title.toLowerCase()).join(' ');
    
    if (content.includes('struggle') || content.includes('problem')) painPoints.push('Personal struggles');
    if (content.includes('confidence') || content.includes('self-esteem')) painPoints.push('Self-confidence issues');
    
    return painPoints;
  }

  private extractAspirations(videos: EnhancedVideoData[]): string[] {
    const aspirations: string[] = [];
    const content = videos.map(v => v.title.toLowerCase()).join(' ');
    
    if (content.includes('improvement') || content.includes('better')) aspirations.push('Self-improvement');
    if (content.includes('confidence') || content.includes('glow up')) aspirations.push('Increased confidence');
    
    return aspirations;
  }

  private extractContentFormats(videos: EnhancedVideoData[]): string[] {
    const formats: string[] = [];
    
    if (videos.some(v => v.title.toLowerCase().includes('rating'))) formats.push('Interactive Rating Content');
    if (videos.some(v => v.title.toLowerCase().includes('tips'))) formats.push('Educational Tips');
    if (videos.some(v => v.title.toLowerCase().includes('review'))) formats.push('Honest Reviews');
    
    return formats;
  }

  private extractContentPillars(videos: EnhancedVideoData[]): string[] {
    const pillars: string[] = [];
    const content = videos.map(v => v.title.toLowerCase()).join(' ');
    
    if (content.includes('beauty')) pillars.push('Beauty & Appearance');
    if (content.includes('community') || content.includes('subscribers')) pillars.push('Community Engagement');
    if (content.includes('advice') || content.includes('tips')) pillars.push('Educational Content');
    
    return pillars;
  }

  private extractValueDelivery(videos: EnhancedVideoData[]): string[] {
    const value: string[] = [];
    
    if (videos.some(v => /\b(honest|real|truth)\b/i.test(v.title))) value.push('Authentic opinions');
    if (videos.some(v => /\b(tips|advice|help)\b/i.test(v.title))) value.push('Practical guidance');
    if (videos.some(v => /\b(entertainment|fun|rating)\b/i.test(v.title))) value.push('Entertainment value');
    
    return value;
  }
}