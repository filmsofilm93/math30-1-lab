// Rational functions built from linear factors: holes, asymptotes, intercepts, domain and range.
import { ALL, except, iv, type RealSet } from './check/realset';
import { F, Frac, polyTex } from './frac';
import type { GraphSpec } from './types';

/** Linear factor p·x − q (p > 0), zero at q/p. */
export type Lin = { p: number; q: number };
export const L = (q: number, p = 1): Lin => ({ p, q });

/** f(x) = k · ∏num / ∏den. */
export interface RatFn {
  k: number;
  num: Lin[];
  den: Lin[];
}

export const zeroOf = (f: Lin) => F(f.q, f.p);

/** (x − 3), (2x + 1), x */
export function linTex(f: Lin, bare = false): string {
  const core = polyTex([f.p, -f.q]);
  if (f.q === 0 && f.p === 1) return 'x';
  return bare ? core : `\\left(${core}\\right)`;
}

/** Coefficients (highest power first) of ∏ factors. */
export function expand(fs: Lin[], k = 1): number[] {
  return fs.reduce<number[]>((acc, f) => {
    const out = Array(acc.length + 1).fill(0);
    acc.forEach((c, i) => {
      out[i] += c * f.p;
      out[i + 1] -= c * f.q;
    });
    return out;
  }, [k]);
}

function productTex(k: number, fs: Lin[]): string {
  if (!fs.length) return String(k);
  if (fs.length === 1 && k === 1) return linTex(fs[0], true);
  const parts: string[] = [];
  const seen: Lin[] = [];
  for (const f of fs) {
    if (seen.some((s) => s.p === f.p && s.q === f.q)) continue;
    seen.push(f);
    const n = fs.filter((g) => g.p === f.p && g.q === f.q).length;
    parts.push(n > 1 ? `${linTex(f)}^{${n}}` : linTex(f));
  }
  const body = parts.join('');
  return `${k === 1 ? '' : k === -1 ? '-' : k}${body}`;
}

/** LaTeX of the function: factored, or numerator/denominator expanded. */
export function ratTex(r: RatFn, form: 'factored' | 'expanded' = 'factored'): string {
  if (form === 'expanded') {
    const n = polyTex(expand(r.num, r.k));
    if (!r.den.length) return n;
    return `\\frac{${n}}{${polyTex(expand(r.den))}}`;
  }
  const n = productTex(r.k, r.num);
  if (!r.den.length) return n;
  return `\\frac{${n}}{${productTex(1, r.den)}}`;
}

export interface Analysis {
  simplified: RatFn;
  holes: { x: Frac; y: Frac }[];
  vas: Frac[];
  xints: Frac[];
  yint: Frac | null;
  /** Horizontal asymptote y = value, or null (no horizontal asymptote). */
  ha: Frac | null;
  domain: RealSet;
  /** Range, when it has a clean closed form here; null otherwise. */
  range: RealSet | null;
  f: (x: number) => number;
  s: (x: number) => number;
}

/** Exact value of k·∏num/∏den at x (null where a denominator is zero). */
export function evalExact(r: RatFn, x: Frac): Frac | null {
  let v = F(r.k);
  for (const f of r.num) v = v.mul(x.mul(f.p).sub(f.q));
  for (const f of r.den) {
    const d = x.mul(f.p).sub(f.q);
    if (d.n === 0) return null;
    v = v.div(d);
  }
  return v;
}

export const evalNum = (r: RatFn) => (x: number) => r.num.reduce((a, f) => a * (f.p * x - f.q), r.k) / r.den.reduce((a, f) => a * (f.p * x - f.q), 1);

const uniq = (xs: Frac[]) => xs.filter((x, i) => xs.findIndex((y) => y.eq(x)) === i).sort((a, b) => a.value - b.value);

export function analyze(r: RatFn): Analysis {
  const num = [...r.num];
  const den: Lin[] = [];
  const holeXs: Frac[] = [];
  for (const d of r.den) {
    const i = num.findIndex((n) => n.p === d.p && n.q === d.q);
    if (i >= 0) {
      num.splice(i, 1);
      holeXs.push(zeroOf(d));
    } else den.push(d);
  }
  // A cancelled zero that still sits in the denominator is an asymptote, not a hole.
  const vas = uniq(den.map(zeroOf));
  const holes0 = uniq(holeXs).filter((h) => !vas.some((v) => v.eq(h)));
  const simplified: RatFn = { k: r.k, num, den };
  const holes = holes0.map((x) => ({ x, y: evalExact(simplified, x)! }));
  const excluded = [...vas, ...holes0];
  const xints = uniq(num.map(zeroOf)).filter((x) => !excluded.some((e) => e.eq(x)));
  const yint = excluded.some((e) => e.n === 0) ? null : evalExact(simplified, F(0));
  const lead = (fs: Lin[]) => fs.reduce((a, f) => a * f.p, 1);
  const ha = num.length < den.length ? F(0) : num.length === den.length ? F(r.k * lead(num), lead(den)) : null;
  const domain = except(ALL, excluded.map((e) => e.value));
  const holeYs = holes.map((h) => h.y.value);
  let range: RealSet | null = null;
  if (den.length === 1 && num.length <= 1 && ha) range = except(ALL, [ha.value, ...holeYs]);
  else if (den.length === 0 && num.length === 1) range = except(ALL, holeYs);
  else if (num.length === 0 && den.length === 2 && den[0].p === den[1].p && den[0].q === den[1].q) {
    const half = r.k > 0 ? [iv(0, Infinity, false)] : [iv(-Infinity, 0, false, false)];
    range = except(half, holeYs);
  }
  const s = evalNum(simplified);
  const f = (x: number) => (excluded.some((e) => Math.abs(e.value - x) < 1e-12) ? NaN : s(x));
  return { simplified, holes, vas, xints, yint, ha, domain, range, f, s };
}

/** Graph with asymptotes dashed, holes as open circles, intercepts marked. */
export function ratGraph(r: RatFn, a = analyze(r)): GraphSpec {
  const xs = [...a.vas, ...a.holes.map((h) => h.x), ...a.xints].map((v) => v.value);
  const lo = Math.floor(Math.min(-4, ...xs) - 3);
  const hi = Math.ceil(Math.max(4, ...xs) + 3);
  const ys = [0, ...(a.ha ? [a.ha.value] : []), ...a.holes.map((h) => h.y.value), ...(a.yint ? [a.yint.value] : [])];
  const ylo = Math.floor(Math.min(-4, ...ys) - 3);
  const yhi = Math.ceil(Math.max(4, ...ys) + 3);
  return {
    view: { x: [lo, hi], y: [ylo, yhi] },
    curves: [{ fn: a.s, role: 'image', breaks: a.vas.map((v) => v.value) }],
    vlines: a.vas.map((v) => ({ x: v.value, dashed: true })),
    hlines: a.ha ? [{ y: a.ha.value, dashed: true }] : [],
    points: [
      ...a.holes.map((h) => ({ x: h.x.value, y: h.y.value, kind: 'open' as const })),
      ...a.xints.map((x) => ({ x: x.value, y: 0, kind: 'key' as const })),
      ...(a.yint && !a.xints.some((x) => x.n === 0) ? [{ x: 0, y: a.yint.value, kind: 'key' as const }] : []),
    ],
  };
}
