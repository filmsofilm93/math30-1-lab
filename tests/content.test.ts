import { describe, expect, it } from 'vitest';
import { U1_LESSONS } from '../src/content/lessons/u1';
import { PRE_LESSONS } from '../src/content/lessons/pre';
import { U2_LESSONS } from '../src/content/lessons/u2';
import { U3_LESSONS } from '../src/content/lessons/u3';
import { U4_LESSONS } from '../src/content/lessons/u4';
import { U5_LESSONS } from '../src/content/lessons/u5';
import { U6_LESSONS } from '../src/content/lessons/u6';
import { NODE, NODES, nodesInUnit, sectionOf, UNITS } from '../src/content';
import { generatorById, generatorsFor } from '../src/engine/generators';
import { makeItem } from '../src/engine/framework';
import type { Lesson } from '../src/content/lessons/types';

const words = (s: string) => s.replace(/\$[^$]*\$/g, ' M ').split(/\s+/).filter(Boolean).length;

const ALL_LESSONS = [...PRE_LESSONS, ...U1_LESSONS, ...U2_LESSONS, ...U3_LESSONS, ...U4_LESSONS, ...U5_LESSONS, ...U6_LESSONS];

describe.each(
  UNITS.filter((u) => u.id !== 'EXAM').map((u) => [u.id, ALL_LESSONS.filter((l) => NODE.get(l.nodeId)?.unit === u.id)]) as [string, Lesson[]][],
)('%s content', (unit, lessons) => {
  it('every node has a lesson and at least 3 generators', () => {
    for (const n of nodesInUnit(unit)) {
      expect(lessons.some((l) => l.nodeId === n.id), `lesson for ${n.id}`).toBe(true);
      expect(generatorsFor(n.id).length, `generators for ${n.id}`).toBeGreaterThanOrEqual(3);
    }
  });
  it.each(lessons.map((l) => [l.nodeId, l] as const))('%s lesson is valid', (_id, l) => {
    expect(words(l.explain.join(' ')), 'explanation ≤ 200 words').toBeLessThanOrEqual(200);
    if (l.explore) expect(l.explore.predict.answer).toBeLessThan(l.explore.predict.options.length);
    expect(l.examples.length).toBeGreaterThan(0);
    for (const e of l.examples) {
      const g = generatorById(e.generatorId);
      expect(g, e.generatorId).toBeDefined();
      expect(g!.nodeId, `${e.generatorId} belongs to ${l.nodeId}`).toBe(l.nodeId);
      expect(makeItem(g!, e.seed, e.tier).solution.length).toBeGreaterThan(1);
    }
  });
});

describe('workbook order', () => {
  it('every course skill has a workbook section, and sections rise through the default unit order', () => {
    const course = NODES.filter((n) => n.unit !== 'PRE' && n.unit !== 'EXAM');
    for (const n of course) expect(sectionOf(n), n.id).toMatch(/^\d+\.\d$/);
    const nums = course.map((n) => sectionOf(n)!.split('.').map(Number));
    for (let i = 1; i < nums.length; i++) expect(nums[i][0] * 10 + nums[i][1]).toBeGreaterThanOrEqual(nums[i - 1][0] * 10 + nums[i - 1][1]);
  });
});
