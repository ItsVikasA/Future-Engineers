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
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 5000,
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
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
