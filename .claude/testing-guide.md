# Testing Guide

## Testing Strategy Overview

### Testing Pyramid
1. **Unit Tests** (70%) - Fast, isolated function tests
2. **Integration Tests** (20%) - API routes, database operations
3. **E2E Tests** (10%) - Critical user journeys

### Test File Organization
```
src/
├── components/
│   ├── Dashboard.tsx
│   └── Dashboard.test.tsx      # Component tests
├── utils/
│   ├── calculations.ts
│   └── calculations.test.ts    # Utility tests
├── app/api/analyze/
│   ├── route.ts
│   └── route.test.ts          # API route tests
└── __tests__/                 # E2E and integration tests
    ├── integration/
    └── e2e/
```

## Unit Testing

### Component Testing Pattern
```typescript
// Dashboard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { mockAnalytics } from '@/__mocks__/analytics';

describe('Dashboard', () => {
  it('should display channel title', () => {
    render(<Dashboard analytics={mockAnalytics} onReset={jest.fn()} />);
    
    expect(screen.getByText(mockAnalytics.channel.title)).toBeInTheDocument();
  });

  it('should call onReset when back button clicked', () => {
    const onReset = jest.fn();
    render(<Dashboard analytics={mockAnalytics} onReset={onReset} />);
    
    fireEvent.click(screen.getByText('Analyze Another Channel'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('should toggle between daily and monthly views', () => {
    render(<Dashboard analytics={mockAnalytics} onReset={jest.fn()} />);
    
    const monthlyButton = screen.getByText('Monthly');
    fireEvent.click(monthlyButton);
    
    expect(monthlyButton).toHaveClass('bg-gray-900');
  });
});
```

### Utility Function Testing
```typescript
// revenueCalculations.test.ts
import { 
  calculateRevenue, 
  estimateYearlyRevenue,
  detectOutliers 
} from './revenueCalculations';

describe('Revenue Calculations', () => {
  describe('calculateRevenue', () => {
    it('should calculate revenue correctly', () => {
      expect(calculateRevenue(1000000, 5.0)).toBe(5000);
      expect(calculateRevenue(500000, 0.15)).toBe(75);
    });

    it('should handle zero views', () => {
      expect(calculateRevenue(0, 5.0)).toBe(0);
    });

    it('should handle negative values gracefully', () => {
      expect(calculateRevenue(-1000, 5.0)).toBe(0);
    });
  });

  describe('detectOutliers', () => {
    const videos = [
      { viewCount: 1000 },
      { viewCount: 1200 },
      { viewCount: 5000 }, // Outlier
      { viewCount: 900 },
    ];

    it('should identify outliers correctly', () => {
      const outliers = detectOutliers(videos, 3);
      expect(outliers).toHaveLength(1);
      expect(outliers[0].viewCount).toBe(5000);
    });
  });
});
```

## Integration Testing

### API Route Testing
```typescript
// api/analyze/route.test.ts
import { GET } from './route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { YouTubeAPI } from '@/lib/youtube';

jest.mock('@/lib/youtube');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    channel: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

describe('GET /api/analyze', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 for missing URL', async () => {
    const request = new NextRequest('http://localhost:3000/api/analyze');
    const response = await GET(request);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('URL parameter is required');
  });

  it('should return cached data when available', async () => {
    const mockChannel = {
      id: 'UC123',
      channelTitle: 'Test Channel',
      lastSnapshotAt: new Date(),
      snapshots: [{ subscriberCount: 1000 }],
    };

    (prisma.channel.findUnique as jest.Mock).mockResolvedValue(mockChannel);

    const request = new NextRequest(
      'http://localhost:3000/api/analyze?url=youtube.com/c/test'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(prisma.channel.findUnique).toHaveBeenCalledWith({
      where: { id: 'UC123' },
      include: { snapshots: true },
    });
  });

  it('should fetch fresh data when cache expired', async () => {
    (prisma.channel.findUnique as jest.Mock).mockResolvedValue(null);
    
    const mockYouTubeData = {
      id: 'UC123',
      snippet: { title: 'Test Channel' },
      statistics: { subscriberCount: '1000' },
    };
    
    (YouTubeAPI.prototype.getChannel as jest.Mock).mockResolvedValue(mockYouTubeData);

    const request = new NextRequest(
      'http://localhost:3000/api/analyze?url=youtube.com/c/test'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(YouTubeAPI.prototype.getChannel).toHaveBeenCalled();
    expect(prisma.channel.upsert).toHaveBeenCalled();
  });
});
```

