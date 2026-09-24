import { LINKS } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-void px-5 py-12 md:px-9">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="mono flex items-center gap-2.5 text-[12px] text-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          android-mcp
          <span className="text-dimmer">— the Android execution layer for AI agents</span>
        </div>

        <div className="mono flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px]">
          <a className="text-dim transition-colors hover:text-soft" href={LINKS.repo} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="text-dim transition-colors hover:text-soft" href={LINKS.docs} target="_blank" rel="noreferrer">
            Docs
          </a>
          <a className="text-dim transition-colors hover:text-soft" href={LINKS.releases} target="_blank" rel="noreferrer">
            Releases
          </a>
          <a className="text-dim transition-colors hover:text-soft" href={LINKS.issues} target="_blank" rel="noreferrer">
            Issues
          </a>
          <span className="text-dimmer">{LINKS.gateway.replace("https://", "")}</span>
        </div>
      </div>
    </footer>
  );
}
