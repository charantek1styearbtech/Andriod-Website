"use client";

import { cn } from "@/lib/cn";

/** Minimal line-art launcher icons — consistent, engineered, not clip-art. */
export function TelegramIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 4 3.4 10.8c-.9.35-.85 1.63.07 1.92l4.53 1.42 1.7 5.1c.28.85 1.4.98 1.86.22l2.3-3.72 4.53 3.32c.72.53 1.75.13 1.92-.75L21.9 5.2c.18-.92-.72-1.66-1.9-1.2Z" />
        <path d="m8 14 9-7-6.5 8.5" />
      </svg>
    </span>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
        <path d="M9 8.5c-.6 2.6 3.9 7.2 6.5 6.5l.5-2-2-1-1 .8a5.5 5.5 0 0 1-1.8-1.8l.8-1-1-2Z" />
      </svg>
    </span>
  );
}

export function ChromeIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.6" />
        <path d="M12 2.8v5.4M4.7 16.8l4.6-2.7M15 19.9l2.6-4.5" />
      </svg>
    </span>
  );
}

export function GmailIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6.5 8.5 6 8.5-6" />
      </svg>
    </span>
  );
}

export function SettingsIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
      </svg>
    </span>
  );
}

export function MapsIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-6.5-5.3-6.5-10a6.5 6.5 0 0 1 13 0c0 4.7-6.5 10-6.5 10Z" />
        <circle cx="12" cy="10.6" r="2.3" />
      </svg>
    </span>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.2 2" />
      </svg>
    </span>
  );
}

export function CameraIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6.5" width="18" height="13" rx="2.5" />
        <path d="M9 6.5 10.5 4h3L15 6.5" />
        <circle cx="12" cy="13" r="3.4" />
      </svg>
    </span>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h4l1.5 4.5L8 10a12 12 0 0 0 6 6l1.5-2.5L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      </svg>
    </span>
  );
}

export function MessagesIcon({ className }: { className?: string }) {
  return (
    <span className={cn("icon", className)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="3" />
        <path d="m7 18-2 3v-3" />
        <path d="M8 10h8M8 13h5" />
      </svg>
    </span>
  );
}
