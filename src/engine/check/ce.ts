import { ComputeEngine, compile } from '@cortex-js/compute-engine';

let engine: ComputeEngine | null = null;
export function ce(): ComputeEngine {
  if (!engine) engine = new ComputeEngine();
  return engine;
}

/** Strip MathLive spacing commands and \left/\right so simple string checks work. */
export function tidy(tex: string): string {
  return tex
    .replace(/\\left|\\right|\\displaystyle/g, '')
    .replace(/\\[,;:! ]|\\quad|\\qquad|~/g, '')
    .replace(/\\placeholder\{\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function real(v: unknown): number {
  if (typeof v === 'number') return v;
  if (v && typeof v === 'object' && 're' in v && 'im' in v) {
    const c = v as { re: number; im: number };
    return Math.abs(c.im) < 1e-12 ? c.re : NaN;
  }
  if (typeof v === 'boolean') return NaN;
  return NaN;
}

export type CompiledFn = { fn: (vars: Record<string, number>) => number; free: string[] };

/** Compile LaTeX to a real-valued function. Non-real results become NaN. Returns null if it can't parse. */
export function compileTex(tex: string): CompiledFn | null {
  const t = tidy(tex);
  if (!t) return null;
  try {
    const expr = ce().parse(t);
    if (!expr.isValid) return null;
    const c = compile(expr) as unknown as { success: boolean; run: (v: Record<string, number>) => unknown; freeSymbols?: string[] };
    if (!c || !c.success) return null;
    const free = (expr.freeVariables ?? c.freeSymbols ?? []) as string[];
    return {
      fn: (vars) => {
        try {
          return real(c.run(vars));
        } catch {
          return NaN;
        }
      },
      free: free.filter((s) => s !== 'Pi' && s !== 'ExponentialE'),
    };
  } catch {
    return null;
  }
}

/** Numeric value of a constant expression such as -\frac{3}{2} or 2\sqrt{3}. */
export function numeric(tex: string): number {
  const t = tidy(tex)
    .replace(/^\+/, '')
    .replace(/∞|\\infty|\\infin/g, 'INF');
  if (t === 'INF') return Infinity;
  if (t === '-INF') return -Infinity;
  const c = compileTex(t);
  if (!c || c.free.length) return NaN;
  return c.fn({});
}

/** True if the input contains a decimal literal such as 0.5 or .5 */
export function hasDecimal(tex: string): boolean {
  return /(\d|^|[^\d])\.\d/.test(tidy(tex).replace(/\\ldots|\\cdots|\\dots/g, ''));
}

export const close = (a: number, b: number, rel = 1e-9) =>
  Number.isFinite(a) && Number.isFinite(b) ? Math.abs(a - b) <= rel * Math.max(1, Math.abs(a), Math.abs(b)) : a === b;
