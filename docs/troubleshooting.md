# Troubleshooting Guide

## Common Issues and Solutions

### 1. **Channel Analysis Failures**

#### Symptoms:
- "Analysis failed" error message
- 401 Authentication errors
- 429 Usage limit exceeded errors

#### Root Causes & Solutions:

**A. Authentication Issues**
```bash
# Test authentication status
curl http://localhost:3000/api/test-auth

# Expected response for authenticated user:
{
  "authenticated": true,
  "user": { "id": "...", "role": "FREE_TRIAL" },
  "usage": { "allowed": true, "remaining": 3 }
}
```

**Solutions:**
1. Ensure user is logged in via `/auth/signin`
2. Check NextAuth.js configuration in `.env`
3. Verify session is active in browser dev tools

**B. Usage Limit Issues**
- **Free Trial**: Limited to 3 total analyses
- **SaaS Subscriber**: 50 analyses per day
- **Course Member**: Unlimited

**Solutions:**
1. Check current usage via dashboard
2. Upgrade account or redeem course code
3. Wait for daily reset (SaaS subscribers)

**C. API Endpoint Confusion**
- **Landing Page**: Uses `/api/demo` (no auth required)
- **Authenticated Users**: Uses `/api/analyze` (auth required)

**Solutions:**
1. Ensure authenticated users use `/analyze` page
2. Check that analysis forms call correct endpoint

### 2. **Database Connection Issues**

#### Symptoms:
- "Prisma Client not found" errors
- Database connection failures

#### Solutions:
```bash
# Regenerate Prisma client
npx prisma generate

# Check database connection
npx prisma db push

# Reset database if needed (DEV ONLY)
npx prisma migrate reset
```

### 3. **Environment Configuration**

#### Required Variables:
```bash
# Authentication
NEXTAUTH_SECRET="secure-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Database
DATABASE_URL="file:./dev.db"

# YouTube API (optional for demo)
YOUTUBE_API_KEY="your-key-here"
```

#### Testing Configuration:
```bash
# Test environment variables are loaded
node -e "console.log(process.env.NEXTAUTH_SECRET)"
```

### 4. **Session and Cookie Issues**

#### Symptoms:
- Constant redirects to signin
- Session not persisting
- "Authentication required" on authenticated pages

#### Solutions:
1. **Clear Browser Data**:
   - Clear cookies for localhost:3000
   - Clear localStorage and sessionStorage

2. **Check NextAuth Configuration**:
   ```typescript
   // Verify in browser dev tools > Application > Cookies
   // Should see: next-auth.session-token
   ```

3. **Test Session Manually**:
   ```javascript
   // In browser console on authenticated page
   import { getSession } from 'next-auth/react'
   getSession().then(console.log)
   ```

### 5. **Role and Permission Issues**

#### User Roles:
- `FREE_TRIAL`: 3 total analyses
- `SAAS_SUBSCRIBER`: 50 daily analyses  
- `COURSE_MEMBER`: Unlimited analyses

#### Checking User Role:
```bash
# Via API
curl -b cookies.txt http://localhost:3000/api/test-auth

# Via Database
npx prisma studio
# Navigate to User table, check 'role' column
```

#### Upgrading Roles:
```sql
-- Manual role upgrade (development only)
UPDATE User SET role = 'COURSE_MEMBER' WHERE email = 'user@example.com';
```

### 6. **Component Import/Export Errors**

#### Common Issues:
- Missing component exports
- Circular dependencies
- TypeScript errors

#### Solutions:
```bash
# Check for TypeScript errors
npm run build

# Verify component exports
grep -r "export.*Component" src/components/
```

### 7. **Stripe Integration Issues**

#### Symptoms:
- Billing page crashes
- Checkout creation fails
- Webhook errors

#### Solutions:
1. **Development Mode**:
   ```bash
   # Use test keys (safe for development)
   STRIPE_SECRET_KEY="sk_test_development_placeholder"
   STRIPE_PUBLISHABLE_KEY="pk_test_development_placeholder"
   ```

2. **Test Stripe Connection**:
   ```bash
   # Should not crash in development
   curl http://localhost:3000/billing
   ```

### 8. **Performance Issues**

#### Symptoms:
- Slow page loads
- Analysis timeouts
- High memory usage

#### Solutions:
1. **Database Optimization**:
   ```bash
   # Check database size
   ls -la prisma/dev.db
   
   # Clean old analyses if > 100MB
   ```

2. **API Response Times**:
   ```bash
   # Test API performance
   time curl http://localhost:3000/api/test-auth
   ```

### 9. **Development Server Issues**

#### Common Fixes:
```bash
# Restart development server
npm run dev

# Clear Next.js cache
rm -rf .next/

# Reinstall dependencies
rm -rf node_modules/ package-lock.json
npm install

# Reset database (DEV ONLY)
rm prisma/dev.db
npx prisma migrate dev
```

### 10. **Debugging Steps**

#### Systematic Debugging:
1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API calls and responses
3. **Check Server Logs**: Look at terminal output
4. **Test API Endpoints**: Use curl or Postman
5. **Verify Database**: Use `npx prisma studio`

#### Debug Commands:
```bash
# Test authentication flow
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'

# Test analysis endpoint (with auth)
curl -b cookies.txt http://localhost:3000/api/analyze?url=youtube.com/@MrBeast

# Check database state
npx prisma studio
```

## Emergency Reset Procedures

### Complete System Reset (Development Only):
```bash
# 1. Stop development server
# Ctrl+C

# 2. Clear all caches and data
rm -rf .next/ node_modules/ package-lock.json prisma/dev.db

# 3. Reinstall dependencies
npm install

# 4. Reset database
npx prisma migrate dev

# 5. Restart server
npm run dev
```

### User Account Reset:
```bash
# Reset specific user's usage
npx prisma studio
# Navigate to User table
# Set usageCount = 0, dailyUsageCount = 0
# Update lastUsageReset to current time
```

## Production Deployment Issues

### Environment Setup:
1. **Database**: PostgreSQL connection string
2. **Authentication**: Secure NEXTAUTH_SECRET
3. **Stripe**: Production API keys
4. **Domain**: Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL

### Health Checks:
```bash
# Test production endpoints
curl https://yourdomain.com/api/test-auth
curl https://yourdomain.com/api/health
```

## Getting Help

### Information to Collect:
1. **Error Messages**: Complete error text
2. **Browser**: Chrome/Firefox/Safari version
3. **Environment**: Development vs production
4. **Steps to Reproduce**: Exact sequence of actions
5. **User Role**: FREE_TRIAL, SAAS_SUBSCRIBER, COURSE_MEMBER

### Debug Information:
```bash
# System information
node --version
npm --version
npx prisma --version

# Database state
npx prisma db pull
npx prisma generate
```

This guide covers the most common issues. For complex problems, check the application logs and use the debugging tools provided.