import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Star } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  variant?: 'default' | 'featured';
  icon: LucideIcon;
  title: string;
  description: string;
  badges?: Array<{ text: string; variant?: 'default' | 'secondary' | 'outline' }>;
  color?: string;
  bgColor?: string;
  onClick?: () => void;
  usage?: number;
  recommended?: boolean;
  category?: string;
  isNew?: boolean;
}

export default function ToolCard({
  variant = 'default',
  icon: Icon,
  title,
  description,
  badges = [],
  color = 'text-primary',
  bgColor = 'bg-primary/10',
  onClick,
  usage,
  recommended,
  category,
  isNew
}: ToolCardProps) {
  const isFeatured = variant === 'featured';
  
  return (
    <Card 
      className={`
        ${isFeatured ? 'col-span-full border-2' : ''} 
        hover:shadow-lg transition-all duration-300 cursor-pointer group 
        ${onClick ? 'hover:scale-[1.02]' : ''}
        relative overflow-hidden
      `}
      onClick={onClick}
    >
      {isNew && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
            NEW
          </Badge>
        </div>
      )}
      
      {recommended && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400" />
      )}
      
      <CardHeader className={isFeatured ? 'pb-3' : 'pb-4'}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`
              inline-flex items-center justify-center 
              ${isFeatured ? 'w-16 h-16' : 'w-14 h-14'} 
              ${bgColor} rounded-xl group-hover:scale-110 transition-transform
            `}>
              <Icon className={`${isFeatured ? 'h-8 w-8' : 'h-7 w-7'} ${color}`} />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-semibold`}>
                  {title}
                </CardTitle>
                {recommended && (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              
              {category && (
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  {category}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-muted-foreground ${isFeatured ? 'text-base' : 'text-sm'} mb-4`}>
          {description}
        </p>
        
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant || 'secondary'} className="text-xs">
                {badge.text}
              </Badge>
            ))}
          </div>
        )}
        
        {(usage || isFeatured) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
            {usage && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{usage.toLocaleString()} uses this week</span>
              </div>
            )}
            {isFeatured && (
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-3 w-3" />
                <span>Most accurate results</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}