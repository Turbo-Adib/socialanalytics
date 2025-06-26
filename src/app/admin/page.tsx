'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Loader2, Plus, Gift, Users, BarChart3, Shield } from 'lucide-react'
import Link from 'next/link'

interface DiscountCode {
  id: string
  code: string
  email: string | null
  cohort: string | null
  isActive: boolean
  usedBy: string | null
  usedAt: string | null
  createdAt: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [count, setCount] = useState(10)
  const [cohort, setCohort] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      // Check if user is admin
      const adminEmails = ['admin@insightsync.io', 'support@insightsync.io']
      const isAdmin = adminEmails.includes(session.user.email) || 
                     session.user.role === 'SAAS_SUBSCRIBER' ||
                     session.user.email.startsWith('course_admin-')
      
      if (!isAdmin) {
        router.push('/dashboard')
        return
      }
      
      fetchCodes()
    }
  }, [session, status, router])

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/admin/discount-codes')
      if (response.ok) {
        const data = await response.json()
        setCodes(data.codes)
      } else {
        setError('Failed to fetch discount codes')
      }
    } catch (error) {
      console.error('Error fetching codes:', error)
      setError('Failed to fetch discount codes')
    } finally {
      setIsLoading(false)
    }
  }

  const generateCodes = async () => {
    setGenerateLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/admin/discount-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          count,
          cohort: cohort || undefined
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Successfully generated ${count} discount codes`)
        setCount(10)
        setCohort('')
        fetchCodes() // Refresh the list
      } else {
        setError(data.error || 'Failed to generate codes')
      }
    } catch (error) {
      console.error('Error generating codes:', error)
      setError('Failed to generate codes')
    } finally {
      setGenerateLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const adminEmails = ['admin@insightsync.io', 'support@insightsync.io']
  const isAdmin = adminEmails.includes(session.user.email) || 
                 session.user.role === 'SAAS_SUBSCRIBER' ||
                 session.user.email.startsWith('course_admin-')
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeCodes = codes.filter(c => c.isActive && !c.usedBy)
  const usedCodes = codes.filter(c => c.usedBy)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage discount codes and user analytics</p>
        </div>

        <Tabs defaultValue="codes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="codes" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Discount Codes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="codes" className="space-y-6">
            {/* Admin Access Codes */}
            <Card className="border-accent-purple/30 bg-accent-purple/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent-purple">
                  <Shield className="h-5 w-5" />
                  Admin Access Codes
                </CardTitle>
                <CardDescription>
                  Use these codes to access admin tools without email authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-card p-4 rounded-lg border border-accent-purple/20">
                    <p className="text-sm text-muted-foreground mb-2">Master Admin Code:</p>
                    <code className="text-lg font-mono text-accent-purple">ADMIN-MASTER-2025</code>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-accent-purple/20">
                    <p className="text-sm text-muted-foreground mb-2">Bypass Key:</p>
                    <code className="text-lg font-mono text-accent-purple">ADMIN-BYPASS-KEY</code>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Access admin tools directly at <Link href="/auth/signin" className="text-primary hover:underline">/auth/signin</Link> → Admin tab
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Generate New Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Generate Course Codes
                </CardTitle>
                <CardDescription>
                  Create course codes that grant free COURSE_MEMBER access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="count">Number of Codes</Label>
                    <Input
                      id="count"
                      type="number"
                      min="1"
                      max="1000"
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value) || 10)}
                      disabled={generateLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cohort">Cohort (Optional)</Label>
                    <Input
                      id="cohort"
                      placeholder="e.g., batch_january_2025"
                      value={cohort}
                      onChange={(e) => setCohort(e.target.value)}
                      disabled={generateLoading}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={generateCodes}
                      disabled={generateLoading || count < 1}
                      className="w-full"
                    >
                      {generateLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Generate Codes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{codes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeCodes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Used Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{usedCodes.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Codes Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Discount Codes</CardTitle>
                <CardDescription>
                  Latest generated codes and their usage status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Cohort</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Used By</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {codes.slice(0, 20).map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono">{code.code}</TableCell>
                        <TableCell>{code.cohort || '-'}</TableCell>
                        <TableCell>
                          {code.usedBy ? (
                            <Badge variant="secondary">Used</Badge>
                          ) : code.isActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {code.usedBy ? code.usedBy.slice(0, 8) + '...' : '-'}
                        </TableCell>
                        <TableCell>
                          {new Date(code.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  User and usage analytics (Coming Soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard will be available soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}