'use client';

import React from 'react';
import { ArrowRight, Play, TrendingUp, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Link from 'next/link';

interface CTASectionProps {
  onStartAnalysis: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartAnalysis }) => {
  return (
    <section className="px-4 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Main CTA Card */}
        <div className="relative bg-gradient-to-br from-youtube-red/10 via-card to-accent-blue/10 rounded-3xl p-12 md:p-16 text-center border border-border/50 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-youtube-red/5 to-transparent opacity-50" />
          <div className="absolute top-8 right-8 w-32 h-32 bg-youtube-red/10 rounded-full blur-3xl" />
          <div className="absolute bottom-8 left-8 w-24 h-24 bg-accent-blue/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            {/* Badge */}
            <Badge className="mb-8 px-6 py-3 text-base font-medium bg-accent-green/20 text-accent-green border-accent-green/30">
              <Clock className="h-4 w-4 mr-2" />
              Get Started in Under 30 Seconds
            </Badge>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
              Ready to Discover Your
              <span className="block bg-gradient-to-r from-youtube-red to-youtube-red-hover bg-clip-text text-transparent">
                True Revenue Potential?
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of creators who've unlocked hidden revenue opportunities. 
              Get your free analysis now and see what your channel is really worth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/auth/signup">
                <Button
                  className="bg-youtube-red hover:bg-youtube-red-hover text-white px-10 py-5 text-xl font-bold rounded-xl shadow-youtube hover:shadow-youtube-hover transform hover:scale-105 transition-all duration-200 min-w-[280px]"
                >
                  <Play className="h-6 w-6 mr-3 fill-white" />
                  Start Free Trial
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </Link>
              <Button
                onClick={onStartAnalysis}
                variant="outline"
                className="px-10 py-5 text-xl font-bold rounded-xl border-2 min-w-[240px] hover:bg-card"
              >
                <TrendingUp className="h-6 w-6 mr-3" />
                Try Sample Analysis
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>100% free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>Results in 30 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                <span>10,000+ happy creators</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Channels Analyzed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground mb-2">$2.5M+</div>
            <div className="text-sm text-muted-foreground">Revenue Calculated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground mb-2">47%</div>
            <div className="text-sm text-muted-foreground">Avg. Revenue Boost</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;