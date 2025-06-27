# 🚀 Deploy InsightSync to Render - Quick Guide

## Prerequisites
- Render account (https://render.com)
- GitHub repository with your code
- This guide assumes you're deploying for beta testing

## Step 1: Create PostgreSQL Database on Render

1. Log in to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `insightsync-db`
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine for beta
4. Click "Create Database"
5. Wait for provisioning (~2 minutes)
6. Copy the **External Database URL** (starts with `postgresql://`)

## Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `insightsync`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy`
   - **Start Command**: `npm run start`
   - **Plan**: Free tier for beta

## Step 3: Add Environment Variables

Click "Environment" tab and add ALL of these:

```bash
# Database (use your External Database URL from Step 1)
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://YOUR_DATABASE_URL_HERE

# Application
NEXT_PUBLIC_APP_URL=https://YOUR-APP-NAME.onrender.com
NODE_ENV=production

# NextAuth (generate new secret)
NEXTAUTH_URL=https://YOUR-APP-NAME.onrender.com
NEXTAUTH_SECRET=generate_new_secret_with_openssl_rand_base64_32

# YouTube API (use your existing key)
YOUTUBE_API_KEY=AIzaSyAb84izXH3ymqL-04cbs-aZZ6QfuUhzGuM

# Beta Configuration (temporary for testing)
DISCORD_CLIENT_ID=beta_test_disabled
DISCORD_CLIENT_SECRET=beta_test_disabled
DISCORD_GUILD_ID=beta_test_disabled
DISCORD_COURSE_ROLE_ID=beta_test_disabled

STRIPE_SECRET_KEY=sk_test_beta_disabled
STRIPE_WEBHOOK_SECRET=whsec_beta_disabled
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_beta_disabled

# Admin Access
ADMIN_EMAIL=admin@beta.test
ADMIN_PASSWORD_HASH=$2b$10$DlwbWyQTmTWO1C8E/qw0.OPtOSrHxaAVDN.dv/aNJgtum9SPenm7W

# Beta Mode
BETA_MODE=true
```

## Step 4: Deploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Watch the build logs (takes 5-10 minutes first time)
3. Once deployed, visit your URL

## Step 5: Post-Deployment Setup

1. **Seed the Database**:
   - Go to Render Dashboard → Your Web Service → "Shell" tab
   - Run: `npm run db:seed`

2. **Test Admin Login**:
   - Visit: `https://YOUR-APP-NAME.onrender.com/auth/signin`
   - Email: `admin@beta.test`
   - Password: `betaadmin123`

3. **Test Core Features**:
   - Analyze a YouTube channel
   - Check the dashboard
   - Test the RPM calculator

## ⚠️ Important Notes for Beta

1. **Stripe Payments**: Disabled in beta mode. The billing page will show but payments won't process.

2. **Discord Login**: Disabled in beta mode. Use email/password authentication only.

3. **Free Tier Limitations**:
   - Service spins down after 15 minutes of inactivity
   - First request after spin-down takes ~30 seconds
   - Limited to 750 hours/month

4. **Security**: 
   - Change admin password before public launch
   - Generate a new NEXTAUTH_SECRET for production

## 🎯 Quick Test Checklist

After deployment, test these critical paths:

- [ ] Homepage loads
- [ ] Can sign up new user
- [ ] Can analyze YouTube channel
- [ ] Dashboard shows data
- [ ] RPM calculator works
- [ ] Admin panel accessible (for admin@beta.test)

## 🚨 Troubleshooting

**Build Fails**: 
- Check environment variables are all set
- Ensure DATABASE_URL is the External URL from Render

**Database Connection Error**:
- Make sure you're using the External Database URL
- Check DATABASE_PROVIDER is set to "postgresql"

**Page Not Found**:
- Wait for deployment to complete
- Check the Render logs for errors

**Slow Performance**:
- Normal on free tier after inactivity
- Upgrade to paid tier for always-on service

## 🎉 Success!

Your beta is now live at: `https://YOUR-APP-NAME.onrender.com`

Share this URL with beta testers and start collecting feedback!