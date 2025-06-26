# Technology Stack Documentation

## Frontend Framework

### Next.js 15.3.4 (App Router)

#### Key Features Used
- **App Router**: Modern routing with layouts and nested routes
- **Server Components**: Default for better performance
- **Client Components**: Used for interactivity (useState, useEffect)
- **API Routes**: Built-in backend functionality
- **Image Optimization**: Next/Image for channel thumbnails
- **Font Optimization**: Next/Font for performance

#### File Structure
```
src/app/
├── layout.tsx          # Root layout with providers
├── page.tsx           # Home page
├── api/               # API routes
│   ├── analyze/       # Main analysis endpoint
│   └── outlier-analysis/  # Outlier detection
└── (routes)/          # Future page routes
```

#### Best Practices
- Use Server Components by default
- Add 'use client' only when needed
- Implement proper loading.tsx and error.tsx
- Use generateMetadata for SEO
- Leverage Suspense for streaming

### React 19.1.0

#### Patterns Used
- **Functional Components**: Exclusively used
- **Hooks**: useState, useEffect, useMemo, useCallback
- **Custom Hooks**: For reusable logic
- **Context**: For theme and global state
- **Suspense**: For loading states

#### Component Architecture
```typescript
// Standard component pattern
interface ComponentProps {
  data: DataType;
  onAction: (param: string) => void;
}

export const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // Implementation
};
```

### State Management

#### React Query (@tanstack/react-query)
```typescript
// Query pattern
const { data, isLoading, error } = useQuery({
  queryKey: ['channel', channelId],
  queryFn: () => fetchChannelData(channelId),
  staleTime: 15 * 60 * 1000, // 15 minutes
});

// Mutation pattern
const mutation = useMutation({
  mutationFn: updateChannel,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['channel'] });
  },
});
```

#### Local State
- Component state for UI (modals, forms)
- URL state for filters and settings
- Context for theme and user preferences

## Styling

### Tailwind CSS 3.4.1

#### Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        youtube: {
          red: '#FF0000',
          darkBg: '#0F0F0F',
          lightBg: '#FFFFFF',
        }
      }
    }
  }
};
```

#### Utility Patterns
```typescript
// Conditional classes with clsx
import clsx from 'clsx';

className={clsx(
  'base-styles',
  {
    'dark:bg-gray-800': isDark,
    'bg-white': !isDark,
  },
  conditionalClass && 'additional-class'
)}
```

#### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Container queries for component-level responsiveness

## Backend Technologies

### Prisma 6.10.1

#### Schema Design
- SQLite for development
- PostgreSQL for production
- Proper relations and indexes
- Type-safe queries

#### Common Patterns
```typescript
// Find with relations
const channel = await prisma.channel.findUnique({
  where: { id: channelId },
  include: {
    snapshots: {
      orderBy: { timestamp: 'desc' },
      take: 12,
    },
  },
});

// Upsert pattern
await prisma.channel.upsert({
  where: { id: channelId },
  update: { lastSnapshotAt: new Date() },
  create: { id: channelId, ...channelData },
});

// Transaction pattern
await prisma.$transaction(async (tx) => {
  const channel = await tx.channel.update(...);
  await tx.channelSnapshot.create(...);
});
```

### YouTube Data API v3

#### Integration Pattern
```typescript
class YouTubeAPI {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  async getChannel(channelId: string) {
    const response = await fetch(
      `${this.baseUrl}/channels?part=snippet,statistics&id=${channelId}&key=${this.apiKey}`
    );
    return response.json();
  }
}
```

#### Quota Optimization
- Batch requests when possible
- Use field filters
- Cache aggressively
- Implement fallbacks

## Data Visualization

### Recharts 3.0.0

#### Chart Components
```typescript
// Line chart for historical data
<LineChart data={historicalData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="views" stroke="#FF0000" />
</LineChart>

// Bar chart for comparisons
<BarChart data={comparisonData}>
  <Bar dataKey="longForm" fill="#FF0000" />
  <Bar dataKey="shorts" fill="#FFA500" />
</BarChart>
```

## Utilities & Libraries

### Axios 1.10.0
- HTTP client for external APIs
- Interceptors for error handling
- Request/response transformation

### date-fns 4.1.0
- Date formatting and manipulation
- Timezone handling
- Relative time calculations

### lucide-react 0.523.0
- Icon library
- Tree-shakeable
- Consistent design system

## Development Tools

### TypeScript 5.8.3
```typescript
// Strict configuration
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
  }
}
```

### Build Tools
- **Next.js CLI**: Development and production builds
- **PostCSS**: CSS processing with Tailwind
- **SWC**: Fast compilation (built into Next.js)

## Performance Optimization

### Code Splitting
- Automatic with Next.js dynamic imports
- Route-based splitting
- Component lazy loading

### Caching Strategy
- Static pages with ISR
- API response caching
- Database query caching
- CDN for assets

### Bundle Optimization
- Tree shaking
- Minification
- Compression (gzip/brotli)
- Image optimization

## Deployment

### Platform: Render/Vercel

#### Environment Variables
```bash
# Required
YOUTUBE_API_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=

# Optional
SENTRY_DSN=
ANALYTICS_ID=
```

#### Build Configuration
```json
{
  "build": "prisma generate && next build",
  "start": "next start",
  "postinstall": "prisma generate"
}
```

## Security Measures

### API Security
- Rate limiting
- Input validation
- CORS configuration
- API key rotation

### Data Protection
- Environment variables
- Secure headers
- HTTPS only
- SQL injection prevention (Prisma)

## Monitoring & Analytics

### Error Tracking
- Console logging for development
- Structured logging for production
- Error boundaries in React
- API error responses

### Performance Monitoring
- Core Web Vitals
- API response times
- Database query performance
- User interaction metrics