import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'From first message to a live website in three simple steps.',
  alternates: { canonical: '/bidevlink/process' },
};

export default function ProcessPage() {
  return (
    <>
      <section className="page-head">
        <div className="kicker">How it works</div>
        <h1>From first message to live site in three steps.</h1>
        <p className="lead">A simple process, with no technical work needed from your side.</p>
      </section>

      <section>
        <div>
          <div className="step">
            <div className="num">1</div>
            <div>
              <div className="t">Tell us about your business</div>
              <div className="d">Products, certifications and any existing content — a short conversation is enough.</div>
            </div>
          </div>
          <div className="step">
            <div className="num">2</div>
            <div>
              <div className="t">We build or refresh it</div>
              <div className="d">New sites are delivered within 48 hours; care-plan updates go out within a day.</div>
            </div>
          </div>
          <div className="step">
            <div className="num">3</div>
            <div>
              <div className="t">You review and go live</div>
              <div className="d">One round of changes is included before it&apos;s ready to share with buyers.</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="band">
          <h2>Start with step one</h2>
          <p>Contact us and we&apos;ll get going.</p>
          <a className="cta" href="/#contact">Contact Us</a>
          <Link className="cta ghost" href="/bidevlink/services">See services</Link>
        </div>
      </section>
    </>
  );
}
