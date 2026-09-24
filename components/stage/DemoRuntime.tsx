"use client";

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { DemoTask, ScreenState } from "@/lib/engine/types";
import { buildSpans, type StepSpan } from "@/lib/engine/spans";
import { fingerPose, getScreenAt } from "@/lib/engine/selectors";

type DeviceCtx = {
  /** Interpolated ScreenState at the current clock time. */
  screen: MotionValue<ScreenState>;
  /** Seconds clock of the active task. */
  time: MotionValue<number>;
  /** 0..1 progress through the active task. */
  progress: MotionValue<number>;
  restart: () => void;
  spans: StepSpan[];
  task: DemoTask;
  total: number;
  finger: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    visible: MotionValue<number>;
    pressed: MotionValue<number>;
    ripple: MotionValue<number>;
  };
};

const Ctx = createContext<DeviceCtx | null>(null);

export function useDeviceRuntime() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDeviceRuntime must be used inside <DemoRuntimeProvider>");
  return ctx;
}

type ProviderProps = {
  task: DemoTask;
  /** Seconds for a full pass of the task. */
  seconds: number;
  /** When false, the internal clock pauses (e.g. while scroll-scrubbing). */
  playing?: boolean;
  /**
   * Optional externally-owned clock. Scroll-scrubbed sections create their own
   * MotionValue so the *parent* can drive it from a ScrollTrigger (a parent's
   * own ref is attached before its layout effects run — a child cannot safely
   * reference an ancestor's ref during its first effect).
   */
  time?: MotionValue<number>;
  children: ReactNode;
};

/**
 * Runs a task on a requestAnimationFrame clock. All consumers subscribe via
 * MotionValues — zero React renders per frame. External drivers can also
 * write `time` directly (scroll scrubbing via GSAP).
 */
export function DemoRuntimeProvider({
  task,
  seconds,
  playing = true,
  time: externalTime,
  children,
}: ProviderProps) {
  const internalTime = useMotionValue(0);
  const time = externalTime ?? internalTime;
  const last = useRef<number>(0);

  const spans = useMemo(() => buildSpans(task, seconds), [task, seconds]);
  const total = spans.length ? spans[spans.length - 1].end : seconds;

  const screen = useTransform(time, (t) => getScreenAt(task, spans, t));
  const pose = useTransform(time, (t) => fingerPose(spans, t));
  const fx = useTransform(pose, (p) => p.x);
  const fy = useTransform(pose, (p) => p.y);
  const fv = useTransform(pose, (p): number => (p.visible ? 1 : 0));
  const fp = useTransform(pose, (p): number => (p.pressed ? 1 : 0));
  const fr = useTransform(pose, (p) => p.ripple);

  // Internal autoplay clock.
  useEffect(() => {
    if (!playing) return;
    let rafId = 0;
    last.current = 0;
    const tick = (now: number) => {
      const dt = last.current ? Math.min((now - last.current) / 1000, 0.05) : 0.016;
      last.current = now;
      let next = time.get() + dt;
      if (next >= total + 1.4) next = 0; // loop with a breath
      time.set(next);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, total, time]);

  const progress = useTransform(time, (t) => t / total);

  const value = useMemo<DeviceCtx>(
    () => ({
      screen,
      time,
      progress,
      restart: () => time.set(0),
      spans,
      task,
      total,
      finger: { x: fx, y: fy, visible: fv, pressed: fp, ripple: fr },
    }),
    [screen, time, progress, spans, task, total, fx, fy, fv, fp, fr],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export default DemoRuntimeProvider;
