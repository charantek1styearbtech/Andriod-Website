"use client";

/**
 * Scroll helpers.
 *
 * Wheel/trackpad scrolling stays native (the camera and springs provide the
 * cinematic smoothing), while anchor jumps get a custom eased animation so
 * navigation still feels deliberate. No scroll-hijacking library involved.
 */

let rafId = 0;

/** Ease-in-out scroll to an absolute Y position. */
export function scrollToOffset(top: number, duration = 950) {
  const start = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const target = Math.max(0, Math.min(max, top));
  const delta = target - start;
  if (Math.abs(delta) < 1) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, target);
    return;
  }

  cancelAnimationFrame(rafId);
  const t0 = performance.now();

  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    // easeInOutCubic
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    window.scrollTo(0, start + delta * e);
    if (p < 1) rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
}

/** Scroll so the element with `id` is at the top (plus an optional offset). */
export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToOffset(el.getBoundingClientRect().top + window.scrollY + offset);
}

/** Scroll to a fraction (0..1) of an element's height — used for stage jumps. */
export function scrollToFraction(id: string, fraction: number) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  scrollToOffset(rect.top + window.scrollY + rect.height * fraction, 1400);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
