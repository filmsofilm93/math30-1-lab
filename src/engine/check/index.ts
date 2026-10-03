import type { AnswerSpec, Round } from '../types';
import { close, compileTex, hasDecimal, numeric, tidy } from './ce';
import { isFullyFactored } from './factored';
import { parseRealSet, setEqual } from './realset';

export type Verdict = { ok: boolean; reason?: 'unreadable' | 'exact' | 'rounding' | 'wrong' | 'branches' | 'variable' | 'form'; note?: string };

const REASON_TEXT: Record<NonNullable<Verdict['reason']>, string> = {
  unreadable: "I couldn't read that answer. Check brackets and notation.",
  exact: 'This question wants an exact value, so no decimals.',
  rounding: 'Check the rounding the question asks for.',
  wrong: 'Not quite.',
  branches: 'This answer has two branches (±).',
  variable: 'Use only the variable in the question.',
  form: 'Equivalent, but not fully factored.',
};
export const reasonText = (v: Verdict) => (v.reason ? REASON_TEXT[v.reason] : '');

/** Drop a leading "y =", "f(x) =", "x =" etc. Keeps the right side of the last top-level "=". */
export function rhs(tex: string): string {
  const t = tidy(tex);
  const i = t.lastIndexOf('=');
  return i >= 0 ? t.slice(i + 1) : t;
}

export function roundTo(x: number, r: Round): number {
  const p = r === 'whole' ? 1 : r === 'tenth' ? 10 : 100;
  return Math.round((x + Math.sign(x) * 1e-12) * p) / p;
}

/** Degree signs are dropped: angle answers in this app are entered in the unit the question asks for. */
const stripDegrees = (t: string) => t.replace(/\^\{?\\circ\}?|°|\\degree/g, '');

function checkNumber(spec: Extract<AnswerSpec, { kind: 'number' }>, input: string): Verdict {
  const t = stripDegrees(rhs(input));
  const v = numeric(t);
  if (Number.isNaN(v)) return { ok: false, reason: 'unreadable' };
  if (spec.exact && hasDecimal(t)) return { ok: false, reason: 'exact' };
  if (spec.round) {
    const want = roundTo(spec.value, spec.round);
    if (close(v, want, 1e-12)) return { ok: true };
    return close(v, spec.value, 0.02) ? { ok: false, reason: 'rounding' } : { ok: false, reason: 'wrong' };
  }
  return close(v, spec.value, 1e-9) ? { ok: true } : { ok: false, reason: 'wrong' };
}

function samplePoints([lo, hi]: [number, number], n = 24): number[] {
  const out: number[] = [];
  for (let k = 0; k < n; k++) out.push(lo + ((k + 0.37) / n) * (hi - lo));
  return out;
}

