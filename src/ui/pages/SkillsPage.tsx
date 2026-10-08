import { useLiveQuery } from 'dexie-react-hooks';
import { hasContent, NODES, nodesInUnit, plainTitle, sectionNodes, sectionOf, type SkillNode } from '../../content';
import { bySection, COURSE_UNITS, SECTION_TITLE } from '../../content/course';
import { SECTION_VIDEOS } from '../../content/videos';
import { db, DEFAULT_SETTINGS, type Attempt, type NodeState } from '../../db/db';
import { masteryStatus } from '../../engine/mastery';
import { btnPrimary, card, h1, muted } from '../styles';

const DAY = 86_400_000;

export function SkillsPage() {
  const settings = useLiveQuery(() => db.settings.get('main')) ?? DEFAULT_SETTINGS;
  const states = useLiveQuery(() => db.nodes.toArray(), [], [] as NodeState[]);
  const attempts = useLiveQuery(() => db.attempts.toArray(), [], []);
  const byNode = new Map(states.map((s) => [s.nodeId, s]));
  const days = Math.ceil((new Date(settings.examDate + 'T09:00:00').getTime() - Date.now()) / DAY);
  const due = states.filter((s) => s.card && s.card.due <= Date.now()).length;

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

      {COURSE_UNITS.map((cu) => {
        const sections = [...new Set(NODES.filter((n) => sectionOf(n) && cu.chapters.includes(Number(sectionOf(n)!.split('.')[0]))).map((n) => sectionOf(n)!))].sort(bySection);
        const all = NODES.filter((n) => sections.includes(sectionOf(n) ?? ''));
        const m = all.filter((n) => byNode.get(n.id)?.mastered).length;
        return (
          <section key={cu.n} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-xl font-bold">
                Unit {cu.n}: {cu.title}
              </h2>
              <span className={`shrink-0 text-sm tabular-nums ${muted}`}>
                {m}/{all.length}
              </span>
            </div>
            {sections.map((sec) => (
              <div key={sec} className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-bold">
                    Section {sec} <span className={`font-normal ${muted}`}>· {SECTION_TITLE[sec] ?? ''}</span>
                  </h3>
                  {(SECTION_VIDEOS[sec] ?? []).map((v, i, arr) => (
                    <a key={v.id} className="text-sm font-bold text-accent hover:underline dark:text-accent-d" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">
                      ▶ Video{arr.length > 1 ? ` ${i + 1}` : ''}
                    </a>
                  ))}
                </div>
                <NodeList nodes={sectionNodes(sec)} byNode={byNode} attempts={attempts} />
              </div>
            ))}
          </section>
        );
      })}

      {[
        { id: 'PRE', title: 'Review from Math 10C and 20-1', note: 'Earlier skills the course builds on. The plan sends you here when a check shows a gap.' },
        { id: 'EXAM', title: 'Diploma exam skills', note: 'Calculator steps and how the diploma is marked.' },
      ].map((g) => (
        <section key={g.id} className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">{g.title}</h2>
          <p className={`text-sm ${muted}`}>{g.note}</p>
          <NodeList nodes={nodesInUnit(g.id)} byNode={byNode} attempts={attempts} />
        </section>
      ))}
    </div>
  );
}

function NodeList({ nodes, byNode, attempts }: { nodes: SkillNode[]; byNode: Map<string, NodeState>; attempts: Attempt[] }) {
  return (
    <ul className={`${card} divide-y divide-line overflow-hidden dark:divide-line-d`}>
      {nodes.map((n) => {
        const s = byNode.get(n.id);
        const ms = masteryStatus(attempts.filter((a) => a.nodeId === n.id));
        const isDue = s?.card && s.card.due <= Date.now();
        return (
          <li key={n.id}>
            <a href={`#/node/${n.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent-soft dark:hover:bg-accent-soft-d">
              <StatusDot mastered={!!s?.mastered} started={!!s?.stage || ms.counted > 0} due={!!isDue} />
              <span className="min-w-0 flex-1">{plainTitle(n)}</span>
              <span className={`shrink-0 text-xs tabular-nums ${muted}`}>{s?.mastered ? (isDue ? 'review due' : 'mastered') : ms.counted ? `${ms.correct}/10` : ''}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function StatusDot({ mastered, started, due }: { mastered: boolean; started: boolean; due: boolean }) {
  const cls = due ? 'bg-accent dark:bg-accent-d' : mastered ? 'bg-good dark:bg-good-d' : started ? 'bg-warn dark:bg-warn-d' : 'border-2 border-line dark:border-line-d';
  return <span className={`h-3 w-3 shrink-0 rounded-full ${cls}`} aria-label={due ? 'review due' : mastered ? 'mastered' : started ? 'in progress' : 'not started'} />;
}
