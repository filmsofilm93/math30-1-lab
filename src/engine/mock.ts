// Mock diploma assembly: 24 MC + 8 NR + 3 written-response questions, weighted like the official blueprint.
import curriculum from '../content/curriculum.json';
import { makeItem } from './framework';
import { GENERATORS } from './generators';
import { toNR } from './nr';
import { Rng } from './rng';
import type { Cognitive, Generator, Item, Tier } from './types';
import { WR_TEMPLATES, wrNodes, type WrTemplate } from './wr';

export type Strand = 'RF' | 'T' | 'PCBT';
export const STRANDS: Strand[] = ['RF', 'T', 'PCBT'];
export const STRAND_NAME: Record<Strand, string> = { RF: 'Relations and functions', T: 'Trigonometry', PCBT: 'Permutations, combinations, binomial theorem' };

/** Machine-scored questions per strand: RF 17 (53%), T 10 (31%), PCBT 5 (16%), inside the official ranges. */
export const BLUEPRINT: Record<Strand, { mc: number; nr: number }> = {
  RF: { mc: 12, nr: 5 },
  T: { mc: 8, nr: 2 },
  PCBT: { mc: 4, nr: 1 },
};
export const MC_COUNT = 24;
export const NR_COUNT = 8;
export const WR_COUNT = 3;
export const WR_PART_MARKS = [2, 3] as const;
export const MACHINE_WEIGHT = curriculum.meta.exam.machineScored.weight; // 0.75
export const TARGET_MIX: Record<Cognitive, number> = curriculum.meta.exam.cognitiveMix as Record<Cognitive, number>;

const NODE = new Map(curriculum.nodes.map((n) => [n.id, n]));
export const strandOf = (nodeId: string): Strand | null => {
  const o = NODE.get(nodeId)?.outcome ?? '';
  return o.startsWith('PCBT') ? 'PCBT' : o.startsWith('RF') ? 'RF' : o.startsWith('T') ? 'T' : null;
};

export interface MockSlot {
  kind: 'mc' | 'nr';
  generatorId: string;
  seed: number;
  tier: Tier;
}
export interface WrSlot {
  templateId: string;
  seed: number;
}
export interface MockPaper {
  seed: number;
  slots: MockSlot[]; // 24 MC then 8 NR
  wr: WrSlot[];
  /** Strands that had to borrow questions because the chosen units were too narrow. */
  notes: string[];
}

/** Build the item for a slot; NR slots become numerical-response items. */
export function slotItem(s: MockSlot): Item {
  const g = GENERATORS.find((x) => x.id === s.generatorId)!;
  const it = makeItem(g, s.seed, s.tier);
  return s.kind === 'nr' ? toNR(it)! : it;
}

interface Cand {
  g: Generator;
  seed: number;
  tier: Tier;
  cognitive: Cognitive;
  weight: number;
}

/**
 * Assemble a paper. `units` limits the pool (e.g. units studied so far); null means the whole course.
 * Picks distinct skills where possible, weights skills by exam emphasis, and steers the cognitive mix
 * toward 34% conceptual / 36% problem solving / 30% procedural.
 */
