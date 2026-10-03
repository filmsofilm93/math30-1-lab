import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import curriculum from '../../content/curriculum.json';
import { hasContent, MISCONCEPTION, NODE, NODES, unitTitle, UNITS } from '../../content';
import { db, localDay, type Attempt, type NodeState } from '../../db/db';
import { readiness } from '../../engine/readiness';
import { PLAN_NODES, UNIT_SHARE, useLearner, useSettings } from '../data';
import { btnGhost, card, h1, h2, muted } from '../styles';

const DAY = 86_400_000;
const WEEKS = 8;
const TARGET = 0.85;
const pct = (x: number) => `${Math.round(x * 100)}%`;

export function ProgressPage() {
  const learner = useLearner();
  const settings = useSettings();
  const days = useLiveQuery(() => db.days.toArray(), [], []);
  if (!learner || !settings) return null;
  const { states, attempts } = learner;
  const examNodes = PLAN_NODES.filter((n) => n.unit !== 'PRE');
  const r = readiness(examNodes, attempts, UNIT_SHARE);

  return (
    <div className="flex flex-col gap-6">
      <h1 className={h1}>Progress</h1>
      <Readiness r={r} />
      <OutcomeMastery states={states} />
      <StudyTime days={days} weeklyHours={settings.weeklyHours ?? 0} />
      <ErrorHeatmap attempts={attempts} />
      <SkillMap states={states} attempts={attempts} />
    </div>
  );
}

