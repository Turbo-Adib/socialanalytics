# Security System Documentation

## Overview

InsightSync implements a comprehensive security system with enterprise-grade features including role-based access control, audit logging, rate limiting, and security headers. This document explains how the security system works and how to manage it.

## Table of Contents

- [Authentication System](#authentication-system)
- [Role-Based Access Control](#role-based-access-control)
- [Admin System](#admin-system)
- [Audit Logging](#audit-logging)
- [Rate Limiting](#rate-limiting)
- [Security Headers](#security-headers)
- [Admin Setup](#admin-setup)
- [API Security](#api-security)

## Authentication System

### NextAuth.js Integration

The application uses NextAuth.js for authentication with support for:

- **Credentials Provider**: Email/password authentication
- **OAuth Providers**: Ready for Google, GitHub integration
- **JWT Sessions**: Secure token-based sessions
- **Role Management**: User roles stored in database

### User Roles

```typescript
enum UserRole {
  FREE_TRIAL      // Default role for new users
  SAAS_SUBSCRIBER // Paid subscription users
  COURSE_MEMBER   // Course purchasers
  ADMIN           // System administrators
}
```

## Role-Based Access Control

### Implementation

All admin routes are protected by the `requireAdmin` middleware:

```typescript
// Example usage in API route
const adminCheck = await requireAdmin(request)
if (adminCheck instanceof Response) {
  return adminCheck // Returns 401 or 403 error
}

const { adminUser } = adminCheck
// Proceed with admin-only operations
```

### Protected Routes

- `/api/admin/*` - All admin API endpoints
- `/admin/*` - Admin dashboard pages
- Regular user routes check for authentication only

## Admin System

### Admin Capabilities

1. **User Management**
   - View all users
   - Change user roles
   - Promote/demote admins
   - View user activity

2. **Discount Code Management**
   - Generate course codes
   - Track code usage
   - Manage code cohorts

3. **Audit Log Access**
   - View all system logs
   - Filter by severity
   - Track admin actions
   - Generate reports

### Admin API Endpoints

#### `/api/admin/users`
- `GET` - List users with filtering
- `PATCH` - Update user roles

#### `/api/admin/discount-codes`
- `POST` - Generate new codes
- `GET` - List all codes with status

#### `/api/admin/audit-logs`
- `GET` - View audit logs with filtering
- `POST` - Get audit statistics

## Audit Logging

### What's Logged

All admin actions are automatically logged with:

```typescript
{
  userId: string
  userEmail: string
  action: string
  resource?: string
  details?: JSON
  ipAddress: string
  userAgent: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  createdAt: DateTime
}
```

### Logged Actions

- `admin_login` - Admin user login
- `discount_codes_generated` - Code generation
- `discount_codes_viewed` - Code list access
- `user_role_changed` - Role modifications
- `user_promoted_to_admin` - Admin promotions
- `user_demoted_from_admin` - Admin demotions
- `unauthorized_admin_access_attempt` - Failed access
- `audit_logs_viewed` - Log access
- `users_list_viewed` - User list access

### Severity Levels

- **Info**: Normal operations
- **Warning**: Unauthorized access attempts
- **Error**: Operation failures
- **Critical**: Role changes, admin modifications

## Rate Limiting

### Configuration

Different rate limits for different endpoint types:

```typescript
rateLimiters = {
  global: 100 requests/minute/IP      // All requests
  auth: 5 requests/minute/IP          // Login/signup
  api: 30 requests/minute/user        // API calls
  admin: 10 requests/minute/user      // Admin endpoints
  youtube: 10 requests/minute/user    // YouTube API
}
```

### Headers

Rate limit information in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703123456789
Retry-After: 60 (when rate limited)
```

## Security Headers

Applied to all responses via middleware:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: [comprehensive policy]
```

## Admin Setup

### Initial Admin Setup

1. Run the setup script:
   ```bash
   npx tsx scripts/setup-admin.ts
   ```

2. Follow prompts to:
   - Create new admin user
   - Promote existing user
   - Set admin credentials

3. All setup actions are logged in audit trail

### Manual Admin Promotion

Via database (emergency only):
```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'admin@example.com';
```

### Admin Management Best Practices

1. **Limit Admin Users**: Only essential personnel
2. **Regular Audits**: Review audit logs monthly
3. **Role Reviews**: Quarterly admin role audits
4. **Strong Authentication**: Enforce 2FA for admins
5. **IP Restrictions**: Consider IP allowlisting

## API Security

### Authentication Flow

1. User signs in via `/auth/signin`
2. JWT token created with user data
3. Token sent in cookies/headers
4. Middleware validates on each request
5. Role checked for protected routes

### Protected API Pattern

```typescript
// Check authentication
const session = await getServerSession(authOptions)
if (!session?.user) {
  return new Response('Unauthorized', { status: 401 })
}

// Check role for specific endpoints
if (requiresRole && session.user.role !== requiresRole) {
  return new Response('Forbidden', { status: 403 })
}
```

### Security Best Practices

1. **Input Validation**: Zod schemas on all inputs
2. **SQL Injection**: Prisma ORM prevents injection
3. **XSS Protection**: React escapes by default
4. **CSRF Protection**: SameSite cookies
5. **Secrets Management**: Environment variables
6. **Error Handling**: Generic error messages

## Monitoring & Alerts

### Audit Log Monitoring

Monitor for:
- Multiple failed admin access attempts
- Unusual admin activity patterns
- Critical severity events
- Role elevation activities

### Security Metrics

Track via `/api/admin/audit-logs` statistics:
- Failed authentication attempts
- Admin action frequency
- Error rates by endpoint
- User activity patterns

## Incident Response

### Security Incident Steps

1. **Detect**: Monitor audit logs
2. **Contain**: Revoke affected sessions
3. **Investigate**: Review audit trail
4. **Remediate**: Fix vulnerabilities
5. **Document**: Update security logs

### Emergency Procedures

**Revoke All Admin Access:**
```sql
UPDATE users SET role = 'FREE_TRIAL' WHERE role = 'ADMIN';
```

**Lock Down System:**
```typescript
// In middleware.ts
return new Response('System Maintenance', { status: 503 })
```

## Security Checklist

### Regular Security Tasks

- [ ] Weekly audit log review
- [ ] Monthly admin role audit
- [ ] Quarterly security assessment
- [ ] Annual penetration testing
- [ ] Regular dependency updates

### Deployment Security

- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] HTTPS enforced
- [ ] Secrets rotated regularly
- [ ] Backups encrypted

## Support

For security concerns:
- Report issues: security@insightsync.io
- Emergency: Use admin console
- Documentation: This guide
- Updates: Check security advisories