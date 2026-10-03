import { describe, expect, it } from 'vitest';
import { U1_LESSONS } from '../src/content/lessons/u1';
import { nodesInUnit } from '../src/content';
import { generatorById, generatorsFor } from '../src/engine/generators';
import { makeItem } from '../src/engine/framework';

const words = (s: string) => s.replace(/\$[^$]*\$/g, ' M ').split(/\s+/).filter(Boolean).length;

describe('unit 1 content', () => {
  it('every unit 1 node has a lesson and at least 3 generators', () => {
    for (const n of nodesInUnit('U1')) {
      expect(U1_LESSONS.some((l) => l.nodeId === n.id), `lesson for ${n.id}`).toBe(true);
      expect(generatorsFor(n.id).length, `generators for ${n.id}`).toBeGreaterThanOrEqual(3);
    }
  });
  it.each(U1_LESSONS.map((l) => [l.nodeId, l] as const))('%s lesson is valid', (_id, l) => {
    expect(words(l.explain.join(' ')), 'explanation ≤ 200 words').toBeLessThanOrEqual(200);
    expect(l.explore.predict.answer).toBeLessThan(l.explore.predict.options.length);
    expect(l.examples.length).toBeGreaterThan(0);
    for (const e of l.examples) {
      const g = generatorById(e.generatorId);
      expect(g, e.generatorId).toBeDefined();
      expect(g!.nodeId, `${e.generatorId} belongs to ${l.nodeId}`).toBe(l.nodeId);
      expect(makeItem(g!, e.seed, e.tier).solution.length).toBeGreaterThan(1);
    }
  });
});
