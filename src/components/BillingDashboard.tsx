'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Check, CreditCard, Crown, Loader2, Zap } from 'lucide-react'
import { SUBSCRIPTION_TIERS, SUBSCRIPTION_PRICES } from '@/lib/stripe'
import { DiscountCodeRedemption } from './DiscountCodeRedemption'

export function BillingDashboard() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string) => {
    setIsLoading(true)
    setSelectedPlan(priceId)

    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start subscription process. Please try again.')
    } finally {
      setIsLoading(false)
      setSelectedPlan(null)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/billing/create-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create portal session')
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open billing portal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session?.user) {
    return null
  }

  const userRole = session.user.role

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {userRole === 'COURSE_MEMBER' && <Crown className="h-5 w-5 text-yellow-500" />}
            {userRole === 'SAAS_SUBSCRIBER' && <Zap className="h-5 w-5 text-blue-500" />}
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={userRole === 'FREE_TRIAL' ? 'secondary' : 'default'}
                  className={
                    userRole === 'COURSE_MEMBER' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                    userRole === 'SAAS_SUBSCRIBER' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
                    ''
                  }
                >
                  {userRole === 'FREE_TRIAL' && 'Free Trial'}
                  {userRole === 'SAAS_SUBSCRIBER' && 'SaaS Subscriber'}
                  {userRole === 'COURSE_MEMBER' && 'Course Member'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {userRole === 'FREE_TRIAL' && 'Limited to 3 total analyses'}
                {userRole === 'SAAS_SUBSCRIBER' && 'Up to 50 analyses per day'}
                {userRole === 'COURSE_MEMBER' && 'Unlimited analyses forever'}
              </p>
            </div>
            {userRole === 'SAAS_SUBSCRIBER' && (
              <Button variant="outline" onClick={handleManageBilling} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                Manage Billing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options - Only show for free trial users */}
      {userRole === 'FREE_TRIAL' && (
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(SUBSCRIPTION_TIERS).map(([priceId, tier]) => (
            <Card key={priceId} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {tier.name}
                  <Badge variant="secondary">
                    ${tier.price}/{tier.interval}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Perfect for {tier.name === 'Basic SaaS' ? 'individual creators' : 'power users and agencies'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Separator />
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(priceId)}
                  disabled={isLoading}
                  variant={priceId === SUBSCRIPTION_PRICES.PRO_MONTHLY ? 'default' : 'outline'}
                >
                  {isLoading && selectedPlan === priceId && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  Subscribe to {tier.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Course Member Info */}
      {userRole === 'COURSE_MEMBER' && (
        <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Course Member Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                Unlimited channel analyses
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                Priority processing queue
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                Access to all premium features
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                Lifetime access - no recurring fees
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Discount Code Option */}
      <Card>
        <CardHeader>
          <CardTitle>Have a Course Discount Code?</CardTitle>
          <CardDescription>
            If you purchased our course, you can redeem your discount code for lifetime access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DiscountCodeRedemption onSuccess={() => window.location.reload()} />
        </CardContent>
      </Card>
    </div>
  )
}