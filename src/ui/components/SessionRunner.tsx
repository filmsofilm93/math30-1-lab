import { useState } from 'react';
import { NODE } from '../../content';
import type { Mode } from '../../db/db';
import { recordAttempt } from '../../db/progress';
import { itemFor } from '../../engine/practice';
import type { Item, Tier } from '../../engine/types';
import { btnPrimary, h1, h2, muted } from '../styles';
import { ItemView, type ItemResult } from './ItemView';

export interface QueueEntry {
  nodeId: string;
  mode: Mode;
  tier: Tier;
}

export function shuffle<T>(a: T[]): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Runs a queue of items, records each attempt, then shows the score. */
export function SessionRunner({ title, queue, blind, onExit, doneLabel = 'Back' }: { title: string; queue: QueueEntry[]; blind: boolean; onExit: (right: number, total: number) => void; doneLabel?: string }) {
  const [index, setIndex] = useState(0);
  const [item, setItem] = useState<Item | null>(() => (queue.length ? itemFor(queue[0].nodeId, queue[0].tier) : null));
  const [right, setRight] = useState(0);
  const cur = queue[index];

  if (index >= queue.length || !item)
    return (
      <div className="flex flex-col gap-4">
        <h1 className={h1}>Done</h1>
        <p>
          {right} of {queue.length} correct.
        </p>
        <button className={btnPrimary} onClick={() => onExit(right, queue.length)}>
          {doneLabel}
        </button>
      </div>
    );

  async function onDone(r: ItemResult) {
    await recordAttempt({ nodeId: cur.nodeId, itemId: item!.id, generatorId: item!.generatorId, seed: item!.seed, tier: item!.tier, correct: r.correct, assisted: r.assisted, hints: r.hints, confidence: r.confidence, misconception: r.misconception, ms: r.ms, mode: cur.mode });
    if (r.correct) setRight((x) => x + 1);
  }
  function next() {
    const i = index + 1;
    setIndex(i);
    setItem(i < queue.length ? itemFor(queue[i].nodeId, queue[i].tier) : null);
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className={h2}>{title}</h1>
        <span className={`text-sm tabular-nums ${muted}`}>
          {index + 1} / {queue.length}
        </span>
      </div>
      <p className={`text-xs ${muted}`}>{cur.mode === 'retrieval' ? 'Warm-up: recall without notes.' : blind ? 'Mixed: decide which method fits.' : NODE.get(cur.nodeId)?.title}</p>
      <ItemView key={item.id} item={item} onDone={onDone} onNext={next} nextLabel={index + 1 === queue.length ? 'Finish' : 'Next'} />
      <button className={`self-start text-sm ${muted} hover:underline`} onClick={() => onExit(right, index)}>
        End session
      </button>
    </div>
  );
}
