// Trig identity engine: evaluate expressions, find non-permissible values, check proof steps.
import { ce, tidy } from './check/ce';

type Json = number | string | Json[];

/** Raw MathJSON (no canonicalisation), with θ read as x. */
function parseRaw(tex: string): Json | null {
  const t = tidy(tex)
    .replace(/\\theta/g, ' x ')
    .replace(/\\cdot|\\times/g, ' ')
    .replace(/(\\sqrt)\[([^\]]*)\]/g, '$1{{$2}}')
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/(\\sqrt)\{\{([^}]*)\}\}/g, '$1[$2]');
  if (!t) return null;
  try {
    const j = ce().parse(t, { form: 'raw' } as never).json as Json;
    return j;
  } catch {
    return null;
  }
}

const TRIG: Record<string, (v: number) => number> = {
  Sin: Math.sin,
  Cos: Math.cos,
  Tan: Math.tan,
  Csc: (v) => 1 / Math.sin(v),
  Sec: (v) => 1 / Math.cos(v),
  Cot: (v) => Math.cos(v) / Math.sin(v),
};

class Unsupported extends Error {}

function ev(j: Json, x: number): number {
  if (typeof j === 'number') return j;
  if (typeof j === 'string') {
    if (j === 'x') return x;
    if (j === 'Pi') return Math.PI;
    if (j === 'Half') return 0.5;
    if (/^-?\d+(\.\d+)?$/.test(j)) return Number(j);
    throw new Unsupported(j);
  }
  const [op, ...a] = j;
  if (typeof op === 'object' && op[0] === 'InverseFunction') throw new Unsupported('inverse');
  switch (op) {
    case 'Delimiter':
      return ev(a[0], x);
    case 'Add':
      return a.reduce<number>((s, t) => s + ev(t, x), 0);
    case 'Subtract':
      return a.length === 1 ? -ev(a[0], x) : ev(a[0], x) - a.slice(1).reduce<number>((s, t) => s + ev(t, x), 0);
    case 'Negate':
      return -ev(a[0], x);
    case 'Multiply':
    case 'InvisibleOperator':
      return a.reduce<number>((s, t) => s * ev(t, x), 1);
    case 'Divide':
    case 'Rational':
      return ev(a[0], x) / ev(a[1], x);
    case 'Power':
      return ev(a[0], x) ** ev(a[1], x);
    case 'Square':
      return ev(a[0], x) ** 2;
    case 'Sqrt':
      return Math.sqrt(ev(a[0], x));
    case 'Root':
      return ev(a[0], x) ** (1 / ev(a[1], x));
    case 'Number':
      return Number(a[0]);
    default:
      if (typeof op === 'string' && TRIG[op]) {
        if (a.length !== 1) throw new Unsupported('arity');
        return TRIG[op](ev(a[0], x));
      }
      throw new Unsupported(String(op));
  }
}

/** Sub-expressions that must not be zero: denominators, negative-power bases, and the hidden sin/cos of tan, sec, csc, cot. */
function guards(j: Json, out: Json[] = []): Json[] {
  if (!Array.isArray(j)) return out;
  const [op, ...a] = j;
  if (op === 'Divide' || op === 'Rational') out.push(a[1]);
  if (op === 'Power' && Array.isArray(a[1]) && a[1][0] === 'Negate') out.push(a[0]);
  if (op === 'Power' && typeof a[1] === 'number' && a[1] < 0) out.push(a[0]);
  if (op === 'Tan' || op === 'Sec') out.push(['Cos', a[0]]);
  if (op === 'Cot' || op === 'Csc') out.push(['Sin', a[0]]);
  for (const s of a) guards(s, out);
  return out;
}

export type TrigFn = { f: (x: number) => number; npv: (x: number, tol?: number) => boolean };

