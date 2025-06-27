import React, { useMemo } from 'react';
import { 
  Rocket, 
  Target, 
  TrendingUp,
  Users,
  Calendar,
  Zap,
  AlertCircle,
  CheckCircle,
  Trophy,
  Flag,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface GrowthTrajectoryProps {
  channel: any;
  currentStats: any;
  historicalData: any[];
}

const GrowthTrajectoryAnalyzer: React.FC<GrowthTrajectoryProps> = ({
  channel,
  currentStats,
  historicalData
}) => {
  const analysis = useMemo(() => {
    const currentSubs = channel.subscriberCount;
    
    // Calculate growth rate from recent performance
    const recentGrowthRate = 0.05; // 5% monthly (mock - would calculate from historical data)
    
    // Milestone calculations
    const milestones = [
      { value: 1000, label: '1K', icon: '🎯' },
      { value: 10000, label: '10K', icon: '🥉' },
      { value: 100000, label: '100K', icon: '🥈' },
      { value: 1000000, label: '1M', icon: '🥇' },
      { value: 10000000, label: '10M', icon: '💎' }
    ];

    const nextMilestone = milestones.find(m => m.value > currentSubs) || milestones[milestones.length - 1];
    const previousMilestone = [...milestones].reverse().find(m => m.value <= currentSubs) || milestones[0];

    // Calculate time to next milestone
    const subsNeeded = nextMilestone.value - currentSubs;
    const monthlyGrowth = currentSubs * recentGrowthRate;
    const monthsToMilestone = subsNeeded / monthlyGrowth;
    const dateOfMilestone = new Date();
    dateOfMilestone.setMonth(dateOfMilestone.getMonth() + Math.ceil(monthsToMilestone));

    // Determine growth phase
    let growthPhase: 'startup' | 'growth' | 'mature' | 'decline';
    let phaseColor: string;
    let phaseDescription: string;

    if (currentSubs < 1000) {
      growthPhase = 'startup';
      phaseColor = 'text-blue-500';
      phaseDescription = 'Building initial audience';
    } else if (recentGrowthRate > 0.1) {
      growthPhase = 'growth';
      phaseColor = 'text-green-500';
      phaseDescription = 'Rapid expansion phase';
    } else if (recentGrowthRate > 0.02) {
      growthPhase = 'mature';
      phaseColor = 'text-yellow-500';
      phaseDescription = 'Steady growth phase';
    } else {
      growthPhase = 'decline';
      phaseColor = 'text-red-500';
      phaseDescription = 'Growth stagnation';
    }

    // Calculate momentum score
    const viewsGrowth = 0.08; // Mock 8% monthly views growth
    const uploadConsistency = currentStats.uploadFrequency > 2 ? 1 : 0.5;
    const engagementGrowth = 0.06; // Mock 6% engagement growth
    
    const momentumScore = (
      (recentGrowthRate * 40) + 
      (viewsGrowth * 30) + 
      (uploadConsistency * 20) + 
      (engagementGrowth * 10)
    ) * 100;

    // Generate projection data
    const projectionMonths = 12;
    const projectionData = Array.from({ length: projectionMonths + 1 }, (_, i) => {
      const monthsAhead = i;
      const projectedSubs = Math.round(currentSubs * Math.pow(1 + recentGrowthRate, monthsAhead));
      return {
        month: i === 0 ? 'Now' : `+${i}mo`,
        subscribers: projectedSubs,
        optimistic: Math.round(projectedSubs * 1.2),
        pessimistic: Math.round(projectedSubs * 0.8)
      };
    });

    // Breakout opportunities
    const opportunities = [];
    if (channel.niche && currentStats.uploadFrequency < 3) {
      opportunities.push({
        type: 'frequency',
        message: 'Increase upload frequency to 3-4 videos/week for faster growth',
        impact: '+30% growth rate'
      });
    }
    if (currentStats.shortsViews < currentStats.longFormViews * 0.5) {
      opportunities.push({
        type: 'shorts',
        message: 'Add more Shorts content to tap into discovery traffic',
        impact: '+50% reach'
      });
    }
    if (recentGrowthRate > 0.08) {
      opportunities.push({
        type: 'momentum',
        message: 'Your channel is hot! Double down on current strategy',
        impact: 'Compound growth'
      });
    }

    return {
      currentSubs,
      nextMilestone,
      previousMilestone,
      monthsToMilestone,
      dateOfMilestone,
      growthPhase,
      phaseColor,
      phaseDescription,
      momentumScore,
      projectionData,
      opportunities,
      monthlyGrowthRate: recentGrowthRate,
      projectedOneYear: Math.round(currentSubs * Math.pow(1 + recentGrowthRate, 12))
    };
  }, [channel, currentStats]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-dark-bg-card rounded-lg shadow-lg p-6 border border-dark-border">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Rocket className="h-5 w-5 text-purple-500" />
        Growth Trajectory Analyzer
      </h3>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-dark-text-secondary">Current Status</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analysis.currentSubs.toLocaleString()}
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            Subscribers
          </div>
        </div>

        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm text-dark-text-secondary">Growth Phase</span>
          </div>
          <div className={`text-xl font-bold ${analysis.phaseColor}`}>
            {analysis.growthPhase.charAt(0).toUpperCase() + analysis.growthPhase.slice(1)}
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            {analysis.phaseDescription}
          </div>
        </div>

        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-dark-text-secondary">Momentum Score</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {analysis.momentumScore.toFixed(0)}/100
          </div>
          <div className="text-xs text-dark-text-tertiary mt-1">
            {analysis.momentumScore > 70 ? 'Accelerating' : 'Building'}
          </div>
        </div>
      </div>

      {/* Milestone Tracker */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30 mb-6">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Next Milestone: {analysis.nextMilestone.icon} {analysis.nextMilestone.label} Subscribers
        </h4>
        
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-dark-text-secondary">Progress</span>
            <span className="text-white font-medium">
              {((analysis.currentSubs / analysis.nextMilestone.value) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-dark-bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${(analysis.currentSubs / analysis.nextMilestone.value) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-dark-text-tertiary">Estimated Time:</p>
            <p className="font-medium text-white">
              {analysis.monthsToMilestone.toFixed(1)} months
            </p>
          </div>
          <div>
            <p className="text-dark-text-tertiary">Target Date:</p>
            <p className="font-medium text-white">
              {formatDate(analysis.dateOfMilestone)}
            </p>
          </div>
        </div>
      </div>

      {/* Growth Projection Chart */}
      <div className="bg-dark-bg-secondary rounded-lg p-4 mb-6">
        <h4 className="font-medium text-white mb-4">12-Month Growth Projection</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysis.projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis 
                stroke="#9CA3AF" 
                tickFormatter={(value) => 
                  value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` :
                  value >= 1000 ? `${(value / 1000).toFixed(0)}K` : 
                  value.toString()
                }
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '0.375rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value: any) => value.toLocaleString()}
              />
              <ReferenceLine 
                y={analysis.nextMilestone.value} 
                stroke="#F59E0B" 
                strokeDasharray="5 5"
                label={{ value: `${analysis.nextMilestone.label} Goal`, fill: '#F59E0B' }}
              />
              <Line 
                type="monotone" 
                dataKey="subscribers" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Expected"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="optimistic" 
                stroke="#10B981" 
                strokeDasharray="5 5"
                name="Optimistic"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="pessimistic" 
                stroke="#EF4444" 
                strokeDasharray="5 5"
                name="Conservative"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-dark-text-secondary">
              1 Year Projection: <span className="font-medium text-white">
                {analysis.projectedOneYear.toLocaleString()} subscribers
              </span>
            </span>
          </div>
          <div className="text-dark-text-tertiary">
            +{((analysis.projectedOneYear - analysis.currentSubs) / analysis.currentSubs * 100).toFixed(0)}% growth
          </div>
        </div>
      </div>

      {/* Breakout Opportunities */}
      {analysis.opportunities.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-white flex items-center gap-2">
            <Flag className="h-4 w-4 text-green-500" />
            Breakout Opportunities
          </h4>
          
          {analysis.opportunities.map((opp, index) => (
            <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{opp.message}</p>
                  <p className="text-xs text-green-400 mt-1">Potential Impact: {opp.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Growth Rate Summary */}
      <div className="mt-6 p-4 bg-dark-bg-secondary rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-dark-text-secondary">Current Growth Rate</span>
          </div>
          <span className="text-lg font-bold text-white">
            +{(analysis.monthlyGrowthRate * 100).toFixed(1)}% per month
          </span>
        </div>
      </div>
    </div>
  );
};

export default GrowthTrajectoryAnalyzer;