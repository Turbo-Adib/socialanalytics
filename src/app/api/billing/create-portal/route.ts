import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-utils'
import { createPortalSession } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user?.customerId) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const portalSession = await createPortalSession(
      user.customerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    )

    return NextResponse.json({ 
      url: portalSession.url 
    })
  } catch (error) {
    console.error('Create portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}