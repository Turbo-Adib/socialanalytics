# InsightSync - YouTube Analytics Dashboard

A comprehensive SaaS platform that helps YouTube creators understand their channel's performance, analyze revenue potential, and identify growth opportunities through AI-powered insights.

## 🚀 Features

### Core Analytics
- **Real-time Channel Analysis**: Instant insights on subscriber count, views, and video performance
- **Revenue Estimation**: Accurate revenue calculations based on 100+ niche-specific RPM rates
- **Long-form vs Shorts Analysis**: Separate analytics for different content types
- **Historical Performance**: 6-12 month trend analysis with interactive charts
- **Future Projections**: AI-powered forecasts for views and revenue

### Advanced Features
- **Outlier Detection**: Identify your best-performing videos and understand why
- **Intelligent Insights**: AI-driven recommendations based on successful patterns
- **Content Recommendations**: Specific suggestions to improve performance
- **Niche Detection**: Automatic channel categorization with tailored insights
- **Social Listening**: Top creator pain points and trends by niche

### Pro Tools (Course Members)
- **RPM Calculator**: Calculate exact revenue with niche-specific rates
- **Video Downloader**: YouTube to MP4/MP3 converter (multi-platform support)
- **AI Content Tools**: Hook generation and viral pattern analysis
- **Competition Analysis**: See what's working in your niche

### FREE Bonus: Creator Camp Academy ($997 Value)
- 40+ video modules on YouTube monetization
- Learn from creators earning $130K+/month
- Topics: Automation, scaling, team building, monetization
- Lifetime access with all plans

### Security & Authentication
- **Role-Based Access Control**: FREE_TRIAL, SAAS_SUBSCRIBER, COURSE_MEMBER, ADMIN
- **Enterprise Security**: Comprehensive audit logging and rate limiting
- **OAuth & Credentials**: Multiple authentication methods including Discord OAuth
- **Course Code System**: Special access codes for course purchasers
- **Admin Bypass**: Secure admin codes for testing and support

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.4, React 19.1.0, Tailwind CSS 4.1.10
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (SQLite for development)
- **Authentication**: NextAuth.js with JWT & Discord OAuth
- **External APIs**: YouTube Data API v3
- **Charts**: Recharts for data visualization
- **Video Processing**: yt-dlp-wrap integration
- **Deployment**: Render, Vercel compatible

## 📋 Prerequisites

- Node.js 18+ and npm
- YouTube Data API key
- PostgreSQL database (or SQLite for development)
- Stripe account (for payments - optional)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/socialanalytics.git
   cd socialanalytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"  # SQLite for dev
   
   # YouTube API
   YOUTUBE_API_KEY=your_youtube_api_key
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
   
   # Discord OAuth (optional)
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_GUILD_ID=your_discord_guild_id
   DISCORD_COURSE_ROLE_ID=your_course_role_id
   
   # Admin Access
   ADMIN_MASTER_CODE=your_secure_admin_code
   
   # Stripe (optional)
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔐 Admin Setup

To set up admin users:

```bash
npx tsx scripts/setup-admin.ts
```

Follow the prompts to create or promote admin users. Admin users can:
- Generate discount codes
- Manage user roles
- View audit logs
- Access usage statistics

### Course Member Codes

Generate course member access codes:

```bash
npx tsx scripts/generate-codes.ts
```

This creates 50 unique course codes for distribution to course purchasers.

## 📁 Project Structure

```
socialanalytics/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/         # API routes
│   │   │   ├── admin/   # Admin-only endpoints
│   │   │   ├── auth/    # Authentication endpoints
│   │   │   └── analyze/ # Analytics endpoints
│   │   ├── admin/       # Admin dashboard
│   │   ├── auth/        # Authentication pages
│   │   ├── tools/       # Course member tools
│   │   ├── course/      # Course information page
│   │   └── dashboard/   # User dashboard
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   │   ├── admin.ts     # Admin utilities
│   │   ├── auth.ts      # Authentication config
│   │   ├── youtube-api.ts # YouTube API wrapper
│   │   └── rate-limiter.ts # Rate limiting
│   ├── hooks/           # Custom React hooks
│   └── styles/          # Global styles
├── prisma/
│   └── schema.prisma    # Database schema
├── scripts/
│   ├── setup-admin.ts   # Admin setup script
│   └── generate-codes.ts # Course code generator
├── docs/
│   ├── SECURITY.md      # Security documentation
│   └── authentication-system.md
└── PRODUCT-OVERVIEW.md  # Complete product documentation
```

