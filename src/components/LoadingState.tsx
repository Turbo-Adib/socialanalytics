import React from 'react';
import { Loader2, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

interface LoadingStateProps {
  stage?: 'fetching' | 'analyzing' | 'calculating' | 'finalizing';
  channelName?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ stage = 'fetching', channelName }) => {
  const stages = [
    { key: 'fetching', label: 'Fetching Channel Data', icon: BarChart3, description: 'Getting channel information from YouTube...' },
    { key: 'analyzing', label: 'Analyzing Videos', icon: TrendingUp, description: 'Processing recent video performance...' },
    { key: 'calculating', label: 'Calculating Metrics', icon: DollarSign, description: 'Computing revenue estimates and projections...' },
    { key: 'finalizing', label: 'Finalizing Report', icon: Loader2, description: 'Preparing your analytics dashboard...' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);
  const CurrentIcon = stages[currentStageIndex]?.icon || Loader2;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center transition-colors duration-300">
      <div className="max-w-md w-full mx-4 animate-fade-in">
        {/* Main Loading Card */}
        <div className="card text-center">
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-youtube-red rounded-full blur opacity-20 animate-pulse"></div>
              <CurrentIcon className="relative h-12 w-12 text-youtube-red mx-auto animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analyzing Channel
          </h2>
          
          {channelName && (
            <p className="text-lg text-gray-600 dark:text-dark-text-secondary mb-6">
              {channelName}
            </p>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {stages[currentStageIndex]?.label}
            </h3>
            <p className="text-sm text-gray-500">
              {stages[currentStageIndex]?.description}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            {stages.map((stageItem, index) => {
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;
              const StageIcon = stageItem.icon;

              return (
                <div
                  key={stageItem.key}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 border border-blue-200'
                      : isCompleted
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <div className="h-5 w-5 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <StageIcon className={`h-5 w-5 ${isActive ? 'animate-spin' : ''}`} />
                    )}
                  </div>
                  
                  <div className="text-left">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-500'
                    }`}>
                      {stageItem.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loading Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round(((currentStageIndex + 1) / stages.length) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            This usually takes 10-30 seconds depending on channel size
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;