function checkExpr(spec: Extract<AnswerSpec, { kind: 'expr' }>, input: string): Verdict {
  const t = rhs(input);
  if (spec.exact && hasDecimal(t)) return { ok: false, reason: 'exact' };
  const hasPm = /\\pm|\\mp/.test(t);
  const branches = hasPm ? [t.replace(/\\pm/g, '+').replace(/\\mp/g, '-'), t.replace(/\\pm/g, '-').replace(/\\mp/g, '+')] : [t];
  const fns = branches.map(compileTex);
  if (fns.some((f) => !f)) return { ok: false, reason: 'unreadable' };
  if (fns.some((f) => f!.free.some((s) => s !== spec.variable))) return { ok: false, reason: 'variable' };
  const user = fns.map((f) => (v: number) => f!.fn({ [spec.variable]: v }));
  const want = spec.fnMinus ? [spec.fn, spec.fnMinus] : [spec.fn];
  if (user.length !== want.length) return { ok: false, reason: spec.fnMinus ? 'branches' : 'wrong' };

  const pts = samplePoints(spec.sample);
  const same = (u: (v: number) => number, w: (v: number) => number) => {
    let compared = 0;
    for (const p of pts) {
      const e = w(p);
      if (!Number.isFinite(e)) continue;
      const a = u(p);
      if (!Number.isFinite(a) || !close(a, e, 1e-7)) return false;
      compared++;
    }
    return compared >= 5;
  };
  if (want.length === 1) {
    if (!same(user[0], want[0])) return { ok: false, reason: 'wrong' };
    const defined = (spec.undefinedAt ?? []).filter((v) => Number.isFinite(user[0](v)));
    if (defined.length) return { ok: false, reason: 'form', note: `Equal elsewhere, but your function is defined at x = ${defined.join(', ')}. Keep the factor that makes it undefined there.` };
    if (spec.form === 'factored' && !isFullyFactored(t, spec.variable)) return { ok: false, reason: 'form', note: 'Equivalent, but not fully factored.' };
    if (spec.form === 'simplified') {
      const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;
      const trig = /\\(sin|cos|tan|csc|sec|cot)/g;
      if (count(t, trig) > count(spec.tex, trig) || count(t, /\\frac/g) > count(spec.tex, /\\frac/g) || count(t, /!/g) > count(spec.tex, /!/g)) return { ok: false, reason: 'form', note: 'Equivalent, but simplify further.' };
    }
    if (spec.form === 'expanded' && /\(|\\left|!/.test(t)) return { ok: false, reason: 'form', note: 'Equivalent, but write it expanded, with no brackets.' };
    if (spec.form === 'single-log' && (t.match(/\\log/g) ?? []).length !== 1) return { ok: false, reason: 'form', note: 'Equivalent, but not written as a single logarithm.' };
    return { ok: true };
  }
  const ok = (same(user[0], want[0]) && same(user[1], want[1])) || (same(user[0], want[1]) && same(user[1], want[0]));
  return ok ? { ok: true } : { ok: false, reason: 'wrong' };
}

/** Split "a, b" at top-level commas (outside braces/brackets/parens). */
function splitList(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if ('([{'.includes(ch)) depth++;
    if (')]}'.includes(ch)) depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}

const isEmptyAnswer = (t: string) => /^(\\varnothing|\\emptyset|∅|\\\{\\\}|\{\}|\\text\{(no solution|none)\}|nosolution|none)$/i.test(t.replace(/\s/g, ''));

export function parseNumberList(input: string): number[] | null {
  let t = tidy(input)
    .replace(/\\lbrace|\\\{/g, '')
    .replace(/\\rbrace|\\\}/g, '')
    .replace(/\\text\{\s*or\s*\}|\\text\{\s*and\s*\}|\\lor/g, ',');
  if (isEmptyAnswer(tidy(input))) return [];
  t = t.replace(/(^|,)\s*(\\theta|[a-zA-Z](_\{?\d\}?)?)\s*=/g, '$1'); // drop "x =" labels
  // "\frac{3\pm\sqrt{5}}{2}" stands for two values.
  const parts = splitList(t).flatMap((p) => (/\\pm|\\mp/.test(p) ? [p.replace(/\\pm|\\mp/g, '+'), p.replace(/\\pm|\\mp/g, '-')] : [p]));
  if (!parts.length) return null;
  const vals = parts.map(numeric);
  return vals.some(Number.isNaN) ? null : vals;
}

function sameNumberSet(a: number[], b: number[]): boolean {
  const ua = a.filter((x, i) => a.findIndex((y) => close(x, y)) === i);
  const ub = b.filter((x, i) => b.findIndex((y) => close(x, y)) === i);
  return ua.length === ub.length && ua.every((x) => ub.some((y) => close(x, y, 1e-9)));
}

export function parsePoints(input: string): [number, number][] | null {
  const t = tidy(input)
    .replace(/\\lbrace|\\\{/g, '')
    .replace(/\\rbrace|\\\}/g, '');
  if (isEmptyAnswer(tidy(input))) return [];
  const parts = splitList(t);
  const out: [number, number][] = [];
  for (const p of parts) {
    const m = p.match(/^\((.*)\)$/s);
    if (!m) return null;
    const xy = splitList(m[1]);
    if (xy.length !== 2) return null;
    const x = numeric(xy[0]);
    const y = numeric(xy[1]);
    if (Number.isNaN(x) || Number.isNaN(y)) return null;
    out.push([x, y]);
  }
  return out;
}

/** Every value of root + period·n inside [-w, w]. */
function expandGeneral(roots: number[], period: number, w: number): number[] {
  const out: number[] = [];
  for (const r of roots) for (let n = Math.floor((-w - r) / period); n <= Math.ceil((w - r) / period); n++) {
    const v = r + period * n;
    if (v >= -w - 1e-9 && v <= w + 1e-9) out.push(v);
  }
  return out;
}

function checkGeneral(spec: Extract<AnswerSpec, { kind: 'general' }>, input: string): Verdict {
  let t = tidy(input).replace(/,?\s*n\s*\\in\s*(\\mathbb\{[IZ]\}|I|\\Z)|,?\\text\{[^}]*\}/g, '');
  if (spec.deg) t = stripDegrees(t);
  t = t.replace(/(^|,)\s*(\\theta|x)\s*=/g, '$1').replace(/\\pi(?=[nk])/g, '\\pi ');
  const parts = splitList(t);
  if (!parts.length) return { ok: false, reason: 'unreadable' };
  const P = spec.period;
  const w = 3 * Math.max(P, spec.deg ? 360 : 2 * Math.PI);
  const got: number[] = [];
  for (const p of parts) {
    const c = compileTex(p);
    if (!c) return { ok: false, reason: 'unreadable' };
    const vars = c.free.filter((v) => v !== 'n' && v !== 'k');
    if (vars.length) return { ok: false, reason: 'unreadable' };
    const nv = c.free[0] ?? 'n';
    if (!c.free.length) return { ok: false, reason: 'wrong', note: 'A general solution needs a term with n, where n ∈ I.' };
    const a = c.fn({ [nv]: 0 });
    const step = c.fn({ [nv]: 1 }) - a;
    if (!Number.isFinite(a) || !Number.isFinite(step) || Math.abs(step) < 1e-9) return { ok: false, reason: 'unreadable' };
    got.push(...expandGeneral([a], Math.abs(step), w));
  }
  const want = expandGeneral(spec.roots, P, w);
  const inner = (xs: number[]) => xs.filter((x) => Math.abs(x) <= w - Math.max(P, spec.deg ? 360 : 2 * Math.PI));
  return sameNumberSet(inner(got), inner(want)) ? { ok: true } : { ok: false, reason: 'wrong' };
}

