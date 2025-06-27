import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Youtube, BarChart3, TrendingUp, Users, Lock } from 'lucide-react'
import Link from 'next/link'

export default async function CoursePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const isCourseMember = session.user.role === UserRole.COURSE_MEMBER

  if (isCourseMember) {
    // Redirect course members to the dashboard
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">YouTube Analytics Mastery</h1>
          <p className="text-xl text-muted-foreground">
            Get exclusive access to our premium analytics tools
          </p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Course Member Benefits</CardTitle>
            <CardDescription>
              Join our Discord community to unlock these exclusive features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Unlimited Channel Analyses</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze as many YouTube channels as you want, whenever you want
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Advanced Analytics Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Access to outlier analysis, revenue projections, and growth insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Discord Community Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Join our exclusive Discord server for course content and support
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your questions answered quickly by our expert team
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="bg-muted rounded-lg p-6 text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-lg mb-2">
                  Join Our Course to Unlock Access
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Purchase our course through LaunchPass to get Discord access
                </p>
                <Button asChild className="w-full sm:w-auto">
                  <a 
                    href="https://your-launchpass-link.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Get Course Access
                  </a>
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Already have Discord access?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline">
                Sign in with Discord
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}