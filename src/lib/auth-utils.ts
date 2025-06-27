import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'
import { UserRole } from '@prisma/client'
import { prisma } from './db'
import { logger } from './logger'

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

// Helper function to ensure user exists in database
async function ensureUserExists(userId: string, email: string, role: UserRole = 'SAAS_SUBSCRIBER') {
  try {
    // First, try to find by ID
    let user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (user) {
      return user
    }
    
    // If not found by ID, check by email
    const userByEmail = await prisma.user.findUnique({
      where: { email: email }
    })
    
    if (userByEmail) {
      // User exists with different ID - return the existing user
      logger.log(`User ID mismatch: Session has ${userId}, DB has ${userByEmail.id} for email ${email}`)
      return userByEmail
    }
    
    // No user found - create new one
    logger.log(`Creating new user: ${userId} with email ${email}`)
    return await prisma.user.create({
      data: {
        id: userId,
        email: email,
        role: role,
        usageCount: 0,
        dailyUsageCount: 0,
        lastUsageReset: new Date(),
      }
    })
  } catch (error) {
    logger.error('Error in ensureUserExists:', error)
    throw error
  }
}

export async function getUserUsageStats(userId: string, email?: string) {
  try {
    // If we have an email, ensure the user exists
    if (email) {
      const user = await ensureUserExists(userId, email)
      userId = user.id // Use the actual user ID from the database
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        usageCount: true,
        dailyUsageCount: true,
        lastUsageReset: true,
        role: true,
      }
    })

    if (!user) {
      throw new Error(`User not found: ${userId}`)
    }

    // Reset daily usage if last reset was more than 24 hours ago
    const now = new Date()
    const lastReset = new Date(user.lastUsageReset)
    const hoursSinceReset = (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60)

    if (hoursSinceReset >= 24) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          dailyUsageCount: 0,
          lastUsageReset: now,
        }
      })
      user.dailyUsageCount = 0
    }

    return user
  } catch (error) {
    logger.error('Error in getUserUsageStats:', error)
    throw error
  }
}

export async function checkUsageLimit(userId: string, email?: string): Promise<{ 
  allowed: boolean; 
  remaining: number; 
  limit: number; 
  resetAt: Date;
}> {
  try {
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
  } catch (error) {
    logger.error('Error in checkUsageLimit:', error)
    throw error
  }
}

export async function incrementUsage(userId: string, email?: string) {
  try {
    // Get the correct user (handles ID mismatches)
    const user = await getUserUsageStats(userId, email)
    
    // Use the actual user ID from the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        usageCount: user.usageCount + 1,
        dailyUsageCount: user.dailyUsageCount + 1,
      }
    })
  } catch (error) {
    logger.error('Error in incrementUsage:', error)
    throw error
  }
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'FREE_TRIAL':
      return 'Free Trial'
    case 'SAAS_SUBSCRIBER':
      return 'SaaS Subscriber'
    case 'COURSE_MEMBER':
      return 'Course Member'
    case 'ADMIN':
      return 'Admin'
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
    case 'ADMIN':
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