### Database Integration Tests
```typescript
// __tests__/integration/database.test.ts
import { prisma } from '@/lib/prisma';
import { createTestChannel, cleanupTestData } from '@/__tests__/helpers';

describe('Database Operations', () => {
  afterEach(async () => {
    await cleanupTestData();
  });

  it('should create channel with snapshots', async () => {
    const channelData = {
      id: 'TEST123',
      channelTitle: 'Test Channel',
      primaryNiche: 'tech',
    };

    const channel = await prisma.channel.create({
      data: {
        ...channelData,
        snapshots: {
          create: {
            subscriberCount: 1000,
            monthlyViewsLong: 500000,
            monthlyViewsShorts: 100000,
            estRevenueLongUsd: 5000,
            estRevenueShortsUsd: 15,
          },
        },
      },
      include: { snapshots: true },
    });

    expect(channel.id).toBe('TEST123');
    expect(channel.snapshots).toHaveLength(1);
    expect(channel.snapshots[0].subscriberCount).toBe(1000);
  });

  it('should handle upsert operations correctly', async () => {
    const channelId = 'UPSERT123';
    
    // First upsert - create
    await prisma.channel.upsert({
      where: { id: channelId },
      update: { channelTitle: 'Updated' },
      create: { id: channelId, channelTitle: 'New Channel' },
    });

    let channel = await prisma.channel.findUnique({ where: { id: channelId } });
    expect(channel?.channelTitle).toBe('New Channel');

    // Second upsert - update
    await prisma.channel.upsert({
      where: { id: channelId },
      update: { channelTitle: 'Updated Channel' },
      create: { id: channelId, channelTitle: 'New Channel' },
    });

    channel = await prisma.channel.findUnique({ where: { id: channelId } });
    expect(channel?.channelTitle).toBe('Updated Channel');
  });
});
```

## E2E Testing

### Critical User Journey Tests
```typescript
// __tests__/e2e/channel-analysis.test.ts
import { test, expect } from '@playwright/test';

test.describe('Channel Analysis Flow', () => {
  test('should analyze a channel successfully', async ({ page }) => {
    await page.goto('/');

    // Enter YouTube URL
    await page.fill('input[placeholder*="YouTube channel URL"]', 
      'https://youtube.com/@testchannel'
    );
    
    await page.click('button:has-text("Analyze Channel")');

    // Wait for loading to complete
    await page.waitForSelector('[data-testid="channel-profile"]', { 
      timeout: 10000 
    });

    // Verify dashboard elements
    await expect(page.locator('[data-testid="channel-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="subscriber-count"]')).toBeVisible();
    await expect(page.locator('[data-testid="revenue-chart"]')).toBeVisible();
  });

  test('should handle invalid URLs', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder*="YouTube channel URL"]', 
      'not-a-youtube-url'
    );
    
    await page.click('button:has-text("Analyze Channel")');

    await expect(page.locator('text=Invalid YouTube channel URL')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Check initial light mode
    const html = page.locator('html');
    await expect(html).not.toHaveClass('dark');

    // Toggle dark mode
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).toHaveClass('dark');

    // Verify persistence on reload
    await page.reload();
    await expect(html).toHaveClass('dark');
  });
});
```

## Mock Data & Fixtures

