import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set - Stripe features will be disabled')
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_development_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

// Subscription price IDs - these would come from Stripe dashboard
export const SUBSCRIPTION_PRICES = {
  BASIC_MONTHLY: process.env.STRIPE_BASIC_PRICE_ID || 'price_1234567890', // $19/month
  PRO_MONTHLY: process.env.STRIPE_PRO_PRICE_ID || 'price_0987654321',     // $49/month
} as const

export type PriceId = typeof SUBSCRIPTION_PRICES[keyof typeof SUBSCRIPTION_PRICES]

export const SUBSCRIPTION_TIERS = {
  [SUBSCRIPTION_PRICES.BASIC_MONTHLY]: {
    name: 'Basic SaaS',
    price: 19,
    currency: 'usd',
    interval: 'month',
    features: [
      '25 channel analyses per day',
      'Basic insights and recommendations',
      'Export data to CSV',
      'Email support',
    ],
    limits: {
      dailyAnalyses: 25,
      totalAnalyses: -1, // Unlimited
    }
  },
  [SUBSCRIPTION_PRICES.PRO_MONTHLY]: {
    name: 'Pro SaaS',
    price: 49,
    currency: 'usd',
    interval: 'month',
    features: [
      '50 channel analyses per day',
      'Advanced insights and AI recommendations',
      'Priority email support',
      'Export data to CSV/JSON',
      'API access (coming soon)',
    ],
    limits: {
      dailyAnalyses: 50,
      totalAnalyses: -1, // Unlimited
    }
  }
} as const

export function getPriceDetails(priceId: string) {
  return SUBSCRIPTION_TIERS[priceId as PriceId] || null
}

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'insightsync_app'
    }
  })
}

export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
  discountCode,
}: {
  priceId: string
  customerId: string
  successUrl: string
  cancelUrl: string
  discountCode?: string
}) {
  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      source: 'insightsync_app'
    },
    subscription_data: {
      metadata: {
        source: 'insightsync_app'
      }
    }
  }

  // Add discount if provided
  if (discountCode) {
    try {
      const coupons = await stripe.coupons.list({ limit: 100 })
      const coupon = coupons.data.find(c => c.name === discountCode)
      if (coupon) {
        sessionConfig.discounts = [{ coupon: coupon.id }]
      }
    } catch (error) {
      console.error('Error applying discount code:', error)
      // Continue without discount if there's an error
    }
  }

  return await stripe.checkout.sessions.create(sessionConfig)
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      }
    ],
    proration_behavior: 'create_prorations',
  })
}

// Create a 100% discount coupon for course members
export async function createCourseDiscountCoupon(codeId: string) {
  return await stripe.coupons.create({
    id: codeId,
    name: codeId,
    percent_off: 100,
    duration: 'forever',
    max_redemptions: 1,
    metadata: {
      type: 'course_member_discount',
      source: 'insightsync_course'
    }
  })
}