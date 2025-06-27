'use client';

import React from 'react';
import { Star, Quote, TrendingUp, Users, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Gaming Content Creator",
      subscribers: "2.3M",
      quote: "InsightSync showed me I was leaving $15K/month on the table. The outlier analysis helped me identify my most profitable content formats.",
      avatar: "SC",
      niche: "Gaming",
      improvement: "+340% Revenue"
    },
    {
      name: "Marcus Rodriguez",
      role: "Tech Reviewer",
      subscribers: "890K",
      quote: "The RPM calculator is incredibly accurate. It's like having a monetization expert analyzing my channel 24/7. Game changer for my business.",
      avatar: "MR",
      niche: "Technology",
      improvement: "+180% CPM"
    },
    {
      name: "Jennifer Park",
      role: "Agency Owner",
      subscribers: "12 Channels",
      quote: "Managing multiple creator channels became so much easier. The course integration gives our clients lifetime value while we scale our agency.",
      avatar: "JP",
      niche: "Agency",
      improvement: "+500% Clients"
    }
  ];

  const stats = [
    {
      icon: TrendingUp,
      value: "43%",
      label: "Average Revenue Increase",
      description: "Within 30 days of using insights"
    },
    {
      icon: Users,
      value: "12.8K+",
      label: "Active Creators",
      description: "Trust our analytics daily"
    },
    {
      icon: Award,
      value: "4.8/5",
      label: "User Satisfaction",
      description: "From 3,247 reviews"
    }
  ];

  const logos = [
    { name: "Creator", width: "120px" },
    { name: "Studios", width: "100px" },
    { name: "Agency", width: "140px" },
    { name: "Media Co", width: "110px" },
    { name: "Networks", width: "130px" }
  ];

  return (
    <section className="px-4 py-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-accent-green/20 text-accent-green border-accent-green/30">
            Social Proof
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by Top Creators
            <span className="block text-youtube-red">Worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators who've discovered their true revenue potential 
            and transformed their YouTube strategy with our analytics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center border-border/50 hover:border-youtube-red/30 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-youtube-red/10 rounded-full mb-6">
                    <IconComponent className="h-8 w-8 text-youtube-red" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-lg font-semibold text-foreground mb-2">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative border-border/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-8 pb-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Quote className="h-8 w-8 text-youtube-red" />
                </div>
                
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent-yellow text-accent-yellow" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-youtube-red rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.subscribers} Subscribers</div>
                  </div>
                  <Badge className="bg-accent-green/20 text-accent-green text-xs">
                    {testimonial.improvement}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8 font-medium">
            Used by leading creator economy companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {logos.map((logo, index) => (
              <div 
                key={index} 
                className="h-12 bg-muted/20 rounded-lg flex items-center justify-center px-6 text-muted-foreground font-bold"
                style={{ width: logo.width }}
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;