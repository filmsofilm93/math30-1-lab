// Scoring and the post-mock report: marks by strand and skill, projected diploma range, review plan.
import curriculum from '../content/curriculum.json';
import { checkNR } from './nr';
import { MACHINE_WEIGHT, slotItem, strandOf, STRANDS, type MockPaper, type Strand } from './mock';
import type { Item } from './types';
import { makeWr, type WrQuestion } from './wr';

const NODE = new Map(curriculum.nodes.map((n) => [n.id, n]));
const Z80 = 1.2816;

export interface SlotResult {
  index: number;
  item: Item;
  answer: number | string | null;
  correct: boolean;
  /** NR recording error (leading zero, order, sign, rounding), if that is why it was marked wrong. */
  recording?: string;
}

export interface SkillLoss {
  nodeId: string;
  title: string;
  /** Exam percentage points lost on this skill in this paper. */
  lost: number;
  where: string[];
}

export interface MockReport {
  machine: { correct: number; total: number };
  wr: { marks: number; total: number; scored: boolean };
  /** Weighted exam percentage, 0..1. */
  percent: number;
  /** 80% range for a diploma written today, from this paper alone. */
  low: number;
  high: number;
  byStrand: { strand: Strand; correct: number; total: number; wrMarks: number; wrTotal: number }[];
  slots: SlotResult[];
  plan: SkillLoss[];
  recordingErrors: number;
}

/** Score a paper. `wrScores[q][part]` is the self-score (null = not scored, counted as 0). */
export function scoreMock(paper: MockPaper, answers: (number | string | null)[], wrScores: (number | null)[][]): MockReport {
  const slots: SlotResult[] = paper.slots.map((s, i) => {
    const item = slotItem(s);
    const a = answers[i] ?? null;
    if (item.format === 'mc') return { index: i, item, answer: a, correct: typeof a === 'number' && !!item.choices![a]?.correct };
    const v = typeof a === 'string' && a.trim() ? checkNR(item.nr!, a) : { ok: false };
    return { index: i, item, answer: a, correct: v.ok, recording: !v.ok && 'note' in v && v.note && /0 before|order|sign|Round|digits/.test(v.note) ? v.note : undefined };
  });
  const qs: WrQuestion[] = paper.wr.map((w) => makeWr(w.templateId, w.seed));
  const machineTotal = slots.length;
  const machineCorrect = slots.filter((s) => s.correct).length;
  const wrTotal = qs.length * 5;
  const wrMarks = qs.reduce((t, q, i) => t + q.parts.reduce((u, _p, j) => u + (wrScores[i]?.[j] ?? 0), 0), 0);
  const scored = qs.every((q, i) => q.parts.every((_p, j) => wrScores[i]?.[j] != null));

  // Weights: machine-scored 75% split over 32 questions; written response 25% over 15 marks.
  // A short paper (narrow units) keeps the official weights.
  const mW = machineTotal ? MACHINE_WEIGHT / machineTotal : 0;
  const wW = wrTotal ? (1 - MACHINE_WEIGHT) / wrTotal : 0;
  const wrShare = wrTotal ? 1 - MACHINE_WEIGHT : 0;
  const norm = (machineTotal ? MACHINE_WEIGHT : 0) + wrShare || 1;
  const p = machineTotal ? machineCorrect / machineTotal : 0;
  const q = wrTotal ? wrMarks / wrTotal : 0;
  const percent = (MACHINE_WEIGHT * p * (machineTotal ? 1 : 0) + wrShare * q) / norm;
  // Sampling error of one paper: binomial on the 32 items, and roughly 6 independent "units" of WR judgement.
  const se = Math.sqrt(((MACHINE_WEIGHT / norm) ** 2 * (p * (1 - p) + 0.02)) / Math.max(1, machineTotal) + ((wrShare / norm) ** 2 * (q * (1 - q) + 0.02)) / 6);
  const half = Math.max(Z80 * se, 0.05);

  const byStrand = STRANDS.map((st) => {
    const ss = slots.filter((s) => strandOf(s.item.nodeId) === st);
    const wq = qs.map((qq, i) => ({ qq, i })).filter(({ qq }) => qq.strand === st);
    return {
      strand: st,
      correct: ss.filter((s) => s.correct).length,
      total: ss.length,
      wrMarks: wq.reduce((t, { qq, i }) => t + qq.parts.reduce((u, _p, j) => u + (wrScores[i]?.[j] ?? 0), 0), 0),
      wrTotal: wq.length * 5,
    };
  });

  const loss = new Map<string, SkillLoss>();
  const add = (nodeId: string, lost: number, where: string) => {
    const n = NODE.get(nodeId);
    const cur = loss.get(nodeId) ?? { nodeId, title: n?.title ?? nodeId, lost: 0, where: [] };
    cur.lost += lost / norm;
    cur.where.push(where);
    loss.set(nodeId, cur);
  };
  for (const s of slots) if (!s.correct) add(s.item.nodeId, mW, `${s.item.format === 'mc' ? 'MC' : 'NR'} ${s.item.format === 'mc' ? s.index + 1 : s.index + 1 - slots.filter((x) => x.item.format === 'mc').length}`);
  qs.forEach((qq, i) =>
    qq.parts.forEach((pt, j) => {
      const got = wrScores[i]?.[j] ?? 0;
      if (got < pt.marks) add(pt.nodeId, (pt.marks - got) * wW, `WR ${i + 1}${'ab'[j]}`);
    }),
  );
  const plan = [...loss.values()].sort((a, b) => b.lost * (1 + (NODE.get(b.nodeId)?.examEmphasis ?? 1) / 3) - a.lost * (1 + (NODE.get(a.nodeId)?.examEmphasis ?? 1) / 3));

  return {
    machine: { correct: machineCorrect, total: machineTotal },
    wr: { marks: wrMarks, total: wrTotal, scored },
    percent,
    low: Math.max(0, percent - half),
    high: Math.min(1, percent + half),
    byStrand,
    slots,
    plan,
    recordingErrors: slots.filter((s) => s.recording).length,
  };
}

/** Half-mark steps a part can score. */
export const markSteps = (marks: 2 | 3) => Array.from({ length: marks * 2 + 1 }, (_, i) => i / 2);
