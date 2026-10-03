import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { hasContent, MISCONCEPTION, NODE, NODES } from '../../content';
import { db, type Attempt } from '../../db/db';
import { recordAttempt } from '../../db/progress';
import { itemFor } from '../../engine/practice';
import type { Item } from '../../engine/types';
import { ItemView, type ItemResult } from '../components/ItemView';
import { btnGhost, card, h1, h2, muted } from '../styles';

const DAY = 86_400_000;

interface Group {
  key: string;
  label: string;
  count: number;
  recent: number; // last 14 days
  nodes: string[];
  last: number;
}

function groupErrors(attempts: Attempt[]): Group[] {
  const map = new Map<string, Group>();
  const now = Date.now();
  for (const a of attempts) {
    if (a.correct || a.mode === 'faded') continue;
    const key = a.misconception ?? `node:${a.nodeId}`;
    const label = a.misconception ? MISCONCEPTION.get(a.misconception) ?? a.misconception : `Wrong answers on: ${NODE.get(a.nodeId)?.title}`;
    const g = map.get(key) ?? { key, label, count: 0, recent: 0, nodes: [], last: 0 };
    g.count++;
    if (now - a.at < 14 * DAY) g.recent++;
    if (!g.nodes.includes(a.nodeId)) g.nodes.push(a.nodeId);
    g.last = Math.max(g.last, a.at);
    map.set(key, g);
  }
  return [...map.values()].sort((a, b) => b.recent - a.recent || b.count - a.count);
}

export function ErrorsPage() {
  const attempts = useLiveQuery(() => db.attempts.toArray(), [], [] as Attempt[]);
  const [drill, setDrill] = useState<{ group: Group; nodes: string[]; n: number; item: Item | null } | null>(null);
  const groups = groupErrors(attempts);
  const max = Math.max(1, ...groups.map((g) => g.recent));

  function startDrill(g: Group) {
    // Practise the skills where this mistake happens, plus any skill that lists it.
    const misNodes = g.key.startsWith('node:') ? [] : NODES.filter((n) => n.misconceptions.includes(g.key)).map((n) => n.id);
    const nodes = [...new Set([...g.nodes, ...misNodes])].filter(hasContent);
    if (!nodes.length) return;
    setDrill({ group: g, nodes, n: 0, item: itemFor(nodes[0], 2) });
  }

  if (drill) {
    const nodeId = drill.nodes[drill.n % drill.nodes.length];
    async function onDone(r: ItemResult) {
      const it = drill!.item!;
      await recordAttempt({ nodeId, itemId: it.id, generatorId: it.generatorId, seed: it.seed, tier: it.tier, correct: r.correct, assisted: r.assisted, hints: r.hints, confidence: r.confidence, misconception: r.misconception, ms: r.ms, mode: 'practice' });
    }
    const next = () =>
      setDrill((d) => {
        if (!d) return d;
        const n = d.n + 1;
        return n >= 8 ? null : { ...d, n, item: itemFor(d.nodes[n % d.nodes.length], Math.random() < 0.5 ? 2 : 3) };
      });
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className={h2}>Weak-spot drill</h1>
          <span className={`text-sm tabular-nums ${muted}`}>{drill.n + 1} / 8</span>
        </div>
        <p className={`text-sm ${muted}`}>{drill.group.label}</p>
        {drill.item && <ItemView key={drill.item.id} item={drill.item} onDone={onDone} onNext={next} nextLabel={drill.n === 7 ? 'Finish' : 'Next'} />}
        <button className={`self-start text-sm ${muted} hover:underline`} onClick={() => setDrill(null)}>
          End drill
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Weak spots</h1>
      <p className={muted}>Your wrong answers, grouped by the mistake behind them. Bars show the last 14 days.</p>
      {groups.length === 0 ? (
        <p className={`${card} p-4`}>No mistakes logged yet. They will appear here as you practise.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {groups.map((g) => (
            <li key={g.key} className={`${card} flex flex-col gap-2 p-4`}>
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1">{g.label}</p>
                <span className={`shrink-0 text-sm tabular-nums ${muted}`}>
                  {g.count}×
                </span>
              </div>
              <div className="h-2 rounded-full bg-line dark:bg-line-d" aria-hidden>
                <div className="h-2 rounded-full bg-bad dark:bg-bad-d" style={{ width: `${(100 * g.recent) / max}%` }} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-xs ${muted}`}>{g.nodes.map((n) => NODE.get(n)?.outcome).filter((v, i, a) => a.indexOf(v) === i).join(', ')}</span>
                <button className={btnGhost} onClick={() => startDrill(g)}>
                  Drill this
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
