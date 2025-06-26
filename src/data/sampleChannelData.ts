export const sampleMidTierChannel = {
  channel: {
    id: "UC_sample_mid_tier_channel",
    title: "TechTalk Weekly",
    description: "Weekly technology reviews, tutorials, and industry insights for tech enthusiasts and professionals.",
    thumbnailUrl: "https://via.placeholder.com/800x800/4285f4/ffffff?text=TT",
    subscriberCount: 125000,
    totalViews: 8500000,
    videoCount: 156,
    niche: "Technology",
    monetization: {
      isMonetized: true,
      status: "monetized",
      lastChecked: new Date().toISOString(),
      badge: "green"
    }
  },
  currentStats: {
    totalViews: 890000,
    longFormViews: 720000,
    shortsViews: 170000,
    uploadFrequency: 2.5
  },
  historicalData: [
    { month: "2024-05", longFormViews: 95000, shortsViews: 15000, estRevenueLong: 380, estRevenueShorts: 45 },
    { month: "2024-06", longFormViews: 102000, shortsViews: 18000, estRevenueLong: 408, estRevenueShorts: 54 },
    { month: "2024-07", longFormViews: 115000, shortsViews: 22000, estRevenueLong: 460, estRevenueShorts: 66 },
    { month: "2024-08", longFormViews: 98000, shortsViews: 16000, estRevenueLong: 392, estRevenueShorts: 48 },
    { month: "2024-09", longFormViews: 125000, shortsViews: 28000, estRevenueLong: 500, estRevenueShorts: 84 },
    { month: "2024-10", longFormViews: 118000, shortsViews: 31000, estRevenueLong: 472, estRevenueShorts: 93 },
    { month: "2024-11", longFormViews: 132000, shortsViews: 35000, estRevenueLong: 528, estRevenueShorts: 105 },
    { month: "2024-12", longFormViews: 140000, shortsViews: 40000, estRevenueLong: 560, estRevenueShorts: 120 }
  ],
  projections: {
    nextMonth: { views: 185000, revenue: 740 },
    nextYear: { views: 2100000, revenue: 8400 }
  },
  recentVideos: [
    {
      id: "video1",
      title: "iPhone 16 Pro vs Galaxy S24 Ultra: The ULTIMATE Camera Test",
      views: 285000,
      likeCount: 12400,
      commentCount: 1850,
      publishedAt: "2024-12-20T10:00:00Z",
      isShort: false,
      estimatedRevenue: 1140,
      performance: "high" as const,
      engagementRate: 0.048
    },
    {
      id: "video2", 
      title: "Best Budget Laptops Under $800 in 2024",
      views: 165000,
      likeCount: 8200,
      commentCount: 920,
      publishedAt: "2024-12-18T14:30:00Z",
      isShort: false,
      estimatedRevenue: 660,
      performance: "average" as const,
      engagementRate: 0.055
    },
    {
      id: "video3",
      title: "MacBook Air M3 Quick Setup Guide",
      views: 45000,
      likeCount: 2100,
      commentCount: 180,
      publishedAt: "2024-12-17T09:15:00Z",
      isShort: true,
      estimatedRevenue: 135,
      performance: "average" as const,
      engagementRate: 0.051
    },
    {
      id: "video4",
      title: "Why I'm Switching Back to Android After 5 Years",
      views: 520000,
      likeCount: 18500,
      commentCount: 3200,
      publishedAt: "2024-12-15T16:00:00Z",
      isShort: false,
      estimatedRevenue: 2080,
      performance: "high" as const,
      engagementRate: 0.042
    },
    {
      id: "video5",
      title: "Tesla Model 3 Highland Review: Worth the Upgrade?",
      views: 92000,
      likeCount: 4800,
      commentCount: 650,
      publishedAt: "2024-12-13T12:00:00Z",
      isShort: false,
      estimatedRevenue: 368,
      performance: "low" as const,
      engagementRate: 0.059
    },
    {
      id: "video6",
      title: "AirPods Pro 3 Leaked Features!",
      views: 78000,
      likeCount: 3200,
      commentCount: 280,
      publishedAt: "2024-12-12T08:30:00Z",
      isShort: true,
      estimatedRevenue: 234,
      performance: "average" as const,
      engagementRate: 0.045
    },
    {
      id: "video7",
      title: "The Future of Gaming: RTX 5090 First Look",
      views: 195000,
      likeCount: 9800,
      commentCount: 1400,
      publishedAt: "2024-12-10T15:45:00Z",
      isShort: false,
      estimatedRevenue: 780,
      performance: "average" as const,
      engagementRate: 0.057
    },
    {
      id: "video8",
      title: "ChatGPT vs Claude AI: Which is Better for Coding?",
      views: 145000,
      likeCount: 7200,
      commentCount: 950,
      publishedAt: "2024-12-08T11:20:00Z",
      isShort: false,
      estimatedRevenue: 580,
      performance: "average" as const,
      engagementRate: 0.056
    }
  ],
  insights: [
    "Your tech reviews perform 35% better than tutorial content",
    "Shorts posted on weekends get 2x more engagement",
    "Camera comparison videos consistently hit 200K+ views",
    "Your audience engagement peaks between 2-4 PM EST"
  ]
};