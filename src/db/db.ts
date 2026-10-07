import Dexie, { type EntityTable } from 'dexie';
import type { MockPaper } from '../engine/mock';

export type Confidence = 'sure' | 'unsure' | 'guess';
export type Mode = 'faded' | 'practice' | 'review' | 'retrieval' | 'diagnostic' | 'repair' | 'mock';

export interface Attempt {
  id?: number;
  nodeId: string;
  itemId: string;
  generatorId: string;
  seed: number;
  tier: number;
  at: number; // epoch ms
  day: string; // local YYYY-MM-DD
  correct: boolean;
  /** Hints, faded steps or a revealed solution were used before answering. */
  assisted: boolean;
  hints: number;
  confidence: Confidence;
  misconception?: string;
  ms: number;
  mode: Mode;
}

/** FSRS card fields, stored as plain data. */
export interface StoredCard {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  learning_steps: number;
  state: number;
  last_review?: number;
}

export interface NodeState {
  nodeId: string;
  mastered: boolean;
  masteredAt?: number;
  card?: StoredCard;
  /** Consecutive wrong unassisted answers, for prerequisite routing. */
  fails: number;
  /** Furthest loop stage reached: 0 explore, 1 explain, 2 faded, 3 practice. */
  stage: number;
  updatedAt: number;
}

export interface Settings {
  id: 'main';
  examDate: string;
  theme: 'system' | 'light' | 'dark';
  unitOrder: string[];
  /** Planned study hours per week. */
  weeklyHours?: number;
  /** Days of the week you can study, 0 = Sunday. */
  studyDays?: number[];
  /** Unit you are on now; earlier units in the order count as catch-up. */
  currentUnit?: string;
  setupDone?: boolean;
  /** Anthropic API key for optional written-response feedback. Stays on this device: never exported. */
  apiKey?: string;
  /** When a backup was last exported (epoch ms). */
  lastExportAt?: number;
}

/** One written-response question in a mock: typed work, photos of handwritten work, and scores. */
export interface MockWr {
  text: string;
  photos: Blob[];
  /** Self-score per part (half marks allowed); null until scored. */
  scores: (number | null)[];
  /** Claude's feedback per part, if requested. */
  ai?: ({ score: number; feedback: string } | null)[];
}

export interface MockRow {
  id?: number;
  seed: number;
  /** Units the paper was drawn from; null = whole course. */
  units: string[] | null;
  paper: MockPaper;
  createdAt: number;
  /** Time spent with the mock open, in ms (the clock runs only while you are writing). */
  elapsedMs: number;
  /** Extra minutes added beyond the 3 hours (up to 3 more hours). */
  extraMinutes: number;
  /** Per machine-scored slot: choice index (MC) or the recorded string (NR). */
  answers: (number | string | null)[];
  flags: number[];
  wr: MockWr[];
  /** 'writing' → 'marking' (self-scoring WR) → 'done'. */
  status: 'writing' | 'marking' | 'done';
  submittedAt?: number;
}

/** Diagnostic outcome for one prerequisite skill. */
export type DiagResult = 'strong' | 'shaky' | 'weak' | 'inferred-weak';

export interface DiagnosticRow {
  nodeId: string;
  result: DiagResult;
  correct: number;
  asked: number;
  at: number;
}

/** Active study time per local day. */
export interface DayRow {
  day: string;
  seconds: number;
}

export interface Report {
  id?: number;
  itemId: string;
  nodeId: string;
  note: string;
  at: number;
}

export const db = new Dexie('math30-1-lab') as Dexie & {
  attempts: EntityTable<Attempt, 'id'>;
  nodes: EntityTable<NodeState, 'nodeId'>;
  settings: EntityTable<Settings, 'id'>;
  reports: EntityTable<Report, 'id'>;
  diagnostic: EntityTable<DiagnosticRow, 'nodeId'>;
  days: EntityTable<DayRow, 'day'>;
  mocks: EntityTable<MockRow, 'id'>;
};

db.version(1).stores({
  attempts: '++id, nodeId, day, at, misconception, [nodeId+at]',
  nodes: 'nodeId, mastered',
  settings: 'id',
  reports: '++id, at',
});

