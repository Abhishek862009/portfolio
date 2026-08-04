# Abhishek's Portfolio — Project Blueprint (Final, v3.0)

**Status:** Discovery complete. Ready for design system + implementation phase.

---

## 1. Vision & Strategy

**What this site is:** A cinematic, story-driven personal brand experience — not a flat "portfolio template." It should make a visitor stop and think *"who is this guy?"* within 3 seconds, then earn confidence, trust, and respect as they scroll.

**Priority ranking (drives every downstream decision):**
1. Personal brand — memorable experience, not just a resume
2. Recruiter/client legibility — fast comprehension of skills, projects, journey
3. Academic achievements — supporting evidence, not the headline

**Emotional arc (the narrative spine of the whole site):**
> Curiosity (Hero) → Confidence (Timeline/Story) → Trust (Skills/Projects) → Respect (Achievements-in-Timeline/Contact)

**Animation philosophy:** Every animation must serve a purpose — guide attention, reveal information progressively, or reinforce hierarchy. Nothing decorative for its own sake.

**Design reference direction:** Restrained, intimate cinematic (à la Rauno Freiberg's portfolio — rauno.me) over maximalist agency spectacle (à la Phantom.Land). Premium and quiet, not loud.

---

## 2. Visual Design System

### Color
- **Base:** Deep navy/blue-black (not pure `#000000`) — richer, more cinematic on screen
- **Blue:** Used only as an accent — glow effects, gradients, subtle lighting. Never a co-equal "theme color." Goal: futuristic elegance, not an "obviously blue" site.
- Exact hex values (base, elevated surface, glow accent, text tiers) to be finalized at high-fidelity design stage.

### Typography
- Single font family throughout: **Inter** (free, systematic, timeless over trendy — deliberately avoiding currently-trendy fonts like Satoshi/General Sans, which risk feeling dated fast)
- Hierarchy built through **weight and size contrast only** — never mixing multiple type families
- Upgrade path later: licensed fonts like Söhne, if desired

### Motion Mood
- Soft blue glow, subtle lighting movement, depth — **elegant/futuristic, explicitly not neon/gaming-coded**
- Desaturated, slow, atmospheric — no hard bloom, no saturated RGB, no fast pulsing

---

## 3. Hero Section (Detailed Spec)

**Reveal sequence (locked):**
1. Dark background loads first
2. Subtle ambient motion begins (soft blue glow/lighting movement)
3. Name + photo reveal smoothly — short delay only, never a "loading screen" feel
4. Text stagger-animates in (cinematic, not gimmicky)
5. Target feeling: curiosity, not frustration

**Content:**
- Photo: waist-up, hands folded, confident smirk, transparent PNG, realistic photography style, matching navy/blue-black theme — **AI-generated, spec locked, asset creation pending** (may need cutout/halo cleanup — revisit when ready)
- Layout: photo left, "I am Abhishek" right
- Tagline: **"Curious by nature. Builder by choice."**
  - Alternate (reserve for footer/meta/page title use): "Still curious. Always building."
- Subheading: **"Software developer exploring the edges of AI."**

---

## 4. Information Architecture & Navigation

**Site structure:** Hybrid
- Homepage = single cinematic scroll (Hero → Timeline → Skills → Projects preview → Contact)
- Dedicated routes for deeper content: `/projects/[slug]`, `/blog/[slug]`

**Nav bar behavior (locked):**
- Always present from first frame — never fully hidden
- Transparent/minimal on hero (protects cinematic impact)
- Solidifies with subtle background as user scrolls
- Draft nav items: Hero → Timeline/Story → Skills → Projects → Blog → Contact → Resume
- **No standalone "Qualifications" or "Achievements" nav items** — folded into Timeline (see below)

**Scroll behavior:**
- Vertical scroll site-wide with premium reveal-on-scroll animations (Apple-style) as the default
- Horizontal scroll as an **accent only** in Projects and/or Timeline — conditional on flawless mobile performance. If it can't be built perfectly on mobile, falls back to vertical + strong reveal animation. No exceptions to this rule.

**Mobile priority:** Non-negotiable. Full responsiveness, speed, and premium feel required on both desktop and mobile. Usability always wins over novelty.

---

## 5. Content Plan

### Timeline (unified story — replaces standalone Qualifications/Achievements sections)
Chronological milestones, each taggable by category (Education / Achievement / Project / Milestone) for recruiter filtering:

1. Early curiosity (school years) — interested in tech early, no structured guidance yet
2. Class 9 — curiosity turns serious, starts exploring tech more deliberately
3. Class 10 boards — scored 80.57%; initially disappointing, later reframed as a turning point
4. Post-Class 10 break (3 months) — origin story: starts learning Python + HTML
5. Early builds — frontend projects + Python projects
6. Present — JEE preparation phase; coding intentionally paused, foundation still active
7. Ongoing — rebuilding consistency, balancing exam prep with continued tech growth
8. **Long-term vision** — 20-year goal: build an OS-level technology product/company. **Framing rule: always grounded** — paired with present-tense action (current learning, projects, skill-building), never presented as a bold claim in isolation.

**Recruiter fast-access:** Filterable tags on the Timeline (Education / Achievement / Project / Milestone) — visitors can view the full story by default, or filter to just what they need. Resume download serves as the ultimate scannable fallback.

### Skills
- **Core Skills:** HTML, CSS, JavaScript, Python
- **Tools & Technologies:** CodePen, Git/GitHub (early stage), VS Code
- **Currently Exploring:** AI concepts, Machine Learning, Advanced JavaScript, broader software development concepts
- Soft skills (problem solving, learning ability, independent building) — woven into Timeline/About copy, not shown as tags
- **Display:** Clean tag/pill system, grouped by category. **No fake proficiency percentages/bars/stars.** "Currently Exploring" gets a visually distinct (subtler) treatment vs. confirmed skills.

### Projects
> **Revised** — this section was fully replaced by explicit instruction,
> superseding the original Tier 1/2/3 structure below it in the blueprint's
> revision history. CodePen account also changed handle: `abhi-invisible`
> (verified same underlying account/person as the original `itz_arvish_0_0_4`
> links).

Six projects, flat list (no flagship/tier hierarchy displayed):

1. **Animated Photo Album** — HTML/CSS/JS, live, custom client project
2. **Surface Area & Volume Quiz** — HTML/CSS/JS, live, educational quiz
3. **Word Meaning Game** — Python, **not live** — shows "This project is
   currently not available online." instead of a button
4. **Infinity Loop Animation** — HTML/CSS/JS, live, animation experiment
5. **Love Letter Collection** — HTML/CSS/JS, live, **three versions shown
   inside one project card** (not split into separate entries)
6. **Funny Dowry Calculator** — HTML/CSS/JS, live, humor/educational —
   carries its own additional disclaimer beyond the sitewide one

**CTA pattern (locked):** every live project shows a large "View Project"
button (opens in a new tab) instead of a raw URL — never the CodePen link
shown as plain text.

**Global disclaimer (locked):** shown on every project detail page —
"The photos or personal content used in some demonstration projects belong
to clients or were used with permission for portfolio demonstration
purposes only."


### Blog
- **Launch state:** "Coming Soon" placeholder. Full routing/template architecture built and ready, but no filler/low-quality posts published just to fill the section.
- **Planned future content:** learning journey, project breakdowns, technology experiments, lessons from building things
- **Authoring:** Markdown/MDX files in-repo (no CMS for now)

### Contact
- Fields: Name, Email, Mobile Number (optional), Message
- Submissions routed directly to Abhishek's email via Formspree/Web3Forms/EmailJS (no custom backend)
- **Mobile number is never displayed publicly** — optional field only, visible to Abhishek via submitted email
- Social links: GitHub + LinkedIn placeholders — link live only once profiles are actually populated (don't link empty/inactive profiles)

### Resume
- Launch: simple, clean download button linking to a manually-maintained PDF (PDF not yet created — separate task)
- **Future scalability idea (not built now):** auto-generated resume view synced from Timeline/Skills/Projects content

---

## 6. Technical Stack (Final)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (React)** | Native hybrid routing (static home + dynamic `/projects/[slug]`, `/blog/[slug]`), performance optimization, huge ecosystem, strong scalability path, also a genuine learning goal |
| Styling | **Tailwind CSS** | Centralized design tokens keep the "timeless, disciplined" system consistent; strong responsive utilities; standard Next.js pairing |
| Animation | **Framer Motion (primary)** + **GSAP (complex moments only)** | Framer Motion handles reveals/transitions/interactions cleanly; GSAP reserved for hero glow choreography and horizontal scroll — **only if these perform flawlessly on mobile**, same fallback rule as elsewhere |
| Content (Projects/Timeline/Skills) | **Structured local data files** (e.g. `projects.ts`, `timeline.ts`) | Separates content from component code — adding a new project/milestone later means adding one data object, not editing UI code |
| Blog | **Markdown/MDX in-repo** | Simple, free, Git-based, consistent with the content-as-data philosophy; CMS migration is a noted future option if blog volume grows |
| Hosting | **Vercel** | Built for Next.js, zero-config deploys, generous free tier, auto-deploys on push |
| Domain | **arvish.xyz** | Used only in production; `.vercel.app` subdomain used during development/testing |

---

## 7. Outstanding / Pending Items (not blockers, but tracked)

- [ ] Final hero photo asset (AI-generated per locked spec — prompt/cleanup help available when ready)
- [ ] Word Meaning Game: name confirmation + full feature/rules write-up + screenshots
- [ ] Resume PDF creation
- [ ] Exact hex palette + full type scale (to be defined at high-fidelity design/build stage)
- [ ] GitHub/LinkedIn profile population (before linking live on site)

---

## 8. What Comes Next

With this blueprint locked, the next phase is **implementation**: project scaffolding (Next.js + Tailwind setup), building the design system (colors, type scale, spacing in Tailwind config), then building section by section starting with the Hero, since it's the highest-impact and most technically involved piece (reveal sequence + glow choreography).
