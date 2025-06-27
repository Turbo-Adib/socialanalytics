import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'
import { UserRole } from '@prisma/client'
import { prisma } from './db'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    redirect('/auth/signin')
  }
  return session
}

export async function requireRole(requiredRole: UserRole | UserRole[]) {
  const session = await requireAuth()
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  
  if (!roles.includes(session.user.role)) {
    redirect('/dashboard?error=insufficient_permissions')
  }
  
  return session
}

export async function getUserUsageStats(userId: string, email?: string) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      usageCount: true,
      dailyUsageCount: true,
      lastUsageReset: true,
      role: true,
    }
  })

  // If user doesn't exist in database but exists in session, create them
  if (!user && email) {
    await prisma.user.create({
      data: {
        id: userId,
        email: email,
        role: 'SAAS_SUBSCRIBER', // Default role for existing sessions
        usageCount: 0,
        dailyUsageCount: 0,
        lastUsageReset: new Date(),
      }
    })
    
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        usageCount: true,
        dailyUsageCount: true,
        lastUsageReset: true,
        role: true,
      }
    })
  }

  if (!user) throw new Error('User not found')

  // Reset daily usage if last reset was more than 24 hours ago
  const now = new Date()
  const lastReset = new Date(user.lastUsageReset)
  const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)

  if (hoursSinceReset >= 24) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyUsageCount: 0,
        lastUsageReset: now,
      }
    })
    user.dailyUsageCount = 0
  }

  return user
}

export async function checkUsageLimit(userId: string, email?: string): Promise<{ 
  allowed: boolean; 
  remaining: number; 
  limit: number; 
  resetAt: Date;
}> {
  const user = await getUserUsageStats(userId, email)
  
  const limits = {
    FREE_TRIAL: 3, // Total lifetime limit
    SAAS_SUBSCRIBER: 50, // Daily limit
    COURSE_MEMBER: -1, // Unlimited
    ADMIN: -1, // Unlimited
  }

  const limit = limits[user.role]
  
  if (limit === -1) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
  }

  const currentUsage = user.role === 'FREE_TRIAL' ? user.usageCount : user.dailyUsageCount
  const allowed = currentUsage < limit
  const remaining = Math.max(0, limit - currentUsage)
  
  // Reset time is tomorrow for daily limits, never for lifetime limits
  const resetAt = user.role === 'FREE_TRIAL' 
    ? new Date('2099-12-31') // Never resets for free trial
    : new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow for paid users

  return {
    allowed,
    remaining,
    limit,
    resetAt,
  }
}

export async function incrementUsage(userId: string, email?: string) {
  const user = await getUserUsageStats(userId, email)
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      usageCount: user.usageCount + 1,
      dailyUsageCount: user.dailyUsageCount + 1,
    }
  })
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'FREE_TRIAL':
      return 'Free Trial'
    case 'SAAS_SUBSCRIBER':
      return 'SaaS Subscriber'
    case 'COURSE_MEMBER':
      return 'Course Member'
    default:
      return 'Unknown'
  }
}

export function getRolePermissions(role: UserRole) {
  switch (role) {
    case 'FREE_TRIAL':
      return {
        analysesPerDay: 0, // Lifetime limit, not daily
        totalAnalyses: 3,
        exportData: false,
        advancedFeatures: false,
        prioritySupport: false,
      }
    case 'SAAS_SUBSCRIBER':
      return {
        analysesPerDay: 50,
        totalAnalyses: -1, // Unlimited
        exportData: true,
        advancedFeatures: true,
        prioritySupport: true,
      }
    case 'COURSE_MEMBER':
      return {
        analysesPerDay: -1, // Unlimited
        totalAnalyses: -1, // Unlimited
        exportData: true,
        advancedFeatures: true,
        prioritySupport: true,
      }
    default:
      return {
        analysesPerDay: 0,
        totalAnalyses: 0,
        exportData: false,
        advancedFeatures: false,
        prioritySupport: false,
      }
  }
}