db.version(2).stores({
  diagnostic: 'nodeId',
  days: 'day',
});

// v3: units follow the workbook (radicals and function operations became their own units).
db.version(3)
  .stores({})
  .upgrade((tx) =>
    tx
      .table('settings')
      .toCollection()
      .modify((s: Settings) => {
        s.unitOrder = migrateUnitOrder(s.unitOrder);
      }),
  );

// v4: mock diploma exams.
db.version(4).stores({ mocks: '++id, createdAt, status' });

export const DEFAULT_SETTINGS: Settings = {
  id: 'main',
  examDate: '2027-01-20',
  theme: 'system',
  unitOrder: ['U1', 'RAD', 'U2', 'U4', 'U3', 'U5', 'OPS', 'U6'],
  weeklyHours: 6,
  studyDays: [1, 2, 3, 4, 6],
  currentUnit: 'U1',
};

export async function getSettings(): Promise<Settings> {
  return (await db.settings.get('main')) ?? DEFAULT_SETTINGS;
}

const OLD_DEFAULT_ORDER = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'];

/** Orders saved before the workbook reorder: the untouched old default becomes the new default; a custom order gets the new units next to the ones they were split from. */
export function migrateUnitOrder(order: string[]): string[] {
  if (order.join() === OLD_DEFAULT_ORDER.join()) return DEFAULT_SETTINGS.unitOrder.slice();
  const out = order.slice();
  if (!out.includes('RAD')) out.splice(out.includes('U5') ? out.indexOf('U5') : out.length, 0, 'RAD');
  if (!out.includes('OPS')) out.splice(out.includes('U1') ? out.indexOf('U1') + 1 : out.length, 0, 'OPS');
  return out;
}

export function localDay(t = Date.now()): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Everything, as JSON, for export/backup. */
export async function exportAll(): Promise<string> {
  const [attempts, nodes, settings, reports, diagnostic, days, mocks] = await Promise.all([db.attempts.toArray(), db.nodes.toArray(), db.settings.toArray(), db.reports.toArray(), db.diagnostic.toArray(), db.days.toArray(), db.mocks.toArray()]);
  // The API key never leaves the device; photos are left out to keep the file small.
  const safeSettings = settings.map(({ apiKey: _k, ...s }) => s);
  const safeMocks = mocks.map((mk) => ({ ...mk, wr: mk.wr.map((w) => ({ ...w, photos: [] })) }));
  return JSON.stringify({ app: 'math30-1-lab', version: 3, exportedAt: new Date().toISOString(), attempts, nodes, settings: safeSettings, reports, diagnostic, days, mocks: safeMocks });
}

export async function importAll(json: string): Promise<void> {
  const data = JSON.parse(json);
  if (data.app !== 'math30-1-lab') throw new Error('This file is not a Math 30-1 Lab backup.');
  const key = (await db.settings.get('main'))?.apiKey;
  await db.transaction('rw', [db.attempts, db.nodes, db.settings, db.reports, db.diagnostic, db.days, db.mocks], async () => {
    await Promise.all([db.attempts.clear(), db.nodes.clear(), db.settings.clear(), db.reports.clear(), db.diagnostic.clear(), db.days.clear(), db.mocks.clear()]);
    await db.attempts.bulkAdd(data.attempts ?? []);
    await db.nodes.bulkPut(data.nodes ?? []);
    await db.settings.bulkPut((data.settings ?? []).map((s: Settings) => ({ ...s, apiKey: key, unitOrder: migrateUnitOrder(s.unitOrder ?? DEFAULT_SETTINGS.unitOrder) })));
    await db.reports.bulkAdd(data.reports ?? []);
    await db.diagnostic.bulkPut(data.diagnostic ?? []);
    await db.days.bulkPut(data.days ?? []);
    await db.mocks.bulkAdd(data.mocks ?? []);
  });
}

/** Add active seconds to today's total. */
export async function addStudySeconds(seconds: number, t = Date.now()) {
  const day = localDay(t);
  await db.transaction('rw', db.days, async () => {
    const row = await db.days.get(day);
    await db.days.put({ day, seconds: (row?.seconds ?? 0) + seconds });
  });
}
