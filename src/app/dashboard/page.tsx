'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header'
import RpmCalculator from '@/components/RpmCalculator'
import OutlierAnalyzer from '@/components/OutlierAnalyzer'
import { Loader2, LogOut, User, Crown, Zap, History, BarChart3, Calculator, TrendingUp, Play, Sparkles } from 'lucide-react'

interface AnalysisRecord {
  id: string
  channelName: string
  channelHandle: string | null
  subscriberCount: number
  estimatedNiche: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([])
  const [analysesLoading, setAnalysesLoading] = useState(true)
  const [showRpmCalculator, setShowRpmCalculator] = useState(false)
  const [showOutlierAnalyzer, setShowOutlierAnalyzer] = useState(false)
  const [currentUrl, setCurrentUrl] = useState<string>('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.role === 'COURSE_MEMBER') {
      // Course members should use the tools page instead
      router.push('/tools')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user) {
      fetchAnalyses()
    }
  }, [session])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/user/analyses?limit=5')
      if (response.ok) {
        const data = await response.json()
        setAnalyses(data.analyses)
      }
    } catch (error) {
      console.error('Failed to fetch analyses:', error)
    } finally {
      setAnalysesLoading(false)
    }
  }

  const handleReset = () => {
    setCurrentUrl('')
    setShowRpmCalculator(false)
    setShowOutlierAnalyzer(false)
  }

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

  // Show Outlier Analyzer
  if (showOutlierAnalyzer) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header 
          onShowRpmCalculator={() => {
            setShowRpmCalculator(true)
            setShowOutlierAnalyzer(false)
          }}
          onShowOutlierAnalyzer={() => setShowOutlierAnalyzer(true)}
          onNavigateHome={handleReset}
          showAuth={true}
        />
        <OutlierAnalyzer onClose={() => setShowOutlierAnalyzer(false)} />
      </div>
    )
  }

  // Show RPM Calculator
  if (showRpmCalculator) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <Header 
          onShowRpmCalculator={() => setShowRpmCalculator(true)}
          onShowOutlierAnalyzer={() => {
            setShowOutlierAnalyzer(true)
            setShowRpmCalculator(false)
          }}
          onNavigateHome={handleReset}
          showAuth={true}
        />
        <RpmCalculator onClose={() => setShowRpmCalculator(false)} />
      </div>
    )
  }


  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'COURSE_MEMBER':
        return <Crown className="h-4 w-4" />
      case 'SAAS_SUBSCRIBER':
        return <Zap className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'COURSE_MEMBER':
        return 'bg-gradient-to-r from-accent-green to-accent-green/80'
      case 'SAAS_SUBSCRIBER':
        return 'bg-gradient-to-r from-accent-blue to-accent-purple'
      default:
        return 'bg-gradient-to-r from-muted-foreground to-muted-foreground/80'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'COURSE_MEMBER':
        return 'Course Member'
      case 'SAAS_SUBSCRIBER':
        return 'SaaS Subscriber'
      default:
        return 'Free Trial'
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header 
        onShowRpmCalculator={() => setShowRpmCalculator(true)}
        onShowOutlierAnalyzer={() => setShowOutlierAnalyzer(true)}
        onNavigateHome={handleReset}
        showAuth={true}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            {getRoleIcon(session.user.role)}
            <Badge className={`px-4 py-2 text-lg font-medium ${getRoleColor(session.user.role)} text-white`}>
              {getRoleLabel(session.user.role)}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Welcome back, {session.user.name}</h1>
          <p className="text-xl text-muted-foreground">
            {session.user.role === 'COURSE_MEMBER' 
              ? 'You have unlimited access to all premium tools and features.' 
              : session.user.role === 'SAAS_SUBSCRIBER'
              ? 'Enjoy your SaaS subscription with advanced analytics.'
              : 'Start with your free trial - 3 analyses remaining.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" 
                onClick={() => {
                  const input = document.getElementById('channel-input') as HTMLInputElement
                  if (input) input.focus()
                }}>
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-youtube-red/10 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-youtube-red" />
              </div>
              <CardTitle className="text-xl font-semibold">Analyze Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get comprehensive insights on any YouTube channel's performance and revenue potential.
              </CardDescription>
            </CardContent>
          </Card>

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
                Calculate revenue potential with niche-specific RPM rates and projections.
              </CardDescription>
            </CardContent>
          </Card>

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
                Discover content patterns from high-performing videos with AI analysis.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Channel Analysis */}
        <Card className="max-w-4xl mx-auto mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-youtube-red" />
              Quick Channel Analysis
            </CardTitle>
            <CardDescription>
              Enter any YouTube channel URL or handle to get started
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
              />
              <Button
                onClick={() => {
                  if (currentUrl.trim()) {
                    router.push(`/analyze?url=${encodeURIComponent(currentUrl.trim())}`)
                  } else {
                    router.push('/analyze')
                  }
                }}
                disabled={!currentUrl.trim()}
                className="bg-youtube-red hover:bg-youtube-red-hover text-white px-8 h-12 rounded-lg font-semibold min-w-[140px]"
              >
                <Play className="h-5 w-5 mr-2 fill-white" />
                Analyze
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Or try these popular channels:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['@MrBeast', '@PewDiePie', '@mkbhd', '@veritasium', '@airrack'].map((handle) => (
                  <Button
                    key={handle}
                    onClick={() => {
                      router.push(`/analyze?url=${encodeURIComponent(`youtube.com/${handle}`)}`)
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <Badge className={`${getRoleColor(session.user.role)} text-white`}>
                  <span className="flex items-center gap-1">
                    {getRoleIcon(session.user.role)}
                    {getRoleLabel(session.user.role)}
                  </span>
                </Badge>
              </div>
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Stats</CardTitle>
              <CardDescription>
                Your current usage and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Analyses Today</span>
                  <span className="text-sm font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Limit</span>
                  <span className="text-sm font-medium">
                    {session.user.role === 'COURSE_MEMBER' ? 'Unlimited' : 
                     session.user.role === 'SAAS_SUBSCRIBER' ? '50' : '3'}
                  </span>
                </div>
                {session.user.role === 'COURSE_MEMBER' && (
                  <div className="pt-2">
                    <Badge className="bg-accent-green/20 text-accent-green">
                      🏆 Lifetime Access
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Premium Tools</CardTitle>
              <CardDescription>
                Access all your analytics tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline"
                className="w-full justify-start" 
                onClick={() => setShowRpmCalculator(true)}
              >
                <Calculator className="h-4 w-4 mr-2" />
                RPM Calculator
              </Button>
              <Button 
                variant="outline"
                className="w-full justify-start" 
                onClick={() => setShowOutlierAnalyzer(true)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Outlier Analyzer
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Analyses
              </CardTitle>
              <CardDescription>
                Your recently analyzed channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : analyses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No analyses yet</p>
                  <p className="text-sm">Start by analyzing your first YouTube channel</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{analysis.channelName}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{analysis.subscriberCount.toLocaleString()} subscribers</span>
                          <Badge variant="secondary">{analysis.estimatedNiche}</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {session.user.role === 'FREE_TRIAL' && (
          <Card className="mt-6 border-youtube-red/30 bg-youtube-red/5">
            <CardHeader>
              <CardTitle className="text-youtube-red flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Upgrade Your Account
              </CardTitle>
              <CardDescription>
                You're currently on a free trial. Upgrade to unlock unlimited analyses and premium features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="bg-youtube-red hover:bg-youtube-red-hover"
                  onClick={() => router.push('/landing#pricing')}
                >
                  View Pricing Plans
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/billing')}
                >
                  Have a Course Code?
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {session.user.role === 'COURSE_MEMBER' && (
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-8">Your Course Member Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Unlimited Analyses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green mb-2">100%</div>
                <div className="text-sm text-muted-foreground">All Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Priority Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-green mb-2">🏆</div>
                <div className="text-sm text-muted-foreground">Lifetime Access</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}