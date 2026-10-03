/**
 * Countdown planner. Pure: everything it needs comes in as arguments.
 *
 * Model (estimates, stated to the learner):
 * - The last 21 days before the exam are reserved for mixed review and at least 3 mock exams.
 * - Learning hours available = study days in the learning window × hours per study day × 0.8
 *   (20% slack for missed days and the daily reviews that keep old skills alive).
 * - Hours per unmastered skill = (0.75 + 0.25 × exam emphasis) [+ 0.25 if it is a known exam weak spot]
 *   × (0.85 + the unit's estimated exam share). Units taught before the current one are catch-up: × 0.6.
 * - Prerequisite repair: weak 1 h, shaky 0.5 h, attached to the first planned unit that needs it.
 */

export type DiagLevel = 'strong' | 'shaky' | 'weak' | 'inferred-weak';

export interface PlanNode {
  id: string;
  unit: string;
  prerequisites: string[];
  examEmphasis: number;
  weakSpot: boolean;
  optional?: boolean;
}

export interface PlanInput {
  today: string; // YYYY-MM-DD
  examDate: string;
  weeklyHours: number;
  studyDays: number[]; // 0 = Sunday
  unitOrder: string[];
  currentUnit: string;
  nodes: PlanNode[];
  unitShare: Record<string, number>;
  mastered: Set<string>;
  diagnostic: Map<string, DiagLevel>;
}

export interface PlanBlock {
  unit: string;
  kind: 'catch-up' | 'learn' | 'review';
  start: string;
  end: string; // inclusive
  hours: number; // needed
  skills: number; // unmastered skills to learn
  repair: string[]; // prerequisite node ids to repair inside this block
}

export interface Plan {
  daysLeft: number;
  reviewStart: string;
  learnStudyDays: number;
  reviewStudyDays: number;
  hoursPerDay: number;
  availableHours: number;
  neededHours: number;
  fits: boolean;
  /** Weekly hours that would make the plan fit (rounded up to 0.5). */
  hoursToFit: number;
  blocks: PlanBlock[];
  mockDates: string[];
  warnings: string[];
}

export const REVIEW_DAYS = 21;
export const SLACK = 0.8;
export const MOCKS = 3;
const CATCH_UP = 0.6;
const DAY = 86_400_000;

const toT = (d: string) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
const toD = (t: number) => new Date(t).toISOString().slice(0, 10);
export const addDays = (d: string, n: number) => toD(toT(d) + n * DAY);
export const daysBetween = (a: string, b: string) => Math.round((toT(b) - toT(a)) / DAY);
const weekday = (d: string) => new Date(toT(d)).getUTCDay();

/** Study dates from `from` (inclusive) to `to` (exclusive). */
export function studyDates(from: string, to: string, studyDays: number[]): string[] {
  const out: string[] = [];
  for (let d = from; d < to; d = addDays(d, 1)) if (studyDays.includes(weekday(d))) out.push(d);
  return out;
}

export function nodeHours(n: PlanNode, share: number) {
  return (0.75 + 0.25 * n.examEmphasis + (n.weakSpot ? 0.25 : 0)) * (0.85 + share);
}

export function repairHours(level: DiagLevel | undefined) {
  return level === 'weak' || level === 'inferred-weak' ? 1 : level === 'shaky' ? 0.5 : 0;
}

