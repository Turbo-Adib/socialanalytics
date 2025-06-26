import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { getClientIP } from '@/lib/rate-limiter'
import { z } from 'zod'
import { nanoid } from 'nanoid'

const createCodesSchema = z.object({
  count: z.number().min(1).max(1000),
  cohort: z.string().optional(),
  email: z.string().email().optional(),
})

const redeemCodeSchema = z.object({
  code: z.string().min(1),
})

// Admin endpoint to generate discount codes
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof Response) {
      return adminCheck // Return error response
    }
    
    const { adminUser } = adminCheck
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const body = await request.json()
    const { count, cohort, email } = createCodesSchema.parse(body)

    const codes = []
    const createdCodes = []

    // Generate unique codes
    for (let i = 0; i < count; i++) {
      let code: string
      let isUnique = false

      // Ensure code is unique
      while (!isUnique) {
        code = `COURSE_${nanoid(8).toUpperCase()}`
        const existing = await prisma.discountCode.findUnique({
          where: { code }
        })
        if (!existing) {
          isUnique = true
          codes.push(code)
        }
      }
    }

    // Create codes in database
    for (const code of codes) {
      const discountCode = await prisma.discountCode.create({
        data: {
          code,
          email,
          cohort: cohort || `batch_${new Date().toISOString().split('T')[0]}`,
          isActive: true,
        }
      })
      createdCodes.push(discountCode)
    }

    // Log the admin action
    await logAdminAction({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'discount_codes_generated',
      resource: 'discount_codes',
      details: JSON.stringify({
        count,
        cohort: cohort || `batch_${new Date().toISOString().split('T')[0]}`,
        email,
        generatedCodes: createdCodes.map(c => c.code)
      }),
      ipAddress: clientIP,
      userAgent,
      severity: 'info'
    })

    return NextResponse.json({
      message: `Generated ${count} discount codes`,
      codes: createdCodes.map(c => ({
        id: c.id,
        code: c.code,
        cohort: c.cohort,
        email: c.email,
        createdAt: c.createdAt,
      }))
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    console.error('Generate discount codes error:', error)
    return NextResponse.json(
      { error: 'Failed to generate discount codes' },
      { status: 500 }
    )
  }
}

// Get all discount codes (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof Response) {
      return adminCheck // Return error response
    }
    
    const { adminUser } = adminCheck
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') // 'active', 'used', 'all'

    let where = {}
    if (status === 'active') {
      where = { isActive: true, usedBy: null }
    } else if (status === 'used') {
      where = { usedBy: { not: null } }
    }

    const codes = await prisma.discountCode.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        code: true,
        email: true,
        cohort: true,
        isActive: true,
        usedBy: true,
        usedAt: true,
        createdAt: true,
      }
    })

    const total = await prisma.discountCode.count({ where })

    // Log admin action for viewing codes
    await logAdminAction({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'discount_codes_viewed',
      resource: 'discount_codes',
      details: JSON.stringify({
        filters: { status, limit, offset },
        totalCodes: total
      }),
      ipAddress: clientIP,
      userAgent,
      severity: 'info'
    })

    return NextResponse.json({
      codes,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Get discount codes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch discount codes' },
      { status: 500 }
    )
  }
}