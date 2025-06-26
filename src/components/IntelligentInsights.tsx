import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  BarChart3,
  Clock,
  DollarSign,
  Flame,
  CheckCircle,
  Info
} from 'lucide-react';

interface Insight {
  id: number;
  insightType: string;
  category: string;
  title: string;
  description: string;
  knowledgeBaseRef: string;
  severity: string;
  score: number;
  actionable: boolean;
  relatedVideoIds?: string;
  metrics?: string;
  createdAt: string;
}

interface Recommendation {
  id: number;
  priority: number;
  recommendationType: string;
  title: string;
  description: string;
  expectedImpact: string;
  implementationSteps: string;
  requiredResources?: string;
  difficultyLevel: string;
  timeToImplement: string;
  knowledgeBaseRef: string;
  potentialScore: number;
  status: string;
}

interface NicheAnalysis {
  niche: string;
  saturationLevel: number;
  competitorCount: number;
  avgViewsPerVideo: number;
  entryBarrier: string;
  monetizationPotential: number;
  recommendedFormats: string;
}

interface IntelligentInsightsProps {
  channelId: string;
}

const IntelligentInsights: React.FC<IntelligentInsightsProps> = ({ channelId }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [nicheAnalysis, setNicheAnalysis] = useState<NicheAnalysis | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'niche'>('insights');

  useEffect(() => {
    fetchIntelligentData();
  }, [channelId]);

  const fetchIntelligentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/intelligent-insights?channelId=${channelId}`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.data.insights || []);
        setRecommendations(data.data.recommendations || []);
        setNicheAnalysis(data.data.nicheAnalysis);
        setSummary(data.data.summary || '');
      }
    } catch (error) {
      console.error('Failed to fetch intelligent insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerFreshAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/intelligent-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId })
      });
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.data.insights || []);
        setRecommendations(data.data.recommendations || []);
        setNicheAnalysis(data.data.nicheAnalysis);
        setSummary(data.data.summary || '');
      }
    } catch (error) {
      console.error('Failed to trigger analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string, severity: string) => {
    if (type === 'outlier') return <Flame className="h-5 w-5" />;
    if (type === 'opportunity') return <TrendingUp className="h-5 w-5" />;
    if (type === 'warning') return <AlertTriangle className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'hard': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="bg-dark-bg-card rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-bg-secondary rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-dark-bg-secondary rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-bg-card rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              Intelligent Insights
            </h2>
            <p className="text-dark-text-secondary mt-1">
              Expert-level analysis powered by the complete short-form content knowledge base
            </p>
          </div>
          <button
            onClick={triggerFreshAnalysis}
            className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-colors"
            disabled={loading}
          >
            Refresh Analysis
          </button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mt-4 p-4 bg-dark-bg-secondary rounded-lg">
            <pre className="text-sm text-white whitespace-pre-wrap">
              {summary}
            </pre>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-border">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'insights', label: 'Insights', count: insights.length },
            { id: 'recommendations', label: 'Recommendations', count: recommendations.length },
            { id: 'niche', label: 'Niche Analysis', count: nicheAnalysis ? 1 : 0 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No insights available. Try refreshing the analysis.
              </p>
            ) : (
              insights.map(insight => (
                <div
                  key={insight.id}
                  className={`border-l-4 p-4 rounded-lg ${getSeverityColor(insight.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${
                      insight.severity === 'critical' ? 'text-red-600' :
                      insight.severity === 'high' ? 'text-orange-600' :
                      insight.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {getInsightIcon(insight.insightType, insight.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {insight.title}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded-full">
                          Score: {insight.score.toFixed(0)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Category: {insight.category}</span>
                        <span>Knowledge Base: {insight.knowledgeBaseRef}</span>
                        {insight.actionable && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Actionable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No recommendations available. Try refreshing the analysis.
              </p>
            ) : (
              recommendations.map(rec => (
                <div
                  key={rec.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                          Priority {rec.priority}
                        </span>
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(rec.difficultyLevel)}`}>
                          {rec.difficultyLevel}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.timeToImplement}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {rec.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {rec.expectedImpact}
                        </span>
                        <span className="text-xs text-gray-500">
                          Score: {rec.potentialScore.toFixed(0)}/100
                        </span>
                      </div>
                      
                      {/* Implementation Steps */}
                      <details className="text-sm">
                        <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                          View Implementation Steps
                        </summary>
                        <div className="mt-2 pl-4">
                          <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                            {JSON.parse(rec.implementationSteps).map((step: string, index: number) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </details>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Knowledge Base: {rec.knowledgeBaseRef}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'niche' && (
          <div>
            {!nicheAnalysis ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No niche analysis available. Try refreshing the analysis.
              </p>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Saturation Level
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            nicheAnalysis.saturationLevel > 70 ? 'bg-red-500' :
                            nicheAnalysis.saturationLevel > 40 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${nicheAnalysis.saturationLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {nicheAnalysis.saturationLevel.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Competition
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {nicheAnalysis.competitorCount}
                    </p>
                    <p className="text-xs text-gray-500">competitors</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Avg Views/Video
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {nicheAnalysis.avgViewsPerVideo.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Entry Barrier
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      nicheAnalysis.entryBarrier === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      nicheAnalysis.entryBarrier === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {nicheAnalysis.entryBarrier} barrier
                    </span>
                  </div>

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Monetization Potential
                    </h3>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {nicheAnalysis.monetizationPotential.toFixed(0)}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Recommended Formats
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(nicheAnalysis.recommendedFormats).map((format: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-sm"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligentInsights;