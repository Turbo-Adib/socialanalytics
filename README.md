# InsightSync - YouTube Analytics Dashboard

A comprehensive YouTube analytics SaaS platform that provides real-time channel insights, revenue projections, and performance tracking.

## 🚀 Features

- **Real-time Channel Analysis**: Get instant insights into any YouTube channel
- **Revenue Estimation**: Calculate estimated earnings based on views and niche
- **Historical Data**: View 12 months of performance trends
- **Future Projections**: AI-powered forecasts for growth and revenue
- **Video Analysis**: Categorize long-form vs Shorts content
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: Prisma
- **API**: YouTube Data API v3
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd socialanalytics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your YouTube API key to `.env.local`:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key_here
   DATABASE_URL="file:./dev.db"
   ```

4. Set up the database:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `YOUTUBE_API_KEY`: Your YouTube Data API v3 key
   - `DATABASE_URL`: Your PostgreSQL connection string
4. Deploy!

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📊 API Endpoints

### GET /api/analyze

Analyzes a YouTube channel and returns comprehensive analytics.

**Parameters:**
- `url` (required): YouTube channel URL or handle

**Example:**
```
GET /api/analyze?url=youtube.com/@MrBeast
```

**Response:**
```json
{
  "channel": {
    "id": "UCX6OQ3DkcsbYNE6H8uQQuVA",
    "title": "MrBeast",
    "description": "...",
    "thumbnailUrl": "...",
    "subscriberCount": 123000000,
    "totalViews": 23000000000,
    "videoCount": 741,
    "niche": "Entertainment"
  },
  "currentStats": {
    "totalViews": 23000000000,
    "longFormViews": 18000000000,
    "shortsViews": 5000000000,
    "uploadFrequency": 2.5
  },
  "historicalData": [...],
  "projections": {...},
  "recentVideos": [...]
}
```

## 🗄️ Database Schema

The application uses two main tables:

### Channels
Stores basic channel information with caching for performance.

### ChannelSnapshots
Stores historical data points for trend analysis.

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

# Utilities
npm run lint            # Run ESLint
```

## 🌟 Features in Detail

### Channel Analysis
- Automatic niche detection based on content
- Upload frequency calculation
- Subscriber and view count tracking

### Revenue Estimation
- Industry-standard RPM (Revenue Per Mille) calculations
- Niche-specific revenue multipliers
- Separate calculations for long-form vs Shorts

### Historical Charts
- Interactive line charts with Recharts
- 12-month view trends
- Revenue progression over time

### Future Projections
- Linear growth projections
- Next month and next year forecasts
- Based on recent performance trends

## 📈 Revenue Calculation

The platform uses industry-standard RPM values:

**Long-form Content:**
- Finance: $15 RPM
- Tech: $12 RPM
- Education: $10 RPM
- Gaming: $4 RPM
- Entertainment: $3.50 RPM

**Shorts Content:**
- Generally 10-20x lower than long-form
- Finance: $0.10 RPM
- Tech: $0.08 RPM
- Entertainment: $0.02 RPM

## 🚨 Error Handling

The application includes comprehensive error handling:
- YouTube API rate limiting
- Invalid channel URLs
- Network failures
- Database connection issues

## 🔒 Security

- Environment variables for sensitive data
- API key validation
- Input sanitization
- CORS protection

## 📱 Mobile Responsive

Fully responsive design that works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 UI/UX Features

- Clean, professional design
- Loading states and skeletons
- Interactive charts and graphs
- Error boundaries
- Smooth transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙋‍♂️ Support

For support, email support@insightsync.io or create an issue on GitHub.

---

Built with ❤️ using Next.js and the YouTube Data API