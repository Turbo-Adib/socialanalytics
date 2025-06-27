import React from 'react';
import { Info, Clock, Database, AlertTriangle } from 'lucide-react';

interface DataTransparencyProps {
  analytics: any; // ChannelAnalytics type
}

const DataTransparency: React.FC<DataTransparencyProps> = ({ analytics }) => {
  const { channel, currentStats, dataQuality } = analytics;
  
  // Calculate data scope information
  const recentVideoViews = currentStats.totalViews;
  const channelTotalViews = channel.totalViews;
  const percentageOfTotal = channelTotalViews > 0 ? (recentVideoViews / channelTotalViews) * 100 : 0;
  
  const scopeInfo = dataQuality?.viewCountDebug;
  
  return (
    <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-100 dark:text-blue-100">Data Sources & Methodology</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-200 dark:text-blue-200">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="font-medium">Channel Data (YouTube API)</span>
              </div>
              <ul className="space-y-1 ml-6 text-blue-300 dark:text-blue-300">
                <li>• Total Views: {channelTotalViews.toLocaleString()} (lifetime)</li>
                <li>• Subscribers: {channel.subscriberCount.toLocaleString()}</li>
                <li>• Total Videos: {channel.videoCount.toLocaleString()}</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Recent Analysis Sample</span>
              </div>
              <ul className="space-y-1 ml-6 text-blue-300 dark:text-blue-300">
                <li>• Videos Analyzed: {scopeInfo?.videosAnalyzed || 'N/A'}</li>
                <li>• Sample Views: {recentVideoViews.toLocaleString()}</li>
                <li>• Coverage: {percentageOfTotal.toFixed(1)}% of total views</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-100 dark:bg-blue-900/50 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-300 dark:text-blue-300 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-200 dark:text-blue-200">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1">
                  <li>• <strong>Historical trends</strong> are based on recent video upload patterns, not actual historical analytics</li>
                  <li>• <strong>Shorts vs Long-form</strong> classification uses video duration and metadata analysis</li>
                  <li>• <strong>Revenue estimates</strong> use industry-standard RPM rates and may not reflect actual earnings</li>
                  <li>• <strong>Projections</strong> are statistical estimates based on recent performance trends</li>
                </ul>
              </div>
            </div>
          </div>
          
          {dataQuality?.validation?.warnings && dataQuality.validation.warnings.length > 0 && (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded p-3">
              <div className="text-xs text-yellow-200 dark:text-yellow-200">
                <p className="font-medium mb-1">Data Quality Warnings:</p>
                <ul className="space-y-1">
                  {dataQuality.validation.warnings.map((warning: string, index: number) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTransparency;