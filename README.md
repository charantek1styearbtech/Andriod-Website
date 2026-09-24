# android-mcp — launch site

Product launch site for **android-mcp**, an open-source MCP bridge that lets AI agents drive a real Android
phone through `AccessibilityService`.

Headline: **“Give AI hands.”** The phone is the execution layer; AI sends MCP tool calls, the gateway routes
them to a device, the device performs real UI actions — and every request can be read back with the on-device
network monitor.

Real project: <https://github.com/charantek1styearbtech/andriod-mcp>

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → ./out
npm run typecheck
```

The site is a fully static export (`output: "export"`) — deploy `out/` anywhere.

## What's on the page

| # | Section | What it shows |
|---|---------|---------------|
| 00 | Hero | “Give AI hands.” + the phone powering on and running the full Telegram automation |
| 01 | Operator | “Not a chatbot. An operator.” — Do Not Disturb toggled from a command |
| 02 | Pipeline | Clients → MCP Fleet Gateway (SSE · OAuth 2.0) → phone over outbound WSS |
| 03 | Agent loop | OBSERVE / ACT / VERIFY driving a WhatsApp reply to Mom |
| 04 | Your apps | The same phone moving through Telegram, Chrome, WhatsApp, Gmail, Settings, Maps |
| 05 | Semantic UI | 2.2× push-in: the accessibility tree behind a real “Send” tap |
| 06 | Beneath the screen | Tapping Log in produces `POST /api/login · 200 OK · 241 ms` and live captures |
| 07 | Bug bounty | Hunter → gateway → VpnService → target, the 5 `network_*` tools, real JSON output |
| 08 | Fleet | One command, four devices, CONNECTED → RUNNING → COMPLETED |
| 09 | Developer experience | Shiki code highlighting **in sync** with the phone performing each call |
| 10 | Compatibility | Claude Code, Cursor, Antigravity, Gemini, and the one-command MCP registration |
| 11 | Setup | APK, AccessibilityService, Google OAuth, client configs, first authenticated call |
| 12 | Tool reference | All 14 MCP tools |
| 13 | Open source | Light section: repo, docs, releases, ghost source fragments |
| 14 | Finale | “Your AI. Your phone.” — one last action, then the screen powers off |

## Architecture

### The automation engine (`lib/engine/`)

The phone is **not** a video or a screenshot — it is a deterministic simulation:

```ts
DemoTask  →  Step[]  →  { screen: ScreenState, actions: Action[] }
```

- `Action` is a timed `tap` / `type` / `swipe` in normalized screen coordinates.
- `getScreenAt(task, t)` is a **pure function**: given a point on the master timeline it returns the exact
  `ScreenState` — including char-by-char typing and the sent-message hand-off.
- `fingerPose(spans, t)` separately derives the AI fingertip: travel, press and ripple.
- `components/stage/DemoRuntime.tsx` runs the clock (rAF autoplay, or externally scrubbed) and publishes
  everything as **MotionValues**, so the 60 fps path never re-renders React. A cheap state signature gates
  React updates to real UI changes.

`lib/demoTasks.ts` holds every scenario; adding a new one is pure data.

### The persistent stage (`components/stage/DeviceStage.tsx`)

One fixed, full-viewport layer holds the phone for hero → fleet. A tall scroll driver (1290vh, with exactly
1190vh of scrollable range so phase boundaries map 1:1) feeds one `ScrollTrigger` which:

1. picks the active phase and mounts that layer + task runtime, and
2. writes camera targets (`x` as a % of half-viewport, `scale`) that springs smooth.

Camera keyframes live in `lib/phases.ts` — e.g. the semantic-UI phase pushes to `2.2×`, the fleet phase pulls
back to `0.55×`. Post-stage content scrolls over the stage, which hides itself once covered.

### Devices and screens (`components/device/`)

A CSS-3D phone (titanium frame, punch-hole camera, moving glass sheen) rendering hand-built Material-dark
screens: home launcher with custom line-art icons, Telegram, WhatsApp, Chrome, Gmail, Settings, Maps and a
keyboard that highlights each key as the agent types.

## Conventions

- **Colour is functional**: green = verified/connected, violet = AI/commands, cyan = network data.
- Editorial layout — enormous type, one enormous visual, tiny mono metadata. No cards or dashboards.
- Everything animates transform/opacity only; `prefers-reduced-motion` disables smooth scroll, autoplay and
  the grain overlay.
- All real URLs and the APK/release metadata live in `lib/links.ts`.
