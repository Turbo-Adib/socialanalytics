import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-utils'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const redeemCodeSchema = z.object({
  code: z.string().min(1, 'Discount code is required'),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = redeemCodeSchema.parse(body)

    // Check if user already redeemed a code
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (user?.role === 'COURSE_MEMBER') {
      return NextResponse.json({ 
        error: 'You already have course member access' 
      }, { status: 400 })
    }

    if (user?.discountCodeUsed) {
      return NextResponse.json({ 
        error: 'You have already redeemed a discount code' 
      }, { status: 400 })
    }

    // Find and validate the discount code
    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!discountCode) {
      return NextResponse.json({ 
        error: 'Invalid discount code' 
      }, { status: 404 })
    }

    if (!discountCode.isActive) {
      return NextResponse.json({ 
        error: 'This discount code has been deactivated' 
      }, { status: 400 })
    }

    if (discountCode.usedBy) {
      return NextResponse.json({ 
        error: 'This discount code has already been used' 
      }, { status: 400 })
    }

    // Check if code is restricted to specific email
    if (discountCode.email && discountCode.email !== session.user.email) {
      return NextResponse.json({ 
        error: 'This discount code is not valid for your email address' 
      }, { status: 400 })
    }

    // Redeem the code - mark as used and upgrade user
    await prisma.$transaction(async (tx) => {
      // Mark discount code as used
      await tx.discountCode.update({
        where: { id: discountCode.id },
        data: {
          usedBy: session.user.id,
          usedAt: new Date(),
        }
      })

      // Upgrade user to course member
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          role: 'COURSE_MEMBER',
          discountCodeUsed: discountCode.code,
        }
      })
    })

    return NextResponse.json({
      message: 'Discount code redeemed successfully! You now have lifetime course member access.',
      newRole: 'COURSE_MEMBER',
      codeUsed: discountCode.code,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }

    console.error('Redeem discount code error:', error)
    return NextResponse.json(
      { error: 'Failed to redeem discount code' },
      { status: 500 }
    )
  }
}