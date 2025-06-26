'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Crown, Gift } from 'lucide-react'

interface DiscountCodeRedemptionProps {
  onSuccess?: () => void
}

export function DiscountCodeRedemption({ onSuccess }: DiscountCodeRedemptionProps) {
  const { data: session, update } = useSession()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim()) {
      setError('Please enter a discount code')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/billing/redeem-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setCode('')
        
        // Update the session to reflect the new role
        await update()
        
        // Close dialog after successful redemption
        setTimeout(() => {
          setIsOpen(false)
          onSuccess?.()
        }, 2000)
      } else {
        setError(data.error || 'Failed to redeem code')
      }
    } catch (error) {
      console.error('Redemption error:', error)
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (session?.user.role === 'COURSE_MEMBER') {
    return (
      <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Course Member Access Active
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300">
            You already have lifetime course member access with unlimited features.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Redeem Course Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Redeem Course Discount Code
          </DialogTitle>
          <DialogDescription>
            Enter the discount code you received with your course purchase to unlock lifetime access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleRedeem} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
              <Crown className="h-4 w-4" />
              <AlertDescription className="font-medium">{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="discount-code">Discount Code</Label>
            <Input
              id="discount-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="COURSE_XXXXXXXX"
              disabled={isLoading}
              className="font-mono"
            />
          </div>

          <div className="bg-muted p-3 rounded-lg text-sm">
            <h4 className="font-medium mb-2">What you'll get:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Unlimited channel analyses forever</li>
              <li>• Priority processing queue</li>
              <li>• Access to all premium features</li>
              <li>• No monthly fees - lifetime access</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !code.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Redeeming...
                </>
              ) : (
                'Redeem Code'
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>
            <strong>Need help?</strong> If you purchased our course but don't have a code, 
            please contact support with your purchase confirmation.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}