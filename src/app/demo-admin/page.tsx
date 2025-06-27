'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DemoAdminPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">InsightSync Demo Access</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Access Links</CardTitle>
              <CardDescription>Access the tools directly without authentication for testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => router.push('/tools')}
                className="w-full"
                size="lg"
              >
                Go to Tools Page (YouTube Analyzer)
              </Button>
              
              <Button 
                onClick={() => router.push('/analyze')}
                className="w-full"
                variant="secondary"
                size="lg"
              >
                Go to Analyze Page
              </Button>
              
              <Button 
                onClick={() => router.push('/dashboard')}
                className="w-full"
                variant="outline"
                size="lg"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Authentication Issues?</CardTitle>
              <CardDescription>Try these login methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Method 1: Admin Code</h3>
                <p className="text-sm text-muted-foreground mb-2">Go to /auth/signin → Admin tab</p>
                <code className="bg-muted px-2 py-1 rounded">admin123</code>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Method 2: Email Login</h3>
                <p className="text-sm text-muted-foreground mb-2">Go to /auth/signin → Email tab</p>
                <div className="space-y-1">
                  <div><code className="bg-muted px-2 py-1 rounded">Email: admin@beta.test</code></div>
                  <div><code className="bg-muted px-2 py-1 rounded">Password: betaadmin123</code></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}