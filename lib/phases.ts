import type { DemoTask } from "./engine/types";
import { chromeNav, gmailArchive, loginNetwork, mapsPin, settingsDnd, telegramRahul, whatsappMom } from "./demoTasks";

export type PhaseId =
  | "hero"
  | "operator"
  | "pipeline"
  | "agentloop"
  | "apps"
  | "accessibility"
  | "network"
  | "bugbounty"
  | "fleet";

/**
 * Camera + task per phase. Positions are in screen-relative units:
 *   x: 0 = centered,  +1 = phone moves right by one half-viewport
 *   scale: 1 = hero size;  accessibility phase pushes in ~2.2x
 * The DeviceStage interpolates between these via one scrubbed ScrollTrigger.
 */
export type PhaseDef = {
  id: PhaseId;
  label: string; // tiny mono label, e.g. "01 / OPERATOR"
  task: DemoTask;
  /** Seconds for one full autoplay pass of the task in this phase. */
  taskSeconds: number;
  camera: { x: number; y: number; scale: number; rotate?: number };
  /** Does the phone stay at its default centered size in this phase? */
  bgTint?: "black" | "graphite";
};

export const PHASES: PhaseDef[] = [
  {
    id: "hero",
    label: "00 / GIVE AI HANDS",
    task: telegramRahul,
    taskSeconds: 26,
    camera: { x: 0, y: 0.16, scale: 1 },
    bgTint: "black",
  },
  {
    id: "operator",
    label: "01 / OPERATOR",
    task: settingsDnd,
    taskSeconds: 14,
    camera: { x: 0.22, y: 0, scale: 0.92 },
    bgTint: "black",
  },
  {
    id: "pipeline",
    label: "02 / PIPELINE",
    task: chromeNav,
    taskSeconds: 12,
    camera: { x: 0.3, y: 0, scale: 0.8 },
    bgTint: "black",
  },
  {
    id: "agentloop",
    label: "03 / AGENT LOOP",
    task: whatsappMom,
    taskSeconds: 22,
    camera: { x: 0.24, y: 0, scale: 0.95 },
    bgTint: "black",
  },
  {
    id: "apps",
    label: "04 / YOUR APPS",
    task: gmailArchive,
    taskSeconds: 14,
    camera: { x: 0, y: 0, scale: 1.04 },
    bgTint: "black",
  },
  {
    id: "accessibility",
    label: "05 / SEMANTIC UI",
    task: telegramRahul, // re-used; zoomed in on the send flow
    taskSeconds: 18,
    camera: { x: 0, y: 0.1, scale: 2.2 },
    bgTint: "black",
  },
  {
    id: "network",
    label: "06 / BENEATH THE SCREEN",
    task: loginNetwork,
    taskSeconds: 18,
    camera: { x: 0.26, y: 0, scale: 0.88 },
    bgTint: "black",
  },
  {
    id: "bugbounty",
    label: "07 / BUG BOUNTY",
    task: loginNetwork, // replay while the security console narrates
    taskSeconds: 16,
    camera: { x: 0.3, y: 0, scale: 0.7 },
    bgTint: "black",
  },
  {
    id: "fleet",
    label: "08 / FLEET",
    task: mapsPin,
    taskSeconds: 16,
    camera: { x: -0.24, y: 0.14, scale: 0.55 },
    bgTint: "black",
  },
];

/** Scroll length per phase, in viewport heights (the pin's driver). */
export const PHASE_VH: Record<PhaseId, number> = {
  // Keep the cinematic scenes, but avoid making each transition require
  // several wheel gestures before the next phase can begin.
  hero: 95,
  operator: 70,
  pipeline: 80,
  agentloop: 95,
  apps: 80,
  accessibility: 75,
  network: 80,
  bugbounty: 80,
  fleet: 90,
};

export const TOTAL_STAGE_VH = Object.values(PHASE_VH).reduce((a, b) => a + b, 0);
