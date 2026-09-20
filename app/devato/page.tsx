import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-devato-display',
});
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-devato-body',
});

export const metadata: Metadata = {
  title: 'Devato — Websites for Indian Exporters, Built in 48 Hours',
  description:
    'Devato builds simple, professional websites for Indian exporters and manufacturers — a new one-page site in 48 hours, or a monthly care plan to refresh an outdated one. Built to help overseas buyers trust you before the first call.',
  keywords: [
    'website for exporters',
    'website for manufacturers India',
    'export company website',
    'website design India',
    'small business website 48 hours',
    'website update service',
  ],
  alternates: { canonical: '/devato' },
  openGraph: {
    type: 'website',
    title: 'Devato — Websites for Indian Exporters, Built in 48 Hours',
    description:
      'A new website or a refreshed one, built for Indian exporters and manufacturers so international buyers trust you faster.',
    url: '/devato',
  },
  twitter: {
    card: 'summary',
    title: 'Devato — Websites for Indian Exporters',
    description:
      'A new website or a refreshed one, built for Indian exporters and manufacturers so international buyers trust you faster.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Devato',
  description:
    'Websites for Indian exporters and manufacturers — new one-page sites built in 48 hours, or a monthly care plan for an existing site.',
  areaServed: 'IN',
  email: 'abhishek.studio.dev@gmail.com',
  makesOffer: [
    { '@type': 'Offer', name: 'New Website', price: '2999', priceCurrency: 'INR' },
    { '@type': 'Offer', name: 'Website Care Plan', price: '399', priceCurrency: 'INR' },
  ],
};

// All selectors below are scoped under .devato-page so this page's look
// (its own font pairing and navy/brass palette, distinct from the rest of
// the site) can't leak into — or be leaked into by — the shared globals.css.
const styles = `
.devato-page {
  --d-bg: #0F2A3D;
  --d-ink: #EDEAE0;
  --d-ink-soft: #A9BAC4;
  --d-brass: #C9973B;
  --d-brick: #C24A3B;
  --d-line: #294A5E;
  --d-card: #14324480;

  background: var(--d-bg);
  color: var(--d-ink);
  font-family: var(--font-devato-body), -apple-system, sans-serif;
  line-height: 1.55;
  min-height: 100dvh;
}
.devato-page h1, .devato-page h2, .devato-page h3 {
  font-family: var(--font-devato-display), sans-serif;
  margin: 0;
}
.devato-page .wrap { max-width: 760px; margin: 0 auto; padding: 32px 20px 70px; }

.devato-page header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
}
.devato-page .brand { font-family: var(--font-devato-display), sans-serif; font-weight: 700; font-size: 18px; letter-spacing: 0.3px; }
.devato-page .brand span { color: var(--d-brass); }
.devato-page header nav a {
  color: var(--d-ink-soft);
  text-decoration: none;
  font-size: 14px;
  margin-left: 20px;
}

.devato-page .hero { margin-bottom: 72px; }
.devato-page .hero .kicker { color: var(--d-brass); font-size: 14px; margin-bottom: 14px; }
.devato-page .hero h1 {
  font-size: clamp(30px, 6vw, 44px);
  font-weight: 700;
  line-height: 1.15;
  max-width: 14ch;
}
.devato-page .hero p {
  color: var(--d-ink-soft);
  font-size: 17px;
  max-width: 46ch;
  margin-top: 18px;
}
.devato-page .hero-cta {
  display: inline-block;
  margin-top: 26px;
  background: var(--d-brick);
  color: #fff;
  padding: 13px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
}

.devato-page section { margin-bottom: 64px; }
.devato-page .section-label { color: var(--d-brass); font-size: 13px; margin-bottom: 10px; }
.devato-page h2 { font-size: 24px; margin-bottom: 26px; max-width: 26ch; }

.devato-page .offers { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 560px) { .devato-page .offers { grid-template-columns: 1fr; } }

.devato-page .offer { border: 1px solid var(--d-line); border-radius: 6px; padding: 24px; background: var(--d-card); }
.devato-page .offer.build { border-top: 3px solid var(--d-brick); }
.devato-page .offer.care { border-top: 3px solid var(--d-brass); }
.devato-page .offer h3 { font-size: 18px; margin-bottom: 6px; }
.devato-page .offer .price { font-size: 26px; font-weight: 700; margin: 14px 0 4px; }
.devato-page .offer .unit { color: var(--d-ink-soft); font-size: 13px; }
.devato-page .offer ul { padding-left: 18px; margin: 16px 0 0; color: var(--d-ink-soft); font-size: 14.5px; }
.devato-page .offer li { margin-bottom: 6px; }

.devato-page .steps { counter-reset: step; }
.devato-page .step { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px dashed var(--d-line); }
.devato-page .step:last-child { border-bottom: none; }
.devato-page .step .num {
  font-family: var(--font-devato-display), sans-serif;
  color: var(--d-brass);
  font-weight: 700;
  font-size: 15px;
  flex-shrink: 0;
  width: 24px;
}
.devato-page .step .t { font-weight: 600; margin-bottom: 3px; }
.devato-page .step .d { color: var(--d-ink-soft); font-size: 14.5px; }

.devato-page footer {
  border-top: 1px solid var(--d-line);
  padding-top: 24px;
  color: var(--d-ink-soft);
  font-size: 13.5px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.devato-page footer a { color: var(--d-ink); }
`;

export default function DevatoPage() {
  return (
    <div className={`devato-page ${spaceGrotesk.variable} ${ibmPlexSans.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="wrap">
        <header>
          <div className="brand">Dev<span>ato</span></div>
          <nav>
            <a href="#offers">Services</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section className="hero">
          <div className="kicker">Websites for Indian exporters &amp; manufacturers</div>
          <h1>Look ready for the next international buyer.</h1>
          <p>A clean, working website — built or refreshed in 48 hours — so overseas buyers trust you before the first call.</p>
          <a className="hero-cta" href="mailto:abhishek.studio.dev@gmail.com?subject=Website%20enquiry">
            Get a quote
          </a>
        </section>

        <section id="offers">
          <div className="section-label">Two ways we work with you</div>
          <h2>Whether you&apos;re starting from nothing, or just need a refresh</h2>
          <div className="offers">
            <div className="offer build">
              <h3>New Website</h3>
              <div className="price">₹2,999</div>
              <div className="unit">one-time · delivered in 48 hours</div>
              <ul>
                <li>Product showcase with images</li>
                <li>Certifications &amp; company details</li>
                <li>Direct buyer inquiry form</li>
                <li>Your own domain, ready to share</li>
              </ul>
            </div>
            <div className="offer care">
              <h3>Website Care Plan</h3>
              <div className="price">
                ₹399<span style={{ fontSize: 15, fontWeight: 500 }}>/mo</span>
              </div>
              <div className="unit">for sites that already exist, but look outdated</div>
              <ul>
                <li>Unlimited text, price &amp; image updates</li>
                <li>One new product page added monthly</li>
                <li>Priority email support</li>
                <li>No long contract — cancel anytime</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="section-label">How it works</div>
          <h2>From email to live site in three steps</h2>
          <div className="steps">
            <div className="step">
              <div className="num">1</div>
              <div>
                <div className="t">Tell us about your business</div>
                <div className="d">Products, certifications, and any existing content — over email, five minutes.</div>
              </div>
            </div>
            <div className="step">
              <div className="num">2</div>
              <div>
                <div className="t">We build or refresh it</div>
                <div className="d">Delivered within 48 hours for new sites; care-plan updates go out within a day.</div>
              </div>
            </div>
            <div className="step">
              <div className="num">3</div>
              <div>
                <div className="t">You review and go live</div>
                <div className="d">One round of changes included before it&apos;s ready to share with buyers.</div>
              </div>
            </div>
          </div>
        </section>

        <footer id="contact">
          <span>Devato · built for small exporters</span>
          <a href="mailto:abhishek.studio.dev@gmail.com">abhishek.studio.dev@gmail.com</a>
        </footer>
      </div>
    </div>
  );
}
