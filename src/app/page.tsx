'use client';

import { useState } from 'react';
import Header from '@/src/components/Header';
import AnalysisForm from '@/src/components/AnalysisForm';
import Dashboard from '@/src/components/Dashboard';
import TailwindTest from '@/src/components/TailwindTest';
import { ChannelAnalytics } from '@/src/types/youtube';

export default function HomePage() {
  const [analytics, setAnalytics] = useState<ChannelAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setAnalytics(null);

    try {
      const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze channel');
      }

      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {!analytics && (
        <main className="flex-grow flex flex-col justify-center items-center px-4 py-16">
          <div className="mb-8">
            <TailwindTest />
          </div>
          <AnalysisForm 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading}
            error={error}
          />
        </main>
      )}

      {analytics && (
        <Dashboard 
          analytics={analytics} 
          onReset={() => setAnalytics(null)}
        />
      )}
    </div>
  );
}