"use client";

import { H2, Kicker, Lede, Reveal, Row, Section } from "@/components/ui/kit";
import { CodeLines } from "@/components/ui/CodeLines";
import type { HighlightedLine } from "@/lib/shiki";
import { LINKS } from "@/lib/links";
import { cn } from "@/lib/cn";

const CHAIN = [
  { n: "01", who: "Hunter · Claude Code", what: "network_start_monitor(test_id: \"idor_user_profile\")", tone: "violet" },
  { n: "02", who: "MCP Fleet Gateway", what: "dispatch → oneplus_nord_4 (authenticated WSS)", tone: "dim" },
  { n: "03", who: "Phone · VpnService", what: "android_execute_action(tap, input, swipe) — UI drives real API calls", tone: "dim" },
  { n: "04", who: "Target API", what: "network_get_events(host: \"api.target.com\", limit: 50)", tone: "cyan" },
  { n: "05", who: "Verdict", what: "network_assert_traffic(expected_host, max_failed_requests: 0)", tone: "green" },
];

const SURFACES = [
  {
    n: "01",
    title: "Shadow & undocumented APIs",
    body: "Internal staging hosts and unlisted endpoints surface in captured traffic the moment your agent walks the UI.",
  },
  {
    n: "02",
    title: "PII & telemetry leakage",
    body: "See exactly which background calls ship device data, analytics payloads and identifiers off the handset.",
  },
  {
    n: "03",
    title: "BOLA · IDOR path capture",
    body: "Navigate user profiles with the agent and get the literal request paths, status codes and latencies back.",
  },
] as const;

export default function BugBountyClient({
  eventsLines,
  summaryLines,
}: {
  eventsLines: HighlightedLine[];
  summaryLines: HighlightedLine[];
}) {
  return (
    <Section id="bugbounty" className="relative overflow-hidden border-t border-white/[0.06] bg-[#07080b]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 40% at 78% 12%, rgba(92,214,236,0.07), transparent 70%)" }}
      />
      <div className="relative grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-20">
        <div>
          <Kicker index="10">Security research</Kicker>
          <H2>
            Hunt mobile
            <br />
            vulnerabilities
            <br />
            <span className="text-cyan">with words.</span>
          </H2>
          <Lede className="mt-8">
            Start a capture on the device, drive the UI with your agent, then read the traffic. No proxy setup, no
            certificate-pinning dance, no cables — VpnService capture runs where the app runs.
          </Lede>

          <div className="mt-12 space-y-0">
            {CHAIN.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.06}>
                <div className="flex items-start gap-5 border-t border-white/[0.07] py-4">
                  <span className="mono pt-0.5 text-[11px] text-dimmer">{c.n}</span>
                  <div>
                    <div
                      className={cn(
                        "mono text-[11.5px]",
                        c.tone === "violet" && "text-violet",
                        c.tone === "cyan" && "text-cyan",
                        c.tone === "green" && "text-green",
                        c.tone === "dim" && "text-dim",
                      )}
                    >
                      {c.who}
                    </div>
                    <div className="mono mt-1 text-[11.5px] text-dimmer">{c.what}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Reveal>
            <div className="tech-label mb-3">network_get_events · captured</div>
            <CodeLines lines={eventsLines} className="bg-[#08090c]" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="tech-label mb-3">network_stop_monitor · summary</div>
            <CodeLines lines={summaryLines} className="bg-[#08090c]" />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mono flex items-center gap-2.5 rounded-lg border border-green/25 bg-green/[0.06] px-4 py-3 text-[12px] text-green">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              network_assert_traffic → PASS · 0 failed requests across 42 captured
            </div>
          </Reveal>
        </div>
      </div>

      {/* attack surfaces — typographic, no cards */}
      <div className="relative mt-24">
        {SURFACES.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <Row className="items-baseline py-7">
              <div className="mono col-span-1 text-[11px] text-dimmer md:col-span-1">{s.n}</div>
              <div className="md:col-span-5">
                <h3 className="display text-[clamp(1.4rem,2.6vw,2.1rem)]">{s.title}</h3>
              </div>
              <div className="md:col-span-6">
                <p className="max-w-[58ch] text-[15px] leading-relaxed text-dim">{s.body}</p>
              </div>
            </Row>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mono mt-12 text-[11px] leading-relaxed text-dimmer">
          Use it on apps you own or are authorised to test. ·{" "}
          <a href={LINKS.docs} target="_blank" rel="noreferrer" className="text-dim underline decoration-white/20 underline-offset-4 hover:text-soft">
            Read the security guide
          </a>
        </p>
      </Reveal>
    </Section>
  );
}

export function BugBountyTicker() {
  return (
    <div className="mono flex items-center gap-3 text-[10.5px] text-dimmer">
      <span className="h-1 w-1 animate-pulse rounded-full bg-cyan" />
      capture live · vpnservice · on-device
    </div>
  );
}
