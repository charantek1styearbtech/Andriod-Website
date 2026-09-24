"use client";

import { motion, type MotionValue } from "motion/react";
import ScreenRouter from "./ScreenRouter";
import TouchIndicator from "./TouchIndicator";
import type { FingerPose } from "@/lib/engine/selectors";
import type { ScreenState } from "@/lib/engine/types";
import { cn } from "@/lib/cn";

export type DeviceProps = {
  screen: ScreenState;
  finger?: FingerPose & { mv?: never };
  fingerMv?: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    visible: MotionValue<number>;
    pressed: MotionValue<number>;
    ripple: MotionValue<number>;
  };
  /** Rotation of the whole device (deg) for gentle float. */
  rotate?: MotionValue<number> | number;
  className?: string;
  glow?: boolean;
};

/**
 * The phone. Pure CSS-3D: titanium-ish frame, punch-hole camera, side
 * buttons, a live screen and a moving glass reflection. All camera moves
 * happen on ancestors — this component is always scale:1 internally.
 */
export default function AndroidDevice({ screen, fingerMv, rotate = 0, className, glow = true }: DeviceProps) {
  const brightness = screen.brightness;
  const off = brightness <= 0.01;

  return (
    <div className={cn("relative", className)} style={{ perspective: 1400 }}>
      <motion.div className="relative" style={{ rotate: typeof rotate === "number" ? undefined : rotate }}>
        {/* ambient under-glow */}
        {glow && (
          <div
            aria-hidden
            className="absolute -inset-14 -z-10 rounded-[80px] opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 58%, rgba(139,124,255,0.13), transparent 70%), radial-gradient(ellipse 45% 40% at 50% 30%, rgba(92,214,236,0.07), transparent 70%)",
              filter: "blur(18px)",
            }}
          />
        )}

        {/* frame */}
        <div
          className="relative rounded-[46px] p-[3px]"
          style={{
            background: "linear-gradient(145deg, #3a3a41 0%, #17171b 30%, #232329 55%, #101013 80%, #2c2c33 100%)",
            boxShadow:
              "0 60px 120px -30px rgba(0,0,0,0.85), 0 30px 60px -20px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 1px rgba(0,0,0,0.6)",
          }}
        >
          {/* side buttons */}
          <div className="absolute -left-[2.5px] top-[19%] h-14 w-[3px] rounded-l bg-gradient-to-b from-[#3a3a41] to-[#1c1c21]" />
          <div className="absolute -left-[2.5px] top-[30%] h-9 w-[3px] rounded-l bg-gradient-to-b from-[#3a3a41] to-[#1c1c21]" />
          <div className="absolute -right-[2.5px] top-[24%] h-16 w-[3px] rounded-r bg-gradient-to-b from-[#43434b] to-[#1c1c21]" />

          {/* bezel + screen */}
          <div className="relative overflow-hidden rounded-[43px] bg-black" style={{ aspectRatio: "9 / 19.4" }}>
            {/* screen content, brightness-dimmed */}
            <div
              className="absolute inset-0 transition-[opacity,filter] duration-500"
              style={{ opacity: brightness, filter: `brightness(${0.35 + 0.65 * brightness})` }}
              aria-hidden={off}
            >
              <ScreenRouter screen={screen} />
            </div>

            {/* screen-off glass */}
            {off && (
              <div className="absolute inset-0 bg-[#060608]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
              </div>
            )}

            {/* AI fingertip (MotionValue-driven, transform-only) */}
            {fingerMv && (
              <TouchIndicator x={fingerMv.x} y={fingerMv.y} visible={fingerMv.visible} pressed={fingerMv.pressed} ripple={fingerMv.ripple} />
            )}

            {/* punch-hole camera */}
            <div className="absolute left-1/2 top-2.5 z-40 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_2px_rgba(255,255,255,0.25)]">
              <div className="absolute inset-[2px] rounded-full bg-[#0b0d12]" />
              <div className="absolute left-[2px] top-[2px] h-[2px] w-[2px] rounded-full bg-[#1d2f4a]" />
            </div>

            {/* glass sheen — slow moving diagonal reflection */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-50"
              style={{
                background:
                  "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.012) 52%, transparent 62%)",
                backgroundSize: "260% 260%",
                animation: "sheen 11s ease-in-out infinite",
              }}
            />
            {/* faint edge inner shadow for glass depth */}
            <div className="pointer-events-none absolute inset-0 z-50 rounded-[43px] shadow-[inset_0_0_18px_rgba(0,0,0,0.55)]" />
          </div>
        </div>

        {/* reflection under the phone */}
        <div
          aria-hidden
          className="mx-auto mt-1 h-6 w-[82%] rounded-[100%] opacity-30"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.9), transparent 70%)" }}
        />
      </motion.div>
    </div>
  );
}
