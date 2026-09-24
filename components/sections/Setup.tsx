"use client";

import { useState } from "react";
import { H2, Kicker, Lede, Reveal, Section } from "@/components/ui/kit";
import { LINKS, claudeAddCommand } from "@/lib/links";
import { cn } from "@/lib/cn";
import DownloadLink from "@/components/DownloadLink";

const TABS = ["Claude Code", "Cursor", "Antigravity"] as const;

const SNIPPETS: Record<(typeof TABS)[number], string> = {
  "Claude Code": `claude mcp add android -- \\
  ${LINKS.gatewaySse}?email=you@gmail.com`,
  Cursor: `# Cursor → Settings → Features → MCP → + Add New MCP Server
Name:  Android Fleet
Type:  SSE
URL:   ${LINKS.gatewaySse}?email=you@gmail.com`,
  Antigravity: `{
  "mcpServers": {
    "android": {
      "command": "node",
      "args": ["backend/dist/mcp/stdio_bridge.js",
               "--gateway", "${LINKS.gateway}",
               "--email", "you@gmail.com"]
    }
  }
}`,
};

const STEPS = [
  {
    n: "01",
    title: "Install the client",
    body: `Sideload the Android app (${LINKS.apkSize}), then grant it the AccessibilityService permission so the agent can read screens and act.`,
  },
  {
    n: "02",
    title: "Connect the device",
    body: "Sign in with Google in the Cloud Gateway tab and connect. The phone opens an outbound WebSocket — no ADB, no port forwarding, works over cellular.",
  },
  {
    n: "03",
    title: "Add your AI client",
    body: "Register the gateway as an MCP server. Prefer stdio? Point any sidecar at the same SSE endpoint.",
  },
  {
    n: "04",
    title: "Authenticate once",
    body: "Your first call returns a Google OAuth link. Complete it in a browser and every later call is authenticated.",
  },
];

export default function Setup() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Claude Code");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPETS[tab]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Section id="setup" className="border-t border-white/[0.06] bg-[#07080b]">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <Kicker index="12">Setup</Kicker>
          <H2>
            Two minutes.
            <br />
            <span className="text-dim">No cables.</span>
          </H2>
          <Lede className="mt-7">
            Pixel, OnePlus, Samsung, Xiaomi — anything running Android 10+. The handset is the execution layer;
            the gateway only routes.
          </Lede>

          <div className="mt-12">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05}>
                <div className="flex gap-6 border-t border-white/[0.07] py-6">
                  <span className="ghost-number shrink-0 text-[2.6rem]">{s.n}</span>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-tight text-soft">{s.title}</h3>
                    <p className="mt-2 max-w-[52ch] text-[14.5px] leading-relaxed text-dim">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <DownloadLink
              className="mono rounded-full bg-soft px-5 py-2.5 text-[12px] font-medium text-void transition-transform hover:scale-[1.03] active:scale-95"
              showCount
            >
              Download APK {LINKS.apkVersion}
            </DownloadLink>
            <a
              href={LINKS.releases}
              target="_blank"
              rel="noreferrer"
              className="mono text-[12px] text-dim underline decoration-white/20 underline-offset-4 transition-colors hover:text-soft"
            >
              all releases
            </a>
            <span className="mono text-[11px] text-dimmer">{LINKS.apkSize} · build 2</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "mono rounded-full border px-3.5 py-1.5 text-[11px] transition-colors",
                  tab === t ? "border-violet/40 bg-violet/[0.1] text-soft" : "border-white/10 text-dimmer hover:text-dim",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button onClick={copy} className="mono w-full rounded-xl border border-white/[0.09] bg-[#0a0a0c] px-4 py-4 text-left text-[12px] leading-relaxed text-dim transition-colors hover:border-violet/30">
              <pre className="whitespace-pre-wrap break-all">{SNIPPETS[tab]}</pre>
              <span className="mt-3 inline-block text-[10px] text-dimmer">{copied ? "copied" : "click to copy"}</span>
            </button>
          </div>

          <Reveal delay={0.1}>
            <div className="mono mt-8 rounded-xl border border-white/[0.08] bg-[#0a0a0c] px-5 py-5 text-[12px] leading-loose">
              <div className="text-dimmer">
                <span className="text-dim">you ›</span> List my connected Android devices.
              </div>
              <div className="mt-3 text-dim">
                <span className="text-violet">agent ›</span> Google OAuth required.{" "}
                <span className="text-cyan">Open: {LINKS.oauth}?session=…</span>
              </div>
              <div className="mt-1.5 text-dimmer">
                <span className="text-dim">you ›</span> <em>(authorise in browser)</em>
              </div>
              <div className="mt-3 text-green">
                <span className="text-dim">agent ›</span> Authenticated. Found 1 active device:{" "}
                <span className="text-soft">oneplus_nord_4</span>.
              </div>
            </div>
          </Reveal>

          <p className="mono mt-4 text-[10.5px] leading-relaxed text-dimmer">
            {claudeAddCommand().slice(0, 15)}… · an email parameter alone never grants access — browser-based Google
            OAuth is required.
          </p>
        </div>
      </div>
    </Section>
  );
}
