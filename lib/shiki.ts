import { createHighlighter, type Highlighter } from "shiki";

export type HighlightedLine = {
  /** Plain text of the line (used for matching / accessible fallbacks). */
  text: string;
  /** Inline-styled HTML for the line, without a wrapping element. */
  html: string;
};

export type Lang = "typescript" | "bash" | "json";

const THEME = "vesper"; // near-monochrome warm dark — fits the graphite system

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: ["typescript", "bash", "json"],
    });
  }
  return highlighterPromise;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Highlight code at build time and return it split per line.
 *
 * Uses `codeToTokens` rather than parsing highlighted HTML: token data is
 * stable across Shiki versions and gives each line independently, which is
 * what the synchronized code/phone section needs.
 */
export async function highlightLines(code: string, lang: Lang = "typescript"): Promise<HighlightedLine[]> {
  const highlighter = await getHighlighter();
  const { tokens } = highlighter.codeToTokens(code.trimEnd(), { lang, theme: THEME });

  return tokens.map((line) => ({
    text: line.map((t) => t.content).join(""),
    html: line
      .map((t) => {
        const content = escapeHtml(t.content);
        if (!content) return "";
        return t.color ? `<span style="color:${t.color}">${content}</span>` : content;
      })
      .join(""),
  }));
}
