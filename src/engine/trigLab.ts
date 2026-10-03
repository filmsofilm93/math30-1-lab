// Pure helpers for the Unit 4 explorers: unit circle, sinusoid lab, trig-equation visualizer.
import { exact, isSpecial, norm, radTex, refAngle } from './generators/u4/shared';

const D2R = Math.PI / 180;

/** Angle label: exact radians for multiples of 15°, otherwise a decimal. */
export function angleLabel(deg: number, inRad: boolean, places = inRad ? 2 : 1): string {
  if (!inRad) return Number.isInteger(deg) ? `${deg}^\\circ` : `${deg.toFixed(places)}^\\circ`;
  if (Number.isInteger(deg) && deg % 15 === 0) return radTex(deg);
  return (deg * D2R).toFixed(places);
}

export type Coord = { tex: string; value: number };

/** P(θ) = (cos θ, sin θ), exact at special angles. */
export function unitPoint(deg: number): { x: Coord; y: Coord; exact: boolean } {
  const d = Math.round(deg);
  if (Math.abs(deg - d) < 1e-9 && isSpecial(d)) {
    return { x: exact('cos', d)!, y: exact('sin', d)!, exact: true };
  }
  const x = Math.cos(deg * D2R);
  const y = Math.sin(deg * D2R);
  return { x: { tex: x.toFixed(3), value: x }, y: { tex: y.toFixed(3), value: y }, exact: false };
}

/** Quadrant (1–4) or 0 on an axis, and the CAST letter for the positive ratio. */
export function castInfo(deg: number): { q: 0 | 1 | 2 | 3 | 4; positive: string } {
  const a = norm(deg);
  if (a % 90 === 0) return { q: 0, positive: 'on an axis' };
  const q = (Math.floor(a / 90) + 1) as 1 | 2 | 3 | 4;
  return { q, positive: ['', 'all ratios', 'sine (and csc)', 'tangent (and cot)', 'cosine (and sec)'][q] };
}

export { refAngle };

export const coterminals = (deg: number, n = 2) => Array.from({ length: 2 * n + 1 }, (_, i) => deg + 360 * (i - n));

export type SinParams = { f: 'sin' | 'cos'; a: number; b: number; c: number; d: number };

/** y = a·f[b(x − c)] + d with x and c in degrees. */
export const sinValue = (p: SinParams, xDeg: number) => p.a * (p.f === 'sin' ? Math.sin : Math.cos)(p.b * (xDeg - p.c) * D2R) + p.d;

/** Same graph (any equivalent parameters), compared at many points. */
export function sameCurve(p: SinParams, q: SinParams): boolean {
  for (let i = 0; i <= 60; i++) {
    const x = -720 + i * 24 + 0.37;
    if (Math.abs(sinValue(p, x) - sinValue(q, x)) > 1e-6) return false;
  }
  return true;
}

export const A_VALUES = [-5, -4, -3, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 3, 4, 5];
export const B_VALUES = [1 / 3, 1 / 2, 2 / 3, 1, 3 / 2, 2, 3, 4];
export const C_VALUES = Array.from({ length: 25 }, (_, i) => -180 + 15 * i);
export const D_VALUES = Array.from({ length: 13 }, (_, i) => -6 + i);

/** A random "match this graph" target drawn from the slider values (no trivial a = 1, c = 0, d = 0). */
export function matchTarget(rand: () => number, f: 'sin' | 'cos' = rand() < 0.5 ? 'sin' : 'cos'): SinParams {
  const pick = <T>(xs: T[]) => xs[Math.floor(rand() * xs.length)];
  for (;;) {
    const p: SinParams = { f, a: pick(A_VALUES.filter((v) => Number.isInteger(v))), b: pick(B_VALUES), c: pick(C_VALUES.filter((v) => v % 30 === 0)), d: pick(D_VALUES.filter((v) => Math.abs(v) <= 4)) };
    if (Math.abs(p.a) !== 1 && (p.c !== 0 || p.d !== 0)) return p;
  }
}

export type Fn3 = 'sin' | 'cos' | 'tan';
const F3: Record<Fn3, (r: number) => number> = { sin: Math.sin, cos: Math.cos, tan: Math.tan };

/** Solutions of fn x = k on [lo, hi) (or [lo, hi] when hiIn), in degrees, sorted. Exact when k is a special value. */
export function solveFn(fn: Fn3, k: number, lo: number, hi: number, hiIn = false): { xs: number[]; exact: boolean } {
  const inRange = (x: number) => x >= lo - 1e-9 && (hiIn ? x <= hi + 1e-9 : x < hi - 1e-9);
  // Exact: special angles where fn equals k.
  const special: number[] = [];
  for (let d = Math.ceil(lo / 15) * 15; d <= hi; d += 15) {
    if (!inRange(d) || !isSpecial(d)) continue;
    const e = exact(fn, d);
    if (e && Math.abs(e.value - k) < 1e-9) special.push(d);
  }
  if (special.length) return { xs: special, exact: true };
  if (fn !== 'tan' && Math.abs(k) > 1) return { xs: [], exact: true };
  const base = fn === 'sin' ? Math.asin(k) / D2R : fn === 'cos' ? Math.acos(k) / D2R : Math.atan(k) / D2R;
  const seeds = fn === 'sin' ? [base, 180 - base] : fn === 'cos' ? [base, -base] : [base];
  const P = fn === 'tan' ? 180 : 360;
  const out: number[] = [];
  for (const s of seeds) for (let n = Math.floor((lo - s) / P) - 1; n <= Math.ceil((hi - s) / P) + 1; n++) {
    const x = s + P * n;
    if (inRange(x) && !out.some((y) => Math.abs(y - x) < 1e-7)) out.push(x);
  }
  return { xs: out.sort((a, b) => a - b), exact: false };
}

/** General solution: roots in one period and the period, collapsed when two roots sit half a period apart. */
export function generalSolution(fn: Fn3, k: number): { roots: number[]; period: number; exact: boolean } | null {
  const P = fn === 'tan' ? 180 : 360;
  const { xs, exact: ex } = solveFn(fn, k, 0, P);
  if (!xs.length) return null;
  if (xs.length === 2 && Math.abs(xs[1] - xs[0] - P / 2) < 1e-7) return { roots: [xs[0]], period: P / 2, exact: ex };
  return { roots: xs, period: P, exact: ex };
}

export const evalFn3 = (fn: Fn3, deg: number) => F3[fn](deg * D2R);
