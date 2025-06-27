'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Shield, Mail, Key } from 'lucide-react'
import { DiscordLoginButton } from '@/components/DiscordLoginButton'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Refresh session to get updated user data
        await getSession()
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        adminCode,
        email: 'admin@insightsync.io', // Required by NextAuth
        password: 'admin', // Dummy password, ignored when adminCode is present
        redirect: false
      })

      if (result?.error) {
        setError('Invalid admin code')
      } else {
        // Refresh session to get updated user data
        await getSession()
        router.push('/tools')
        router.refresh()
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your InsightSync account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Course Members
                </span>
              </div>
            </div>
            <div className="mt-4">
              <DiscordLoginButton 
                text="Sign in with Discord" 
                className="w-full"
              />
              <p className="text-center text-xs text-muted-foreground mt-2">
                For course members with Discord access
              </p>
            </div>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <Shield className="h-12 w-12 mx-auto text-accent-purple mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Enter your admin access code
                  </p>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="adminCode">Admin Code</Label>
                  <Input
                    id="adminCode"
                    type="text"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="ADMIN-XXXX-XXXX"
                    className="text-center font-mono text-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-accent-purple hover:bg-accent-purple/90"
                  disabled={isLoading || !adminCode.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Access Admin Tools
                    </>
                  )}
                </Button>
                
                <div className="text-center text-xs text-muted-foreground">
                  Admin codes are provided to authorized personnel only
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}