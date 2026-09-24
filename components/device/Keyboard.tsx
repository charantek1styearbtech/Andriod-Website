"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

const ROW1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW3 = ["z", "x", "c", "v", "b", "n", "m"];

export default function Keyboard({ visible = false, draft = "" }: { visible?: boolean; draft?: string }) {
  const last = draft.slice(-1).toLowerCase();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#1e1f24]"
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          exit={{ y: "105%" }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        >
          <div className="space-y-[6px] px-1.5 pb-2 pt-2.5">
            <KeyRow keys={ROW1} hit={last} />
            <KeyRow keys={ROW2} hit={last} inset />
            <div className="flex items-stretch gap-[6px]">
              <Key wide={1.4} label="⇧" />
              <KeyRow keys={ROW3} hit={last} className="flex-1" />
              <Key wide={1.4} label="⌫" />
            </div>
            <div className="flex gap-[6px]">
              <Key wide={1.55} label="?123" dim />
              <Key wide={1.2} label="," />
              <Key wide={4.4} label="space" dim />
              <Key wide={1.2} label="." />
              <Key wide={1.55} label="↵" accent />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function KeyRow({
  keys,
  hit,
  inset,
  className,
}: {
  keys: string[];
  hit: string;
  inset?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-center gap-[6px]", inset && "px-4", className)}>
      {keys.map((k) => (
        <Key key={k} label={k} hit={hit === k} />
      ))}
    </div>
  );
}

function Key({
  label,
  hit,
  wide = 1,
  dim,
  accent,
}: {
  label: string;
  hit?: boolean;
  wide?: number;
  dim?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex h-9 min-w-0 items-center justify-center rounded-md text-[11px] font-medium transition-colors duration-75",
        hit
          ? "bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.35)]"
          : dim
            ? "bg-[#26272d] text-white/55"
            : accent
              ? "bg-[#3ddc84]/25 text-[#7ee8ac]"
              : "bg-[#33353c] text-white/85",
      )}
      style={{ flex: `${wide} 1 0%`, aspectRatio: wide <= 1.2 ? undefined : undefined }}
    >
      {label}
      {hit && <span className="absolute inset-0 animate-ping rounded-md bg-white/30" />}
    </div>
  );
}
