import type { DemoTask } from "./types";

/** A step resolved onto the master timeline (seconds). */
export type StepSpan = { step: import("./types").Step; start: number; end: number };

/**
 * Resolve a task's weighted steps onto a master timeline of `totalSeconds`.
 * Step `duration` values are relative weights, not seconds — this keeps tasks
 * speed-adjustable per section (hero 26s, pinned phases slower/faster).
 */
export function buildSpans(task: DemoTask, totalSeconds: number): StepSpan[] {
  const totalWeight = task.steps.reduce((s, st) => s + st.duration, 0) || 1;
  let cursor = 0;
  return task.steps.map((step) => {
    const dur = (step.duration / totalWeight) * totalSeconds;
    const span = { step, start: cursor, end: cursor + dur };
    cursor += dur;
    return span;
  });
}

export function activeStep(spans: StepSpan[], t: number): StepSpan | null {
  for (const s of spans) if (t >= s.start && t < s.end) return s;
  return spans.length ? spans[spans.length - 1] : null;
}

/** 0..1 progress within the active step (for phase rails, captions, etc.). */
export function stepProgress(spans: StepSpan[], t: number): { span: StepSpan; p: number } | null {
  const span = activeStep(spans, t);
  if (!span) return null;
  return { span, p: clamp01((t - span.start) / (span.end - span.start)) };
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/** Normalized progress of t across the whole timeline. */
export function taskProgress(spans: StepSpan[], t: number): number {
  if (!spans.length) return 0;
  const total = spans[spans.length - 1].end;
  return clamp01(t / total);
}
