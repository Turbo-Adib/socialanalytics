# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Name:** InsightSync - YouTube Analytics Dashboard
**Project Type:** SaaS Web Application
**Primary Goal:** To build a fast, intuitive dashboard that helps YouTube creators understand their channel's performance across different video formats (long-form vs. Shorts), analyze revenue potential, and identify key trends.
**Target Users:** YouTube content creators, channel managers, and digital marketing agencies
**Tech Stack:** Next.js, React, Tailwind CSS, PostgreSQL, YouTube Data API v3
**Project Status:** Initial development - UI shell created
**Deployment:** Render (for Next.js app and PostgreSQL database)

## Core MVP Features

### Current Statistics
- Real-time subscriber count and total views
- Breakdown by Long-Form and Shorts content
- Channel profile with auto-detected niche

### Historical Performance Charts
- Interactive charts for 6-12 months of monthly view counts
- Estimated revenue for both Long-Form and Shorts
- Side-by-side comparison visualizations

### Future Projections
- Forecasts for next month's and next year's views
- Estimated earnings based on trends
- Simple linear forecast model

### Channel Insights
- Auto-detected channel title and description
- Upload frequency analysis
- Primary niche detection based on content

### Social Listening Insights
- Top 10 common creator pain points per niche
- Sourced from social platforms
- Niche-specific recommendations

## Architecture & Technical Stack

### Frontend
- **Framework:** Next.js 15.3.4
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS 4.1.10 with @tailwindcss/postcss
- **Charts:** To be implemented (Chart.js or Recharts recommended)

### Backend
- **API:** Next.js API Routes (serverless functions)
- **Database:** PostgreSQL (hosted on Render or Supabase/Neon)
- **External APIs:** YouTube Data API v3
- **Caching:** Database-level caching with 1-2 hour refresh intervals

### Configuration
- **Environment Variables:** Stored securely on Render
- **RPM Mapping:** Configuration file at `config/rpm.js` for niche-specific revenue calculations

### AI Enhancement (MCP)
- **Sequential Thinking:** Enhanced step-by-step problem solving and complex reasoning
- **Context7:** Advanced context management and memory capabilities
- **Configuration:** See `MCP-SETUP.md` for detailed setup instructions

## Data Schema

### Table: Channels
Stores basic, slowly changing information about a channel.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | YouTube Channel ID (Primary Key) |
| channel_title | TEXT | Display title of the channel |
| description | TEXT | Full channel description |
| primary_niche | TEXT | Auto-detected niche (e.g., "Finance", "Tech") |
| upload_frequency_per_week | REAL | Average uploads per week (last 3 months) |
| thumbnail_url | TEXT | Channel profile picture URL |
| created_at | TIMESTAMPTZ | When channel was added to DB |
| last_snapshot_at | TIMESTAMPTZ | Last successful data snapshot |

### Table: ChannelSnapshots
Stores time-series data for historical charts.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Auto-incrementing primary key |
| channel_id | TEXT | Foreign key to Channels.id |
| timestamp | TIMESTAMPTZ | Date of snapshot |
| subscriber_count | INTEGER | Total subscribers |
| monthly_views_long | BIGINT | Long-form video views |
| monthly_views_shorts | BIGINT | Shorts views |
| est_revenue_long_usd | REAL | Estimated long-form revenue |
| est_revenue_shorts_usd | REAL | Estimated Shorts revenue |

## Project Structure

```
socialanalytics/
├── components/           # React components
│   ├── Header.js        # Navigation header
│   ├── AnalysisForm.js  # Channel URL input form
│   └── [future components]
├── pages/               # Next.js pages
│   ├── index.js        # Landing page
│   ├── _app.js         # App wrapper
│   └── api/            # API routes (to be created)
│       └── analyze.js  # Main analysis endpoint
├── styles/              # CSS files
│   └── globals.css     # Tailwind imports
├── config/              # Configuration files (to be created)
│   └── rpm.js          # Niche RPM mappings
├── utils/               # Helper functions (to be created)
│   ├── youtube.js      # YouTube API wrapper
│   ├── database.js     # Database utilities
│   └── calculations.js # Revenue calculations
├── lib/                 # External libraries setup (to be created)
├── public/              # Static assets
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── .env.example         # Environment template (to be created)
└── CLAUDE.md           # This file
```

## API Routes

### GET /api/analyze?url=[channelUrl]
Primary endpoint that powers the dashboard.

**Logic Flow:**
1. Receive YouTube channel URL or handle
2. Parse URL to extract channel ID
3. Check PostgreSQL cache (1-hour freshness)
4. If cache miss:
   - Call YouTube Data API for current stats
   - Fetch recent videos and categorize
   - Detect niche and calculate revenue
   - Generate forecasts
