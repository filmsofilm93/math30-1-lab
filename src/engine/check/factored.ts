import { F, Frac } from '../frac';
import { ce, compileTex, tidy } from './ce';

type Json = unknown;

/** Split a parsed (non-canonical) expression into its multiplicative factors, ignoring signs and integer powers. */
function factors(e: Json): Json[] {
  if (!Array.isArray(e)) return [e];
  const [head, ...args] = e as [string, ...Json[]];
  if (head === 'InvisibleOperator' || head === 'Multiply') return args.flatMap(factors);
  if (head === 'Delimiter') return factors(args[0]);
  if (head === 'Negate') return factors(args[0]);
  if (head === 'Power' && typeof args[1] === 'number' && Number.isInteger(args[1]) && args[1] >= 1) return factors(args[0]);
  return [e];
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Exact coefficients (highest power first) of a polynomial of degree ≤ 4 from its values at x = 0..5, or null. */
function fitPoly(f: (x: number) => number): Frac[] | null {
  const ys: number[] = [];
  for (let x = 0; x <= 5; x++) {
    const y = f(x);
    if (!Number.isFinite(y) || Math.abs(y - Math.round(y)) > 1e-9) return null;
    ys.push(Math.round(y));
  }
  // Degree from finite differences: the 5th difference of a degree ≤ 4 polynomial is 0.
  let diffs = ys.slice();
  let deg = 0;
  const table = [diffs];
  while (diffs.some((d) => d !== 0) && deg <= 5) {
    diffs = diffs.slice(1).map((d, i) => d - diffs[i]);
    table.push(diffs);
    deg++;
  }
  deg = Math.max(0, deg - 1);
  if (deg > 4 || (table[deg + 1] && table[deg + 1].some((d) => d !== 0))) return null;
  // Newton forward form → monomial coefficients.
  let coeffs: Frac[] = [F(0)]; // highest first
  let basis: Frac[] = [F(1)]; // x(x-1)...(x-k+1)/k!
  for (let k = 0; k <= deg; k++) {
    const c = F(table[k][0]);
    const term = basis.map((b) => b.mul(c));
    const n = Math.max(coeffs.length, term.length);
    const a = Array(n - coeffs.length).fill(F(0)).concat(coeffs);
    const b = Array(n - term.length).fill(F(0)).concat(term);
    coeffs = a.map((v: Frac, i: number) => v.add(b[i]));
    // basis *= (x - k) / (k + 1)
    const next: Frac[] = Array(basis.length + 1).fill(F(0));
    basis.forEach((v, i) => {
      next[i] = next[i].add(v);
      next[i + 1] = next[i + 1].sub(v.mul(k));
    });
    basis = next.map((v) => v.div(k + 1));
  }
  while (coeffs.length > 1 && coeffs[0].n === 0) coeffs.shift();
  return coeffs;
}

const isSquare = (n: number) => n >= 0 && Number.isInteger(Math.sqrt(n));

/**
 * True when the expression is written as a product of factors that cannot be factored further over the integers:
 * constants, linear factors with no common factor, and quadratics with no rational roots.
 */
export function isFullyFactored(tex: string, v = 'x'): boolean {
  let json: Json;
  try {
    json = ce().parse(tidy(tex), { form: 'raw' }).json;
  } catch {
    return false;
  }
  for (const leaf of factors(json)) {
    let fn: (x: number) => number;
    try {
      const c = compileTex(ce().box(leaf as never, { form: 'raw' }).latex);
      if (!c || c.free.some((s) => s !== v)) return false;
      fn = (x) => c.fn({ [v]: x });
    } catch {
      return false;
    }
    const c = fitPoly(fn);
    if (!c) return false;
    const deg = c.length - 1;
    if (deg === 0) continue;
    if (deg > 2 || c.some((k) => !k.isInt)) return false;
    if (c.reduce((g, k) => gcd(g, k.n), 0) !== 1) return false;
    if (deg === 2 && isSquare(c[1].n * c[1].n - 4 * c[0].n * c[2].n)) return false;
  }
  return true;
}
