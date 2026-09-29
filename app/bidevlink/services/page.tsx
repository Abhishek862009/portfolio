import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'New websites for Indian exporters without one, and a care plan to refresh outdated sites. Larger multi-page and multi-product sites also available.',
  alternates: { canonical: '/bidevlink/services' },
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-head">
        <div className="kicker">Services</div>
        <h1>Three ways we can help your business online.</h1>
        <p className="lead">
          Pick what fits where you are today. Not sure which one? Contact us and we&apos;ll suggest it.
        </p>
      </section>

      <section>
        <div className="grid2">
          <div className="card build">
            <h3>New Website</h3>
            <div className="tag">delivered in 48 hours</div>
            <p style={{ marginTop: 10 }}>
              A clean, professional site for exporters and manufacturers who don&apos;t have one yet.
            </p>
            <ul>
              <li>Product showcase with images</li>
              <li>Certifications &amp; company details</li>
              <li>Direct buyer enquiry option</li>
              <li>Your own domain, ready to share</li>
            </ul>
          </div>
          <div className="card care">
            <h3>Website Care Plan</h3>
            <div className="tag">for existing, outdated sites</div>
            <p style={{ marginTop: 10 }}>
              Keep your current website fresh without dealing with developers every time.
            </p>
            <ul>
              <li>Text, image and product updates</li>
              <li>New product pages added</li>
              <li>Priority email support</li>
              <li>No long contract — cancel anytime</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="card" style={{ borderTop: '3px solid var(--d-line)' }}>
          <h3>Custom Multi-page Website</h3>
          <div className="tag">for larger catalogues</div>
          <p style={{ marginTop: 10 }}>
            Several pages, a separate page for each product with its specifications, or a design
            matched to a reference site you like. Scoped around your business.
          </p>
          <ul>
            <li>Multiple pages and product-wise spec pages</li>
            <li>Design matched to your reference, if you have one</li>
            <li>Built around your exact requirements</li>
          </ul>
        </div>
      </section>

      <section className="faq">
        <div className="section-label">Common questions</div>
        <h2>Before you reach out</h2>
        <details>
          <summary>Do I need to prepare anything?</summary>
          <p>Just your product details, certifications and any existing content you have. We guide you on the rest.</p>
        </details>
        <details>
          <summary>Can I change things after the site is ready?</summary>
          <p>One round of changes is included before go-live. After that, the Care Plan covers ongoing updates.</p>
        </details>
        <details>
          <summary>I already have a website. Can you just improve it?</summary>
          <p>Yes, that&apos;s what the Care Plan is for — refreshing and updating what you already have.</p>
        </details>
      </section>

      <section>
        <div className="band">
          <h2>Want to discuss your requirement?</h2>
          <p>Reach out and tell us what you need.</p>
          <a className="cta" href="/#contact">Contact Us</a>
          <Link className="cta ghost" href="/bidevlink/process">How it works</Link>
        </div>
      </section>
    </>
  );
}
