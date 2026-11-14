'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import {
  CONTACT_EMAIL,
  FORMSPREE_URL,
  INSTAGRAM_URL,
  NEEDS,
  SUPABASE_KEY,
  SUPABASE_URL,
  type Need,
} from '@/lib/bidevlink-contact';

type Status = 'idle' | 'sending' | 'done' | 'error';
type Errors = Partial<Record<'name' | 'reach' | 'need', string>>;

type Payload = {
  name: string;
  business: string | null;
  whatsapp: string | null;
  email: string | null;
  need: Need;
  message: string | null;
  src: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SRC_RE = /^[a-z0-9_-]{1,40}$/;

async function postWithTimeout(url: string, init: RequestInit, ms = 12000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Primary store: the lead goes into Supabase (insert-only for visitors).
async function saveLead(p: Payload): Promise<boolean> {
  const res = await postWithTimeout(`${SUPABASE_URL}/rest/v1/contact_leads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(p),
  });
  return res.status === 201;
}

// Instant notification: Formspree emails the enquiry to the owner.
async function emailLead(p: Payload): Promise<boolean> {
  const needLabel = NEEDS.find((n) => n.value === p.need)?.label ?? p.need;
  const body: Record<string, string> = { _subject: `Bidevlink enquiry: ${needLabel}` };
  for (const [k, v] of Object.entries(p)) {
    if (v) body[k] = String(v);
  }
  const res = await postWithTimeout(FORMSPREE_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.ok;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [need, setNeed] = useState<Need | ''>('');
  const [src, setSrc] = useState<string | null>(null);
  const [replyOn, setReplyOn] = useState<'WhatsApp' | 'email'>('email');
  const mountedAt = useRef(0);
  const doneRef = useRef<HTMLDivElement>(null);

  // Read ?src= (where the visitor came from, e.g. the visiting-card QR) and
  // ?need= (pre-selects the dropdown) from the link.
  useEffect(() => {
    mountedAt.current = Date.now();
    const q = new URLSearchParams(window.location.search);
    const s = (q.get('src') ?? '').toLowerCase();
    if (SRC_RE.test(s)) setSrc(s);
    const n = q.get('need');
    const match = NEEDS.find((x) => x.value === n);
    if (match) setNeed(match.value);
  }, []);

  useEffect(() => {
    if (status === 'done') doneRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? '').trim();

    // Hidden trap field: real people never see it. Pretend success for bots.
    if (get('hp_website') !== '') {
      setReplyOn('email');
      setStatus('done');
      return;
    }

    const name = get('name');
    const email = get('email').toLowerCase();
    const whatsapp = get('whatsapp').replace(/[^\d+() -]/g, '').slice(0, 20);
    const waDigits = whatsapp.replace(/\D/g, '');

    const next: Errors = {};
    if (name.length < 2) next.name = 'Please enter your name.';
    if (!whatsapp && !email) {
      next.reach = 'Please share a WhatsApp number or an email so we can reach you.';
    } else if (whatsapp && (waDigits.length < 7 || waDigits.length > 15)) {
      next.reach = 'That WhatsApp number looks incomplete. Please check it.';
    } else if (email && (!EMAIL_RE.test(email) || email.length > 254)) {
      next.reach = 'That email address does not look right. Please check it.';
    }
    if (!need) next.need = 'Please choose what you need.';

    setErrors(next);
    setFormError('');
    if (Object.keys(next).length > 0) {
      const first = next.name ? 'name' : next.reach ? (whatsapp || !email ? 'whatsapp' : 'email') : 'need';
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    // Too fast to be a person (autofill + instant tap): ask them to press again.
    if (Date.now() - mountedAt.current < 2000) {
      setFormError('Please check your details and press Send again.');
      return;
    }

    const payload: Payload = {
      name: name.slice(0, 80),
      business: get('business').slice(0, 120) || null,
      whatsapp: whatsapp || null,
      email: email || null,
      need: need as Need,
      message: get('message').slice(0, 1000) || null,
      src,
    };

    setStatus('sending');
    const [saved, mailed] = await Promise.allSettled([saveLead(payload), emailLead(payload)]);
    const ok =
      (saved.status === 'fulfilled' && saved.value) || (mailed.status === 'fulfilled' && mailed.value);

    if (ok) {
      setReplyOn(payload.whatsapp ? 'WhatsApp' : 'email');
      setStatus('done');
    } else {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="card form-done" role="status" tabIndex={-1} ref={doneRef}>
        <h3>Thank you. We&apos;ve got your enquiry.</h3>
        <p>We reply personally on {replyOn}, usually within a day.</p>
        <p style={{ marginTop: 14 }}>
          <Link href="/bidevlink" className="textlink">
            Back to home →
          </Link>
        </p>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form className="card contact-form" onSubmit={onSubmit} noValidate>
      <div className={`field${errors.name ? ' invalid' : ''}`}>
        <label htmlFor="cf-name">Your name</label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={80}
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'cf-name-err' : undefined}
        />
        {errors.name && (
          <div className="err" id="cf-name-err">
            {errors.name}
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="cf-business">
          Business name <span className="opt">(optional)</span>
        </label>
        <input id="cf-business" name="business" type="text" autoComplete="organization" maxLength={120} />
      </div>

      <div className={`field${errors.reach ? ' invalid' : ''}`}>
        <div className="two">
          <div>
            <label htmlFor="cf-whatsapp">WhatsApp number</label>
            <input
              id="cf-whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={20}
              placeholder="+91 98765 43210"
              aria-invalid={!!errors.reach}
              aria-describedby="cf-reach-hint"
            />
          </div>
          <div>
            <label htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              aria-invalid={!!errors.reach}
              aria-describedby="cf-reach-hint"
            />
          </div>
        </div>
        {errors.reach ? (
          <div className="err" id="cf-reach-hint">
            {errors.reach}
          </div>
        ) : (
          <div className="hint" id="cf-reach-hint">
            Share at least one, so we can reply.
          </div>
        )}
      </div>

      <div className={`field${errors.need ? ' invalid' : ''}`}>
        <label htmlFor="cf-need">What do you need?</label>
        <select
          id="cf-need"
          name="need"
          value={need}
          onChange={(ev) => setNeed(ev.target.value as Need | '')}
          required
          aria-invalid={!!errors.need}
          aria-describedby={errors.need ? 'cf-need-err' : undefined}
        >
          <option value="">Select one</option>
          {NEEDS.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>
        {errors.need && (
          <div className="err" id="cf-need-err">
            {errors.need}
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="cf-message">
          Anything else? <span className="opt">(optional)</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          maxLength={1000}
          rows={4}
          placeholder="What you sell, who your buyers are, your current website link. If you are nominating someone else, add their business name and contact."
        />
      </div>

      {/* Trap field for bots. Hidden from people and screen readers. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="cf-hp">Leave this field empty</label>
        <input id="cf-hp" name="hp_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {formError && (
        <div className="form-msg" role="alert">
          {formError}
        </div>
      )}
      {status === 'error' && (
        <div className="form-msg" role="alert">
          Sorry, that did not go through. Please try once more, or write to us directly at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="textlink">
            {CONTACT_EMAIL}
          </a>{' '}
          or on{' '}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="textlink">
            Instagram
          </a>
          .
        </div>
      )}

      <button type="submit" className="cta submit" disabled={sending}>
        {sending ? 'Sending…' : 'Send enquiry'}
      </button>
      <p className="hint" style={{ margin: 0 }}>
        We use your details only to reply to this enquiry.
      </p>
    </form>
  );
}
