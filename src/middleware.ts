import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { rateLimiters, getClientIP, getRateLimitHeaders } from './lib/rate-limiter'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl
    const clientIP = getClientIP(req)
    const userID = token?.sub || clientIP

    // Public routes that don't require authentication
    const publicRoutes = [
      '/',
      '/course',
      '/auth/signin',
      '/auth/signup',
      '/auth/error',
      '/api/auth/signup',
      '/demo-admin',
      '/api/demo',
      '/test-access',
    ]

    // API routes that require authentication
    const protectedApiRoutes = [
      '/api/analyze',
      '/api/analyze-minimal',
      '/api/simple-analyze',
      '/api/outlier-analysis',
      '/api/intelligent-insights',
    ]

    // Admin routes
    const adminRoutes = [
      '/api/admin',
      '/admin'
    ]

    // Auth routes
    const authRoutes = [
      '/api/auth/signup',
      '/api/auth/signin'
    ]

    // Apply global rate limiting to all requests
    const globalRateLimit = rateLimiters.global.check(req, clientIP)
    if (!globalRateLimit.success) {
      const response = new NextResponse('Too Many Requests', { status: 429 })
      Object.entries(getRateLimitHeaders(globalRateLimit)).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    // Apply specific rate limiting based on route type
    if (authRoutes.some(route => pathname.startsWith(route))) {
      const authRateLimit = rateLimiters.auth.check(req, clientIP)
      if (!authRateLimit.success) {
        const response = new NextResponse('Too Many Authentication Attempts', { status: 429 })
        Object.entries(getRateLimitHeaders(authRateLimit)).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }
    }

    if (adminRoutes.some(route => pathname.startsWith(route))) {
      const adminRateLimit = rateLimiters.admin.check(req, userID)
      if (!adminRateLimit.success) {
        const response = new NextResponse('Too Many Admin Requests', { status: 429 })
        Object.entries(getRateLimitHeaders(adminRateLimit)).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }
    }

    if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
      const apiRateLimit = rateLimiters.api.check(req, userID)
      if (!apiRateLimit.success) {
        const response = new NextResponse('API Rate Limit Exceeded', { status: 429 })
        Object.entries(getRateLimitHeaders(apiRateLimit)).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
        return response
      }
    }

    // Check if the route is public
    if (publicRoutes.includes(pathname)) {
      const response = NextResponse.next()
      // Add security headers to all responses
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
      
      // Practical CSP for Next.js app
      response.headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: yt3.ggpht.com yt3.googleusercontent.com i.ytimg.com; connect-src 'self' https://api.stripe.com https://checkout.stripe.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; media-src 'self'; frame-src 'self' https://checkout.stripe.com https://cnvmp3.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`)
      Object.entries(getRateLimitHeaders(globalRateLimit)).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      return response
    }

    // If no token and trying to access protected route, redirect to signin
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/tools') || pathname.startsWith('/analyze') || protectedApiRoutes.some(route => pathname.startsWith(route)))) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Create response with security headers
    const response = NextResponse.next()
    
    // Add security headers to all responses
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    // Practical CSP for Next.js app
    response.headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: yt3.ggpht.com yt3.googleusercontent.com i.ytimg.com; connect-src 'self' https://api.stripe.com https://checkout.stripe.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; media-src 'self'; frame-src 'self' https://checkout.stripe.com https://cnvmp3.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`)
    
    // Add rate limiting headers
    Object.entries(getRateLimitHeaders(globalRateLimit)).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Add user context headers for API routes
    if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
      response.headers.set('X-User-Role', token?.role || 'FREE_TRIAL')
      response.headers.set('X-User-ID', token?.sub || '')
    }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public routes
        const publicRoutes = [
          '/',
          '/course',
          '/auth/signin',
          '/auth/signup',
          '/auth/error',
          '/api/auth/signup',
          '/demo-admin',
          '/api/demo',
          '/test-access',
        ]
        
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // Require token for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}