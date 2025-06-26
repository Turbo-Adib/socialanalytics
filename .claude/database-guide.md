# Database Guide - Prisma & PostgreSQL

## Prisma Setup & Configuration

### Schema Location
```
prisma/
├── schema.prisma       # Database schema
├── migrations/         # Migration history
├── seed.ts            # Seed data script
└── dev.db            # SQLite dev database
```

### Environment Configuration
```bash
# Development (SQLite)
DATABASE_URL="file:./dev.db"

# Production (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

## Schema Design Principles

### Naming Conventions
- **Models**: PascalCase singular (e.g., `Channel`, `VideoAnalysis`)
- **Fields**: camelCase with @map for DB (e.g., `channelTitle @map("channel_title")`)
- **Tables**: snake_case plural with @@map (e.g., `@@map("channels")`)
- **Relations**: Descriptive names matching the related model

### Current Schema Overview

```prisma
model Channel {
  id                      String            @id
  channelTitle            String            @map("channel_title")
  description             String?
  primaryNiche            String?           @map("primary_niche")
  uploadFrequencyPerWeek  Float?            @map("upload_frequency_per_week")
  thumbnailUrl            String?           @map("thumbnail_url")
  isMonetized             Boolean?          @map("is_monetized")
  monetizationLastChecked DateTime?         @map("monetization_last_checked")
  createdAt               DateTime          @default(now()) @map("created_at")
  lastSnapshotAt          DateTime?         @map("last_snapshot_at")
  
  // Relations
  snapshots               ChannelSnapshot[]
  videoAnalysis           VideoAnalysis[]
  analysisCache           AnalysisCache?
  
  @@map("channels")
}
```

### Data Types Best Practices
- Use `String` for IDs (YouTube channel IDs)
- Use `BigInt` for large numbers (view counts)
- Use `Float` for decimals (revenue, RPM)
- Use `DateTime` with timezone awareness
- Use optional fields (`?`) appropriately

## Common Query Patterns

### Basic CRUD Operations

```typescript
// Create
const channel = await prisma.channel.create({
  data: {
    id: channelId,
    channelTitle: title,
    description: description,
    primaryNiche: detectedNiche,
  },
});

// Read with relations
const channel = await prisma.channel.findUnique({
  where: { id: channelId },
  include: {
    snapshots: {
      orderBy: { timestamp: 'desc' },
      take: 12, // Last 12 months
    },
    analysisCache: true,
  },
});

// Update
const updated = await prisma.channel.update({
  where: { id: channelId },
  data: { 
    lastSnapshotAt: new Date(),
    uploadFrequencyPerWeek: frequency,
  },
});

// Delete (rarely used)
await prisma.channel.delete({
  where: { id: channelId },
});
```

### Upsert Pattern
```typescript
// Create or update channel
const channel = await prisma.channel.upsert({
  where: { id: channelId },
  update: {
    channelTitle: newTitle,
    lastSnapshotAt: new Date(),
  },
  create: {
    id: channelId,
    channelTitle: newTitle,
    description: description,
    createdAt: new Date(),
  },
});
```

### Transaction Patterns
```typescript
// Atomic operations
const result = await prisma.$transaction(async (tx) => {
  // Update channel
  const channel = await tx.channel.update({
    where: { id: channelId },
    data: { lastSnapshotAt: new Date() },
  });

  // Create snapshot
  const snapshot = await tx.channelSnapshot.create({
    data: {
      channelId: channelId,
      subscriberCount: stats.subscriberCount,
      monthlyViewsLong: longFormViews,
      monthlyViewsShorts: shortsViews,
      estRevenueLongUsd: calculateRevenue(longFormViews, rpm),
      estRevenueShortsUsd: calculateRevenue(shortsViews, 0.15),
    },
  });

  // Update cache
  await tx.analysisCache.upsert({
    where: { channelId },
    update: {
      lastFullFetch: new Date(),
      cacheExpiresAt: new Date(Date.now() + cacheHours * 60 * 60 * 1000),
    },
    create: {
      channelId,
      tier: 'free',
      videosAnalyzed: videoCount,
      totalVideoCount: totalVideos,
      lastFullFetch: new Date(),
      cacheExpiresAt: new Date(Date.now() + cacheHours * 60 * 60 * 1000),
      cacheDurationHours: cacheHours,
    },
  });

  return { channel, snapshot };
});
```

### Aggregation Queries
```typescript
// Calculate average views
const avgViews = await prisma.videoAnalysis.aggregate({
  where: {
    channelId: channelId,
    isShort: false,
  },
  _avg: {
    viewCount: true,
  },
});

// Count videos by type
const videoCounts = await prisma.videoAnalysis.groupBy({
  by: ['isShort'],
  where: { channelId },
  _count: true,
});

// Get monthly totals
const monthlyStats = await prisma.channelSnapshot.findMany({
  where: {
    channelId,
    timestamp: {
      gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Last year
    },
  },
  orderBy: { timestamp: 'asc' },
});
```

## Performance Optimization

### Indexing Strategy
```prisma
model VideoAnalysis {
  // ... fields ...
  
  @@unique([channelId, videoId])  // Compound unique constraint
  @@index([channelId, publishedAt])  // For timeline queries
  @@index([isShort, viewCount])  // For outlier detection
}
```

### Query Optimization
```typescript
// Bad: N+1 query problem
const channels = await prisma.channel.findMany();
for (const channel of channels) {
  const snapshots = await prisma.channelSnapshot.findMany({
    where: { channelId: channel.id },
  });
}

// Good: Single query with includes
const channels = await prisma.channel.findMany({
  include: {
    snapshots: {
      orderBy: { timestamp: 'desc' },
      take: 1,
    },
  },
});

// Better: Select only needed fields
const channels = await prisma.channel.findMany({
  select: {
    id: true,
    channelTitle: true,
    snapshots: {
      select: {
        subscriberCount: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
      take: 1,
    },
  },
});
```

### Connection Management
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

## Migration Best Practices

### Creating Migrations
```bash
# Create migration after schema changes
npm run db:migrate

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Migration Naming
- Use descriptive names: `add_monetization_fields`
- Include action and target: `create_analysis_cache_table`
- Date is automatically prefixed

### Safe Migration Patterns
```prisma
// Adding nullable field (safe)
model Channel {
  newField String?  // Nullable by default
}

// Adding with default (safe)
model Channel {
  status String @default("active")
}

// Renaming field (use @map)
model Channel {
  channelTitle String @map("channel_title")  // Old: title
}
```

## Data Validation

### Database-Level Constraints
```prisma
model NicheRpmRate {
  minRpmUsd     Float     @map("min_rpm_usd")
  maxRpmUsd     Float     @map("max_rpm_usd")
  confidence    String    // Should be enum in production
  
  // Add check constraint in migration
  // CHECK (min_rpm_usd <= max_rpm_usd)
}
```

### Application-Level Validation
```typescript
// Validate before insert
async function createChannelSnapshot(data: SnapshotData) {
  // Validate views are non-negative
  if (data.monthlyViewsLong < 0 || data.monthlyViewsShorts < 0) {
    throw new Error('View counts cannot be negative');
  }

  // Validate revenue calculations
  const expectedRevenue = calculateRevenue(data.views, data.rpm);
  if (Math.abs(data.revenue - expectedRevenue) > 0.01) {
    throw new Error('Revenue calculation mismatch');
  }

  return prisma.channelSnapshot.create({ data });
}
```

## Seeding Data

### Seed Script Pattern
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed niche RPM rates
  const niches = [
    { niche: 'finance', displayName: 'Finance', minRpmUsd: 12, maxRpmUsd: 20 },
    { niche: 'tech', displayName: 'Technology', minRpmUsd: 8, maxRpmUsd: 15 },
    // ... more niches
  ];

  for (const niche of niches) {
    await prisma.nicheRpmRate.upsert({
      where: { niche: niche.niche },
      update: {},
      create: {
        ...niche,
        averageRpmUsd: (niche.minRpmUsd + niche.maxRpmUsd) / 2,
        confidence: 'high',
        dataSource: 'Industry research',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Error Handling

### Prisma Error Types
```typescript
import { Prisma } from '@prisma/client';

try {
  await prisma.channel.create({ data });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      console.error('Channel already exists');
    } else if (error.code === 'P2025') {
      // Record not found
      console.error('Channel not found');
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // Invalid data provided
    console.error('Validation error:', error.message);
  }
  throw error;
}
```

## Maintenance Tasks

### Database Cleanup
```typescript
// Remove old snapshots
async function cleanupOldSnapshots() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await prisma.channelSnapshot.deleteMany({
    where: {
      timestamp: { lt: sixMonthsAgo },
      channel: {
        analysisCache: {
          tier: 'free', // Only cleanup free tier
        },
      },
    },
  });
}

// Run as cron job
setInterval(cleanupOldSnapshots, 24 * 60 * 60 * 1000); // Daily
```

### Performance Monitoring
```typescript
// Log slow queries
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) { // Over 1 second
    console.warn('Slow query detected:', {
      query: e.query,
      duration: e.duration,
      params: e.params,
    });
  }
});
```