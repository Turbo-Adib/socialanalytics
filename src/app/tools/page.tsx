'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calculator, TrendingUp, BarChart3, Play, Crown, Code2, Sparkles, ArrowRight, Download, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import RpmCalculator from '@/components/RpmCalculator';
import OutlierAnalyzer from '@/components/OutlierAnalyzer';
import Dashboard from '@/components/Dashboard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DownloaderModal from '@/components/DownloaderModal';

export default function ToolsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showCodeRedemption, setShowCodeRedemption] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [showRpmCalculator, setShowRpmCalculator] = useState(false);
  const [showOutlierAnalyzer, setShowOutlierAnalyzer] = useState(false);
  const [showDownloader, setShowDownloader] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [loadingStage, setLoadingStage] = useState<'fetching' | 'analyzing' | 'calculating' | 'finalizing'>('fetching');

  // Check if user needs authentication or code redemption
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      // Not authenticated, show code redemption form
      setShowCodeRedemption(true);
    } else if (session.user.role === 'FREE_TRIAL') {
      // Authenticated but not course member, show code redemption
      setShowCodeRedemption(true);
    }
    // If COURSE_MEMBER or SAAS_SUBSCRIBER, show tools directly
  }, [session, status]);

  const handleCodeRedemption = async () => {
    if (!courseCode.trim()) return;
    
    setIsRedeeming(true);
    setRedeemError(null);

    try {
      const response = await fetch('/api/auth/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: courseCode.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid course code');
      }

      // Success - refresh session and hide redemption form
      window.location.reload();
    } catch (err) {
      setRedeemError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setAnalytics(null);
    setCurrentUrl(url);
    setShowRpmCalculator(false);
    setShowOutlierAnalyzer(false);
    setShowDownloader(false);

    try {
      setLoadingStage('fetching');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoadingStage('analyzing');
      
      // Check if user has admin bypass (for testing)
      const isAdminUser = session?.user?.email === 'admin@insightsync.io';
      const headers: HeadersInit = {};
      if (isAdminUser) {
        headers['x-admin-bypass'] = 'ADMIN-MASTER-2025';
      }
      
      const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`, {
        credentials: 'include', // Include cookies for authentication
        headers,
      });
      
      setLoadingStage('calculating');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await response.json();

      if (!response.ok) {
        // Extract more detailed error information
        const errorMessage = data.error || 'Failed to analyze channel';
        const errorDetails = data.details || '';
        const errorHelp = data.help || '';
        
        // Combine error messages for better debugging
        let fullError = errorMessage;
        if (errorDetails) {
          fullError += `. ${errorDetails}`;
        }
        if (errorHelp) {
          fullError += ` ${errorHelp}`;
        }
        
        throw new Error(fullError);
      }

      setLoadingStage('finalizing');
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Use the data directly as it's already in ChannelAnalytics format
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalytics(null);
    setError(null);
    setCurrentUrl('');
    setShowRpmCalculator(false);
    setShowOutlierAnalyzer(false);
  };

  const handleRetry = () => {
    if (currentUrl) {
      handleAnalyze(currentUrl);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <LoadingState 
        stage='fetching' 
        channelName="Loading tools..."
      />
    );
  }

  // Show RPM Calculator
  if (showRpmCalculator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border p-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowRpmCalculator(false)}
            className="mb-2"
          >
            ← Back to Tools
          </Button>
        </div>
        <RpmCalculator onClose={() => setShowRpmCalculator(false)} />
      </div>
    );
  }

  // Show Outlier Analyzer
  if (showOutlierAnalyzer) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border p-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowOutlierAnalyzer(false)}
            className="mb-2"
          >
            ← Back to Tools
          </Button>
        </div>
        <OutlierAnalyzer onClose={() => setShowOutlierAnalyzer(false)} />
      </div>
    );
  }

  // Show Loading State
  if (isLoading) {
    return (
      <LoadingState 
        stage={loadingStage} 
        channelName={currentUrl.includes('@') ? currentUrl.split('@')[1] : undefined}
      />
    );
  }

  // Show Error State
  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        onReset={handleReset}
        channelUrl={currentUrl}
      />
    );
  }

  // Show Analytics Dashboard (using the same Dashboard component as the demo)
  if (analytics) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header onNavigateHome={handleReset} />
        <Dashboard 
          analytics={analytics} 
          onReset={handleReset}
        />
        <Footer />
      </div>
    );
  }

  // Show Course Code Redemption
  if (showCodeRedemption) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-green/10 rounded-full mb-4 mx-auto">
              <Crown className="h-8 w-8 text-accent-green" />
            </div>
            <CardTitle className="text-2xl font-bold">Course Member Access</CardTitle>
            <CardDescription>
              Enter your course code to unlock all premium tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Enter your course code"
                className="text-center text-lg font-mono"
                disabled={isRedeeming}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && courseCode.trim()) {
                    handleCodeRedemption();
                  }
                }}
              />
              {redeemError && (
                <p className="text-sm text-destructive text-center">{redeemError}</p>
              )}
            </div>

            <Button
              onClick={handleCodeRedemption}
              disabled={isRedeeming || !courseCode.trim()}
              className="w-full bg-accent-green hover:bg-accent-green/90 text-white"
            >
              {isRedeeming ? 'Validating...' : 'Unlock Tools'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Don't have a course code?
              </p>
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                View Course Options
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show Tools Dashboard (for authenticated course members)
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-accent-green" />
            <Badge className="px-4 py-2 text-lg font-medium bg-accent-green/20 text-accent-green border-accent-green/30">
              Course Member Tools
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            YouTube Analytics Toolkit
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade analytics tools to maximize your YouTube revenue and growth
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {/* Channel Analyzer */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                onClick={() => {
                  const input = document.getElementById('channel-input') as HTMLInputElement;
                  if (input) input.focus();
                }}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-youtube-red/10 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-youtube-red" />
              </div>
              <CardTitle className="text-xl font-semibold">Channel Analyzer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Comprehensive channel insights with revenue analysis and performance metrics
              </CardDescription>
            </CardContent>
          </Card>

          {/* RPM Calculator */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                onClick={() => setShowRpmCalculator(true)}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-blue/10 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Calculator className="h-8 w-8 text-accent-blue" />
              </div>
              <CardTitle className="text-xl font-semibold">RPM Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Advanced revenue calculator with 100+ niche-specific RPM rates
              </CardDescription>
            </CardContent>
          </Card>

          {/* Outlier Analyzer */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                onClick={() => setShowOutlierAnalyzer(true)}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-purple/10 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-accent-purple" />
              </div>
              <CardTitle className="text-xl font-semibold">Outlier Analyzer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                AI-powered analysis to identify your highest-performing content patterns
              </CardDescription>
            </CardContent>
          </Card>

          {/* Video Downloader */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                onClick={() => setShowDownloader(true)}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform">
                <div className="relative">
                  <Download className="h-8 w-8 text-orange-500" />
                  <Globe className="h-4 w-4 text-red-500 absolute -bottom-1 -right-1" />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold">Video & Audio Downloader</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Download content from YouTube, TikTok, Instagram, and more platforms
              </CardDescription>
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                <Badge variant="secondary" className="text-xs">YouTube</Badge>
                <Badge variant="secondary" className="text-xs">TikTok</Badge>
                <Badge variant="secondary" className="text-xs">Instagram</Badge>
                <Badge variant="secondary" className="text-xs">More</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Channel Analysis */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-youtube-red" />
              Analyze Any Channel
            </CardTitle>
            <CardDescription>
              Enter a YouTube channel URL or handle to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                id="channel-input"
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="e.g., youtube.com/@MrBeast or @MrBeast"
                className="flex-1 h-12 text-lg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && currentUrl.trim()) {
                    handleAnalyze(currentUrl.trim());
                  }
                }}
              />
              <Button
                onClick={() => currentUrl.trim() && handleAnalyze(currentUrl.trim())}
                disabled={!currentUrl.trim()}
                className="bg-youtube-red hover:bg-youtube-red-hover text-white px-8 h-12 rounded-lg font-semibold min-w-[140px]"
              >
                <Play className="h-5 w-5 mr-2 fill-white" />
                Analyze
              </Button>
            </div>

            {/* Popular Channels */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Quick examples:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  '@MrBeast', '@PewDiePie', '@mkbhd', '@veritasium', '@airrack'
                ].map((handle) => (
                  <Button
                    key={handle}
                    onClick={() => {
                      setCurrentUrl(`youtube.com/${handle}`);
                      handleAnalyze(`youtube.com/${handle}`);
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    {handle}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Downloader Modal */}
      <DownloaderModal 
        isOpen={showDownloader} 
        onClose={() => setShowDownloader(false)} 
      />
    </div>
  );
}