### Mock Data Structure
```typescript
// __mocks__/analytics.ts
export const mockAnalytics = {
  channel: {
    id: 'UC_TEST123',
    title: 'Test Gaming Channel',
    description: 'A test channel for gaming content',
    niche: 'gaming',
    subscribers: 150000,
    totalViews: 25000000,
    thumbnailUrl: 'https://example.com/thumb.jpg',
    uploadFrequency: 3.5,
    isMonetized: true,
    monetizationStatus: {
      isMonetized: true,
      status: 'Monetized',
      lastChecked: '2024-01-15',
      badge: '✓',
    },
  },
  currentStats: {
    totalViews: 25000000,
    dailyAverageViews: 85000,
    monthlyAverageViews: 2500000,
    uploadFrequency: 3.5,
  },
  historicalData: [
    {
      month: '2024-01',
      longFormViews: 2000000,
      shortsViews: 500000,
      estRevenueLong: 6000,
      estRevenueShorts: 75,
    },
    // ... more months
  ],
  projections: {
    nextMonth: {
      views: 2600000,
      revenue: 6200,
    },
    nextYear: {
      views: 31000000,
      revenue: 75000,
    },
  },
};
```

### YouTube API Mocks
```typescript
// __mocks__/youtube.ts
export class YouTubeAPI {
  async getChannel(channelId: string) {
    return {
      items: [{
        id: channelId,
        snippet: {
          title: 'Mock Channel',
          description: 'Mock description',
          thumbnails: {
            default: { url: 'https://example.com/thumb.jpg' },
          },
        },
        statistics: {
          viewCount: '25000000',
          subscriberCount: '150000',
          videoCount: '500',
        },
      }],
    };
  }

  async getChannelVideos(channelId: string) {
    return {
      items: [
        {
          id: { videoId: 'VIDEO1' },
          snippet: {
            title: 'Test Video 1',
            publishedAt: '2024-01-15T00:00:00Z',
          },
        },
        // ... more videos
      ],
    };
  }

  extractChannelIdFromUrl(url: string): string | null {
    if (url.includes('youtube.com')) {
      return 'UC_TEST123';
    }
    return null;
  }
}
```

## Testing Best Practices

### Test Structure
```typescript
describe('Feature/Component Name', () => {
  // Setup
  beforeEach(() => {
    // Reset mocks, initialize test data
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Specific functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = prepareTestData();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it('should handle edge case', () => {
      // Test edge cases and error conditions
    });
  });
});
```

### Assertions Best Practices
```typescript
// Prefer specific assertions
expect(channel.subscribers).toBe(150000); // Good
expect(channel.subscribers).toBeTruthy(); // Bad

// Test exact values for critical calculations
expect(calculateRevenue(1000000, 5.0)).toBe(5000); // Good
expect(calculateRevenue(1000000, 5.0)).toBeGreaterThan(0); // Bad

// Use appropriate matchers
expect(array).toHaveLength(3);
expect(object).toHaveProperty('key', 'value');
expect(fn).toHaveBeenCalledWith(expectedArgs);
```

### Performance Testing
```typescript
describe('Performance', () => {
  it('should process large dataset efficiently', () => {
    const largeDataset = generateLargeDataset(10000);
    
    const startTime = performance.now();
    processDataset(largeDataset);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(1000); // Under 1 second
  });
});
```

## Test Coverage Goals

### Coverage Targets
- **Overall**: 80% minimum
- **Critical paths**: 95% (API routes, revenue calculations)
- **UI Components**: 70% (focus on logic, not styling)
- **Utilities**: 90% (pure functions should be well-tested)

### Running Coverage Reports
```bash
# Run tests with coverage
npm test -- --coverage

# Generate HTML report
npm test -- --coverage --coverageReporters=html

# Check coverage thresholds
npm test -- --coverage --coverageThreshold='{
  "global": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  }
}'
```

## Continuous Integration

### GitHub Actions Test Pipeline
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type checking
        run: npx tsc --noEmit
        
      - name: Run unit tests
        run: npm test
        
      - name: Run integration tests
        run: npm run test:integration
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```