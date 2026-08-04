'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Custom cursor — desktop only (pointer: fine). Never renders on touch
 * devices; a custom cursor on mobile isn't a smaller version of this
 * feature, it's a bug, so we bail out entirely rather than degrade it.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // Tuned for tight tracking: high stiffness + low mass raises the spring's
  // natural frequency so it settles in ~15-20ms — close enough to the real
  // pointer to not read as "lag," while still smoothing out raw mouse
  // jitter rather than snapping pixel-to-pixel.
  const springX = useSpring(x, { stiffness: 1200, damping: 25, mass: 0.05 });
  const springY = useSpring(y, { stiffness: 1200, damping: 25, mass: 0.05 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(fine);
    if (!fine) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('a, button, [data-cursor="hover"]'));
    };
    const leave = () => setVisible(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.classList.add('has-custom-cursor');

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        animate={{
          width: hovering ? 40 : 8,
          height: hovering ? 40 : 8,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-frost"
      />
    </motion.div>
  );
}
