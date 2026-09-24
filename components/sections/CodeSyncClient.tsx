"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import type { HighlightedLine } from "@/lib/shiki";
import DemoRuntimeProvider, { useDeviceRuntime } from "@/components/stage/DemoRuntime";
import AndroidDevice from "@/components/device/AndroidDevice";
import { CodeLines } from "@/components/ui/CodeLines";
import { telegramRahul } from "@/lib/demoTasks";
import type { ScreenState } from "@/lib/engine/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TASK_SECONDS = 26;

/** step id → highlighted code line (index into the snippet) */
const STEP_LINE: Record<string, number> = {
  wake: 1,
  unlock: 1,
  open_telegram: 2,
  tap_search: 3,
  search_rahul: 3,
  open_chat: 3,
  focus_input: 4,
  type_message: 4,
  send_message: 5,
  verify: 6,
};

/**
 * Tall scroll region + sticky stage. Scroll progress scrubs the Telegram task,
 * and each real MCP call highlights as the phone performs it.
 *
 * The region ref, the clock and the ScrollTrigger all live here in the parent:
 * a parent's ref to its own element is attached before its layout effects run,
 * whereas a child reading an ancestor's ref would still see `null` and the
 * trigger would silently fall back to the whole document.
 */
export default function CodeSyncClient({ lines }: { lines: HighlightedLine[] }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const time = useMotionValue(0);

  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: regionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate(self) {
          time.set(self.progress * TASK_SECONDS * 0.995);
        },
      });
      return () => st.kill();
    },
    { scope: regionRef, dependencies: [] },
  );

  return (
    <div ref={regionRef} className="relative h-[320vh]">
      <DemoRuntimeProvider task={telegramRahul} seconds={TASK_SECONDS} playing={false} time={time}>
        <SyncStage lines={lines} />
      </DemoRuntimeProvider>
    </div>
  );
}

function SyncStage({ lines }: { lines: HighlightedLine[] }) {
  const { time, spans, finger, screen } = useDeviceRuntime();
  const [activeLine, setActiveLine] = useState(1);
  const [state, setState] = useState<ScreenState>(() => screen.get());

  useMotionValueEvent(time, "change", (t) => {
    const span = spans.find((sp) => t >= sp.start && t < sp.end);
    if (span) {
      const line = STEP_LINE[span.step.id] ?? 0;
      setActiveLine((prev) => (prev === line ? prev : line));
    }
    setState((prev) => (sig(prev) === sig(screen.get()) ? prev : screen.get()));
  });

  return (
    <div className="sticky top-0 flex h-screen items-center">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 px-5 md:px-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div>
          <CodeLines lines={lines} activeLine={activeLine} />
          <p className="mono mt-4 text-[11px] text-dimmer">
            {"scroll to run — every line is a real MCP tool call, executed on the device"}
          </p>
        </div>
        <div className="mx-auto w-[min(52vw,250px)]">
          <AndroidDevice screen={state} fingerMv={finger} />
        </div>
      </div>
    </div>
  );
}

function sig(s: ScreenState): string {
  return [
    s.app,
    s.keyboard ? 1 : 0,
    s.brightness.toFixed(2),
    s.telegram ? `${s.telegram.view}|${s.telegram.draft}|${s.telegram.messages.length}` : "",
  ].join("~");
}
