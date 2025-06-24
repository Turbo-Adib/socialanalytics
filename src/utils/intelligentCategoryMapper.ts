/**
 * Intelligent Category Mapper
 * Uses semantic analysis to suggest relevant categories for unknown niches
 */

import { parentCategories, type ParentCategory } from '@/src/data/nicheDatabase';

// Extended keyword patterns for each category (including related terms)
const categorySemanticPatterns = {
  tech: {
    keywords: [
      'programming', 'code', 'coding', 'developer', 'software', 'app', 'website', 'algorithm', 
      'framework', 'library', 'database', 'api', 'backend', 'frontend', 'fullstack', 'devops',
      'javascript', 'python', 'java', 'react', 'vue', 'angular', 'node', 'typescript',
      'html', 'css', 'sql', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
      'computer', 'technology', 'digital', 'innovation', 'startup', 'saas', 'platform',
      'cloud', 'server', 'hosting', 'deployment', 'github', 'gitlab', 'stackoverflow'
    ],
    concepts: [
      'development', 'engineering', 'technical', 'digital solutions', 'automation',
      'artificial intelligence', 'machine learning', 'data science', 'cybersecurity'
    ]
  },
  
  finance: {
    keywords: [
      'money', 'investment', 'investing', 'stock', 'crypto', 'bitcoin', 'ethereum',
      'trading', 'portfolio', 'dividend', 'savings', 'budget', 'debt', 'credit',
      'mortgage', 'loan', 'bank', 'financial', 'wealth', 'rich', 'millionaire',
      'retirement', 'pension', 'insurance', 'tax', 'ira', '401k', 'roth',
      'real estate', 'property', 'rental', 'landlord', 'flip', 'roi', 'yield',
      'economics', 'market', 'economy', 'recession', 'inflation', 'currency'
    ],
    concepts: [
      'personal finance', 'wealth building', 'passive income', 'financial freedom',
      'monetary policy', 'economic analysis', 'investment strategy'
    ]
  },

  gaming: {
    keywords: [
      'game', 'gaming', 'gamer', 'play', 'playing', 'xbox', 'playstation', 'nintendo',
      'pc gaming', 'mobile gaming', 'esports', 'twitch', 'stream', 'streaming',
      'minecraft', 'fortnite', 'roblox', 'valorant', 'league', 'dota', 'csgo',
      'fps', 'rpg', 'mmorpg', 'battle royale', 'multiplayer', 'single player',
      'indie game', 'aaa game', 'retro gaming', 'speedrun', 'walkthrough',
      'review', 'trailer', 'gameplay', 'tutorial', 'guide', 'tips', 'strategy'
    ],
    concepts: [
      'video games', 'interactive entertainment', 'digital entertainment',
      'competitive gaming', 'game development', 'game design'
    ]
  },

  health: {
    keywords: [
      'health', 'medical', 'doctor', 'medicine', 'healthcare', 'wellness', 'fitness',
      'exercise', 'workout', 'gym', 'training', 'nutrition', 'diet', 'healthy',
      'weight loss', 'muscle', 'cardio', 'strength', 'yoga', 'meditation',
      'mental health', 'therapy', 'psychology', 'anxiety', 'depression', 'stress',
      'supplement', 'vitamin', 'protein', 'keto', 'vegan', 'paleo', 'intermittent fasting',
      'sleep', 'recovery', 'injury', 'physical therapy', 'rehabilitation'
    ],
    concepts: [
      'physical wellness', 'mental wellness', 'holistic health', 'preventive care',
      'lifestyle medicine', 'health optimization', 'body transformation'
    ]
  },

  education: {
    keywords: [
      'education', 'learning', 'study', 'student', 'teacher', 'school', 'university',
      'college', 'course', 'lesson', 'tutorial', 'guide', 'how to', 'explain',
      'math', 'science', 'history', 'language', 'english', 'spanish', 'french',
      'physics', 'chemistry', 'biology', 'literature', 'philosophy', 'art',
      'skill', 'training', 'certification', 'degree', 'diploma', 'academic',
      'research', 'thesis', 'knowledge', 'wisdom', 'enlightenment'
    ],
    concepts: [
      'knowledge transfer', 'skill development', 'academic content', 'professional development',
      'continuing education', 'lifelong learning', 'educational technology'
    ]
  },

  business: {
    keywords: [
      'business', 'entrepreneur', 'startup', 'company', 'corporate', 'marketing',
      'sales', 'revenue', 'profit', 'growth', 'scale', 'strategy', 'management',
      'leadership', 'team', 'employee', 'hr', 'hiring', 'recruitment',
      'brand', 'branding', 'advertising', 'promotion', 'seo', 'social media',
      'ecommerce', 'dropshipping', 'amazon', 'shopify', 'etsy', 'ebay',
      'franchise', 'partnership', 'acquisition', 'merger', 'ipo', 'venture capital'
    ],
    concepts: [
      'entrepreneurship', 'business development', 'digital marketing', 'e-commerce',
      'business strategy', 'corporate culture', 'business operations'
    ]
  },

  creative: {
    keywords: [
      'art', 'artist', 'creative', 'design', 'designer', 'graphic', 'visual',
      'photography', 'photo', 'camera', 'photoshop', 'lightroom', 'editing',
      'music', 'musician', 'song', 'singing', 'instrument', 'guitar', 'piano',
      'production', 'recording', 'studio', 'mixing', 'mastering', 'beat',
      'drawing', 'painting', 'illustration', 'digital art', 'traditional art',
      'fashion', 'style', 'makeup', 'beauty', 'aesthetic', 'trendy'
    ],
    concepts: [
      'artistic expression', 'visual arts', 'performing arts', 'creative content',
      'artistic skills', 'creative process', 'aesthetic design'
    ]
  },

  lifestyle: {
    keywords: [
      'lifestyle', 'life', 'daily', 'routine', 'personal', 'family', 'relationship',
      'dating', 'marriage', 'parenting', 'kids', 'children', 'baby', 'pregnancy',
      'home', 'house', 'decor', 'interior', 'cleaning', 'organization',
      'self care', 'mindfulness', 'motivation', 'inspiration', 'personal development',
      'productivity', 'habits', 'goals', 'success', 'happiness', 'gratitude'
    ],
    concepts: [
      'personal lifestyle', 'life optimization', 'work-life balance', 'personal growth',
      'lifestyle design', 'quality of life', 'life philosophy'
    ]
  },

  entertainment: {
    keywords: [
      'entertainment', 'movie', 'film', 'tv', 'television', 'show', 'series',
      'netflix', 'disney', 'marvel', 'dc', 'superhero', 'actor', 'actress',
      'celebrity', 'hollywood', 'comedy', 'funny', 'humor', 'joke', 'meme',
      'reaction', 'review', 'critique', 'analysis', 'drama', 'romance',
      'action', 'thriller', 'horror', 'documentary', 'animation', 'cartoon'
    ],
    concepts: [
      'popular culture', 'mass entertainment', 'media content', 'pop culture',
      'entertainment industry', 'cultural commentary', 'entertainment news'
    ]
  },

  food: {
    keywords: [
      'food', 'cooking', 'recipe', 'kitchen', 'chef', 'culinary', 'baking',
      'restaurant', 'dining', 'meal', 'breakfast', 'lunch', 'dinner', 'snack',
      'ingredient', 'spice', 'flavor', 'taste', 'delicious', 'yummy',
      'bread', 'cake', 'cookie', 'dessert', 'pizza', 'pasta', 'soup',
      'vegetarian', 'vegan', 'gluten free', 'organic', 'farm', 'fresh'
    ],
    concepts: [
      'culinary arts', 'food preparation', 'gastronomy', 'food culture',
      'culinary techniques', 'food science', 'nutrition science'
    ]
  },

  travel: {
    keywords: [
      'travel', 'trip', 'vacation', 'holiday', 'destination', 'tourism',
      'backpacking', 'adventure', 'explore', 'journey', 'wanderlust',
      'flight', 'hotel', 'accommodation', 'booking', 'itinerary', 'guide',
      'city', 'country', 'culture', 'local', 'authentic', 'experience',
      'beach', 'mountain', 'forest', 'desert', 'island', 'cruise'
    ],
    concepts: [
      'travel experiences', 'cultural exploration', 'adventure travel',
      'travel planning', 'destination guides', 'travel lifestyle'
    ]
  },

  automotive: {
    keywords: [
      'car', 'auto', 'vehicle', 'automobile', 'truck', 'suv', 'motorcycle',
      'bike', 'engine', 'motor', 'driving', 'race', 'racing', 'speed',
      'repair', 'maintenance', 'mechanic', 'garage', 'dealership',
      'electric', 'hybrid', 'gas', 'diesel', 'fuel', 'mpg', 'performance',
      'tesla', 'bmw', 'mercedes', 'audi', 'toyota', 'honda', 'ford'
    ],
    concepts: [
      'automotive industry', 'vehicle technology', 'transportation',
      'automotive maintenance', 'car culture', 'automotive reviews'
    ]
  },

  science: {
    keywords: [
      'science', 'research', 'experiment', 'laboratory', 'discovery',
      'space', 'astronomy', 'nasa', 'rocket', 'planet', 'star', 'galaxy',
      'physics', 'chemistry', 'biology', 'geology', 'mathematics', 'equation',
      'theory', 'hypothesis', 'data', 'analysis', 'evidence', 'proof',
      'technology', 'innovation', 'breakthrough', 'invention', 'patent'
    ],
    concepts: [
      'scientific research', 'scientific method', 'scientific discovery',
      'space exploration', 'natural sciences', 'applied sciences'
    ]
  },

  sports: {
    keywords: [
      'sport', 'sports', 'athlete', 'team', 'competition', 'championship',
      'football', 'soccer', 'basketball', 'baseball', 'tennis', 'golf',
      'swimming', 'running', 'marathon', 'olympics', 'training', 'coach',
      'player', 'game', 'match', 'season', 'league', 'tournament',
      'fitness', 'exercise', 'workout', 'gym', 'muscle', 'strength'
    ],
    concepts: [
      'athletic performance', 'competitive sports', 'team sports', 'individual sports',
      'sports training', 'sports analysis', 'sports entertainment'
    ]
  }
};

export class IntelligentCategoryMapper {
  
  /**
   * Calculate semantic similarity between search term and category
   */
  private static calculateCategorySimilarity(searchTerm: string, categoryId: string): number {
    const pattern = categorySemanticPatterns[categoryId as keyof typeof categorySemanticPatterns];
    if (!pattern) return 0;

    const normalizedSearch = searchTerm.toLowerCase().trim();
    let score = 0;
    let maxScore = 0;

    // Check direct keyword matches (high weight)
    for (const keyword of pattern.keywords) {
      maxScore += 3;
      if (keyword.includes(normalizedSearch) || normalizedSearch.includes(keyword)) {
        if (keyword === normalizedSearch) {
          score += 3; // Exact match
        } else if (keyword.includes(normalizedSearch)) {
          score += 2; // Search term is substring of keyword
        } else {
          score += 1; // Keyword is substring of search term
        }
      }
    }

    // Check concept matches (medium weight)
    for (const concept of pattern.concepts) {
      maxScore += 2;
      if (concept.includes(normalizedSearch) || normalizedSearch.includes(concept)) {
        score += 2;
      }
      
      // Check word-by-word concept matching
      const conceptWords = concept.split(' ');
      const searchWords = normalizedSearch.split(' ');
      
      for (const conceptWord of conceptWords) {
        for (const searchWord of searchWords) {
          if (conceptWord === searchWord && conceptWord.length > 2) {
            score += 1;
          }
        }
      }
    }

    // Normalize score (0-1)
    return maxScore > 0 ? score / maxScore : 0;
  }

