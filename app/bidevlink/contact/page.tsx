import type { Metadata } from 'next';

import { ContactForm } from '@/components/bidevlink/ContactForm';
import { CONTACT_EMAIL, INSTAGRAM_URL } from '@/lib/bidevlink-contact';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Tell Bidevlink about your business. Share your details and we will reply on WhatsApp or email about a new website, or a refresh for your existing one.',
  alternates: { canonical: '/bidevlink/contact' },
};

export default function ContactPage() {
  return (
    <>
      <section className="page-head">
        <div className="kicker">Contact Us</div>
        <h1>Tell us about your business.</h1>
        <p className="lead">
          Share a few details and we&apos;ll reply on WhatsApp or email. It&apos;s a conversation about
          what your business needs, with no obligation.
        </p>
      </section>

      <section>
        <div className="contact-grid">
          <ContactForm />

          <aside className="contact-side">
            <div className="card care">
              <h3>One free website every month</h3>
              <p>
                Each month we build one website free for a business that shares an honest review and
                lets us show the finished site as a case study. You only pay for your own domain
                name. It&apos;s one slot a month, so tell us a little about your business and choose
                &ldquo;The free monthly website&rdquo; in the form.
              </p>
            </div>

            <div className="card">
              <h3>Prefer to write directly?</h3>
              <p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="textlink">
                  {CONTACT_EMAIL}
                </a>
                <br />
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="textlink">
                  Instagram @bidevlink
                </a>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
