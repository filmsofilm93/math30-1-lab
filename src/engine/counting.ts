// Counting: factorials, nPr, nCr, brute-force enumeration (for independent checks), binomial terms.

export function fact(n: number): number {
  let v = 1;
  for (let i = 2; i <= n; i++) v *= i;
  return v;
}
export const nPr = (n: number, r: number) => (r < 0 || r > n ? 0 : fact(n) / fact(n - r));
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let v = 1;
  for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i;
  return Math.round(v);
}

/** Every ordering of the array (distinct positions; duplicates included). */
export function* permutations<T>(arr: readonly T[]): Generator<T[]> {
  if (arr.length <= 1) {
    yield [...arr];
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) yield [arr[i], ...p];
  }
}

/** Every ordered selection of r items from arr without repetition. */
export function* arrangements<T>(arr: readonly T[], r: number): Generator<T[]> {
  if (r === 0) {
    yield [];
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of arrangements(rest, r - 1)) yield [arr[i], ...p];
  }
}

/** Every r-subset of arr. */
export function* subsets<T>(arr: readonly T[], r: number, start = 0): Generator<T[]> {
  if (r === 0) {
    yield [];
    return;
  }
  for (let i = start; i <= arr.length - r; i++) for (const s of subsets(arr, r - 1, i + 1)) yield [arr[i], ...s];
}

/** Number of distinct strings from rearranging the letters of word that satisfy pred. */
export function countDistinct(word: string, pred: (s: string) => boolean = () => true): number {
  const seen = new Set<string>();
  for (const p of permutations(word.split(''))) {
    const s = p.join('');
    if (!seen.has(s) && pred(s)) seen.add(s);
  }
  return seen.size;
}

/** n! / (n1! n2! …) for the letter counts of word. */
export function distinctArrangements(word: string): number {
  const counts = letterCounts(word);
  return Object.values(counts).reduce((v, c) => v / fact(c), fact(word.length));
}
export function letterCounts(word: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const ch of word) out[ch] = (out[ch] ?? 0) + 1;
  return out;
}

/** Term t(k+1) of (a·x^p + b·x^q)^n: coefficient and power of x. */
export function binomTerm(n: number, k: number, a: number, p: number, b: number, q: number) {
  return { coef: nCr(n, k) * a ** (n - k) * b ** k, pow: p * (n - k) + q * k };
}

/** Full expansion of (a·x^p + b·x^q)^n as {coef, pow}, like terms combined, highest power first. */
export function binomExpand(n: number, a: number, p: number, b: number, q: number) {
  const out = new Map<number, number>();
  for (let k = 0; k <= n; k++) {
    const t = binomTerm(n, k, a, p, b, q);
    out.set(t.pow, (out.get(t.pow) ?? 0) + t.coef);
  }
  return [...out.entries()].map(([pow, coef]) => ({ coef, pow })).sort((s, t) => t.pow - s.pow);
}

/** Row n of Pascal's triangle (row 0 is the single 1). */
export const pascalRow = (n: number) => Array.from({ length: n + 1 }, (_, k) => nCr(n, k));
