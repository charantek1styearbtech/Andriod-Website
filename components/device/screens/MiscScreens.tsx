"use client";

import { AnimatePresence, motion } from "motion/react";
import StatusBar from "../StatusBar";
import Keyboard from "../Keyboard";
import { cn } from "@/lib/cn";
import type { ScreenState } from "@/lib/engine/types";

export function ChromeScreen({ state, keyboard = false, draft = "" }: { state: NonNullable<ScreenState["chrome"]>; keyboard?: boolean; draft?: string }) {
  const emailText = state.field === "email" ? draft : "";
  const pwText = state.field === "password" ? "•".repeat(draft.length) : "";
  const isLogin = state.url.includes("login");
  const overview = state.url.includes("overview");
  return (
    <div className="relative flex h-full flex-col bg-[#202124]">
      <StatusBar />
      {/* omnibox */}
      <div className="px-2.5 pb-2 pt-1">
        <div className="flex items-center gap-2 rounded-full bg-[#303134] px-3 py-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
          <span className="truncate text-[9px] text-white/80">{state.url}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </div>
        <div className="mt-1 h-[2px] overflow-hidden rounded bg-white/5">
          <motion.div className="h-full bg-[#5cd6ec]" animate={{ width: `${state.progress * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>
      {/* page */}
      <div className="flex-1 overflow-hidden px-4 pt-3">
        {isLogin ? (
          <div className="space-y-3">
            <div className="pt-2 text-[14px] font-semibold text-white/95">Sign in</div>
            <div className="text-[8.5px] text-white/40">to continue to dashboard.internal</div>
            <div className="rounded-lg border border-white/12 bg-[#2a2b2e] px-3 py-2.5">
              <div className="text-[7px] uppercase tracking-wider text-white/35">Email</div>
              <div className="mt-0.5 min-h-[11px] text-[10px] text-white/90">{emailText}</div>
            </div>
            <div className="rounded-lg border border-white/12 bg-[#2a2b2e] px-3 py-2.5">
              <div className="text-[7px] uppercase tracking-wider text-white/35">Password</div>
              <div className="mt-0.5 min-h-[11px] text-[10px] tracking-widest text-white/90">{pwText}</div>
            </div>
            <div className="rounded-md bg-[#8b7cff]/90 py-2 text-center text-[10px] font-semibold text-[#0b0b10]">Log in</div>
          </div>
        ) : overview ? (
          <div className="space-y-3 pt-1">
            <div className="text-[13px] font-semibold text-white/95">Overview</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
                <div className="text-[7px] uppercase tracking-wider text-white/35">Uptime</div>
                <div className="mono mt-1 text-[13px] text-[#3ddc84]">99.98%</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
                <div className="text-[7px] uppercase tracking-wider text-white/35">Sessions</div>
                <div className="mono mt-1 text-[13px] text-white/90">1,208</div>
              </div>
            </div>
            <div className="rounded-lg border border-[#3ddc84]/25 bg-[#3ddc84]/[0.07] p-2.5">
              <div className="text-[8px] font-semibold text-[#3ddc84]">● All systems operational</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            <div className="text-[13px] font-semibold text-white/95">Status</div>
            <div className="h-2 w-3/4 rounded bg-white/10" />
            <div className="h-2 w-1/2 rounded bg-white/10" />
            <div className="rounded-lg border border-[#3ddc84]/25 bg-[#3ddc84]/[0.07] p-2.5">
              <div className="text-[8px] font-semibold text-[#3ddc84]">● Deploy passing · 42s ago</div>
            </div>
            <div className="h-2 w-2/3 rounded bg-white/10" />
            <div className="h-2 w-3/5 rounded bg-white/10" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-around border-t border-white/8 py-1.5 text-white/40">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m14 6-6 6 6 6" /></svg>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m10 6 6 6-6 6" /></svg>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 18v.01M12 6v.01" /></svg>
      </div>
      <AnimatePresence>{keyboard && <Keyboard visible draft={draft} />}</AnimatePresence>
    </div>
  );
}

export function GmailScreen({ state }: { state: NonNullable<ScreenState["gmail"]> }) {
  const emails = [
    { from: "Vercel", subject: "Your deployment is ready", snippet: "android-mcp-site · production", time: "17:12" },
    { from: "GitHub", subject: "[android-mcp] New release: v1.1.0", snippet: "Cloud Fleet Gateway · OTA update shipped", time: "16:40" },
    { from: "Mom", subject: "Sunday dinner", snippet: "Don't forget the dessert…", time: "15:21" },
    { from: "Design crew", subject: "Figma comments", snippet: "2 new comments on Launch/Phone", time: "13:05" },
  ];
  const open = emails[state.openIndex] ?? null;

  return (
    <div className="relative flex h-full flex-col bg-[#0d0f12]">
      <StatusBar />
      {open ? (
        <>
          <div className="flex items-center gap-3 px-3 pb-2 pt-1 text-white/60">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m14 6-6 6 6 6" /></svg>
            <div className="ml-auto flex gap-3">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6 9 17l-5-5" /></svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="6" width="14" height="12" rx="2" /><path d="M20 8h3v8h-3M4 8H1v8h3" /></svg>
            </div>
          </div>
          <div className="px-4 pt-1">
            <div className="text-[12px] font-semibold text-white/95">{open.subject}</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8b7cff]/20 text-[9px] font-bold text-[#8b7cff]">{open.from[0]}</div>
              <div className="text-[9px] text-white/60">{open.from}</div>
              <div className="ml-auto text-[8px] text-white/35">{open.time}</div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-1.5 w-full rounded bg-white/8" />
              <div className="h-1.5 w-11/12 rounded bg-white/8" />
              <div className="h-1.5 w-4/5 rounded bg-white/8" />
              <div className="h-1.5 w-2/3 rounded bg-white/8" />
            </div>
            {state.archived && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mono mt-4 rounded-md border border-[#3ddc84]/25 bg-[#3ddc84]/[0.08] px-2.5 py-1.5 text-[8px] text-[#3ddc84]">
                Thread archived
              </motion.div>
            )}
          </div>
          <div className="mt-auto flex items-center justify-between px-5 pb-3 text-white/40">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="6" width="14" height="12" rx="2" /><path d="M20 8h3v8h-3M4 8H1v8h3" /></svg>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5" /></svg>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2.5 px-3.5 pb-2.5">
            <div className="text-[13px] font-bold tracking-tight text-white/95">Inbox</div>
            <div className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#8b7cff] to-[#5cd6ec] text-[9px] font-bold text-[#050507]">A</div>
          </div>
          <div className="flex-1 overflow-hidden">
            {emails.map((e, i) => (
              <div key={e.subject} className={cn("flex gap-2.5 px-3.5 py-2.5", i === 1 && !state.archived && "bg-white/[0.05]", i === 1 && state.archived && "opacity-35")}>
                <div className="mt-0.5 text-[10px] text-white/25">☆</div>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10.5px] font-semibold text-white/90">{e.from}</span>
                    <span className="text-[7.5px] text-white/35">{e.time}</span>
                  </div>
                  <div className="truncate text-[9.5px] text-white/75">{e.subject}</div>
                  <div className="truncate text-[8.5px] text-white/40">{e.snippet}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-2xl bg-[#8b7cff]/90 text-[14px] font-light text-[#050507]">+</div>
        </>
      )}
    </div>
  );
}

export function SettingsScreen({ state }: { state: NonNullable<ScreenState["settings"]> }) {
  const rows = [
    { key: "dnd", label: "Do Not Disturb", sub: "Notifications off until morning" },
    { key: "wifi", label: "Wi-Fi", sub: "Studio-5G · connected" },
    { key: "bt", label: "Bluetooth", sub: "Pixel Buds A" },
  ];
  return (
    <div className="flex h-full flex-col bg-[#0d0f12]">
      <StatusBar dnd={!!state.toggles.dnd} />
      <div className="px-4 pb-2 pt-1">
        <div className="text-[15px] font-bold text-white/95">Settings</div>
        <div className="mt-2.5 flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span className="text-[9px] text-white/35">Search settings</span>
        </div>
      </div>
      <div className="mt-1 px-3">
        {rows.map((r) => (
          <div
            key={r.key}
            className={cn(
              "mb-1.5 flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all duration-300",
              state.focus === r.key ? "border-[#8b7cff]/45 bg-[#8b7cff]/[0.08]" : "border-white/[0.07] bg-white/[0.03]",
            )}
          >
            <div className="leading-tight">
              <div className="text-[10.5px] font-semibold text-white/90">{r.label}</div>
              <div className="mt-0.5 text-[8px] text-white/40">{r.sub}</div>
            </div>
            <div
              className={cn(
                "relative h-4.5 w-8 rounded-full transition-colors duration-300",
                state.toggles[r.key] ? "bg-[#3ddc84]/80" : "bg-white/15",
              )}
              style={{ height: 18 }}
            >
              <motion.span
                className="absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow"
                animate={{ left: state.toggles[r.key] ? 16 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mono mt-auto px-4 pb-3 text-[7px] text-white/25">Accessibility enabled · Android MCP Service</div>
    </div>
  );
}

export function MapsScreen({ state }: { state: NonNullable<ScreenState["maps"]> }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#0a0d10]">
      {/* stylized dark map */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice">
        <rect width="100" height="200" fill="#0a0d10" />
        <path d="M-5 40 H105" stroke="#161b22" strokeWidth="7" />
        <path d="M-5 78 H105" stroke="#161b22" strokeWidth="5" />
        <path d="M-5 120 H105" stroke="#161b22" strokeWidth="8" />
        <path d="M-5 160 H105" stroke="#161b22" strokeWidth="4" />
        <path d="M20 -5 V205" stroke="#161b22" strokeWidth="6" />
        <path d="M55 -5 V205" stroke="#141920" strokeWidth="9" />
        <path d="M82 -5 V205" stroke="#161b22" strokeWidth="5" />
        <path d="M-5 120 H105" stroke="#5cd6ec" strokeWidth="1" strokeDasharray="3 3" opacity={0.25 + state.routeProgress * 0.6} />
        <path d="M20 40 L20 120 H55" stroke="#5cd6ec" strokeWidth="2.4" fill="none" opacity={state.routeProgress} strokeLinecap="round" />
      </svg>
      <div className="relative z-10">
        <StatusBar />
        <div className="mx-3 mt-1.5 flex items-center gap-2 rounded-full border border-white/10 bg-[#12151a]/90 px-3.5 py-1.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span className="text-[9px] text-white/70">Search here</span>
        </div>
      </div>
      {/* pin */}
      <motion.div
        className="absolute left-1/2 top-[52%] z-10 -translate-x-1/2 text-[#8b7cff]"
        animate={{ y: state.pin > 0 ? [0, -18, 0] : 0, opacity: state.pin > 0 ? 1 : 0, scale: state.pin > 0 ? 1 : 0.4 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#8b7cff" stroke="rgba(5,5,7,.8)" strokeWidth="1"><path d="M12 22s-7-5.8-7-11a7 7 0 0 1 14 0c0 5.2-7 11-7 11Z" /><circle cx="12" cy="10.6" r="2.6" fill="#0a0d10" /></svg>
      </motion.div>
      {/* route card */}
      <motion.div
        className="absolute inset-x-2.5 bottom-3 z-10 rounded-2xl border border-white/10 bg-[#12151a]/95 p-3"
        animate={{ y: state.routeProgress > 0 ? 0 : 90, opacity: state.routeProgress > 0 ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold text-white/95">Office · Studio 4</div>
            <div className="mono text-[8px] text-[#3ddc84]">24 min · fastest route</div>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3ddc84] text-[#050507]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 20.85 12 3.4 3.6l-.01 6.53L14 12 3.39 13.87z" /></svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
