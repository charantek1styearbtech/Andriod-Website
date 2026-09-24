"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot "has this element scrolled into view" detector.
 *
 * Deliberately does *not* use IntersectionObserver: IO delivery depends on the
 * compositor, and in some environments (headless/embedded webviews, throttled
 * tabs) it never fires — which would leave reveal-animated content stuck at
 * opacity 0. Measuring the element's rect on scroll is synchronous, cheap
 * (a handful of elements) and always works.
 */
export function useRevealed<T extends HTMLElement = HTMLDivElement>(threshold = 0.92) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;

    const visible = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * threshold && r.bottom > 0;
    };

    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(settle);
    };

    function onScroll() {
      if (done || !visible()) return;
      done = true;
      setShown(true);
      cleanup();
    }

    const settle = window.setInterval(onScroll, 400);

    if (visible()) {
      done = true;
      window.clearInterval(settle);
      setShown(true);
      return;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      done = true;
      cleanup();
    };
  }, [threshold]);

  return { ref, shown };
}
