import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface DataQualityProps {
  dataQuality: any; // DataQualityReport from dataValidation.ts
}

export default function DataQualityIndicator({ dataQuality }: DataQualityProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!dataQuality) return null;

  const { quality, validation, anomalies, recommendations } = dataQuality;

  const getQualityColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getQualityIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const completenessPercentage = Math.round(quality.dataCompleteness);

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900">Data Quality Report</h3>
              <p className="text-sm text-gray-600">
                {quality.totalVideosAnalyzed} videos analyzed • {completenessPercentage}% data completeness
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getQualityColor(validation.confidence)}`}>
              {getQualityIcon(validation.confidence)}
              {validation.confidence.toUpperCase()} QUALITY
            </div>
            {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-900">{quality.totalVideosAnalyzed}</p>
              <p className="text-xs text-blue-600">Videos Analyzed</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-900">{quality.longFormCount}</p>
              <p className="text-xs text-green-600">Long-form Videos</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">{quality.shortsCount}</p>
              <p className="text-xs text-purple-600">Shorts Videos</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{completenessPercentage}%</p>
              <p className="text-xs text-gray-600">Data Complete</p>
            </div>
          </div>

          {/* Data Quality Details */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Completeness</h4>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completenessPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {completenessPercentage}% of required data fields are available
              </p>
            </div>

            {quality.averageViewsPerVideo > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Average Views per Video</h4>
                <p className="text-lg font-semibold text-gray-700">
                  {quality.averageViewsPerVideo.toLocaleString()} views
                </p>
              </div>
            )}

            {quality.lastVideoDate && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Last Video Published</h4>
                <p className="text-sm text-gray-600">
                  {new Date(quality.lastVideoDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Validation Errors & Warnings */}
          {(validation.errors.length > 0 || validation.warnings.length > 0) && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Data Issues</h4>
              
              {validation.errors.length > 0 && (
                <div className="space-y-1">
                  {validation.errors.map((error: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <XCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </div>
                  ))}
                </div>
              )}
              
              {validation.warnings.length > 0 && (
                <div className="space-y-1">
                  {validation.warnings.map((warning: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-yellow-600">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Anomalies */}
          {anomalies.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Anomalies</h4>
              <div className="space-y-1">
                {anomalies.map((anomaly: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {anomaly}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
              <div className="space-y-1">
                {recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Sources */}
          <div className="border-t border-gray-200 pt-3">
            <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                YouTube Data API v3 (Primary)
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Real-time video statistics
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Content duration and metadata
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}