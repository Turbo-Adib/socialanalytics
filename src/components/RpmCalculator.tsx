import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calculator, DollarSign, TrendingUp, ArrowRight, Tag, Sparkles, Loader2, Zap } from 'lucide-react';
import { NicheMapper, parentCategories, type NicheData, type ParentCategory } from '@/data/nicheDatabase';

interface RpmCalculatorProps {
  onClose?: () => void;
}

const RpmCalculator: React.FC<RpmCalculatorProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<NicheData | null>(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState<ParentCategory | null>(null);
  const [views, setViews] = useState<number>(100000);
  const [contentType, setContentType] = useState<'longform' | 'shorts'>('longform');
  const [searchResult, setSearchResult] = useState<{
    niche: NicheData;
    parentCategory: ParentCategory;
    matchType: 'exact' | 'partial' | 'fuzzy' | 'intelligent' | 'default';
    matchedKeyword?: string;
    confidence?: number;
    reasoning?: string;
    suggestions?: string[];
    isUnknownNiche?: boolean;
  } | null>(null);
  const [suggestions, setSuggestions] = useState<NicheData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showUnknownNicheAlert, setShowUnknownNicheAlert] = useState(false);

  // Handle search with enhanced keyword mapping
  useEffect(() => {
    const performSearch = () => {
      if (searchTerm.trim().length > 0) {
        setIsSearching(true);
        setSearchError(null);
        
        try {
          const result = NicheMapper.searchNiche(searchTerm);
          setSearchResult(result);
          
          // Show unknown niche alert if this is a fallback to general
          if (result.isUnknownNiche) {
            setShowUnknownNicheAlert(true);
          } else {
            setShowUnknownNicheAlert(false);
          }
          
          // Get suggestions for autocomplete
          if (searchTerm.length >= 2) {
            const newSuggestions = NicheMapper.getSuggestions(searchTerm, 5);
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setSearchError('Search temporarily unavailable. Please try again.');
          setSearchResult(null);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResult(null);
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchError(null);
        setShowUnknownNicheAlert(false);
      }
    };

    // Debounce search to avoid too many calls
    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Auto-select the best match when searching (including unknown niches that default to General)
  useEffect(() => {
    if (searchResult) {
      setSelectedNiche(searchResult.niche);
      setSelectedParentCategory(searchResult.parentCategory);
    }
  }, [searchResult]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return parentCategories;
    return parentCategories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const calculateRevenue = () => {
    if (!selectedNiche && !selectedParentCategory) return 0;
    
    // Use parent category RPM if specific niche not selected
    const activeCategory = selectedNiche || selectedParentCategory;
    if (!activeCategory) return 0;
    
    const rpm = contentType === 'longform' ? activeCategory.longFormRpm : activeCategory.shortsRpm;
    return (views / 1000) * rpm;
  };

  const handleSuggestionClick = (suggestion: NicheData) => {
    setSelectedNiche(suggestion);
    const parentCat = parentCategories.find(cat => cat.id === suggestion.parentCategory);
    setSelectedParentCategory(parentCat || null);
    setSearchTerm(suggestion.displayName);
    setShowSuggestions(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim().length === 0) {
      setSelectedNiche(null);
      setSelectedParentCategory(null);
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'text-green-600 bg-green-50 border-green-200';
      case 'partial': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fuzzy': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'intelligent': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'Exact Match';
      case 'partial': return 'Partial Match';
      case 'fuzzy': return 'Similar Match';
      case 'intelligent': return 'AI Suggested';
      default: return 'Default Category';
    }
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact': return '🎯';
      case 'partial': return '🔍';
      case 'fuzzy': return '🔧';
      case 'intelligent': return '🧠';
      default: return '📂';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-dark-bg-primary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="h-8 w-8 text-accent-blue" />
            RPM Calculator
          </h1>
          <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
            Calculate potential YouTube revenue based on niche-specific RPM rates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Smart Niche Search */}
          <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent-blue" />
              Smart Niche Search
            </h2>
            
            {/* Search Bar with Suggestions */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-text-tertiary" />
              <input
                type="text"
                placeholder="Try: React, Minecraft, Bitcoin, Cooking..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-dark-border bg-dark-bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent text-base placeholder-dark-text-tertiary"
                disabled={isSearching}
              />
              
              {/* Loading indicator */}
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 text-accent-blue animate-spin" />
                </div>
              )}
              
              {/* Search indicator when not searching */}
              {!isSearching && searchTerm.length > 0 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2" title="Smart Search">
                  <Search className="h-4 w-4 text-accent-blue" />
                </div>
              )}
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-dark-bg-card border border-dark-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 hover:bg-dark-bg-hover border-b border-dark-border last:border-b-0"
                    >
                      <div className="font-medium text-white">{suggestion.displayName}</div>
                      <div className="text-sm text-dark-text-tertiary mt-1">{suggestion.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error Display */}
            {searchError && (
              <div className="mb-4 p-3 bg-youtube-red/10 border border-youtube-red/30 rounded-lg">
                <p className="text-sm text-youtube-red">⚠️ {searchError}</p>
              </div>
            )}

            {/* Unknown Niche Alert */}
            {showUnknownNicheAlert && searchResult?.isUnknownNiche && (
              <div className="mb-4 p-4 bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-accent-yellow mt-0.5">💡</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-accent-yellow mb-1">
                      New Niche Detected: "{searchTerm}"
                    </h4>
                    <p className="text-sm text-dark-text-secondary mb-3">
                      We couldn't find a specific category for this niche, so we're using general rates ($4/1K RPM). 
                      Our team has been notified and will review adding this as a new category.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowUnknownNicheAlert(false)}
                        className="text-xs bg-accent-yellow/20 hover:bg-accent-yellow/30 text-accent-yellow px-2 py-1 rounded transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => {
                          // Here you could implement a more detailed feedback form
                          alert(`Thank you! We've logged "${searchTerm}" for review. Expected RPM will be more accurate once we add this category.`);
                          setShowUnknownNicheAlert(false);
                        }}
                        className="text-xs bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue px-2 py-1 rounded transition-colors"
                      >
                        Send Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Search Result Display */}
            {searchResult && !searchError && (
              <div className="mb-6">
                <div className={`p-4 rounded-lg border-2 ${getMatchTypeColor(searchResult.matchType)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMatchTypeIcon(searchResult.matchType)}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getMatchTypeColor(searchResult.matchType)}`}>
                        {getMatchTypeLabel(searchResult.matchType)}
                      </span>
                      {searchResult.confidence !== undefined && (
                        <span className="text-xs text-dark-text-tertiary bg-dark-bg-secondary px-2 py-1 rounded">
                          {Math.round(searchResult.confidence)}% confidence
                        </span>
                      )}
                    </div>
                    {searchResult.matchType !== 'default' && (
                      <Tag className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium text-white">"{searchTerm}"</span>
                    <ArrowRight className="h-4 w-4 text-dark-text-tertiary" />
                    <span className="font-semibold text-white">{searchResult.parentCategory.name}</span>
                  </div>
                  
                  {/* AI Reasoning */}
                  {searchResult.reasoning && (
                    <div className="mb-3 p-3 bg-dark-bg-card bg-opacity-50 rounded-lg">
                      <h4 className="text-sm font-medium text-white mb-1">Why this category?</h4>
                      <p className="text-sm text-dark-text-secondary">{searchResult.reasoning}</p>
                    </div>
                  )}
                  
                  <div className="text-sm text-dark-text-secondary mb-3">
                    {searchResult.niche.description}
                  </div>
                  
                  <div className="flex gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1 text-dark-text-secondary">
                      <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                      <span>Long-form: ${searchResult.parentCategory.longFormRpm}/1K views</span>
                    </div>
                    <div className="flex items-center gap-1 text-dark-text-secondary">
                      <div className="w-2 h-2 bg-accent-blue rounded-full"></div>
                      <span>Shorts: $0.15/1K views</span>
                    </div>
                  </div>

                  {/* Related Suggestions */}
                  {searchResult.suggestions && searchResult.suggestions.length > 0 && (
                    <div className="pt-3 border-t border-dark-border">
                      <h4 className="text-sm font-medium text-white mb-2">Related keywords in this category:</h4>
                      <div className="flex flex-wrap gap-1">
                        {searchResult.suggestions.slice(0, 6).map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setSearchTerm(suggestion)}
                            className="px-2 py-1 bg-dark-bg-secondary hover:bg-dark-bg-hover text-xs text-white rounded border border-dark-border transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Parent Categories List */}
            {!searchTerm && (
              <div>
                <h3 className="text-sm font-medium text-white mb-3">Browse Categories</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {parentCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        // Create a virtual niche for the parent category
                        const virtualCategoryNiche: NicheData = {
                          id: `category-${category.id}`,
                          displayName: category.name,
                          parentCategory: category.id,
                          longFormRpm: category.longFormRpm,
                          shortsRpm: category.shortsRpm,
                          description: category.description,
                          keywords: [category.name.toLowerCase()],
                          aliases: []
                        };
                        
                        setSelectedParentCategory(category);
                        setSelectedNiche(virtualCategoryNiche);
                        setSearchTerm(category.name);
                        setSearchResult({
                          niche: virtualCategoryNiche,
                          parentCategory: category,
                          matchType: 'exact',
                          matchedKeyword: category.name,
                          reasoning: `Selected general ${category.name} category with average industry RPM rates.`
                        });
                      }}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedParentCategory?.id === category.id
                          ? 'border-accent-blue bg-accent-blue/10'
                          : 'border-dark-border hover:bg-dark-bg-hover'
                      }`}
                    >
                      <div className="font-medium text-white">{category.name}</div>
                      <div className="text-sm text-dark-text-tertiary mt-1">{category.description}</div>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-accent-green font-medium">
                          Long-form: ${category.longFormRpm}/1K views
                        </span>
                        <span className="text-accent-blue font-medium">
                          Shorts: $0.15/1K views
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Calculator */}
          <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Calculate Revenue</h2>
            
            {(selectedNiche || selectedParentCategory) ? (
              <div className="space-y-6">
                {/* Selected Category Display */}
                <div className="p-4 bg-accent-blue/10 rounded-lg border border-accent-blue/30">
                  <h3 className="font-medium text-white">
                    {selectedNiche ? selectedNiche.displayName : selectedParentCategory?.name}
                  </h3>
                  <p className="text-sm text-dark-text-secondary mt-1">
                    {selectedNiche ? selectedNiche.description : selectedParentCategory?.description}
                  </p>
                  {searchResult && searchResult.matchType !== 'default' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${getMatchTypeColor(searchResult.matchType)}`}>
                        {getMatchTypeLabel(searchResult.matchType)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setContentType('longform')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        contentType === 'longform'
                          ? 'border-accent-green bg-accent-green/10 text-accent-green'
                          : 'border-dark-border hover:bg-dark-bg-hover text-white'
                      }`}
                    >
                      <div className="font-medium">Long-form</div>
                      <div className="text-sm">
                        ${(selectedNiche || selectedParentCategory)?.longFormRpm}/1K views
                      </div>
                    </button>
                    <button
                      onClick={() => setContentType('shorts')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        contentType === 'shorts'
                          ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
                          : 'border-dark-border hover:bg-dark-bg-hover text-white'
                      }`}
                    >
                      <div className="font-medium">Shorts</div>
                      <div className="text-sm">$0.15/1K views</div>
                    </button>
                  </div>
                </div>

                {/* Views Input */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Expected Views
                  </label>
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-dark-border bg-dark-bg-secondary text-white rounded-lg focus:ring-2 focus:ring-accent-blue focus:border-transparent placeholder-dark-text-tertiary"
                    placeholder="Enter expected views"
                    min="0"
                  />
                </div>

                {/* Results */}
                <div className="p-6 bg-dark-bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-accent-green" />
                    <h3 className="text-lg font-semibold text-white">Revenue Estimate</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-dark-text-secondary">RPM Rate:</span>
                      <span className="font-medium text-white">
                        ${contentType === 'longform' 
                          ? (selectedNiche || selectedParentCategory)?.longFormRpm 
                          : '0.15'} per 1,000 views
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-dark-text-secondary">Views:</span>
                      <span className="font-medium text-white">{views.toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total Revenue:</span>
                        <span className="text-2xl font-bold text-accent-green">
                          {formatCurrency(calculateRevenue())}
                        </span>
                      </div>
                    </div>

                    {/* Monthly/Yearly Projections */}
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-accent-blue" />
                        If you get this many views...
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-dark-text-tertiary">Per Month</div>
                          <div className="font-semibold text-white">{formatCurrency(calculateRevenue())}</div>
                        </div>
                        <div>
                          <div className="text-dark-text-tertiary">Per Year</div>
                          <div className="font-semibold text-white">{formatCurrency(calculateRevenue() * 12)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-dark-text-secondary">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-dark-text-tertiary" />
                <p>Select a niche to start calculating</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Info Box */}
        <div className="mt-8 bg-gradient-to-r from-accent-blue/20 via-accent-blue/10 to-accent-blue/20 border border-accent-blue/30 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Search className="h-5 w-5 text-accent-blue" />
            Smart Niche Classification System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-white mb-2">🎯 Intelligent Matching</h4>
              <p className="text-dark-text-secondary">
                Our system uses multiple matching strategies: exact keyword matches, partial matches, 
                and fuzzy matching for typos. If we can't find your niche, you'll get general rates 
                while we review it for addition.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">💡 Unknown Niche Handling</h4>
              <p className="text-dark-text-secondary">
                Can't find your niche? No problem! We'll use general content rates ($4/1K RPM) 
                and notify our team to review adding your specific niche to our database.
              </p>
            </div>
          </div>
          
          {/* Search Examples */}
          <div className="mt-4 pt-4 border-t border-accent-blue/30">
            <h4 className="font-medium text-white mb-2">Try These Search Examples:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <h5 className="text-xs font-medium text-accent-blue mb-1">Known Categories:</h5>
                <div className="flex flex-wrap gap-1">
                  {['React', 'Minecraft', 'Bitcoin', 'Cooking'].map((example) => (
                    <button
                      key={example}
                      onClick={() => setSearchTerm(example)}
                      className="px-2 py-1 bg-accent-green/20 hover:bg-accent-green/30 text-accent-green rounded text-xs transition-colors"
                    >
                      🎯 {example}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-medium text-accent-blue mb-1">Test Unknown Niches:</h5>
                <div className="flex flex-wrap gap-1">
                  {['Hairdresser', 'Pottery', 'Origami', 'Blacksmithing'].map((example) => (
                    <button
                      key={example}
                      onClick={() => setSearchTerm(example)}
                      className="px-2 py-1 bg-accent-yellow/20 hover:bg-accent-yellow/30 text-accent-yellow rounded text-xs transition-colors"
                      disabled={isSearching}
                    >
                      💡 {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-xs text-dark-text-secondary">
              <strong>💡 Smart Fallback:</strong> If we don't recognize your niche yet, we'll use general rates 
              and log it for review. Help us improve by trying new niches!
            </div>
          </div>
        </div>

        {onClose && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-dark-bg-card text-white rounded-lg hover:bg-dark-bg-hover transition-colors border border-dark-border"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RpmCalculator;