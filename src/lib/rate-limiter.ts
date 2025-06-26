import { NextRequest } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Number of requests allowed per interval
}

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

// In-memory store for rate limiting (use Redis in production)
const tokenStore = new Map<string, { count: number; resetTime: number }>()

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of Array.from(tokenStore.entries())) {
    if (value.resetTime < now) {
      tokenStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (request: NextRequest, token: string): RateLimitResult => {
      const now = Date.now()
      const tokenData = tokenStore.get(token)
      
      if (!tokenData || tokenData.resetTime < now) {
        // Reset the token data
        tokenStore.set(token, {
          count: 1,
          resetTime: now + config.interval
        })
        
        return {
          success: true,
          limit: config.uniqueTokenPerInterval,
          remaining: config.uniqueTokenPerInterval - 1,
          reset: now + config.interval
        }
      }

      if (tokenData.count >= config.uniqueTokenPerInterval) {
        return {
          success: false,
          limit: config.uniqueTokenPerInterval,
          remaining: 0,
          reset: tokenData.resetTime,
          retryAfter: Math.ceil((tokenData.resetTime - now) / 1000)
        }
      }

      tokenData.count++
      
      return {
        success: true,
        limit: config.uniqueTokenPerInterval,
        remaining: config.uniqueTokenPerInterval - tokenData.count,
        reset: tokenData.resetTime
      }
    }
  }
}

// Different rate limits for different types of requests
export const rateLimiters = {
  // Global rate limiter - 100 requests per minute per IP
  global: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 100
  }),
  
  // Auth endpoints - 5 attempts per minute per IP
  auth: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 5
  }),
  
  // API endpoints - 30 requests per minute per user
  api: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 30
  }),
  
  // Admin endpoints - 10 requests per minute per user
  admin: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10
  }),
  
  // YouTube API endpoints - 10 requests per minute per user (to protect quota)
  youtube: rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 10
  })
}

export function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Fallback to default
  return 'unknown'
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
    ...(result.retryAfter && { 'Retry-After': result.retryAfter.toString() })
  }
}