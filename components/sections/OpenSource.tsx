import { highlightLines } from "@/lib/shiki";
import { LINKS } from "@/lib/links";

const LINKS_LIST = [
  { label: "GitHub", meta: "charantek1styearbtech / android-mcp", href: LINKS.repo },
  { label: "Documentation", meta: "readme · quickstart · faq", href: LINKS.docs },
  { label: "Architecture", meta: "gateway · websocket · client", href: LINKS.architecture },
  { label: "MCP tools", meta: "14 tools · full spec", href: LINKS.docs },
  { label: "Android client", meta: "accessibilityservice · vpnservice", href: LINKS.repo },
  { label: "Releases", meta: `APK ${LINKS.apkVersion} · ${LINKS.apkSize}`, href: LINKS.releases },
];

const FRAGMENT = `// NetworkFlowTracker.kt
class NetworkFlowTracker(context: Context) : VpnService() {
    fun onFlow(event: NetworkEvent) {
        store.record(event)   // url, status, durationMs
    }
}`;

const CHIPS = ["Open source", "Self-hostable", "MCP compatible", "Android 10+"];

export default async function OpenSource() {
  const ghost = await highlightLines(FRAGMENT, "typescript");

  return (
    <section className="relative overflow-hidden bg-[#f4f4f0] px-5 py-28 text-[#0a0a0c] md:px-9 md:py-40">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="tech-label mb-6 flex items-center gap-3 !text-black/35">
          <span className="text-[#1a7f4b]">14</span>
          <span className="h-px w-8 bg-black/15" />
          Open source
        </div>
        <h2 className="display text-[clamp(2.4rem,7vw,6rem)]">Built in the open.</h2>
        <p className="mt-7 max-w-[58ch] text-[17px] leading-relaxed text-black/55">
          The Android client, the gateway and the MCP surface are all public. Run the hosted gateway or stand up
          your own — your devices, your traffic, your call.
        </p>

        <div className="mt-16 grid grid-cols-1 gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div>
            {LINKS_LIST.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline justify-between gap-6 border-t border-black/[0.12] py-5 transition-colors hover:bg-black/[0.03] last:border-b"
              >
                <span className="display text-[clamp(1.4rem,3.2vw,2.4rem)] transition-transform duration-300 group-hover:translate-x-1">
                  {l.label}
                </span>
                <span className="mono shrink-0 text-[10.5px] text-black/40">{l.meta}</span>
                <span className="ml-2 shrink-0 text-black/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-black/60">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
              </a>
            ))}

            <div className="mt-10 flex flex-wrap gap-3">
              {CHIPS.map((c) => (
                <span key={c} className="mono rounded-full border border-black/15 px-3.5 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-black/60">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* ghost source fragments floating behind */}
          <div className="relative hidden lg:block">
            <div className="sticky top-[28vh]">
              <pre className="mono select-none overflow-hidden whitespace-pre-wrap text-[11.5px] leading-[1.9] text-black/[0.28]">
                {ghost.map((l, i) => (
                  <span key={i} className="block">{l.text || " "}</span>
                ))}
              </pre>
              <div className="mono mt-8 text-[10.5px] tracking-[0.18em] text-black/30">
                README · ARCHITECTURE.md · MCP_TOOLS.md
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
