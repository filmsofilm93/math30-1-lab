// Step checking for the log-law simplifier: each step must be equivalent to the start, and the goal form is detected.
import { ce, compileTex, tidy } from './check/ce';

export type LogGoal = 'expand' | 'condense';

export interface LogProblem {
  id: string;
  goal: LogGoal;
  start: string;
  /** One finished form, shown after the student finishes or gives up. */
  answer: string;
  /** Sampling window for every variable (keeps arguments positive). */
  sample: [number, number];
}

export const LOG_PROBLEMS: LogProblem[] = [
  { id: 'e1', goal: 'expand', start: '\\log_2\\left(\\frac{8x^3}{y}\\right)', answer: '3+3\\log_2 x-\\log_2 y', sample: [1.5, 6] },
  { id: 'e2', goal: 'expand', start: '\\log_3\\left(9x^4y\\right)', answer: '2+4\\log_3 x+\\log_3 y', sample: [1.5, 6] },
  { id: 'e3', goal: 'expand', start: '\\log\\left(\\frac{x^2\\sqrt{y}}{100z}\\right)', answer: '2\\log x+\\frac{1}{2}\\log y-2-\\log z', sample: [1.5, 6] },
  { id: 'c1', goal: 'condense', start: '2\\log_5 x+\\log_5 y-3\\log_5 z', answer: '\\log_5\\left(\\frac{x^2y}{z^3}\\right)', sample: [1.5, 6] },
  { id: 'c2', goal: 'condense', start: '\\log_2 x+\\log_2\\left(x-1\\right)-\\log_2 3', answer: '\\log_2\\left(\\frac{x\\left(x-1\\right)}{3}\\right)', sample: [2, 6] },
  { id: 'c3', goal: 'condense', start: '\\frac{1}{2}\\log x-2\\log y+1', answer: '\\log\\left(\\frac{10\\sqrt{x}}{y^2}\\right)', sample: [1.5, 6] },
];

const VARS = ['x', 'y', 'z'];

/** Deterministic sample points so a step's verdict never flickers. */
function samples([lo, hi]: [number, number]): Record<string, number>[] {
  return Array.from({ length: 7 }, (_, i) => Object.fromEntries(VARS.map((v, j) => [v, lo + ((hi - lo) * (((i + 1) * (j + 3) * 0.6180339887) % 1))])));
}

/** True if both expressions agree at every sample (and are defined there). */
export function equivalent(a: string, b: string, sample: [number, number]): boolean | null {
  const A = compileTex(a);
  const B = compileTex(b);
  if (!A || !B) return null;
  if (B.free.some((s) => !VARS.includes(s))) return false;
  return samples(sample).every((s) => {
    const u = A.fn(s);
    const w = B.fn(s);
    return Number.isFinite(u) && Number.isFinite(w) && Math.abs(u - w) <= 1e-7 * Math.max(1, Math.abs(u));
  });
}

const logCount = (t: string) => (t.match(/\\log/g) ?? []).length;

/** Every logarithm's argument is a single variable (or bracketed linear factor), with no powers, products or quotients inside. */
export function isExpanded(tex: string): boolean {
  // A bare subscript takes one character in LaTeX: \log_2 8x has base 2 and argument 8x.
  const t = tidy(tex).replace(/\\log_(\d)/g, '\\log_{$1}').replace(/\\left|\\right/g, '').replace(/\s+/g, '');
  const total = logCount(t);
  if (!total) return true;
  const simple = t.match(/\\log(_\{\d+\})?(\(?[a-z]\)?|\([a-z][+-]\d+\))(?![\^\w\\{(])/g) ?? [];
  return simple.length === total;
}

/** One logarithm and nothing outside it. */
export function isCondensed(tex: string): boolean {
  const t = tidy(tex);
  if (logCount(t) !== 1) return false;
  try {
    const e = ce().parse(t);
    return e.operator === 'Log' || e.operator === 'Lg' || e.operator === 'Lb';
  } catch {
    return false;
  }
}

export type StepVerdict = { ok: boolean; done: boolean; message: string };

export function checkStep(problem: LogProblem, tex: string): StepVerdict {
  const eq = equivalent(problem.start, tex, problem.sample);
  if (eq === null) return { ok: false, done: false, message: 'Could not read that expression.' };
  if (!eq) return { ok: false, done: false, message: 'Not equivalent to the start. Check which law you used, and its sign.' };
  const done = problem.goal === 'expand' ? isExpanded(tex) : isCondensed(tex);
  return { ok: true, done, message: done ? (problem.goal === 'expand' ? 'Equivalent and fully expanded.' : 'Equivalent and written as a single logarithm.') : 'Equivalent. Keep going.' };
}
