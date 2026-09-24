"use client";

import { H2, Kicker, Lede, Reveal, Row, Section } from "@/components/ui/kit";

type Tool = { name: string; params: string; desc: string };

const DEVICE: Tool[] = [
  { name: "android_authenticate", params: "session_token?", desc: "Validates the session or starts browser Google OAuth." },
  { name: "android_list_devices", params: "—", desc: "Lists every phone connected to your account." },
  { name: "android_select_device", params: "device_id", desc: "Targets one handset for the calls that follow." },
  { name: "android_get_screen", params: "include_screenshot?", desc: "Returns the accessibility tree, optionally with a screenshot." },
  { name: "android_take_screenshot", params: "—", desc: "Captures a full-resolution PNG of the display." },
  { name: "android_open_app", params: "package_name", desc: "Launches any installed app." },
  { name: "android_execute_action", params: "action_type, x?, y?, text?", desc: "Dispatches taps, text input, swipes and scrolls." },
  { name: "android_press_key", params: "key_code", desc: "Hardware keys — back, home, enter, power." },
  { name: "android_run_goal", params: "goal", desc: "Hands a high-level goal to the on-device ReAct agent." },
];

const NETWORK: Tool[] = [
  { name: "network_start_monitor", params: "test_id?", desc: "Starts scoped VpnService flow capture." },
  { name: "network_stop_monitor", params: "—", desc: "Stops capture and returns aggregated error and latency stats." },
  { name: "network_get_events", params: "host?, test_id?, limit?", desc: "Granular request URLs, status codes and timings." },
  { name: "network_get_connections", params: "—", desc: "Active TCP and TLS sockets, including cleartext HTTP." },
  { name: "network_assert_traffic", params: "expected_host, max_failed_requests?", desc: "Regression assertions for security pipelines." },
];

export default function Tools() {
  return (
    <Section id="tools" className="border-t border-white/[0.06] bg-void">
      <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Kicker index="13">Tool reference</Kicker>
          <H2>
            Fourteen tools.
            <br />
            <span className="text-dim">Every surface.</span>
          </H2>
        </div>
        <Lede className="max-w-[42ch] md:text-right">
          Nine drive the device. Five read the network. All of them are plain MCP calls your agent already knows
          how to make.
        </Lede>
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-14 lg:grid-cols-2">
        <ToolGroup title="Device control" tools={DEVICE} />
        <ToolGroup title="Network intelligence" tools={NETWORK} accent />
      </div>
    </Section>
  );
}

function ToolGroup({ title, tools, accent = false }: { title: string; tools: Tool[]; accent?: boolean }) {
  return (
    <div>
      <div className="tech-label mb-2 flex items-center gap-3">
        <span className={accent ? "h-1.5 w-1.5 rounded-full bg-cyan" : "h-1.5 w-1.5 rounded-full bg-green"} />
        {title}
      </div>
      {tools.map((t, i) => (
        <Reveal key={t.name} delay={i * 0.03} y={10}>
          <Row className="py-4">
            <div className="md:col-span-6">
              <div className={accent ? "mono text-[12.5px] text-cyan" : "mono text-[12.5px] text-green"}>
                {t.name}
              </div>
            </div>
            <div className="md:col-span-6">
              <p className="text-[14px] leading-relaxed text-dim">{t.desc}</p>
              <p className="mono mt-1 text-[10.5px] text-dimmer">{t.params}</p>
            </div>
          </Row>
        </Reveal>
      ))}
    </div>
  );
}
