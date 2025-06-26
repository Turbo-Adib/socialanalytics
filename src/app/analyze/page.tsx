'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import AnalysisForm from '@/components/AnalysisForm'
import Dashboard from '@/components/Dashboard'
import LoadingState from '@/components/LoadingState'
import ErrorState from '@/components/ErrorState'
import OutlierAnalyzer from '@/components/OutlierAnalyzer'
import IntelligentInsights from '@/components/IntelligentInsights'

export default function AnalyzePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [loadingStage, setLoadingStage] = useState<'fetching' | 'analyzing' | 'calculating' | 'finalizing'>('fetching')
  const [usageStats, setUsageStats] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user) {
      fetchUsageStats()
    }
  }, [status, session, router])

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/user/usage-stats')
      if (response.ok) {
        const data = await response.json()
        setUsageStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
    }
  }

  const handleAnalyze = async (url: string, timeRange: string = '30', contentType: string = 'all') => {
    setIsLoading(true)
    setError(null)
    setAnalytics(null)
    setCurrentUrl(url)

    try {
      setLoadingStage('fetching')
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setLoadingStage('analyzing')
      
      // Use the authenticated analyze endpoint
      const response = await fetch(`/api/analyze?url=${encodeURIComponent(url)}&timeRange=${timeRange}&contentType=${contentType}`)
      
      setLoadingStage('calculating')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to analyze channels')
        } else if (response.status === 429) {
          throw new Error(`Usage limit exceeded. ${data.remaining || 0} analyses remaining. ${data.role === 'FREE_TRIAL' ? 'Upgrade to continue.' : 'Limit resets tomorrow.'}`)
        } else {
          throw new Error(data.error || 'Failed to analyze channel')
        }
      }

      setLoadingStage('finalizing')
      await new Promise(resolve => setTimeout(resolve, 200))
      
      setAnalytics(data)
      
      // Refresh usage stats after successful analysis
      fetchUsageStats()
      
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setAnalytics(null)
    setError(null)
    setCurrentUrl('')
  }

  const handleRetry = () => {
    if (currentUrl) {
      handleAnalyze(currentUrl)
    }
  }

  // Handle URL parameter for pre-filled analysis
  useEffect(() => {
    if (session?.user) {
      const urlParams = new URLSearchParams(window.location.search)
      const urlParam = urlParams.get('url')
      if (urlParam) {
        const decodedUrl = decodeURIComponent(urlParam)
        setCurrentUrl(decodedUrl)
        // Auto-start analysis if URL is provided
        handleAnalyze(decodedUrl)
      }
    }
  }, [session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Show Loading State
  if (isLoading) {
    return (
      <LoadingState 
        stage={loadingStage} 
        channelName={currentUrl.includes('@') ? currentUrl.split('@')[1] : undefined}
      />
    )
  }

  // Show Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <ErrorState 
            error={error}
            onRetry={handleRetry}
            onReset={handleReset}
            channelUrl={currentUrl}
          />
        </div>
      </div>
    )
  }

  // Show Analytics Results
  if (analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              New Analysis
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {usageStats && (
                <span>
                  {session.user.role === 'COURSE_MEMBER' ? 'Unlimited' : 
                   `${usageStats.remaining}/${usageStats.limit} analyses remaining`}
                </span>
              )}
            </div>
          </div>

          <Dashboard analytics={analytics} onReset={handleReset} />

          {/* Advanced Analysis Tools for Premium Users */}
          {(session.user.role === 'SAAS_SUBSCRIBER' || session.user.role === 'COURSE_MEMBER') && (
            <div className="mt-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analysis Tools</CardTitle>
                  <CardDescription>
                    Premium insights and outlier analysis for power users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <OutlierAnalyzer />
                  
                  <IntelligentInsights 
                    channelId={analytics.channel.id}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show Analysis Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {usageStats && (
              <span>
                {session.user.role === 'COURSE_MEMBER' ? 'Unlimited' : 
                 `${usageStats.remaining}/${usageStats.limit} analyses remaining`}
              </span>
            )}
          </div>
        </div>

        {/* Usage Limit Warning for Free Trial */}
        {session.user.role === 'FREE_TRIAL' && usageStats?.remaining <= 1 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              {usageStats.remaining === 0 ? 
                'You have used all your free analyses. Upgrade to continue analyzing channels.' :
                `Only ${usageStats.remaining} analysis remaining on your free trial. Upgrade for unlimited access.`
              }
            </AlertDescription>
          </Alert>
        )}

        <AnalysisForm 
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}