import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import { AppShell } from '@/components/ui/AppShell';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.arvish.xyz'),

  title: {
    default: 'Abhishek | Software Developer & AI Enthusiast',
    template: '%s | Abhishek',
  },

  description:
    'Abhishek is a software developer exploring AI, technology, and creative digital projects. Explore his portfolio, projects, journey, and work.',

  keywords: [
    'Abhishek',
    'Abhishek software developer',
    'Abhishek AI',
    'software developer portfolio',
    'AI enthusiast',
    'developer portfolio',
  ],

  authors: [{ name: 'Abhishek' }],
  creator: 'Abhishek',

  alternates: {
    canonical: 'https://www.arvish.xyz',
  },

  openGraph: {
    title: 'Abhishek | Software Developer & AI Enthusiast',
    description:
      "Explore Abhishek's portfolio, projects, journey, and work in software development and AI.",
    url: 'https://www.arvish.xyz',
    siteName: 'Abhishek',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Abhishek | Software Developer & AI Enthusiast',
    description:
      "Explore Abhishek's portfolio, projects, journey, and work in software development and AI.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppShell>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AppShell>
      </body>
    </html>
  );
  }
