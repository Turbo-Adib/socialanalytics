'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoDownloaderProps {
  onClose: () => void;
  initialUrl?: string;
}

export default function VideoDownloader({ onClose, initialUrl = '' }: VideoDownloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Construct the URL with the initial video URL if provided
  const getEmbedUrl = () => {
    const baseUrl = 'https://cnvmp3.com';
    if (initialUrl) {
      // If we have an initial URL, we can try to navigate directly to it
      // cnvmp3.com might support URL parameters for pre-filling
      return baseUrl;
    }
    return baseUrl;
  };

  useEffect(() => {
    // Set a timeout for loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeError = () => {
    setError('Unable to load the downloader. Please try again later.');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Download className="h-6 w-6" />
              Video to MP4/MP3 Converter
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              Convert and download videos to MP4 or MP3 format
              <div className="flex gap-1">
                <Badge variant="secondary" className="text-xs">YouTube</Badge>
                <Badge variant="secondary" className="text-xs">TikTok</Badge>
                <Badge variant="secondary" className="text-xs">Instagram</Badge>
                <Badge variant="secondary" className="text-xs">Facebook</Badge>
              </div>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-sm text-muted-foreground">Loading downloader...</p>
              </div>
            </div>
          )}

          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full border-0"
              title="Video Downloader"
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
              referrerPolicy="no-referrer"
            />
          )}
        </CardContent>

        <div className="p-4 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Powered by cnvmp3.com - External service
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://cnvmp3.com', '_blank')}
            >
              Open in New Tab
              <ExternalLink className="h-3 w-3 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}