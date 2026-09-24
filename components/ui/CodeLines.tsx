"use client";

import type { HighlightedLine } from "@/lib/shiki";
import { cn } from "@/lib/cn";

export function CodeLines({
  lines,
  activeLine,
  className,
}: {
  lines: HighlightedLine[];
  activeLine?: number;
  className?: string;
}) {
  const synced = typeof activeLine === "number";
  return (
    <div
      className={cn(
        "mono overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0c]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="h-2 w-2 rounded-full bg-white/12" />
        <span className="tech-label ml-3">mcp · tool calls</span>
      </div>
      <pre className="overflow-x-auto px-0 py-3 text-[12.5px] leading-[1.75]">
        <code>
          {lines.map((line, i) => {
            const active = synced && i === activeLine;
            const past = synced && typeof activeLine === "number" && i < activeLine;
            return (
              <span
                key={i}
                className={cn(
                  "block whitespace-pre border-l-2 px-4 transition-all duration-300",
                  active
                    ? "border-violet bg-violet/[0.07]"
                    : synced && past
                      ? "border-green/40 bg-transparent"
                      : "border-transparent",
                  synced && !active && !past && "opacity-40",
                )}
              >
                <span dangerouslySetInnerHTML={{ __html: line.html || "&nbsp;" }} />
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
