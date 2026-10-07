import { describe, expect, it } from 'vitest';
import { U1_LESSONS } from '../src/content/lessons/u1';
import { PRE_LESSONS } from '../src/content/lessons/pre';
import { U2_LESSONS } from '../src/content/lessons/u2';
import { U3_LESSONS } from '../src/content/lessons/u3';
import { U4_LESSONS } from '../src/content/lessons/u4';
import { U5_LESSONS } from '../src/content/lessons/u5';
import { U6_LESSONS } from '../src/content/lessons/u6';
import { EXAM_LESSONS } from '../src/content/lessons/exam';
import { NODE, NODES, nodesInUnit, sectionOf, UNITS } from '../src/content';
import { generatorById, generatorsFor } from '../src/engine/generators';
import { makeItem } from '../src/engine/framework';
import type { Lesson } from '../src/content/lessons/types';
import katex from 'katex';
import { CARD_MAP } from '../src/content/lessons/cards';

const words = (s: string) => s.replace(/\$[^$]*\$/g, ' M ').split(/\s+/).filter(Boolean).length;

/** Every $…$ in the text renders with KaTeX, and $ signs balance. */
function mathOk(t: string): string | null {
  if ((t.match(/\$/g) ?? []).length % 2) return `unbalanced $ in: ${t}`;
  for (const m of t.matchAll(/\$([^$]+)\$/g)) {
    try {
      katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' });
    } catch (e) {
      return `KaTeX: ${(e as Error).message} in: ${m[1]}`;
    }
  }
  return null;
}

function cardProblems(l: Lesson): string[] {
  const out: string[] = [];
  if (!l.cards) return out;
  if (l.cards.length < 4 || l.cards.length > 10) out.push(`${l.cards.length} cards (want 4 to 10)`);
  l.cards.forEach((c, i) => {
    const at = `card ${i + 1}`;
    if (words(c.say) > 45) out.push(`${at}: say has ${words(c.say)} words (max 45)`);
    if (c.example && (c.example.length < 1 || c.example.length > 7)) out.push(`${at}: example has ${c.example.length} lines (max 7)`);
    if (c.check) {
      const { options, answer, why, q } = c.check;
      if (options.length < 2 || options.length > 4) out.push(`${at}: ${options.length} options`);
      if (new Set(options).size !== options.length) out.push(`${at}: duplicate options`);
      if (!(answer >= 0 && answer < options.length)) out.push(`${at}: answer index out of range`);
      if (!why.trim() || !q.trim()) out.push(`${at}: empty question or why`);
    }
    for (const t of [c.say, ...(c.example ?? []), ...(c.check ? [c.check.q, c.check.why, ...c.check.options] : [])]) {
      const e = mathOk(t);
      if (e) out.push(`${at}: ${e}`);
    }
  });
  return out;
}

const ALL_LESSONS = [...PRE_LESSONS, ...U1_LESSONS, ...U2_LESSONS, ...U3_LESSONS, ...U4_LESSONS, ...U5_LESSONS, ...U6_LESSONS, ...EXAM_LESSONS].map((l) => ({ ...l, cards: l.cards ?? CARD_MAP[l.nodeId] }));

describe.each(
  UNITS.map((u) => [u.id, ALL_LESSONS.filter((l) => NODE.get(l.nodeId)?.unit === u.id)]) as [string, Lesson[]][],
)('%s content', (unit, lessons) => {
  it('every node has a lesson and at least 3 generators', () => {
    for (const n of nodesInUnit(unit)) {
      expect(lessons.some((l) => l.nodeId === n.id), `lesson for ${n.id}`).toBe(true);
      expect(generatorsFor(n.id).length, `generators for ${n.id}`).toBeGreaterThanOrEqual(3);
    }
  });
  it.each(lessons.map((l) => [l.nodeId, l] as const))('%s lesson is valid', (_id, l) => {
    expect(words(l.explain.join(' ')), 'explanation ≤ 200 words').toBeLessThanOrEqual(200);
    expect(cardProblems(l), 'lesson cards').toEqual([]);
    if (process.env.CARDS_REQUIRED) expect(l.cards, 'lesson has cards').toBeDefined();
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
