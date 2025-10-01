import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/QueryProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Future Engineers",
  description: "A collaborative platform for engineering students to share and access academic resources",
  keywords: ["engineering", "education", "resources", "students", "collaboration", "academic"],
  authors: [{ name: "Future Engineers" }],
  creator: "Future Engineers",
  publisher: "Future Engineers",
  metadataBase: new URL('https://future-engineers.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Future Engineers",
    description: "A collaborative platform for engineering students to share and access academic resources",
    url: 'https://future-engineers.vercel.app',
    siteName: 'Future Engineers',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Future Engineers Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Future Engineers',
    description: 'A collaborative platform for engineering students to share and access academic resources',
    images: ['/images/logo.png'],
    creator: '@FutureEngineers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/images/logo.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="student-notes-theme">
          <QueryProvider>
            <AuthProvider>
              <StructuredData />
              {children}
              <Toaster 
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerStyle={{
                  top: 80,
                }}
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    maxWidth: '500px',
                  },
                  success: {
                    duration: 2500,
                    style: {
                      background: '#10B981',
                      color: '#ffffff',
                      border: 'none',
                    },
                    iconTheme: {
                      primary: '#ffffff',
                      secondary: '#10B981',
                    },
                  },
                  error: {
                    duration: 4000,
                    style: {
                      background: '#EF4444',
                      color: '#ffffff',
                      border: 'none',
                    },
                    iconTheme: {
                      primary: '#ffffff',
                      secondary: '#EF4444',
                    },
                  },
                  loading: {
                    style: {
                      background: '#3B82F6',
                      color: '#ffffff',
                      border: 'none',
                    },
                  },
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
