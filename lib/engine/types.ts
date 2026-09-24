/**
 * Deterministic automation-demo engine — types.
 *
 * A DemoTask is a sequence of Steps. Each Step declares the full ScreenState
 * it resolves to, plus timed touch Actions (tap / type / swipe). The screen at
 * any normalized time t is a pure function: getScreenAt(task, t).
 */

export type AppId =
  | "off"
  | "lock"
  | "home"
  | "telegram"
  | "whatsapp"
  | "chrome"
  | "gmail"
  | "settings"
  | "maps";

export type ChatMessage = { id: string; text: string; incoming: boolean; time: string };

export type TelegramState = {
  view: "list" | "search" | "chat";
  query: string;
  /** Chat messages visible in the open conversation. */
  messages: ChatMessage[];
  draft: string;
  sending: boolean;
};

export type WhatsAppState = {
  view: "list" | "search" | "chat";
  query: string;
  messages: ChatMessage[];
  draft: string;
  sending: boolean;
};

export type ChromeState = {
  url: string;
  progress: number; // 0..1 page-load bar
  /** Text currently being typed into a form field (login flow). */
  typed?: string;
  /** Which field the agent is typing into. */
  field?: "email" | "password" | null;
};

export type GmailState = {
  /** Index of the email being viewed; -1 = inbox list. */
  openIndex: number;
  archived: boolean;
};

export type SettingsState = {
  toggles: Record<string, boolean>;
  /** Which settings row is visually focused, if any. */
  focus?: string;
};

export type MapsState = {
  /** Pin progress 0..1 — destination drop animation. */
  pin: number;
  routeProgress: number;
};

export type ScreenState = {
  app: AppId;
  brightness: number; // 0..1 — 0 is screen-off
  keyboard: boolean;
  telegram?: TelegramState;
  whatsapp?: WhatsAppState;
  chrome?: ChromeState;
  gmail?: GmailState;
  settings?: SettingsState;
  maps?: MapsState;
};

export type TapAction = { kind: "tap"; x: number; y: number; at: number; label?: string };
export type TypeAction = { kind: "type"; text: string; at: number; duration: number };
export type SwipeAction = {
  kind: "swipe";
  from: [number, number];
  to: [number, number];
  at: number;
  duration: number;
  label?: string;
};
export type Action = TapAction | TypeAction | SwipeAction;

export type PhaseTag = "OBSERVE" | "ACT" | "VERIFY";

export type Step = {
  /** Stable id — also used as a code-sync key (e.g. "open_telegram"). */
  id: string;
  /** Duration in normalized task-time units (sum = 1.0 across the task). */
  duration: number;
  /** The full screen state while this step holds. */
  screen: ScreenState;
  /** Touch actions, timed in seconds from the step's local start. */
  actions: Action[];
  phase?: PhaseTag;
  /** Explanatory micro-copy shown beside the phone during this step. */
  caption?: string;
  /** Optional code line to highlight in the sync section. */
  code?: string;
};

export type DemoTask = {
  id: string;
  /** The AI command that kicked this task off. */
  command: string;
  steps: Step[];
};

/* ---------- shared fixtures ---------- */

export const TG_RAHUL_MESSAGES: ChatMessage[] = [
  { id: "m1", text: "yo did you see the launch stream?", incoming: true, time: "18:02" },
  { id: "m2", text: "still watching, one sec", incoming: false, time: "18:03" },
];

export const WA_MOM_MESSAGES: ChatMessage[] = [
  { id: "w1", text: "Dinner at 7? Don't be late again 😄", incoming: true, time: "17:41" },
  { id: "w2", text: "leaving the office now", incoming: true, time: "17:58" },
];

export const GMAIL_LIST = [
  { from: "Vercel", subject: "Your deployment is ready", snippet: "android-mcp-site · production", time: "17:12" },
  { from: "GitHub", subject: "[android-mcp] New release: v1.1.0", snippet: "Cloud Fleet Gateway · OTA", time: "16:40" },
  { from: "Mom", subject: "Sunday dinner", snippet: "Don't forget the dessert…", time: "15:21" },
];

export const screenOff: ScreenState = { app: "off", brightness: 0, keyboard: false };

export const lockScreen: ScreenState = {
  app: "lock",
  brightness: 1,
  keyboard: false,
};

export const homeScreen: ScreenState = { app: "home", brightness: 1, keyboard: false };
