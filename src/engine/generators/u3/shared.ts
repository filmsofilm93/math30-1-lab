import { F, Frac } from '../../frac';

/** log_b with a readable base subscript: \log_{2}, or \log for base 10. */
export const logB = (b: number | Frac) => (Frac.of(b).eq(10) ? '\\log' : `\\log_{${Frac.of(b).tex()}}`);

/** b^e as tex, with fractions in brackets. */
export function powTex(b: Frac | number, e: Frac | number | string): string {
  const B = Frac.of(b);
  const base = B.d === 1 && B.n >= 0 ? String(B.n) : `\\left(${B.tex()}\\right)`;
  return `${base}^{${typeof e === 'string' ? e : Frac.of(e).tex()}}`;
}

/** Bases with handy powers for exact logs. */
export const BASES = [2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

/** b^k as an exact Frac (k may be negative). */
export const powFrac = (b: number, k: number) => (k >= 0 ? F(b ** k) : F(1, b ** -k));

export const log = (b: number, x: number) => Math.log(x) / Math.log(b);

/** Round half away from zero to `places`. */
export const roundTo = (x: number, places: number) => Math.round(x * 10 ** places) / 10 ** places;

/** True if x sits within 0.02 of a rounding boundary at `places`, so a rounded answer would be unfair. */
export const nearBoundary = (x: number, places: number) => {
  const s = Math.abs(x) * 10 ** places;
  return Math.abs(s - Math.floor(s) - 0.5) < 0.02;
};

export const rounded = (v: number, places: 1 | 2) => ({ kind: 'number' as const, value: roundTo(v, places), tex: roundTo(v, places).toFixed(places), round: places === 1 ? ('tenth' as const) : ('hundredth' as const) });
