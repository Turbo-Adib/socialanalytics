'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AnalysisFormSection from '@/components/AnalysisFormSection';
import FeaturesSection from '@/components/FeaturesSection';
import SocialProofSection from '@/components/SocialProofSection';
import PricingSection from '@/components/PricingSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { FloatingDiscordButton } from '@/components/FloatingDiscordButton';

export default function HomePage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [loadingStage, setLoadingStage] = useState<'fetching' | 'analyzing' | 'calculating' | 'finalizing'>('fetching');

  const handleAnalyze = async (url: string, timeRange: string = '30', contentType: string = 'all') => {
    setIsLoading(true);
    setError(null);
    setAnalytics(null);
    setCurrentUrl(url);

    try {
      // Simulate loading stages for better UX
      setLoadingStage('fetching');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoadingStage('analyzing');
      const response = await fetch(`/api/demo?url=${encodeURIComponent(url)}&timeRange=${timeRange}&contentType=${contentType}`);
      
      setLoadingStage('calculating');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze channel');
      }

      setLoadingStage('finalizing');
      await new Promise(resolve => setTimeout(resolve, 200));
      
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
  };

  const handleRetry = () => {
    if (currentUrl) {
      handleAnalyze(currentUrl);
    }
  };

  const scrollToAnalysis = () => {
    const analysisSection = document.getElementById('analysis-section');
    if (analysisSection) {
      analysisSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  // Show Analytics Dashboard (Free Trial Results)
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

  // Show Main Landing/Sales Page
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      
      <main className="animate-fade-in">
        {/* Hero Section */}
        <HeroSection onStartAnalysis={scrollToAnalysis} />
        
        {/* Analysis Form Section */}
        <div id="analysis-section">
          <AnalysisFormSection 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading}
            error={error}
          />
        </div>
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Social Proof Section */}
        <SocialProofSection />
        
        {/* Pricing Section */}
        <PricingSection />
        
        {/* Final CTA Section */}
        <CTASection onStartAnalysis={scrollToAnalysis} />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating Discord Button */}
      <FloatingDiscordButton />
    </div>
  );
}