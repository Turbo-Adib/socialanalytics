# Admin Access Guide

## Quick Access Methods

### 1. Admin Code Authentication (Recommended)
Access admin tools without email authentication:

1. Go to `/auth/signin`
2. Click on the "Admin" tab
3. Enter one of these admin codes:
   - `ADMIN-MASTER-2025`
   - `ADMIN-BYPASS-KEY`

### 2. Direct Admin Panel Access
Once authenticated with admin code:
- Admin Panel: `/admin`
- Tools Page: `/tools`

### 3. Course Member Codes
To grant course member access:
1. Go to Admin Panel → Generate Course Codes
2. Share generated codes with course members
3. Members can redeem at `/tools`

## Features Implemented

### Course Code System
- ✅ Course codes grant FREE access to all tools
- ✅ Codes can be redeemed at `/tools` page
- ✅ Works for both authenticated and unauthenticated users
- ✅ Automatic COURSE_MEMBER role assignment

### Admin Bypass
- ✅ Admin codes work without email/password
- ✅ Direct access to all tools and admin panel
- ✅ No email verification required
- ✅ Instant authentication

## Security Notes
- Admin codes are hardcoded for development
- In production, store admin codes in environment variables
- Consider implementing rate limiting on code redemption
- Add expiration dates for course codes if needed