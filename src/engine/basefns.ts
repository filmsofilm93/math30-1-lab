import { coefTex, F, Frac, shiftTex, signedTex } from './frac';

export interface BaseFn {
  id: string;
  name: string; // LaTeX of y = f(x)
  /** LaTeX of f applied to an argument already in LaTeX. */
  apply: (arg: string, simpleArg: boolean) => string;
  f: (x: number) => number;
  /** Key points with exact coordinates, used for mapping questions. */
  keys: [number, number][];
  domain: [number, number, boolean, boolean]; // lo, hi, loIn, hiIn
  range: [number, number, boolean, boolean];
  vAsym?: number[];
  hAsym?: number[];
  trig?: boolean;
}

const wrap = (arg: string, simple: boolean) => (simple ? arg : `\\left(${arg}\\right)`);

export const BASE: Record<string, BaseFn> = {
  linear: { id: 'linear', name: 'y = x', apply: (a) => a, f: (x) => x, keys: [[-2, -2], [0, 0], [2, 2]], domain: [-Infinity, Infinity, false, false], range: [-Infinity, Infinity, false, false] },
  quad: { id: 'quad', name: 'y = x^2', apply: (a, s) => `${wrap(a, s)}^2`, f: (x) => x * x, keys: [[-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4]], domain: [-Infinity, Infinity, false, false], range: [0, Infinity, true, false] },
  cubic: { id: 'cubic', name: 'y = x^3', apply: (a, s) => `${wrap(a, s)}^3`, f: (x) => x ** 3, keys: [[-2, -8], [-1, -1], [0, 0], [1, 1], [2, 8]], domain: [-Infinity, Infinity, false, false], range: [-Infinity, Infinity, false, false] },
  sqrt: { id: 'sqrt', name: 'y = \\sqrt{x}', apply: (a) => `\\sqrt{${a}}`, f: (x) => (x >= 0 ? Math.sqrt(x) : NaN), keys: [[0, 0], [1, 1], [4, 2], [9, 3]], domain: [0, Infinity, true, false], range: [0, Infinity, true, false] },
  recip: { id: 'recip', name: 'y = \\frac{1}{x}', apply: (a) => `\\frac{1}{${a}}`, f: (x) => 1 / x, keys: [[-2, -0.5], [-1, -1], [1, 1], [2, 0.5]], domain: [-Infinity, Infinity, false, false], range: [-Infinity, Infinity, false, false], vAsym: [0], hAsym: [0] },
  abs: { id: 'abs', name: 'y = |x|', apply: (a) => `\\left|${a}\\right|`, f: Math.abs, keys: [[-2, 2], [-1, 1], [0, 0], [1, 1], [2, 2]], domain: [-Infinity, Infinity, false, false], range: [0, Infinity, true, false] },
  exp2: { id: 'exp2', name: 'y = 2^x', apply: (a) => `2^{${a}}`, f: (x) => 2 ** x, keys: [[-1, 0.5], [0, 1], [1, 2], [2, 4]], domain: [-Infinity, Infinity, false, false], range: [0, Infinity, false, false], hAsym: [0] },
  log: { id: 'log', name: 'y = \\log x', apply: (a) => (a === 'x' ? '\\log x' : `\\log\\left(${a}\\right)`), f: (x) => (x > 0 ? Math.log10(x) : NaN), keys: [[0.1, -1], [1, 0], [10, 1]], domain: [0, Infinity, false, false], range: [-Infinity, Infinity, false, false], vAsym: [0] },
  sin: { id: 'sin', name: 'y = \\sin x', apply: (a) => (a === 'x' ? '\\sin x' : `\\sin\\left(${a}\\right)`), f: Math.sin, keys: [[0, 0], [Math.PI / 2, 1], [Math.PI, 0], [(3 * Math.PI) / 2, -1]], domain: [-Infinity, Infinity, false, false], range: [-1, 1, true, true], trig: true },
  cos: { id: 'cos', name: 'y = \\cos x', apply: (a) => (a === 'x' ? '\\cos x' : `\\cos\\left(${a}\\right)`), f: Math.cos, keys: [[0, 1], [Math.PI / 2, 0], [Math.PI, -1], [(3 * Math.PI) / 2, 0]], domain: [-Infinity, Infinity, false, false], range: [-1, 1, true, true], trig: true },
};

/** Base functions used by U1 item generators (clean key points, no trig/log decimals). */
export const ITEM_BASES = ['quad', 'sqrt', 'abs', 'cubic', 'recip'] as const;

export interface TParams {
  a: Frac;
  b: Frac;
  h: Frac;
  k: Frac;
}

export const TP = (a: Frac | number, b: Frac | number, h: Frac | number, k: Frac | number): TParams => ({
  a: Frac.of(a),
  b: Frac.of(b),
  h: Frac.of(h),
  k: Frac.of(k),
});

/** Argument LaTeX for b(x − h): "x-3", "2(x-3)", "-x", "\frac{1}{2}x", "-(x+1)" */
export function argTex(b: Frac, h: Frac): { tex: string; simple: boolean } {
  const inner = shiftTex(h);
  if (b.eq(1)) return { tex: inner, simple: h.n === 0 };
  if (h.n === 0) return { tex: `${coefTex(b)}x`, simple: false };
  return { tex: `${coefTex(b)}\\left(${inner}\\right)`, simple: false };
}

/** LaTeX for y = a f(b(x − h)) + k with f a base function. */
export function transformedTex(base: BaseFn, p: TParams): string {
  const { tex, simple } = argTex(p.b, p.h);
  const core = base.apply(tex, simple);
  return `${coefTex(p.a)}${core}${signedTex(p.k)}`;
}

/** LaTeX for y = a f(b(x − h)) + k written with f itself. */
export function transformedFTex(p: TParams, fname = 'f'): string {
  const { tex } = argTex(p.b, p.h);
  return `${coefTex(p.a)}${fname}\\left(${tex}\\right)${signedTex(p.k)}`;
}

export function evalTransformed(base: BaseFn, p: TParams): (x: number) => number {
  return (x) => p.a.value * base.f(p.b.value * (x - p.h.value)) + p.k.value;
}

/** Image of (x, y) under the mapping (x, y) → (x/b + h, ay + k). */
export function mapPoint(x: Frac | number, y: Frac | number, p: TParams): [Frac, Frac] {
  return [Frac.of(x).div(p.b).add(p.h), Frac.of(y).mul(p.a).add(p.k)];
}

/** LaTeX for the mapping rule (x, y) → (x/b + h, ay + k). */
export function mappingTex(p: TParams): string {
  const xs = p.b.eq(1) ? 'x' : p.b.eq(-1) ? '-x' : `${coefTex(p.b.inv())}x`;
  const ys = `${coefTex(p.a)}y`;
  return `(x, y) \\to \\left(${xs}${signedTex(p.h)}, ${ys}${signedTex(p.k)}\\right)`;
}

export const keyFrac = (k: [number, number]): [Frac, Frac] => [toFrac(k[0]), toFrac(k[1])];
export function toFrac(x: number): Frac {
  for (let d = 1; d <= 12; d++) if (Math.abs(Math.round(x * d) - x * d) < 1e-9) return F(Math.round(x * d), d);
  throw new Error(`not a simple fraction: ${x}`);
}
