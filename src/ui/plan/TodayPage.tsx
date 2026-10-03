import { useEffect, useMemo, useState } from 'react';
import { hasContent, NODE, NODES, unitTitle } from '../../content';
import { localDay, type Mode } from '../../db/db';
import { blockOn } from '../../engine/planner';
import { buildSession, SESSION_LENGTHS, type SessionBlock, type SessionMinutes } from '../../engine/session';
import type { Tier } from '../../engine/types';
import { SessionRunner, type QueueEntry } from '../components/SessionRunner';
import { isWeak, nextInUnit, planFor, useLearner, useSettings } from '../data';
import { btnGhost, btnPrimary, card, h1, h2, muted } from '../styles';
import { fmtDate } from './PlanPage';

const LS_LEN = 'm301.sessionLength';
const LS_DAY = 'm301.today';

interface DayProgress {
  day: string;
  minutes: SessionMinutes;
  blocks: SessionBlock[];
  done: number[];
}

function load<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function store(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* private mode: progress just isn't remembered */
  }
}

const LABEL: Record<SessionBlock['kind'], string> = {
  warm: 'Warm-up',
  review: 'Reviews due',
  repair: 'Prerequisite repair',
  learn: 'Learn',
  mixed: 'Mixed practice',
};
const WHY: Record<SessionBlock['kind'], string> = {
  warm: 'Recall from memory, no notes. Retrieval is what makes skills stick.',
  review: 'Skills scheduled for today so you keep them until January.',
  repair: 'A foundation skill the next unit depends on.',
  learn: 'The next skill in your plan.',
  mixed: 'Different skills shuffled, so you practise choosing the method, as on the exam.',
};

