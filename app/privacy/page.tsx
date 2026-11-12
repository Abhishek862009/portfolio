import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { NOTICE_VERSION, PRIVACY_EMAIL, PRIVACY_PATH } from '@/lib/privacy';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description:
    'What personal data arvish.xyz and Bidevlink collect through the contact form, why, who handles it, and how to withdraw consent, correct, erase or complain.',
  alternates: { canonical: PRIVACY_PATH },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-frost">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-slate">{children}</div>
    </section>
  );
}

function Mail() {
  return (
    <a className="text-glow underline underline-offset-4" href={`mailto:${PRIVACY_EMAIL}`}>
      {PRIVACY_EMAIL}
    </a>
  );
}

export default function PrivacyPage() {
  const updated = new Date(NOTICE_VERSION).toLocaleDateString('en-IN', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-32">
      <h1 className="text-4xl font-semibold text-frost">Privacy Notice</h1>
      <p className="mt-3 text-sm text-slate">
        Applies to arvish.xyz and the Bidevlink pages on it. Last updated {updated}.
      </p>

      <Section title="Who is responsible for your data">
        <p>
          Abhishek (also known as Arvish), who runs this website and Bidevlink, decides why and how
          the personal data described below is used. For anything in this notice, write to <Mail />.
        </p>
      </Section>

      <Section title="What I collect, and why">
        <p>I collect personal data in one place: the contact form (the “Contact me” form on the home page).</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong className="text-frost">Your name:</strong> so I know who I am replying to.
          </li>
          <li>
            <strong className="text-frost">Your email address:</strong> to send you my written reply.
          </li>
          <li>
            <strong className="text-frost">Your mobile number:</strong> so I can call or message you (including on
            WhatsApp) to discuss your enquiry, which is often quicker than email for a website or project.
            It is asked for only for this reason.
          </li>
          <li>
            <strong className="text-frost">The message you write:</strong> to understand what you need.
          </li>
        </ul>
        <p>
          <strong className="text-frost">Purpose:</strong> to read your message and contact you about it by email or
          phone. Nothing else. I do not use it for marketing lists, I do not sell it, and I do not share
          it for advertising.
        </p>
        <p>
          The form asks for your consent before it sends anything. If you email me directly instead
          (for example from the Bidevlink pages), I get your email address and whatever you write, and
          I use it for the same purpose only.
        </p>
      </Section>

      <Section title="Who else handles it">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-frost">Formspree</strong> (formspree.io) is the external service that receives
            what you type in the form and forwards it to my email inbox. It may process data on servers
            outside India.
          </li>
          <li>
            <strong className="text-frost">My email provider</strong> stores the message once it reaches my inbox.
          </li>
          <li>
            <strong className="text-frost">Vercel</strong>, which hosts this website, may keep standard server logs
            (such as the IP address of a visit) as part of running the site. I do not use them to identify
            visitors.
          </li>
        </ul>
        <p>I do not pass your details to anyone else.</p>
      </Section>

      <Section title="What this website does not do">
        <p>
          It has no analytics, no advertising or tracking scripts, and it sets no cookies. It uses
          your browser&apos;s own storage for two small things, neither of which contains personal data
          or leaves your device:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <code className="text-frost">ab-lang</code>: your English/Hindi choice on a setup-guide page.
          </li>
          <li>
            <code className="text-frost">ab-portfolio-loaded</code>: remembers, for the current browser session,
            that the opening animation has already played.
          </li>
        </ul>
        <p>
          The Hisaab web app (arvish.xyz/hisaab) keeps its entries only in your own browser
          (<code className="text-frost">hisaab_v1</code>). They are not sent to me or to any server. Clearing your
          browser data deletes them.
        </p>
        <p>
          This notice covers the website. The apps listed in the App Store section are downloaded
          from GitHub and are separate programs.
        </p>
      </Section>

      <Section title="How long I keep it">
        <p>
          Only as long as needed to handle your enquiry and any work that follows from it. You can ask
          me to delete it earlier at any time.
        </p>
      </Section>

      <Section title="Children">
        <p>
          The contact form is for people aged 18 or over, and asks you to confirm that. If you are under
          18, please ask a parent or guardian to contact me instead. If I learn that I hold a
          child&apos;s details without a parent&apos;s consent, I will delete them.
        </p>
      </Section>

      <Section title="Your rights, and how to use them">
        <p>You can, at any time:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>withdraw your consent (this is as easy as giving it: send an email to the address below);</li>
          <li>ask for a summary of the personal data I hold about you and who I have shared it with;</li>
          <li>ask me to correct or update it;</li>
          <li>ask me to erase it;</li>
          <li>nominate another person to exercise these rights for you if you cannot.</li>
        </ul>
        <p>
          Email <Mail /> with the subject “Privacy request”, from the address you used on the form so I
          can match it. I will reply within a reasonable time and in any case within 90 days. Withdrawing
          consent does not undo what I did before you withdrew it, and I will stop using your data for
          the purpose above.
        </p>
      </Section>

      <Section title="Complaints">
        <p>
          If you have a grievance about how your data is handled, write to <Mail /> first. If you are
          not satisfied with the outcome, you can complain to the Data Protection Board of India.
        </p>
      </Section>

      <Section title="The law behind this notice">
        <p>
          This notice is written to follow India&apos;s Digital Personal Data Protection Act, 2023 and the
          Digital Personal Data Protection Rules, 2025. If I change what I collect or why, I will update
          this page and the date at the top.
        </p>
      </Section>
    </div>
  );
}
