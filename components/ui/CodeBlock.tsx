import { highlightLines, type Lang } from "@/lib/shiki";
import { CodeLines } from "./CodeLines";

/**
 * Server-rendered, Shiki-highlighted code. Each line is its own element so a
 * client parent can highlight lines in sync with the phone (see CodeSync).
 */
export default async function CodeBlock({
  code,
  lang = "typescript",
  activeLine,
  className,
}: {
  code: string;
  lang?: Lang;
  /** Synchronized active line index (0-based) — omit for static blocks. */
  activeLine?: number;
  className?: string;
}) {
  const lines = await highlightLines(code, lang);
  return <CodeLines lines={lines} activeLine={activeLine} className={className} />;
}
