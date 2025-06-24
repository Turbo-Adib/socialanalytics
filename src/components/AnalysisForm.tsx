import React, { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';

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
    <div className="w-full max-w-4xl px-4">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Analyze Any YouTube Channel Instantly
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Paste a channel URL or handle to get a complete breakdown of its performance, revenue, and growth trends.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-3">
          <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., youtube.com/@MrBeast or @MrBeast"
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-gray-900 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg text-lg"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg flex items-center gap-2 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Example channels */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 mb-4">Try these popular channels:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            '@MrBeast',
            '@PewDiePie',
            '@mkbhd',
            '@veritasium',
            '@theodd1sout'
          ].map((handle) => (
            <button
              key={handle}
              onClick={() => setUrl(`youtube.com/${handle}`)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {handle}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisForm;