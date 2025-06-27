'use client';

import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen } from 'lucide-react';

export default function CourseBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-accent-purple/10 via-accent-green/10 to-accent-blue/10 border-y">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/5 to-accent-green/5 animate-pulse" />
      <div className="container mx-auto px-6 py-3 relative">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Sparkles className="h-4 w-4 text-accent-purple animate-pulse" />
          <BookOpen className="h-4 w-4 text-accent-green" />
          <span className="font-medium">
            <span className="hidden sm:inline">Limited Time: </span>
            Get our <span className="text-accent-purple font-semibold">$997 Creator Course</span> 
            {' '}FREE with any subscription
          </span>
          <Badge className="bg-gradient-to-r from-accent-green to-accent-blue text-white border-0 text-xs">
            BONUS
          </Badge>
        </div>
      </div>
    </div>
  );
}