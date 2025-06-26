import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const analyses = await prisma.channelAnalysis.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        channelName: true,
        channelHandle: true,
        subscriberCount: true,
        estimatedNiche: true,
        createdAt: true,
      }
    })

    const total = await prisma.channelAnalysis.count({
      where: {
        userId: session.user.id
      }
    })

    return NextResponse.json({
      analyses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching user analyses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}