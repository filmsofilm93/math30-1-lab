import { masteryStatus, ROUTING_FAILS } from '../engine/mastery';
import { review } from '../engine/srs';
import { db, getSettings, localDay, type Attempt, type NodeState } from './db';

export async function nodeState(nodeId: string): Promise<NodeState> {
  return (await db.nodes.get(nodeId)) ?? { nodeId, mastered: false, fails: 0, stage: 0, updatedAt: 0 };
}

export async function setStage(nodeId: string, stage: number) {
  const s = await nodeState(nodeId);
  if (stage > s.stage) await db.nodes.put({ ...s, stage, updatedAt: Date.now() });
}

export interface RecordResult {
  justMastered: boolean;
  needsRepair: boolean;
  mastery: ReturnType<typeof masteryStatus>;
}

/** Store an attempt, update mastery, the review card and the failure streak. */
export async function recordAttempt(a: Omit<Attempt, 'id' | 'day' | 'at'> & { at?: number }): Promise<RecordResult> {
  const at = a.at ?? Date.now();
  const attempt: Attempt = { ...a, at, day: localDay(at) };
  const settings = await getSettings();
  return db.transaction('rw', db.attempts, db.nodes, async () => {
    await db.attempts.add(attempt);
    const s = await nodeState(a.nodeId);
    const history = await db.attempts.where('[nodeId+at]').between([a.nodeId, 0], [a.nodeId, Infinity]).toArray();
    const mastery = masteryStatus(history);
    const counts = !a.assisted && a.mode !== 'faded';
    // Diagnostic misses are expected and must not trigger repair prompts.
    const fails = counts && a.mode !== 'diagnostic' ? (a.correct ? 0 : s.fails + 1) : s.fails;
    const justMastered = !s.mastered && mastery.mastered;
    let card = s.card;
    // Reviews update the card; first mastery creates it.
    if (justMastered) card = review(undefined, true, 'sure', settings.examDate, at);
    else if (s.mastered && counts && (a.mode === 'review' || a.mode === 'retrieval' || a.mode === 'practice')) card = review(card, a.correct, a.confidence, settings.examDate, at);
    await db.nodes.put({ ...s, mastered: s.mastered || mastery.mastered, masteredAt: justMastered ? at : s.masteredAt, card, fails: fails >= ROUTING_FAILS ? 0 : fails, updatedAt: at });
    return { justMastered, needsRepair: fails >= ROUTING_FAILS, mastery };
  });
}
