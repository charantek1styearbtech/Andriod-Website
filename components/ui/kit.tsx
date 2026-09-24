"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useRevealed } from "./useRevealed";

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("relative px-5 py-28 md:px-9 md:py-40", className)}>
      <div className="mx-auto w-full max-w-[1500px]">{children}</div>
    </section>
  );
}

export function Kicker({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="tech-label mb-6 flex items-center gap-3">
      <span className="text-green">{index}</span>
      <span className="h-px w-8 bg-white/15" />
      {children}
    </div>
  );
}

export function H2({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("display text-[clamp(2.2rem,6vw,5.2rem)]", className)}>{children}</h2>
  );
}

export function Lede({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("max-w-[62ch] text-[17px] leading-relaxed text-dim md:text-[18px]", className)}>
      {children}
    </p>
  );
}

/** Progressive reveal driven by measured scroll position (never IO).
 *  Content is visible even before the animation kicks in, so a throttled or
 *  headless environment can never leave the page blank. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, shown } = useRevealed<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Full-width hairline row used for editorial tables. */
export function Row({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "group grid grid-cols-1 gap-1 border-t border-white/[0.08] py-5 transition-colors md:grid-cols-12 md:gap-6",
        hover && "hover:bg-white/[0.02]",
        className,
      )}
    >
      {children}
    </div>
  );
}


export function Mono({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("mono text-[12px] text-dim", className)}>{children}</span>;
}

export function GhostNumber({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span aria-hidden className={cn("ghost-number pointer-events-none absolute select-none", className)}>
      {children}
    </span>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="mono rounded-full border border-white/12 px-3 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-dim">
      {children}
    </span>
  );
}
