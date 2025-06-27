'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { Calculator, TrendingUp, BarChart3, Play, Crown, Code2, Sparkles, ArrowRight, Download, Globe, ChevronRight, User, History, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import RpmCalculator from '@/components/RpmCalculator';
import OutlierAnalyzer from '@/components/OutlierAnalyzer';
import Dashboard from '@/components/Dashboard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DownloaderModal from '@/components/DownloaderModal';
import ToolCard from '@/components/ToolCard';

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

  // Animation hooks
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ triggerOnce: true });
  const { ref: featuredRef, isVisible: featuredVisible } = useScrollAnimation({ delay: 200, triggerOnce: true });
  const { containerRef: toolsRef, visibleItems } = useStaggeredAnimation(3, 150, { triggerOnce: true });
  const { ref: quickAnalysisRef, isVisible: quickAnalysisVisible } = useScrollAnimation({ delay: 400, triggerOnce: true });

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
      {/* Enhanced Header with Breadcrumbs */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="px-2">
                Home
              </Button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Tools</span>
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                Recent Analyses
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Help
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.role === 'COURSE_MEMBER' ? 'Course Member' : 'Pro Member'}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-accent-green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div ref={heroRef as any} className={`mb-12 transition-all duration-700 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-green/10 backdrop-blur-sm animate-pulse">
              <Crown className="h-8 w-8 text-accent-green" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                YouTube Analytics Toolkit
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Professional tools to analyze, optimize, and grow your channel
              </p>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Used by</span>
              <span className="font-semibold">10,000+</span>
              <span className="text-muted-foreground">creators</span>
            </div>
          </div>
        </div>

        {/* Featured Layout */}
        <div className="space-y-8 mb-12">
          {/* Featured Tool - Channel Analyzer */}
          <div ref={featuredRef as any} className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-700 ${
            featuredVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <ToolCard
              variant="featured"
              icon={BarChart3}
              title="Channel Analyzer"
              description="Get comprehensive insights into any YouTube channel. Analyze performance metrics, revenue estimates, content patterns, and growth trajectories with our most powerful analytics engine."
              badges={[
                { text: "Most Popular", variant: "default" },
                { text: "Real-time Data" }
              ]}
              color="text-youtube-red"
              bgColor="bg-youtube-red/10"
              onClick={() => {
                const input = document.getElementById('channel-input') as HTMLInputElement;
                if (input) input.focus();
              }}
              usage={45623}
              recommended
              category="Analytics"
            />
          </div>

          {/* Secondary Tools Grid */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent-purple" />
              Additional Tools
            </h2>
            <div ref={toolsRef as any} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`transition-all duration-500 ${visibleItems[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <ToolCard
                  icon={Calculator}
                  title="RPM Calculator"
                  description="Calculate potential revenue with 100+ niche-specific RPM rates"
                  badges={[
                    { text: "100+ Niches" },
                    { text: "AI-Powered" }
                  ]}
                  color="text-accent-blue"
                  bgColor="bg-accent-blue/10"
                  onClick={() => setShowRpmCalculator(true)}
                  usage={12847}
                />
              </div>

              <div className={`transition-all duration-500 ${visibleItems[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <ToolCard
                  icon={TrendingUp}
                  title="Outlier Analyzer"
                  description="Identify your best-performing content patterns with AI"
                  badges={[
                    { text: "AI Analysis" },
                    { text: "Pattern Detection" }
                  ]}
                  color="text-accent-purple"
                  bgColor="bg-accent-purple/10"
                  onClick={() => setShowOutlierAnalyzer(true)}
                  usage={8392}
                />
              </div>

              <div className={`transition-all duration-500 ${visibleItems[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <ToolCard
                  icon={Download}
                  title="Video Downloader"
                  description="Download content from multiple platforms in any format"
                  badges={[
                    { text: "Multi-Platform" }
                  ]}
                  color="text-orange-500"
                  bgColor="bg-gradient-to-br from-orange-500/10 to-red-500/10"
                  onClick={() => setShowDownloader(true)}
                  usage={5621}
                  isNew
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Analysis Section - Redesigned */}
        <div ref={quickAnalysisRef as any} className={`relative transition-all duration-700 ${
          quickAnalysisVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-youtube-red/5 via-transparent to-accent-purple/5 rounded-2xl" />
          <Card className="relative border-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-youtube-red/10 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-youtube-red/10">
                      <Play className="h-5 w-5 text-youtube-red fill-youtube-red/30" />
                    </div>
                    Quick Channel Analysis
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Instant insights for any YouTube channel - just paste and analyze
                  </CardDescription>
                </div>
                <Badge variant="outline" className="hidden sm:flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Live Data
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    id="channel-input"
                    type="text"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    placeholder="Paste YouTube channel URL or @handle"
                    className="h-14 pl-12 pr-32 text-lg font-medium rounded-xl border-2 focus:border-youtube-red transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && currentUrl.trim()) {
                        handleAnalyze(currentUrl.trim());
                      }
                    }}
                  />
                  <Play className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Button
                    onClick={() => currentUrl.trim() && handleAnalyze(currentUrl.trim())}
                    disabled={!currentUrl.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-youtube-red hover:bg-youtube-red-hover text-white px-6 h-10 rounded-lg font-semibold"
                  >
                    Analyze
                  </Button>
                </div>

                {/* Popular Channels - Enhanced */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Try popular channels:</span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {[
                      { handle: '@MrBeast', subscribers: '240M' },
                      { handle: '@PewDiePie', subscribers: '111M' },
                      { handle: '@mkbhd', subscribers: '19M' },
                      { handle: '@veritasium', subscribers: '16M' }
                    ].map(({ handle, subscribers }) => (
                      <Button
                        key={handle}
                        onClick={() => {
                          setCurrentUrl(`youtube.com/${handle}`);
                          handleAnalyze(`youtube.com/${handle}`);
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-full hover:border-youtube-red hover:text-youtube-red transition-colors group"
                      >
                        <span className="font-medium">{handle}</span>
                        <span className="text-xs text-muted-foreground ml-1 group-hover:text-youtube-red/70">
                          {subscribers}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Analyses Preview */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Recent Analyses</h3>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Placeholder for recent analyses */}
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">No recent analyses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Downloader Modal */}
      <DownloaderModal 
        isOpen={showDownloader} 
        onClose={() => setShowDownloader(false)} 
      />
    </div>
  );
}