import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ExternalLink, Play, Clock, Eye, Target, Lightbulb, BarChart3, Video, Zap, Loader2, Crown, Star, Gift } from 'lucide-react';
import { AnalysisResults, OutlierVideo, PatternInsight, FormatAnalysis } from '@/utils/patternAnalyzer';
import { TIER_CONFIGS, AnalysisTier } from '@/utils/cacheManager';

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
  const [formatFilter, setFormatFilter] = useState<'both' | 'longform' | 'shorts'>('both');

  const handleAnalyze = async () => {
    if (!channelUrl.trim()) {
      setError('Please enter a YouTube channel URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResults(null);

    try {
      const formatParam = formatFilter === 'both' ? '' : `&format=${formatFilter}`;
      const response = await fetch(`/api/outlier-analysis?url=${encodeURIComponent(channelUrl)}&tier=${selectedTier}${formatParam}`);
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
    <div className="bg-dark-bg-card rounded-lg border border-dark-border p-4 hover:shadow-youtube-hover transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-accent-blue text-white rounded-full flex items-center justify-center text-sm font-semibold mb-2">
            {index + 1}
          </div>
          {video.thumbnailUrl && (
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            </a>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white hover:text-accent-blue transition-colors group flex items-start gap-1"
            >
              <span className="line-clamp-2">{video.title}</span>
              <ExternalLink className="h-4 w-4 text-dark-text-tertiary group-hover:text-accent-blue flex-shrink-0 mt-0.5" />
            </a>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-dark-text-secondary">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{formatViews(video.viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(video.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-accent-green" />
              <span className="font-semibold text-accent-green">#{index + 1} Top</span>
            </div>
          </div>
          
          <div className="text-xs text-dark-text-tertiary mt-1">
            Published: {new Date(video.publishedAt).toLocaleDateString()}
          </div>
          
          {video.patternTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {video.patternTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-accent-blue/20 text-accent-blue text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {video.patternTags.length > 4 && (
                <span className="px-2 py-1 bg-dark-bg-secondary text-dark-text-secondary text-xs rounded-full">
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
    <div className="bg-dark-bg-card rounded-lg border border-dark-border p-4">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-white">{pattern.description}</h4>
        <span className="text-lg font-bold text-accent-green">{pattern.avgMultiplier}x</span>
      </div>
      <p className="text-sm text-dark-text-secondary mb-3">
        {pattern.videoCount} videos with this pattern average {pattern.avgMultiplier}x more views
      </p>
      <div className="space-y-1">
        <p className="text-xs font-medium text-dark-text-secondary">Examples:</p>
        {pattern.examples.slice(0, 2).map((example, idx) => (
          <p key={idx} className="text-xs text-dark-text-tertiary line-clamp-1">• {example}</p>
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
          <Video className="h-12 w-12 text-dark-text-tertiary mx-auto mb-4" />
          <p className="text-dark-text-secondary">No {formatName.toLowerCase()} videos found</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Executive Summary */}
        <div className="bg-gradient-to-r from-accent-green/20 to-accent-green/10 rounded-lg p-6 border border-accent-green/30 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-accent-green" />
            📊 Executive Summary - {formatName} Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{analysis.totalVideos}</div>
              <div className="text-sm text-accent-green">Videos Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-900">{formatViews(analysis.averageViews)}</div>
              <div className="text-sm text-green-700">Channel Average</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-900">{analysis.outliers.length}</div>
              <div className="text-sm text-green-700">Top Performers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-900">{analysis.patterns.length}</div>
              <div className="text-sm text-green-700">Success Patterns</div>
            </div>
          </div>
          
          {/* Quick Insights */}
          <div className="bg-dark-bg-card rounded-lg p-4 border border-accent-green/30">
            <h4 className="font-semibold text-white mb-2">🎯 Key Insights:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-accent-green">Best performing topic:</span>
                <span className="text-dark-text-secondary ml-2">
                  {analysis.bestPerformingTopics.length > 0 
                    ? `"${analysis.bestPerformingTopics[0].topic}" (${formatViews(analysis.bestPerformingTopics[0].avgViews)} avg)`
                    : 'Analyzing...'}
                </span>
              </div>
              <div>
                <span className="font-medium text-accent-green">Top pattern:</span>
                <span className="text-dark-text-secondary ml-2">
                  {analysis.patterns.length > 0 
                    ? `${analysis.patterns[0].description} (${formatViews(analysis.patterns[0].avgViews)} avg)`
                    : 'Analyzing...'}
                </span>
              </div>
              <div>
                <span className="font-medium text-accent-green">Optimal length:</span>
                <span className="text-dark-text-secondary ml-2">
                  {analysis.contentSpecs?.optimalLength.range || 'Analyzing...'}
                </span>
              </div>
              <div>
                <span className="font-medium text-accent-green">Best upload day:</span>
                <span className="text-dark-text-secondary ml-2">
                  {analysis.contentSpecs?.uploadTiming.bestDays[0] || 'Analyzing...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-gradient-to-r from-accent-blue/20 to-accent-blue/10 rounded-lg p-6 border border-accent-blue/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent-blue" />
            {formatName} Performance Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{analysis.totalVideos}</div>
              <div className="text-sm text-accent-blue">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{formatViews(analysis.averageViews)}</div>
              <div className="text-sm text-blue-700">Average Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{analysis.outliers.length}</div>
              <div className="text-sm text-blue-700">Top Performers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">{analysis.patterns.length}</div>
              <div className="text-sm text-blue-700">Patterns Detected</div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        {analysis.outliers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-accent-green" />
              Top Performing {formatName} Videos
            </h3>
            <div className="space-y-3">
              {analysis.outliers.map((video, index) => (
                <OutlierVideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
            <div className="mt-3 text-sm text-dark-text-secondary bg-accent-blue/10 p-3 rounded-lg">
              💡 <strong>Note:</strong> Showing top {analysis.outliers.length} highest-viewed videos from the last 100 analyzed, regardless of performance multiplier.
            </div>
          </div>
        )}

        {/* Pattern Insights */}
        {analysis.patterns.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent-purple" />
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
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent-yellow" />
              Best Performing Topics
            </h3>
            <div className="space-y-4">
              {analysis.bestPerformingTopics.map((topic, index) => (
                <div key={topic.topic} className="bg-dark-bg-card rounded-lg border border-dark-border p-6">
                  {/* Topic Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xl font-bold text-white">"{topic.topic}"</span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-accent-blue/20 text-accent-blue text-sm rounded-full font-medium">
                            {topic.count} videos
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(topic.performanceScore / 2)
                                    ? 'text-accent-yellow fill-current'
                                    : 'text-dark-text-tertiary'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-dark-text-secondary ml-1">
                              {topic.performanceScore}/10
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {formatViews(topic.avgViews)} average views
                      </div>
                      <div className="text-sm text-gray-600">
                        {topic.audienceAppeal}
                      </div>
                    </div>
                  </div>

                  {/* Success Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Success Factors
                      </h5>
                      <ul className="space-y-1">
                        {topic.successFactors.map((factor, idx) => (
                          <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                            <span className="text-green-600 mt-1 text-xs">•</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Recommended Actions
                      </h5>
                      <ul className="space-y-1">
                        {topic.recommendedActions.map((action, idx) => (
                          <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                            <span className="text-blue-600 mt-1 text-xs">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Competitive Advantage */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mb-4">
                    <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Competitive Advantage
                    </h5>
                    <p className="text-sm text-purple-800">{topic.competitiveAdvantage}</p>
                  </div>

                  {/* Video Examples */}
                  {topic.examples && topic.examples.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Top Performing Examples</h5>
                      <div className="flex gap-3 overflow-x-auto">
                        {topic.examples.slice(0, 3).map((example, idx) => (
                          <a
                            key={idx}
                            href={example.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 group"
                          >
                            <div className="w-32">
                              {example.thumbnailUrl && (
                                <div className="relative mb-2">
                                  <img
                                    src={example.thumbnailUrl}
                                    alt={example.title}
                                    className="w-32 h-20 object-cover rounded border group-hover:opacity-80 transition-opacity"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="h-6 w-6 text-white" />
                                  </div>
                                  <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                                    {formatViews(example.viewCount)}
                                  </div>
                                </div>
                              )}
                              <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {example.title}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Title Analysis */}
        {analysis.titleAnalysis && analysis.titleAnalysis.mostCommonWords.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Title Success Patterns</h3>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Most Common Words */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">High-Performing Words</h4>
                  <div className="space-y-2">
                    {analysis.titleAnalysis.mostCommonWords.slice(0, 8).map((word, index) => (
                      <div key={word.word} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">"{word.word}"</span>
                        <div className="text-right">
                          <div className="text-green-600 font-semibold">{formatViews(word.avgViews)}</div>
                          <div className="text-xs text-gray-500">{word.count} uses</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title Formats */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Successful Title Formats
                    <span className="text-sm text-gray-500 ml-2">(Avg: {analysis.titleAnalysis.avgTitleLength} chars)</span>
                  </h4>
                  <div className="space-y-2">
                    {analysis.titleAnalysis.titleFormats.slice(0, 6).map((format, index) => (
                      <div key={format.format} className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-700">{format.format}</span>
                          <div className="text-right">
                            <div className="text-green-600 font-semibold">{formatViews(format.avgViews)}</div>
                            <div className="text-xs text-gray-500">{format.count} videos</div>
                          </div>
                        </div>
                        {format.examples.length > 0 && (
                          <div className="text-xs text-gray-500 italic">
                            Example: "{format.examples[0].length > 50 ? format.examples[0].substring(0, 50) + '...' : format.examples[0]}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Specifications */}
        {analysis.contentSpecs && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Optimal Content Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Optimal Length */}
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Optimal Length
                </h4>
                <div className="text-2xl font-bold text-purple-900 mb-1">
                  {analysis.contentSpecs.optimalLength.range}
                </div>
                <div className="text-sm text-purple-700 mb-2">
                  {formatViews(analysis.contentSpecs.optimalLength.avgViews)} avg views
                </div>
                <p className="text-xs text-purple-600">
                  {analysis.contentSpecs.optimalLength.description}
                </p>
              </div>

              {/* Upload Timing */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Best Upload Days
                </h4>
                <div className="space-y-1 mb-2">
                  {analysis.contentSpecs.uploadTiming.bestDays.length > 0 ? (
                    analysis.contentSpecs.uploadTiming.bestDays.map((day, idx) => (
                      <div key={idx} className="text-sm font-medium text-blue-900">
                        {idx === 0 ? '🥇' : '🥈'} {day}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-blue-700">Analyzing...</div>
                  )}
                </div>
                <p className="text-xs text-blue-600">
                  {analysis.contentSpecs.uploadTiming.insight}
                </p>
              </div>

              {/* Series vs Standalone */}
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Content Format
                </h4>
                <div className="space-y-1 mb-2">
                  <div className="text-xs text-green-700">Series: {formatViews(analysis.contentSpecs.seriesVsStandalone.seriesPerformance)} avg</div>
                  <div className="text-xs text-green-700">Standalone: {formatViews(analysis.contentSpecs.seriesVsStandalone.standalonePerformance)} avg</div>
                </div>
                <p className="text-xs text-green-600">
                  {analysis.contentSpecs.seriesVsStandalone.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              🎯 Actionable Strategy Recommendations
            </h3>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-6">
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-yellow-900 font-medium">{rec}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <p className="text-yellow-800 text-sm font-medium">
                  💡 <strong>Pro Tip:</strong> Implement these recommendations one at a time and measure results before adding more changes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getCurrentAnalysis = (): FormatAnalysis => {
    if (!analysisResults) return { 
      totalVideos: 0, 
      averageViews: 0, 
      outliers: [], 
      patterns: [], 
      recommendations: [], 
      bestPerformingTopics: [], 
      titleAnalysis: { 
        avgTitleLength: 0, 
        mostCommonWords: [], 
        titleFormats: [] 
      }, 
      contentSpecs: { 
        optimalLength: { range: '', avgViews: 0, description: '' },
        uploadTiming: { bestDays: [], worstDays: [], insight: '' },
        seriesVsStandalone: { seriesPerformance: 0, standalonePerformance: 0, recommendation: '' }
      } 
    };
    
    switch (activeTab) {
      case 'longform': return analysisResults.longform;
      case 'shorts': return analysisResults.shorts;
      default: return analysisResults.longform;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Outlier Video Pattern Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get actionable insights from your top-performing content. Advanced pattern recognition analyzes your last 100 videos to identify winning formulas for titles, topics, timing, and content strategy.
          </p>
        </div>

        {/* Channel Input */}
        <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6 mb-8">
          <div className="space-y-4">
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
            
            {/* Format Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Format to Analyze
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setFormatFilter('both')}
                  disabled={isAnalyzing}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formatFilter === 'both'
                      ? 'bg-accent-blue text-white border-accent-blue'
                      : 'bg-dark-bg-secondary text-white border-dark-border hover:bg-dark-bg-hover'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  📊 Both Formats
                </button>
                <button
                  onClick={() => setFormatFilter('longform')}
                  disabled={isAnalyzing}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formatFilter === 'longform'
                      ? 'bg-accent-blue text-white border-accent-blue'
                      : 'bg-dark-bg-secondary text-white border-dark-border hover:bg-dark-bg-hover'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  🎬 Long-form Only
                </button>
                <button
                  onClick={() => setFormatFilter('shorts')}
                  disabled={isAnalyzing}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formatFilter === 'shorts'
                      ? 'bg-accent-blue text-white border-accent-blue'
                      : 'bg-dark-bg-secondary text-white border-dark-border hover:bg-dark-bg-hover'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  ⚡ Shorts Only
                </button>
              </div>
              <p className="text-xs text-dark-text-tertiary mt-1">
                Filter to specific format to reduce API costs and focus analysis on your preferred content type
              </p>
            </div>
          </div>
        </div>

        {/* Tier Selection */}
        <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Analysis Depth</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(TIER_CONFIGS).map(([tier, config]) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier as AnalysisTier)}
                disabled={isAnalyzing}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedTier === tier
                    ? 'border-accent-blue bg-accent-blue/10'
                    : 'border-dark-border hover:border-dark-text-tertiary'
                } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {tier === 'free' && <Gift className="h-5 w-5 text-accent-green" />}
                  {tier === 'standard' && <Star className="h-5 w-5 text-accent-blue" />}
                  {tier === 'premium' && <Crown className="h-5 w-5 text-accent-purple" />}
                  <h4 className="font-semibold text-white capitalize">{tier}</h4>
                </div>
                <p className="text-sm text-dark-text-secondary mb-3">{config.description}</p>
                <div className="text-sm">
                  <div className="font-medium text-white mb-1">
                    Up to {config.maxVideos.toLocaleString()} videos
                  </div>
                  <ul className="text-xs text-dark-text-tertiary space-y-1">
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
          <div className="bg-youtube-red/10 border border-youtube-red/30 rounded-lg p-4 mb-6">
            <p className="text-youtube-red">⚠️ {error}</p>
          </div>
        )}

        {/* Results */}
        {analysisResults && (
          <>
            {/* Analysis Info */}
            <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white">
                  Analysis completed for channel: <strong>{analysisResults.channelId}</strong>
                </p>
                <div className="flex items-center gap-2">
                  {analysisResults.tier === 'free' && <Gift className="h-4 w-4 text-accent-green" />}
                  {analysisResults.tier === 'standard' && <Star className="h-4 w-4 text-accent-blue" />}
                  {analysisResults.tier === 'premium' && <Crown className="h-4 w-4 text-accent-purple" />}
                  <span className="text-sm font-medium text-accent-blue capitalize">{analysisResults.tier} Tier</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-dark-text-secondary">
                <span>📊 {analysisResults.videosAnalyzed.toLocaleString()} of {analysisResults.totalVideoCount.toLocaleString()} videos analyzed (last 100 videos for cost efficiency)</span>
                {analysisResults.fromCache && (
                  <span>🕒 Cached from {new Date(analysisResults.analyzedAt).toLocaleString()}</span>
                )}
              </div>
              
              {!analysisResults.fetchedAll && (
                <div className="mt-3 p-3 bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg">
                  <p className="text-accent-yellow text-sm">
                    💡 <strong>Want deeper insights?</strong> This analysis covered {analysisResults.videosAnalyzed.toLocaleString()} videos. 
                    {analysisResults.tier === 'free' && ' Upgrade to Standard for 1,000 videos or Premium for complete analysis.'}
                    {analysisResults.tier === 'standard' && ' Upgrade to Premium for complete channel analysis.'}
                  </p>
                </div>
              )}
            </div>

            {/* Format Tabs */}
            <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border mb-6">
              <div className="border-b border-dark-border">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('longform')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'longform'
                        ? 'border-accent-blue text-accent-blue'
                        : 'border-transparent text-dark-text-secondary hover:text-white'
                    }`}
                  >
                    Long-form Videos ({analysisResults.longform.totalVideos})
                  </button>
                  <button
                    onClick={() => setActiveTab('shorts')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'shorts'
                        ? 'border-accent-blue text-accent-blue'
                        : 'border-transparent text-dark-text-secondary hover:text-white'
                    }`}
                  >
                    Shorts ({analysisResults.shorts.totalVideos})
                  </button>
                  <button
                    onClick={() => setActiveTab('combined')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'combined'
                        ? 'border-accent-blue text-accent-blue'
                        : 'border-transparent text-dark-text-secondary hover:text-white'
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
                      <h3 className="text-lg font-semibold text-white mb-4">Cross-Format Insights</h3>
                      <div className="text-3xl font-bold text-white mb-2">{analysisResults.combined.totalVideos}</div>
                      <div className="text-sm text-dark-text-secondary">Total Videos Analyzed</div>
                    </div>
                    
                    {analysisResults.combined.crossFormatInsights.length > 0 && (
                      <div className="bg-gradient-to-r from-accent-purple/20 to-accent-purple/10 rounded-lg p-6 border border-accent-purple/30">
                        <h4 className="text-lg font-semibold text-white mb-4">Strategic Insights</h4>
                        <ul className="space-y-2">
                          {analysisResults.combined.crossFormatInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-accent-purple mt-1">•</span>
                              <span className="text-white">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysisResults.combined.enhancedCombinedInsights && analysisResults.combined.enhancedCombinedInsights.length > 0 && (
                      <div className="bg-gradient-to-r from-accent-orange/20 to-accent-yellow/10 rounded-lg p-6 border border-accent-orange/30">
                        <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Expert Knowledge Base Analysis
                        </h4>
                        <p className="text-sm text-orange-700 mb-4">
                          Advanced insights powered by comprehensive short-form content creation knowledge base
                        </p>
                        <div className="space-y-3">
                          {analysisResults.combined.enhancedCombinedInsights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <span className="text-orange-600 mt-1 text-lg">•</span>
                              <span className="text-orange-900 text-sm leading-relaxed">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2">Long-form Summary</h4>
                        <p className="text-green-800 text-sm">
                          {analysisResults.longform.totalVideos} videos, averaging {formatViews(analysisResults.longform.averageViews)} views
                        </p>
                        <p className="text-green-800 text-sm">
                          {analysisResults.longform.outliers.length} top performers identified
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Shorts Summary</h4>
                        <p className="text-blue-800 text-sm">
                          {analysisResults.shorts.totalVideos} videos, averaging {formatViews(analysisResults.shorts.averageViews)} views
                        </p>
                        <p className="text-blue-800 text-sm">
                          {analysisResults.shorts.outliers.length} top performers identified
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

        {/* Enhanced Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">🚀 Advanced Content Analysis Engine</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">🔍 Smart Detection</h4>
              <p className="text-blue-800">
                Enhanced Shorts detection with 4-layer validation: duration, hashtags, format indicators, and vertical hints.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">🎯 Pattern Recognition</h4>
              <p className="text-blue-800">
                40+ advanced patterns including power words, emotional triggers, title structures, and content formats.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">📈 Topic Intelligence</h4>
              <p className="text-blue-800">
                AI-powered topic categorization across 15+ niches with performance scoring and success insights.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">⏰ Timing Analysis</h4>
              <p className="text-blue-800">
                Optimal length detection, upload timing patterns, and series vs standalone performance comparison.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                💰 <strong>Cost Efficient:</strong> Analyzes last 100 videos only - reduces API costs from $0.15-$0.30 to $0.0048 per channel (98% savings).
              </p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-800 text-sm">
                🎯 <strong>Actionable Results:</strong> Specific recommendations with emojis, performance metrics, and step-by-step implementation guides.
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