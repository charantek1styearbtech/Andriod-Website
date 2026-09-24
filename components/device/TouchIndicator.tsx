"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  x: MotionValue<number>; // 0..1 across screen width
  y: MotionValue<number>;
  visible: MotionValue<number>;
  pressed: MotionValue<number>;
  ripple: MotionValue<number>;
  className?: string;
};

/**
 * The AI's "finger": a soft white glowing contact point that glides between
 * targets, presses in on tap and emits a single ripple. Values arrive as
 * MotionValues so every frame is transform-only — no React re-render.
 */
export default function TouchIndicator({ x, y, visible, pressed, ripple, className }: Props) {
  const scale = useTransform([pressed, visible], ([p, v]: number[]) => (0.6 + 0.4 * p) * (0.7 + 0.3 * v));
  const opacity = useTransform([visible, ripple], ([v, r]: number[]) => Math.max(v, r * 0.9));

  return (
    <motion.div
      className={cn("absolute z-40", className)}
      style={{
        left: useTransform(x, (v) => `${v * 100}%`),
        top: useTransform(y, (v) => `${v * 100}%`),
        opacity,
        x: "-50%",
        y: "-50%",
        scale,
      }}
      aria-hidden
    >
      {/* ripple ring, fires on tap */}
      <motion.div
        className="absolute -inset-3 rounded-full border border-white/70"
        style={{ opacity: useTransform(ripple, (r) => r * 0.9), scale: useTransform(ripple, (r) => 0.4 + (1 - r) * 1.6) }}
      />
      {/* glow */}
      <div className="absolute -inset-2 rounded-full bg-white/20 blur-[6px]" />
      {/* fingertip core */}
      <div className="relative h-4 w-4 rounded-full bg-white shadow-[0_0_18px_4px_rgba(255,255,255,0.45)]" />
    </motion.div>
  );
}
