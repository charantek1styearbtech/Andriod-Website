"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useMotionValue, useMotionValueEvent } from "motion/react";
import DemoRuntimeProvider, { useDeviceRuntime } from "@/components/stage/DemoRuntime";
import { useRevealed } from "@/components/ui/useRevealed";
import AndroidDevice from "@/components/device/AndroidDevice";
import { LINKS } from "@/lib/links";
import { finaleTask } from "@/lib/demoTasks";
import type { ScreenState } from "@/lib/engine/types";
import DownloadLink from "@/components/DownloadLink";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TASK_SECONDS = 7;

/**
 * Finale: the phone performs one last action, then the screen powers off.
 * Scroll progress holds the idle state briefly before the shutdown plays.
 */
export default function Final() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const time = useMotionValue(0);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          // Hold, then power down across the rest of the section.
          time.set(Math.max(0, (self.progress - 0.25) / 0.7) * TASK_SECONDS);
        },
      });
      return () => st.kill();
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section ref={sectionRef} id="start" className="relative h-[220vh] border-t border-white/[0.06] bg-void">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-between overflow-hidden py-[10vh]">
        <Top />
        <div className="relative flex flex-1 items-center justify-center">
          <DemoRuntimeProvider task={finaleTask} seconds={TASK_SECONDS} playing={false} time={time}>
            <FinalPhone />
          </DemoRuntimeProvider>
        </div>
        <CTAs />
      </div>
    </section>
  );
}

function FinalPhone() {
  const { screen, finger } = useDeviceRuntime();
  const [state, setState] = useState<ScreenState>(() => screen.get());
  const { ref, shown } = useRevealed<HTMLDivElement>(0.98);

  useMotionValueEvent(screen, "change", (v) => {
    setState((prev) => (sig(prev) === sig(v) ? prev : v));
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="w-[min(58vw,260px)]"
    >
      <AndroidDevice screen={state} fingerMv={finger} />
    </motion.div>
  );
}

function Top() {
  const { ref, shown } = useRevealed<HTMLDivElement>(0.98);
  return (
    <div className="px-5 text-center">
      <motion.h2
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="display text-[clamp(2.6rem,8vw,7rem)]"
      >
        Your AI.
        <br />
        <span className="text-dim">Your phone.</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="mono mt-6 text-[13px] tracking-[0.28em] text-green"
      >
        GIVE IT HANDS.
      </motion.p>
    </div>
  );
}

function CTAs() {
  return (
    <div className="flex flex-col items-center gap-4 px-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <DownloadLink
          className="mono rounded-full bg-soft px-6 py-3 text-[12.5px] font-medium text-void transition-transform hover:scale-[1.03] active:scale-95"
          showCount
        >
          Download APK {LINKS.apkVersion}
        </DownloadLink>
        <a
          href={LINKS.repo}
          target="_blank"
          rel="noreferrer"
          className="mono rounded-full border border-white/15 px-6 py-3 text-[12.5px] text-soft transition-colors hover:border-white/35"
        >
          View on GitHub
        </a>
      </div>
      <p className="mono text-[10.5px] text-dimmer">
        {LINKS.apkSize} · Android 10+ · self-hostable gateway
      </p>
    </div>
  );
}

function sig(s: ScreenState): string {
  return `${s.app}~${s.brightness.toFixed(2)}`;
}
