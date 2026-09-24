"use client";

import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";
import { LINKS } from "@/lib/links";

const STORAGE_KEY = "android-mcp-downloads";
const INITIAL_DOWNLOADS = 73;
const DOWNLOAD_EVENT = "android-mcp-download";

type DownloadLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
  showCount?: boolean;
};

export default function DownloadLink({ children, showCount = false, ...props }: DownloadLinkProps) {
  const [downloads, setDownloads] = useState(INITIAL_DOWNLOADS);

  useEffect(() => {
    const stored = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "", 10);
    if (Number.isFinite(stored) && stored >= INITIAL_DOWNLOADS) setDownloads(stored);

    const sync = () => {
      const current = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "", 10);
      if (Number.isFinite(current) && current >= INITIAL_DOWNLOADS) setDownloads(current);
    };
    window.addEventListener(DOWNLOAD_EVENT, sync);
    return () => window.removeEventListener(DOWNLOAD_EVENT, sync);
  }, []);

  const handleClick = () => {
    const next = downloads + 1;
    window.localStorage.setItem(STORAGE_KEY, String(next));
    setDownloads(next);
    window.dispatchEvent(new Event(DOWNLOAD_EVENT));
  };

  return (
    <a {...props} href={LINKS.apkDownload} onClick={handleClick}>
      {children}
      {showCount && <span className="ml-2 text-[10px] text-dimmer">{downloads} downloads</span>}
    </a>
  );
}
