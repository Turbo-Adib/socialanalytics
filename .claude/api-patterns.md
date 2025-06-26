# API Route Patterns & Best Practices

## Next.js App Router API Routes

### File Structure
```
src/app/api/
├── analyze/
│   └── route.ts              # GET /api/analyze
├── analyze-minimal/
│   └── route.ts              # GET /api/analyze-minimal
├── outlier-analysis/
│   └── route.ts              # POST /api/outlier-analysis
└── classify-niche/
    └── route.ts              # POST /api/classify-niche
```

### Route Handler Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';

// GET handler
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const param = searchParams.get('param');

    // Validate input
    if (!param) {
      return NextResponse.json(
        { error: 'Parameter is required' },
        { status: 400 }
      );
    }

    // Business logic
    const result = await processRequest(param);

    // Return response
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate body
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Required field missing' },
        { status: 400 }
      );
    }

    // Process request
    const result = await processData(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
```

## Error Handling

### Standardized Error Response
```typescript
interface ErrorResponse {
  error: string;
  code?: string;
  details?: unknown;
}

function createErrorResponse(
  message: string,
  status: number,
  code?: string
): NextResponse {
  const response: ErrorResponse = { error: message };
  if (code) response.code = code;
  
  return NextResponse.json(response, { status });
}
```

### Error Handler Utility
```typescript
export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ValidationError) {
    return createErrorResponse(error.message, 400, 'VALIDATION_ERROR');
  }

  if (error instanceof YouTubeAPIError) {
    if (error.code === 'quotaExceeded') {
      return createErrorResponse(
        'YouTube API quota exceeded. Please try again later.',
        429,
        'QUOTA_EXCEEDED'
      );
    }
    return createErrorResponse(error.message, 400, 'YOUTUBE_API_ERROR');
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return createErrorResponse(
        'Duplicate entry',
        409,
        'DUPLICATE_ERROR'
      );
    }
  }

  return createErrorResponse(
    'An unexpected error occurred',
    500,
    'INTERNAL_ERROR'
  );
}
```

## Request Validation

### Input Validation Pattern
```typescript
import { z } from 'zod';

// Define schema
const analyzeSchema = z.object({
  url: z.string().url().refine((url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }, 'Must be a valid YouTube URL'),
  options: z.object({
    includeHistorical: z.boolean().optional(),
    timeframe: z.enum(['daily', 'monthly']).optional(),
  }).optional(),
});

// Validate in handler
export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    
    const validated = analyzeSchema.parse(searchParams);
    // Use validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

## Response Patterns

### Successful Response Structure
```typescript
interface SuccessResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
    cached: boolean;
    version: string;
  };
}

// Usage
return NextResponse.json({
  data: channelAnalytics,
  meta: {
    timestamp: new Date().toISOString(),
    cached: fromCache,
    version: '1.0',
  },
});
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Implementation
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '10');
const offset = (page - 1) * limit;

const [data, total] = await Promise.all([
  prisma.video.findMany({ skip: offset, take: limit }),
  prisma.video.count(),
]);

return NextResponse.json({
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});
```

## Caching Strategies

### Response Caching Headers
```typescript
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);
  
  // Cache for 15 minutes
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=900, stale-while-revalidate=3600'
  );
  
  return response;
}
```

### Database Caching Pattern
```typescript
async function getCachedOrFresh(channelId: string) {
  // Check cache
  const cached = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { analysisCache: true },
  });

  const cacheExpired = !cached?.analysisCache || 
    cached.analysisCache.cacheExpiresAt < new Date();

  if (cached && !cacheExpired) {
    return { data: cached, fromCache: true };
  }

  // Fetch fresh data
  const fresh = await fetchFromYouTube(channelId);
  
  // Update cache
  await prisma.channel.upsert({
    where: { id: channelId },
    update: { ...fresh, lastSnapshotAt: new Date() },
    create: { ...fresh },
  });

  return { data: fresh, fromCache: false };
}
```

## Rate Limiting

### Simple Rate Limiter
```typescript
const rateLimiter = new Map<string, { count: number; resetAt: Date }>();

function checkRateLimit(ip: string, limit = 100): boolean {
  const now = new Date();
  const record = rateLimiter.get(ip);

  if (!record || record.resetAt < now) {
    rateLimiter.set(ip, {
      count: 1,
      resetAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour
    });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Usage in handler
export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Continue with request
}
```

## Authentication & Authorization

### API Key Pattern
```typescript
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) return false;
  
  // In production, check against database
  return apiKey === process.env.API_KEY;
}

// Protected route
export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Continue with authenticated request
}
```

## Performance Optimization

### Streaming Responses
```typescript
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data
      controller.enqueue(
        encoder.encode('data: {"status": "processing"}\n\n')
      );
      
      // Process in chunks
      for await (const chunk of processLargeDataset()) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
        );
      }
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Parallel Data Fetching
```typescript
export async function GET(request: NextRequest) {
  const channelId = searchParams.get('channelId');
  
  // Fetch data in parallel
  const [channel, videos, analytics] = await Promise.all([
    fetchChannelData(channelId),
    fetchRecentVideos(channelId),
    calculateAnalytics(channelId),
  ]);
  
  return NextResponse.json({
    channel,
    videos,
    analytics,
  });
}
```

## Testing API Routes

### Testing Pattern
```typescript
// __tests__/api/analyze.test.ts
import { GET } from '@/app/api/analyze/route';
import { NextRequest } from 'next/server';

describe('GET /api/analyze', () => {
  it('should return 400 for missing URL', async () => {
    const request = new NextRequest(
      new URL('http://localhost:3000/api/analyze')
    );
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.error).toBe('URL parameter is required');
  });
  
  it('should return channel data for valid URL', async () => {
    const request = new NextRequest(
      new URL('http://localhost:3000/api/analyze?url=youtube.com/c/test')
    );
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('channel');
  });
});
```

## Common Patterns

### Health Check Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Database connection failed' },
      { status: 503 }
    );
  }
}
```

### Webhook Handler
```typescript
export async function POST(request: NextRequest) {
  // Verify webhook signature
  const signature = request.headers.get('x-webhook-signature');
  const body = await request.text();
  
  if (!verifyWebhookSignature(body, signature)) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }
  
  // Process webhook
  const data = JSON.parse(body);
  await processWebhook(data);
  
  return NextResponse.json({ received: true });
}
```