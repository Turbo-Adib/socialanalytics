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
    <div className="min-h-screen bg-dark-bg-primary flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-dark-bg-card rounded-lg shadow-sm border border-dark-border p-8 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-youtube-red/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-youtube-red" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {errorDetails.title}
          </h2>

          {/* Error Description */}
          <p className="text-dark-text-secondary mb-6">
            {errorDetails.description}
          </p>

          {/* Channel URL Display */}
          {channelUrl && (
            <div className="mb-6 p-3 bg-dark-bg-secondary rounded-lg">
              <p className="text-sm text-dark-text-tertiary mb-1">Attempted URL:</p>
              <p className="text-sm font-mono text-white break-all">
                {channelUrl}
              </p>
            </div>
          )}

          {/* Suggestions */}
          <div className="mb-8 text-left">
            <h3 className="text-lg font-semibold text-white mb-3">
              Try these solutions:
            </h3>
            <ul className="space-y-2">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                  <span className="w-1.5 h-1.5 bg-dark-text-tertiary rounded-full mt-2 flex-shrink-0" />
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}

            {onReset && (
              <button
                onClick={onReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-bg-secondary text-white rounded-lg hover:bg-dark-bg-hover transition-colors"
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dark-border text-white rounded-lg hover:bg-dark-bg-hover transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              YouTube Channel Help
            </a>
          </div>
        </div>

        {/* Technical Error Details */}
        <div className="mt-4 p-4 bg-youtube-red/10 border border-youtube-red/30 rounded-lg">
          <h4 className="text-sm font-semibold text-youtube-red mb-2">
            Technical Details:
          </h4>
          <p className="text-xs font-mono text-white break-all">
            {error}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;