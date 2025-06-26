# YouTube Analytics Dashboard - Project Context

## Project Overview

**InsightSync** is a YouTube Analytics Dashboard SaaS application designed to help content creators understand their channel performance, analyze revenue potential, and identify growth opportunities.

## Core Business Logic

### YouTube API Integration

#### Quota Management
- **Daily Quota**: 10,000 units per project
- **Cost per operation**:
  - Channel details: 1 unit
  - Video list: 1 unit per request
  - Video details: 1 unit per video
- **Optimization strategies**:
  - Cache responses for 15 minutes minimum
  - Batch video requests (max 50 per call)
  - Use field filters to request only needed data
  - Implement tiered analysis based on channel size

#### Channel ID Extraction
- Support multiple URL formats:
  - `youtube.com/channel/UC...`
  - `youtube.com/c/customname`
  - `youtube.com/@handle`
  - `youtube.com/user/username`
- Handle edge cases for special characters and international URLs

### Revenue Calculation Standards

#### RPM (Revenue Per Mille) Mapping
- **Long-form videos**: Niche-specific RPM rates
  - Finance: $12-20 USD
  - Technology: $8-15 USD
  - Gaming: $2-5 USD
  - Education: $5-10 USD
- **Shorts**: Fixed rate of $0.15 USD per 1000 views
- **Calculation**: `revenue = (views / 1000) * rpm`

#### Monetization Detection
- Check for monetization indicators:
  - Channel has 1000+ subscribers
  - Videos have mid-roll ad placements
  - Channel join button presence
  - Super Thanks availability
- Refresh monetization status every 30 days
- Store status with timestamp for transparency

### Data Accuracy Strategies

#### View Count Validation
- **Multi-source verification**:
  1. YouTube Data API (primary source)
  2. RSS feed validation (secondary)
  3. Manual scraping fallback
- **Accuracy thresholds**:
  - Exact match: High confidence
  - Within 5%: Acceptable variance
  - Over 5%: Flag for review

#### Historical Data Collection
- Collect last 12 months of data
- Monthly aggregation for performance
- Separate tracking for Shorts vs Long-form
- Store snapshots for trend analysis

### Caching Strategy

#### Tiered Cache Duration
```javascript
const getCacheDuration = (uploadFrequency) => {
  if (uploadFrequency > 7) return 2;    // Very active: 2 hours
  if (uploadFrequency > 3) return 6;    // Active: 6 hours  
  if (uploadFrequency > 1) return 12;   // Moderate: 12 hours
  return 24;                             // Inactive: 24 hours
};
```

#### Cache Invalidation
- Manual refresh option for users
- Automatic refresh on significant changes
- Incremental updates for active channels

### Niche Detection Algorithm

1. **Video Title/Description Analysis**
   - Extract keywords from recent 50 videos
   - Match against niche keyword database
   - Weight by video performance

2. **Category Mapping**
   - Use YouTube category IDs
   - Map to internal niche categories
   - Handle multi-niche channels

3. **Confidence Scoring**
   - High: 80%+ videos match niche
   - Medium: 50-79% match
   - Low: Under 50% match

### Outlier Analysis

#### Video Performance Outliers
- **Long-form outliers**: 3x average views
- **Shorts outliers**: 5x average views
- **Pattern extraction**:
  - Title patterns
  - Thumbnail styles
  - Upload timing
  - Topic clustering

#### Revenue Impact
- Calculate multiplier effect
- Project potential with optimization
- Provide actionable insights

## User Experience Priorities

### Dashboard Features
1. **Real-time Statistics**
   - Current subscriber count
   - Total channel views
   - Upload frequency

2. **Historical Performance**
   - 12-month view trends
   - Revenue estimates
   - Growth trajectories

3. **Future Projections**
   - Next month forecast
   - Annual projections
   - Scenario planning

4. **Actionable Insights**
   - Content optimization tips
   - Best performing patterns
   - Niche-specific advice

### Data Transparency
- Show data sources
- Display last update time
- Explain calculation methods
- Provide confidence levels

### Performance Requirements
- Initial load: < 3 seconds
- Data refresh: < 5 seconds
- Chart rendering: < 1 second
- Smooth animations

## Technical Constraints

### Database Limits
- SQLite for development
- PostgreSQL for production
- Connection pooling required
- Query optimization critical

### API Rate Limits
- YouTube: 10,000 units/day
- Implement exponential backoff
- Queue system for batch processing
- Fallback mechanisms

### Deployment Constraints
- Serverless functions (Vercel/Render)
- Cold start optimization
- Edge caching where possible
- CDN for static assets

## Business Model Considerations

### Free Tier
- Basic analysis (last 6 months)
- Standard caching (24 hours)
- Limited to 5 analyses/day

### Premium Tier
- Full historical data (12+ months)
- Priority caching (2 hours)
- Unlimited analyses
- API access

### Enterprise
- Custom caching rules
- Bulk channel analysis
- White-label options
- Priority support

## Compliance & Ethics

### Data Privacy
- No personal viewer data storage
- Channel data used only for analysis
- Transparent data usage policy
- GDPR compliance

### YouTube ToS Compliance
- Respect API quotas
- No scraping of private data
- Proper attribution
- No automation of YouTube actions

### Revenue Disclaimers
- Estimates only, not guarantees
- Based on industry averages
- Multiple factors affect actual revenue
- Clear disclaimer on all revenue data