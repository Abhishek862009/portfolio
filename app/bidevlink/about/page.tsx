import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Bidevlink builds simple, professional websites for small Indian exporters and manufacturers, so overseas buyers can trust them before the first call.',
  alternates: { canonical: '/bidevlink/about' },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-head">
        <div className="kicker">About Us</div>
        <h1>Websites made for exporters, not for everyone.</h1>
        <p className="lead">
          Bidevlink is a small web-design studio focused on one thing: helping Indian exporters and
          manufacturers look credible online.
        </p>
      </section>

      <section>
        <div className="section-label">Who we are</div>
        <h2>A focused studio, based in India</h2>
        <p style={{ color: 'var(--d-ink-soft)', maxWidth: '60ch', margin: 0 }}>
          Many good Indian exporters and manufacturers have no website, or one that looks outdated.
          Overseas buyers often check a company online before replying, and a missing or old site
          can cost that first impression. Bidevlink exists to fix that with clean, working websites
          that are quick to build and simple to maintain.
        </p>
        <p style={{ color: 'var(--d-ink-soft)', maxWidth: '60ch', margin: '16px 0 0' }}>
          <strong style={{ color: 'var(--d-ink)' }}>Founder:</strong> Abhishek (also known as Arvish)
        </p>
      </section>

      <section>
        <div className="section-label">What we believe</div>
        <h2>Simple, fast and clear</h2>
        <div className="grid3">
          <div className="card">
            <h3>Simple</h3>
            <p>No confusing tech talk. You share your business details and we handle the rest.</p>
          </div>
          <div className="card">
            <h3>Fast</h3>
            <p>New websites are delivered in 48 hours, so you are not waiting weeks to look ready.</p>
          </div>
          <div className="card">
            <h3>Buyer-focused</h3>
            <p>Every site is built around what a first-time overseas buyer looks for: products, proof and a way to reach you.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-label">Who we work with</div>
        <h2>Small exporters and manufacturers across India</h2>
        <div className="card">
          <ul style={{ margin: 0 }}>
            <li>Exporters who do not have a website yet</li>
            <li>Businesses whose current site looks outdated</li>
            <li>Manufacturers with a larger catalogue who need a multi-page site</li>
          </ul>
        </div>
      </section>

      <section>
        <div className="section-label">Get in touch</div>
        <h2>Reach us directly</h2>
        <div className="grid2">
          <div className="card">
            <h3>Email</h3>
            <p>
              <a href="mailto:abhishek.studio.dev@gmail.com">abhishek.studio.dev@gmail.com</a>
              <br />
              <a href="mailto:arvish2287@gmail.com">arvish2287@gmail.com</a>
            </p>
          </div>
          <div className="card">
            <h3>Instagram</h3>
            <p>
              Bidevlink:{' '}
              <a href="https://www.instagram.com/bidevlink" target="_blank" rel="noopener noreferrer">@bidevlink</a>
              <br />
              Founder:{' '}
              <a href="https://www.instagram.com/abhi.visible" target="_blank" rel="noopener noreferrer">@abhi.visible</a>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="band">
          <h2>Let&apos;s talk about your business</h2>
          <p>Tell us what you export or make, and we will suggest the right website for it.</p>
          <a className="cta" href="/#contact">Contact Us</a>
          <Link className="cta ghost" href="/bidevlink/services">See services</Link>
        </div>
      </section>
    </>
  );
}
