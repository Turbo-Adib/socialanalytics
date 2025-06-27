'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  DollarSign, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  PlayCircle,
  CheckCircle2,
  Star,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  Globe
} from 'lucide-react';
import CourseModuleCard from './CourseModuleCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CourseSection() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ triggerOnce: true });
  const { ref: modulesRef, isVisible: modulesVisible } = useScrollAnimation({ delay: 200, triggerOnce: true });
  const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({ delay: 400, triggerOnce: true });

  const courseModules = [
    {
      id: 1,
      icon: Target,
      title: "Producer Mindset Transformation",
      description: "Move from passive consumer to strategic content producer",
      topics: [
        "Strategic consumption protocol for market intelligence",
        "CEO vs Creator mindset shift",
        "Copy first, innovate later doctrine",
        "Building your ideas folder system"
      ],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Market Research & Validation",
      description: "Find profitable niches before your competition",
      topics: [
        "TikTok to YouTube arbitrage identification",
        "Saturation testing methodology",
        "Cross-niche adaptation strategies",
        "Emerging trend indicators"
      ],
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    },
    {
      id: 3,
      icon: Zap,
      title: "AI-Powered Production Engine",
      description: "Create content at scale with AI automation",
      topics: [
        "Complete AI tool stack setup",
        "Hook engineering framework",
        "Quality-Volume-Sustainability system",
        "2-hour daily production workflow"
      ],
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    {
      id: 4,
      icon: DollarSign,
      title: "Monetization & Compliance",
      description: "Maximize revenue while staying compliant",
      topics: [
        "Platform policy navigation",
        "Transformation requirements",
        "100+ niche RPM optimization",
        "Multi-language expansion"
      ],
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }
  ];

  const successMetrics = [
    { label: "Monthly Revenue", value: "$130K+", icon: DollarSign },
    { label: "Implementation Time", value: "3 Weeks", icon: Clock },
    { label: "Success Rate", value: "87%", icon: Award },
    { label: "Active Students", value: "2,400+", icon: Users }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 via-transparent to-accent-green/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div ref={headerRef as any} className={`text-center mb-16 transition-all duration-700 ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-purple/20 to-accent-green/20 border border-accent-purple/30 mb-6">
            <Sparkles className="h-4 w-4 text-accent-purple" />
            <span className="text-sm font-medium bg-gradient-to-r from-accent-purple to-accent-green bg-clip-text text-transparent">
              FREE $997 BONUS INCLUDED
            </span>
            <Sparkles className="h-4 w-4 text-accent-green" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Creator Camp Academy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Learn the exact system our instructor used to generate <span className="text-accent-green font-semibold">$130K+ monthly</span> with short-form content. 
            This comprehensive course is included <span className="text-accent-purple font-semibold">FREE</span> with your InsightSync subscription.
          </p>
          
          {/* Course highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border">
              <PlayCircle className="h-5 w-5 text-youtube-red" />
              <div className="text-left">
                <p className="font-semibold">47 Video Lessons</p>
                <p className="text-sm text-muted-foreground">Step-by-step tutorials</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border">
              <BookOpen className="h-5 w-5 text-accent-blue" />
              <div className="text-left">
                <p className="font-semibold">Proven Playbooks</p>
                <p className="text-sm text-muted-foreground">Copy our templates</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-card border">
              <Globe className="h-5 w-5 text-accent-purple" />
              <div className="text-left">
                <p className="font-semibold">Private Community</p>
                <p className="text-sm text-muted-foreground">24/7 creator support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div ref={statsRef as any} className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
          statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {successMetrics.map((metric, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6">
                <metric.icon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-3xl font-bold bg-gradient-to-br from-accent-purple to-accent-green bg-clip-text text-transparent">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{metric.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Modules */}
        <div ref={modulesRef as any} className={`mb-16 transition-all duration-700 ${
          modulesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">What You'll Master</h3>
            <p className="text-muted-foreground">Four comprehensive modules covering everything from mindset to monetization</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseModules.map((module) => (
              <CourseModuleCard
                key={module.id}
                module={module}
                isExpanded={expandedModule === module.id}
                onToggle={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="relative overflow-hidden border-2 border-accent-green/50 bg-gradient-to-br from-accent-green/5 to-accent-purple/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl" />
          
          <CardContent className="relative p-8 md:p-12 text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-gradient-to-r from-accent-purple to-accent-green text-white border-0">
              LIMITED TIME OFFER
            </Badge>
            
            <h3 className="text-3xl font-bold mb-4">
              Get The Course + Analytics Tools
            </h3>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground line-through">Course Value</p>
                <p className="text-2xl font-bold text-muted-foreground line-through">$997</p>
              </div>
              <div className="text-4xl font-bold text-accent-green">+</div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Analytics Tools</p>
                <p className="text-2xl font-bold">$49/mo</p>
              </div>
              <div className="text-4xl font-bold text-accent-green">=</div>
              <div className="text-center">
                <p className="text-sm font-semibold text-accent-green">You Pay Only</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent">$49/mo</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-accent-green to-accent-blue hover:opacity-90 text-white font-semibold px-8">
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Course Preview
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Lifetime Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg italic mb-4">
                "This course changed everything. I went from 0 to 100K subscribers in 3 months and now make more from YouTube than my old 9-5 job. The strategies actually work!"
              </p>
              <p className="font-semibold">Sarah Chen</p>
              <p className="text-sm text-muted-foreground">Finance Creator • 2.3M Subscribers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}