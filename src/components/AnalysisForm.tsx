import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Play, Calendar, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AnalysisFormProps {
  onAnalyze: (url: string, timeRange: string, contentType: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading, error }) => {
  const [url, setUrl] = useState('');
  const [timeRange, setTimeRange] = useState('30');
  const [contentType, setContentType] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim(), timeRange, contentType);
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
          <h1 className="text-5xl font-bold text-foreground">
            YouTube Analytics
          </h1>
        </div>
        <h2 className="text-3xl font-semibold text-foreground mb-4">
          Analyze Any Channel Instantly
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get comprehensive insights on performance, revenue potential, and growth trends with our advanced analytics.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-4">
          {/* URL Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g., youtube.com/@MrBeast or @MrBeast"
                className="pl-12 text-lg font-medium h-12 shadow-lg focus:shadow-xl transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="min-w-[140px] text-lg h-12 bg-youtube-red hover:bg-youtube-red-hover shadow-youtube hover:shadow-youtube-hover transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Time Range
              </label>
              <Select value={timeRange} onValueChange={setTimeRange} disabled={isLoading}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                Content Type
              </label>
              <Select value={contentType} onValueChange={setContentType} disabled={isLoading}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="shorts">Shorts Only</SelectItem>
                  <SelectItem value="longform">Long-form Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </form>

      {/* Example channels */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground mb-6 font-medium">Try these popular channels:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { handle: '@MrBeast', category: 'Entertainment' },
            { handle: '@PewDiePie', category: 'Gaming' },
            { handle: '@mkbhd', category: 'Tech' },
            { handle: '@veritasium', category: 'Science' },
            { handle: '@theodd1sout', category: 'Animation' }
          ].map(({ handle, category }) => (
            <Button
              key={handle}
              onClick={() => {
                setUrl(`youtube.com/${handle}`);
                setTimeRange('30');
                setContentType('all');
              }}
              variant="outline"
              size="sm"
              className="group rounded-full hover:shadow-md transition-all duration-200"
              disabled={isLoading}
            >
              <Play className="h-3 w-3 text-youtube-red opacity-70 group-hover:opacity-100 mr-2" />
              {handle}
              <span className="text-xs text-muted-foreground ml-1">• {category}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisForm;