// Shared values for the Bidevlink contact form (/bidevlink/contact).
//
// Everything here is PUBLIC by design and safe to ship to the browser:
//  - the Supabase publishable key can only INSERT into public.contact_leads
//    (row-level security: insert-only, no read/update/delete; column grants limit
//    which fields can be set; a DB trigger cleans input, ignores double-submits
//    and caps floods). Leads are read from the Supabase dashboard / SQL only.
//  - the Formspree endpoint just emails each enquiry to the owner.
// Never put a service_role / secret key in this file.

export const SUPABASE_URL = 'https://boeazndaegvsfxcwvuft.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_HGuMelkNJurlnemKNu5vPA_VabNQNFe';
export const FORMSPREE_URL = 'https://formspree.io/f/xyezyqlw';

export const CONTACT_EMAIL = 'bidevlink@arvish.xyz';
export const INSTAGRAM_URL = 'https://www.instagram.com/bidevlink';

// `value` must match the CHECK constraint contact_leads_need_vals in the database.
export const NEEDS = [
  { value: 'new_site', label: 'A new website' },
  { value: 'refresh', label: 'A refresh for my existing website' },
  { value: 'free_slot', label: 'The free monthly website (case study)' },
  { value: 'other', label: 'Something else / not sure yet' },
] as const;

export type Need = (typeof NEEDS)[number]['value'];
