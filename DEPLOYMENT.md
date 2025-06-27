# Deployment Guide for InsightSync on Render

This guide walks you through deploying the InsightSync YouTube Analytics Dashboard to Render.

## Prerequisites

1. A [Render account](https://render.com)
2. A GitHub account with this repository forked or cloned
3. API keys for:
   - YouTube Data API v3
   - Discord OAuth (for course member access)
   - Stripe (for payments)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your repository has the following files (already created):
- `render.yaml` - Render configuration
- `scripts/build.sh` - Build script for production
- `.env.production.example` - Production environment template

### 2. Connect GitHub to Render

1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub account if not already connected
4. Select this repository

### 3. Configure the Service

Render will automatically detect the `render.yaml` file. Review the configuration:

- **Name**: socialanalytics (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: main (or your default branch)
- **Runtime**: Node
- **Build Command**: `./scripts/build.sh` (automatically set from render.yaml)
- **Start Command**: `npm run start` (automatically set from render.yaml)

### 4. Set Environment Variables

In the Render dashboard, set these environment variables:

#### Required Variables:

```bash
# YouTube API
YOUTUBE_API_KEY=your_actual_api_key

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_app_id
DISCORD_CLIENT_SECRET=your_discord_app_secret
DISCORD_GUILD_ID=your_discord_server_id
DISCORD_COURSE_ROLE_ID=role_id_for_course_members

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID=price_xxxxx

# Admin Emails (comma-separated)
ADMIN_EMAILS=admin@example.com

# Google OAuth (optional)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
```

#### Automatically Set by Render:

- `DATABASE_URL` - Connection string for PostgreSQL
- `NEXTAUTH_SECRET` - Auto-generated secret

### 5. Update OAuth Redirect URLs

After deployment, update your OAuth providers with the production URLs:

#### Discord OAuth:
Add redirect URL: `https://your-app.onrender.com/api/auth/callback/discord`

#### Google OAuth (if using):
Add redirect URL: `https://your-app.onrender.com/api/auth/callback/google`

### 6. Database Migration

The build script automatically runs Prisma migrations. On first deployment:

1. The PostgreSQL database will be created
2. Prisma will apply all migrations
3. The database schema will be ready

### 7. Configure Stripe Webhooks

1. Go to Stripe Dashboard > Webhooks
2. Add endpoint: `https://your-app.onrender.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 8. Deploy

Click "Create Web Service" to start the deployment. Render will:

1. Create a PostgreSQL database
2. Clone your repository
3. Run the build script
4. Start your application

### 9. Post-Deployment Steps

1. **Test the Application**:
   - Visit `https://your-app.onrender.com`
   - Test user registration and login
   - Test YouTube channel analysis
   - Test payment flow

2. **Set up Custom Domain** (optional):
   - In Render dashboard, go to Settings > Custom Domains
   - Add your domain and follow DNS instructions

3. **Enable Auto-Deploy**:
   - In Settings, enable "Auto-Deploy" for automatic updates on git push

4. **Monitor Performance**:
   - Use Render's metrics dashboard
   - Set up alerts for errors or downtime

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check that `DATABASE_PROVIDER` is set to `postgresql`
2. Ensure the database service is running in Render
3. Check logs for specific connection errors

### Build Failures

Common causes:
- Missing environment variables
- Node version mismatch (specify in `package.json` if needed)
- Prisma schema syntax errors

### Migration Issues

If migrations fail:
1. Check migration files in `prisma/migrations/`
2. Ensure PostgreSQL compatibility
3. You may need to reset the database and re-run migrations

### Performance Issues

For better performance:
1. Upgrade to a paid Render plan
2. Enable Redis caching (add Redis service)
3. Use Render's CDN for static assets

## Monitoring and Maintenance

### Logs

Access logs in Render dashboard:
- Build logs for deployment issues
- Service logs for runtime errors

### Database Backups

Render automatically backs up PostgreSQL databases on paid plans.

### Scaling

To scale your application:
1. Upgrade your service plan
2. Add more instances (horizontal scaling)
3. Optimize database queries

## Security Checklist

- [ ] All API keys are set as environment variables
- [ ] `NEXTAUTH_SECRET` is properly generated
- [ ] Database has SSL enabled (default on Render)
- [ ] OAuth redirect URLs are correctly configured
- [ ] Stripe webhook endpoint is secure
- [ ] Admin emails are properly set

## Support

For issues specific to:
- **Render**: Check [Render Docs](https://render.com/docs)
- **Application**: Check the project's GitHub issues
- **Database**: Review Prisma documentation

Remember to never commit sensitive information like API keys to your repository!