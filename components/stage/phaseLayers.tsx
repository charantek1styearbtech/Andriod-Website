"use client";

import { useState } from "react";
import { motion, useMotionValueEvent } from "motion/react";
import type { PhaseId } from "@/lib/phases";
import { useDeviceRuntime } from "./DemoRuntime";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* shared bits                                                         */
/* ------------------------------------------------------------------ */

function Caption() {
  const { spans, time } = useDeviceRuntime();
  const [caption, setCaption] = useState("");
  useMotionValueEvent(time, "change", (t) => {
    const s = spans.find((sp) => t >= sp.start && t < sp.end);
    setCaption((prev) => (prev === s?.step.caption ? prev : s?.step.caption ?? ""));
  });
  return (
    <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-dim">
      <AnimateSwap text={caption} />
    </p>
  );
}

function AnimateSwap({ text }: { text: string }) {
  return (
    <span className="relative inline-grid">
      <motion.span
        key={text}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {text}
      </motion.span>
    </span>
  );
}

function PhaseTag({ children }: { children: string }) {
  return (
    <div className="tech-label mb-5 flex items-center gap-3">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green/80" />
      {children}
    </div>
  );
}

/** Command chip — the violet AI instruction. */
function CommandChip({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7 }}
      className="mono inline-block max-w-[calc(100vw-2rem)] rounded-lg border border-violet/25 bg-violet/[0.07] px-4 py-2.5 text-[13px] leading-relaxed text-violet"
    >
      <span className="mr-2 text-violet/60">❯</span>
      {text}
    </motion.div>
  );
}

