'use client';

import React from 'react';
import { Check, Star, Zap, Crown, ArrowRight, BookOpen } from 'lucide-react';
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
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For serious content creators",
      icon: Zap,
      features: [
        "Unlimited channel analyses",
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
      name: "Creator Bundle",
      price: "$50",
      period: "/month",
      description: "Complete education + all tools",
      icon: Crown,
      features: [
        "Creator Camp Academy course ($997 value)",
        "Everything in Pro plan",
        "Weekly group coaching calls",
        "Private Discord community",
        "Course lifetime updates",
        "Exclusive creator resources",
        "1-on-1 onboarding call",
        "Priority support"
      ],
      courseValue: "$997",
      limitations: [],
      cta: "Get Course + Tools",
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
            Start free, upgrade when ready. Choose tools-only for pure analytics, 
            or get our complete creator education course bundled at an incredible price.
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
                    {plan.courseValue && (
                      <div className="mb-2">
                        <span className="text-sm text-muted-foreground line-through">{plan.courseValue} course</span>
                        <span className="text-sm text-accent-green font-semibold ml-2">FREE</span>
                      </div>
                    )}
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
                        <span className={`text-sm text-foreground ${
                          feature.includes('($997 value)') ? 'font-semibold' : ''
                        }`}>
                          {feature.includes('($997 value)') ? (
                            <>
                              <BookOpen className="h-4 w-4 inline mr-1 text-accent-purple" />
                              {feature}
                            </>
                          ) : feature}
                        </span>
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
                  <Link href={plan.name === 'Creator Bundle' ? '/course' : '/auth/signup'}>
                    <AnimatedButton 
                      className={`w-full mt-8 group ${
                        plan.popular 
                          ? 'bg-youtube-red hover:bg-youtube-red-hover text-white' 
                          : plan.name === 'Creator Bundle'
                          ? 'bg-accent-green hover:bg-accent-green/90 text-white'
                          : 'bg-card hover:bg-muted border border-border'
                      }`}
                      rippleColor={plan.popular || plan.name === 'Creator Bundle' ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.1)"}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </AnimatedButton>
                  </Link>
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
          
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            All plans include access to our core analytics engine. Upgrade or downgrade 
            your subscription at any time.
          </p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            <BookOpen className="h-5 w-5 text-accent-purple" />
            <span className="text-sm font-medium">
              Want to learn content creation? 
              <Link href="/course" className="text-accent-purple hover:underline ml-1">
                Check out our $997 course →
              </Link>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;