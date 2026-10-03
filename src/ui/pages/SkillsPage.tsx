import { useLiveQuery } from 'dexie-react-hooks';
import { hasContent, NODES, nodesInUnit, sectionOf, UNITS } from '../../content';
import { db, DEFAULT_SETTINGS, type NodeState } from '../../db/db';
import { masteryStatus } from '../../engine/mastery';
import { btnPrimary, card, h1, muted } from '../styles';

const DAY = 86_400_000;
const UNIT_MILESTONE: Record<string, string> = { U2: 'M3', U3: 'M3', U4: 'M4', U5: 'M5', U6: 'M5', PRE: 'M2', EXAM: 'M6' };

export function SkillsPage() {
  const settings = useLiveQuery(() => db.settings.get('main')) ?? DEFAULT_SETTINGS;
  const states = useLiveQuery(() => db.nodes.toArray(), [], [] as NodeState[]);
  const attempts = useLiveQuery(() => db.attempts.toArray(), [], []);
  const byNode = new Map(states.map((s) => [s.nodeId, s]));
  const days = Math.ceil((new Date(settings.examDate + 'T09:00:00').getTime() - Date.now()) / DAY);
  const due = states.filter((s) => s.card && s.card.due <= Date.now()).length;
  const order = [...settings.unitOrder, 'PRE', 'EXAM'];
  // Units 2-6 arrive in later milestones; the prerequisite layer is available now.
  const units = order.map((id) => UNITS.find((u) => u.id === id)!).filter(Boolean);

  const ready = NODES.filter((n) => hasContent(n.id));
  const next = ready.find((n) => byNode.get(n.id)?.stage && !byNode.get(n.id)?.mastered) ?? ready.find((n) => !byNode.get(n.id)?.mastered);
  const masteredCount = states.filter((s) => s.mastered).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h1 className={h1}>Skills</h1>
        <p className={muted}>
          {masteredCount} of {NODES.length - nodesInUnit('EXAM').length} skills mastered · {days > 0 ? `${days} days to the diploma` : 'diploma day has passed'}
        </p>
        <div className="flex flex-wrap gap-2">
          {due > 0 && (
            <a className={btnPrimary} href="#/review">
              Review {due} skill{due === 1 ? '' : 's'} due
            </a>
          )}
          {next && (
            <a className={due > 0 ? `${btnPrimary} bg-card text-accent ring-1 ring-accent dark:bg-card-d dark:text-accent-d` : btnPrimary} href={`#/node/${next.id}`}>
              {byNode.get(next.id)?.stage ? 'Continue' : 'Start'}: {next.title.length > 40 ? next.title.slice(0, 38) + '…' : next.title}
            </a>
          )}
        </div>
      </section>

      {units.map((u) => {
        const nodes = nodesInUnit(u.id);
        const live = nodes.some((n) => hasContent(n.id));
        const m = nodes.filter((n) => byNode.get(n.id)?.mastered).length;
        return (
          <section key={u.id} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">{u.title}</h2>
              <span className={`text-sm tabular-nums ${muted}`}>{live ? `${m}/${nodes.length} mastered` : `arrives in ${UNIT_MILESTONE[u.id] ?? 'a later milestone'}`}</span>
            </div>
            {live ? (
              <ul className={`${card} divide-y divide-line overflow-hidden dark:divide-line-d`}>
                {nodes.map((n) => {
                  const s = byNode.get(n.id);
                  const ms = masteryStatus(attempts.filter((a) => a.nodeId === n.id));
                  const isDue = s?.card && s.card.due <= Date.now();
                  return (
                    <li key={n.id}>
                      <a href={`#/node/${n.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent-soft dark:hover:bg-accent-soft-d">
                        <StatusDot mastered={!!s?.mastered} started={!!s?.stage || ms.counted > 0} due={!!isDue} />
                        <span className="min-w-0 flex-1">
                          <span className="block">{n.title}</span>
                          <span className={`text-xs ${muted}`}>
                            {sectionOf(n) ? `${sectionOf(n)} · ` : ''}
                            {n.outcome}
                            {n.weakSpot ? ' · exam weak spot' : ''}
                            {n.standard === 'excellence' ? ' · excellence' : ''}
                          </span>
                        </span>
                        <span className={`shrink-0 text-xs tabular-nums ${muted}`}>{s?.mastered ? (isDue ? 'review due' : 'mastered') : ms.counted ? `${ms.correct}/10` : ''}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className={`text-sm ${muted}`}>
                {nodes.length} skills: {nodes.slice(0, 4).map((n) => n.title.split(/[;:(]/)[0]).join(', ')}
                {nodes.length > 4 ? '…' : ''}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}

function StatusDot({ mastered, started, due }: { mastered: boolean; started: boolean; due: boolean }) {
  const cls = due ? 'bg-accent dark:bg-accent-d' : mastered ? 'bg-good dark:bg-good-d' : started ? 'bg-warn dark:bg-warn-d' : 'border-2 border-line dark:border-line-d';
  return <span className={`h-3 w-3 shrink-0 rounded-full ${cls}`} aria-label={due ? 'review due' : mastered ? 'mastered' : started ? 'in progress' : 'not started'} />;
}
