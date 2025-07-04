import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InsightSync - YouTube Analytics Dashboard',
  description: 'Analyze YouTube channel performance, revenue, and growth trends instantly',
  keywords: 'YouTube analytics, channel analysis, YouTube revenue calculator, content creator tools',
  openGraph: {
    title: 'InsightSync - YouTube Analytics Dashboard',
    description: 'Analyze YouTube channel performance, revenue, and growth trends instantly',
    url: 'https://insightsync.io',
    siteName: 'InsightSync',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Always apply dark mode
                document.documentElement.classList.add('dark')
                localStorage.setItem('theme', 'dark')
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}