5. Update database with new snapshot
6. Return comprehensive JSON response

**Response Structure:**
```json
{
  "channel": {
    "id": "string",
    "title": "string",
    "description": "string",
    "niche": "string",
    "subscribers": number,
    "thumbnailUrl": "string"
  },
  "currentStats": {
    "totalViews": number,
    "longFormViews": number,
    "shortsViews": number,
    "uploadFrequency": number
  },
  "historicalData": [
    {
      "month": "YYYY-MM",
      "longFormViews": number,
      "shortsViews": number,
      "estRevenueLong": number,
      "estRevenueShorts": number
    }
  ],
  "projections": {
    "nextMonth": {...},
    "nextYear": {...}
  },
  "socialInsights": [...]
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Future commands to be added:
# npm run db:migrate    # Run database migrations
# npm run db:seed       # Seed test data
# npm run test          # Run test suite
# npm run lint          # Run linter
```

## Environment Variables

Create a `.env.local` file with:

```bash
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key_here

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Future additions:
# REDIS_URL=           # For advanced caching
# SENTRY_DSN=          # For error tracking
# ANALYTICS_ID=        # For usage analytics
```

## Current Progress

### Completed ✓
- [x] Project initialization with Next.js
- [x] Tailwind CSS setup and configuration
- [x] Header component with navigation
- [x] AnalysisForm component with input field
- [x] Landing page layout

### In Progress
- [ ] YouTube API integration
- [ ] PostgreSQL database setup
- [ ] API route implementation

### Next Steps (Priority Order)
1. **Database Setup**
   - Install PostgreSQL dependencies
   - Create database schema
   - Set up connection utilities

2. **YouTube API Integration**
   - Create API wrapper utilities
   - Implement channel data fetching
   - Add video categorization logic

3. **Analysis API Route**
   - Implement `/api/analyze` endpoint
   - Add caching logic
   - Create revenue calculations

4. **Dashboard Components**
   - Channel profile card
   - Historical charts
   - Projection cards
   - Social insights display

5. **Testing & Optimization**
   - Add error handling
   - Implement loading states
   - Optimize API calls

## Coding Standards

### Code Style
- **Language:** JavaScript/JSX
- **Style Guide:** Airbnb JavaScript Style Guide
- **Components:** Functional components with hooks
- **Naming:** camelCase for variables, PascalCase for components
- **Files:** Component files match component names

### Git Workflow
- **Branches:** feature/*, fix/*, refactor/*
- **Commits:** Conventional commits (feat:, fix:, docs:, etc.)
- **PRs:** Descriptive titles and descriptions

### Best Practices
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper error boundaries
- Implement proper loading and error states
- Follow accessibility guidelines

## Future Enhancements (Post-MVP)

### Dashboard Features
- Customizable dashboard layouts
- Advanced filtering and segmentation
- Channel comparison tools
- Detailed revenue breakdowns
- Engagement metrics tracking
- Traffic source analysis
- Audience demographics

### Data & Automation
- Batch channel imports
- Data export (CSV, PDF)
- Automated email reports
- Performance alerts
- Webhook integrations

### Business Features
- User accounts and authentication
- Team collaboration
- Saved reports and templates
- Affiliate link tracking
- Sponsorship value estimation

## AI Assistant Instructions

When working on this project:

1. **Always refer to this document** for project context and standards
2. **Follow the established patterns** in existing components
3. **Consider the data schema** when implementing features
4. **Use the YouTube API efficiently** to avoid quota limits
5. **Implement proper error handling** for all API calls
6. **Write clean, commented code** that follows our standards
7. **Update this document** when adding significant features

### MCP (Model Context Protocol) Integration

This project is configured with MCP servers to enhance AI assistance:

1. **Sequential Thinking Server** - Use this for:
   - Breaking down complex features into manageable steps
   - Planning implementation strategies
   - Tracking progress through multi-step tasks
   - Debugging complex issues systematically

2. **Context7 Server** - Use this for:
   - Maintaining context across long development sessions
   - Remembering project-specific patterns and decisions
   - Quick access to previously discussed solutions
   - Enhanced understanding of codebase relationships

These tools are available when using Claude Desktop with proper MCP configuration. See `MCP-SETUP.md` for setup details.

### For New Features
- Check if similar patterns exist in the codebase
- Consider both frontend and backend requirements
- Plan for loading states and error handling
- Think about caching and performance
- Update relevant documentation

### For Bug Fixes
- Identify the root cause, not just symptoms
- Test edge cases thoroughly
- Consider impact on other features
- Add comments explaining the fix
- Update tests if applicable

Remember: This is an MVP focused on delivering core value quickly while maintaining code quality and planning for future scalability.