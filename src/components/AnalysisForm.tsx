import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Play } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 animate-slide-up">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="relative">
            <div className="absolute -inset-2 bg-youtube-red rounded-lg blur opacity-30 animate-pulse"></div>
            <div className="relative bg-youtube-red p-3 rounded-lg">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            YouTube Analytics
          </h1>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Analyze Any Channel Instantly
        </h2>
        <p className="text-xl text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
          Get comprehensive insights on performance, revenue potential, and growth trends with our advanced analytics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-text-tertiary h-5 w-5 transition-colors group-focus-within:text-youtube-red" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., youtube.com/@MrBeast or @MrBeast"
              className="input-base pl-12 text-lg font-medium shadow-lg dark:shadow-youtube focus:shadow-xl transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="btn-primary min-w-[140px] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Analyze
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-youtube-red/10 border border-red-200 dark:border-youtube-red/30 rounded-lg text-red-700 dark:text-youtube-red-light animate-fade-in">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </form>

      {/* Example channels */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500 dark:text-dark-text-tertiary mb-6 font-medium">Try these popular channels:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { handle: '@MrBeast', category: 'Entertainment' },
            { handle: '@PewDiePie', category: 'Gaming' },
            { handle: '@mkbhd', category: 'Tech' },
            { handle: '@veritasium', category: 'Science' },
            { handle: '@theodd1sout', category: 'Animation' }
          ].map(({ handle, category }) => (
            <button
              key={handle}
              onClick={() => setUrl(`youtube.com/${handle}`)}
              className="group px-4 py-2 bg-gray-100 dark:bg-dark-bg-card hover:bg-gray-200 dark:hover:bg-dark-bg-hover rounded-full text-sm font-medium text-gray-700 dark:text-dark-text-secondary transition-all duration-200 border border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-dark-text-tertiary hover:shadow-md"
              disabled={isLoading}
            >
              <span className="flex items-center gap-2">
                <Play className="h-3 w-3 text-youtube-red opacity-70 group-hover:opacity-100" />
                {handle}
                <span className="text-xs text-gray-500 dark:text-dark-text-tertiary">• {category}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisForm;