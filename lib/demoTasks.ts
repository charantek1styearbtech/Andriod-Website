import type { DemoTask, ScreenState } from "./engine/types";
import { TG_RAHUL_MESSAGES, WA_MOM_MESSAGES, screenOff } from "./engine/types";

/* ---------- screen builders ---------- */

type TgState = NonNullable<ScreenState["telegram"]>;

const tg = (
  state: Partial<TgState> = {},
  screen: Partial<ScreenState> = {},
): ScreenState => ({
  app: "telegram",
  brightness: 1,
  keyboard: false,
  ...screen,
  telegram: {
    view: "list",
    query: "",
    messages: TG_RAHUL_MESSAGES,
    draft: "",
    sending: false,
    ...state,
  },
});

type WaState = NonNullable<ScreenState["whatsapp"]>;

const wa = (
  state: Partial<WaState> = {},
  screen: Partial<ScreenState> = {},
): ScreenState => ({
  app: "whatsapp",
  brightness: 1,
  keyboard: false,
  ...screen,
  whatsapp: {
    view: "list",
    query: "",
    messages: WA_MOM_MESSAGES,
    draft: "",
    sending: false,
    ...state,
  },
});

const home: ScreenState = { app: "home", brightness: 1, keyboard: false };
const lock: ScreenState = { app: "lock", brightness: 1, keyboard: false };
const chrome = (url: string, progress: number): ScreenState => ({
  app: "chrome",
  brightness: 1,
  keyboard: false,
  chrome: { url, progress },
});
const gmail = (openIndex: number, archived: boolean): ScreenState => ({
  app: "gmail",
  brightness: 1,
  keyboard: false,
  gmail: { openIndex, archived },
});
const settings = (toggles: Record<string, boolean>, focus?: string): ScreenState => ({
  app: "settings",
  brightness: 1,
  keyboard: false,
  settings: { toggles, focus },
});
const maps = (pin: number, routeProgress: number): ScreenState => ({
  app: "maps",
  brightness: 1,
  keyboard: false,
  maps: { pin, routeProgress },
});

/* ---------- coordinates (normalized 0..1 on screen) ---------- */

export const TAP = {
  wake: [0.5, 0.92] as const,
  telegram: [0.155, 0.45] as const,
  whatsapp: [0.385, 0.45] as const,
  chrome: [0.615, 0.45] as const,
  gmail: [0.845, 0.45] as const,
  maps: [0.155, 0.57] as const,
  settings: [0.385, 0.57] as const,
  search: [0.5, 0.135] as const,
  chatResult: [0.5, 0.31] as const,
  tgInput: [0.44, 0.9] as const,
  tgSend: [0.878, 0.9] as const,
};

/* =========================================================
   HERO — Telegram → Rahul (the 11-step sequence)
   ========================================================= */

