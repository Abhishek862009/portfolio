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
  title: 'Abhishek — Curious by nature. Builder by choice.',
  description:
    'Software developer exploring the edges of AI. Portfolio, projects, and journey.',
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
