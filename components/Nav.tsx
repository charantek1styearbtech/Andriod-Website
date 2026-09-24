"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { scrollToFraction, scrollToId, scrollToOffset } from "./SmoothScroll";
import { LINKS } from "@/lib/links";
import { cn } from "@/lib/cn";
import DownloadLink from "./DownloadLink";

type Target =
  | { kind: "top" }
  | { kind: "id"; id: string }
  | { kind: "fraction"; id: string; fraction: number };

const NAV: { label: string; target: Target }[] = [
  { label: "Product", target: { kind: "top" } },
  { label: "How it works", target: { kind: "fraction", id: "stage", fraction: 0.12 } },
  { label: "Security", target: { kind: "id", id: "bugbounty" } },
  { label: "Tools", target: { kind: "id", id: "tools" } },
  { label: "Setup", target: { kind: "id", id: "setup" } },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (t: Target) => {
    if (t.kind === "top") scrollToOffset(0, 1100);
    else if (t.kind === "id") scrollToId(t.id);
    else scrollToFraction(t.id, t.fraction);
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-[70] transition-colors duration-500",
        solid ? "border-b border-white/[0.06] bg-void/80 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-6 px-5 md:px-9">
        <button
          onClick={() => go({ kind: "top" })}
          className="mono group flex items-center gap-2 text-[13px] font-medium tracking-tight text-soft"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green transition-transform group-hover:scale-125" />
          android-mcp
        </button>

        <nav className="ml-4 hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <button
              key={n.label}
              onClick={() => go(n.target)}
              className="mono text-[11.5px] text-dim transition-colors hover:text-soft"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={LINKS.repo}
            target="_blank"
            rel="noreferrer"
            className="mono hidden items-center gap-2 text-[11.5px] text-dim transition-colors hover:text-soft sm:flex"
          >
            <GithubMark />
            GitHub
          </a>
          <DownloadLink
            className="mono rounded-full bg-soft px-3.5 py-1.5 text-[11.5px] font-medium text-void transition-transform hover:scale-[1.03] active:scale-95"
            showCount
          >
            Download APK
          </DownloadLink>
        </div>
      </div>
    </motion.header>
  );
}

function GithubMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
