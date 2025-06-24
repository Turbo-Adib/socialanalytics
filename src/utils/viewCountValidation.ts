/**
 * View Count Data Validation Utilities
 * Helps catch and debug view count discrepancies
 */

export interface ViewCountValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  debugInfo: {
    channelTotalViews: number;
    recentVideoViews: number;
    videoCount: number;
    fetchedVideoCount: number;
    averageViewsPerVideo: number;
    suspiciousMetrics: string[];
  };
}

export class ViewCountValidator {
  
  /**
   * Validate view count data for consistency and accuracy
   */
  static validateViewCounts(
    channelTotalViews: number,
    recentVideoViews: number,
    channelVideoCount: number,
    fetchedVideoCount: number,
    channelTitle: string
  ): ViewCountValidation {
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suspiciousMetrics: string[] = [];
    
    // Basic data type validation
    if (isNaN(channelTotalViews) || channelTotalViews < 0) {
      errors.push('Invalid channel total views');
    }
    
    if (isNaN(recentVideoViews) || recentVideoViews < 0) {
      errors.push('Invalid recent video views');
    }
    
    // Logical consistency checks
    if (recentVideoViews > channelTotalViews) {
      errors.push(`Recent video views (${recentVideoViews.toLocaleString()}) exceed channel total views (${channelTotalViews.toLocaleString()})`);
    }
    
    // Calculate metrics
    const averageViewsPerVideo = fetchedVideoCount > 0 ? recentVideoViews / fetchedVideoCount : 0;
    const channelAverageViews = channelVideoCount > 0 ? channelTotalViews / channelVideoCount : 0;
    
    // Check for suspiciously high view counts
    if (averageViewsPerVideo > 100_000_000) {
      suspiciousMetrics.push('Very high average views per video (>100M)');
    }
    
    if (channelTotalViews > 50_000_000_000) {
      suspiciousMetrics.push('Extremely high channel total views (>50B)');
    }
    
    // Check for data fetch completeness
    if (fetchedVideoCount < Math.min(channelVideoCount, 100)) {
      warnings.push(`Only fetched ${fetchedVideoCount} videos out of ${channelVideoCount} total`);
    }
    
    // Check for zero values that might indicate API issues
    if (channelTotalViews === 0) {
      warnings.push('Channel total views is zero - possible API issue');
    }
    
    if (recentVideoViews === 0 && fetchedVideoCount > 0) {
      warnings.push('No views found in recent videos - possible parsing issue');
    }
    
    // Check for extremely low view counts that might indicate parsing errors
    if (channelTotalViews < 1000 && channelVideoCount > 10) {
      suspiciousMetrics.push('Very low total views for established channel');
    }
    
    console.log(`=== View Count Validation for ${channelTitle} ===`);
    console.log('Channel Total Views:', channelTotalViews.toLocaleString());
    console.log('Recent Video Views:', recentVideoViews.toLocaleString());
    console.log('Average Views/Video (recent):', Math.round(averageViewsPerVideo).toLocaleString());
    console.log('Average Views/Video (channel):', Math.round(channelAverageViews).toLocaleString());
    console.log('Errors:', errors.length);
    console.log('Warnings:', warnings.length);
    console.log('Suspicious Metrics:', suspiciousMetrics.length);
    console.log('===============================================');
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      debugInfo: {
        channelTotalViews,
        recentVideoViews,
        videoCount: channelVideoCount,
        fetchedVideoCount,
        averageViewsPerVideo,
        suspiciousMetrics
      }
    };
  }
  
  /**
   * Quick validation for known channels
   */
  static validateKnownChannel(channelTitle: string, totalViews: number): string[] {
    const issues: string[] = [];
    
    // Add known channel benchmarks
    const knownChannels: Record<string, { minViews: number; maxViews: number }> = {
      'MKBHD': { minViews: 3_000_000_000, maxViews: 5_000_000_000 },
      'MrBeast': { minViews: 20_000_000_000, maxViews: 35_000_000_000 },
      'PewDiePie': { minViews: 25_000_000_000, maxViews: 35_000_000_000 },
    };
    
    const expected = knownChannels[channelTitle];
    if (expected) {
      if (totalViews < expected.minViews) {
        issues.push(`${channelTitle} total views too low (${totalViews.toLocaleString()} < ${expected.minViews.toLocaleString()})`);
      }
      if (totalViews > expected.maxViews) {
        issues.push(`${channelTitle} total views too high (${totalViews.toLocaleString()} > ${expected.maxViews.toLocaleString()})`);
      }
    }
    
    return issues;
  }
  
  /**
   * Validate mathematical consistency of analytics data
   */
  static validateMathematicalConsistency(analytics: any): string[] {
    const issues: string[] = [];
    
    const channelTotal = analytics.channel.totalViews;
    const recentTotal = analytics.currentStats.totalViews;
    const longForm = analytics.currentStats.longFormViews;
    const shorts = analytics.currentStats.shortsViews;
    
    // Check if recent video breakdown adds up
    const calculatedTotal = longForm + shorts;
    if (Math.abs(calculatedTotal - recentTotal) > 1) {
      issues.push(`Recent video views math error: ${longForm.toLocaleString()} + ${shorts.toLocaleString()} ≠ ${recentTotal.toLocaleString()}`);
    }
    
    // Check if recent views exceed channel total
    if (recentTotal > channelTotal) {
      issues.push(`Recent video views (${recentTotal.toLocaleString()}) exceed channel total (${channelTotal.toLocaleString()})`);
    }
    
    // Check for unrealistic ratios
    const percentageOfTotal = channelTotal > 0 ? (recentTotal / channelTotal) * 100 : 0;
    if (percentageOfTotal > 50) {
      issues.push(`Recent videos account for ${percentageOfTotal.toFixed(1)}% of total views (unusually high)`);
    }
    
    // Validate daily data if present
    if (analytics.dailyData && analytics.dailyData.length > 0) {
      const dailyTotal = analytics.dailyData.reduce((sum: number, day: any) => 
        sum + day.longFormViews + day.shortsViews, 0);
      
      if (dailyTotal > recentTotal * 1.1) {
        issues.push(`Daily data total (${dailyTotal.toLocaleString()}) exceeds recent video total`);
      }
    }
    
    return issues;
  }
  
  /**
   * Validate realistic daily view patterns
   */
  static validateDailyPatterns(dailyData: any[]): string[] {
    const issues: string[] = [];
    
    if (!dailyData || dailyData.length === 0) return issues;
    
    // Check for unrealistic daily view counts
    for (const day of dailyData) {
      const dayTotal = day.longFormViews + day.shortsViews;
      
      // Flag if any single day has more than 50M views (unrealistic for most channels)
      if (dayTotal > 50_000_000) {
        issues.push(`Unrealistic daily views: ${dayTotal.toLocaleString()} on ${day.date}`);
      }
      
      // Check for impossible daily revenue
      const dayRevenue = day.estRevenueLong + day.estRevenueShorts;
      if (dayRevenue > 100_000) {
        issues.push(`Unrealistic daily revenue: $${dayRevenue.toLocaleString()} on ${day.date}`);
      }
    }
    
    return issues;
  }
}