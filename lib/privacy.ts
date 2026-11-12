// Shared by the Privacy Notice page (app/privacy/page.tsx) and the contact form
// (components/sections/Contact.tsx), so the version a visitor agreed to is always the
// version that is actually published.
//
// When the notice changes in a way that matters (new data collected, new purpose, a new
// service that receives the data), bump NOTICE_VERSION. The contact form sends it along
// with every submission, which gives a record of what each person agreed to.

export const NOTICE_VERSION = '2026-11-12';

/** The one address for privacy questions, rights requests, withdrawing consent and complaints. */
export const PRIVACY_EMAIL = 'abhishek.studio.dev@gmail.com';

export const PRIVACY_PATH = '/privacy';
