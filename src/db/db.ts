import Dexie, { type EntityTable } from 'dexie';

export type Confidence = 'sure' | 'unsure' | 'guess';
export type Mode = 'faded' | 'practice' | 'review' | 'retrieval';

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
};

db.version(1).stores({
  attempts: '++id, nodeId, day, at, misconception, [nodeId+at]',
  nodes: 'nodeId, mastered',
  settings: 'id',
  reports: '++id, at',
});

export const DEFAULT_SETTINGS: Settings = {
  id: 'main',
  examDate: '2027-01-20',
  theme: 'system',
  unitOrder: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6'],
};

export async function getSettings(): Promise<Settings> {
  return (await db.settings.get('main')) ?? DEFAULT_SETTINGS;
}

export function localDay(t = Date.now()): string {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Everything, as JSON, for export/backup. */
export async function exportAll(): Promise<string> {
  const [attempts, nodes, settings, reports] = await Promise.all([db.attempts.toArray(), db.nodes.toArray(), db.settings.toArray(), db.reports.toArray()]);
  return JSON.stringify({ app: 'math30-1-lab', version: 1, exportedAt: new Date().toISOString(), attempts, nodes, settings, reports });
}

export async function importAll(json: string): Promise<void> {
  const data = JSON.parse(json);
  if (data.app !== 'math30-1-lab') throw new Error('This file is not a Math 30-1 Lab backup.');
  await db.transaction('rw', db.attempts, db.nodes, db.settings, db.reports, async () => {
    await Promise.all([db.attempts.clear(), db.nodes.clear(), db.settings.clear(), db.reports.clear()]);
    await db.attempts.bulkAdd(data.attempts ?? []);
    await db.nodes.bulkPut(data.nodes ?? []);
    await db.settings.bulkPut(data.settings ?? []);
    await db.reports.bulkAdd(data.reports ?? []);
  });
}
