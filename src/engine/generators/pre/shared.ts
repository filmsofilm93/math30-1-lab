// Helpers for the prerequisite-layer generators.
import { F, Frac, polyEval, polyTex } from '../../frac';
import type { AnswerSpec } from '../../types';

export type Poly = number[]; // highest power first

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
export const gcdAll = (...xs: number[]) => xs.reduce((g, x) => gcd(g, x), 0);

export function addP(p: Poly, q: Poly, s = 1): Poly {
  const n = Math.max(p.length, q.length);
  const a = Array(n - p.length).fill(0).concat(p);
  const b = Array(n - q.length).fill(0).concat(q);
  const out = a.map((v, i) => v + s * b[i]);
  while (out.length > 1 && out[0] === 0) out.shift();
  return out;
}
export function mulP(...ps: Poly[]): Poly {
  return ps.reduce((acc, q) => {
    const out = Array(acc.length + q.length - 1).fill(0);
    acc.forEach((a, i) => q.forEach((b, j) => (out[i + j] += a * b)));
    return out;
  }, [1]);
}
export const scaleP = (p: Poly, k: number): Poly => p.map((c) => c * k);

/** Exact number answer. */
export const num = (v: Frac | number, exact = true): AnswerSpec => {
  const f = Frac.of(v);
  return { kind: 'number', value: f.value, tex: f.tex(), exact };
};

/** Finite solution set; [] means no solution. */
export function setAns(vals: (Frac | number)[], exact = true): AnswerSpec {
  const fs = vals.map(Frac.of).sort((a, b) => a.value - b.value);
  const u = fs.filter((v, i) => fs.findIndex((w) => w.eq(v)) === i);
  return { kind: 'set', values: u.map((v) => v.value), tex: u.length ? u.map((v) => v.tex()).join(', ') : '\\varnothing', exact };
}

/** "x = 2" or "x = -3, 4" or "no solution" as plain rich text. */
export function solutionText(vals: (Frac | number)[], v = 'x'): string {
  const fs = vals.map(Frac.of).sort((a, b) => a.value - b.value);
  if (!fs.length) return 'no solution';
  return fs.map((f) => `$${v} = ${f.tex()}$`).join(' and ');
}

/** Factor tex: x, (x - 3), (2x + 1), (x^2 + 4). */
function factorTex(f: Poly): string {
  if (f.length === 2 && f[0] === 1 && f[1] === 0) return 'x';
  return `\\left(${polyTex(f)}\\right)`;
}

/** k·f1·f2… as LaTeX, e.g. -3x(x-1)(x+2). Repeated factors are written as powers. */
export function factoredTex(k: number, fs: Poly[]): string {
  if (fs.length === 1 && k === 1) return polyTex(fs[0]);
  const parts: string[] = [];
  const seen: string[] = [];
  for (const f of fs) {
    const key = f.join(',');
    if (seen.includes(key)) continue;
    seen.push(key);
    const n = fs.filter((g) => g.join(',') === key).length;
    parts.push(n > 1 ? `${factorTex(f)}^{${n}}` : factorTex(f));
  }
  return `${k === 1 ? '' : k === -1 ? '-' : k}${parts.join('')}`;
}

export function factoredAns(k: number, fs: Poly[]): AnswerSpec {
  return {
    kind: 'expr',
    tex: factoredTex(k, fs),
    variable: 'x',
    fn: (x) => k * fs.reduce((acc, f) => acc * polyEval(f)(x), 1),
    sample: [-4, 4],
    form: 'factored',
    exact: true,
  };
}

/** k√m with k = 1 → √m, m = 1 → k. */
export function sqrtTex(k: number | Frac, m: number, index = 2): string {
  const f = Frac.of(k);
  if (m === 1) return f.tex();
  const root = index === 2 ? `\\sqrt{${m}}` : `\\sqrt[${index}]{${m}}`;
  return `${f.eq(1) ? '' : f.eq(-1) ? '-' : f.tex()}${root}`;
}

/** Largest k with k² | n; returns [k, n / k²]. */
export function splitSquare(n: number): [number, number] {
  let k = 1;
  let r = n;
  for (let d = 2; d * d <= r; d++) {
    while (r % (d * d) === 0) {
      r /= d * d;
      k *= d;
    }
  }
  return [k, r];
}

export const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n));
export const SQUAREFREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

/** Sign word for a number: "+ 3" / "- 3" inside expressions. */
export const pm = (v: number) => (v < 0 ? `- ${Math.abs(v)}` : `+ ${v}`);
export { F };
