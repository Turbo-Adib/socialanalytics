'use client';

import React from 'react';
import { TrendingUp, DollarSign, Target, Brain, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

const FeaturesSection: React.FC = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const { containerRef, visibleItems } = useStaggeredAnimation(6, 150, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  const features = [
    {
      icon: DollarSign,
      title: 'Revenue Calculator',
      description: 'Get precise revenue estimates based on 100+ niche-specific RPM rates. See exactly how much your channel should be earning.',
      badge: 'Most Popular',
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10'
    },
    {
      icon: TrendingUp,
      title: 'Outlier Analysis',
      description: 'Discover your top-performing content patterns. AI identifies what makes your best videos successful.',
      badge: 'AI-Powered',
      color: 'text-accent-purple',
      bgColor: 'bg-accent-purple/10'
    },
    {
      icon: Target,
      title: 'Niche Detection',
      description: 'Automatic channel categorization with smart keyword mapping for accurate revenue calculations.',
      badge: 'Automatic',
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10'
    },
    {
      icon: Brain,
      title: 'Intelligent Insights',
      description: 'Get actionable recommendations on content strategy, upload timing, and optimization opportunities.',
      badge: 'Premium',
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10'
    },
    {
      icon: Clock,
      title: 'Real-time Analytics',
      description: 'Live channel statistics updated every 24 hours with comprehensive performance tracking.',
      badge: 'Live Data',
      color: 'text-youtube-red',
      bgColor: 'bg-youtube-red/10'
    },
    {
      icon: Shield,
      title: 'Data Transparency',
      description: 'Full transparency in calculations with data sources, methodology, and confidence levels.',
      badge: 'Trusted',
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10'
    }
  ];

  return (
    <section ref={sectionRef} className="px-4 py-24 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${
          sectionVisible ? 'animate-fade-in' : 'opacity-0 translate-y-8'
        }`}>
          <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-accent-blue/20 text-accent-blue border-accent-blue/30 hover:scale-105 transition-transform duration-200">
            Core Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="block text-youtube-red">Maximize Revenue</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our comprehensive analytics suite gives you deep insights into your channel's performance, 
            revenue potential, and growth opportunities—all in one powerful dashboard.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={containerRef as any} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isVisible = visibleItems.has(index);
            
            return (
              <Card 
                key={index} 
                className={`
                  group hover:shadow-lg transition-all duration-500 border-border/50 hover:border-border
                  hover:scale-105 hover:-translate-y-2
                  ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}
                `}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'both'
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`h-6 w-6 ${feature.color} group-hover:animate-bounce-gentle`} />
                    </div>
                    <Badge variant="outline" className="text-xs font-medium group-hover:scale-105 transition-transform duration-200">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-youtube-red transition-colors duration-200">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Ready to see what your channel is really worth?
          </p>
          <div className="flex justify-center">
            <Badge className="px-6 py-3 text-base font-medium bg-youtube-red/20 text-youtube-red border-youtube-red/30">
              ✨ Free analysis includes all core features
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;