export function assembleMock(seed: number, units: string[] | null = null): MockPaper {
  const rng = new Rng(seed);
  const notes: string[] = [];
  const inScope = (nodeId: string) => {
    const n = NODE.get(nodeId);
    return !!n && n.unit !== 'PRE' && n.unit !== 'EXAM' && (!units || units.includes(n.unit));
  };
  const usedNodes = new Set<string>();
  const usedGens = new Set<string>();
  const mix: Record<Cognitive, number> = { conceptual: 0, problemSolving: 0, procedural: 0 };
  let picked = 0;

  const cache = new Map<string, Cand[]>();
  const candidates = (strand: Strand, kind: 'mc' | 'nr'): Cand[] => {
    const key = strand + kind;
    if (!cache.has(key)) cache.set(key, buildPool(strand, kind));
    return cache.get(key)!.filter((c) => !usedGens.has(c.g.id));
  };
  const buildPool = (strand: Strand, kind: 'mc' | 'nr'): Cand[] => {
    const out: Cand[] = [];
    for (const g of GENERATORS) {
      if (!inScope(g.nodeId) || strandOf(g.nodeId) !== strand) continue;
      const tier = (rng.chance(0.5) ? 2 : 3) as Tier;
      const s = rng.int(1, 1_000_000);
      let it: Item;
      try {
        it = makeItem(g, s, tier);
      } catch {
        continue;
      }
      if (kind === 'mc' ? it.format !== 'mc' : !toNR(it)) continue;
      const n = NODE.get(g.nodeId)!;
      out.push({ g, seed: s, tier, cognitive: it.cognitive, weight: n.examEmphasis + (n.weakSpot ? 1 : 0) });
    }
    return out;
  };

  const choose = (cands: Cand[]): Cand | undefined => {
    if (!cands.length) return undefined;
    // Prefer an unused skill, then the cognitive level furthest below target, then exam emphasis (randomised).
    const fresh = cands.filter((c) => !usedNodes.has(c.g.nodeId));
    const pool = fresh.length ? fresh : cands;
    const need = (c: Cognitive) => TARGET_MIX[c] * (picked + 1) - mix[c];
    const best = Math.max(...pool.map((c) => need(c.cognitive)));
    const top = pool.filter((c) => need(c.cognitive) >= best - 0.5);
    const total = top.reduce((s, c) => s + c.weight, 0);
    let r = rng.next() * total;
    for (const c of top) if ((r -= c.weight) <= 0) return c;
    return top[top.length - 1];
  };

  const slots: MockSlot[] = [];
  for (const kind of ['mc', 'nr'] as const) {
    // Strands with fewer candidates than needed borrow from the others.
    let shortfall = 0;
    for (const strand of STRANDS) {
      const want = BLUEPRINT[strand][kind];
      let got = 0;
      for (let i = 0; i < want; i++) {
        const c = choose(candidates(strand, kind));
        if (!c) break;
        slots.push({ kind, generatorId: c.g.id, seed: c.seed, tier: c.tier });
        usedNodes.add(c.g.nodeId);
        usedGens.add(c.g.id);
        mix[c.cognitive]++;
        picked++;
        got++;
      }
      if (got < want) {
        shortfall += want - got;
        notes.push(`${STRAND_NAME[strand]}: ${got} of ${want} ${kind === 'mc' ? 'multiple-choice' : 'numerical-response'} questions (not enough skills in the units chosen).`);
      }
    }
    for (let i = 0; i < shortfall; i++) {
      const c = choose(STRANDS.flatMap((s) => candidates(s, kind)));
      if (!c) break;
      slots.push({ kind, generatorId: c.g.id, seed: c.seed, tier: c.tier });
      usedNodes.add(c.g.nodeId);
      usedGens.add(c.g.id);
      mix[c.cognitive]++;
      picked++;
    }
  }
  // Mix the strands within each part, as on the real exam.
  const mc = rng.shuffle(slots.filter((s) => s.kind === 'mc'));
  const nr = rng.shuffle(slots.filter((s) => s.kind === 'nr'));

  // Written response: one relations-and-functions, one trigonometry, and a third from either RF or PCBT.
  const wrPool = (pred: (t: WrTemplate) => boolean) => WR_TEMPLATES.filter((t) => pred(t) && wrNodes(t).every(inScope));
  const wr: WrSlot[] = [];
  const takeWr = (pred: (t: WrTemplate) => boolean) => {
    const pool = wrPool((t) => pred(t) && !wr.some((w) => w.templateId === t.id));
    if (pool.length) wr.push({ templateId: rng.pick(pool).id, seed: rng.int(1, 1_000_000) });
  };
  takeWr((t) => t.strand === 'RF');
  takeWr((t) => t.strand === 'T');
  takeWr((t) => t.strand === (rng.chance(0.5) ? 'PCBT' : 'RF'));
  while (wr.length < WR_COUNT) {
    const before = wr.length;
    takeWr(() => true);
    if (wr.length === before) break;
  }
  if (wr.length < WR_COUNT) notes.push(`Written response: ${wr.length} of ${WR_COUNT} questions (the units chosen don't cover more).`);

  return { seed, slots: [...mc, ...nr], wr, notes };
}

/** Cognitive mix of a paper's machine-scored questions, as fractions. */
export function paperMix(p: MockPaper): Record<Cognitive, number> {
  const m: Record<Cognitive, number> = { conceptual: 0, problemSolving: 0, procedural: 0 };
  for (const s of p.slots) m[slotItem(s).cognitive]++;
  const n = p.slots.length || 1;
  return { conceptual: m.conceptual / n, problemSolving: m.problemSolving / n, procedural: m.procedural / n };
}
