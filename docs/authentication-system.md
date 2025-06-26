# Authentication & Billing System Documentation

## Overview

This document describes the comprehensive authentication and billing system implemented for InsightSync, including user roles, subscription management, and discount code functionality.

## System Architecture

### Authentication Flow
1. **User Registration**: Email/password signup with validation
2. **Login**: NextAuth.js credentials provider
3. **Session Management**: JWT-based sessions with role information
4. **Role-Based Access**: Three user roles with different permissions

### User Roles

#### FREE_TRIAL
- **Limits**: 3 total channel analyses (lifetime)
- **Features**: Basic analytics only
- **Restrictions**: No export, no advanced features
- **Duration**: Permanent until upgrade

#### SAAS_SUBSCRIBER
- **Limits**: 50 channel analyses per day
- **Features**: Full analytics, export, advanced insights
- **Billing**: Monthly subscription ($19 Basic, $49 Pro)
- **Duration**: Active while subscription is valid

#### COURSE_MEMBER
- **Limits**: Unlimited analyses
- **Features**: All premium features
- **Billing**: One-time discount code redemption (100% off)
- **Duration**: Lifetime access

## Database Schema

### Core Tables

```prisma
model User {
  id                String         @id @default(cuid())
  email             String         @unique
  password          String?
  role              UserRole       @default(FREE_TRIAL)
  subscriptionId    String?        // Stripe subscription ID
  customerId        String?        // Stripe customer ID
  discountCodeUsed  String?        // Redeemed course code
  usageCount        Int            @default(0)
  dailyUsageCount   Int            @default(0)
  lastUsageReset    DateTime       @default(now())
  // ... other fields
}

model ChannelAnalysis {
  id              String    @id @default(cuid())
  userId          String
  channelId       String    // YouTube channel ID
  channelName     String
  subscriberCount Int
  totalViews      BigInt
  estimatedNiche  String
  analysisData    Json      // Full analysis results
  createdAt       DateTime  @default(now())
  // ... other fields
}

model DiscountCode {
  id          String    @id @default(cuid())
  code        String    @unique
  email       String?   // Optional email restriction
  usedBy      String?   // User ID who redeemed
  usedAt      DateTime?
  cohort      String?   // Batch identifier
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js handlers
- `GET /api/user/analyses` - User's analysis history

### Billing & Subscriptions
- `POST /api/billing/create-checkout` - Create Stripe checkout session
- `POST /api/billing/create-portal` - Create billing portal session
- `POST /api/billing/redeem-code` - Redeem discount code
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin (Restricted Access)
- `GET /api/admin/discount-codes` - List all discount codes
- `POST /api/admin/discount-codes` - Generate new codes

### Protected Analytics
- `GET /api/analyze` - Main channel analysis (with usage tracking)
- `GET /api/analyze-minimal` - Simplified analysis
- `GET /api/outlier-analysis` - Advanced outlier detection

## Usage Tracking & Rate Limiting

### Implementation
```typescript
export async function checkUsageLimit(userId: string): Promise<{
  allowed: boolean
  remaining: number
  limit: number
  resetAt: Date
}> {
  const user = await getUserUsageStats(userId)
  
  const limits = {
    FREE_TRIAL: 3,    // Total lifetime limit
    SAAS_SUBSCRIBER: 50, // Daily limit
    COURSE_MEMBER: -1,   // Unlimited
  }
  
  // Check against current usage and return result
}
```

### Usage Rules
- **Free Trial**: Hard limit of 3 analyses total, never resets
- **SaaS Subscribers**: 50 analyses per day, resets at midnight
- **Course Members**: No limits, priority processing

## Stripe Integration

### Subscription Plans
```typescript
const SUBSCRIPTION_TIERS = {
  BASIC_MONTHLY: {
    name: 'Basic SaaS',
    price: 19,
    features: ['25 analyses/day', 'Basic insights', 'CSV export'],
    limits: { dailyAnalyses: 25 }
  },
  PRO_MONTHLY: {
    name: 'Pro SaaS', 
    price: 49,
    features: ['50 analyses/day', 'Advanced insights', 'Priority support'],
    limits: { dailyAnalyses: 50 }
  }
}
```

### Webhook Events Handled
- `checkout.session.completed` - Upgrade user role
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Downgrade to free trial
- `invoice.payment_succeeded` - Reset usage counters
- `invoice.payment_failed` - Grace period handling

## Discount Code System

### Code Generation
- Format: `COURSE_XXXXXXXX` (8 character nanoid)
- Batch creation with cohort tracking
- Optional email restrictions
- One-time use validation

### Redemption Process
1. Validate code exists and is active
2. Check user eligibility (not already course member)
3. Verify email restrictions if applicable
4. Atomically mark code as used and upgrade user
5. Update session with new role

### Admin Features
- Bulk code generation
- Usage tracking and analytics
- Cohort management
- Code status monitoring

## Security Measures

### Authentication Security
- Password hashing with bcrypt (12 rounds)
- JWT sessions with secure configuration
- CSRF protection on all forms
- Input validation with Zod schemas

### API Protection
- Session-based authentication on all protected routes
- Role-based access control middleware
- Rate limiting integration ready
- Input sanitization and validation

### Database Security
- Parameterized queries via Prisma (SQL injection prevention)
- Transaction-based operations for critical actions
- Unique constraints on sensitive fields
- Soft deletion for audit trails

## Monitoring & Analytics

### Usage Metrics Tracked
- Daily/monthly analysis counts per user
- Subscription conversion rates
- Discount code redemption rates
- Feature adoption by user role

### Error Handling
- Comprehensive error logging
- User-friendly error messages
- Graceful degradation for failed operations
- Admin notifications for critical issues

## Deployment Configuration

### Environment Variables Required
```bash
# Authentication
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://insightsync.io"

# Database
DATABASE_URL="postgresql://..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_BASIC_PRICE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."

# Application
NEXT_PUBLIC_APP_URL="https://insightsync.io"
```

### Production Checklist
- [ ] Update NEXTAUTH_SECRET to secure random value
- [ ] Configure production Stripe keys and price IDs
- [ ] Set up Stripe webhook endpoint
- [ ] Configure PostgreSQL database
- [ ] Test all user flows end-to-end
- [ ] Set up monitoring and alerting
- [ ] Configure backup procedures

## Future Enhancements

### Planned Features
- Email verification for new accounts
- Password reset functionality
- Team/organization accounts
- Usage analytics dashboard
- API rate limiting with Redis
- Advanced admin analytics
- Automated billing notifications

### Scalability Considerations
- Redis for session storage and rate limiting
- Database indexing optimization
- CDN for static assets
- Microservices architecture migration
- Advanced monitoring and logging

## Support & Maintenance

### Common Issues
1. **Failed payments**: Automatic retry with grace period
2. **Discount code issues**: Admin panel for manual resolution
3. **Usage limit disputes**: Usage history audit trail
4. **Role synchronization**: Manual admin override capability

### Monitoring Points
- Authentication success/failure rates
- Payment processing errors
- API response times
- Database query performance
- Stripe webhook delivery status

This system provides a robust foundation for user management, billing, and access control that can scale with the business while maintaining security and user experience standards.