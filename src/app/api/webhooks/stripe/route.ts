import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Received Stripe webhook:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Find user by customer ID
  const user = await prisma.user.findFirst({
    where: { customerId }
  })

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Update user with subscription ID and role
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId,
      role: 'SAAS_SUBSCRIBER',
    }
  })

  console.log(`Subscription created for user ${user.id}: ${subscriptionId}`)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const user = await prisma.user.findFirst({
    where: { customerId }
  })

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: subscription.id,
      role: 'SAAS_SUBSCRIBER',
    }
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const user = await prisma.user.findFirst({
    where: { customerId }
  })

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Determine role based on subscription status
  let role: UserRole = 'FREE_TRIAL'
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    role = 'SAAS_SUBSCRIBER'
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: subscription.id,
      role,
    }
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const user = await prisma.user.findFirst({
    where: { customerId }
  })

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Revert to free trial if subscription is cancelled
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: null,
      role: 'FREE_TRIAL',
    }
  })

  console.log(`Subscription cancelled for user ${user.id}`)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string

  console.log(`Payment succeeded for customer ${customerId}, subscription ${subscriptionId}`)

  // Reset daily usage on successful payment
  const user = await prisma.user.findFirst({
    where: { customerId }
  })

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        dailyUsageCount: 0,
        lastUsageReset: new Date(),
      }
    })
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const subscriptionId = (invoice as any).subscription as string

  console.log(`Payment failed for customer ${customerId}, subscription ${subscriptionId}`)

  // TODO: Send email notification about failed payment
  // TODO: Implement grace period before downgrading
}