function Readiness({ r }: { r: ReturnType<typeof readiness> }) {
  const pos = (x: number) => `${x * 100}%`;
  return (
    <section className={`${card} flex flex-col gap-3 p-4`}>
      <h2 className={h2}>Readiness estimate</h2>
      <p>
        If the exam were today: <span className="text-2xl font-bold tabular-nums">{pct(r.mean)}</span>{' '}
        <span className={muted}>
          (80% range {pct(r.low)}–{pct(r.high)}) · target 85%
        </span>
      </p>
      <div className="relative h-6" role="img" aria-label={`Estimate ${pct(r.mean)}, range ${pct(r.low)} to ${pct(r.high)}, target 85%`}>
        <div className="absolute inset-x-0 top-2.5 h-1 rounded-full bg-line dark:bg-line-d" />
        <div className="absolute top-1.5 h-3 rounded-full bg-accent/30 dark:bg-accent-d/30" style={{ left: pos(r.low), width: pos(r.high - r.low) }} />
        <div className="absolute top-0.5 h-5 w-1 -translate-x-1/2 rounded bg-accent dark:bg-accent-d" style={{ left: pos(r.mean) }} />
        <div className="absolute top-0 h-6 w-0.5 -translate-x-1/2 bg-good dark:bg-good-d" style={{ left: pos(TARGET) }} />
        <span className="absolute -top-0.5 -translate-x-full pr-1 text-xs font-bold text-good dark:text-good-d" style={{ left: pos(TARGET) }}>
          85
        </span>
      </div>
      <p className={`text-sm ${muted}`}>
        Based on practice covering {pct(r.coverage)} of the exam's weight. Skills you haven't practised count at a cautious 30% with wide uncertainty, so the estimate starts low and the range narrows as you work. It predicts the machine-scored part from practice; mock diploma reports (in Exam) include written response. Treat it as a rough guide, not a mark.
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
        {r.byUnit.map((u) => (
          <li key={u.unit} className="flex justify-between gap-2">
            <span className="truncate">{unitTitle(u.unit).split(/,| and /)[0]}</span>
            <span className={`tabular-nums ${muted}`}>{pct(u.mean)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OutcomeMastery({ states }: { states: NodeState[] }) {
  const mastered = new Set(states.filter((s) => s.mastered).map((s) => s.nodeId));
  const rows = curriculum.outcomes.map((o) => {
    const ns = NODES.filter((n) => n.outcome?.split('/')[0] === o.code);
    const w = ns.reduce((s, n) => s + n.examEmphasis, 0);
    const m = ns.filter((n) => mastered.has(n.id)).reduce((s, n) => s + n.examEmphasis, 0);
    return { ...o, n: ns.length, done: ns.filter((n) => mastered.has(n.id)).length, frac: w ? m / w : 0, emphasis: w, live: ns.some((n) => hasContent(n.id)) };
  });
  const strands = [
    ['RF', 'Relations and functions'],
    ['T', 'Trigonometry'],
    ['PCBT', 'Permutations, combinations, binomial theorem'],
  ];
  return (
    <section className="flex flex-col gap-2">
      <h2 className={h2}>Mastery by outcome</h2>
      <p className={`text-sm ${muted}`}>Each bar is weighted by how often its skills appear on the exam. Outcomes are listed in program-of-studies order.</p>
      {strands.map(([code, title]) => (
        <div key={code} className={`${card} flex flex-col gap-2 p-4`}>
          <p className="font-bold">{title}</p>
          {rows
            .filter((o) => o.strand === code)
            .map((o) => (
              <div key={o.code} className="flex flex-col gap-0.5">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="font-bold">{o.code}</span> {o.statement.replace(/\.$/, '')}
                  </span>
                  <span className={`shrink-0 tabular-nums ${muted}`}>{o.live ? `${o.done}/${o.n}` : 'later'}</span>
                </div>
                <div className="h-1.5 rounded-full bg-line dark:bg-line-d">
                  <div className="h-1.5 rounded-full bg-good dark:bg-good-d" style={{ width: pct(o.frac) }} />
                </div>
              </div>
            ))}
        </div>
      ))}
    </section>
  );
}

function StudyTime({ days, weeklyHours }: { days: { day: string; seconds: number }[]; weeklyHours: number }) {
  const map = new Map(days.map((d) => [d.day, d.seconds]));
  const today = new Date();
  // Columns are weeks (Mon–Sun), oldest first.
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  const weeks = Array.from({ length: WEEKS }, (_, w) => Array.from({ length: 7 }, (_, d) => localDay(monday.getTime() - (WEEKS - 1 - w) * 7 * DAY + d * DAY + 12 * 3600_000)));
  const all = weeks.flat();
  const secs = (d: string) => map.get(d) ?? 0;
  const studied = all.filter((d) => secs(d) >= 60).length;
  const total = all.reduce((s, d) => s + secs(d), 0);
  const thisWeek = weeks[WEEKS - 1].reduce((s, d) => s + secs(d), 0);
  const tone = (s: number) => (s < 60 ? 'bg-line/60 dark:bg-line-d/60' : s < 900 ? 'bg-good/30 dark:bg-good-d/30' : s < 2700 ? 'bg-good/60 dark:bg-good-d/60' : 'bg-good dark:bg-good-d');
  const todayStr = localDay();
  return (
    <section className={`${card} flex flex-col gap-3 p-4`}>
      <h2 className={h2}>Study time</h2>
      <p className="text-sm">
        Last {WEEKS} weeks: {studied} study day{studied === 1 ? '' : 's'}, {(total / 3600).toFixed(1)} h. This week: {(thisWeek / 3600).toFixed(1)} h of {weeklyHours} planned.
      </p>
      <div className="flex gap-1" role="img" aria-label="Study minutes per day for the last 8 weeks">
        <div className={`flex flex-col gap-1 pr-1 text-[10px] leading-4 ${muted}`}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        {weeks.map((w, i) => (
          <div key={i} className="flex flex-1 flex-col gap-1">
            {w.map((d) => (
              <span key={d} title={`${d}: ${Math.round(secs(d) / 60)} min`} className={`h-4 rounded-sm ${d > todayStr ? 'opacity-0' : tone(secs(d))}`} />
            ))}
          </div>
        ))}
      </div>
      <p className={`text-xs ${muted}`}>Time counts while the app is open and you are active. Missed days are normal; the plan already allows for them.</p>
    </section>
  );
}

function ErrorHeatmap({ attempts }: { attempts: Attempt[] }) {
  const now = Date.now();
  const weekOf = (t: number) => WEEKS - 1 - Math.floor((now - t) / (7 * DAY));
  const rows = useMemo(() => {
    const m = new Map<string, number[]>();
    for (const a of attempts) {
      if (a.correct || !a.misconception || a.mode === 'faded') continue;
      const w = weekOf(a.at);
      if (w < 0) continue;
      const row = m.get(a.misconception) ?? Array(WEEKS).fill(0);
      row[w]++;
      m.set(a.misconception, row);
    }
    return [...m.entries()].sort((a, b) => b[1].reduce((x, y) => x + y) - a[1].reduce((x, y) => x + y)).slice(0, 8);
  }, [attempts]);
  const max = Math.max(1, ...rows.flatMap((r) => r[1]));
  return (
    <section className={`${card} flex flex-col gap-3 p-4`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className={h2}>Recurring mistakes</h2>
        <a className="text-sm font-bold text-accent hover:underline dark:text-accent-d" href="#/errors">
          Weak spots
        </a>
      </div>
      {rows.length === 0 ? (
        <p className={`text-sm ${muted}`}>No tagged mistakes yet. When a wrong answer matches a known misconception, it shows up here by week.</p>
      ) : (
        <>
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className={`text-xs ${muted}`}>
                <th className="w-[55%] text-left font-normal">Mistake</th>
                {Array.from({ length: WEEKS }, (_, i) => (
                  <th key={i} className="font-normal">
                    {i === WEEKS - 1 ? 'now' : i === 0 ? `−${WEEKS - 1}w` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([id, counts]) => (
                <tr key={id}>
                  <td className="truncate py-0.5 pr-2" title={MISCONCEPTION.get(id)}>
                    {MISCONCEPTION.get(id) ?? id}
                  </td>
                  {counts.map((c, i) => (
                    <td key={i} className="p-0.5">
                      <span className="block h-4 rounded-sm bg-line/60 dark:bg-line-d/60" title={`${c}`}>
                        {c > 0 && <span className="block h-4 rounded-sm bg-bad dark:bg-bad-d" style={{ opacity: 0.25 + (0.75 * c) / max }} />}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className={`text-xs ${muted}`}>Darker = more often that week. A row fading out to the right means the mistake is going away.</p>
        </>
      )}
    </section>
  );
}

/** Per unit: skills layered by prerequisite depth, prerequisites on top. Tap a skill to study it. */
function SkillMap({ states, attempts }: { states: NodeState[]; attempts: Attempt[] }) {
  const [sel, setSel] = useState<string | null>(null);
  const by = new Map(states.map((s) => [s.nodeId, s]));
  const touched = new Set(attempts.map((a) => a.nodeId));
  const units = UNITS.filter((u) => u.id !== 'EXAM');
  const selNode = sel ? NODE.get(sel) : null;
  return (
    <section className="flex flex-col gap-2">
      <h2 className={h2}>Skill map</h2>
      <p className={`flex flex-wrap gap-x-3 gap-y-1 text-xs ${muted}`}>
        <Legend cls="fill-good dark:fill-good-d" label="mastered" />
        <Legend cls="fill-warn dark:fill-warn-d" label="in progress" />
        <Legend cls="fill-card stroke-muted dark:fill-card-d dark:stroke-muted-d" label="not started" />
        <Legend cls="fill-line/40 dark:fill-line-d/40" label="arrives later" />
        <span>Prerequisites sit to the left of the skills that need them.</span>
      </p>
      {selNode && (
        <div className={`${card} sticky top-14 z-[5] flex items-center gap-3 p-3`}>
          <span className="min-w-0 flex-1 text-sm">
            <span className="font-bold">{selNode.title}</span>
            <span className={muted}> · {by.get(selNode.id)?.mastered ? 'mastered' : touched.has(selNode.id) ? 'in progress' : 'not started'}</span>
          </span>
          {hasContent(selNode.id) ? (
            <a className={btnGhost} href={`#/node/${selNode.id}`}>
              Study
            </a>
          ) : (
            <span className={`text-sm ${muted}`}>later milestone</span>
          )}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {units.map((u) => (
          <UnitGraph key={u.id} unit={u.id} by={by} touched={touched} sel={sel} onSel={setSel} />
        ))}
      </div>
    </section>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <svg width="12" height="12" aria-hidden>
        <circle cx="6" cy="6" r="5" className={cls} strokeWidth="1.5" />
      </svg>
      {label}
    </span>
  );
}

const DX = 40;
const DY = 30;

function UnitGraph({ unit, by, touched, sel, onSel }: { unit: string; by: Map<string, NodeState>; touched: Set<string>; sel: string | null; onSel: (id: string) => void }) {
  const layout = useMemo(() => {
    const ns = NODES.filter((n) => n.unit === unit);
    const depth = new Map<string, number>();
    const d = (id: string): number => {
      if (depth.has(id)) return depth.get(id)!;
      const n = ns.find((x) => x.id === id)!;
      const v = Math.max(-1, ...n.prerequisites.filter((p) => ns.some((x) => x.id === p)).map(d)) + 1;
      depth.set(id, v);
      return v;
    };
    ns.forEach((n) => d(n.id));
    const layers: string[][] = [];
    ns.forEach((n) => (layers[depth.get(n.id)!] ??= []).push(n.id));
    const height = Math.max(...layers.map((l) => l.length));
    const pos = new Map<string, [number, number]>();
    layers.forEach((l, x) => l.forEach((id, y) => pos.set(id, [x * DX + 16, (y + (height - l.length) / 2) * DY + 16])));
    const edges = ns.flatMap((n) => n.prerequisites.filter((p) => pos.has(p)).map((p) => [pos.get(p)!, pos.get(n.id)!] as const));
    return { ns, pos, edges, w: (layers.length - 1) * DX + 32, h: height * DY + 2 };
  }, [unit]);
  const done = layout.ns.filter((n) => by.get(n.id)?.mastered).length;
  return (
    <div className={`${card} flex flex-col gap-2 p-3`}>
      <p className="flex justify-between gap-2 text-sm">
        <span className="font-bold">{unitTitle(unit)}</span>
        <span className={`shrink-0 tabular-nums ${muted}`}>
          {done}/{layout.ns.length}
        </span>
      </p>
      <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className="mx-auto w-full" style={{ maxWidth: layout.w * 1.2 }} role="group" aria-label={`${unitTitle(unit)} skill map`}>
        {layout.edges.map(([a, b], i) => (
          <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} className="stroke-line dark:stroke-line-d" strokeWidth="1.5" />
        ))}
        {layout.ns.map((n) => {
          const [x, y] = layout.pos.get(n.id)!;
          const s = by.get(n.id);
          const cls = !hasContent(n.id) ? 'fill-line/40 dark:fill-line-d/40' : s?.mastered ? 'fill-good dark:fill-good-d' : touched.has(n.id) || (s?.stage ?? 0) > 0 ? 'fill-warn dark:fill-warn-d' : 'fill-card stroke-muted dark:fill-card-d dark:stroke-muted-d';
          return (
            <g key={n.id} role="button" tabIndex={0} aria-label={n.title} onClick={() => onSel(n.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSel(n.id)} className="cursor-pointer outline-none">
              <title>{n.title}</title>
              <circle cx={x} cy={y} r={15} fill="transparent" />
              <circle cx={x} cy={y} r={9} className={cls} strokeWidth="2" />
              {sel === n.id && <circle cx={x} cy={y} r={13} fill="none" className="stroke-accent dark:stroke-accent-d" strokeWidth="2.5" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
