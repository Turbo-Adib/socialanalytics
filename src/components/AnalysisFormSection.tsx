'use client';

import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, Play, Calendar, Filter, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

interface AnalysisFormSectionProps {
  onAnalyze: (url: string, timeRange: string, contentType: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AnalysisFormSection: React.FC<AnalysisFormSectionProps> = ({ onAnalyze, isLoading, error }) => {
  const [url, setUrl] = useState('');
  const [timeRange, setTimeRange] = useState('30');
  const [contentType, setContentType] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim(), timeRange, contentType);
    }
  };

  const popularChannels = [
    { handle: '@MrBeast', category: 'Entertainment', views: '50B+' },
    { handle: '@PewDiePie', category: 'Gaming', views: '30B+' },
    { handle: '@mkbhd', category: 'Tech', views: '4B+' },
    { handle: '@veritasium', category: 'Science', views: '1B+' },
    { handle: '@airrack', category: 'Lifestyle', views: '800M+' }
  ];

  return (
    <section className="px-4 py-24 bg-card/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-accent-purple/20 text-accent-purple border-accent-purple/30">
            <Sparkles className="h-4 w-4 mr-2" />
            Demo Analysis - Sample Data
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Try Our Analytics Platform
            <span className="block text-youtube-red">With Sample Data</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how our analytics platform works with sample channel data. 
            Sign up for a free account to analyze real YouTube channels.
          </p>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Note:</strong> This shows sample data regardless of the channel URL you enter. 
              Create a free account to get real analytics for any YouTube channel.
            </p>
          </div>
        </div>

        {/* Analysis Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Main Input */}
            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-lg">
              <div className="flex flex-col gap-6">
                {/* URL Input */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-foreground">
                    YouTube Channel URL or Handle
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6 transition-colors group-focus-within:text-youtube-red" />
                    <Input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="e.g., youtube.com/@MrBeast or @MrBeast or channel URL"
                      className="pl-16 text-lg font-medium h-16 text-foreground bg-background border-2 border-border focus:border-youtube-red transition-all duration-200 rounded-xl shadow-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-muted-foreground">
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Analysis Time Range
                    </label>
                    <Select value={timeRange} onValueChange={setTimeRange} disabled={isLoading}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days (Recommended)</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-muted-foreground">
                      <Filter className="inline h-4 w-4 mr-2" />
                      Content Type Focus
                    </label>
                    <Select value={contentType} onValueChange={setContentType} disabled={isLoading}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Content (Recommended)</SelectItem>
                        <SelectItem value="shorts">YouTube Shorts Only</SelectItem>
                        <SelectItem value="longform">Long-form Videos Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="w-full h-16 text-xl font-bold bg-youtube-red hover:bg-youtube-red-hover text-white rounded-xl shadow-youtube hover:shadow-youtube-hover transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin mr-3" />
                      Analyzing Channel...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-3" />
                      Get Free Analysis
                      <Play className="h-6 w-6 ml-3 fill-white" />
                    </>
                  )}
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive" className="mt-6 animate-fade-in">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription className="font-medium text-base">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </form>

          {/* Popular Channels */}
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold text-foreground mb-8">
              Or try analyzing these popular channels:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {popularChannels.map(({ handle, category, views }) => (
                <Button
                  key={handle}
                  onClick={() => {
                    setUrl(`youtube.com/${handle}`);
                    setTimeRange('30');
                    setContentType('all');
                  }}
                  variant="outline"
                  className="group h-auto p-4 rounded-xl hover:shadow-md transition-all duration-200 hover:border-youtube-red/50 bg-card"
                  disabled={isLoading}
                >
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center mb-2">
                      <Play className="h-4 w-4 text-youtube-red opacity-70 group-hover:opacity-100 mr-2 fill-current" />
                      <span className="font-semibold text-foreground">{handle}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{category}</div>
                    <Badge variant="outline" className="text-xs">
                      {views} views
                    </Badge>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>100% Free Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>No Account Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>Used by 10K+ Creators</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisFormSection;