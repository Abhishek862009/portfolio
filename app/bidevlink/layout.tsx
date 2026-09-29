import type { Metadata } from 'next';
import Link from 'next/link';
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-bidevlink-display',
});
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-bidevlink-body',
});

export const metadata: Metadata = {
  title: {
    default: 'Bidevlink — Websites for Indian Exporters, Built in 48 Hours',
    template: '%s | Bidevlink',
  },
  description:
    'Bidevlink builds simple, professional websites for Indian exporters and manufacturers — a new site in 48 hours, or a care plan to refresh an outdated one. Built to help overseas buyers trust you before the first call.',
  keywords: [
    'website for exporters',
    'website for manufacturers India',
    'export company website',
    'website design India',
    'small business website 48 hours',
    'website update service',
  ],
  openGraph: {
    type: 'website',
    title: 'Bidevlink — Websites for Indian Exporters, Built in 48 Hours',
    description:
      'A new website or a refreshed one, built for Indian exporters and manufacturers so international buyers trust you faster.',
    url: '/bidevlink',
  },
  twitter: {
    card: 'summary',
    title: 'Bidevlink — Websites for Indian Exporters',
    description:
      'A new website or a refreshed one, built for Indian exporters and manufacturers so international buyers trust you faster.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Bidevlink',
  description:
    'Websites for Indian exporters and manufacturers — new sites built in 48 hours, or a care plan for an existing site.',
  areaServed: 'IN',
  email: 'abhishek.studio.dev@gmail.com',
};

// Every selector is scoped under .bidevlink-page so this section's own look
// (font pairing + navy/brass palette) can't leak into, or be affected by,
// the shared globals.css.
const styles = `
.bidevlink-page {
  --d-bg: #0F2A3D;
  --d-ink: #EDEAE0;
  --d-ink-soft: #A9BAC4;
  --d-brass: #C9973B;
  --d-brick: #C24A3B;
  --d-line: #294A5E;
  --d-card: #14324480;
  background: var(--d-bg);
  color: var(--d-ink);
  font-family: var(--font-bidevlink-body), -apple-system, sans-serif;
  line-height: 1.55;
  min-height: 100dvh;
}
.bidevlink-page h1, .bidevlink-page h2, .bidevlink-page h3 {
  font-family: var(--font-bidevlink-display), sans-serif;
  margin: 0;
}
.bidevlink-page a { color: inherit; }
.bidevlink-page .wrap { max-width: 860px; margin: 0 auto; padding: 32px 20px 70px; }

.bidevlink-page .site-header {
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 14px; margin-bottom: 56px;
}
.bidevlink-page .brand {
  font-family: var(--font-bidevlink-display), sans-serif;
  font-weight: 700; font-size: 18px; letter-spacing: .3px; text-decoration: none;
}
.bidevlink-page .brand span { color: var(--d-brass); }
.bidevlink-page .site-header nav { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.bidevlink-page .site-header nav a { color: var(--d-ink-soft); text-decoration: none; font-size: 14px; }
.bidevlink-page .site-header nav a:hover { color: var(--d-ink); }
.bidevlink-page .site-header nav a.nav-cta {
  color: #fff; background: var(--d-brick); padding: 8px 16px; border-radius: 4px; font-weight: 600;
}

.bidevlink-page .page-head { margin-bottom: 44px; }
.bidevlink-page .kicker { color: var(--d-brass); font-size: 14px; margin-bottom: 14px; }
.bidevlink-page h1 { font-size: clamp(30px, 6vw, 44px); font-weight: 700; line-height: 1.15; max-width: 16ch; }
.bidevlink-page .lead { color: var(--d-ink-soft); font-size: 17px; max-width: 50ch; margin-top: 18px; }
.bidevlink-page .cta {
  display: inline-block; margin-top: 26px; background: var(--d-brick); color: #fff;
  padding: 13px 24px; border-radius: 4px; text-decoration: none; font-weight: 600; font-size: 15px;
}
.bidevlink-page .cta.ghost { background: transparent; border: 1px solid var(--d-line); color: var(--d-ink); margin-left: 10px; }

.bidevlink-page section { margin-bottom: 64px; }
.bidevlink-page .section-label { color: var(--d-brass); font-size: 13px; margin-bottom: 10px; }
.bidevlink-page h2 { font-size: 24px; margin-bottom: 26px; max-width: 28ch; }

.bidevlink-page .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.bidevlink-page .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
@media (max-width: 720px) { .bidevlink-page .grid3 { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .bidevlink-page .grid2 { grid-template-columns: 1fr; } }

.bidevlink-page .card { border: 1px solid var(--d-line); border-radius: 6px; padding: 24px; background: var(--d-card); }
.bidevlink-page .card.build { border-top: 3px solid var(--d-brick); }
.bidevlink-page .card.care { border-top: 3px solid var(--d-brass); }
.bidevlink-page .card h3 { font-size: 18px; margin-bottom: 8px; }
.bidevlink-page .card p { color: var(--d-ink-soft); font-size: 14.5px; margin: 0; }
.bidevlink-page .card ul { padding-left: 18px; margin: 16px 0 0; color: var(--d-ink-soft); font-size: 14.5px; }
.bidevlink-page .card li { margin-bottom: 6px; }
.bidevlink-page .tag { color: var(--d-ink-soft); font-size: 13px; margin-bottom: 4px; }

.bidevlink-page .step { display: flex; gap: 16px; padding: 18px 0; border-bottom: 1px dashed var(--d-line); }
.bidevlink-page .step:last-child { border-bottom: none; }
.bidevlink-page .step .num {
  font-family: var(--font-bidevlink-display), sans-serif;
  color: var(--d-brass); font-weight: 700; font-size: 15px; flex-shrink: 0; width: 24px;
}
.bidevlink-page .step .t { font-weight: 600; margin-bottom: 3px; }
.bidevlink-page .step .d { color: var(--d-ink-soft); font-size: 14.5px; }

.bidevlink-page .band {
  border: 1px solid var(--d-line); border-radius: 6px; padding: 32px 24px; background: var(--d-card);
}
.bidevlink-page .band h2 { margin-bottom: 10px; }
.bidevlink-page .band p { color: var(--d-ink-soft); margin: 0; max-width: 52ch; }

.bidevlink-page .faq details { border-bottom: 1px dashed var(--d-line); padding: 14px 0; }
.bidevlink-page .faq summary { cursor: pointer; font-weight: 600; }
.bidevlink-page .faq p { color: var(--d-ink-soft); font-size: 14.5px; margin: 10px 0 0; }

.bidevlink-page .site-footer {
  border-top: 1px solid var(--d-line); padding-top: 24px; color: var(--d-ink-soft);
  font-size: 13.5px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;
}
.bidevlink-page .site-footer nav { display: flex; gap: 16px; flex-wrap: wrap; }
.bidevlink-page .site-footer a { color: var(--d-ink); text-decoration: none; }
`;

export default function BidevlinkLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`bidevlink-page ${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="wrap">
        <header className="site-header">
          <Link href="/bidevlink" className="brand">
            Bidev<span>link</span>
          </Link>
          <nav>
            <Link href="/bidevlink">Home</Link>
            <Link href="/bidevlink/services">Services</Link>
            <Link href="/bidevlink/process">How it works</Link>
            {/* Contact Us takes visitors to the main site's contact section,
                where the Contact me button lives. */}
            <a href="/#contact" className="nav-cta">Contact Us</a>
          </nav>
        </header>

        {children}

        <footer className="site-footer">
          <span>Bidevlink · built for small exporters</span>
          <nav>
            <Link href="/bidevlink/services">Services</Link>
            <Link href="/bidevlink/process">How it works</Link>
            <a href="/#contact">Contact Us</a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
