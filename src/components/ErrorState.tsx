import React from 'react';
import { AlertTriangle, RefreshCw, Home, ExternalLink } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onReset?: () => void;
  channelUrl?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onReset, channelUrl }) => {
  const getErrorDetails = (errorMessage: string) => {
    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      return {
        title: 'Channel Not Found',
        description: 'The YouTube channel URL you entered could not be found.',
        suggestions: [
          'Check that the URL is correct and complete',
          'Make sure the channel is public',
          'Try using the channel handle instead of the full URL',
          'Verify the channel exists on YouTube'
        ]
      };
    }
    
    if (errorMessage.includes('API key') || errorMessage.includes('quota')) {
      return {
        title: 'API Service Unavailable',
        description: 'Our YouTube data service is temporarily unavailable.',
        suggestions: [
          'Please try again in a few minutes',
          'The service may be experiencing high traffic',
          'Check our status page for updates'
        ]
      };
    }

    if (errorMessage.includes('Invalid') || errorMessage.includes('URL')) {
      return {
        title: 'Invalid Channel URL',
        description: 'The URL format is not recognized as a valid YouTube channel.',
        suggestions: [
          'Use format: youtube.com/channel/UC...',
          'Use format: youtube.com/@channelhandle',
          'Use format: youtube.com/c/channelname',
          'Copy the URL directly from the channel page'
        ]
      };
    }

    return {
      title: 'Analysis Failed',
      description: 'Something went wrong while analyzing the channel.',
      suggestions: [
        'Try refreshing the page',
        'Check your internet connection',
        'Try again with a different channel',
        'Contact support if the problem persists'
      ]
    };
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {errorDetails.title}
          </h2>

          {/* Error Description */}
          <p className="text-gray-600 mb-6">
            {errorDetails.description}
          </p>

          {/* Channel URL Display */}
          {channelUrl && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Attempted URL:</p>
              <p className="text-sm font-mono text-gray-700 break-all">
                {channelUrl}
              </p>
            </div>
          )}

          {/* Suggestions */}
          <div className="mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Try these solutions:
            </h3>
            <ul className="space-y-2">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}

            {onReset && (
              <button
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="h-4 w-4" />
                Try Different Channel
              </button>
            )}

            {/* Help Link */}
            <a
              href="https://support.google.com/youtube/answer/6180214"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              YouTube Channel Help
            </a>
          </div>
        </div>

        {/* Technical Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-semibold text-red-900 mb-2">
              Technical Details (Development):
            </h4>
            <p className="text-xs font-mono text-red-700 break-all">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorState;