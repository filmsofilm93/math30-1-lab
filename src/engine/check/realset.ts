import { close, numeric, tidy } from './ce';

/** A subset of R as a sorted union of disjoint intervals. A single point is [a, a]. */
export interface Interval {
  lo: number;
  hi: number;
  loIn: boolean;
  hiIn: boolean;
}
export type RealSet = Interval[];

export const ALL: RealSet = [{ lo: -Infinity, hi: Infinity, loIn: false, hiIn: false }];
export const iv = (lo: number, hi: number, loIn = true, hiIn = true): Interval => ({
  lo,
  hi,
  loIn: lo === -Infinity ? false : loIn,
  hiIn: hi === Infinity ? false : hiIn,
});

/** Sort, drop empties, merge overlapping/touching pieces. */
export function normalize(s: RealSet): RealSet {
  const a = s
    .filter((i) => i.lo < i.hi || (close(i.lo, i.hi) && i.loIn && i.hiIn))
    .map((i) => ({ ...i }))
    .sort((p, q) => p.lo - q.lo || Number(q.loIn) - Number(p.loIn));
  const out: Interval[] = [];
  for (const i of a) {
    const last = out[out.length - 1];
    if (last && (i.lo < last.hi || (close(i.lo, last.hi) && (last.hiIn || i.loIn)))) {
      if (i.hi > last.hi || (close(i.hi, last.hi) && i.hiIn)) {
        last.hiIn = close(i.hi, last.hi) ? last.hiIn || i.hiIn : i.hiIn;
        last.hi = Math.max(last.hi, i.hi);
      }
    } else out.push(i);
  }
  return out;
}

export function intersect(a: RealSet, b: RealSet): RealSet {
  const out: Interval[] = [];
  for (const p of a)
    for (const q of b) {
      const lo = Math.max(p.lo, q.lo);
      const hi = Math.min(p.hi, q.hi);
      const loIn = lo === p.lo && lo === q.lo ? p.loIn && q.loIn : lo === p.lo ? p.loIn : q.loIn;
      const hiIn = hi === p.hi && hi === q.hi ? p.hiIn && q.hiIn : hi === p.hi ? p.hiIn : q.hiIn;
      out.push({ lo, hi, loIn, hiIn });
    }
  return normalize(out);
}

/** Remove single points (non-permissible values). */
export function except(a: RealSet, pts: number[]): RealSet {
  let s = a;
  for (const p of pts) s = intersect(s, [iv(-Infinity, p, false, false), iv(p, Infinity, false, false)]);
  return s;
}

export function contains(s: RealSet, x: number): boolean {
  return s.some((i) => (x > i.lo || (x === i.lo && i.loIn)) && (x < i.hi || (x === i.hi && i.hiIn)));
}

export function setEqual(a: RealSet, b: RealSet): boolean {
  const p = normalize(a);
  const q = normalize(b);
  if (p.length !== q.length) return false;
  return p.every((i, k) => {
    const j = q[k];
    const eqEnd = (x: number, y: number) => (Number.isFinite(x) || Number.isFinite(y) ? close(x, y) : x === y);
    return eqEnd(i.lo, j.lo) && eqEnd(i.hi, j.hi) && i.loIn === j.loIn && i.hiIn === j.hiIn;
  });
}

// ---------------------------------------------------------------- formatting

export function numTex(x: number): string {
  if (x === Infinity) return '\\infty';
  if (x === -Infinity) return '-\\infty';
  if (Number.isInteger(x)) return String(x);
  for (let d = 2; d <= 12; d++) {
    const n = Math.round(x * d);
    if (close(n / d, x)) return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
  }
  return String(+x.toFixed(4));
}

export function intervalTex(s: RealSet): string {
  const n = normalize(s);
  if (!n.length) return '\\varnothing';
  return n
    .map((i) =>
      i.lo === i.hi ? `\\{${numTex(i.lo)}\\}` : `${i.loIn ? '[' : '('}${numTex(i.lo)}, ${numTex(i.hi)}${i.hiIn ? ']' : ')'}`,
    )
    .join(' \\cup ');
}

/** Set-builder form, Alberta style: {x | -2 ≤ x < 5, x ∈ R} or {x | x ≠ 3, x ∈ R}. */
export function setBuilderTex(s: RealSet, v = 'x'): string {
  const n = normalize(s);
  const tail = `, ${v} \\in \\mathbb{R}\\}`;
  if (!n.length) return '\\varnothing';
  // R minus finitely many points
  const holes: number[] = [];
  let ok = n[0].lo === -Infinity && n[n.length - 1].hi === Infinity;
  for (let k = 0; ok && k < n.length - 1; k++) {
    if (close(n[k].hi, n[k + 1].lo) && !n[k].hiIn && !n[k + 1].loIn) holes.push(n[k].hi);
    else ok = false;
  }
  if (ok && holes.length === 0) return `\\{${v} \\mid ${v} \\in \\mathbb{R}\\}`;
  if (ok) return `\\{${v} \\mid ${holes.map((h) => `${v} \\ne ${numTex(h)}`).join(', ')}${tail}`;
  if (n.length === 1) {
    const i = n[0];
    const left = i.lo === -Infinity ? '' : `${numTex(i.lo)} ${i.loIn ? '\\le' : '<'} `;
    const right = i.hi === Infinity ? '' : ` ${i.hiIn ? '\\le' : '<'} ${numTex(i.hi)}`;
    if (!left && right) return `\\{${v} \\mid ${v}${right}${tail}`;
    if (left && !right) return `\\{${v} \\mid ${v} ${i.loIn ? '\\ge' : '>'} ${numTex(i.lo)}${tail}`;
    return `\\{${v} \\mid ${left}${v}${right}${tail}`;
  }
  return intervalTex(n);
}

