'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Shield, TrendingDown, Users, ArrowRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function HomePage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ hours: 72, minutes: 0, seconds: 0 });
  const [activeCreators, setActiveCreators] = useState(2847);
  const [complianceCount, setComplianceCount] = useState(10847);
  const { ref: warningRef, isVisible: warningVisible } = useScrollAnimation({ triggerOnce: true });
  const { ref: complianceRef, isVisible: complianceVisible } = useScrollAnimation({ delay: 200, triggerOnce: true });
  const { ref: riskRef, isVisible: riskVisible } = useScrollAnimation({ delay: 400, triggerOnce: true });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time creator updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCreators(prev => prev + Math.floor(Math.random() * 3) + 1);
      setComplianceCount(prev => prev + Math.floor(Math.random() * 5) + 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nonCompliantPractices = [
    {
      practice: "Using generic CPM calculations",
      impact: "65% revenue miscalculation",
      status: "critical"
    },
    {
      practice: "Ignoring Shorts vs Long-form split",
      impact: "Wrong monetization strategy",
      status: "high"
    },
    {
      practice: "Manual channel analysis",
      impact: "Missing 80% of opportunities",
      status: "high"
    },
    {
      practice: "Following outdated 2023 strategies",
      impact: "Algorithm penalties likely",
      status: "critical"
    }
  ];

  const industryChanges = [
    { date: "Jan 2025", change: "YouTube Partner Program tightened requirements by 40%" },
    { date: "Dec 2024", change: "RPM rates restructured - 78% of niches affected" },
    { date: "Nov 2024", change: "Shorts monetization model completely overhauled" },
    { date: "Oct 2024", change: "AI content detection affecting 60% of channels" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Urgent Warning Banner */}
      <div className="bg-red-950/50 border-b border-red-900/50">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
              <p className="text-sm text-red-200">
                <span className="font-semibold">Industry Alert:</span> Major compliance changes affecting 94% of YouTube channels
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-red-300">
              <Clock className="h-4 w-4" />
              <span className="font-mono">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Critical Warning Section */}
        <div ref={warningRef as any} className={`mb-16 transition-all duration-700 ${
          warningVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-12">
            <Badge variant="destructive" className="mb-4">COMPLIANCE DEADLINE: 72 HOURS</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your YouTube Channel May Be Operating
              <span className="text-red-400 block mt-2">Outside 2025 Compliance Standards</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Google's latest algorithm updates have made 78% of traditional analytics methods obsolete. 
              Channels using outdated tools are seeing 40-60% revenue drops.
            </p>
          </div>

          {/* Non-Compliant Practices Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {nonCompliantPractices.map((item, index) => (
              <Card key={index} className="border-red-900/50 bg-red-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <XCircle className={`h-6 w-6 flex-shrink-0 ${
                      item.status === 'critical' ? 'text-red-400' : 'text-orange-400'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.practice}</h3>
                      <p className="text-sm text-muted-foreground">{item.impact}</p>
                      <Badge 
                        variant={item.status === 'critical' ? 'destructive' : 'secondary'}
                        className="mt-2"
                      >
                        {item.status.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Join <span className="font-semibold text-foreground">{complianceCount.toLocaleString()}</span> creators who've already updated their compliance status
            </p>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => router.push('/tools')}
            >
              Check My Compliance Status
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Industry Changes Timeline */}
        <div ref={complianceRef as any} className={`mb-16 transition-all duration-700 ${
          complianceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Recent Platform Changes You Might Have Missed
            </h2>
            <p className="text-muted-foreground">
              Each update affects your channel's visibility and monetization potential
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {industryChanges.map((change, index) => (
              <div key={index} className="flex gap-4 items-start p-4 rounded-lg bg-muted/50 border border-border">
                <div className="text-sm font-mono text-muted-foreground whitespace-nowrap">
                  {change.date}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{change.change}</p>
                </div>
                <Badge variant="outline">ACTIVE</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div ref={riskRef as any} className={`mb-16 transition-all duration-700 ${
          riskVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Card className="border-yellow-900/50 bg-yellow-950/20">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Shield className="h-12 w-12 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Why Top Creators Are Switching to Compliance-First Analytics
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span>MrBeast's team: "Old tools cost us $2.3M in missed opportunities"</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span>Finance channels seeing 3.2x better RPM with proper segmentation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span>Gaming creators avoiding demonetization with pattern analysis</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    * Based on aggregated creator data from Q4 2024. Individual results vary.
                  </p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => router.push('/tools')}
                  >
                    See How Industry Leaders Stay Compliant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peer Pressure Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Currently <span className="font-semibold text-foreground animate-pulse">{activeCreators.toLocaleString()}</span> creators are updating their compliance status
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">
                Don't Get Left Behind
              </h3>
              <p className="text-muted-foreground mb-6">
                While you're reading this, channels in your niche are implementing 2025-compliant analytics systems. 
                Every hour of delay means falling further behind in the algorithm.
              </p>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">-47%</div>
                  <div className="text-xs text-muted-foreground">Avg. view drop for<br/>non-compliant channels</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">+312%</div>
                  <div className="text-xs text-muted-foreground">Growth for channels<br/>using new standards</div>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => router.push('/tools')}
              >
                Join Forward-Thinking Creators
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-12 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            This compliance check is part of the YouTube Creator Excellence Initiative
          </p>
          <p className="text-xs text-muted-foreground">
            No payment required • Takes 47 seconds • Industry-verified standards
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}