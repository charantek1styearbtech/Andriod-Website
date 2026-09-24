import type { DemoTask, ScreenState, SwipeAction, TapAction } from "./types";
import type { StepSpan } from "./spans";
import { clamp, lerp, remap, smooth } from "../utils";

/* ---------- screen interpolation ---------- */

/**
 * Screen state at time t (seconds on the master timeline).
 * Holds the active step's declared state; typing actions drive char-level
 * draft growth; taps labeled "send" flip the draft into a sent bubble.
 */
export function getScreenAt(task: DemoTask, spans: StepSpan[], t: number): ScreenState {
  const span = activeStepOf(spans, t);
  if (!span) return task.steps[0].screen;
  const step = span.step;
  const state = step.screen;

  let brightness = state.brightness;
  if (state.app === "off") brightness = 0;

  // Typing: char-level reveal from any active type action.
  let draft = state.telegram?.draft ?? state.whatsapp?.draft ?? "";
  let typed = false;
  const local = t - span.start;
  for (const a of step.actions) {
    if (a.kind !== "type") continue;
    const p = clamp((local - a.at) / a.duration);
    draft = a.text.slice(0, Math.round(a.text.length * p));
    typed = true;
  }

  // Send: after a tap labeled "send", the draft moves into a sent bubble.
  let messages = state.telegram?.messages ?? state.whatsapp?.messages;
  let sending = state.telegram?.sending ?? state.whatsapp?.sending ?? false;
  const sendTap = step.actions.find((a) => a.kind === "tap" && a.label === "send");
  if (sendTap && messages) {
    const after = local >= sendTap.at + 0.15;
    if (after && draft.length > 0) {
      messages = [
        ...messages,
        {
          id: `${step.id}-sent`,
          text: draft,
          incoming: false,
          time: state.app === "telegram" ? "18:04" : "18:00",
        },
      ];
      draft = "";
      sending = false;
      typed = false;
    }
  }

  const telegram = state.telegram
    ? { ...state.telegram, draft, sending, messages: messages ?? state.telegram.messages }
    : undefined;
  const whatsapp = state.whatsapp
    ? { ...state.whatsapp, draft, sending, messages: messages ?? state.whatsapp.messages }
    : undefined;

  // Chrome form-typing: expose the active type action to the login screen.
  let field: "email" | "password" | null = null;
  if (typed) {
    const focusTap = step.actions.find(
      (a) => a.kind === "tap" && (a.label === "email" || a.label === "password"),
    );
    if (focusTap && focusTap.kind === "tap") {
      field = focusTap.label as "email" | "password";
    }
  }
  const chrome = state.chrome
    ? { ...state.chrome, typed: typed ? draft : undefined, field }
    : undefined;

  return { ...state, brightness, keyboard: typed ? true : state.keyboard, telegram, whatsapp, chrome };
}

export function activeStepOf(spans: StepSpan[], t: number): StepSpan | null {
  for (const s of spans) if (t >= s.start && t < s.end) return s;
  return spans.length ? spans[spans.length - 1] : null;
}

/* ---------- finger ---------- */

export type FingerPose = {
  x: number; // 0..1 within screen
  y: number;
  visible: boolean;
  pressed: boolean;
  ripple: number; // 1 right after a tap, decays to 0
};

const DEFAULT_POSE: FingerPose = { x: 0.5, y: 0.88, visible: false, pressed: false, ripple: 0 };

const TRAVEL = 0.45; // seconds of travel before each tap

export function fingerPose(spans: StepSpan[], t: number): FingerPose {
  const span = activeStepOf(spans, t);
  if (!span) return DEFAULT_POSE;
  const local = t - span.start;

  const acts = span.step.actions.filter(
    (a): a is TapAction | SwipeAction =>
      (a.kind === "tap" || a.kind === "swipe") && a.label !== "long",
  );
  if (!acts.length) return DEFAULT_POSE;

  let cursor = { x: 0.5, y: 0.95 };
  let pose: FingerPose = DEFAULT_POSE;
  let settledOnce = false;

  for (const a of acts) {
    const target = a.kind === "tap" ? { x: a.x, y: a.y } : { x: a.from[0], y: a.from[1] };
    const actionEnd = a.kind === "tap" ? a.at : a.at + a.duration;
    const travelStart = a.at - TRAVEL;

    // Not yet near this action: hold the last settled pose, or hide the
    // finger at this action's start point if nothing has happened yet.
    if (local < travelStart) {
      if (!settledOnce) pose = { ...target, visible: false, pressed: false, ripple: 0 };
      break;
    }

    // Traveling toward the action point.
    if (local < a.at) {
      const p = smooth(remap(local, travelStart, a.at));
      pose = {
        x: lerp(cursor.x, target.x, p),
        y: lerp(cursor.y, target.y, p),
        visible: true,
        pressed: false,
        ripple: 0,
      };
      break;
    }

    // Mid-swipe: glide along the path with the finger down.
    if (a.kind === "swipe" && local < actionEnd) {
      const p = smooth(clamp((local - a.at) / a.duration));
      pose = {
        x: lerp(a.from[0], a.to[0], p),
        y: lerp(a.from[1], a.to[1], p),
        visible: true,
        pressed: true,
        ripple: 0,
      };
      cursor = { x: a.to[0], y: a.to[1] };
      break;
    }

    // At / just after the action. A later action may take over on the next
    // iteration, so don't break — keep the cursor updated and continue.
    const after = clamp((local - actionEnd) / 0.3);
    const at = a.kind === "tap" ? { x: a.x, y: a.y } : { x: a.to[0], y: a.to[1] };
    pose = {
      x: at.x,
      y: at.y,
      visible: true,
      pressed: a.kind === "tap" && after < 0.6,
      ripple: a.kind === "tap" ? 1 - after : 0,
    };
    cursor = at;
    settledOnce = true;
  }

  return pose;
}
