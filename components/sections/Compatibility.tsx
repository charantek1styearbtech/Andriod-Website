"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { H2, Kicker, Lede, Reveal, Section } from "@/components/ui/kit";
import { useRevealed } from "@/components/ui/useRevealed";
import { LINKS, claudeAddCommand } from "@/lib/links";
import { cn } from "@/lib/cn";

const CLIENTS = ["Claude Code", "Cursor", "Antigravity", "Gemini", "OpenCode", "any MCP client"];

export default function Compatibility() {
  const [copied, setCopied] = useState(false);
  const cmd = claudeAddCommand();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Section id="clients" className="border-t border-white/[0.06] bg-void">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <Kicker index="11">Compatibility</Kicker>
          <H2>Bring your own AI.</H2>
          <Lede className="mt-7">
            If it speaks MCP, it can drive the phone. One gateway, one authenticated device list, any agent you
            already use.
          </Lede>
          <Reveal delay={0.1}>
            <button
              onClick={copy}
              className="mono group mt-10 flex w-full max-w-[620px] items-start gap-3 rounded-xl border border-white/[0.09] bg-[#0a0a0c] px-4 py-3.5 text-left text-[12px] leading-relaxed text-dim transition-colors hover:border-violet/30"
            >
              <span className="text-violet">$</span>
              <span className="min-w-0 flex-1 break-all">{cmd}</span>
              <span className={cn("shrink-0 text-[10px] transition-colors", copied ? "text-green" : "text-dimmer group-hover:text-dim")}>
                {copied ? "copied" : "copy"}
              </span>
            </button>
          </Reveal>
          <p className="mono mt-3 text-[10.5px] text-dimmer">
            one command · no clone, no local server · gateway {LINKS.gateway.replace("https://", "")}
          </p>
        </div>

        <div className="flex flex-col justify-center">
          {CLIENTS.map((c, i) => (
            <ClientRow key={c} label={c} delay={i * 0.07} />
          ))}
          <div className="mt-10 flex items-center gap-4">
            <span className="mono text-[11px] tracking-[0.2em] text-dimmer">ONE MCP INTERFACE</span>
            <span className="h-px flex-1 bg-gradient-to-r from-violet/50 to-green/50" />
            <span className="mono text-[11px] tracking-[0.2em] text-green">ANDROID</span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ClientRow({ label, delay }: { label: string; delay: number }) {
  const { ref, shown } = useRevealed<HTMLDivElement>(0.95);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-white/[0.07] py-4 last:border-b"
    >
      <span className="display text-[clamp(1.5rem,3.4vw,2.6rem)] text-soft/85 transition-colors hover:text-soft">
        {label}
      </span>
    </motion.div>
  );
}
