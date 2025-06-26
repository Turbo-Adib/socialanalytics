import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-utils'
import { stripe, createCustomer, createCheckoutSession, SUBSCRIPTION_PRICES } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createCheckoutSchema = z.object({
  priceId: z.enum([SUBSCRIPTION_PRICES.BASIC_MONTHLY, SUBSCRIPTION_PRICES.PRO_MONTHLY]),
  discountCode: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { priceId, discountCode } = createCheckoutSchema.parse(body)

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let customerId = user.customerId

    if (!customerId) {
      // Create Stripe customer
      const customer = await createCustomer(user.email, user.name || undefined)
      customerId = customer.id

      // Update user with customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { customerId }
      })
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      priceId,
      customerId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?cancelled=true`,
      discountCode,
    })

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    console.error('Create checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}