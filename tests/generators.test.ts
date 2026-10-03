import { describe, expect, it } from 'vitest';
import curriculum from '../src/content/curriculum.json';
import { checkField } from '../src/engine/check';
import { makeItem } from '../src/engine/framework';
import { GENERATORS } from '../src/engine/generators';
import type { Item, Tier } from '../src/engine/types';

const SEEDS = Number(process.env.SEEDS ?? 150);
const misIds = new Set(curriculum.misconceptions.map((m) => m.id));
const nodeIds = new Set(curriculum.nodes.map((n) => n.id));
const BAD = /NaN|undefined|Infinity|\[object|null/;

function allText(it: Item): string {
  return [it.stem, ...(it.choices ?? []).map((c) => c.tex + (c.feedback ?? '')), ...it.hints, ...it.solution.map((s) => s.tex + (s.why ?? '')), ...(it.fields ?? []).map((f) => f.answer.tex)].join(' ');
}

describe.each(GENERATORS.map((g) => [g.id, g] as const))('%s', (_id, gen) => {
  it('targets a real skill node', () => {
    expect(nodeIds.has(gen.nodeId)).toBe(true);
  });
  it.each([1, 2, 3] as Tier[])('tier %i: valid, deterministic items', (tier) => {
    for (let seed = 0; seed < SEEDS; seed++) {
      const it = makeItem(gen, seed, tier);
      const again = makeItem(gen, seed, tier);
      expect(again.stem, `deterministic seed ${seed}`).toBe(it.stem);
      expect(it.hints.every((h) => h.trim().length > 0)).toBe(true);
      expect(it.solution.length).toBeGreaterThan(0);
      if (it.verify) expect(it.verify(), `independent check failed seed ${seed}`).toBe(true);
      const text = allText(it);
      expect(BAD.test(text), `bad text seed ${seed}: ${text.match(BAD)?.[0]} in ${text.slice(0, 300)}`).toBe(false);
      expect((text.match(/\$/g) ?? []).length % 2, `unbalanced $ seed ${seed}`).toBe(0);
      if (it.format === 'mc') {
        const ch = it.choices!;
        expect(ch.length).toBe(4);
        expect(ch.filter((c) => c.correct).length).toBe(1);
        expect(new Set(ch.map((c) => c.tex)).size, `duplicate options seed ${seed}`).toBe(4);
        for (const c of ch.filter((c) => !c.correct)) expect(misIds.has(c.misconception!), `misconception ${c.misconception}`).toBe(true);
      } else {
        expect(it.fields!.length).toBeGreaterThan(0);
        for (const f of it.fields!) {
          const v = checkField(f.answer, f.answer.tex);
          expect(v.ok, `seed ${seed}: canonical answer ${f.answer.tex} fails its own check (${v.reason})`).toBe(true);
        }
      }
    }
  });
});