export function TodayPage() {
  const settings = useSettings();
  const learner = useLearner();
  const today = localDay();
  const [minutes, setMinutes] = useState<SessionMinutes>(() => load<SessionMinutes>(LS_LEN) ?? 25);
  const [progress, setProgress] = useState<DayProgress | null>(() => {
    const p = load<DayProgress>(LS_DAY);
    return p && p.day === today ? p : null;
  });
  const [running, setRunning] = useState<number | null>(null);

  useEffect(() => {
    if (progress) store(LS_DAY, progress);
  }, [progress]);

  const plan = useMemo(() => (settings && learner ? planFor(settings, learner.states, learner.diag, today) : null), [settings, learner, today]);
  if (!settings || !learner || !plan) return null;

  const { states, diag, attempts } = learner;
  const by = new Map(states.map((s) => [s.nodeId, s]));
  const block = blockOn(plan, today);
  const reviewPhase = block?.kind === 'review';
  const practised = [...new Set(attempts.filter((a) => a.mode !== 'diagnostic').map((a) => a.nodeId))].filter(hasContent);
  const due = states.filter((s) => s.card && s.card.due <= Date.now()).sort((a, b) => a.card!.due - b.card!.due).map((s) => s.nodeId);
  const repair = NODES.filter((n) => n.unit === 'PRE' && !by.get(n.id)?.mastered && (isWeak(diag.find((d) => d.nodeId === n.id)?.result) || diag.find((d) => d.nodeId === n.id)?.result === 'shaky'))
    .filter((n) => attempts.filter((a) => a.nodeId === n.id && a.mode === 'repair' && a.day === today).length === 0)
    .sort((a, b) => Number(isWeak(diag.find((d) => d.nodeId === b.id)?.result)) - Number(isWeak(diag.find((d) => d.nodeId === a.id)?.result)))
    .map((n) => n.id);
  // Repairs the current unit needs come first.
  const repairOrdered = [...(block?.repair ?? []).filter((id) => repair.includes(id)), ...repair.filter((id) => !block?.repair.includes(id))];
  const planUnits = plan.blocks.filter((b) => b.kind !== 'review').map((b) => b.unit);
  const learnUnit = planUnits.find((u) => nextInUnit(u, states)) ?? null;
  const learn = learnUnit ? nextInUnit(learnUnit, states) : null;
  const mixedPool = states.filter((s) => (s.mastered || s.stage >= 3) && hasContent(s.nodeId)).map((s) => s.nodeId);
  const days = plan.daysLeft;

  const start = (m: SessionMinutes) => {
    setMinutes(m);
    store(LS_LEN, m);
    setProgress({ day: today, minutes: m, blocks: buildSession(m, { practised, due, repair: repairOrdered, learn, mixedPool, reviewPhase }), done: [] });
  };
  const markDone = (i: number) => setProgress((p) => p && { ...p, done: [...new Set([...p.done, i])] });

  if (running !== null && progress) {
    const b = progress.blocks[running];
    const mode: Mode = b.kind === 'warm' ? 'retrieval' : b.kind === 'review' ? 'review' : 'practice';
    const tier: Tier = b.kind === 'warm' ? 2 : 3;
    const queue: QueueEntry[] = b.nodeIds.map((nodeId) => ({ nodeId, mode, tier: b.kind === 'mixed' ? ((Math.random() < 0.5 ? 2 : 3) as Tier) : tier }));
    return (
      <SessionRunner
        title={LABEL[b.kind]}
        queue={queue}
        blind={b.kind !== 'review'}
        doneLabel="Back to today"
        onExit={(_r, n) => {
          if (n >= queue.length) markDone(running);
          setRunning(null);
        }}
      />
    );
  }

  const allDone = progress && progress.done.length === progress.blocks.length;

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-1">
        <h1 className={h1}>{days > 0 ? `${days} days to the diploma` : 'Diploma day'}</h1>
        <p className={muted}>
          {block ? (reviewPhase ? 'Final review: mixed practice and mock exams.' : `Now: ${unitTitle(block.unit)}${block.kind === 'catch-up' ? ' (catch-up)' : ''}, until ${fmtDate(block.end)}.`) : ''}{' '}
          <a className="text-accent hover:underline dark:text-accent-d" href="#/plan">
            See the plan
          </a>
        </p>
      </section>

      {!plan.fits && (
        <a href="#/plan" className="rounded-xl border border-warn bg-warn-soft px-4 py-3 text-sm dark:border-warn-d dark:bg-warn-soft-d">
          Your plan needs about {Math.round(plan.neededHours)} h but your weekly hours give about {Math.round(plan.availableHours)} h. See the options.
        </a>
      )}

      {diag.length === 0 && (
        <div className={`${card} flex flex-col gap-2 p-4`}>
          <p className="font-bold">Take the 10-minute prerequisite check</p>
          <p className={`text-sm ${muted}`}>It finds gaps from Math 10C and 20-1 so your plan repairs them before they cost you marks.</p>
          <a className={`${btnPrimary} self-start`} href="#/diagnostic">
            Start the check
          </a>
        </div>
      )}

      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className={h2}>Today's session</h2>
          <div className="flex gap-1" role="group" aria-label="Session length">
            {SESSION_LENGTHS.map((m) => (
              <button key={m} onClick={() => start(m)} aria-pressed={progress?.minutes === m} className={`min-h-10 rounded-lg px-2.5 text-sm font-bold tabular-nums ${progress?.minutes === m ? 'bg-accent text-white dark:bg-accent-d dark:text-paper-d' : `border border-line dark:border-line-d ${muted}`}`}>
                {m} min
              </button>
            ))}
          </div>
        </div>
        {!progress ? (
          <div className={`${card} flex flex-col gap-2 p-4`}>
            <p>How long do you have? Pick a length and the session is built from your reviews, repairs and plan.</p>
            <button className={`${btnPrimary} self-start`} onClick={() => start(minutes)}>
              Build a {minutes}-minute session
            </button>
          </div>
        ) : (
          <ol className="flex flex-col gap-2">
            {progress.blocks.map((b, i) => {
              const done = progress.done.includes(i);
              const node = NODE.get(b.nodeIds[0]);
              const href = b.kind === 'learn' ? `#/node/${b.nodeIds[0]}` : b.kind === 'repair' ? `#/repair/${b.nodeIds[0]}` : null;
              return (
                <li key={i} className={`${card} flex items-center gap-3 p-4 ${done ? 'opacity-60' : ''}`}>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-good text-white dark:bg-good-d dark:text-paper-d' : 'border border-line dark:border-line-d'}`} aria-label={done ? 'done' : undefined}>
                    {done ? '✓' : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">
                      {LABEL[b.kind]} <span className={`text-sm font-normal tabular-nums ${muted}`}>· {b.minutes} min{href ? '' : ` · ${b.nodeIds.length} question${b.nodeIds.length === 1 ? '' : 's'}`}</span>
                    </p>
                    <p className={`text-sm ${muted}`}>{href ? node?.title : WHY[b.kind]}</p>
                  </div>
                  {!done &&
                    (href ? (
                      <a className={btnGhost} href={href} onClick={() => markDone(i)}>
                        Open
                      </a>
                    ) : (
                      <button className={btnGhost} onClick={() => setRunning(i)}>
                        Start
                      </button>
                    ))}
                </li>
              );
            })}
          </ol>
        )}
        {allDone && <p className="rounded-lg bg-good-soft px-3 py-2 font-bold text-good dark:bg-good-soft-d dark:text-good-d">Session done. Anything more today is a bonus; rest counts too.</p>}
        {progress && !learn && !reviewPhase && <p className={`text-sm ${muted}`}>Every skill with lessons so far is mastered. Units 2 to 6 arrive in later milestones.</p>}
      </section>
    </div>
  );
}
