import { useLiveQuery } from 'dexie-react-hooks';
import { hasContent, NODES, UNITS } from '../content';
import { db, DEFAULT_SETTINGS, localDay, type DiagnosticRow, type NodeState, type Settings } from '../db/db';
import { buildPlan, type DiagLevel, type Plan, type PlanNode } from '../engine/planner';

/** Skills the planner and readiness model use (exam-skill nodes are practised inside other skills). */
export const PLAN_NODES: PlanNode[] = NODES.filter((n) => n.unit !== 'EXAM').map((n) => ({
  id: n.id,
  unit: n.unit,
  prerequisites: n.prerequisites,
  examEmphasis: n.examEmphasis,
  weakSpot: n.weakSpot,
  optional: n.scopeLimits.some((s) => /not directly assessed/i.test(s)),
}));

export const UNIT_SHARE: Record<string, number> = Object.fromEntries(UNITS.filter((u) => u.estimatedExamShare).map((u) => [u.id, u.estimatedExamShare as number]));

/** Settings merged with defaults; `undefined` while loading, `stored: false` if never saved. */
export function useSettings(): (Settings & { stored: boolean }) | undefined {
  return useLiveQuery(async () => {
    const s = await db.settings.get('main');
    return { ...DEFAULT_SETTINGS, ...s, stored: !!s };
  });
}

export function saveSettings(current: Settings, patch: Partial<Settings>) {
  const { stored: _s, ...rest } = current as Settings & { stored?: boolean };
  return db.settings.put({ ...rest, ...patch, id: 'main' });
}

export function planFor(settings: Settings, states: NodeState[], diag: DiagnosticRow[], today = localDay()): Plan {
  return buildPlan({
    today,
    examDate: settings.examDate,
    weeklyHours: settings.weeklyHours ?? DEFAULT_SETTINGS.weeklyHours!,
    studyDays: settings.studyDays ?? DEFAULT_SETTINGS.studyDays!,
    unitOrder: settings.unitOrder,
    currentUnit: settings.currentUnit ?? settings.unitOrder[0],
    nodes: PLAN_NODES,
    unitShare: UNIT_SHARE,
    mastered: new Set(states.filter((s) => s.mastered).map((s) => s.nodeId)),
    diagnostic: new Map(diag.map((d) => [d.nodeId, d.result as DiagLevel])),
  });
}

/** Everything the planner, Today page and dashboard need, in one live query. */
export function useLearner() {
  return useLiveQuery(async () => {
    const [states, diag, attempts] = await Promise.all([db.nodes.toArray(), db.diagnostic.toArray(), db.attempts.toArray()]);
    return { states, diag, attempts };
  });
}

/** Next skill to learn in a unit: one already started, else the first unmastered skill whose prerequisites are in place. */
export function nextInUnit(unit: string, states: NodeState[]): string | null {
  const by = new Map(states.map((s) => [s.nodeId, s]));
  const todo = NODES.filter((n) => n.unit === unit && hasContent(n.id) && !by.get(n.id)?.mastered);
  const started = todo.find((n) => (by.get(n.id)?.stage ?? 0) > 0);
  if (started) return started.id;
  const ready = todo.find((n) => n.prerequisites.every((p) => !todo.some((t) => t.id === p)));
  return (ready ?? todo[0])?.id ?? null;
}

export const DIAG_LABEL: Record<DiagLevel, string> = {
  strong: 'Solid',
  shaky: 'Shaky',
  weak: 'Needs repair',
  'inferred-weak': 'Needs repair (inferred)',
};

export const isWeak = (r?: DiagLevel) => r === 'weak' || r === 'inferred-weak';
