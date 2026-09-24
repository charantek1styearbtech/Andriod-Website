"use client";

import type { ScreenState } from "@/lib/engine/types";
import Home from "./screens/Home";
import ChatApp, { TG_THEME, WA_THEME } from "./screens/ChatApp";
import { ChromeScreen, GmailScreen, MapsScreen, SettingsScreen } from "./screens/MiscScreens";

export default function ScreenRouter({ screen }: { screen: ScreenState }) {
  switch (screen.app) {
    case "home":
      return <Home />;
    case "telegram":
      return screen.telegram ? (
        <ChatApp theme={TG_THEME} state={screen.telegram} app="telegram" keyboard={screen.keyboard} />
      ) : null;
    case "whatsapp":
      return screen.whatsapp ? (
        <ChatApp theme={WA_THEME} state={screen.whatsapp} app="whatsapp" keyboard={screen.keyboard} />
      ) : null;
    case "chrome":
      return screen.chrome ? (
        <ChromeScreen state={screen.chrome} keyboard={screen.chrome.field != null} draft={screen.chrome.typed ?? ""} />
      ) : null;
    case "gmail":
      return screen.gmail ? <GmailScreen state={screen.gmail} /> : null;
    case "settings":
      return screen.settings ? <SettingsScreen state={screen.settings} /> : null;
    case "maps":
      return screen.maps ? <MapsScreen state={screen.maps} /> : null;
    case "lock":
      return <LockScreen />;
    case "off":
    default:
      return null;
  }
}

function LockScreen() {
  return (
    <div className="flex h-full flex-col bg-[#07080b]">
      <div className="mt-auto px-6 pb-24 text-center">
        <div className="mono text-[64px] font-extralight leading-none text-white/95" style={{ fontVariantNumeric: "tabular-nums" }}>
          18:04
        </div>
        <div className="mt-2 text-[11px] font-medium text-white/50">Wed, Sep 23</div>
      </div>
      <div className="flex items-center justify-between px-8 pb-6 text-[9px] text-white/40">
        <span>Emergency</span>
        <span className="mono">swipe up to unlock</span>
      </div>
    </div>
  );
}
