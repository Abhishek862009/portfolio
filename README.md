# Abhishek — Portfolio

Built with Next.js (App Router) + TypeScript + Tailwind CSS. `portfolio-blueprint.md`
(delivered separately) is the single source of truth for every design and
content decision behind this scaffold.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Folder architecture

- `app/` — routes (App Router). Homepage composes all sections; `/projects/[slug]`
  and `/blog/[slug]` are dedicated routes, per the locked hybrid site structure.
- `components/layout/` — Navbar, Footer (site chrome)
- `components/sections/` — Hero, Timeline, Skills, ProjectsPreview, Contact
  (homepage sections)
- `components/ui/` — small reusable primitives
- `data/` — typed content files (`timeline.ts`, `skills.ts`, `projects.ts`).
  Content lives here, separate from components — adding a new project or
  milestone later means adding one object, not touching UI code.
- `content/blog/` — MDX posts will live here (empty for now — Blog launches
  as "Coming Soon")
- `public/images/` — static assets; hero photo goes here once ready
- `lib/` — shared utilities

## Design system (Phase 2, locked)

Colors, type, and motion tokens are wired into `tailwind.config.ts` and
`app/globals.css`. See `portfolio-blueprint.md` for the full rationale.

## Build status

- [x] Project scaffold, config, folder architecture
- [x] Design system tokens (color, type) wired into Tailwind
- [x] Hero section — reveal sequence + ambient glow (Framer Motion)
- [x] Navbar — transparent on hero, solidifies on scroll
- [x] Timeline / Skills / Projects — functional baseline, real content

### Premium upgrade — Phase 1: Foundation shell (done)
- [x] Fixed: mobile nav was completely invisible (`hidden md:flex`, no
      fallback) — full animated mobile menu added
- [x] Fixed: Inter was configured in Tailwind but never applied to `<body>`
      — site was rendering in a fallback system font
- [x] Fixed: anchor-link scroll offset — fixed navbar was overlapping
      section tops on jump (`scroll-mt-24` added to each section)
- [x] Active-section highlighting in the navbar (IntersectionObserver)
- [x] Premium loading screen, shown once per session, coordinated with
      Hero's own reveal timing (not a race — content only mounts after
      loading completes)
- [x] Desktop-only custom cursor (`CustomCursor.tsx`) — never renders on
      touch devices
- [x] `Magnetic` primitive — applied to nav logo + Resume CTA, reusable for
      future buttons
- [x] `Reveal` primitive created — shared scroll-reveal wrapper, ready for
      other sections to adopt
- [x] Section ordering checked against blueprint IA — already correct
      (Hero → Timeline → Skills → Projects → Contact), no change needed

### Premium upgrade — Phase 1b: cursor tuning + verification pass (done)
- [x] Custom cursor was overdamped (stiffness 900 / damping 40 / mass 0.15)
      — visibly lagged the real pointer. Retuned to stiffness 1200 /
      damping 25 / mass 0.05 (~15-20ms settle time), still spring-smoothed
      but reads as tight tracking, not lag
- [x] Verified hero heading ("I am" → drifts up → "Abhishek" reveals
      below) — already correctly implemented, no change needed
- [x] Verified Navbar + Footer render on every route (moved into
      `app/layout.tsx` rather than just the homepage) — already correct
- [x] Verified explicit "Home" link exists in both desktop and mobile nav,
      with its own active-state — already correct

### Projects — full content rebuild (done)
All previous project data (titles, descriptions, links) discarded per
explicit request. New source of truth is `data/projects.ts`:
- [x] Animated Photo Album, Surface Area & Volume Quiz, Infinity Loop
      Animation, Funny Dowry Calculator — each a large "View Project"
      button (`target="_blank"`), no raw URLs shown
- [x] Word Meaning Game — status `not-live`, shows "This project is
      currently not available online." instead of a button
- [x] Love Letter Collection — 3 versions, one card, three "View Version
      N" buttons on its detail page
- [x] Per-project disclaimer (Funny Dowry Calculator) + sitewide disclaimer
      (shown on every `/projects/[slug]` page) both implemented
- [x] Added `lucide-react` to package.json (new dependency for the arrow
      icons on the CTA buttons)
- [x] Verified: no dead references to the old schema (`.tier`, `.hosted`,
      old slugs) anywhere in the codebase

### Premium upgrade — remaining phases
- [ ] Phase 2: Hero cinematic upgrade, fluid type scale, high-end
      gradients/lighting pass
- [ ] Phase 3: Interactive Timeline — wire up Education/Achievement/
      Project/Milestone filtering, adopt `Reveal`
- [ ] Phase 4: Filterable Projects (by stack/tier), adopt `Reveal`
- [ ] Phase 5: Animated Skills (tag entrance choreography), adopt `Reveal`
- [ ] Phase 6: Real blog pages (MDX pipeline)
- [ ] Phase 7: Contact form wired to Formspree/Web3Forms/EmailJS
- [ ] Phase 8: Full mobile-first pass + micro-interaction audit across all
      sections
- [ ] Phase 9: Final integration + QA
- [ ] Hero photo asset swap-in
- [ ] Resume PDF

## Deployment

- Development: Vercel preview / free `.vercel.app` subdomain
- Production: `arvish.xyz` — connect after deployment, per the blueprint
