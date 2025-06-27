# Discord OAuth Setup Guide

This guide will help you set up Discord OAuth for your InsightSync application to enable course members to log in with their Discord accounts.

## Prerequisites

- A Discord account
- A Discord server where your course members are
- Admin permissions on the Discord server

## Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give your application a name (e.g., "InsightSync Course Access")
4. Click "Create"

## Step 2: Configure OAuth2

1. In your application, go to the "OAuth2" section in the sidebar
2. Copy your **Client ID** and **Client Secret** (click "Reset Secret" if needed)
3. Add redirect URLs:
   - For local development: `http://localhost:3000/api/auth/callback/discord`
   - For production: `https://yourdomain.com/api/auth/callback/discord`

## Step 3: Get Your Discord Server Information

1. Open Discord and go to your server
2. Right-click on your server name and select "Copy Server ID"
   - If you don't see this option, enable Developer Mode in Discord Settings > Advanced
3. This is your `DISCORD_GUILD_ID`

### Optional: Get Course Member Role ID

If you want to check for a specific role (recommended):

1. Go to Server Settings > Roles
2. Right-click on your course member role and select "Copy Role ID"
3. This is your `DISCORD_COURSE_ROLE_ID`

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Discord OAuth
DISCORD_CLIENT_ID="your-client-id-from-step-2"
DISCORD_CLIENT_SECRET="your-client-secret-from-step-2"
DISCORD_GUILD_ID="your-server-id-from-step-3"
DISCORD_COURSE_ROLE_ID="your-role-id-from-step-3" # Optional but recommended

# Cron job security (generate a random string)
CRON_SECRET="generate-a-secure-random-string"
```

## Step 5: Set Up Automatic Membership Verification

### Option 1: Using Vercel Cron Jobs

Add to your `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/verify-discord",
    "schedule": "0 * * * *"
  }]
}
```

### Option 2: Using External Cron Service

Set up a cron job to call:
```
POST https://yourdomain.com/api/cron/verify-discord
Headers: Authorization: Bearer YOUR_CRON_SECRET
```

### Option 3: Using GitHub Actions

Create `.github/workflows/discord-verify.yml`:

```yaml
name: Verify Discord Memberships
on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Manual trigger

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Call verification endpoint
        run: |
          curl -X POST https://yourdomain.com/api/cron/verify-discord \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `/auth/signin`
3. Click "Sign in with Discord"
4. Authorize the application
5. Check if you're granted course access

## How It Works

1. **User clicks "Sign in with Discord"**
   - They're redirected to Discord OAuth flow
   - Discord asks them to authorize your app

2. **After authorization**
   - System checks if they're in your Discord server
   - If `DISCORD_COURSE_ROLE_ID` is set, checks for that specific role
   - Grants `COURSE_MEMBER` role if verified

3. **Automatic verification**
   - Runs hourly to check all Discord users
   - Revokes access if they leave the server or lose the role
   - Logs all changes for audit purposes

## Troubleshooting

### "Invalid OAuth2 redirect URI"
- Make sure your redirect URI in Discord matches exactly
- Include the protocol (http/https)
- No trailing slashes

### "User not getting course access"
- Verify they're in the correct Discord server
- Check if they have the required role (if using role-based access)
- Check the audit logs in your database

### "Failed to fetch Discord guilds"
- The user may have denied the required permissions
- Check if the Discord token has expired
- Verify your OAuth scopes include `guilds` and `guilds.members.read`

## Security Considerations

1. **Keep your secrets secure**
   - Never commit `.env.local` to git
   - Use environment variables in production
   - Rotate secrets regularly

2. **Rate limiting**
   - Discord has rate limits on API calls
   - The verification cron job spaces out requests
   - Don't run verification too frequently

3. **Audit logging**
   - All access grants/revokes are logged
   - Review logs regularly for suspicious activity
   - Set up alerts for unusual patterns

## Integration with LaunchPass

Since you're using LaunchPass with Discord:

1. LaunchPass handles the initial Discord server invite
2. Our system verifies continued membership
3. If someone cancels via LaunchPass, they lose Discord access
4. Our system automatically revokes their tool access

This creates a seamless experience where purchasing through LaunchPass grants both Discord and tool access, and canceling removes both.