'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Calculator, TrendingUp, BarChart3, Play, Crown, Code2, Sparkles, ArrowRight, Download, Globe, ChevronRight, User, History, HelpCircle, Search, Star, Zap, Shield, DollarSign } from 'lucide-react';
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
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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
  
  // Animation hooks - MUST be called before any conditional returns
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ triggerOnce: true });
  const { ref: toolsRef, isVisible: toolsVisible } = useScrollAnimation({ delay: 200, triggerOnce: true });
  const { ref: analysisRef, isVisible: analysisVisible } = useScrollAnimation({ delay: 400, triggerOnce: true });

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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <nav className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Tools</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Analytics Suite</span>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <History className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent-green" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium leading-none">{session?.user?.name || 'Creator'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session?.user?.role === 'COURSE_MEMBER' ? 'Pro Member' : 'Free Trial'}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-white font-semibold">
                  {session?.user?.name?.[0] || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div ref={headerRef as any} className={`text-center mb-12 transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-green/10 border border-accent-green/20 mb-6">
            <Zap className="h-4 w-4 text-accent-green" />
            <span className="text-sm font-medium text-accent-green">Premium Analytics Suite</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            YouTube Creator Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to analyze, optimize, and grow your YouTube channel with data-driven insights
          </p>
          
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">4.9/5 Creator Rating</span>
            </div>
          </div>
        </div>

        {/* Featured Tool - Channel Analyzer */}
        <div ref={toolsRef as any} className={`mb-12 transition-all duration-700 ${
          toolsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Channel Analyzer</h2>
            <p className="text-muted-foreground text-lg">Analyze any YouTube channel to get comprehensive insights</p>
          </div>
          
          <Card className="border-2 border-youtube-red/20 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-youtube-red/10 to-transparent pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-youtube-red/20">
                  <BarChart3 className="h-8 w-8 text-youtube-red" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold">YouTube Channel Analyzer</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Enter a YouTube channel URL or @handle to get instant analytics
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default">Most Popular</Badge>
                  <Badge variant="outline">Real-time Data</Badge>
                  <Badge variant="outline">AI-Enhanced</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-8">
              <div className="space-y-6">
                {/* Input Section */}
                <div>
                  <label htmlFor="channel-analyzer-input" className="block text-sm font-medium mb-2">
                    Channel URL or Handle
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="channel-analyzer-input"
                      type="text"
                      value={currentUrl}
                      onChange={(e) => setCurrentUrl(e.target.value)}
                      placeholder="e.g., youtube.com/@MrBeast or @MrBeast"
                      className="h-14 pl-12 pr-32 text-base rounded-xl border-2 transition-all focus:border-youtube-red focus:shadow-lg focus:shadow-youtube-red/10"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && currentUrl.trim()) {
                          handleAnalyze(currentUrl.trim());
                        }
                      }}
                    />
                    <Button
                      onClick={() => currentUrl.trim() && handleAnalyze(currentUrl.trim())}
                      disabled={!currentUrl.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-youtube-red hover:bg-youtube-red-hover text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      <Play className="h-4 w-4 mr-2 fill-white" />
                      Analyze
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Supports YouTube channel URLs, @handles, or channel IDs
                  </p>
                </div>

                {/* Example Channels */}
                <div>
                  <p className="text-sm font-medium mb-3">Try these popular channels:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '@MrBeast',
                      '@mkbhd', 
                      '@aliabdaal',
                      '@veritasium',
                      '@LinusTechTips',
                      '@Vox'
                    ].map((handle) => (
                      <Button
                        key={handle}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentUrl(`youtube.com/${handle}`);
                          handleAnalyze(`youtube.com/${handle}`);
                        }}
                        className="hover:bg-youtube-red/10 hover:text-youtube-red hover:border-youtube-red/50"
                      >
                        {handle}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-accent-green mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Growth Analysis</p>
                      <p className="text-xs text-muted-foreground">Track subscriber & view trends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-accent-green mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Revenue Estimates</p>
                      <p className="text-xs text-muted-foreground">Niche-specific RPM calculations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-accent-purple mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">AI Insights</p>
                      <p className="text-xs text-muted-foreground">Smart recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Tools Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Additional Tools</h2>
              <p className="text-muted-foreground">Specialized tools to supercharge your content strategy</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Crown className="h-3 w-3" />
              Pro Tools
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolCard
              icon={Calculator}
              title="RPM Calculator"
              description="Calculate your exact revenue potential with our database of 100+ niche-specific RPM rates. Get accurate estimates based on real creator data."
              badges={[
                { text: "100+ Niches" },
                { text: "Updated Daily" }
              ]}
              color="text-accent-blue"
              bgColor="bg-accent-blue/10"
              onClick={() => setShowRpmCalculator(true)}
              usage={12847}
              category="Revenue Tools"
            />

            <ToolCard
              icon={TrendingUp}
              title="Outlier Analyzer"
              description="Discover what makes your best videos succeed. AI analyzes your top performers to find patterns you can replicate."
              badges={[
                { text: "AI-Powered" },
                { text: "Pattern Detection" }
              ]}
              color="text-accent-purple"
              bgColor="bg-accent-purple/10"
              onClick={() => setShowOutlierAnalyzer(true)}
              usage={8392}
              category="AI Analysis"
            />

            <ToolCard
              icon={Download}
              title="Video Converter"
              description="Convert YouTube, Instagram, and TikTok videos to MP4 or MP3. Perfect for content analysis, reference, and cross-platform sharing."
              badges={[
                { text: "Multi-Platform" },
                { text: "HD Quality" }
              ]}
              color="text-orange-500"
              bgColor="bg-gradient-to-br from-orange-500/10 to-red-500/10"
              onClick={() => setShowDownloader(true)}
              usage={5621}
              category="Content Tools"
              isNew
            />
          </div>
        </div>

        {/* Recent Analyses Section */}
        <div ref={analysisRef as any} className={`transition-all duration-700 ${
          analysisVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Recent Analyses</CardTitle>
                <Button variant="ghost" size="sm">
                  Clear history
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-medium mb-1">No recent analyses yet</p>
                <p className="text-sm">Your channel analysis history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Need help? Check out our <Button variant="link" className="p-0 h-auto text-sm">tutorial videos</Button> or <Button variant="link" className="p-0 h-auto text-sm">documentation</Button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t bg-muted/30">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Tools</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto">Channel Analyzer</Button></li>
                <li><Button variant="link" className="p-0 h-auto">RPM Calculator</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Outlier Analyzer</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Video to MP4/MP3</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto">Documentation</Button></li>
                <li><Button variant="link" className="p-0 h-auto">API Reference</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Tutorials</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Blog</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Button variant="link" className="p-0 h-auto">Help Center</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Contact Us</Button></li>
                <li><Button variant="link" className="p-0 h-auto">System Status</Button></li>
                <li><Button variant="link" className="p-0 h-auto">Feature Requests</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest updates on new tools and features
              </p>
              <Button className="w-full" variant="secondary">
                Join Newsletter
              </Button>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 InsightSync. All rights reserved.</p>
            <div className="flex gap-6">
              <Button variant="link" className="p-0 h-auto text-sm">Privacy Policy</Button>
              <Button variant="link" className="p-0 h-auto text-sm">Terms of Service</Button>
              <Button variant="link" className="p-0 h-auto text-sm">Cookie Policy</Button>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Downloader Modal */}
      <DownloaderModal 
        isOpen={showDownloader} 
        onClose={() => setShowDownloader(false)} 
      />
    </div>
  );
}