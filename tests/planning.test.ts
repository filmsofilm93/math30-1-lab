import { describe, expect, it } from 'vitest';
import { NODES, UNITS } from '../src/content';
import { DEFAULT_SETTINGS, migrateUnitOrder } from '../src/db/db';
import { generatorById } from '../src/engine/generators';
import { addDays, buildPlan, daysBetween, studyDates, type PlanInput } from '../src/engine/planner';
import { buildSession, SESSION_LENGTHS, type SessionContext } from '../src/engine/session';
import { nodeEstimate, readiness } from '../src/engine/readiness';
import { answer, DIAG_GENERATORS, diagnosticOrder, levelFrom, nextStep, startDiagnostic } from '../src/engine/diagnostic';

const planNodes = NODES.filter((n) => n.unit !== 'EXAM').map((n) => ({ ...n, optional: n.scopeLimits.some((s) => /not directly assessed/i.test(s)) }));
const unitShare = Object.fromEntries(UNITS.filter((u) => u.estimatedExamShare).map((u) => [u.id, u.estimatedExamShare as number]));
const base: PlanInput = {
  today: '2026-10-05',
  examDate: '2027-01-20',
  weeklyHours: 8,
  studyDays: [1, 2, 3, 4, 6],
  unitOrder: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'],
  currentUnit: 'U1',
  nodes: planNodes,
  unitShare,
  mastered: new Set(),
  diagnostic: new Map(),
};

describe('planner', () => {
  it('date helpers', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(daysBetween('2026-10-05', '2027-01-20')).toBe(107);
    expect(studyDates('2026-10-05', '2026-10-12', [1, 3])).toEqual(['2026-10-05', '2026-10-07']);
  });
  it('reserves the last 3 weeks and schedules 3 mocks inside them', () => {
    const p = buildPlan(base);
    expect(p.reviewStart).toBe('2026-12-30');
    expect(p.mockDates).toHaveLength(3);
    for (const d of p.mockDates) {
      expect(d >= p.reviewStart).toBe(true);
      expect(daysBetween(d, base.examDate)).toBeGreaterThanOrEqual(2);
    }
    const review = p.blocks.at(-1)!;
    expect(review.kind).toBe('review');
    expect(review.end).toBe('2027-01-19');
  });
  it('blocks are contiguous, ordered, and cover every unit from the current one', () => {
    const p = buildPlan({ ...base, currentUnit: 'U3' });
    const learn = p.blocks.filter((b) => b.kind !== 'review');
    expect(learn.map((b) => b.unit)).toEqual(['U3', 'U1', 'U2', 'U4', 'U5', 'U6']);
    expect(learn.map((b) => b.kind)).toEqual(['learn', 'catch-up', 'catch-up', 'learn', 'learn', 'learn']);
    for (let i = 1; i < learn.length; i++) expect(learn[i].start > learn[i - 1].end).toBe(true);
    expect(learn.at(-1)!.end < p.reviewStart).toBe(true);
  });
  it('warns honestly when the hours do not fit, and says what would fit', () => {
    const p = buildPlan({ ...base, weeklyHours: 3 });
    expect(p.fits).toBe(false);
    expect(p.warnings.join(' ')).toMatch(/does not fit/);
    const q = buildPlan({ ...base, weeklyHours: p.hoursToFit });
    expect(q.fits).toBe(true);
  });
  it('weak prerequisites add repair time to the first unit that needs them', () => {
    const diagnostic = new Map([['P.func-notation', 'weak' as const], ['P.ref-angle', 'shaky' as const], ['P.sine-cos-law', 'weak' as const]]);
    const p = buildPlan({ ...base, diagnostic });
    const without = buildPlan(base);
    expect(p.neededHours - without.neededHours).toBeCloseTo(1.5, 5); // optional sine/cosine law ignored
    expect(p.blocks.find((b) => b.unit === 'U1')!.repair).toEqual(['P.func-notation']);
    expect(p.blocks.find((b) => b.unit === 'U4')!.repair).toEqual(['P.ref-angle']);
  });
  it('mastered skills need no time', () => {
    const all = new Set(planNodes.filter((n) => n.unit === 'U1').map((n) => n.id));
    const p = buildPlan({ ...base, mastered: all });
    expect(p.blocks.some((b) => b.unit === 'U1')).toBe(false);
  });
  it('inside the review window there is no learning', () => {
    const p = buildPlan({ ...base, today: '2027-01-05' });
    expect(p.blocks).toHaveLength(1);
    expect(p.warnings[0]).toMatch(/inside the 3-week review window/);
  });
});

