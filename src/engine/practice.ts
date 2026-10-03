import { makeItem } from './framework';
import { generatorsFor } from './generators';
import { randomSeed } from './rng';
import type { Item, Tier } from './types';

export interface PracticeHistory {
  generatorId: string;
  tier: number;
  correct: boolean;
  assisted: boolean;
}

/** Adaptive tier: move up after 3 unassisted correct in a row at the current tier, down after 2 misses. */
export function nextTier(history: PracticeHistory[]): Tier {
  if (!history.length) return 1;
  let tier = 1;
  let streak = 0;
  let misses = 0;
  for (const h of history) {
    if (h.correct && !h.assisted) {
      streak++;
      misses = 0;
      if (streak >= 3 && tier < 3) {
        tier++;
        streak = 0;
      }
    } else if (!h.correct) {
      misses++;
      streak = 0;
      if (misses >= 2 && tier > 1) {
        tier--;
        misses = 0;
      }
    }
  }
  return tier as Tier;
}

/** Pick the generator used least recently, so every item type comes up. */
export function nextGenerator(nodeId: string, history: PracticeHistory[], rand = Math.random) {
  const gens = generatorsFor(nodeId);
  if (!gens.length) return null;
  const lastUse = new Map<string, number>();
  history.forEach((h, i) => lastUse.set(h.generatorId, i));
  const ranked = gens.map((g) => ({ g, t: lastUse.get(g.id) ?? -1 - rand() })).sort((a, b) => a.t - b.t);
  return ranked[0].g;
}

export function nextPracticeItem(nodeId: string, history: PracticeHistory[], tierOverride?: Tier): Item | null {
  const g = nextGenerator(nodeId, history);
  if (!g) return null;
  return makeItem(g, randomSeed(), tierOverride ?? nextTier(history.filter((h) => generatorsFor(nodeId).some((x) => x.id === h.generatorId))));
}

/** An item from a random generator of the node at a given tier (faded practice, reviews). */
export function itemFor(nodeId: string, tier: Tier, avoid?: string): Item | null {
  const gens = generatorsFor(nodeId).filter((g) => g.id !== avoid);
  const pool = gens.length ? gens : generatorsFor(nodeId);
  if (!pool.length) return null;
  return makeItem(pool[Math.floor(Math.random() * pool.length)], randomSeed(), tier);
}
