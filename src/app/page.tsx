'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AnalysisForm from '@/components/AnalysisForm';
import MinimalDashboard from '@/components/MinimalDashboard';
import TailwindTest from '@/components/TailwindTest';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import RpmCalculator from '@/components/RpmCalculator';
import OutlierAnalyzer from '@/components/OutlierAnalyzer';

export default function HomePage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [showRpmCalculator, setShowRpmCalculator] = useState(false);
  const [showOutlierAnalyzer, setShowOutlierAnalyzer] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'fetching' | 'analyzing' | 'calculating' | 'finalizing'>('fetching');

  const handleAnalyze = async (url: string, timeRange: string = '30', contentType: string = 'all') => {
    setIsLoading(true);
    setError(null);
    setAnalytics(null);
    setCurrentUrl(url);
    setShowRpmCalculator(false);
    setShowOutlierAnalyzer(false);

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
    setShowRpmCalculator(false);
    setShowOutlierAnalyzer(false);
  };

  const handleRetry = () => {
    if (currentUrl) {
      handleAnalyze(currentUrl);
    }
  };

  // Show Outlier Analyzer
  if (showOutlierAnalyzer) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header 
          onShowRpmCalculator={() => {
            setShowRpmCalculator(true);
            setShowOutlierAnalyzer(false);
          }}
          onShowOutlierAnalyzer={() => setShowOutlierAnalyzer(true)}
          onNavigateHome={handleReset}
        />
        <OutlierAnalyzer onClose={() => setShowOutlierAnalyzer(false)} />
      </div>
    );
  }

  // Show RPM Calculator
  if (showRpmCalculator) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header 
          onShowRpmCalculator={() => setShowRpmCalculator(true)}
          onShowOutlierAnalyzer={() => {
            setShowOutlierAnalyzer(true);
            setShowRpmCalculator(false);
          }}
          onNavigateHome={handleReset}
        />
        <RpmCalculator onClose={() => setShowRpmCalculator(false)} />
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

  // Show Analytics Dashboard
  if (analytics) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header 
          onShowRpmCalculator={() => {
            setShowRpmCalculator(true);
            setShowOutlierAnalyzer(false);
          }}
          onShowOutlierAnalyzer={() => {
            setShowOutlierAnalyzer(true);
            setShowRpmCalculator(false);
          }}
          onNavigateHome={handleReset}
        />
        <MinimalDashboard 
          analytics={analytics} 
          onReset={handleReset}
        />
      </div>
    );
  }

  // Show Main Landing Page
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header 
        onShowRpmCalculator={() => {
          setShowRpmCalculator(true);
          setShowOutlierAnalyzer(false);
        }}
        onShowOutlierAnalyzer={() => {
          setShowOutlierAnalyzer(true);
          setShowRpmCalculator(false);
        }}
        onNavigateHome={handleReset}
      />
      
      <main className="flex-grow flex flex-col justify-center items-center px-4 py-16 animate-fade-in">
        <AnalysisForm 
          onAnalyze={handleAnalyze} 
          isLoading={isLoading}
          error={error}
        />
        <div className="mt-16">
          <TailwindTest />
        </div>
      </main>
    </div>
  );
}