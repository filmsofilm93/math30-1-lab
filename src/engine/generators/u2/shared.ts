import { field } from '../../framework';
import { polyEval, polyTex } from '../../frac';
import type { AnswerSpec, GraphSpec } from '../../types';
import { mulP, type Poly } from '../pre/shared';

export type { Poly };

/** Synthetic division of p by (x − a): quotient, remainder and the middle row. */
export function synth(p: Poly, a: number) {
  const out: number[] = [];
  const mid: number[] = [0];
  let acc = 0;
  p.forEach((c, i) => {
    acc = c + (i ? mid[i] : 0);
    out.push(acc);
    if (i < p.length - 1) mid.push(acc * a);
  });
  return { q: out.slice(0, -1), r: out[out.length - 1], mid, bottom: out };
}

/** Coefficients of k·∏(x − r)^m. */
export function fromZeros(k: number, zeros: { r: number; m: number }[]): Poly {
  const fs: Poly[] = zeros.flatMap(({ r, m }) => Array(m).fill([1, -r]));
  return mulP([k], ...fs);
}

/** Factor list (as linear polys) for factoredTex. */
export const linFactors = (zeros: { r: number; m: number }[]): Poly[] => zeros.flatMap(({ r, m }) => Array(m).fill([1, -r]));

export const polyAns = (p: Poly): AnswerSpec => ({ kind: 'expr', tex: polyTex(p), variable: 'x', fn: polyEval(p), sample: [-3, 3], exact: true });

export const quotientField = (q: Poly) => field(polyAns(q), 'Q(x) =');

/** "P(x) = …" display with optional missing terms kept as given. */
export const P = (p: Poly, name = 'P') => `${name}(x) = ${polyTex(p)}`;

export const degree = (p: Poly) => p.length - 1;

/** Alberta-style end behaviour: "extends from quadrant III to quadrant I". */
export function endBehaviour(deg: number, lead: number): string {
  const right = lead > 0 ? 'I' : 'IV';
  const left = deg % 2 === 0 ? (lead > 0 ? 'II' : 'III') : lead > 0 ? 'III' : 'II';
  return `quadrant ${left} to quadrant ${right}`;
}
export const ALL_ENDS = ['quadrant III to quadrant I', 'quadrant II to quadrant IV', 'quadrant II to quadrant I', 'quadrant III to quadrant IV'];

/** Behaviour at a zero of multiplicity m. */
export const behaviour = (m: number) => (m === 1 ? 'crosses the $x$-axis (passes straight through)' : m === 2 ? 'touches the $x$-axis and turns back (bounces)' : 'crosses the $x$-axis and flattens out (point of inflection)');

/** View and curve for a polynomial: x-window from the zeros, y-window from sampling, clamped. */
export function polyGraph(p: Poly, zeros: number[], extraPoints: GraphSpec['points'] = []): GraphSpec {
  const f = polyEval(p);
  const xlo = Math.min(-2, ...zeros) - 1.5;
  const xhi = Math.max(2, ...zeros) + 1.5;
  let lo = 0;
  let hi = 0;
  for (let x = xlo; x <= xhi; x += (xhi - xlo) / 200) {
    const y = f(x);
    lo = Math.min(lo, y);
    hi = Math.max(hi, y);
  }
  const ylo = Math.max(lo, -40);
  const yhi = Math.min(hi, 40);
  const pad = Math.max(1, (yhi - ylo) * 0.1);
  return {
    view: { x: [Math.floor(xlo), Math.ceil(xhi)], y: [Math.floor(ylo - pad), Math.ceil(yhi + pad)] },
    curves: [{ fn: f, role: 'image' }],
    points: [...zeros.map((z) => ({ x: z, y: 0, kind: 'key' as const })), ...extraPoints],
  };
}

/** Distinct non-zero integer zeros in [lo, hi]. */
export function distinctZeros(rng: { int: (a: number, b: number) => number }, n: number, lo = -5, hi = 5): number[] {
  const out: number[] = [];
  while (out.length < n) {
    const z = rng.int(lo, hi);
    if (!out.includes(z)) out.push(z);
  }
  return out;
}

/** Divisors of |n| (n ≠ 0), positive. */
export function divisors(n: number): number[] {
  const a = Math.abs(n);
  const out: number[] = [];
  for (let d = 1; d <= a; d++) if (a % d === 0) out.push(d);
  return out;
}

/** Bisection root on [a, b] where f changes sign. */
export function bisect(f: (x: number) => number, a: number, b: number): number {
  let fa = f(a);
  for (let i = 0; i < 100; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (fa * fm <= 0) b = m;
    else {
      a = m;
      fa = fm;
    }
  }
  return (a + b) / 2;
}

/** Local extremum of f on [a, b] by golden-section search (max if sign = 1). */
export function extremum(f: (x: number) => number, a: number, b: number, sign: 1 | -1): number {
  const g = (x: number) => -sign * f(x);
  const phi = (Math.sqrt(5) - 1) / 2;
  let c = b - phi * (b - a);
  let d = a + phi * (b - a);
  for (let i = 0; i < 200; i++) {
    if (g(c) < g(d)) b = d;
    else a = c;
    c = b - phi * (b - a);
    d = a + phi * (b - a);
  }
  return (a + b) / 2;
}

/** True when x·10^places sits too close to a rounding boundary for a fair rounded answer. */
export const nearBoundary = (x: number, places: number) => {
  const s = Math.abs(x) * 10 ** places;
  return Math.abs(s - Math.floor(s) - 0.5) < 0.02;
};

export const round = (x: number, places: number) => Math.round(x * 10 ** places) / 10 ** places;

export const coeffRow = (p: Poly) => p.join(',\\ ');