export const telegramRahul: DemoTask = {
  id: "telegram-rahul",
  command: "Open Telegram and message Rahul: “I'll be there in 10 minutes.”",
  steps: [
    {
      id: "wake",
      duration: 4,
      screen: lock,
      actions: [{ kind: "tap", x: TAP.wake[0], y: TAP.wake[1], at: 0.7 }],
      phase: "OBSERVE",
      caption: "Screen wakes. The agent reads the display.",
      code: "android_get_screen()",
    },
    {
      id: "unlock",
      duration: 3,
      screen: home,
      actions: [
        { kind: "swipe", from: [0.5, 0.85], to: [0.5, 0.25], at: 0.6, duration: 0.7, label: "unlock" },
      ],
      caption: "Swipe up to unlock.",
      code: "android_execute_action(swipe)",
    },
    {
      id: "open_telegram",
      duration: 3.2,
      screen: tg(),
      actions: [{ kind: "tap", x: TAP.telegram[0], y: TAP.telegram[1], at: 0.8, label: "Telegram" }],
      phase: "ACT",
      caption: "Tap. Telegram launches.",
      code: 'android_execute_action(tap "Telegram")',
    },
    {
      id: "tap_search",
      duration: 2.6,
      screen: tg(),
      actions: [{ kind: "tap", x: TAP.search[0], y: TAP.search[1], at: 0.8, label: "search" }],
      caption: "Find the conversation.",
    },
    {
      id: "search_rahul",
      duration: 3.4,
      screen: tg({ view: "search" }, { keyboard: true }),
      actions: [
        { kind: "tap", x: TAP.search[0], y: TAP.search[1], at: 0.4 },
        { kind: "type", text: "rahul", at: 0.9, duration: 1.7 },
      ],
      caption: "Type. The agent spells the name.",
      code: 'android_execute_action(text "rahul")',
    },
    {
      id: "open_chat",
      duration: 3,
      screen: tg({ view: "chat", query: "rahul" }),
      actions: [{ kind: "tap", x: TAP.chatResult[0], y: TAP.chatResult[1], at: 0.9, label: "Rahul" }],
      caption: "Chat opens.",
    },
    {
      id: "focus_input",
      duration: 2.4,
      screen: tg({ view: "chat", query: "rahul" }, { keyboard: true }),
      actions: [{ kind: "tap", x: TAP.tgInput[0], y: TAP.tgInput[1], at: 0.7, label: "input" }],
      caption: "Focus the message field.",
    },
    {
      id: "type_message",
      duration: 5,
      screen: tg({ view: "chat", query: "rahul" }, { keyboard: true }),
      actions: [{ kind: "type", text: "I'll be there in 10 minutes.", at: 0.5, duration: 3.6 }],
      caption: "Type the message, character by character.",
      code: 'android_execute_action(text "I\'ll be there in 10 minutes.")',
    },
    {
      id: "send_message",
      duration: 3,
      screen: tg({ view: "chat", query: "rahul" }, { keyboard: true }),
      actions: [{ kind: "tap", x: TAP.tgSend[0], y: TAP.tgSend[1], at: 0.9, label: "send" }],
      caption: "Send.",
      code: 'android_execute_action(tap "Send")',
    },
    {
      id: "verify",
      duration: 4,
      screen: tg({ view: "chat", query: "rahul" }),
      actions: [],
      phase: "VERIFY",
      caption: "Message delivered. Task verified.",
      code: "android_take_screenshot()",
    },
  ],
};

/* =========================================================
   AGENT LOOP — WhatsApp → Mom, reply “On my way.”
   ========================================================= */

export const whatsappMom: DemoTask = {
  id: "whatsapp-mom",
  command: "Find the latest message from Mom and reply “On my way.”",
  steps: [
    {
      id: "open_whatsapp",
      duration: 3,
      screen: home,
      actions: [{ kind: "tap", x: TAP.whatsapp[0], y: TAP.whatsapp[1], at: 0.8, label: "WhatsApp" }],
      phase: "OBSERVE",
      caption: "Launch WhatsApp.",
      code: 'android_open_app("com.whatsapp")',
    },
    {
      id: "tap_search",
      duration: 2.4,
      screen: wa(),
      actions: [{ kind: "tap", x: TAP.search[0], y: TAP.search[1], at: 0.8 }],
      phase: "ACT",
      caption: "Search for the contact.",
    },
    {
      id: "search_mom",
      duration: 3,
      screen: wa({ view: "search" }, { keyboard: true }),
      actions: [
        { kind: "tap", x: TAP.search[0], y: TAP.search[1], at: 0.4 },
        { kind: "type", text: "mom", at: 0.9, duration: 1.3 },
      ],
      caption: "Type “mom”.",
    },
    {
      id: "open_chat",
      duration: 3.2,
      screen: wa({ view: "chat", query: "mom" }),
      actions: [{ kind: "tap", x: TAP.chatResult[0], y: TAP.chatResult[1], at: 0.9, label: "Mom" }],
      caption: "Read the latest message.",
    },
    {
      id: "type_reply",
      duration: 4,
      screen: wa({ view: "chat", query: "mom" }, { keyboard: true }),
      actions: [
        { kind: "tap", x: 0.44, y: 0.9, at: 0.5, label: "input" },
        { kind: "type", text: "On my way", at: 1.0, duration: 1.9 },
      ],
      caption: "Compose the reply.",
    },
    {
      id: "send_message",
      duration: 2.8,
      screen: wa({ view: "chat", query: "mom" }, { keyboard: true }),
      actions: [{ kind: "tap", x: TAP.tgSend[0], y: TAP.tgSend[1], at: 0.9, label: "send" }],
      caption: "Send.",
    },
    {
      id: "verify",
      duration: 3.6,
      screen: wa({ view: "chat", query: "mom" }),
      actions: [],
      phase: "VERIFY",
      caption: "Delivered — verified by screenshot.",
      code: "android_take_screenshot()",
    },
  ],
};

