'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, TrendingUp, DollarSign, BarChart3, Crown } from 'lucide-react';
import { useScrollAnimation, useParallax } from '@/hooks/useScrollAnimation';
import AnimatedButton from './AnimatedButton';
import AnimatedCounter from './AnimatedCounter';
import TypingAnimation from './TypingAnimation';
import { Badge } from './ui/badge';

interface HeroSectionProps {
  onStartAnalysis: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartAnalysis }) => {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ 
    threshold: 0.2,
    triggerOnce: true 
  });
  const { ref: parallaxRef, offset } = useParallax(0.3);

  return (
    <section ref={heroRef} className="relative px-4 py-24 lg:py-32 overflow-hidden">
      {/* Enhanced Background gradient with parallax */}
      <div 
        ref={parallaxRef as any}
        className="absolute inset-0 bg-gradient-to-br from-youtube-red/5 via-transparent to-accent-blue/5"
        style={{
          transform: `translateY(${offset}px)`,
        }}
      />
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-youtube-red/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-accent-blue/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-green/10 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 mb-8 transition-all duration-700 ${
            heroVisible ? 'animate-fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30 px-4 py-2 text-sm font-medium hover:scale-105 transition-transform duration-200">
              <TrendingUp className="h-4 w-4 mr-2 animate-bounce-gentle" />
              #1 Creator Monetization Analytics
            </Badge>
          </div>

          {/* Main Headline with Typing Animation */}
          <div className={`transition-all duration-700 delay-300 ${
            heroVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-tight">
              <TypingAnimation 
                text="Unlock Your YouTube"
                speed={80}
                delay={800}
                className="block"
              />
              <span className="block bg-gradient-to-r from-youtube-red to-youtube-red-hover bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Revenue Potential
              </span>
            </h1>
          </div>

          {/* Subheading */}
          <div className={`transition-all duration-700 delay-500 ${
            heroVisible ? 'animate-fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              The only analytics platform that shows you exactly how much money your YouTube channel 
              <em className="text-foreground font-semibold"> should be making</em>, with AI-powered insights 
              to maximize your content performance and revenue.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 transition-all duration-700 delay-700 ${
            heroVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <AnimatedButton
              onClick={onStartAnalysis}
              className="bg-youtube-red hover:bg-youtube-red-hover text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-youtube hover:shadow-youtube-hover min-w-[240px] group"
              rippleColor="rgba(255, 255, 255, 0.3)"
            >
              <Play className="h-5 w-5 mr-2 fill-white group-hover:scale-110 transition-transform duration-200" />
              Try Free Analysis
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </AnimatedButton>
            <Link href="/auth/signup">
              <AnimatedButton
                variant="outline"
                className="px-8 py-4 text-lg font-semibold rounded-lg border-2 min-w-[200px] hover:bg-card group"
              >
                <BarChart3 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Start Free Trial
              </AnimatedButton>
            </Link>
          </div>

          {/* Course Members Access */}
          <div className={`mb-16 transition-all duration-700 delay-900 ${
            heroVisible ? 'animate-fade-in' : 'opacity-0 translate-y-4'
          }`}>
            <p className="text-sm text-muted-foreground mb-4 font-medium">
              Already bought the course?
            </p>
            <Link href="/tools">
              <AnimatedButton
                variant="ghost"
                className="text-accent-green hover:bg-accent-green/10 font-semibold group"
              >
                <Crown className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                Enter Course Code & Access Tools
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </AnimatedButton>
            </Link>
          </div>

          {/* Social Proof */}
          <div className={`flex flex-col items-center gap-8 transition-all duration-700 delay-1000 ${
            heroVisible ? 'animate-slide-up' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-sm text-muted-foreground font-medium">
              Trusted by 10,000+ YouTube creators and agencies
            </p>
            
            {/* Stats with Animated Counters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl">
              <div className="text-center group">
                <div className="text-3xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform duration-200">
                  <AnimatedCounter 
                    end={2.5} 
                    duration={2500}
                    decimals={1}
                    prefix="$"
                    suffix="M+"
                  />
                </div>
                <div className="text-sm text-muted-foreground">Revenue Analyzed</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform duration-200">
                  <AnimatedCounter 
                    end={50} 
                    duration={2500}
                    suffix="K+"
                  />
                </div>
                <div className="text-sm text-muted-foreground">Channels Analyzed</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-foreground mb-2 group-hover:scale-110 transition-transform duration-200">
                  <AnimatedCounter 
                    end={98} 
                    duration={2500}
                    suffix="%"
                  />
                </div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;