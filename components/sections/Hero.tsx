'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

// Locked reveal sequence (blueprint Section 3):
// 1. Dark background loads first
// 2. Ambient glow motion begins
// 3. Name + photo reveal smoothly, short delay only
// 4. Text stagger-animates in
// Target feeling: curiosity, not frustration — no loading-screen feel.

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const cinematic = [0.16, 1, 0.3, 1] as const;

// "I am" settles into place, then drifts up slightly (12 → 0 → -6) right as
// "Abhishek" fades in beneath it — one continuous gesture, not two
// disconnected animations, even though they're separate elements.
const leadInVariant = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: [14, 0, -6],
    transition: {
      opacity: { duration: 0.5, ease: cinematic },
      y: { duration: 1.1, times: [0, 0.45, 1], ease: cinematic },
    },
  },
};

const nameVariant = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: cinematic },
  },
};

interface HeroProps {
  /**
   * True once the real portrait exists at /public/images/hero-photo.png.
   * Passed down from app/page.tsx (a Server Component), which checks the
   * filesystem directly — so dropping the final image in at that exact
   * path is the *only* step needed. No code edit required here.
   */
  hasPhoto?: boolean;
}

export function Hero({ hasPhoto = false }: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-void px-6 pt-24"
    >
      {/* Signature element: slow, desaturated, breathing glow — elegant/futuristic,
          explicitly not neon or gaming-coded. This motif recurs subtly elsewhere
          (hover states, section transitions) later in the build. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow/20 blur-[120px]"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          reduceMotion
            ? { opacity: 0.35, scale: 1 }
            : { opacity: [0.2, 0.35, 0.2], scale: [0.9, 1.05, 0.9] }
        }
        transition={
          reduceMotion
            ? { duration: 1 }
            : { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2"
      >
        {/* Photo — left, per locked layout. Auto-switches to the real
            portrait the moment it exists at /public/images/hero-photo.png —
            see HeroProps above. Until then, the placeholder stays. */}
        <motion.div variants={fadeUp} className="order-2 md:order-1">
          {hasPhoto ? (
            <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
              <Image
                src="/images/hero-photo.png"
                alt="Abhishek — waist-up portrait"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-contain object-bottom"
              />
            </div>
          ) : (
            <div className="relative mx-auto flex aspect-[3/4] w-full max-w-sm items-center justify-center rounded-2xl border border-dashed border-hairline bg-ink/40 p-6 text-center">
              <p className="text-sm leading-relaxed text-slate">
                Hero photo placeholder
                <br />
                Waist-up · hands folded · transparent PNG
                <br />
                <span className="text-xs">
                  Drop the final file at{' '}
                  <code className="text-glow">
                    /public/images/hero-photo.png
                  </code>{' '}
                  — it swaps in automatically, no code changes needed
                </span>
              </p>
            </div>
          )}
        </motion.div>

        {/* Identity — right, per locked layout */}
        <div className="order-1 md:order-2">
          <motion.span
            variants={leadInVariant}
            className="block text-xs font-medium uppercase tracking-[0.4em] text-glow sm:text-sm"
          >
            I am
          </motion.span>

          <motion.h1
            variants={nameVariant}
            className="mt-2 text-6xl font-semibold tracking-tight text-frost sm:text-7xl md:text-8xl"
          >
            Abhishek
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-sm font-medium tracking-wide text-glow/90"
          >
            Also known as Arvish.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-xl font-medium text-frost/90"
          >
            Curious by nature. Builder by choice.
          </motion.p>

          <motion.p variants={fadeUp} className="mt-3 text-base text-slate">
            Software developer exploring the edges of AI.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
            }