export function buildPlan(p: PlanInput): Plan {
  const warnings: string[] = [];
  const daysLeft = Math.max(0, daysBetween(p.today, p.examDate));
  const reviewStart = daysLeft > REVIEW_DAYS ? addDays(p.examDate, -REVIEW_DAYS) : p.today;
  const days = p.studyDays.length ? p.studyDays : [0, 1, 2, 3, 4, 5, 6];
  const learnDates = studyDates(p.today, reviewStart, days);
  const reviewDates = studyDates(reviewStart, p.examDate, days);
  const hoursPerDay = p.weeklyHours / days.length;
  const availableHours = learnDates.length * hoursPerDay * SLACK;

  // Unit sequence: current unit, then units already taught (catch-up), then the rest.
  const order = p.unitOrder.filter((u) => p.nodes.some((n) => n.unit === u));
  const cur = Math.max(0, order.indexOf(p.currentUnit));
  const seq = [
    { unit: order[cur], kind: 'learn' as const },
    ...order.slice(0, cur).map((unit) => ({ unit, kind: 'catch-up' as const })),
    ...order.slice(cur + 1).map((unit) => ({ unit, kind: 'learn' as const })),
  ].filter((s) => s.unit) as { unit: string; kind: 'learn' | 'catch-up' }[];

  // Prerequisite repairs go to the first unit in the sequence that depends on them.
  const repairs = p.nodes.filter((n) => n.unit === 'PRE' && !n.optional && repairHours(p.diagnostic.get(n.id)) > 0 && !p.mastered.has(n.id));
  const repairAt = new Map<string, string[]>();
  for (const r of repairs) {
    const target = seq.find((s) => p.nodes.some((n) => n.unit === s.unit && n.prerequisites.includes(r.id)))?.unit ?? seq[0]?.unit;
    if (target) repairAt.set(target, [...(repairAt.get(target) ?? []), r.id]);
  }
  // Prerequisite order inside each block.
  const preOrder = p.nodes.filter((n) => n.unit === 'PRE').map((n) => n.id);
  for (const [u, ids] of repairAt) repairAt.set(u, ids.sort((a, b) => preOrder.indexOf(a) - preOrder.indexOf(b)));

  const needs = seq.map((s) => {
    const todo = p.nodes.filter((n) => n.unit === s.unit && !n.optional && !p.mastered.has(n.id));
    const share = p.unitShare[s.unit] ?? 0.1;
    const learn = todo.reduce((h, n) => h + nodeHours(n, share), 0) * (s.kind === 'catch-up' ? CATCH_UP : 1);
    const rep = (repairAt.get(s.unit) ?? []).reduce((h, id) => h + repairHours(p.diagnostic.get(id)), 0);
    return { ...s, hours: learn + rep, skills: todo.length, repair: repairAt.get(s.unit) ?? [] };
  });
  const neededHours = needs.reduce((h, n) => h + n.hours, 0);
  const fits = neededHours <= availableHours + 1e-9;
  const studyWeeksEquivalent = learnDates.length / days.length;
  const hoursToFit = studyWeeksEquivalent > 0 ? Math.ceil((neededHours / SLACK / studyWeeksEquivalent) * 2) / 2 : Infinity;

  // Lay the blocks over the learning dates in proportion to need.
  const blocks: PlanBlock[] = [];
  const active = needs.filter((n) => n.hours > 0);
  if (learnDates.length && active.length) {
    let used = 0;
    let acc = 0;
    active.forEach((n, i) => {
      acc += n.hours;
      const endIdx = i === active.length - 1 ? learnDates.length : Math.max(used + 1, Math.round((acc / neededHours) * learnDates.length));
      const last = Math.min(endIdx, learnDates.length) - 1;
      const first = Math.min(used, learnDates.length - 1);
      blocks.push({ unit: n.unit, kind: n.kind, start: learnDates[first], end: learnDates[Math.max(first, last)], hours: round1(n.hours), skills: n.skills, repair: n.repair });
      used = Math.max(used, last + 1);
    });
  }
  blocks.push({ unit: 'ALL', kind: 'review', start: reviewStart, end: addDays(p.examDate, -1), hours: round1(reviewDates.length * hoursPerDay), skills: 0, repair: [] });

  // Mocks: spread over the review window, the last one at least 2 days before the exam.
  const mockPool = reviewDates.filter((d) => daysBetween(d, p.examDate) >= 2);
  const mockDates = spread(mockPool.length ? mockPool : reviewDates, MOCKS);

  if (daysLeft <= REVIEW_DAYS) warnings.push(`The exam is ${daysLeft} days away, inside the 3-week review window. There is no time set aside for new units: the plan is mixed review and mock exams only.`);
  else if (!fits)
    warnings.push(
      `This plan does not fit. Learning the remaining material needs about ${Math.round(neededHours)} h, but ${p.weeklyHours} h a week gives about ${Math.round(availableHours)} h before review starts (${learnDates.length} study days × ${round1(hoursPerDay)} h × 80%). ` +
        `Options: raise your weekly hours to about ${hoursToFit}, add study days, or accept that some skills will be learned to a lower level. The dates below are compressed to fit.`,
    );
  if (mockDates.length < MOCKS) warnings.push(`Only ${mockDates.length} study day${mockDates.length === 1 ? '' : 's'} fit in the review window, so fewer than ${MOCKS} mock exams are scheduled. Add study days if you can.`);
  if (hoursPerDay * SLACK < 3 && mockDates.length) warnings.push(`A full mock exam takes 3 hours; your study days average ${round1(hoursPerDay)} h. Plan longer sittings on the mock dates.`);

  return { daysLeft, reviewStart, learnStudyDays: learnDates.length, reviewStudyDays: reviewDates.length, hoursPerDay: round1(hoursPerDay), availableHours: round1(availableHours), neededHours: round1(neededHours), fits, hoursToFit, blocks, mockDates, warnings };
}

/** The block covering `date` (or the next one), for the daily session builder. */
export function blockOn(plan: Plan, date: string): PlanBlock | undefined {
  return plan.blocks.find((b) => date <= b.end) ?? plan.blocks[plan.blocks.length - 1];
}

function spread(dates: string[], n: number): string[] {
  if (dates.length <= n) return dates.slice();
  // Evenly spaced, ending on the last date.
  return Array.from({ length: n }, (_, i) => dates[Math.round(((i + 1) * (dates.length - 1)) / n)]);
}

const round1 = (x: number) => Math.round(x * 10) / 10;
