import { describe, expect, it } from 'vitest';
import { DIRECTING_WORDS, FORMULA_SHEET, SCORING_GUIDE } from '../src/content/exam';
import { NODE } from '../src/content';
import { makeItem } from '../src/engine/framework';
import { GENERATORS } from '../src/engine/generators';
import { compileTrig, equivalentTex, IDENTITY_PROBLEMS } from '../src/engine/identity';
import { assembleMock, BLUEPRINT, MC_COUNT, NR_COUNT, paperMix, slotItem, strandOf, STRANDS, WR_COUNT } from '../src/engine/mock';
import { checkNR, recordValue, toNR, valueSpec } from '../src/engine/nr';
import { scoreMock } from '../src/engine/mockScore';
import { makeWr, PROOF_LINES, WR_TEMPLATES, wrNodes } from '../src/engine/wr';

const BAD = /NaN|undefined|Infinity|\[object|null/;

describe('numerical response', () => {
  it('records values as the bulletin says', () => {
    expect(recordValue(5.33333, 'tenth')).toBe('5.3');
    expect(recordValue(0.254, 'hundredth')).toBe('0.25');
    expect(recordValue(-0.437, 'hundredth')).toBe('0.44');
    expect(recordValue(16.6, 'whole')).toBe('17');
    expect(valueSpec(123.45, 'hundredth')).toBeNull();
    expect(valueSpec(-2.5, 'tenth')).toMatchObject({ negative: true, record: '2.5' });
  });
  it('scores entries and names recording errors', () => {
    const s = valueSpec(0.25, 'hundredth')!;
    expect(checkNR(s, '0.25').ok).toBe(true);
    expect(checkNR(s, '.25')).toMatchObject({ ok: false, note: expect.stringMatching(/0 before/) });
    expect(checkNR(s, '0.250').ok).toBe(false);
    expect(checkNR(valueSpec(5.3, 'tenth')!, '5.30').ok).toBe(false);
    expect(checkNR(valueSpec(-2.5, 'tenth')!, '-2.5').note).toMatch(/sign/);
    expect(checkNR({ kind: 'code', record: '134', order: 'any' }, '431').ok).toBe(true);
    expect(checkNR({ kind: 'code', record: '4123', order: 'correct' }, '1234').note).toMatch(/order/);
    expect(checkNR({ kind: 'code', record: '4123', order: 'correct' }, '4123').ok).toBe(true);
  });
  it('converts single-number items, and their record passes its own check', () => {
    let n = 0;
    for (const g of GENERATORS) {
      const it0 = makeItem(g, 7, 2);
      const nr = toNR(it0);
      if (!nr) continue;
      n++;
      expect(nr.format).toBe('nr');
      expect(nr.nr!.record.length).toBeLessThanOrEqual(4);
      expect(checkNR(nr.nr!, nr.nr!.record).ok, g.id).toBe(true);
    }
    expect(n).toBeGreaterThan(40);
  });
});

describe('mock diploma', () => {
  it.each([1, 2, 3, 42, 2027])('seed %i follows the blueprint', (seed) => {
    const p = assembleMock(seed);
    expect(p.notes).toEqual([]);
    expect(p.slots.filter((s) => s.kind === 'mc').length).toBe(MC_COUNT);
    expect(p.slots.filter((s) => s.kind === 'nr').length).toBe(NR_COUNT);
    expect(p.wr.length).toBe(WR_COUNT);
    for (const st of STRANDS) {
      const items = p.slots.filter((s) => strandOf(GENERATORS.find((g) => g.id === s.generatorId)!.nodeId) === st);
      expect(items.length, st).toBe(BLUEPRINT[st].mc + BLUEPRINT[st].nr);
    }
    expect(new Set(p.slots.map((s) => s.generatorId)).size).toBe(32);
    for (const s of p.slots) {
      const it = slotItem(s);
      expect(it.format).toBe(s.kind === 'mc' ? 'mc' : 'nr');
      expect(BAD.test(it.stem)).toBe(false);
    }
    const mix = paperMix(p);
    expect(Math.abs(mix.conceptual - 0.34)).toBeLessThan(0.1);
    expect(Math.abs(mix.problemSolving - 0.36)).toBeLessThan(0.1);
    expect(Math.abs(mix.procedural - 0.3)).toBeLessThan(0.1);
    const wrStrands = p.wr.map((w) => WR_TEMPLATES.find((t) => t.id === w.templateId)!.strand);
    expect(wrStrands).toContain('RF');
    expect(wrStrands).toContain('T');
  });
  it('is deterministic', () => {
    expect(assembleMock(9)).toEqual(assembleMock(9));
  });
  it('narrow unit choices still give a paper, with notes', () => {
    const p = assembleMock(5, ['U1', 'RAD']);
    expect(p.slots.length).toBeGreaterThan(0);
    expect(p.notes.length).toBeGreaterThan(0);
    for (const s of p.slots) expect(['U1', 'RAD']).toContain(NODE.get(GENERATORS.find((g) => g.id === s.generatorId)!.nodeId)!.unit);
  });
});

describe('written response', () => {
  it.each(WR_TEMPLATES.map((t) => [t.id, t] as const))('%s builds valid questions', (_id, t) => {
    expect(wrNodes(t).length).toBe(2);
    for (let seed = 1; seed <= 60; seed++) {
      const q = makeWr(t.id, seed);
      expect(q.parts.map((p) => p.marks)).toEqual([2, 3]);
      for (const p of q.parts) {
        expect(p.rubric.length).toBe(p.marks);
        expect(p.solution.length).toBeGreaterThan(0);
        const text = [p.prompt, p.answer, ...p.rubric, ...p.solution.map((s) => s.tex + (s.why ?? ''))].join(' ');
        expect(BAD.test(text), `${t.id} seed ${seed}: ${text.match(BAD)?.[0]}`).toBe(false);
        expect((text.match(/\$/g) ?? []).length % 2, `${t.id} seed ${seed} unbalanced $`).toBe(0);
      }
    }
  });
  it('every identity has a full proof whose consecutive lines are equivalent', () => {
    for (const p of IDENTITY_PROBLEMS) {
      const proof = PROOF_LINES[p.id];
      expect(proof, p.id).toBeDefined();
      expect(proof.why.length).toBe(proof.lines.length - 1);
      expect(equivalentTex(proof.lines[0], p.lhs), `${p.id} starts at the left side`).toBe(true);
      expect(equivalentTex(proof.lines[proof.lines.length - 1], p.rhs), `${p.id} ends at the right side`).toBe(true);
      for (let i = 1; i < proof.lines.length; i++) {
        expect(compileTrig(proof.lines[i]), `${p.id} line ${i} parses`).not.toBeNull();
        expect(equivalentTex(proof.lines[i - 1], proof.lines[i]), `${p.id} line ${i}: ${proof.lines[i]}`).toBe(true);
      }
    }
  });
});

describe('reference material', () => {
  it('has the official lists', () => {
    expect(DIRECTING_WORDS.length).toBe(17);
    expect(SCORING_GUIDE[2].map((l) => l.score)).toEqual(['NR', 0, 1, 2]);
    expect(SCORING_GUIDE[3].map((l) => l.score)).toEqual(['NR', 0, 1, 2, 3]);
    expect(FORMULA_SHEET.map((s) => s.title)).toEqual([null, 'Relations and Functions', 'Permutations, Combinations, and the Binomial Theorem', 'Trigonometry']);
  });
});

describe('mock scoring', () => {
  const p = assembleMock(11);
  const perfect = p.slots.map((s) => {
    const it = slotItem(s);
    return it.format === 'mc' ? it.choices!.findIndex((c) => c.correct) : it.nr!.record;
  });
  it('full marks score 100% and a blank paper 0%', () => {
    const top = scoreMock(p, perfect, p.wr.map(() => [2, 3]));
    expect(top.percent).toBeCloseTo(1);
    expect(top.plan).toEqual([]);
    const blank = scoreMock(p, p.slots.map(() => null), []);
    expect(blank.percent).toBe(0);
    expect(blank.plan.length).toBeGreaterThan(0);
    expect(blank.plan.reduce((t, l) => t + l.lost, 0)).toBeCloseTo(1);
  });
  it('weights machine scoring 75% and written response 25%', () => {
    expect(scoreMock(p, perfect, p.wr.map(() => [0, 0])).percent).toBeCloseTo(0.75);
    const r = scoreMock(p, p.slots.map(() => null), p.wr.map(() => [2, 3]));
    expect(r.percent).toBeCloseTo(0.25);
    expect(r.low).toBeLessThan(r.percent);
    expect(r.high).toBeGreaterThan(r.percent);
  });
  it('flags NR recording errors', () => {
    const i = p.slots.findIndex((s) => s.kind === 'nr' && slotItem(s).nr!.record.startsWith('0.'));
    if (i < 0) return;
    const a = perfect.slice();
    a[i] = (a[i] as string).slice(1);
    expect(scoreMock(p, a, []).recordingErrors).toBe(1);
  });
});
