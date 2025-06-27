'use client';

import React from 'react';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import AnimatedButton from './AnimatedButton';
import Link from 'next/link';
import { DiscordLoginButton } from './DiscordLoginButton';

const PricingSection: React.FC = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const { containerRef, visibleItems } = useStaggeredAnimation(3, 200, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "3 analyses",
      description: "Perfect for testing our platform",
      icon: Star,
      features: [
        "3 channel analyses",
        "Basic revenue estimates",
        "Channel overview stats", 
        "Niche detection",
        "Community support"
      ],
      limitations: [
        "No outlier analysis",
        "No historical data",
        "No AI insights"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "border-border"
    },
    {
      name: "Creator Pro",
      price: "$19",
      period: "/month",
      description: "For serious content creators",
      icon: Zap,
      features: [
        "25 analyses per day",
        "Advanced outlier analysis",
        "Historical performance data",
        "AI-powered insights",
        "Revenue optimization tips",
        "Export reports (PDF/CSV)",
        "Priority email support"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true,
      color: "border-youtube-red",
      badge: "Most Popular"
    },
    {
      name: "Course Member",
      price: "$50",
      period: "lifetime",
      description: "Course + unlimited platform access",
      icon: Crown,
      features: [
        "Complete YouTube monetization course",
        "Unlimited channel analyses",
        "All premium features",
        "Weekly strategy sessions",
        "Private Discord community",
        "1-on-1 consultation calls",
        "Lifetime platform access",
        "Future course updates"
      ],
      limitations: [],
      cta: "Get Course + Access",
      popular: false,
      color: "border-accent-green",
      badge: "Best Value"
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
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your
            <span className="block text-youtube-red">Growth Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start free, upgrade when ready. All plans include our core analytics—
            choose the level of insights and support that fits your creator journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div ref={containerRef as any} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            const isVisible = visibleItems.has(index);
            
            return (
              <Card 
                key={index} 
                className={`
                  relative border-2 ${plan.color} group
                  ${plan.popular ? 'transform scale-105 shadow-xl z-10' : ''} 
                  transition-all duration-500 hover:shadow-2xl hover:scale-110
                  ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-8'}
                `}
                style={{ 
                  animationDelay: `${index * 200}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className={`px-4 py-1 text-sm font-medium ${
                      plan.popular 
                        ? 'bg-youtube-red text-white' 
                        : 'bg-accent-green text-white'
                    }`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className={`h-8 w-8 ${
                      plan.popular ? 'text-youtube-red' : 'text-accent-blue'
                    } group-hover:animate-bounce-gentle`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-accent-green flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground font-medium">Not included:</p>
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-5 w-5 flex-shrink-0 flex items-center justify-center">
                            <div className="h-1 w-3 bg-muted-foreground/40 rounded"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  {plan.name === "Course Member" ? (
                    <div className="space-y-3">
                      <Link href="https://your-launchpass-link.com" target="_blank" rel="noopener noreferrer">
                        <AnimatedButton 
                          className="w-full bg-accent-green hover:bg-accent-green/90 text-white group"
                          rippleColor="rgba(255, 255, 255, 0.3)"
                        >
                          {plan.cta}
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </AnimatedButton>
                      </Link>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">Already have access?</span>
                        </div>
                      </div>
                      <DiscordLoginButton 
                        text="Sign in with Discord" 
                        variant="outline"
                        className="w-full border-discord-blurple text-discord-blurple hover:bg-discord-blurple/10"
                      />
                    </div>
                  ) : (
                    <Link href="/auth/signup">
                      <AnimatedButton 
                        className={`w-full mt-8 group ${
                          plan.popular 
                            ? 'bg-youtube-red hover:bg-youtube-red-hover text-white' 
                            : 'bg-card hover:bg-muted border border-border'
                        }`}
                        rippleColor={plan.popular ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)"}
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </AnimatedButton>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent-green" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent-green" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent-green" />
              <span>30-day money back</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent-green" />
              <span>Secure payments</span>
            </div>
          </div>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All plans include access to our core analytics engine. Upgrade or downgrade 
            your subscription at any time. Course members get lifetime access with no recurring fees.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;