  /**
   * Find the best category match for unknown search terms
   */
  public static suggestCategory(searchTerm: string): {
    category: ParentCategory;
    confidence: number;
    reasoning: string;
    suggestions: string[];
  } {
    if (!searchTerm || searchTerm.trim().length === 0) {
      const generalCategory = parentCategories.find(cat => cat.id === 'general')!;
      return {
        category: generalCategory,
        confidence: 0,
        reasoning: 'No search term provided',
        suggestions: []
      };
    }

    // Calculate similarity scores for all categories
    const categoryScores: Array<{
      category: ParentCategory;
      score: number;
      matchedKeywords: string[];
    }> = [];

    for (const category of parentCategories) {
      if (category.id === 'general') continue; // Skip general for intelligent suggestions
      
      const score = this.calculateCategorySimilarity(searchTerm, category.id);
      const matchedKeywords = this.getMatchedKeywords(searchTerm, category.id);
      
      categoryScores.push({
        category,
        score,
        matchedKeywords
      });
    }

    // Sort by score descending
    categoryScores.sort((a, b) => b.score - a.score);
    
    const bestMatch = categoryScores[0];
    
    // If no good match found, fall back to general
    if (!bestMatch || bestMatch.score < 0.1) {
      const generalCategory = parentCategories.find(cat => cat.id === 'general')!;
      return {
        category: generalCategory,
        confidence: 0,
        reasoning: `No strong match found for "${searchTerm}". Using general category.`,
        suggestions: this.getRelatedSuggestions(searchTerm)
      };
    }

    // Generate confidence and reasoning
    const confidence = Math.min(bestMatch.score, 0.95); // Cap at 95%
    const reasoning = this.generateReasoning(searchTerm, bestMatch.category, bestMatch.matchedKeywords);
    const suggestions = this.getRelatedSuggestions(searchTerm, bestMatch.category.id);

    return {
      category: bestMatch.category,
      confidence,
      reasoning,
      suggestions
    };
  }

