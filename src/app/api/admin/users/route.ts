import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction, promoteToAdmin, demoteFromAdmin } from '@/lib/admin'
import { getClientIP } from '@/lib/rate-limiter'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateUserRoleSchema = z.object({
  userEmail: z.string().email(),
  newRole: z.enum(['FREE_TRIAL', 'SAAS_SUBSCRIBER', 'COURSE_MEMBER', 'ADMIN']),
})

// Get users list (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof Response) {
      return adminCheck
    }
    
    const { adminUser } = adminCheck
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const role = searchParams.get('role') // Filter by role
    const search = searchParams.get('search') // Search by email/name
    
    let where: any = {}
    if (role && ['FREE_TRIAL', 'SAAS_SUBSCRIBER', 'COURSE_MEMBER', 'ADMIN'].includes(role)) {
      where.role = role
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        usageCount: true,
        dailyUsageCount: true,
        lastUsageReset: true,
        discountCodeUsed: true,
        subscriptionId: true,
      }
    })
    
    const total = await prisma.user.count({ where })
    
    // Log admin action
    await logAdminAction({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'users_list_viewed',
      resource: 'users',
      details: JSON.stringify({
        filters: { role, search, limit, offset },
        totalUsers: total
      }),
      ipAddress: clientIP,
      userAgent,
      severity: 'info'
    })
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Update user role (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof Response) {
      return adminCheck
    }
    
    const { adminUser } = adminCheck
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    const body = await request.json()
    const { userEmail, newRole } = updateUserRoleSchema.parse(body)
    
    // Prevent admins from demoting themselves
    if (userEmail === adminUser.email && newRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role' },
        { status: 400 }
      )
    }
    
    const targetUser = await prisma.user.findUnique({
      where: { email: userEmail }
    })
    
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const previousRole = targetUser.role
    
    if (newRole === 'ADMIN') {
      // Promote to admin
      const success = await promoteToAdmin(
        userEmail,
        adminUser.id,
        adminUser.email,
        clientIP,
        userAgent
      )
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to promote user to admin' },
          { status: 500 }
        )
      }
    } else if (previousRole === 'ADMIN') {
      // Demote from admin
      const success = await demoteFromAdmin(
        userEmail,
        adminUser.id,
        adminUser.email,
        clientIP,
        userAgent,
        newRole
      )
      
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to demote user from admin' },
          { status: 500 }
        )
      }
    } else {
      // Regular role change
      await prisma.user.update({
        where: { email: userEmail },
        data: { role: newRole }
      })
      
      // Log the role change
      await logAdminAction({
        userId: adminUser.id,
        userEmail: adminUser.email,
        action: 'user_role_changed',
        resource: targetUser.id,
        details: JSON.stringify({
          targetUserEmail: userEmail,
          previousRole,
          newRole
        }),
        ipAddress: clientIP,
        userAgent,
        severity: 'info'
      })
    }
    
    return NextResponse.json({
      message: `User role updated from ${previousRole} to ${newRole}`,
      user: {
        email: userEmail,
        previousRole,
        newRole
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Validation error' },
        { status: 400 }
      )
    }
    
    console.error('Update user role error:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}