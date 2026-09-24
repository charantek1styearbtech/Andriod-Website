"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollTrigger caches each trigger's start/end positions when it is created.
 * On a large page (this one is ~13 viewports) fonts, images and client
 * components can still be settling, which leaves those cached positions stale
 * and the scrubbed sections frozen. Re-measure a few times after mount.
 */
export default function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    const raf = requestAnimationFrame(refresh);
    const timers = [250, 800, 2000, 4000].map((ms) => window.setTimeout(refresh, ms));

    const onLoad = () => refresh();
    window.addEventListener("load", onLoad);

    // Web fonts change metrics once they swap in.
    if (document.fonts?.ready) void document.fonts.ready.then(refresh);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
