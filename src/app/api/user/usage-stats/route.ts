import { NextRequest, NextResponse } from 'next/server'
import { getSession, getUserUsageStats, checkUsageLimit } from '@/lib/auth-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const usageStats = await getUserUsageStats(session.user.id, session.user.email)
    const usageLimit = await checkUsageLimit(session.user.id, session.user.email)

    return NextResponse.json({
      role: session.user.role,
      usageCount: usageStats.usageCount,
      dailyUsageCount: usageStats.dailyUsageCount,
      lastUsageReset: usageStats.lastUsageReset,
      allowed: usageLimit.allowed,
      remaining: usageLimit.remaining,
      limit: usageLimit.limit,
      resetAt: usageLimit.resetAt,
    })
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}