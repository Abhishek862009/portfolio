import fs from 'node:fs';
import path from 'node:path';

import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import { AppShell } from '@/components/ui/AppShell';
import { apps, STORE_PATH } from '@/data/apps';

import { LanguageProvider } from '@/components/i18n/LanguageProvider';
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
    'Arvish',
    'Abhishek Saini',
    'Arvish Saini',
    'Abhishek Mali',
    'Arvish Mali',
    'Engineer Abhishek',
    'Engineer Arvish',
    'Abhishek Developer',
    'Arvish Developer',
    'Abhishek Coder',
    'Arvish Coder',
    'Abhishek Coding',
    'Arvish Coding',
    'Mali Abhishek',
    'Mali Arvish',
    'Saini Abhishek',
    'Saini Arvish',
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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Abhishek',
  alternateName: [
    'Arvish',
    'Abhishek Saini',
    'Arvish Saini',
    'Abhishek Mali',
    'Arvish Mali',
  ],
  url: 'https://www.arvish.xyz',
  jobTitle: 'Software Developer',
  description:
    'Software developer exploring AI, technology, and creative digital projects.',
  knowsAbout: [
    'Software Development',
    'Artificial Intelligence',
    'Coding',
    'Technology',
  ],
  // The one Person schema for the whole site (app/page.tsx used to add a
  // second, partly different one).
  sameAs: [
    'https://github.com/Abhishek862009',
    'https://www.linkedin.com/in/abhishek862009',
  ],
};

// Only the setup-guide pages (the Terminal apps) have an English/Hindi switch; every other
// page is always English.
const GUIDE_PATHS = apps.filter((a) => a.platform === 'Terminal').map((a) => `${STORE_PATH}/${a.slug}`);

const LANG_SCRIPT = `try{var p=location.pathname.replace(/\\/+$/,'');if(${JSON.stringify(GUIDE_PATHS)}.indexOf(p)>-1){var l=localStorage.getItem('ab-lang');if(l==='hi')document.documentElement.setAttribute('data-lang','hi')}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Same trick as the hero photo: the Resume link appears by itself once
  // public/resume.pdf exists, instead of pointing at a 404 until then.
  const hasResume = fs.existsSync(path.join(process.cwd(), 'public', 'resume.pdf'));

  return (
    // data-lang is set again by the script below before anything is painted, so the
    // server's value (English) and the browser's can differ on purpose.
    <html lang="en" data-lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* On a setup-guide page, applies the saved English/Hindi choice before the first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
      </head>
      <body>
        <LanguageProvider guidePaths={GUIDE_PATHS}>
          <AppShell>
            <Navbar hasResume={hasResume} />
            <main>{children}</main>
            <Footer />
          </AppShell>
        </LanguageProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </body>
    </html>
  );
}