function StatusLine({ label, tone = "green" }: { label: string; tone?: "green" | "violet" | "cyan" }) {
  const dot = tone === "green" ? "bg-green" : tone === "violet" ? "bg-violet" : "bg-cyan";
  const text = tone === "green" ? "text-green" : tone === "violet" ? "text-violet" : "text-cyan";
  return (
    <div className="mono flex items-center gap-2 text-[11px]">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      <span className={text}>{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HERO                                                                */
/* ------------------------------------------------------------------ */

function HeroLayer() {
  const { spans, time, task } = useDeviceRuntime();
  const [done, setDone] = useState(false);
  useMotionValueEvent(time, "change", (t) => {
    const verify = spans.find((sp) => sp.step.id === "verify");
    setDone(!!verify && t >= verify.start + 0.6);
  });

  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-end pb-[6vh]">
      {/* cinematic scrim — the headline always sits on darkness, like the phone
          is receding behind the type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[72%]"
        style={{
          background:
            "linear-gradient(to top, #050507 26%, rgba(5,5,7,0.86) 44%, rgba(5,5,7,0.35) 66%, transparent 88%)",
        }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="display text-center text-[clamp(3.2rem,11vw,9rem)]"
      >
        Give AI
        <br />
        hands.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-5 text-[17px] text-dim"
      >
        Your AI can finally use Android.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="tech-label mt-3"
      >
        Open-source MCP infrastructure for controlling Android devices
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-5">
        <CommandChip text={task.command} />
      </motion.div>
      <div className="mt-5 h-6">
        {done && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mono flex items-center gap-2 text-[12px] text-green">
            <CheckIcon /> task completed · verified by screenshot
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 OPERATOR                                                         */
/* ------------------------------------------------------------------ */

function OperatorLayer() {
  return (
    <div className="relative z-10 flex h-full items-center">
      <div className="ml-[7vw] max-w-[560px]">
        <PhaseTag>01 / OPERATOR</PhaseTag>
        <h2 className="display text-[clamp(2.6rem,7vw,5.5rem)]">
          Not a chatbot.
          <br />
          <span className="text-dim">An operator.</span>
        </h2>
        <Caption />
        <div className="mt-6"><StatusLine label="AI decides what to do. Android executes it." /></div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 PIPELINE                                                         */
/* ------------------------------------------------------------------ */

function PipelineLayer() {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between py-[9vh]">
      <div className="ml-[7vw] max-w-[620px]">
        <PhaseTag>02 / THE PIPELINE</PhaseTag>
        <h2 className="display text-[clamp(2.2rem,5.6vw,4.6rem)]">
          One command travels
          <br />
          <span className="text-dim">the whole way down.</span>
        </h2>
      </div>
      <StreamDiagram />
    </div>
  );
}

/** Luminous command stream: clients → gateway → phone. */
function StreamDiagram() {
  const { time } = useDeviceRuntime();
  const [p, setP] = useState(0);
  useMotionValueEvent(time, "change", (t) => setP((t * 0.31) % 1)); // loop over task

  return (
    <div className="mx-[7vw]">
      <svg viewBox="0 0 1000 190" className="w-full">
        <defs>
          <linearGradient id="streamGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8b7cff" stopOpacity="0.15" />
            <stop offset="0.5" stopColor="#8b7cff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#8b7cff" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* base line */}
        <path d="M10 95 H990" stroke="rgba(244,244,241,0.08)" strokeWidth="1.5" />
        {/* travelling pulse */}
        <line
          x1={10 + 980 * Math.max(0, p - 0.12)}
          x2={10 + 980 * p}
          y1="95"
          y2="95"
          stroke="url(#streamGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* nodes */}
        <g className="mono" fill="#8a8a91" fontSize="11" letterSpacing="2">
          <text x="12" y="52">CLAUDE CODE</text>
          <text x="12" y="152">CURSOR</text>
          <text x="132" y="152">ANTIGRAVITY</text>
          <text x="430" y="40" fill="#8b7cff" fontSize="12">MCP FLEET GATEWAY</text>
          <text x="430" y="58" fill="#55555c" fontSize="9">SSE · OAUTH 2.0</text>
          <text x="880" y="52" fill="#3ddc84" fontSize="11">ANDROID</text>
          <text x="880" y="70" fill="#55555c" fontSize="9">OUTBOUND WSS</text>
        </g>
        <circle cx="8" cy="95" r="4" fill="#8b7cff" fillOpacity="0.7" />
        <circle cx="500" cy="95" r="4" fill="#8b7cff" fillOpacity="0.5" />
        <circle cx="988" cy="95" r="5" fill="#3ddc84" fillOpacity="0.9" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 AGENT LOOP                                                       */
/* ------------------------------------------------------------------ */

function AgentLoopLayer() {
  const { spans, time, task } = useDeviceRuntime();
  const [phase, setPhase] = useState<"OBSERVE" | "ACT" | "VERIFY">("OBSERVE");
  useMotionValueEvent(time, "change", (t) => {
    const s = spans.find((sp) => t >= sp.start && t < sp.end);
    setPhase(s?.step.phase ?? "ACT");
  });

  return (
    <div className="relative z-10 flex h-full items-center">
      <div className="ml-[7vw] w-[min(88vw,470px)]">
        <PhaseTag>03 / AGENT LOOP</PhaseTag>
        <h2 className="display text-[clamp(2.2rem,5.6vw,4.4rem)]">
          Watch it think.
          <br />
          Watch it act.
        </h2>
        <div className="mono mt-7 rounded-xl border border-white/10 bg-graphite/80 p-4">
          <div className="tech-label mb-2">TASK</div>
          <div className="text-[13px] leading-relaxed text-soft">“{task.command}”</div>
        </div>
        <div className="mt-4 space-y-2">
          {(["OBSERVE", "ACT", "VERIFY"] as const).map((tag) => (
            <LoopRow key={tag} tag={tag} active={phase === tag} done={phase !== "OBSERVE" && tag !== "OBSERVE" ? true : tag === "OBSERVE"} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoopRow({ tag, active, done }: { tag: string; active: boolean; done: boolean }) {
  return (
    <div className={cn("mono flex items-center gap-3 text-[12px] transition-all duration-500", active ? "text-soft" : done ? "text-dim" : "text-dimmer")}>
      <span className={cn("relative flex h-5 w-5 items-center justify-center rounded-full border text-[9px]", active ? "border-violet/60 bg-violet/15 text-violet" : done ? "border-green/50 text-green" : "border-white/15")}>
        {done && !active ? <CheckIcon2 /> : tag[0]}
        {active && <motion.span layoutId="loopdot" className="absolute inset-0 rounded-full border border-violet" />}
      </span>
      {tag}
      {active && <span className="text-[10px] text-violet">● live</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 APPS                                                             */
/* ------------------------------------------------------------------ */

function AppsLayer() {
  const { spans, time } = useDeviceRuntime();
  const [word, setWord] = useState("GMAIL");
  useMotionValueEvent(time, "change", (t) => {
    const s = spans.find((sp) => t >= sp.start && t < sp.end);
    if (!s) return;
    const w = s.step.screen.app === "gmail" ? "GMAIL" : s.step.screen.app.toUpperCase();
    setWord((prev) => (prev === w ? prev : w));
  });

  return (
    <div className="relative z-10 flex h-full flex-col items-center justify-end pb-[7vh] text-center">
      <div className="pointer-events-none absolute inset-x-0 top-[16%] -z-10 flex items-center justify-center">
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="ghost-number text-[clamp(4rem,17vw,15rem)]"
        >
          {word}
        </motion.span>
      </div>
      <div className="tech-label mb-5 flex items-center gap-3">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green/80" />
        04 / YOUR APPS
      </div>
      <h2 className="display text-[clamp(2.2rem,5.6vw,4.6rem)]">
        Your apps.
        <br />
        <span className="text-dim">Under AI control.</span>
      </h2>
      <Caption />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 05 ACCESSIBILITY                                                    */
/* ------------------------------------------------------------------ */

function AccessibilityLayer() {
  const { spans, time } = useDeviceRuntime();
  const [node, setNode] = useState<{ cls: string; text: string } | null>(null);
  useMotionValueEvent(time, "change", (t) => {
    const s = spans.find((sp) => t >= sp.start && t < sp.end);
    if (!s) return;
    if (s.step.id === "send_message") setNode({ cls: "Button", text: "Send" });
    else if (s.step.id === "type_message") setNode({ cls: "EditText", text: "Message" });
    else if (s.step.id === "search_rahul") setNode({ cls: "EditText", text: "Search" });
    else setNode(null);
  });

  return (
    <div className="relative z-10 flex h-full items-center justify-end">
      <div className="mr-[6vw] w-[min(88vw,430px)]">
        <PhaseTag>05 / SEMANTIC UI</PhaseTag>
        <h2 className="display text-[clamp(2.2rem,5.4vw,4.4rem)]">
          Every tap is
          <br />
          an action.
        </h2>
        <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-dim">
          {"AI doesn't blindly click pixels. Android exposes meaningful UI elements through the AccessibilityService."}
        </p>
        <motion.div
          animate={{ opacity: node ? 1 : 0.25, borderColor: node ? "rgba(139,124,255,0.4)" : "rgba(244,244,241,0.09)" }}
          className="mono mt-6 rounded-lg border bg-graphite/80 p-3.5 text-[11.5px] leading-relaxed"
        >
          <div className="text-violet">{node?.cls ?? "NodeInfo"}</div>
          {node && (
            <>
              <div className="text-dim">text = <span className="text-soft">“{node.text}”</span></div>
              <div className="text-dim">clickable = <span className="text-green">true</span></div>
              <div className="text-dim">visible = <span className="text-green">true</span></div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 06 NETWORK                                                          */
/* ------------------------------------------------------------------ */

const NET_LINES = [
  "POST /api/login",
  "200 OK · 241 ms",
  "HTTPS · TLS 1.3",
  "Request 842 B · Response 4.2 KB",
];

function NetworkLayer() {
  const { spans, time } = useDeviceRuntime();
  const [shown, setShown] = useState(0);
  useMotionValueEvent(time, "change", (t) => {
    const login = spans.find((sp) => sp.step.id === "tap_login");
    const verify = spans.find((sp) => sp.step.id === "verify_login");
    if (!login) return;
    let n = 0;
    if (t >= login.start + 0.4) n = 1;
    if (verify && t >= verify.start) n = NET_LINES.length;
    else if (t >= login.start + 1.2) n = 2;
    setShown((prev) => (prev === n ? prev : n));
  });

  return (
    <div className="relative z-10 flex h-full items-center justify-end">
      <div className="mr-[6vw] w-[min(88vw,460px)]">
        <PhaseTag>06 / NETWORK</PhaseTag>
        <h2 className="display text-[clamp(2.2rem,5.4vw,4.4rem)]">
          See what happens
          <br />
          beneath the screen.
        </h2>
        <div className="mono mt-6 space-y-1.5 text-[12px]">
          {NET_LINES.map((l, i) => (
            <motion.div
              key={l}
              animate={{ opacity: i < shown ? 1 : 0.12, x: i < shown ? 0 : -6 }}
              className="flex items-center gap-2.5"
            >
              <span className={cn("h-1 w-1 rounded-full", i < shown ? "bg-cyan" : "bg-white/20")} />
              <span className={i === 0 ? "text-cyan" : "text-dim"}>{l}</span>
            </motion.div>
          ))}
          {shown >= NET_LINES.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-1">
              <StatusLine label="verified · network_get_events" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 07 BUG BOUNTY (in-stage narrative)                                  */
/* ------------------------------------------------------------------ */

function BugBountyLayer() {
  const { spans, time } = useDeviceRuntime();
  const [step, setStep] = useState(0);
  useMotionValueEvent(time, "change", (t) => {
    const s = spans.find((sp) => t >= sp.start && t < sp.end);
    setStep(spans.findIndex((sp) => s === sp));
  });

  const rows = [
    { tool: "network_start_monitor", arg: 'test_id="idor_user_profile"', tone: "cmd" },
    { tool: "android_execute_action", arg: 'navigate to profile', tone: "cmd" },
    { tool: "network_get_events", arg: 'host="api.target.com"', tone: "out" },
    { tool: "network_assert_traffic", arg: "expected_host, 0 failures", tone: "ok" },
  ] as const;

  return (
    <div className="relative z-10 flex h-full items-center">
      <div className="ml-[7vw] w-[min(88vw,500px)]">
        <PhaseTag>07 / BUG BOUNTY</PhaseTag>
        <h2 className="display text-[clamp(2.2rem,5.4vw,4.4rem)]">
          Hunt mobile
          <br />
          vulnerabilities
          <br />
          with words.
        </h2>
        <div className="mono mt-6 space-y-1 text-[11.5px] leading-relaxed">
          {rows.map((r, i) => (
            <motion.div key={r.tool} animate={{ opacity: step >= i ? 1 : 0.15 }} className={cn(r.tone === "ok" ? "text-green" : r.tone === "out" ? "text-cyan" : "text-soft")}>
              <span className="text-dimmer">{String(i + 1).padStart(2, "0")} </span>
              {r.tool}({r.arg})
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 08 FLEET                                                            */
/* ------------------------------------------------------------------ */

function FleetLayer() {
  const { spans, time } = useDeviceRuntime();
  const [p, setP] = useState(0);
  useMotionValueEvent(time, "change", (t) => setP(t / (spans[spans.length - 1]?.end ?? 1)));

  const devices = [
    { id: "oneplus_nord_4", task: "DND on", x: "22%", y: "18%" },
    { id: "pixel_8", task: "reply to Mom", x: "72%", y: "14%" },
    { id: "galaxy_s24", task: "screenshot login", x: "20%", y: "66%" },
    { id: "xiaomi_14", task: "archive thread", x: "74%", y: "64%" },
  ];

  return (
    <div className="absolute inset-0 z-10">
      <div className="absolute left-[7vw] top-[24vh]">
        <PhaseTag>08 / FLEET</PhaseTag>
        <h2 className="display text-[clamp(2rem,4.6vw,3.8rem)]">
          One MCP interface.
          <br />
          <span className="text-dim">Many Android devices.</span>
        </h2>
      </div>
      {devices.map((d, i) => {
        const state = p < 0.25 + i * 0.12 ? "CONNECTED" : p < 0.55 + i * 0.1 ? "RUNNING" : "COMPLETED";
        return (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 * i }}
            className="absolute hidden md:block"
            style={{ left: d.x, top: d.y }}
          >
            <div className="mono text-[10px] text-dim">{d.id}</div>
            <div className={cn("mono mt-1 flex items-center gap-1.5 text-[9px]", state === "RUNNING" ? "text-violet" : state === "COMPLETED" ? "text-green" : "text-dimmer")}>
              <span className={cn("h-1 w-1 rounded-full", state === "RUNNING" ? "bg-violet animate-pulse" : state === "COMPLETED" ? "bg-green" : "bg-white/30")} />
              {state}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* registry                                                            */
/* ------------------------------------------------------------------ */

export const PHASE_LAYERS: Record<PhaseId, () => React.ReactElement> = {
  hero: HeroLayer,
  operator: OperatorLayer,
  pipeline: PipelineLayer,
  agentloop: AgentLoopLayer,
  apps: AppsLayer,
  accessibility: AccessibilityLayer,
  network: NetworkLayer,
  bugbounty: BugBountyLayer,
  fleet: FleetLayer,
};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

function CheckIcon2() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}