/** Compile a trig expression in x (or θ). Null if it can't be read or uses something unsupported. */
export function compileTrig(tex: string): TrigFn | null {
  const j = parseRaw(tex);
  if (j === null) return null;
  const g = guards(j);
  try {
    ev(j, 0.7);
    g.forEach((h) => ev(h, 0.7));
  } catch {
    return null;
  }
  return {
    f: (x) => ev(j, x),
    npv: (x, tol = 1e-9) => g.some((h) => Math.abs(ev(h, x)) < tol),
  };
}

/** Non-permissible values in degrees on [lo, hi), checked on a 15° grid (every NPV in this course is a multiple of 15°). */
export function npvDegrees(tex: string, lo = 0, hi = 360): number[] {
  const c = compileTrig(tex);
  if (!c) return [];
  const out: number[] = [];
  for (let d = Math.ceil(lo / 15) * 15; d < hi; d += 15) if (c.npv((d * Math.PI) / 180)) out.push(d);
  return out;
}

const SAMPLE = Array.from({ length: 40 }, (_, i) => -3.1 + i * 0.1573 + 0.0137 * Math.sin(i));

/** True if the two expressions agree at every sample point where both are defined (and away from their NPVs). */
export function equivalentTex(a: string, b: string): boolean {
  const A = compileTrig(a);
  const B = compileTrig(b);
  if (!A || !B) return false;
  let n = 0;
  for (const x of SAMPLE) {
    if (A.npv(x, 1e-3) || B.npv(x, 1e-3)) continue;
    const u = A.f(x);
    const v = B.f(x);
    if (!Number.isFinite(u) || !Number.isFinite(v)) continue;
    if (Math.abs(u - v) > 1e-7 * Math.max(1, Math.abs(u), Math.abs(v))) return false;
    n++;
  }
  return n >= 10;
}

/** Text form for comparing two lines literally: spacing, \left/\right, braces around single tokens and multiplication dots dropped. */
export function normal(tex: string): string {
  return tidy(tex)
    .replace(/\\theta/g, ' x ')
    .replace(/\\cdot|\\times/g, '')
    .replace(/\^\{(\w)\}/g, '^$1')
    .replace(/\\left|\\right/g, '')
    .replace(/\s+/g, '');
}

/** The two sides read the same, literally or after the CAS orders terms and factors. */
export function sidesMatch(l: string, r: string): boolean {
  if (normal(l) === normal(r)) return true;
  try {
    const A = ce().parse(tidy(l).replace(/\\theta/g, ' x '));
    const B = ce().parse(tidy(r).replace(/\\theta/g, ' x '));
    return A.isValid && B.isValid && A.isSame(B);
  } catch {
    return false;
  }
}

export type Move = 'reciprocal' | 'quotient' | 'pythagorean' | 'double-angle' | 'sum-difference' | 'factor' | 'expand' | 'common-denominator' | 'conjugate' | 'simplify';

export const MOVES: { id: Move; label: string; tex: string }[] = [
  { id: 'reciprocal', label: 'Reciprocal', tex: '\\csc x = \\frac{1}{\\sin x},\\ \\sec x = \\frac{1}{\\cos x},\\ \\cot x = \\frac{1}{\\tan x}' },
  { id: 'quotient', label: 'Quotient', tex: '\\tan x = \\frac{\\sin x}{\\cos x},\\ \\cot x = \\frac{\\cos x}{\\sin x}' },
  { id: 'pythagorean', label: 'Pythagorean', tex: '\\sin^2 x + \\cos^2 x = 1,\\ 1 + \\tan^2 x = \\sec^2 x,\\ 1 + \\cot^2 x = \\csc^2 x' },
  { id: 'double-angle', label: 'Double angle', tex: '\\sin 2x = 2\\sin x\\cos x,\\ \\cos 2x = \\cos^2 x - \\sin^2 x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x' },
  { id: 'sum-difference', label: 'Sum or difference', tex: '\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B,\\ \\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B' },
  { id: 'factor', label: 'Factor', tex: 'ab + ac = a(b + c),\\ a^2 - b^2 = (a - b)(a + b)' },
  { id: 'expand', label: 'Expand', tex: '(a + b)^2 = a^2 + 2ab + b^2' },
  { id: 'common-denominator', label: 'Common denominator', tex: '\\frac{a}{b} + \\frac{c}{d} = \\frac{ad + bc}{bd}' },
  { id: 'conjugate', label: 'Multiply by conjugate', tex: '\\frac{a}{1 - \\cos x} \\cdot \\frac{1 + \\cos x}{1 + \\cos x}' },
  { id: 'simplify', label: 'Simplify', tex: '\\text{cancel common factors, collect like terms}' },
];