export function checkField(spec: AnswerSpec, input: string): Verdict {
  if (!tidy(input)) return { ok: false, reason: 'unreadable' };
  switch (spec.kind) {
    case 'number':
      return checkNumber(spec, input);
    case 'expr':
      return checkExpr(spec, input);
    case 'general':
      return checkGeneral(spec, input);
    case 'set': {
      const v = parseNumberList(spec.deg ? stripDegrees(input) : input);
      if (!v) return { ok: false, reason: 'unreadable' };
      if (spec.exact && hasDecimal(input)) return { ok: false, reason: 'exact' };
      if (spec.round) {
        const want = spec.values.map((x) => roundTo(x, spec.round!));
        if (sameNumberSet(v, want)) return { ok: true };
        return v.length === want.length && v.every((x) => want.some((y) => Math.abs(x - y) <= 0.06)) ? { ok: false, reason: 'rounding' } : { ok: false, reason: 'wrong' };
      }
      return sameNumberSet(v, spec.values) ? { ok: true } : { ok: false, reason: 'wrong' };
    }
    case 'points': {
      const v = parsePoints(input);
      if (!v) return { ok: false, reason: 'unreadable' };
      const key = (p: [number, number]) => spec.values.findIndex((q) => close(p[0], q[0]) && close(p[1], q[1]));
      const hits = new Set(v.map(key));
      const ok = !hits.has(-1) && hits.size === spec.values.length && v.length >= spec.values.length;
      return ok ? { ok: true } : { ok: false, reason: 'wrong' };
    }
    case 'interval': {
      const v = parseRealSet(input, spec.v ?? 'x');
      if (!v) return { ok: false, reason: 'unreadable' };
      return setEqual(v, spec.value) ? { ok: true } : { ok: false, reason: 'wrong' };
    }
  }
}
