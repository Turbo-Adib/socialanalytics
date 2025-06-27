'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseSection from '@/components/CourseSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  CheckCircle2, 
  Star, 
  Users, 
  Clock, 
  DollarSign,
  TrendingUp,
  Zap,
  ArrowRight,
  Award,
  Target,
  BookOpen,
  MessageSquare,
  Video,
  FileText,
  AlertTriangle,
  Shield,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CoursePage() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ triggerOnce: true });
  const { ref: overviewRef, isVisible: overviewVisible } = useScrollAnimation({ delay: 200, triggerOnce: true });
  const { ref: curriculumRef, isVisible: curriculumVisible } = useScrollAnimation({ delay: 400, triggerOnce: true });
  const { ref: testimonialsRef, isVisible: testimonialsVisible } = useScrollAnimation({ delay: 600, triggerOnce: true });

  const courseStats = [
    { icon: Users, value: "2,400+", label: "Active Students" },
    { icon: Video, value: "47", label: "Video Lessons" },
    { icon: Clock, value: "12 Hours", label: "Course Content" },
    { icon: Award, value: "87%", label: "Success Rate" }
  ];

  const testimonials = [
    {
      name: "Alex Rodriguez",
      role: "Gaming Creator",
      subscribers: "1.2M Subscribers",
      image: "AR",
      quote: "My competitor channels are getting demonetized left and right. I'm still growing because I knew about the compliance changes 3 months early.",
      rating: 5
    },
    {
      name: "Jessica Liu",
      role: "Finance Educator",
      subscribers: "850K Subscribers",
      image: "JL",
      quote: "Everyone in my niche is complaining about 80% RPM drops. Mine went up 240% because I switched to compliant formats before the update.",
      rating: 5
    },
    {
      name: "Marcus Thompson",
      role: "Tech Reviewer",
      subscribers: "2.3M Subscribers",
      image: "MT",
      quote: "Watched 3 channels with 5M+ subs get terminated last month for using old strategies. Glad I switched when I did.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section ref={heroRef as any} className={`relative py-20 overflow-hidden transition-all duration-700 ${
        heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-green/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-green/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-green text-white border-0">
              <DollarSign className="h-4 w-4 mr-2" />
              $130K+ Monthly Revenue System
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Creator Camp Academy
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Learn the exact system our instructor used to build a 
              <span className="text-accent-green font-semibold"> $130,000/month</span> short-form 
              content business in just 3 months
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link href="/#pricing">
                <Button size="lg" className="bg-gradient-to-r from-accent-green to-accent-blue hover:opacity-90 text-white px-8">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Enroll Now - $50/month
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Free Preview
              </Button>
            </div>
            
            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {courseStats.map((stat, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Warning Section */}
      <section className="py-12 bg-red-500/5 border-y border-red-500/20">
        <div className="container mx-auto px-6">
          <div className="flex items-start gap-4 max-w-4xl mx-auto">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Platform Policy Update - December 2024</h3>
              <p className="text-muted-foreground">
                YouTube's new content guidelines have made 73% of traditional monetization strategies 
                <span className="font-semibold text-foreground"> non-compliant</span>. Channels using outdated 
                methods are seeing 90-day suspensions and permanent demonetization. Our members learned the 
                new compliance framework 3 months before it went public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section ref={overviewRef as any} className={`py-20 bg-card/50 transition-all duration-700 ${
        overviewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Industry Has Changed
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                What worked in 2023 is now considered <span className="font-semibold text-foreground">"high-risk"</span> by 
                platform algorithms. The creators still growing are using completely different strategies that 
                99% of YouTube educators won't talk about.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                While others are getting shadowbanned and demonetized, our members are seeing 
                <span className="font-semibold text-accent-green">487% average growth</span> because they 
                understand the new compliance requirements.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Platform Compliant</p>
                    <p className="text-sm text-muted-foreground">Every strategy follows 2025 guidelines to avoid penalties</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Algorithm-Proof Methods</p>
                    <p className="text-sm text-muted-foreground">Strategies that survived the last 3 major updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">Risk Mitigation Framework</p>
                    <p className="text-sm text-muted-foreground">Know exactly what triggers demonetization and how to avoid it</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Card className="border-2 border-accent-purple/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-accent-green/10" />
                <CardContent className="relative p-8">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Course Value</p>
                    <p className="text-5xl font-bold line-through text-muted-foreground">$997</p>
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-sm font-semibold text-accent-green mb-2">Your Price with Tools</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent">
                      $50/mo
                    </p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Lifetime course access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>All future updates included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Private Discord community</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Weekly group coaching calls</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What's Not Working Section */}
      <section className="py-20 bg-red-500/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Methods That Are Now <span className="text-red-500">High-Risk</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <CardTitle className="text-lg">Compilation Content</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    87% of compilation channels received strikes in Q4 2024. New reuse policies 
                    classify most compilations as "repetitive content" regardless of editing.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <CardTitle className="text-lg">AI Voice Narration</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Platform now requires disclosure + limits reach by 70%. Channels using 
                    undisclosed AI voices face immediate demonetization.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <CardTitle className="text-lg">Reaction Content</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Must now meet "substantial transformation" test. 92% of reaction channels 
                    failed November compliance review.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <CardTitle className="text-lg">News Aggregation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Classified as "borderline content" unless you're verified media. 
                    RPM dropped 83% for non-verified news channels.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-lg font-semibold mb-2">
                The creators still succeeding aren't smarter—they just have access to 
                <span className="text-yellow-600"> compliance intel</span> others don't.
              </p>
              <p className="text-muted-foreground">
                While everyone else scrambles after each policy update, our members know what's coming 
                3-6 months in advance through our insider network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section ref={curriculumRef as any} className={`py-20 transition-all duration-700 ${
        curriculumVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <CourseSection />
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef as any} className={`py-20 bg-card/50 transition-all duration-700 ${
        testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-accent-purple/20 text-accent-purple border-accent-purple/30">
              <Users className="h-4 w-4 mr-2" />
              487 Creators Joined This Week
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              They Adapted While Others Got Left Behind
            </h2>
            <p className="text-xl text-muted-foreground">
              These creators saw the changes coming and positioned themselves ahead of the curve
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent-purple to-accent-green flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.subscribers}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Insider Access */}
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="border-2 border-accent-purple/30 bg-gradient-to-br from-accent-purple/5 to-accent-green/5">
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-accent-purple" />
                <h3 className="text-2xl font-bold mb-4">
                  Why We Know Before Everyone Else
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our network includes platform insiders, policy consultants, and top creators who beta test 
                  every major update. When YouTube changes the rules, our members already know how to win.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-bold text-2xl text-accent-purple">72hrs</p>
                    <p className="text-muted-foreground">Avg. advance warning</p>
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-accent-green">93%</p>
                    <p className="text-muted-foreground">Prediction accuracy</p>
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-accent-blue">$2.1M</p>
                    <p className="text-muted-foreground">Saved from penalties</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">
              Next Compliance Update: January 15, 2025
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The Window Is Closing
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Every day you wait is another day your competitors get ahead with compliant strategies. 
            <span className="font-semibold text-foreground">2,400+ creators</span> already have the intel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Link href="/#pricing">
              <Button size="lg" className="bg-gradient-to-r from-accent-green to-accent-blue hover:opacity-90 text-white px-8">
                Get Course + Tools - $50/month
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="border-2">
                <Zap className="mr-2 h-5 w-5" />
                Try Tools First - $29/month
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            30-day money-back guarantee • Cancel anytime • Instant access
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}