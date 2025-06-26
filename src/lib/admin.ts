import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getClientIP } from './rate-limiter'

export interface AdminUser {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN'
}

/**
 * Check if the current user has admin privileges
 */
export async function isAdmin(userEmail?: string): Promise<boolean> {
  if (!userEmail) return false
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true }
    })
    
    return user?.role === 'ADMIN'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Get admin user information
 */
export async function getAdminUser(userEmail: string): Promise<AdminUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true, email: true, name: true, role: true }
    })
    
    if (user?.role === 'ADMIN') {
      return user as AdminUser
    }
    
    return null
  } catch (error) {
    console.error('Error fetching admin user:', error)
    return null
  }
}

/**
 * Middleware to check admin access for API routes
 */
export async function requireAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  const adminUser = await getAdminUser(session.user.email)
  if (!adminUser) {
    // Log unauthorized admin access attempt
    await logAdminAction({
      userId: session.user.id || 'unknown',
      userEmail: session.user.email,
      action: 'unauthorized_admin_access_attempt',
      resource: request.nextUrl.pathname,
      details: JSON.stringify({
        userRole: session.user.role || 'unknown',
        attemptedPath: request.nextUrl.pathname
      }),
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      severity: 'warning'
    })
    
    return new Response('Forbidden', { status: 403 })
  }
  
  return { adminUser, session }
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(data: {
  userId: string
  userEmail: string
  action: string
  resource?: string
  details?: string
  ipAddress: string
  userAgent: string
  severity?: 'info' | 'warning' | 'error' | 'critical'
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        userEmail: data.userEmail,
        action: data.action,
        resource: data.resource,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        severity: data.severity || 'info'
      }
    })
  } catch (error) {
    console.error('Failed to log admin action:', error)
    // Don't throw error to avoid breaking the main operation
  }
}

/**
 * List all admin users
 */
export async function listAdminUsers(): Promise<AdminUser[]> {
  try {
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true }
    })
    
    return adminUsers as AdminUser[]
  } catch (error) {
    console.error('Error listing admin users:', error)
    return []
  }
}

/**
 * Promote user to admin role
 */
export async function promoteToAdmin(
  userEmail: string,
  promotedByUserId: string,
  promotedByEmail: string,
  ipAddress: string,
  userAgent: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    if (user.role === 'ADMIN') {
      return true // Already admin
    }
    
    // Update user to admin role
    await prisma.user.update({
      where: { email: userEmail },
      data: { role: 'ADMIN' }
    })
    
    // Log the promotion
    await logAdminAction({
      userId: promotedByUserId,
      userEmail: promotedByEmail,
      action: 'user_promoted_to_admin',
      resource: user.id,
      details: JSON.stringify({
        promotedUserEmail: userEmail,
        promotedUserId: user.id,
        previousRole: user.role
      }),
      ipAddress,
      userAgent,
      severity: 'critical'
    })
    
    return true
  } catch (error) {
    console.error('Error promoting user to admin:', error)
    return false
  }
}

/**
 * Demote admin user to regular user
 */
export async function demoteFromAdmin(
  userEmail: string,
  demotedByUserId: string,
  demotedByEmail: string,
  ipAddress: string,
  userAgent: string,
  newRole: 'FREE_TRIAL' | 'SAAS_SUBSCRIBER' | 'COURSE_MEMBER' = 'FREE_TRIAL'
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })
    
    if (!user) {
      throw new Error('User not found')
    }
    
    if (user.role !== 'ADMIN') {
      return true // Not admin anyway
    }
    
    // Update user role
    await prisma.user.update({
      where: { email: userEmail },
      data: { role: newRole }
    })
    
    // Log the demotion
    await logAdminAction({
      userId: demotedByUserId,
      userEmail: demotedByEmail,
      action: 'user_demoted_from_admin',
      resource: user.id,
      details: JSON.stringify({
        demotedUserEmail: userEmail,
        demotedUserId: user.id,
        previousRole: 'ADMIN',
        newRole: newRole
      }),
      ipAddress,
      userAgent,
      severity: 'critical'
    })
    
    return true
  } catch (error) {
    console.error('Error demoting user from admin:', error)
    return false
  }
}