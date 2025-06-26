import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, logAdminAction } from '@/lib/admin'
import { getClientIP } from '@/lib/rate-limiter'
import { prisma } from '@/lib/prisma'

// Get audit logs (admin only)
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
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const action = searchParams.get('action') // Filter by action
    const severity = searchParams.get('severity') // Filter by severity
    const userId = searchParams.get('userId') // Filter by user
    const startDate = searchParams.get('startDate') // Filter by date range
    const endDate = searchParams.get('endDate')
    
    let where: any = {}
    
    if (action) {
      where.action = { contains: action, mode: 'insensitive' }
    }
    
    if (severity && ['info', 'warning', 'error', 'critical'].includes(severity)) {
      where.severity = severity
    }
    
    if (userId) {
      where.userId = userId
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }
    
    const auditLogs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    })
    
    const total = await prisma.auditLog.count({ where })
    
    // Log admin action for viewing audit logs
    await logAdminAction({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'audit_logs_viewed',
      resource: 'audit_logs',
      details: JSON.stringify({
        filters: { action, severity, userId, startDate, endDate, limit, offset },
        totalLogs: total
      }),
      ipAddress: clientIP,
      userAgent,
      severity: 'info'
    })
    
    return NextResponse.json({
      auditLogs: auditLogs.map(log => ({
        id: log.id,
        userId: log.userId,
        userEmail: log.userEmail,
        userName: log.user.name,
        userRole: log.user.role,
        action: log.action,
        resource: log.resource,
        details: log.details ? JSON.parse(log.details) : null,
        severity: log.severity,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Get audit logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}

// Get audit log statistics (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdmin(request)
    if (adminCheck instanceof Response) {
      return adminCheck
    }
    
    const { adminUser } = adminCheck
    const clientIP = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    const body = await request.json()
    const { timeRange = '7d' } = body // 1d, 7d, 30d, 90d
    
    let startDate: Date
    const now = new Date()
    
    switch (timeRange) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
    
    // Get statistics
    const [
      totalLogs,
      severityStats,
      actionStats,
      userStats,
      dailyStats
    ] = await Promise.all([
      // Total logs in time range
      prisma.auditLog.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // Logs by severity
      prisma.auditLog.groupBy({
        by: ['severity'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: {
          severity: true
        }
      }),
      
      // Most common actions
      prisma.auditLog.groupBy({
        by: ['action'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: {
          action: true
        },
        orderBy: {
          _count: {
            action: 'desc'
          }
        },
        take: 10
      }),
      
      // Most active users
      prisma.auditLog.groupBy({
        by: ['userId', 'userEmail'],
        where: {
          createdAt: { gte: startDate }
        },
        _count: {
          userId: true
        },
        orderBy: {
          _count: {
            userId: 'desc'
          }
        },
        take: 10
      }),
      
      // Daily activity (last 30 days max)
      prisma.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_count,
          COUNT(CASE WHEN severity = 'error' THEN 1 END) as error_count,
          COUNT(CASE WHEN severity = 'warning' THEN 1 END) as warning_count
        FROM audit_logs 
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `
    ])
    
    // Log admin action
    await logAdminAction({
      userId: adminUser.id,
      userEmail: adminUser.email,
      action: 'audit_statistics_viewed',
      resource: 'audit_logs',
      details: JSON.stringify({
        timeRange,
        totalLogs
      }),
      ipAddress: clientIP,
      userAgent,
      severity: 'info'
    })
    
    return NextResponse.json({
      timeRange,
      totalLogs,
      statistics: {
        bySeverity: severityStats.map(stat => ({
          severity: stat.severity,
          count: stat._count.severity
        })),
        byAction: actionStats.map(stat => ({
          action: stat.action,
          count: stat._count.action
        })),
        byUser: userStats.map(stat => ({
          userId: stat.userId,
          userEmail: stat.userEmail,
          count: stat._count.userId
        })),
        daily: dailyStats
      }
    })
  } catch (error) {
    console.error('Get audit statistics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit statistics' },
      { status: 500 }
    )
  }
}