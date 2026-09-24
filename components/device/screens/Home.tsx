"use client";

import StatusBar from "../StatusBar";
import { CameraIcon, ChromeIcon, ClockIcon, GmailIcon, MapsIcon, MessagesIcon, PhoneIcon, SettingsIcon, TelegramIcon, WhatsAppIcon } from "./AppIcons";

const ROW1 = [
  { key: "telegram", label: "Telegram", Icon: TelegramIcon },
  { key: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon },
  { key: "chrome", label: "Chrome", Icon: ChromeIcon },
  { key: "gmail", label: "Gmail", Icon: GmailIcon },
];
const ROW2 = [
  { key: "maps", label: "Maps", Icon: MapsIcon },
  { key: "settings", label: "Settings", Icon: SettingsIcon },
  { key: "messages", label: "Messages", Icon: MessagesIcon },
  { key: "camera", label: "Camera", Icon: CameraIcon },
];

export default function Home() {
  return (
    <div className="flex h-full flex-col bg-[#0b0d10]">
      <StatusBar />
      <div className="flex flex-1 flex-col items-center px-4 pt-5">
        <div className="text-center">
          <div className="mono text-[54px] font-light leading-none tracking-tight text-white/90" style={{ fontVariantNumeric: "tabular-nums" }}>
            18:04
          </div>
          <div className="mt-1 text-[11px] font-medium text-white/45">Wed, Sep 23</div>
        </div>
        {/* search pill */}
        <div className="mt-5 flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="text-[10px] text-white/40">Search</span>
          <span className="ml-auto h-4 w-4 rounded-full bg-gradient-to-br from-[#8b7cff]/70 to-[#5cd6ec]/70" />
        </div>
        {/* app grid */}
        <div className="mt-6 grid w-full grid-cols-4 gap-x-3 gap-y-4">
          {[...ROW1, ...ROW2].map(({ key, label, Icon }) => (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <div
                data-app={key}
                className="flex aspect-square w-full items-center justify-center rounded-[22%] border border-white/[0.08] bg-white/[0.045] text-white/85"
              >
                <Icon />
              </div>
              <span className="text-[8.5px] font-medium text-white/55">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-1.5 pb-1.5">
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span className="h-1 w-1 rounded-full bg-white/80" />
          <span className="h-1 w-1 rounded-full bg-white/30" />
        </div>
      </div>
      {/* dock */}
      <div className="mx-3 mb-2 flex items-center justify-around rounded-[26px] border border-white/[0.07] bg-white/[0.04] px-2 py-2.5">
        <DockIcon Icon={PhoneIcon} />
        <DockIcon Icon={MessagesIcon} />
        <DockIcon Icon={ClockIcon} />
        <DockIcon Icon={CameraIcon} />
      </div>
      <div className="mx-auto mb-1.5 h-1 w-16 rounded-full bg-white/35" />
    </div>
  );
}

function DockIcon({ Icon }: { Icon: (p: { className?: string }) => React.ReactElement }) {
  return (
    <div className="flex aspect-square w-9 items-center justify-center rounded-[22%] border border-white/[0.08] bg-white/[0.05] text-white/85">
      <Icon />
    </div>
  );
}
