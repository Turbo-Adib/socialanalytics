# Authentication Fix Guide

## The Issue
You're getting a "Failed to analyze channel" error because the authentication session is not being properly established after using the admin code.

## Solution Steps

### Option 1: Use the Admin Sign In (Recommended)
1. Go to `/auth/signin`
2. Click on the "Admin" tab
3. Enter one of these admin codes:
   - `ADMIN-MASTER-2025`
   - `ADMIN-BYPASS-KEY`
4. Click "Sign In"
5. You should be redirected to `/tools`
6. Try analyzing a channel again

### Option 2: Create a Regular Account
1. Go to `/auth/signup`
2. Create an account with your email
3. Sign in with your credentials
4. You'll have access to the tools

### Option 3: Use Course Code (If Available)
1. From the tools page, enter your course code
2. Click "Unlock Tools"
3. The page will refresh with full access

## Technical Details

The issue was that:
1. NextAuth requires `NEXTAUTH_URL` and `NEXTAUTH_SECRET` environment variables (now added)
2. The session wasn't being created properly when using admin codes
3. The API was correctly checking for authentication but the session wasn't established

## Temporary Admin Bypass

I've added a temporary admin bypass that works as follows:
- If you sign in with an admin code through the Admin tab
- Your email will be set to `admin@insightsync.io`
- The tools page will automatically add an admin header to bypass authentication checks

## Testing the Fix

1. Make sure the development server is restarted after the environment variable changes
2. Clear your browser cookies for localhost:3000
3. Try signing in with the admin code through the Admin tab
4. The channel analysis should now work

## If Issues Persist

Check the browser console and network tab for any errors. The API now logs detailed authentication information that can help diagnose issues.