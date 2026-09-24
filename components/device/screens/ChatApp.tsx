"use client";

import { motion } from "motion/react";
import StatusBar from "../StatusBar";
import Keyboard from "../Keyboard";
import { cn } from "@/lib/cn";
import type { ScreenState } from "@/lib/engine/types";

export type ChatTheme = {
  name: string;
  header: string;
  listBg: string;
  searchBg: string;
  accent: string;
  incoming: string;
  outgoing: string;
};

export const TG_THEME: ChatTheme = {
  name: "Telegram",
  header: "bg-[#17212b]",
  listBg: "bg-[#0e1621]",
  searchBg: "bg-[#17212b]",
  accent: "text-[#8ab4f8]",
  incoming: "bg-[#182533]",
  outgoing: "bg-[#2b5279]",
};

export const WA_THEME: ChatTheme = {
  name: "WhatsApp",
  header: "bg-[#1f2c33]",
  listBg: "bg-[#0b141a]",
  searchBg: "bg-[#202c33]",
  accent: "text-[#25d366]",
  incoming: "bg-[#202c33]",
  outgoing: "bg-[#005c4b]",
};

const CONTACTS = [
  { name: "Rahul", msg: "yo did you see the launch st…", time: "18:02", unread: 2, hue: "#8b7cff" },
  { name: "Mom", msg: "leaving the office now", time: "17:58", unread: 0, hue: "#3ddc84" },
  { name: "Design crew", msg: "You: pushed the new build", time: "16:44", unread: 0, hue: "#5cd6ec" },
  { name: "Alex", msg: "let's ship it 🚀", time: "15:30", unread: 0, hue: "#e8b34c" },
];

export default function ChatApp({
  theme,
  state,
  app,
  keyboard = false,
}: {
  theme: ChatTheme;
  state: NonNullable<ScreenState["telegram" | "whatsapp"]>;
  app: "telegram" | "whatsapp";
  keyboard?: boolean;
}) {
  const searchMatch = CONTACTS.find((c) =>
    c.name.toLowerCase().startsWith(state.query.trim().toLowerCase()),
  );

  if (state.view === "chat") {
    const contact = CONTACTS.find((c) => c.name.toLowerCase() === state.query.trim().toLowerCase()) ?? CONTACTS[0];
    return (
      <div className={cn("relative flex h-full flex-col", theme.listBg)}>
        <div className={cn("z-10 shrink-0", theme.header)}>
          <StatusBar />
          <div className="flex items-center gap-2.5 px-3 pb-2.5 pt-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="2.2" strokeLinecap="round"><path d="m14 6-6 6 6 6" /></svg>
            <div className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: `${contact.hue}33`, color: contact.hue, border: `1px solid ${contact.hue}55` }}>
              {contact.name[0]}
            </div>
            <div className="leading-tight">
              <div className="text-[11px] font-semibold text-white/95">{contact.name}</div>
              <div className="text-[8px] text-white/40">online</div>
            </div>
            <div className="ml-auto flex items-center gap-2.5 text-white/50">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 18v.01M12 6v.01" /></svg>
            </div>
          </div>
        </div>
        {/* messages */}
        <div className="flex-1 space-y-1.5 overflow-hidden px-2.5 pt-3">
          {state.messages.map((m) => (
            <motion.div
              key={m.id}
              className={cn("max-w-[78%] rounded-xl px-2.5 py-1.5", m.incoming ? cn("ml-0", theme.incoming) : cn("ml-auto", theme.outgoing))}
              initial={m.id.endsWith("-sent") ? { scale: 0.85, opacity: 0, y: 8 } : false}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <div className="text-[9.5px] leading-snug text-white/92">{m.text}</div>
              <div className="mt-0.5 flex items-center justify-end gap-1 text-[7px] text-white/40">
                {m.time}
                {!m.incoming && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="m4 12.5 5 5L20 6.5" /></svg>
                )}
                {!m.incoming && m.id.endsWith("-sent") && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className="-ml-1.5"><path d="m4 12.5 5 5L20 6.5" /></svg>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        {/* input row */}
        <div className="relative z-20 shrink-0">
          <div className="flex items-end gap-1.5 px-2 pb-2">
            <div className="flex flex-1 items-center gap-1.5 rounded-2xl bg-[#1c2127] px-2.5 py-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" opacity="0.9" /></svg>
              <span className="min-h-[12px] flex-1 truncate text-[9.5px] text-white/90">
                {state.draft || <span className="text-white/35">Message</span>}
                {state.draft && <span className="ml-px inline-block h-[10px] w-[1.5px] animate-blink bg-white/80 align-[-1px]" />}
              </span>
            </div>
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
                state.draft ? theme.accent.replace("text-", "text-") : "text-white/60",
                state.draft ? "bg-white/10" : "bg-[#1c2127]",
              )}
            >
              {state.draft ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 20.85 12 3.4 3.6l-.01 6.53L14 12 3.39 13.87z" /></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              )}
            </div>
          </div>
          <Keyboard visible={keyboard} draft={state.draft} />
        </div>
      </div>
    );
  }

  /* ---- list / search view ---- */
  return (
    <div className={cn("relative flex h-full flex-col", theme.listBg)}>
      <div className={cn("z-10 shrink-0", theme.header)}>
        <StatusBar />
        <div className="flex items-center gap-3 px-3.5 pb-2.5 pt-1.5">
          <div className="text-[13px] font-bold text-white/95">{theme.name}</div>
          <div className="ml-auto flex items-center gap-3 text-white/55">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 18v.01M12 6v.01" /></svg>
          </div>
        </div>
        <div className="px-2.5 pb-2.5">
          <div className={cn("flex items-center gap-2 rounded-full px-3.5 py-1.5", theme.searchBg)}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span className="text-[10px] text-white/85">
              {state.query || <span className="text-white/35">Search</span>}
            </span>
            {keyboard && <span className="ml-px inline-block h-[10px] w-[1.5px] animate-blink bg-white/80" />}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {(state.view === "search" ? CONTACTS.filter((c) => searchMatch ? c.name === searchMatch.name : false) : CONTACTS).map((c) => (
          <div key={c.name} className="flex items-center gap-2.5 px-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: `${c.hue}22`, color: c.hue, border: `1px solid ${c.hue}44` }}>
              {c.name[0]}
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-semibold text-white/92">{c.name}</span>
                <span className="text-[7.5px] text-white/35">{c.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="truncate text-[9px] text-white/45">{c.msg}</span>
                {c.unread > 0 && (
                  <span className="flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[7px] font-bold text-white" style={{ background: app === "telegram" ? "#8ab4f8" : "#25d366" }}>
                    {c.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {state.view === "search" && !searchMatch && (
          <div className="px-3 pt-6 text-center text-[9px] text-white/30">No results</div>
        )}
      </div>
    </div>
  );
}
