import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  BarChart3,
  Target,
  Calculator,
  AlertCircle,
  CheckCircle,
  Video,
  Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueOptimizationProps {
  channel: any;
  recentVideos: any[];
  currentStats: any;
  historicalData: any[];
}

const RevenueOptimizationCenter: React.FC<RevenueOptimizationProps> = ({
  channel,
  recentVideos,
  currentStats,
  historicalData
}) => {
  const revenueAnalysis = useMemo(() => {
    // Calculate RPM trends (mock data since YouTube doesn't provide actual revenue)
    const baseRPM = channel.niche === 'Finance' ? 6.0 : 
                   channel.niche === 'Tech' ? 4.5 : 
                   channel.niche === 'Gaming' ? 2.5 : 3.0;

    // Calculate content mix
    const longFormVideos = recentVideos.filter(v => !v.isShort);
    const shortsVideos = recentVideos.filter(v => v.isShort);
    const contentMixRatio = longFormVideos.length / (recentVideos.length || 1);

    // Calculate optimal mix based on performance
    const avgLongFormViews = longFormVideos.reduce((sum, v) => sum + v.views, 0) / (longFormVideos.length || 1);
    const avgShortsViews = shortsVideos.reduce((sum, v) => sum + v.views, 0) / (shortsVideos.length || 1);
    
    const longFormRevenuePotential = avgLongFormViews * baseRPM / 1000;
    const shortsRevenuePotential = avgShortsViews * 0.15 / 1000;

    const optimalMixRatio = longFormRevenuePotential > shortsRevenuePotential * 5 ? 0.8 : 0.6;

    // Generate RPM trend data
    const rpmTrend = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
      rpm: baseRPM + (Math.random() - 0.5) * 0.5,
      shortsRpm: 0.15
    }));

    // Calculate sponsorship value
    const monthlyViews = currentStats.longFormViews + currentStats.shortsViews;
    const engagementRate = 0.04; // 4% average
    const sponsorshipValue = Math.round((monthlyViews * engagementRate * 0.02) / 100) * 100;

    // Revenue diversification
    const adRevenue = monthlyViews * baseRPM / 1000;
    const potentialSponsorRevenue = sponsorshipValue * 2; // 2 sponsors per month
    const totalPotentialRevenue = adRevenue + potentialSponsorRevenue;
    const diversificationScore = (potentialSponsorRevenue / totalPotentialRevenue) * 100;

    return {
      currentRPM: baseRPM,
      rpmTrend,
      contentMixRatio,
      optimalMixRatio,
      longFormRevenuePotential,
      shortsRevenuePotential,
      sponsorshipValue,
      diversificationScore,
      monthlyAdRevenue: adRevenue,
      potentialTotalRevenue: totalPotentialRevenue
    };
  }, [channel, recentVideos, currentStats]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-dark-bg-card rounded-lg shadow-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        Revenue Optimization Center
      </h3>

      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-text-secondary">Current RPM</span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            ${revenueAnalysis.currentRPM.toFixed(2)}
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            Per 1,000 views
          </div>
        </div>

        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-text-secondary">Monthly Ad Revenue</span>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(revenueAnalysis.monthlyAdRevenue)}
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            From YouTube ads
          </div>
        </div>

        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-text-secondary">Total Potential</span>
            <Target className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-white">
            {formatCurrency(revenueAnalysis.potentialTotalRevenue)}
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            With sponsorships
          </div>
        </div>
      </div>

      {/* RPM Trend Chart */}
      <div className="bg-dark-bg-secondary rounded-lg p-4 mb-6">
        <h4 className="font-medium text-white mb-4">RPM Trend Analysis</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueAnalysis.rpmTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.375rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area 
                type="monotone" 
                dataKey="rpm" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Long-form RPM ($)"
              />
              <Area 
                type="monotone" 
                dataKey="shortsRpm" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.3}
                name="Shorts RPM ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Mix Optimization */}
      <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg p-4 border border-blue-500/30 mb-6">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-blue-500" />
          Content Mix Optimization
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-text-secondary">Current Mix</span>
              <span className="text-sm font-medium text-white">
                {Math.round(revenueAnalysis.contentMixRatio * 100)}% Long-form
              </span>
            </div>
            <div className="h-2 bg-dark-bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                style={{ width: `${revenueAnalysis.contentMixRatio * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-text-secondary">Optimal Mix</span>
              <span className="text-sm font-medium text-white">
                {Math.round(revenueAnalysis.optimalMixRatio * 100)}% Long-form
              </span>
            </div>
            <div className="h-2 bg-dark-bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                style={{ width: `${revenueAnalysis.optimalMixRatio * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-sm text-dark-text-secondary">
          {revenueAnalysis.contentMixRatio < revenueAnalysis.optimalMixRatio ? (
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <span>
                Increase long-form content to {Math.round(revenueAnalysis.optimalMixRatio * 100)}% 
                for optimal revenue. Long-form earns ${revenueAnalysis.currentRPM}/1K views vs $0.15 for Shorts.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <span>Your content mix is well-optimized for revenue generation!</span>
            </div>
          )}
        </div>
      </div>

      {/* Sponsorship Calculator */}
      <div className="bg-dark-bg-secondary rounded-lg p-4 mb-6">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-purple-500" />
          Sponsorship Value Calculator
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-dark-text-secondary mb-2">Based on your metrics:</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-dark-text-tertiary">Monthly Views:</span>
                <span className="text-white font-medium">
                  {(currentStats.longFormViews + currentStats.shortsViews).toLocaleString()}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-dark-text-tertiary">Engagement Rate:</span>
                <span className="text-white font-medium">4.0%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-dark-text-tertiary">Niche Premium:</span>
                <span className="text-white font-medium">{channel.niche}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-500/30">
            <p className="text-sm text-dark-text-secondary mb-1">Recommended Rate:</p>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(revenueAnalysis.sponsorshipValue)}
            </div>
            <p className="text-xs text-dark-text-tertiary mt-1">Per sponsored video</p>
          </div>
        </div>
      </div>

      {/* Revenue Diversification */}
      <div className="bg-dark-bg-secondary rounded-lg p-4">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Revenue Diversification Score
        </h4>
        
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-dark-text-secondary">Diversification Level</span>
            <span className="text-sm font-medium text-white">
              {revenueAnalysis.diversificationScore.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-dark-bg-primary rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                revenueAnalysis.diversificationScore > 30 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${revenueAnalysis.diversificationScore}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-dark-text-tertiary mb-1">Current Sources:</p>
            <ul className="space-y-1">
              <li className="flex items-center justify-between">
                <span className="text-dark-text-secondary">YouTube Ads:</span>
                <span className="text-white">100%</span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-dark-text-tertiary mb-1">Potential Sources:</p>
            <ul className="space-y-1">
              <li className="flex items-center justify-between">
                <span className="text-dark-text-secondary">Sponsorships:</span>
                <span className="text-green-500">+{revenueAnalysis.diversificationScore.toFixed(0)}%</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <p className="text-xs text-yellow-200">
            <strong>Recommendation:</strong> Start reaching out to sponsors. With your metrics, 
            2-3 sponsorships per month could double your revenue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueOptimizationCenter;