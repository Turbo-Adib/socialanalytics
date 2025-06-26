'use client';

import React from 'react';
import { Play, Mail, Twitter, Youtube, Github, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API Access', href: '#api' },
      { name: 'Integrations', href: '#integrations' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press Kit', href: '#press' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Status Page', href: '#status' },
      { name: 'Bug Reports', href: '#bugs' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Youtube, href: '#youtube', label: 'YouTube' },
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Mail, href: 'mailto:hello@insightsync.io', label: 'Email' }
  ];

  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-youtube-red/10 to-accent-blue/10 rounded-2xl p-8 mb-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Stay Updated with Creator Economy Insights
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get weekly tips on YouTube monetization, industry trends, and platform updates 
            delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12"
            />
            <Button className="bg-youtube-red hover:bg-youtube-red-hover text-white px-6 h-12">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative mr-3">
                <div className="absolute -inset-1 bg-youtube-red rounded-lg blur opacity-25"></div>
                <div className="relative bg-youtube-red p-2 rounded-lg">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">InsightSync</h3>
                <p className="text-xs text-muted-foreground -mt-1">YouTube Analytics</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The only analytics platform that shows YouTube creators their true revenue potential 
              with AI-powered insights and niche-specific calculations.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 bg-muted/20 hover:bg-youtube-red/20 rounded-lg flex items-center justify-center transition-colors group"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-youtube-red transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} InsightSync. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-youtube-red fill-current" /> for creators
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>🇺🇸 United States</span>
              <span>•</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;