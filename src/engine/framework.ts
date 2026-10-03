import curriculum from '../content/curriculum.json';
import { close } from './check/ce';
import { Rng } from './rng';
import { Reject, type AnswerSpec, type Choice, type Draft, type Field, type Generator, type Item, type Tier } from './types';

const nodeOutcome = new Map(curriculum.nodes.map((n) => [n.id, n.outcome ?? '']));

/** Build an item deterministically. Rejected parameter draws retry with a derived seed. */
export function makeItem(gen: Generator, seed: number, tier: Tier): Item {
  for (let attempt = 0; attempt < 50; attempt++) {
    const rng = new Rng((seed + attempt * 7919) >>> 0);
    let d: Draft;
    try {
      d = gen.make(rng, tier);
    } catch (e) {
      if (e instanceof Reject) continue;
      throw e;
    }
    const item: Item = {
      ...d,
      id: `${gen.id}:${tier}:${seed}`,
      generatorId: gen.id,
      seed,
      tier,
      nodeId: gen.nodeId,
      outcome: nodeOutcome.get(gen.nodeId) ?? '',
    };
    if (item.choices) item.choices = new Rng(seed ^ 0x5bd1e995).shuffle(item.choices);
    return item;
  }
  throw new Error(`${gen.id} rejected 50 parameter draws for seed ${seed}`);
}

/** Distractor candidate: display text, comparison key, misconception id. */
export type Cand = { tex: string; key: number | string; mis: string; feedback?: string };

/**
 * Multiple choice from the correct answer and candidate distractors.
 * Keeps the first three candidates whose key differs from the answer and from each other.
 * Rejects (retry) if fewer than three survive, so options are never duplicated.
 */
export function mc(answer: { tex: string; key: number | string }, cands: Cand[]): Choice[] {
  const same = (a: number | string, b: number | string) => (typeof a === 'number' && typeof b === 'number' ? close(a, b) : a === b);
  const keep: Cand[] = [];
  for (const c of cands) {
    if (same(c.key, answer.key) || keep.some((k) => same(k.key, c.key)) || keep.some((k) => k.tex === c.tex) || c.tex === answer.tex) continue;
    keep.push(c);
    if (keep.length === 3) break;
  }
  if (keep.length < 3) throw new Reject('not enough distinct distractors');
  return [{ tex: answer.tex, correct: true }, ...keep.map((k) => ({ tex: k.tex, correct: false, misconception: k.mis, feedback: k.feedback }))];
}

/** Stable key for a point. */
export const pkey = (x: number, y: number) => `${+x.toFixed(6)},${+y.toFixed(6)}`;

export const field = (answer: AnswerSpec, prefix?: string, label?: string): Field => ({ answer, prefix, label });

export const m = (tex: string) => `$${tex}$`;
