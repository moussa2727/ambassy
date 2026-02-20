import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: 'Ambassade - Formulaire et Services',
  description: 'Application ambassade avec Next.js et TypeScript',
  icons: '/favicon.png',
  openGraph: {
    title: 'Ambassade - Formulaire et Services',
    description: 'Application ambassade avec Next.js et TypeScript',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'Ambassade',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ambassade - Formulaire et Services',
    description: 'Application ambassade avec Next.js et TypeScript',
    images: ['/favicon.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-green-50 via-white to-green-50 min-h-screen`}
      >
        {children}
        <Toaster position="top-right" expand={false} richColors closeButton />
      </body>
    </html>
  );
}
