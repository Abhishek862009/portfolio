import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/bidevlink' },
};

export default function BidevlinkHome() {
  return (
    <>
      <section className="page-head">
        <div className="kicker">Websites for Indian exporters &amp; manufacturers</div>
        <h1>Look ready for the next international buyer.</h1>
        <p className="lead">
          A clean, working website — built or refreshed in 48 hours — so overseas buyers trust you
          before the first call.
        </p>
        <a className="cta" href="/#contact">Contact Us</a>
        <Link className="cta ghost" href="/bidevlink/services">See services</Link>
      </section>

      <section>
        <div className="section-label">Why it matters</div>
        <h2>Buyers check your website before they reply to your email</h2>
        <div className="grid3">
          <div className="card">
            <h3>Trust first</h3>
            <p>A proper website tells a first-time overseas buyer that your business is real and established.</p>
          </div>
          <div className="card">
            <h3>Show your products</h3>
            <p>Products, certifications and company details in one place, ready to share on any enquiry.</p>
          </div>
          <div className="card">
            <h3>Easy to reach</h3>
            <p>A direct enquiry option, so serious buyers can contact you without hunting for details.</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-label">What we do</div>
        <h2>Whether you&apos;re starting from nothing, or just need a refresh</h2>
        <div className="grid2">
          <div className="card build">
            <h3>New Website</h3>
            <div className="tag">for exporters without a website</div>
            <ul>
              <li>Product showcase with images</li>
              <li>Certifications &amp; company details</li>
              <li>Direct buyer enquiry option</li>
              <li>Delivered in 48 hours</li>
            </ul>
          </div>
          <div className="card care">
            <h3>Website Care Plan</h3>
            <div className="tag">for sites that exist, but look outdated</div>
            <ul>
              <li>Text, image and product updates</li>
              <li>New product pages added</li>
              <li>Priority email support</li>
              <li>No long contract</li>
            </ul>
          </div>
        </div>
        <p style={{ marginTop: 18 }}>
          <Link href="/bidevlink/services" style={{ color: 'var(--d-brass)' }}>
            Full details on the Services page →
          </Link>
        </p>
      </section>

      <section>
        <div className="band">
          <h2>Ready to get started?</h2>
          <p>Tell us about your business and we&apos;ll take it from there.</p>
          <a className="cta" href="/#contact">Contact Us</a>
        </div>
      </section>
    </>
  );
}
