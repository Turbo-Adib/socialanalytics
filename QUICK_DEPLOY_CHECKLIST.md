# Quick Deployment Checklist for Render

## Pre-Deployment
- [ ] Fork/push this repository to your GitHub account
- [ ] Obtain all required API keys (YouTube, Discord, Stripe)
- [ ] Have your Discord server ID and role ID ready

## Deployment Steps

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect GitHub and select this repository

2. **Render will auto-detect `render.yaml`**
   - Review the settings
   - Click "Create Web Service"

3. **Add Environment Variables** (in Render dashboard)
   ```
   YOUTUBE_API_KEY=your_key
   DISCORD_CLIENT_ID=your_id
   DISCORD_CLIENT_SECRET=your_secret
   DISCORD_GUILD_ID=your_guild_id
   DISCORD_COURSE_ROLE_ID=your_role_id
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxx
   ADMIN_EMAILS=your@email.com
   ```

4. **Post-Deployment**
   - [ ] Update Discord OAuth redirect URL
   - [ ] Configure Stripe webhook endpoint
   - [ ] Test the live application
   - [ ] Enable auto-deploy for CI/CD

## Files Created for Deployment
- ✅ `render.yaml` - Render configuration
- ✅ `scripts/build.sh` - Production build script
- ✅ `.env.production.example` - Environment template
- ✅ Updated Prisma schema for PostgreSQL support
- ✅ `DEPLOYMENT.md` - Detailed deployment guide

## Quick Commands

```bash
# Test build locally
./scripts/build.sh

# Check for TypeScript errors
npm run build

# View current environment setup
cat .env.example
```

Your app is now ready to deploy on Render! 🚀