describe('session builder', () => {
  const ctx: SessionContext = { practised: ['a', 'b', 'c', 'd'], due: ['a', 'b', 'c', 'd', 'e', 'f', 'g'], repair: ['P.abs'], learn: 'RF2.translate', mixedPool: ['a', 'b', 'c'], reviewPhase: false };
  it.each(SESSION_LENGTHS)('%i minutes fits the budget', (m) => {
    const s = buildSession(m, ctx);
    const total = s.reduce((t, b) => t + b.minutes, 0);
    expect(total).toBeLessThanOrEqual(m);
    expect(total).toBeGreaterThanOrEqual(m - 2);
    expect(s[0].kind).toBe('warm');
    expect(s.some((b) => b.kind === 'learn')).toBe(true);
  });
  it('longer sessions add repair and interleaving', () => {
    const s = buildSession(45, ctx).map((b) => b.kind);
    expect(s).toEqual(['warm', 'review', 'repair', 'learn', 'mixed']);
  });
  it('a first session is all learning', () => {
    const s = buildSession(25, { practised: [], due: [], repair: [], learn: 'RF2.translate', mixedPool: [], reviewPhase: false });
    expect(s).toEqual([{ kind: 'learn', minutes: 25, nodeIds: ['RF2.translate'] }]);
  });
  it('review phase replaces learning with mixed practice', () => {
    const s = buildSession(60, { ...ctx, reviewPhase: true });
    expect(s.some((b) => b.kind === 'learn')).toBe(false);
    expect(s.at(-1)!.kind).toBe('mixed');
  });
});

describe('readiness', () => {
  const nodes = planNodes.filter((n) => n.unit !== 'PRE');
  it('with no data the estimate is the prior and the range is wide', () => {
    const r = readiness(nodes, [], unitShare);
    expect(r.mean).toBeCloseTo(0.3, 5);
    expect(r.high - r.low).toBeGreaterThan(0.4);
    expect(r.coverage).toBe(0);
  });
  it('strong data everywhere narrows the range but never below ±5 points', () => {
    const attempts = nodes.flatMap((n) => Array.from({ length: 20 }, (_, i) => ({ nodeId: n.id, correct: i % 10 !== 0, assisted: false, mode: 'practice' })));
    const r = readiness(nodes, attempts, unitShare);
    expect(r.mean).toBeCloseTo(0.8, 5); // (18 + 1.2) / 24
    expect(r.high - r.low).toBeGreaterThanOrEqual(0.1 - 1e-9);
    expect(r.high - r.low).toBeLessThan(0.25);
    expect(r.coverage).toBeCloseTo(1, 5);
  });
  it('assisted and faded attempts are ignored', () => {
    expect(nodeEstimate([{ nodeId: 'x', correct: true, assisted: true, mode: 'practice' }, { nodeId: 'x', correct: true, assisted: false, mode: 'faded' }]).n).toBe(0);
  });
});

describe('diagnostic', () => {
  const pre = NODES.filter((n) => n.unit === 'PRE');
  it('covers every assessed prerequisite, in dependency order, with real generators', () => {
    const order = diagnosticOrder(pre);
    expect(order).toHaveLength(15);
    expect(order).not.toContain('P.sine-cos-law');
    for (const id of order) {
      for (const p of pre.find((n) => n.id === id)!.prerequisites) if (order.includes(p)) expect(order.indexOf(p)).toBeLessThan(order.indexOf(id));
      for (const g of DIAG_GENERATORS[id]) expect(generatorById(g)?.nodeId, g).toBe(id);
    }
  });
  it('levels', () => {
    expect(levelFrom([{ correct: true, sure: true }])).toBe('strong');
    expect(levelFrom([{ correct: true, sure: false }])).toBeNull();
    expect(levelFrom([{ correct: true, sure: false }, { correct: false, sure: true }])).toBe('shaky');
    expect(levelFrom([{ correct: false, sure: true }, { correct: true, sure: true }])).toBe('shaky');
    expect(levelFrom([{ correct: false, sure: true }, { correct: false, sure: false }])).toBe('weak');
  });
  it('all-sure-correct takes one item per skill; all-wrong infers dependants', () => {
    let s = startDiagnostic(pre);
    let asked = 0;
    for (;;) {
      const { state, step } = nextStep(s, pre);
      if (step.kind === 'done') break;
      asked++;
      s = answer(state, { correct: true, sure: true });
    }
    expect(asked).toBe(15);
    s = startDiagnostic(pre);
    asked = 0;
    for (;;) {
      const { state, step } = nextStep(s, pre);
      if (step.kind === 'done') {
        s = state;
        break;
      }
      asked++;
      s = answer(state, { correct: false, sure: false });
    }
    expect(s.results['P.factor-trinomial'].level).toBe('inferred-weak');
    // Inferred results don't cascade: quadratics is still asked, and its dependants are then inferred.
    expect(s.results['P.quad-solve'].level).toBe('weak');
    expect(s.results['P.quad-vertex'].level).toBe('inferred-weak');
    expect(s.results['P.ref-angle'].level).toBe('weak');
    expect(Object.keys(s.results)).toHaveLength(15);
    expect(asked).toBe(2 * Object.values(s.results).filter((r) => r.level === 'weak').length);
    expect(asked).toBeLessThan(2 * 15);
  });
});

describe('unit order migration', () => {
  it('replaces the old default and slots new units into a custom order', () => {
    expect(migrateUnitOrder(['U1', 'U2', 'U3', 'U4', 'U5', 'U6'])).toEqual(DEFAULT_SETTINGS.unitOrder);
    expect(migrateUnitOrder(['U4', 'U1', 'U2', 'U3', 'U5', 'U6'])).toEqual(['U4', 'U1', 'OPS', 'U2', 'U3', 'RAD', 'U5', 'U6']);
    expect(migrateUnitOrder(DEFAULT_SETTINGS.unitOrder)).toEqual(DEFAULT_SETTINGS.unitOrder);
  });
});
