export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Remap v from [a,b] to [0,1], clamped. */
export const remap = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

/** Remap v from [a,b] to [c,d], clamped. */
export const remapTo = (v: number, a: number, b: number, c: number, d: number) =>
  lerp(c, d, remap(v, a, b));

/** 0 → 1 → 0 window centered at `center` with half-width `w` (linear). */
export const pulse = (v: number, center: number, w: number) =>
  clamp(1 - Math.abs(v - center) / w);

/** Smoothstep easing on a 0..1 value. */
export const smooth = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

/** Eased in-out window: fades in over [a, a+r], holds, fades out over [b-r, b]. */
export const window = (v: number, a: number, b: number, r = 0.12) =>
  smooth(remap(v, a, a + r)) * (1 - smooth(remap(v, b - r, b)));

/** Deterministic pseudo-noise in [-1, 1] — SSR-safe, no Math.random at render. */
export const noise = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
