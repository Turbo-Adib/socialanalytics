import { NextRequest, NextResponse } from 'next/server'
import { getSession, checkUsageLimit } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No active session found'
      })
    }

    const usageCheck = await checkUsageLimit(session.user.id, session.user.email)

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
      usage: {
        allowed: usageCheck.allowed,
        remaining: usageCheck.remaining,
        limit: usageCheck.limit,
        resetAt: usageCheck.resetAt,
      }
    })
  } catch (error) {
    console.error('Test auth error:', error)
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}