import type { Metadata, Viewport } from "next";
import { inter, interTight, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "android-mcp — Give AI hands",
  description:
    "Open-source MCP infrastructure for controlling real Android devices. Your AI decides; the phone executes.",
  metadataBase: new URL("https://andriod-mcp.dev"),
  openGraph: {
    title: "android-mcp — Give AI hands",
    description:
      "Open-source MCP infrastructure for controlling real Android devices. Your AI decides; the phone executes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div className="grain" aria-hidden />
        <div className="vignette" aria-hidden />
        {children}
      </body>
    </html>
  );
}