export type StepCheck = { ok: boolean; note?: string; newNpv?: number[] };

/** A proof line must be equivalent to the line before it on the same side. Lines that add restrictions are flagged. */
export function checkStep(prev: string, next: string): StepCheck {
  const n = compileTrig(next);
  if (!n) return { ok: false, note: "I couldn't read that line. Use x, and functions like \\sin x, \\cos^2 x." };
  if (!equivalentTex(prev, next)) return { ok: false, note: 'This line is not equivalent to the line above it.' };
  const before = new Set(npvDegrees(prev));
  const added = npvDegrees(next).filter((d) => !before.has(d));
  return added.length ? { ok: true, newNpv: added } : { ok: true };
}

export type IdentityProblem = { id: string; lhs: string; rhs: string; excellence?: boolean; hint: string };

export const IDENTITY_PROBLEMS: IdentityProblem[] = [
  { id: 'i1', lhs: '\\tan x\\cos x', rhs: '\\sin x', hint: 'Write tan as sin over cos.' },
  { id: 'i2', lhs: '\\sec x - \\cos x', rhs: '\\sin x\\tan x', hint: 'Common denominator on the left, then Pythagorean.' },
  { id: 'i3', lhs: '\\frac{1 - \\cos^2 x}{\\sin x\\cos x}', rhs: '\\tan x', hint: 'Pythagorean in the numerator.' },
  { id: 'i4', lhs: '\\csc x - \\sin x', rhs: '\\cos x\\cot x', hint: 'Write csc as 1/sin and combine.' },
  { id: 'i5', lhs: '\\frac{\\sec^2 x - 1}{\\sec^2 x}', rhs: '\\sin^2 x', hint: 'sec² − 1 = tan², then rewrite in sin and cos.' },
  { id: 'i6', lhs: '\\tan x + \\cot x', rhs: '\\sec x\\csc x', hint: 'Quotient identities, then a common denominator.' },
  { id: 'i7', lhs: '\\frac{\\sin x}{1 - \\cos x}', rhs: '\\frac{1 + \\cos x}{\\sin x}', excellence: true, hint: 'Multiply by the conjugate of the denominator.' },
  { id: 'i8', lhs: '\\frac{\\sin 2x}{1 + \\cos 2x}', rhs: '\\tan x', excellence: true, hint: 'Double-angle identities; pick the cos 2x form that cancels the 1.' },
  { id: 'i9', lhs: '\\frac{1}{1 - \\sin x} + \\frac{1}{1 + \\sin x}', rhs: '2\\sec^2 x', excellence: true, hint: 'Common denominator: (1 − sin x)(1 + sin x).' },
  { id: 'i10', lhs: '(\\sin x + \\cos x)^2', rhs: '1 + \\sin 2x', excellence: true, hint: 'Expand, then Pythagorean and double angle.' },
  { id: 'i11', lhs: '\\cos^4 x - \\sin^4 x', rhs: '\\cos 2x', excellence: true, hint: 'Difference of squares.' },
  { id: 'i12', lhs: '\\frac{\\cos x}{1 - \\sin x} - \\tan x', rhs: '\\sec x', excellence: true, hint: 'Write tan x as sin/cos and use a common denominator.' },
];
