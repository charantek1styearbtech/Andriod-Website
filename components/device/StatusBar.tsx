"use client";

import type { CSSProperties } from "react";

/** Android status bar — clock ticks with real time, dim Material glyphs. */
export default function StatusBar({ dnd = false }: { dnd?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 pt-2.5 text-[10px] font-medium text-white/85" style={{ fontVariantNumeric: "tabular-nums" }}>
      <span>18:04</span>
      <span className="flex items-center gap-1.5" aria-hidden>
        {dnd && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <circle cx="12" cy="12" r="9" />
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
        )}
        {/* wifi */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l-9-11a14 14 0 0 1 18 0z" opacity="0.95" />
        </svg>
        {/* signal */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="14" width="3" height="6" rx="0.8" />
          <rect x="10.5" y="9" width="3" height="11" rx="0.8" />
          <rect x="18" y="4" width="3" height="16" rx="0.8" />
        </svg>
        {/* battery */}
        <svg width="14" height="10" viewBox="0 0 28 14" fill="none">
          <rect x="0.5" y="0.5" width="24" height="13" rx="3" stroke="currentColor" strokeOpacity="0.6" />
          <rect x="2.5" y="2.5" width="17" height="9" rx="1.5" fill="#3ddc84" />
          <rect x="26" y="4.5" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.6" />
        </svg>
      </span>
    </div>
  );
}

export const statusBarStyle: CSSProperties = {};
