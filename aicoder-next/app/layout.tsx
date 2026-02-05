// ============================================================================
// ROOT LAYOUT - Enhanced for Production
// ============================================================================

// External imports
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";

// CSS imports
import "./globals.css";
import "./main.css";

// Component imports
import ErrorBoundary from "@/components/ErrorBoundary";
import { Providers } from "@/components/Providers";
import { Analytics } from "@/components/Analytics";

// ============================================================================
// METADATA CONFIGURATION - SEO & PWA Optimized
// ============================================================================

export const metadata: Metadata = {
  // Basic metadata
  title: {
    default: "AI Code Improver Pro",
    template: "%s | AI Code Improver Pro",
  },
  description: "Professional AI-powered code analysis and improvement tool with support for multiple AI providers, languages, and advanced optimization modes.",
  keywords: [
    "AI code improvement",
    "code optimization",
    "code analysis",
    "automated refactoring",
    "code quality",
    "OpenAI",
    "Claude",
    "Gemini",
    "code assistant",
  ],
  authors: [{ name: "AI Code Improver Team" }],
  creator: "AI Code Improver Team",
  
  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-code-improver.com",
    title: "AI Code Improver Pro - Professional Code Analysis Tool",
    description: "Transform your code with AI-powered analysis and improvements. Support for multiple languages and AI providers.",
    siteName: "AI Code Improver Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Code Improver Pro",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "AI Code Improver Pro",
    description: "Professional AI-powered code analysis and improvement tool",
    images: ["/og-image.png"],
    creator: "@aicodeimprover",
  },

  // PWA & Mobile optimizations
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Code Improver",
  },

  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification codes (add your actual codes)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },

  // Category
  category: "technology",
};

// ============================================================================
// VIEWPORT CONFIGURATION - Responsive & Performance
// ============================================================================

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ============================================================================
// TYPES
// ============================================================================

interface RootLayoutProps {
  children: ReactNode;
  params?: {
    locale?: string;
  };
}

// ============================================================================
// ROOT LAYOUT COMPONENT - Production Ready
// ============================================================================

export default function RootLayout({ children, params }: Readonly<RootLayoutProps>) {
  // Get locale from params or default to 'en'
  const locale = params?.locale || "en";

  return (
    <html 
      lang={locale}
      suppressHydrationWarning // Prevents hydration warnings for theme changes
      className="scroll-smooth"
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for API endpoints */}
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        
        {/* Security headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      
      <body 
        className="antialiased bg-secondary min-h-screen"
        suppressHydrationWarning
      >
        {/* Error Boundary to catch and handle React errors gracefully */}
        <ErrorBoundary>
          {/* Providers for global state, theme, etc. */}
          <Providers>
            {/* Skip to main content link for accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
            >
              Skip to main content
            </a>

            {/* Main content wrapper */}
            <div id="main-content" className="flex flex-col min-h-screen">
              {children}
            </div>

            {/* Analytics component (only in production) */}
            {process.env.NODE_ENV === "production" && <Analytics />}
            
            {/* Screen reader announcements */}
            <div 
              role="status" 
              aria-live="polite" 
              aria-atomic="true" 
              className="sr-only"
              id="announcer"
            />
          </Providers>
        </ErrorBoundary>

        {/* Service Worker registration (if using PWA) */}
        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(
                      function(registration) {
                        console.log('ServiceWorker registration successful');
                      },
                      function(err) {
                        console.log('ServiceWorker registration failed: ', err);
                      }
                    );
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
