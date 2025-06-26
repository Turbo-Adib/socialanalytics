'use client';

import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { 
  PlayCircle, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            YouTube Analytics Design System
          </h1>
          <p className="text-xl text-muted-foreground">
            Modern SaaS Dashboard Components with shadcn/ui
          </p>
        </div>

        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-8">
            
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button className="bg-youtube-red hover:bg-youtube-red-hover">
                    YouTube Style
                  </Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Cards & Metrics</CardTitle>
                <CardDescription>Dashboard-style metric cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Total Views
                          </p>
                          <p className="text-2xl font-bold">1.2M</p>
                        </div>
                        <Eye className="h-8 w-8 text-accent-blue" />
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 text-accent-green mr-1" />
                        <span className="text-accent-green">+12.5%</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Subscribers
                          </p>
                          <p className="text-2xl font-bold">45.2K</p>
                        </div>
                        <Users className="h-8 w-8 text-accent-purple" />
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 text-accent-green mr-1" />
                        <span className="text-accent-green">+8.2%</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Revenue
                          </p>
                          <p className="text-2xl font-bold">$3,847</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-accent-green" />
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 text-accent-green mr-1" />
                        <span className="text-accent-green">+15.3%</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Engagement
                          </p>
                          <p className="text-2xl font-bold">4.8%</p>
                        </div>
                        <ThumbsUp className="h-8 w-8 text-accent-orange" />
                      </div>
                      <div className="mt-4 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 text-accent-green mr-1" />
                        <span className="text-accent-green">+2.1%</span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Error</Badge>
                  <Badge className="bg-accent-green/20 text-accent-green border-accent-green/30">
                    Success
                  </Badge>
                  <Badge className="bg-accent-orange/20 text-accent-orange border-accent-orange/30">
                    Warning
                  </Badge>
                  <Badge className="bg-accent-blue/20 text-accent-blue border-accent-blue/30">
                    Info
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Progress & Loading */}
            <Card>
              <CardHeader>
                <CardTitle>Progress & Loading States</CardTitle>
                <CardDescription>Progress indicators and skeleton loaders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Loading States</h4>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Information and status messages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Info</AlertTitle>
                  <AlertDescription>
                    Your analytics data has been updated with the latest metrics.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-accent-green/50 text-accent-green">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Channel analysis completed successfully. New insights available.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Unable to fetch YouTube data. Please check your API key.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Forms */}
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Input fields and form controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Channel URL</label>
                    <Input placeholder="https://youtube.com/@channel" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Analysis Period</label>
                    <Input placeholder="Last 30 days" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Brand colors and theme variations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Primary Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Primary (YouTube Red)</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="h-20 bg-youtube-red rounded-lg flex items-end p-2">
                      <span className="text-white text-xs font-mono">#FF0000</span>
                    </div>
                    <div className="h-20 bg-youtube-red-hover rounded-lg flex items-end p-2">
                      <span className="text-white text-xs font-mono">#CC0000</span>
                    </div>
                    <div className="h-20 bg-youtube-red-light rounded-lg flex items-end p-2">
                      <span className="text-white text-xs font-mono">#FF4444</span>
                    </div>
                  </div>
                </div>

                {/* Accent Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Accent Colors</h3>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="h-20 bg-accent-blue rounded-lg flex items-end p-2">
                      <span className="text-white text-xs font-mono">#3EA6FF</span>
                    </div>
                    <div className="h-20 bg-accent-green rounded-lg flex items-end p-2">
                      <span className="text-white text-xs font-mono">#2BA640</span>
                    </div>
                    <div className="h-20 bg-accent-purple rounded-lg flex items-end p-2">
                      <span className="text-white text-xs font-mono">#9147FF</span>
                    </div>
                    <div className="h-20 bg-accent-orange rounded-lg flex items-end p-2">
                      <span className="text-white text-xs font-mono">#FF7626</span>
                    </div>
                    <div className="h-20 bg-accent-yellow rounded-lg flex items-end p-2">
                      <span className="text-gray-900 text-xs font-mono">#FFD600</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Typography Scale</CardTitle>
                <CardDescription>Text styles and hierarchy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl font-bold">Heading 1</h1>
                  <h2 className="text-4xl font-bold">Heading 2</h2>
                  <h3 className="text-3xl font-bold">Heading 3</h3>
                  <h4 className="text-2xl font-bold">Heading 4</h4>
                  <h5 className="text-xl font-bold">Heading 5</h5>
                  <h6 className="text-lg font-bold">Heading 6</h6>
                  <p className="text-base">Body text - Regular paragraph text with comfortable reading size.</p>
                  <p className="text-sm text-muted-foreground">Small text - Secondary information and captions.</p>
                  <p className="text-xs text-muted-foreground">Extra small text - Fine print and metadata.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layouts Tab */}
          <TabsContent value="layouts" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Layout Examples</CardTitle>
                <CardDescription>Common dashboard layouts and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4" />
                  <p>Layout examples coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}