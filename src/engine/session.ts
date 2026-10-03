/**
 * Daily session builder. Given a time budget and the learner's state, it splits the session into
 * blocks: warm-up retrieval, due reviews, prerequisite repair, new learning and interleaved practice.
 * About 2 minutes per practice item.
 */

export type SessionMinutes = 15 | 25 | 45 | 60;
export const SESSION_LENGTHS: SessionMinutes[] = [15, 25, 45, 60];
export const MIN_PER_ITEM = 2;

export type BlockKind = 'warm' | 'review' | 'repair' | 'learn' | 'mixed';

export interface SessionBlock {
  kind: BlockKind;
  minutes: number;
  /** Item blocks: one node per item. Learn/repair blocks: the node to open. */
  nodeIds: string[];
}

export interface SessionContext {
  /** Practised skills with content, for warm-up retrieval. */
  practised: string[];
  /** Skills whose review is due, most overdue first. */
  due: string[];
  /** Prerequisite skills flagged by the diagnostic and not yet mastered, in order. */
  repair: string[];
  /** Next skill to learn, from the plan. */
  learn: string | null;
  /** Skills eligible for interleaved practice (mastered or at the practice stage). */
  mixedPool: string[];
  /** In the final 3 weeks there is no new learning. */
  reviewPhase: boolean;
}

const TEMPLATE: Record<SessionMinutes, { warm: number; review: number; repair: number; mixed: number }> = {
  15: { warm: 2, review: 2, repair: 0, mixed: 0 },
  25: { warm: 3, review: 3, repair: 10, mixed: 2 },
  45: { warm: 3, review: 5, repair: 10, mixed: 4 },
  60: { warm: 4, review: 6, repair: 10, mixed: 5 },
};

export function buildSession(minutes: SessionMinutes, ctx: SessionContext, rand = Math.random): SessionBlock[] {
  const t = TEMPLATE[minutes];
  const blocks: SessionBlock[] = [];
  let left = minutes;
  const items = (kind: BlockKind, ids: string[]) => {
    if (!ids.length) return;
    blocks.push({ kind, minutes: ids.length * MIN_PER_ITEM, nodeIds: ids });
    left -= ids.length * MIN_PER_ITEM;
  };

  if (ctx.practised.length) items('warm', cycle(shuffle(ctx.practised, rand), t.warm));
  items('review', ctx.due.slice(0, ctx.reviewPhase ? t.review * 2 : t.review));

  const repair = ctx.repair[0];
  // A 15-minute session still repairs if a prerequisite blocks the next skill.
  const repairMin = repair ? (t.repair || (ctx.learn ? 0 : 10)) : 0;
  if (repair && repairMin && left - repairMin >= (ctx.learn && !ctx.reviewPhase ? 8 : 0)) {
    blocks.push({ kind: 'repair', minutes: repairMin, nodeIds: [repair] });
    left -= repairMin;
  }

  const mixedPool = ctx.mixedPool.length ? ctx.mixedPool : ctx.practised;
  if (ctx.reviewPhase || !ctx.learn) {
    // No new learning: the rest is interleaved practice.
    const n = Math.floor(left / MIN_PER_ITEM);
    if (mixedPool.length && n > 0) items('mixed', cycle(shuffle(mixedPool, rand), n));
  } else {
    const mixedN = mixedPool.length >= 2 ? Math.min(t.mixed, Math.floor((left - 8) / MIN_PER_ITEM)) : 0;
    const learnMin = left - Math.max(0, mixedN) * MIN_PER_ITEM;
    blocks.push({ kind: 'learn', minutes: learnMin, nodeIds: [ctx.learn] });
    left -= learnMin;
    if (mixedN > 0) items('mixed', cycle(shuffle(mixedPool, rand), mixedN));
  }
  // Put learning before the mixed block, and keep warm-up first.
  return blocks;
}

function shuffle<T>(a: T[], rand: () => number): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** n items from a pool, spreading over as many distinct entries as possible. */
function cycle<T>(pool: T[], n: number): T[] {
  return pool.length ? Array.from({ length: n }, (_, i) => pool[i % pool.length]) : [];
}
