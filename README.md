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

### Security & Authentication
- **Role-Based Access Control**: FREE_TRIAL, SAAS_SUBSCRIBER, COURSE_MEMBER, ADMIN
- **Enterprise Security**: Comprehensive audit logging and rate limiting
- **OAuth & Credentials**: Multiple authentication methods
- **Course Code System**: Special access for course purchasers

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (SQLite for development)
- **Authentication**: NextAuth.js with JWT
- **External APIs**: YouTube Data API v3
- **Charts**: Recharts for data visualization
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
│   └── setup-admin.ts   # Admin setup script
└── docs/
    ├── SECURITY.md      # Security documentation
    └── authentication-system.md
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

## 📈 Usage Limits

- **Free Trial**: 3 analyses
- **Course Members**: Unlimited analyses
- **SaaS Subscribers**: Based on plan

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
npx tsx scripts/setup-admin.ts  # Set up admin users

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

- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues
- **Email**: support@insightsync.io
- **Discord**: [Join our community](#)

## 🙏 Acknowledgments

- YouTube Data API for channel data
- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Tailwind CSS for the utility-first CSS
- All contributors and testers

---

Built with ❤️ by the InsightSync team