## 📊 API Endpoints

### Public Endpoints

#### GET /api/analyze
Analyzes a YouTube channel and returns comprehensive analytics.

**Parameters:**
- `url` (required): YouTube channel URL or handle

**Example:**
```
GET /api/analyze?url=youtube.com/@MrBeast
```

### Protected Endpoints

#### GET /api/user/analyses
Get user's analysis history (requires authentication)

#### GET /api/user/usage-stats
Get user's usage statistics

### Admin Endpoints

#### POST /api/admin/discount-codes
Generate new discount codes (admin only)

#### GET /api/admin/users
List and manage users (admin only)

#### GET /api/admin/audit-logs
View security audit logs (admin only)

## 🔒 Security Features

### Rate Limiting
- **Global**: 100 req/min/IP
- **Auth**: 5 req/min/IP (login/signup)
- **API**: 30 req/min/user
- **Admin**: 10 req/min/user
- **YouTube**: 10 req/min/user (protects quota)

### Audit Logging
All admin actions are logged with:
- User information
- Action performed
- IP address
- Timestamp
- Severity level

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-XSS-Protection
- Strict Transport Security

See [docs/SECURITY.md](docs/SECURITY.md) for detailed security documentation.

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Add build command: `npm run build`
5. Add start command: `npm run start`

### Deploy to Vercel

1. Import project to Vercel
2. Configure environment variables
3. Deploy (automatic from GitHub)

### Environment Variables

Required for production:
```env
DATABASE_URL=postgresql://...
YOUTUBE_API_KEY=...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=... (if using payments)
STRIPE_WEBHOOK_SECRET=... (if using payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=... (if using payments)
```

## 📈 Usage Limits & Access Levels

### Free Trial
- 3 channel analyses
- Basic features only
- Upgrade prompts after limit

### Course Members (FREE with code)
- Unlimited channel analyses
- All pro tools unlocked
- Video downloader access
- Priority support
- Creator Camp Academy access

### SaaS Subscribers (Coming Soon)
- Everything in Course Members
- API access
- Bulk analysis
- White-label options

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:migrate      # Run database migrations
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio

# Admin
npx tsx scripts/setup-admin.ts      # Set up admin users
npx tsx scripts/generate-codes.ts   # Generate course codes

# Testing
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## 🎨 Design System

The app uses a consistent design system with:
- YouTube-inspired color scheme
- Dark mode optimized
- Responsive breakpoints
- Accessible components
- Smooth animations

## 🛣️ Roadmap

### Recently Completed
- [x] Discord OAuth integration
- [x] Course member access system
- [x] Video downloader integration
- [x] Modern tools dashboard
- [x] Intelligent insights with AI

### Coming Soon
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Competitor analysis
- [ ] Thumbnail A/B testing
- [ ] Title optimization AI
- [ ] Sponsorship calculator
- [ ] Team collaboration
- [ ] API access for developers
- [ ] Webhook integrations
- [ ] Advanced analytics export

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure linting passes

## 📝 License

This project is proprietary software. All rights reserved.

## 🆘 Support

- **Documentation**: See `/docs` folder and `PRODUCT-OVERVIEW.md`
- **Issues**: GitHub Issues
- **Email**: support@insightsync.io
- **Discord**: [Join our community](#)

## 💡 Quick Start Guide

1. Visit the landing page
2. Click "Analyze Your Channel" 
3. Enter any YouTube channel URL
4. Get instant insights and revenue estimates
5. Sign up with course code for full access
6. Access all pro tools from /tools dashboard

## 🙏 Acknowledgments

- YouTube Data API for channel data
- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS
- All contributors and testers

---

Built with ❤️ by the InsightSync team