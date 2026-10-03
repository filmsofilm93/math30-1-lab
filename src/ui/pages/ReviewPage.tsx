import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { hasContent, NODE, nodesInUnit, UNITS } from '../../content';
import { db, type Mode, type NodeState } from '../../db/db';
import { recordAttempt } from '../../db/progress';
import { itemFor } from '../../engine/practice';
import type { Item, Tier } from '../../engine/types';
import { ItemView, type ItemResult } from '../components/ItemView';
import { btnGhost, btnPrimary, card, h1, h2, muted } from '../styles';

interface Session {
  title: string;
  queue: { nodeId: string; mode: Mode; tier: Tier }[];
  index: number;
  item: Item | null;
  right: number;
  /** Hide the skill name so you must pick the method yourself. */
  blind: boolean;
}

function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export function ReviewPage() {
  const states = useLiveQuery(() => db.nodes.toArray(), [], [] as NodeState[]);
  const practisedIds = useLiveQuery(async () => [...new Set((await db.attempts.toArray()).map((a) => a.nodeId))], [], [] as string[]);
  const [session, setSession] = useState<Session | null>(null);

  const now = Date.now();
  const due = states.filter((s) => s.card && s.card.due <= now).sort((a, b) => a.card!.due - b.card!.due);
  const practised = practisedIds.filter(hasContent);
  const warmCount = Math.min(5, Math.max(3, practised.length));

  function start(title: string, queue: Session['queue'], blind: boolean) {
    if (!queue.length) return;
    setSession({ title, queue, index: 0, item: itemFor(queue[0].nodeId, queue[0].tier), right: 0, blind });
  }

  function startDaily() {
    // 3-5 warm-up items, spread over as many practised skills as possible.
    const pool = shuffle(practised);
    const warm = Array.from({ length: warmCount }, (_, i) => ({ nodeId: pool[i % pool.length], mode: 'retrieval' as Mode, tier: 2 as Tier }));
    const reviews = shuffle(due.map((d) => ({ nodeId: d.nodeId, mode: 'review' as Mode, tier: 3 as Tier })));
    start('Daily review', [...warm, ...reviews], true);
  }

  function startMixed(unitId: string) {
    const learned = nodesInUnit(unitId).filter((n) => hasContent(n.id) && states.find((s) => s.nodeId === n.id && (s.mastered || s.stage >= 3)));
    const q = shuffle(Array.from({ length: 12 }, (_, i) => learned[i % learned.length])).map((n) => ({ nodeId: n.id, mode: 'practice' as Mode, tier: (Math.random() < 0.5 ? 2 : 3) as Tier }));
    start(`Mixed practice: ${UNITS.find((u) => u.id === unitId)?.title}`, q, true);
  }

  if (session) {
    const cur = session.queue[session.index];
    const finished = session.index >= session.queue.length;
    if (finished || !session.item)
      return (
        <div className="flex flex-col gap-4">
          <h1 className={h1}>Done</h1>
          <p>
            {session.right} of {session.queue.length} correct.
          </p>
          <button className={btnPrimary} onClick={() => setSession(null)}>
            Back to review
          </button>
        </div>
      );
    async function onDone(r: ItemResult) {
      const it = session!.item!;
      await recordAttempt({ nodeId: cur.nodeId, itemId: it.id, generatorId: it.generatorId, seed: it.seed, tier: it.tier, correct: r.correct, assisted: r.assisted, hints: r.hints, confidence: r.confidence, misconception: r.misconception, ms: r.ms, mode: cur.mode });
      setSession((s) => s && { ...s, right: s.right + (r.correct ? 1 : 0) });
    }
    function next() {
      setSession((s) => {
        if (!s) return s;
        const i = s.index + 1;
        return { ...s, index: i, item: i < s.queue.length ? itemFor(s.queue[i].nodeId, s.queue[i].tier) : null };
      });
    }
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className={h2}>{session.title}</h1>
          <span className={`text-sm tabular-nums ${muted}`}>
            {session.index + 1} / {session.queue.length}
          </span>
        </div>
        <p className={`text-xs ${muted}`}>{cur.mode === 'retrieval' ? 'Warm-up: recall without notes.' : session.blind ? 'Mixed: decide which method fits.' : NODE.get(cur.nodeId)?.title}</p>
        <ItemView key={session.item.id} item={session.item} onDone={onDone} onNext={next} nextLabel={session.index + 1 === session.queue.length ? 'Finish' : 'Next'} />
        <button className={`self-start text-sm ${muted} hover:underline`} onClick={() => setSession(null)}>
          End session
        </button>
      </div>
    );
  }

  const unitsWithContent = UNITS.filter((u) => nodesInUnit(u.id).some((n) => hasContent(n.id)));

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className={h1}>Review</h1>
        <p className={muted}>Each session opens with a short mixed warm-up, then the skills due for review. Intervals are set by FSRS and never extend past the exam.</p>
        {practised.length ? (
          <button className={btnPrimary} onClick={startDaily}>
            Start daily review ({warmCount} warm-up{due.length ? ` + ${due.length} due` : ''})
          </button>
        ) : (
          <p className={`${card} p-4`}>Nothing to review yet. Practise a skill first.</p>
        )}
      </section>

      {due.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className={h2}>Due now</h2>
          <ul className={`${card} divide-y divide-line dark:divide-line-d`}>
            {due.map((d) => (
              <li key={d.nodeId} className="px-4 py-2">
                {NODE.get(d.nodeId)?.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className={h2}>Mixed practice</h2>
        <p className={`text-sm ${muted}`}>Unlocks when half of a unit is mastered. Questions from different skills are shuffled and unlabelled, so you have to choose the method.</p>
        {unitsWithContent.map((u) => {
          const nodes = nodesInUnit(u.id);
          const m = nodes.filter((n) => states.find((s) => s.nodeId === n.id && s.mastered)).length;
          const unlocked = m * 2 >= nodes.length;
          return (
            <div key={u.id} className={`${card} flex items-center justify-between gap-3 px-4 py-3`}>
              <div>
                <p className="font-bold">{u.title}</p>
                <p className={`text-sm ${muted}`}>
                  {m}/{nodes.length} mastered{unlocked ? '' : ` · ${Math.ceil(nodes.length / 2) - m} more to unlock`}
                </p>
              </div>
              <button className={btnGhost} disabled={!unlocked} onClick={() => startMixed(u.id)}>
                Start
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
