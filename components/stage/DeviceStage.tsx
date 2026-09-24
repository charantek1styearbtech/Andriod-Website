"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import DemoRuntimeProvider, { useDeviceRuntime } from "./DemoRuntime";
import AndroidDevice from "@/components/device/AndroidDevice";
import { PHASES, PHASE_VH, TOTAL_STAGE_VH } from "@/lib/phases";
import { PHASE_LAYERS } from "./phaseLayers";
import type { ScreenState } from "@/lib/engine/types";
import { cn } from "@/lib/cn";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The persistent device stage. A fixed, full-viewport layer holds the phone
 * for the entire story; a tall scroll driver (~1200vh) scrolls over it while
 * one ScrollTrigger writes camera position + active phase from scroll
 * progress. Content after this section scrolls on top (z-10) and the stage
 * hides itself once fully covered.
 */
export default function DeviceStage() {
  const driverRef = useRef<HTMLDivElement>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Camera state lives on MotionValues so springs smooth every frame.
  const camX = useMotionValue(0);
  const camY = useMotionValue(0);
  const camScale = useMotionValue(1);
  const smoothX = useSpring(camX, { stiffness: 55, damping: 20, mass: 0.7 });
  const smoothY = useSpring(camY, { stiffness: 55, damping: 20, mass: 0.7 });
  const smoothScale = useSpring(camScale, { stiffness: 55, damping: 20, mass: 0.7 });
  const xStyle = useTransform(smoothX, (v) => `${v}%`);
  const yStyle = useTransform(smoothY, (v) => `${v}%`);

  // Phase boundaries as 0..1 fractions of the *scrollable* range.
  // The driver is (TOTAL + 100)vh tall so that, once the viewport is
  // subtracted, the remaining scroll distance equals the sum of phase
  // heights exactly — progress then maps 1:1 onto these boundaries.
  const boundaries = useMemo(() => {
    let acc = 0;
    const b: number[] = [];
    for (const p of PHASES) {
      b.push(acc / TOTAL_STAGE_VH);
      acc += PHASE_VH[p.id];
    }
    return b;
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        camX.set(0);
        camScale.set(1);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = ScrollTrigger.create({
          trigger: driverRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate(self) {
            // ScrollTrigger progress already spans the scrollable range, which
            // matches our phase boundaries exactly (see boundaries memo).
            const p = self.progress;
            let idx = 0;
            for (let i = 0; i < boundaries.length; i++) if (p >= boundaries[i]) idx = i;
            setPhaseIndex((prev) => (prev === idx ? prev : idx));

            const cam = PHASES[idx].camera;
            const nextBound = boundaries[idx + 1] ?? 1.0001;
            const local = (p - boundaries[idx]) / Math.max(nextBound - boundaries[idx], 1e-4);
            const next = PHASES[Math.min(idx + 1, PHASES.length - 1)].camera;
            const blend = Math.min(local * 2.2, 1); // reach keyframe early, hold, then glide to next
            // x is a fraction of half-viewport; the phone moves sideways and
            // scales down as the typography takes the other half of the frame.
            camX.set(gsap.utils.interpolate(cam.x, next.x, blend) * 50);
            camY.set(gsap.utils.interpolate(cam.y, next.y, blend) * 100);
            camScale.set(gsap.utils.interpolate(cam.scale, next.scale, blend));
          },
        });

        // Hide the fixed stage once the following content has covered it.
        const cover = ScrollTrigger.create({
          trigger: driverRef.current,
          start: "bottom top+=1",
          onEnter: () => setVisible(false),
          onLeaveBack: () => setVisible(true),
        });

        return () => {
          st.kill();
          cover.kill();
        };
      });
    },
    // Created exactly once — phase changes re-render, but the trigger and the
    // camera springs must survive those renders.
    { scope: driverRef, dependencies: [] },
  );

  const phase = PHASES[phaseIndex];
  const Layer = PHASE_LAYERS[phase.id];

  return (
    <div
      ref={driverRef}
      id="stage"
      style={{ height: `${TOTAL_STAGE_VH + 100}vh` }}
      className="relative"
      data-stage-driver
    >
      <motion.div
        className={cn("fixed inset-0 overflow-hidden bg-void", !visible && "invisible")}
        aria-hidden={!visible}
        style={{ x: xStyle, y: yStyle, scale: smoothScale, transformOrigin: "50% 44%" }}
      >
        {/* ambient spotlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(139,124,255,0.055), transparent 70%)",
          }}
        />
        {/* One layer at a time — keyed remount, CSS fade-in only, so nothing
            can pile up if the tab is throttled mid-transition. */}
        <div key={phase.id} className="stage-phase-layer absolute inset-0" style={{ animation: "layerIn 320ms cubic-bezier(.22,1,.36,1) both" }}>
          <DemoRuntimeProvider key={phase.task.id} task={phase.task} seconds={phase.taskSeconds} playing={visible}>
            <StageDevice />
            <Layer />
          </DemoRuntimeProvider>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * The device itself, centered. Subscribes to the runtime's screen MotionValue
 * but only re-renders React when the screen signature changes (draft text,
 * app, view, keyboard…) — finger/float stay on pure MotionValues.
 */
function StageDevice() {
  const { screen, finger } = useDeviceRuntime();
  const [state, setState] = useState<ScreenState>(() => screen.get());

  useMotionValueEvent(screen, "change", (v) => {
    setState((prev) => (signature(prev) === signature(v) ? prev : v));
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="stage-phone w-[min(62vw,300px)]">
        <AndroidDevice screen={state} fingerMv={finger} />
      </div>
    </div>
  );
}

/** Cheap stable signature of a screen state; drives render quantization. */
function signature(s: ScreenState): string {
  return [
    s.app,
    s.brightness,
    s.keyboard ? 1 : 0,
    s.telegram ? `${s.telegram.view}|${s.telegram.query}|${s.telegram.draft}|${s.telegram.messages.length}` : "",
    s.whatsapp ? `${s.whatsapp.view}|${s.whatsapp.query}|${s.whatsapp.draft}|${s.whatsapp.messages.length}` : "",
    s.chrome ? `${s.chrome.url}|${Math.round(s.chrome.progress * 10)}|${s.chrome.typed ?? ""}|${s.chrome.field ?? ""}` : "",
    s.gmail ? `${s.gmail.openIndex}|${s.gmail.archived ? 1 : 0}` : "",
    s.settings ? `${Object.entries(s.settings.toggles).map(([k, v]) => `${k}:${v ? 1 : 0}`).join(",")}|${s.settings.focus ?? ""}` : "",
    s.maps ? `${Math.round(s.maps.pin)}|${Math.round(s.maps.routeProgress * 10)}` : "",
  ].join("~");
}
