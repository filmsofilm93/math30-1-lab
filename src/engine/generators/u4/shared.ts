// Angle and exact-value helpers for Unit 4 (trigonometry). Angles are carried in whole degrees.
import { F } from '../../frac';

export const PI = Math.PI;
export const rad = (deg: number) => (deg * PI) / 180;

/** Exact radian tex for a whole-degree angle: 150 → \frac{5\pi}{6}. */
export function radTex(deg: number): string {
  if (deg === 0) return '0';
  const f = F(deg, 180);
  const n = Math.abs(f.n);
  const sign = f.n < 0 ? '-' : '';
  if (f.d === 1) return `${sign}${n === 1 ? '' : n}\\pi`;
  return `${sign}\\frac{${n === 1 ? '' : n}\\pi}{${f.d}}`;
}

/** Plain-text radian label for a whole-degree angle: 135 → 3π/4 (for graph labels, not tex). */
export function piLabel(deg: number): string {
  if (deg === 0) return '0';
  const f = F(deg, 180);
  const n = f.n === 1 ? '' : f.n === -1 ? '−' : String(f.n).replace('-', '−');
  return `${n}π${f.d === 1 ? '' : `/${f.d}`}`;
}

export const degTex = (d: number) => `${d}^\\circ`;
export const angTex = (d: number, inRad: boolean) => (inRad ? radTex(d) : degTex(d));

/** Normalise to [0, 360). */
export const norm = (d: number) => ((d % 360) + 360) % 360;

export const quadrant = (d: number): 0 | 1 | 2 | 3 | 4 => {
  const a = norm(d);
  if (a % 90 === 0) return 0;
  return (Math.floor(a / 90) + 1) as 1 | 2 | 3 | 4;
};

/** Reference angle in degrees (0–90). */
export function refAngle(d: number): number {
  const a = norm(d);
  if (a <= 90) return a;
  if (a <= 180) return 180 - a;
  if (a <= 270) return a - 180;
  return 360 - a;
}

export type Fn = 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot';
export type Exact = { tex: string; value: number };

const SIN_REF: Record<number, Exact> = {
  0: { tex: '0', value: 0 },
  30: { tex: '\\frac{1}{2}', value: 0.5 },
  45: { tex: '\\frac{\\sqrt{2}}{2}', value: Math.SQRT1_2 },
  60: { tex: '\\frac{\\sqrt{3}}{2}', value: Math.sqrt(3) / 2 },
  90: { tex: '1', value: 1 },
};
const TAN_REF: Record<number, Exact | null> = {
  0: { tex: '0', value: 0 },
  30: { tex: '\\frac{\\sqrt{3}}{3}', value: Math.sqrt(3) / 3 },
  45: { tex: '1', value: 1 },
  60: { tex: '\\sqrt{3}', value: Math.sqrt(3) },
  90: null,
};
const RECIP: Record<string, Exact> = {
  '1': { tex: '1', value: 1 },
  '\\frac{1}{2}': { tex: '2', value: 2 },
  '\\frac{\\sqrt{2}}{2}': { tex: '\\sqrt{2}', value: Math.SQRT2 },
  '\\frac{\\sqrt{3}}{2}': { tex: '\\frac{2\\sqrt{3}}{3}', value: 2 / Math.sqrt(3) },
  '\\frac{\\sqrt{3}}{3}': { tex: '\\sqrt{3}', value: Math.sqrt(3) },
  '\\sqrt{3}': { tex: '\\frac{\\sqrt{3}}{3}', value: Math.sqrt(3) / 3 },
};

export const isSpecial = (d: number) => norm(d) % 30 === 0 || norm(d) % 45 === 0;

const neg = (e: Exact): Exact => (e.value === 0 ? e : { tex: `-${e.tex}`, value: -e.value });

/** Exact value of fn at a special angle (multiple of 30° or 45°); null when undefined. */
export function exact(fn: Fn, d: number): Exact | null {
  const a = norm(d);
  const r = refAngle(a);
  const s = Math.sign(Math.round(Math.sin(rad(a)) * 1e9)) || 0;
  const c = Math.sign(Math.round(Math.cos(rad(a)) * 1e9)) || 0;
  const sinE = s < 0 ? neg(SIN_REF[r]) : SIN_REF[r];
  const cosE = c < 0 ? neg(SIN_REF[90 - r]) : SIN_REF[90 - r];
  const tanBase = TAN_REF[r];
  const tanE = tanBase === null ? null : s * c < 0 ? neg(tanBase) : tanBase;
  const recip = (e: Exact | null): Exact | null => {
    if (!e || e.value === 0) return null;
    const m = e.tex.startsWith('-') ? e.tex.slice(1) : e.tex;
    const out = RECIP[m];
    return e.value < 0 ? neg(out) : out;
  };
  switch (fn) {
    case 'sin':
      return sinE;
    case 'cos':
      return cosE;
    case 'tan':
      return tanE;
    case 'csc':
      return recip(sinE);
    case 'sec':
      return recip(cosE);
    case 'cot':
      return tanE === null ? { tex: '0', value: 0 } : recip(tanE);
  }
}

export const FN_VALUE: Record<Fn, (x: number) => number> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  csc: (x) => 1 / Math.sin(x),
  sec: (x) => 1 / Math.cos(x),
  cot: (x) => Math.cos(x) / Math.sin(x),
};

/** Special angles in [0, 360). */
export const SPECIAL = Array.from({ length: 360 }, (_, i) => i).filter(isSpecial);
export const SPECIAL_NONAXIS = SPECIAL.filter((d) => d % 90 !== 0);

/** Comma list of angles in tex. */
export const listTex = (ds: number[], inRad: boolean) => (ds.length ? [...ds].sort((a, b) => a - b).map((d) => angTex(d, inRad)).join(', ') : '\\varnothing');

/** Angle set answer, exact radians or degrees. */
export const angleSet = (ds: number[], inRad: boolean) => ({
  kind: 'set' as const,
  values: [...ds].sort((a, b) => a - b).map((d) => (inRad ? rad(d) : d)),
  tex: listTex(ds, inRad),
  exact: inRad,
  deg: !inRad,
});

/** All θ in [lo, hi) (degrees) with fn(θ) equal to the exact value v. */
export function solveSpecial(fn: Fn, v: number, lo = 0, hi = 360): number[] {
  const out: number[] = [];
  for (let d = lo; d < hi; d++) {
    if (!isSpecial(d)) continue;
    const e = exact(fn, d);
    if (e && Math.abs(e.value - v) < 1e-9) out.push(d);
  }
  return out;
}

/** "the quadrants where fn is positive" per CAST. */
export const CAST: Record<'sin' | 'cos' | 'tan', [number, number]> = { sin: [1, 2], cos: [1, 4], tan: [1, 3] };

export const QNAME = ['', 'I', 'II', 'III', 'IV'];