  /**
   * Get matched keywords for reasoning
   */
  private static getMatchedKeywords(searchTerm: string, categoryId: string): string[] {
    const pattern = categorySemanticPatterns[categoryId as keyof typeof categorySemanticPatterns];
    if (!pattern) return [];

    const normalizedSearch = searchTerm.toLowerCase().trim();
    const matched: string[] = [];

    for (const keyword of pattern.keywords) {
      if (keyword.includes(normalizedSearch) || normalizedSearch.includes(keyword)) {
        matched.push(keyword);
      }
    }

    return matched.slice(0, 3); // Return top 3 matches
  }

  /**
   * Generate human-readable reasoning
   */
  private static generateReasoning(searchTerm: string, category: ParentCategory, matchedKeywords: string[]): string {
    if (matchedKeywords.length === 0) {
      return `"${searchTerm}" appears to be related to ${category.name} based on semantic analysis.`;
    }

    const keywordList = matchedKeywords.slice(0, 2).map(k => `"${k}"`).join(' and ');
    return `"${searchTerm}" matches ${category.name} keywords including ${keywordList}.`;
  }

  /**
   * Get related suggestions for better search results
   */
  private static getRelatedSuggestions(searchTerm: string, categoryId?: string): string[] {
    if (categoryId && categorySemanticPatterns[categoryId as keyof typeof categorySemanticPatterns]) {
      const pattern = categorySemanticPatterns[categoryId as keyof typeof categorySemanticPatterns];
      return pattern.keywords.slice(0, 5);
    }

    // General suggestions if no category match
    return [
      'programming', 'cooking', 'fitness', 'gaming', 'travel',
      'business', 'art', 'music', 'finance', 'education'
    ];
  }

  /**
   * Enhanced search that tries intelligent mapping before falling back
   */
  public static enhancedSearch(searchTerm: string): {
    category: ParentCategory;
    matchType: 'exact' | 'partial' | 'fuzzy' | 'intelligent' | 'default';
    confidence: number;
    reasoning?: string;
    suggestions?: string[];
  } {
    // First try the regular keyword matching (from original system)
    // This would be integrated with the existing NicheMapper
    
    // If no good match from keywords, try intelligent semantic matching
    const suggestion = this.suggestCategory(searchTerm);
    
    if (suggestion.confidence > 0.3) {
      return {
        category: suggestion.category,
        matchType: 'intelligent',
        confidence: suggestion.confidence,
        reasoning: suggestion.reasoning,
        suggestions: suggestion.suggestions
      };
    }

    // Fall back to general
    const generalCategory = parentCategories.find(cat => cat.id === 'general')!;
    return {
      category: generalCategory,
      matchType: 'default',
      confidence: 0,
      reasoning: `No relevant category found for "${searchTerm}". Using general content category.`,
      suggestions: suggestion.suggestions
    };
  }

  /**
   * Get category suggestions for partial terms
   */
  public static getCategorySuggestions(partialTerm: string, limit: number = 3): Array<{
    category: ParentCategory;
    relevantKeywords: string[];
    confidence: number;
  }> {
    if (!partialTerm || partialTerm.length < 2) return [];

    const suggestions: Array<{
      category: ParentCategory;
      relevantKeywords: string[];
      confidence: number;
    }> = [];

    for (const category of parentCategories) {
      if (category.id === 'general') continue;
      
      const pattern = categorySemanticPatterns[category.id as keyof typeof categorySemanticPatterns];
      if (!pattern) continue;

      const relevantKeywords = pattern.keywords.filter(keyword => 
        keyword.includes(partialTerm.toLowerCase()) || 
        partialTerm.toLowerCase().includes(keyword)
      ).slice(0, 3);

      if (relevantKeywords.length > 0) {
        const confidence = this.calculateCategorySimilarity(partialTerm, category.id);
        suggestions.push({
          category,
          relevantKeywords,
          confidence
        });
      }
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }
}