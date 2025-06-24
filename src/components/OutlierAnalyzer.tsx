import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ExternalLink, Play, Clock, Eye, Target, Lightbulb, BarChart3, Video, Zap, Loader2, Crown, Star, Gift } from 'lucide-react';
import { AnalysisResults, OutlierVideo, PatternInsight, FormatAnalysis } from '@/src/utils/patternAnalyzer';
import { TIER_CONFIGS, AnalysisTier } from '@/src/utils/cacheManager';

interface OutlierAnalyzerProps {
  onClose?: () => void;
}

type TabType = 'longform' | 'shorts' | 'combined';

interface AnalysisResponse extends AnalysisResults {
  channelId: string;
  fromCache: boolean;
  analyzedAt: string;
  tier: AnalysisTier;
  totalVideoCount: number;
  videosAnalyzed: number;
  fetchedAll: boolean;
}

const OutlierAnalyzer: React.FC<OutlierAnalyzerProps> = ({ onClose }) => {
  const [channelUrl, setChannelUrl] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('longform');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<AnalysisTier>('free');

  const handleAnalyze = async () => {
    if (!channelUrl.trim()) {
      setError('Please enter a YouTube channel URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResults(null);

    try {
      const response = await fetch(`/api/outlier-analysis?url=${encodeURIComponent(channelUrl)}&tier=${selectedTier}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (duration: string): string => {
    // Convert PT4M13S to "4:13"
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const OutlierVideoCard: React.FC<{ video: OutlierVideo; index: number }> = ({ video, index }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {index + 1}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors group flex items-start gap-1"
            >
              <span className="line-clamp-2">{video.title}</span>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
            </a>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{formatViews(video.viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">{video.multiplier}x</span>
            </div>
          </div>
          
          {video.patternTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {video.patternTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {video.patternTags.length > 4 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                  +{video.patternTags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const PatternInsightCard: React.FC<{ pattern: PatternInsight; index: number }> = ({ pattern, index }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{pattern.description}</h4>
        <span className="text-lg font-bold text-green-600">{pattern.avgMultiplier}x</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {pattern.videoCount} videos with this pattern average {pattern.avgMultiplier}x more views
      </p>
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-700">Examples:</p>
        {pattern.examples.slice(0, 2).map((example, idx) => (
          <p key={idx} className="text-xs text-gray-600 line-clamp-1">• {example}</p>
        ))}
      </div>
    </div>
  );

  const FormatAnalysisView: React.FC<{ analysis: FormatAnalysis; formatName: string }> = ({ 
    analysis, 
    formatName 
  }) => {
    if (analysis.totalVideos === 0) {
      return (
        <div className="text-center py-12">
          <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No {formatName.toLowerCase()} videos found</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Performance Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {formatName} Performance Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{analysis.totalVideos}</div>
              <div className="text-sm text-blue-700">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{formatViews(analysis.averageViews)}</div>
              <div className="text-sm text-blue-700">Average Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{analysis.outliers.length}</div>
              <div className="text-sm text-blue-700">Outliers Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{analysis.patterns.length}</div>
              <div className="text-sm text-blue-700">Patterns Detected</div>
            </div>
          </div>
        </div>

        {/* Top Outliers */}
        {analysis.outliers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Top Performing {formatName} Videos
            </h3>
            <div className="space-y-3">
              {analysis.outliers.slice(0, 5).map((video, index) => (
                <OutlierVideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Pattern Insights */}
        {analysis.patterns.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Success Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.patterns.slice(0, 6).map((pattern, index) => (
                <PatternInsightCard key={pattern.pattern} pattern={pattern} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Best Topics */}
        {analysis.bestPerformingTopics.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Performing Topics</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="space-y-2">
                {analysis.bestPerformingTopics.map((topic, index) => (
                  <div key={topic.topic} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <span className="font-medium text-gray-900">"{topic.topic}"</span>
                      <span className="text-sm text-gray-500 ml-2">({topic.count} videos)</span>
                    </div>
                    <span className="font-semibold text-green-600">{formatViews(topic.avgViews)} avg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Content Recommendations
            </h3>
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span className="text-yellow-900">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getCurrentAnalysis = (): FormatAnalysis => {
    if (!analysisResults) return { totalVideos: 0, averageViews: 0, outliers: [], patterns: [], recommendations: [], bestPerformingTopics: [] };
    
    switch (activeTab) {
      case 'longform': return analysisResults.longform;
      case 'shorts': return analysisResults.shorts;
      default: return analysisResults.longform;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Outlier Video Pattern Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover what makes your best content successful. Find videos that outperform 2x+ and learn the patterns behind their success.
          </p>
        </div>

        {/* Channel Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Channel URL
              </label>
              <input
                type="text"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="https://youtube.com/@channelname or https://youtube.com/channel/UC..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAnalyzing}
              />
            </div>
            <div className="flex-shrink-0 self-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Analyze
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Depth</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(TIER_CONFIGS).map(([tier, config]) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier as AnalysisTier)}
                disabled={isAnalyzing}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTier === tier
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {tier === 'free' && <Gift className="h-5 w-5 text-green-600" />}
                  {tier === 'standard' && <Star className="h-5 w-5 text-blue-600" />}
                  {tier === 'premium' && <Crown className="h-5 w-5 text-purple-600" />}
                  <h4 className="font-semibold text-gray-900 capitalize">{tier}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-1">
                    Up to {config.maxVideos.toLocaleString()} videos
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {config.features.slice(0, 2).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">⚠️ {error}</p>
          </div>
        )}

        {/* Results */}
        {analysisResults && (
          <>
            {/* Analysis Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-800">
                  Analysis completed for channel: <strong>{analysisResults.channelId}</strong>
                </p>
                <div className="flex items-center gap-2">
                  {analysisResults.tier === 'free' && <Gift className="h-4 w-4 text-green-600" />}
                  {analysisResults.tier === 'standard' && <Star className="h-4 w-4 text-blue-600" />}
                  {analysisResults.tier === 'premium' && <Crown className="h-4 w-4 text-purple-600" />}
                  <span className="text-sm font-medium text-blue-900 capitalize">{analysisResults.tier} Tier</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-blue-700">
                <span>📊 {analysisResults.videosAnalyzed.toLocaleString()} of {analysisResults.totalVideoCount.toLocaleString()} videos analyzed</span>
                {analysisResults.fromCache && (
                  <span>🕒 Cached from {new Date(analysisResults.analyzedAt).toLocaleString()}</span>
                )}
              </div>
              
              {!analysisResults.fetchedAll && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>Want deeper insights?</strong> This analysis covered {analysisResults.videosAnalyzed.toLocaleString()} videos. 
                    {analysisResults.tier === 'free' && ' Upgrade to Standard for 1,000 videos or Premium for complete analysis.'}
                    {analysisResults.tier === 'standard' && ' Upgrade to Premium for complete channel analysis.'}
                  </p>
                </div>
              )}
            </div>

            {/* Format Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('longform')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'longform'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Long-form Videos ({analysisResults.longform.totalVideos})
                  </button>
                  <button
                    onClick={() => setActiveTab('shorts')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'shorts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Shorts ({analysisResults.shorts.totalVideos})
                  </button>
                  <button
                    onClick={() => setActiveTab('combined')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'combined'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Combined Insights
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'combined' ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cross-Format Insights</h3>
                      <div className="text-3xl font-bold text-blue-900 mb-2">{analysisResults.combined.totalVideos}</div>
                      <div className="text-sm text-gray-600">Total Videos Analyzed</div>
                    </div>
                    
                    {analysisResults.combined.crossFormatInsights.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                        <h4 className="text-lg font-semibold text-purple-900 mb-4">Strategic Insights</h4>
                        <ul className="space-y-2">
                          {analysisResults.combined.crossFormatInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-600 mt-1">•</span>
                              <span className="text-purple-900">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">Long-form Summary</h4>
                        <p className="text-green-800 text-sm">
                          {analysisResults.longform.totalVideos} videos, averaging {formatViews(analysisResults.longform.averageViews)} views
                        </p>
                        <p className="text-green-800 text-sm">
                          {analysisResults.longform.outliers.length} high-performing outliers found
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Shorts Summary</h4>
                        <p className="text-blue-800 text-sm">
                          {analysisResults.shorts.totalVideos} videos, averaging {formatViews(analysisResults.shorts.averageViews)} views
                        </p>
                        <p className="text-blue-800 text-sm">
                          {analysisResults.shorts.outliers.length} high-performing outliers found
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <FormatAnalysisView 
                    analysis={getCurrentAnalysis()} 
                    formatName={activeTab === 'longform' ? 'Long-form' : 'Shorts'} 
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">📊 Fetches All Videos</h4>
              <p className="text-blue-800">
                Analyzes your entire channel history, separating Shorts (≤60s) from long-form content (&gt;60s).
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">🎯 Identifies Outliers</h4>
              <p className="text-blue-800">
                Finds videos performing 2x+ better than your channel average and analyzes what makes them successful.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">💡 Extracts Patterns</h4>
              <p className="text-blue-800">
                Discovers title formulas, topics, and formats that consistently drive higher engagement.
              </p>
            </div>
          </div>
        </div>

        {onClose && (
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutlierAnalyzer;