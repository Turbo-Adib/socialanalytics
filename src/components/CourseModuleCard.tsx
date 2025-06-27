'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface CourseModule {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  topics: string[];
  color: string;
  bgColor: string;
}

interface CourseModuleCardProps {
  module: CourseModule;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function CourseModuleCard({ module, isExpanded, onToggle }: CourseModuleCardProps) {
  const Icon = module.icon;
  
  return (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`inline-flex items-center justify-center w-14 h-14 ${module.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
              <Icon className={`h-7 w-7 ${module.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">{module.title}</h4>
              <p className="text-muted-foreground text-sm">{module.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-2"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className={`transition-all duration-300 ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3 text-muted-foreground">You'll learn:</p>
          <ul className="space-y-2">
            {module.topics.map((topic, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}