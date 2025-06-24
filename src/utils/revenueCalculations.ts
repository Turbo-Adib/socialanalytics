import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fixed Shorts RPM based on 2024 industry data
const FIXED_SHORTS_RPM = 0.15;

// Fallback RPM rates if database is unavailable
const FALLBACK_RPM = {
  'real_estate': 52.5,
  'finance': 22.5,
  'business': 20.0,
  'technology': 16.5,
  'education': 9.89,
  'health_fitness': 8.0,
  'lifestyle': 3.47,
  'gaming': 4.0,
  'digital_marketing': 10.0,
  'food_cooking': 5.0,
  'travel': 6.5,
  'entertainment': 3.0,
  'music': 2.5,
  'beauty_fashion': 7.5,
  'automotive': 9.5,
  'general': 5.0
};

// Cache for RPM rates to avoid frequent database calls
let rpmCache: Map<string, number> = new Map();
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Get accurate RPM rate for a specific niche from database
 */
export async function getNicheRPM(niche: string): Promise<number> {
  const normalizedNiche = normalizeNiche(niche);
  
  // Check cache first
  const now = Date.now();
  if (cacheTimestamp > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    const cachedRPM = rpmCache.get(normalizedNiche);
    if (cachedRPM !== undefined) {
      return cachedRPM;
    }
  }

  try {
    // Try to get from database
    const nicheRate = await prisma.nicheRpmRate.findUnique({
      where: { niche: normalizedNiche }
    });

    if (nicheRate) {
      const rpm = nicheRate.averageRpmUsd;
      rpmCache.set(normalizedNiche, rpm);
      cacheTimestamp = now;
      return rpm;
    }
  } catch (error) {
    console.warn('Database query failed, using fallback RPM:', error);
  }

  // Fallback to hardcoded rates
  const fallbackRPM = FALLBACK_RPM[normalizedNiche as keyof typeof FALLBACK_RPM] || FALLBACK_RPM.general;
  rpmCache.set(normalizedNiche, fallbackRPM);
  return fallbackRPM;
}

/**
 * Calculate accurate revenue for long-form videos
 */
export async function calculateLongFormRevenue(views: number, niche: string): Promise<number> {
  const rpm = await getNicheRPM(niche);
  return (views / 1000) * rpm;
}

/**
 * Calculate accurate revenue for Shorts using fixed rate
 */
export function calculateShortsRevenue(views: number): number {
  return (views / 1000) * FIXED_SHORTS_RPM;
}

/**
 * Calculate total revenue with separate long-form and Shorts calculations
 */
export interface RevenueBreakdown {
  longFormRevenue: number;
  shortsRevenue: number;
  totalRevenue: number;
  longFormRPM: number;
  shortsRPM: number;
  methodology: string;
}

export async function calculateTotalRevenue(
  longFormViews: number,
  shortsViews: number,
  niche: string
): Promise<RevenueBreakdown> {
  const longFormRPM = await getNicheRPM(niche);
  const longFormRevenue = (longFormViews / 1000) * longFormRPM;
  const shortsRevenue = (shortsViews / 1000) * FIXED_SHORTS_RPM;

  return {
    longFormRevenue,
    shortsRevenue,
    totalRevenue: longFormRevenue + shortsRevenue,
    longFormRPM,
    shortsRPM: FIXED_SHORTS_RPM,
    methodology: `Long-form: ${longFormViews.toLocaleString()} views × $${longFormRPM} RPM = $${longFormRevenue.toFixed(2)}. Shorts: ${shortsViews.toLocaleString()} views × $${FIXED_SHORTS_RPM} RPM = $${shortsRevenue.toFixed(2)}.`
  };
}

/**
 * Normalize niche names to match database keys
 */
