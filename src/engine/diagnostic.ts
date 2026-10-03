/**
 * Prerequisite diagnostic. Walks the prerequisite skills in dependency order, one level-2 item each.
 * A miss, "I don't know" or a hesitant correct answer gets one confirmation item from a different
 * generator. A skill whose prerequisites were all answered weak is marked weak without asking.
 */
import type { DiagLevel } from './planner';

export interface DiagNode {
  id: string;
  prerequisites: string[];
}

/** First item (quick to answer) and confirmation item for each prerequisite skill. */
export const DIAG_GENERATORS: Record<string, [string, string]> = {
  'P.exp-laws': ['pre-exp-evaluate', 'pre-exp-simplify'],
  'P.radicals': ['pre-rad-add', 'pre-rad-rationalize'],
  'P.factor-basic': ['pre-fac-identify', 'pre-fac-dos'],
  'P.factor-trinomial': ['pre-fac-tri-mc', 'pre-fac-tri-simple'],
  'P.quad-solve': ['pre-quad-factor-solve', 'pre-quad-discriminant'],
  'P.quad-vertex': ['pre-quad-vertex-read', 'pre-quad-vertex-standard'],
  'P.func-notation': ['pre-fn-eval', 'pre-fn-table'],
  'P.domain-range': ['pre-dr-convert', 'pre-dr-function'],
  'P.linear': ['pre-lin-read', 'pre-lin-slope'],
  'P.abs': ['pre-abs-piecewise', 'pre-abs-eval'],
  'P.rat-expr': ['pre-rat-simplify', 'pre-rat-npv'],
  'P.rat-eq': ['pre-rateq-extraneous', 'pre-rateq-solve'],
  'P.rad-eq': ['pre-radeq-check', 'pre-radeq-solve'],
  'P.systems': ['pre-sys-count', 'pre-sys-solve'],
  'P.ref-angle': ['pre-ref-angle', 'pre-ref-exact'],
};

/** Skills in the diagnostic, already in dependency order (prerequisites first). */
export function diagnosticOrder(nodes: DiagNode[]): string[] {
  const ids = nodes.map((n) => n.id).filter((id) => id in DIAG_GENERATORS);
  const out: string[] = [];
  const seen = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id) || !ids.includes(id)) return;
    seen.add(id);
    for (const p of nodes.find((n) => n.id === id)!.prerequisites) visit(p);
    out.push(id);
  };
  ids.forEach(visit);
  return out;
}

export interface DiagAnswer {
  correct: boolean;
  sure: boolean;
}

export type DiagStep = { kind: 'ask'; nodeId: string; generatorId: string; tier: 1 | 2; confirm: boolean } | { kind: 'done' };

export interface DiagState {
  order: string[];
  index: number;
  /** Answers for the current skill. */
  answers: DiagAnswer[];
  results: Record<string, { level: DiagLevel; correct: number; asked: number }>;
}

export const startDiagnostic = (nodes: DiagNode[]): DiagState => ({ order: diagnosticOrder(nodes), index: 0, answers: [], results: {} });

/** Level from one or two answers. */
export function levelFrom(answers: DiagAnswer[]): DiagLevel | null {
  const [a, b] = answers;
  if (!a) return null;
  if (a.correct && a.sure) return 'strong';
  if (!b) return null;
  if (a.correct) return b.correct ? 'strong' : 'shaky';
  return b.correct ? 'shaky' : 'weak';
}

/** Skip skills whose prerequisites (inside the diagnostic) were all answered weak. Inferred results don't cascade further. */
function settle(s: DiagState, nodes: DiagNode[]): DiagState {
  let { index } = s;
  const results = { ...s.results };
  while (index < s.order.length) {
    const id = s.order[index];
    const pre = nodes.find((n) => n.id === id)!.prerequisites.filter((p) => s.order.includes(p));
    const allWeak = pre.length > 0 && pre.every((p) => results[p]?.level === 'weak');
    if (!allWeak) break;
    results[id] = { level: 'inferred-weak', correct: 0, asked: 0 };
    index++;
  }
  return { ...s, index, results };
}

export function nextStep(s: DiagState, nodes: DiagNode[]): { state: DiagState; step: DiagStep } {
  const st = s.answers.length ? s : settle(s, nodes);
  if (st.index >= st.order.length) return { state: st, step: { kind: 'done' } };
  const id = st.order[st.index];
  const [g1, g2] = DIAG_GENERATORS[id];
  if (!st.answers.length) return { state: st, step: { kind: 'ask', nodeId: id, generatorId: g1, tier: 2, confirm: false } };
  // Confirmation: easier after a miss, same level after a hesitant correct answer.
  return { state: st, step: { kind: 'ask', nodeId: id, generatorId: g2, tier: st.answers[0].correct ? 2 : 1, confirm: true } };
}

export function answer(s: DiagState, a: DiagAnswer): DiagState {
  const answers = [...s.answers, a];
  const level = levelFrom(answers);
  if (!level) return { ...s, answers };
  const id = s.order[s.index];
  return { ...s, index: s.index + 1, answers: [], results: { ...s.results, [id]: { level, correct: answers.filter((x) => x.correct).length, asked: answers.length } } };
}
