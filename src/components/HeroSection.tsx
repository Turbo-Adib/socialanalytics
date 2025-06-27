'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, TrendingUp, DollarSign, BarChart3, Crown } from 'lucide-react';
import { DiscordLoginButton } from './DiscordLoginButton';
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
            <div className="bg-discord-blurple/10 backdrop-blur-sm border border-discord-blurple/20 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg className="h-5 w-5 text-discord-blurple" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <p className="text-sm font-semibold text-discord-blurple">
                  Course Members Get Instant Access
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Already part of our YouTube Analytics Mastery course? Sign in with your Discord account for unlimited access to all premium features.
              </p>
              <DiscordLoginButton 
                text="Sign in with Discord" 
                className="w-full sm:w-auto bg-discord-blurple hover:bg-discord-blurple-hover text-white"
              />
            </div>
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