function normalizeNiche(niche: string): string {
  const nicheMap: { [key: string]: string } = {
    'finance': 'finance',
    'financial': 'finance',
    'investing': 'finance',
    'money': 'finance',
    
    'tech': 'technology',
    'technology': 'technology',
    'reviews': 'technology',
    'gadgets': 'technology',
    
    'education': 'education',
    'educational': 'education',
    'tutorial': 'education',
    'learning': 'education',
    
    'business': 'business',
    'entrepreneur': 'business',
    'startup': 'business',
    'marketing': 'digital_marketing',
    
    'real estate': 'real_estate',
    'realestate': 'real_estate',
    'property': 'real_estate',
    
    'health': 'health_fitness',
    'fitness': 'health_fitness',
    'wellness': 'health_fitness',
    'workout': 'health_fitness',
    
    'lifestyle': 'lifestyle',
    'vlog': 'lifestyle',
    'daily': 'lifestyle',
    
    'gaming': 'gaming',
    'games': 'gaming',
    'esports': 'gaming',
    
    'food': 'food_cooking',
    'cooking': 'food_cooking',
    'recipe': 'food_cooking',
    
    'travel': 'travel',
    'adventure': 'travel',
    
    'entertainment': 'entertainment',
    'comedy': 'entertainment',
    'funny': 'entertainment',
    
    'music': 'music',
    'songs': 'music',
    'artist': 'music',
    
    'beauty': 'beauty_fashion',
    'fashion': 'beauty_fashion',
    'makeup': 'beauty_fashion',
    'style': 'beauty_fashion',
    
    'automotive': 'automotive',
    'cars': 'automotive',
    'auto': 'automotive'
  };

  const normalized = niche.toLowerCase().trim();
  return nicheMap[normalized] || 'general';
}

/**
 * Get RPM range for a niche (min, max, average)
 */
export async function getNicheRPMRange(niche: string): Promise<{
  min: number;
  max: number;
  average: number;
  confidence: string;
  dataSource: string;
} | null> {
  const normalizedNiche = normalizeNiche(niche);
  
  try {
    const nicheRate = await prisma.nicheRpmRate.findUnique({
      where: { niche: normalizedNiche }
    });

    if (nicheRate) {
      return {
        min: nicheRate.minRpmUsd,
        max: nicheRate.maxRpmUsd,
        average: nicheRate.averageRpmUsd,
        confidence: nicheRate.confidence,
        dataSource: nicheRate.dataSource
      };
    }
  } catch (error) {
    console.warn('Could not fetch RPM range:', error);
  }

  return null;
}

/**
 * Apply seasonal adjustments to RPM (basic implementation)
 */
export function applySeasonalAdjustment(baseRPM: number, month: number): number {
  // Higher RPM during Q4 (October-December) due to holiday advertising
  const seasonalMultipliers = [
    0.95, // January
    0.95, // February
    1.0,  // March
    1.0,  // April
    1.0,  // May
    1.0,  // June
    1.0,  // July
    1.0,  // August
    1.05, // September
    1.15, // October
    1.20, // November
    1.25  // December
  ];
  
  return baseRPM * seasonalMultipliers[month - 1];
}

/**
 * Estimate revenue range with confidence intervals
 */
export async function calculateRevenueRange(
  longFormViews: number,
  shortsViews: number,
  niche: string
): Promise<{
  conservative: number;
  realistic: number;
  optimistic: number;
  methodology: string;
}> {
  const rpmRange = await getNicheRPMRange(niche);
  
  if (!rpmRange) {
    const fallbackRPM = await getNicheRPM(niche);
    const revenue = await calculateTotalRevenue(longFormViews, shortsViews, niche);
    return {
      conservative: revenue.totalRevenue * 0.8,
      realistic: revenue.totalRevenue,
      optimistic: revenue.totalRevenue * 1.2,
      methodology: `Using fallback RPM data for ${niche} niche.`
    };
  }

  const conservativeRevenue = (longFormViews / 1000) * rpmRange.min + (shortsViews / 1000) * FIXED_SHORTS_RPM;
  const realisticRevenue = (longFormViews / 1000) * rpmRange.average + (shortsViews / 1000) * FIXED_SHORTS_RPM;
  const optimisticRevenue = (longFormViews / 1000) * rpmRange.max + (shortsViews / 1000) * FIXED_SHORTS_RPM;

  return {
    conservative: conservativeRevenue,
    realistic: realisticRevenue,
    optimistic: optimisticRevenue,
    methodology: `RPM range: $${rpmRange.min}-$${rpmRange.max} (avg $${rpmRange.average}). Data source: ${rpmRange.dataSource}. Confidence: ${rpmRange.confidence}.`
  };
}