import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { hasContent, NODE, nodesInUnit, UNITS } from '../../content';
import { db, type Mode, type NodeState } from '../../db/db';
import type { Tier } from '../../engine/types';
import { SessionRunner, shuffle, type QueueEntry } from '../components/SessionRunner';
import { btnGhost, btnPrimary, card, h1, h2, muted } from '../styles';

interface Session {
  title: string;
  queue: QueueEntry[];
  /** Hide the skill name so you must pick the method yourself. */
  blind: boolean;
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
    setSession({ title, queue, blind });
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

  if (session) return <SessionRunner title={session.title} queue={session.queue} blind={session.blind} onExit={() => setSession(null)} doneLabel="Back to review" />;

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