// ---------------------------------------------------------------- parsing

function canon(tex: string): string {
  return tidy(tex)
    .replace(/\\lbrack/g, "[")
    .replace(/\\rbrack/g, ']')
    .replace(/\\lparen/g, '(')
    .replace(/\\rparen/g, ')')
    .replace(/\\lbrace|\\\{/g, '{')
    .replace(/\\rbrace|\\\}/g, '}')
    .replace(/\\infty|\\infin/g, '∞')
    .replace(/\\cup/g, '∪')
    .replace(/\\mid|\\vert|\\colon|:/g, '|')
    .replace(/\\leqslant|\\leq|\\le(?![a-z])/g, '≤')
    .replace(/\\geqslant|\\geq|\\ge(?![a-z])/g, '≥')
    .replace(/\\lt(?![a-z])/g, '<')
    .replace(/\\gt(?![a-z])/g, '>')
    .replace(/\\neq|\\ne(?![a-z])/g, '≠')
    .replace(/\\in(?![a-z])/g, '∈')
    .replace(/\\mathbb\{R\}|\\R(?![a-z])|\\Reals|\\mathbb R/g, 'R')
    .replace(/\\emptyset|\\varnothing|\\empty/g, '∅')
    .replace(/\\text\{\s*(and)\s*\}/g, ',')
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\s+/g, '');
}

/** Split at commas that are not inside braces/brackets/parens. */
function splitTop(s: string, sep: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if ('([{'.includes(ch)) depth++;
    if (')]}'.includes(ch)) depth--;
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function endpoint(s: string): number {
  if (s === '∞' || s === '+∞') return Infinity;
  if (s === '-∞') return -Infinity;
  return numeric(s);
}

function parseInterval(piece: string): Interval | null {
  const o = piece[0];
  const c = piece[piece.length - 1];
  if (!'(['.includes(o) || !')]'.includes(c)) return null;
  const parts = splitTop(piece.slice(1, -1), ',');
  if (parts.length !== 2) return null;
  const lo = endpoint(parts[0]);
  const hi = endpoint(parts[1]);
  if (Number.isNaN(lo) || Number.isNaN(hi) || lo > hi) return null;
  if ((lo === -Infinity && o === '[') || (hi === Infinity && c === ']')) return null; // reject [−∞
  return { lo, hi, loIn: o === '[', hiIn: c === ']' };
}

function parseCondition(cond: string, v: string): RealSet | null {
  if (cond === `${v}∈R` || cond === '') return ALL;
  // x ≠ a  (also x ≠ a, b handled by caller splitting)
  let m = cond.match(new RegExp(`^${v}≠(.+)$`));
  if (m) {
    const a = numeric(m[1]);
    return Number.isNaN(a) ? null : except(ALL, [a]);
  }
  // chain: a op x op b, or x op a, or a op x
  const tokens = cond.split(/(≤|≥|<|>)/).filter(Boolean);
  const vals: (number | 'v')[] = [];
  const ops: string[] = [];
  for (let k = 0; k < tokens.length; k++) {
    if (k % 2 === 1) ops.push(tokens[k]);
    else if (tokens[k] === v) vals.push('v');
    else {
      const n = numeric(tokens[k]);
      if (Number.isNaN(n)) return null;
      vals.push(n);
    }
  }
  if (vals.length < 2 || vals.length !== ops.length + 1) return null;
  let s: RealSet = ALL;
  for (let k = 0; k < ops.length; k++) {
    const a = vals[k];
    const b = vals[k + 1];
    const op = ops[k];
    if (a === 'v' && typeof b === 'number') {
      s = intersect(s, op === '<' ? [iv(-Infinity, b, false, false)] : op === '≤' ? [iv(-Infinity, b, false, true)] : op === '>' ? [iv(b, Infinity, false)] : [iv(b, Infinity, true)]);
    } else if (b === 'v' && typeof a === 'number') {
      s = intersect(s, op === '<' ? [iv(a, Infinity, false)] : op === '≤' ? [iv(a, Infinity, true)] : op === '>' ? [iv(-Infinity, a, false, false)] : [iv(-Infinity, a, false, true)]);
    } else return null;
  }
  return s;
}

/** Parse interval notation, set-builder notation, R, or ∅. Returns null if it can't be read. */
export function parseRealSet(tex: string, v = 'x'): RealSet | null {
  const s = canon(tex);
  if (!s) return null;
  if (s === 'R' || s === `${v}∈R` || s === `{${v}|${v}∈R}`) return ALL;
  if (s === '∅' || s === '{}') return [];
  if (s.startsWith('{') && s.endsWith('}') && s.includes('|')) {
    const body = s.slice(1, -1);
    const bar = body.indexOf('|');
    if (body.slice(0, bar) !== v) return null;
    const conds = splitTop(body.slice(bar + 1), ',');
    let out: RealSet = ALL;
    let lastNe = false;
    for (const c of conds) {
      // "x ≠ 2, 3" → second piece is a bare number continuing the ≠ list
      const r = lastNe && !/[≤≥<>≠∈]/.test(c) ? parseCondition(`${v}≠${c}`, v) : parseCondition(c, v);
      if (!r) return null;
      lastNe = c.includes('≠') || (lastNe && !/[≤≥<>∈]/.test(c));
      out = intersect(out, r);
    }
    return out;
  }
  const pieces = splitTop(s, '∪');
  const out: Interval[] = [];
  for (const p of pieces) {
    if (p.startsWith('{') && p.endsWith('}')) {
      const n = numeric(p.slice(1, -1));
      if (Number.isNaN(n)) return null;
      out.push(iv(n, n));
      continue;
    }
    const i = parseInterval(p);
    if (!i) return null;
    out.push(i);
  }
  return normalize(out);
}