/* =========================================================
   OPERATOR — Settings, Do Not Disturb
   ========================================================= */

export const settingsDnd: DemoTask = {
  id: "settings-dnd",
  command: "Enable Do Not Disturb until tomorrow morning.",
  steps: [
    {
      id: "open_settings",
      duration: 2.8,
      screen: home,
      actions: [{ kind: "tap", x: TAP.settings[0], y: TAP.settings[1], at: 0.8, label: "Settings" }],
      phase: "ACT",
      caption: "Open Settings.",
      code: 'android_open_app("com.android.settings")',
    },
    {
      id: "toggle_dnd",
      duration: 3.2,
      screen: settings({ dnd: false, wifi: true, bt: true }, "dnd"),
      actions: [{ kind: "tap", x: 0.87, y: 0.335, at: 1.0, label: "dnd" }],
      caption: "Flip the switch.",
    },
    {
      id: "verify_dnd",
      duration: 3.4,
      screen: settings({ dnd: true, wifi: true, bt: true }, "dnd"),
      actions: [],
      phase: "VERIFY",
      caption: "Do Not Disturb is on. Verified.",
    },
  ],
};

/* =========================================================
   APPS — quick scenarios for the apps montage
   ========================================================= */

export const chromeNav: DemoTask = {
  id: "chrome-nav",
  command: "Open the status dashboard and check the latest deploy.",
  steps: [
    {
      id: "open_chrome",
      duration: 2.6,
      screen: home,
      actions: [{ kind: "tap", x: TAP.chrome[0], y: TAP.chrome[1], at: 0.8, label: "Chrome" }],
      phase: "ACT",
      caption: "Launch Chrome.",
    },
    {
      id: "load_page",
      duration: 2.4,
      screen: chrome("status.andriod-mcp.dev", 0.12),
      actions: [],
      caption: "Navigate.",
    },
    {
      id: "read_page",
      duration: 3,
      screen: chrome("status.andriod-mcp.dev", 1),
      actions: [],
      phase: "VERIFY",
      caption: "Deploy passing · 42s ago.",
    },
  ],
};

export const gmailArchive: DemoTask = {
  id: "gmail-archive",
  command: "Clear the GitHub notifications from my inbox.",
  steps: [
    {
      id: "open_gmail",
      duration: 2.6,
      screen: home,
      actions: [{ kind: "tap", x: TAP.gmail[0], y: TAP.gmail[1], at: 0.8, label: "Gmail" }],
      phase: "ACT",
      caption: "Launch Gmail.",
    },
    {
      id: "open_thread",
      duration: 2.6,
      screen: gmail(-1, false),
      actions: [{ kind: "tap", x: 0.5, y: 0.42, at: 0.9, label: "GitHub thread" }],
      caption: "Open the thread.",
    },
    {
      id: "archive",
      duration: 2.8,
      screen: gmail(1, false),
      actions: [{ kind: "tap", x: 0.84, y: 0.145, at: 1.0, label: "archive" }],
      caption: "Archive.",
    },
    {
      id: "verify_gmail",
      duration: 2.6,
      screen: gmail(-1, true),
      actions: [],
      phase: "VERIFY",
      caption: "Inbox zero, GitHub thread archived.",
    },
  ],
};

export const mapsPin: DemoTask = {
  id: "maps-pin",
  command: "Drop a pin at the office and start navigation.",
  steps: [
    {
      id: "open_maps",
      duration: 2.6,
      screen: home,
      actions: [{ kind: "tap", x: TAP.maps[0], y: TAP.maps[1], at: 0.8, label: "Maps" }],
      phase: "ACT",
      caption: "Launch Maps.",
    },
    {
      id: "search_office",
      duration: 3.4,
      screen: maps(0, 0),
      actions: [
        { kind: "tap", x: 0.5, y: 0.12, at: 0.5, label: "search" },
        { kind: "type", text: "office", at: 1.0, duration: 1.5 },
      ],
      caption: "Search “office”.",
    },
    {
      id: "drop_pin",
      duration: 2.8,
      screen: maps(1, 0),
      actions: [{ kind: "tap", x: 0.5, y: 0.52, at: 0.9, label: "pin" }],
      caption: "Drop the pin.",
    },
    {
      id: "start_route",
      duration: 3,
      screen: maps(1, 0.35),
      actions: [{ kind: "tap", x: 0.845, y: 0.8, at: 0.9, label: "directions" }],
      phase: "VERIFY",
      caption: "Navigation started · 24 min ETA.",
    },
  ],
};

/* =========================================================
   NETWORK — login flow for the “beneath the screen” phase
   ========================================================= */

export const loginNetwork: DemoTask = {
  id: "login-network",
  command: "Sign in to the staging dashboard.",
  steps: [
    {
      id: "open_chrome",
      duration: 2.4,
      screen: home,
      actions: [{ kind: "tap", x: TAP.chrome[0], y: TAP.chrome[1], at: 0.8, label: "Chrome" }],
      phase: "OBSERVE",
      caption: "Open the dashboard.",
    },
    {
      id: "load_form",
      duration: 2.2,
      screen: chrome("dashboard.internal/login", 1),
      actions: [],
      caption: "The login form.",
    },
    {
      id: "type_email",
      duration: 3.2,
      screen: chrome("dashboard.internal/login", 1),
      actions: [
        { kind: "tap", x: 0.5, y: 0.42, at: 0.5, label: "email" },
        { kind: "type", text: "ava@studio.dev", at: 1.0, duration: 1.7 },
      ],
      phase: "ACT",
      caption: "Fill credentials.",
    },
    {
      id: "type_password",
      duration: 2.6,
      screen: chrome("dashboard.internal/login", 1),
      actions: [
        { kind: "tap", x: 0.5, y: 0.56, at: 0.4, label: "password" },
        { kind: "type", text: "••••••••••", at: 0.9, duration: 1.1 },
      ],
      caption: "Fill credentials.",
    },
    {
      id: "tap_login",
      duration: 2.8,
      screen: chrome("dashboard.internal/login", 1),
      actions: [{ kind: "tap", x: 0.5, y: 0.7, at: 0.9, label: "login" }],
      caption: "POST /api/login fires beneath the screen.",
    },
    {
      id: "verify_login",
      duration: 3.2,
      screen: chrome("dashboard.internal/overview", 1),
      actions: [],
      phase: "VERIFY",
      caption: "200 OK · 241 ms · session established.",
    },
  ],
};

/* =========================================================
   FINALE — screen powers down
   ========================================================= */

export const finaleTask: DemoTask = {
  id: "finale",
  command: "Power the screen off.",
  steps: [
    {
      id: "idle",
      duration: 1,
      screen: home,
      actions: [],
      caption: "One more thing.",
    },
    {
      id: "sleep",
      duration: 1.6,
      screen: screenOff,
      actions: [],
      caption: "Screen off.",
    },
  ],
};

export const TASKS = { telegramRahul, whatsappMom, settingsDnd, chromeNav, gmailArchive, mapsPin, loginNetwork, finaleTask };
