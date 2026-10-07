import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useMemo, useState } from 'react';
import { hasContent, lessonFor, NODE, sectionOf, unitTitle } from '../../content';
import type { ExplorePreset, Lesson } from '../../content/lessons/types';
import { db } from '../../db/db';
import { recordAttempt, setStage } from '../../db/progress';
import { makeItem } from '../../engine/framework';
import { generatorById } from '../../engine/generators';
import { masteryStatus } from '../../engine/mastery';
import { itemFor, nextPracticeItem } from '../../engine/practice';
import type { Item, Tier } from '../../engine/types';
import { ItemView, Steps, Stem, type ItemResult } from '../components/ItemView';
import { Rich } from '../components/Rich';
import { CardDeck } from './CardDeck';
import { VideoCard } from './VideoCard';
import { VIDEOS } from '../../content/videos';
import { FunctionOpsLab } from '../explorers/FunctionOpsLab';
import { TransformationLab } from '../explorers/TransformationLab';
import { PolynomialLab } from '../explorers/PolynomialLab';
import { ExpLogLab } from '../explorers/ExpLogLab';
import { LogLawLab } from '../explorers/LogLawLab';
import { CountingLab } from '../explorers/CountingLab';
import { RadicalLab } from '../explorers/RadicalLab';
import { RationalLab } from '../explorers/RationalLab';
import { IdentityWorkspace } from '../explorers/IdentityWorkspace';
import { SinusoidLab } from '../explorers/SinusoidLab';
import { TrigEquationLab } from '../explorers/TrigEquationLab';
import { UnitCircle } from '../explorers/UnitCircle';
import { btnGhost, btnPrimary, card, h1, h2, muted } from '../styles';

const STAGES = ['Explore', 'Explain', 'Faded', 'Practice'] as const;

export function NodePage({ nodeId }: { nodeId: string }) {
  const node = NODE.get(nodeId);
  const lesson = lessonFor(nodeId);
  const state = useLiveQuery(() => db.nodes.get(nodeId), [nodeId]);
  const attempts = useLiveQuery(() => db.attempts.where('[nodeId+at]').between([nodeId, 0], [nodeId, Infinity]).toArray(), [nodeId]);
  const [stage, setStageLocal] = useState<number | null>(null);
  const [repair, setRepair] = useState(false);

  useEffect(() => {
    setStageLocal(null);
    setRepair(false);
  }, [nodeId]);
  useEffect(() => {
    if (stage === null && state !== undefined) setStageLocal(Math.max(Math.min(state?.stage ?? 0, 3), lesson?.explore ? 0 : 1));
  }, [state, stage, lesson]);

  if (!node) return <p>Unknown skill.</p>;
  if (!lesson)
    return (
      <div className="flex flex-col gap-3">
        <h1 className={h1}>{node.title}</h1>
        <p className={muted}>This skill's lessons arrive in a later milestone. Unit 1 and the prerequisite skills are ready now.</p>
        <a className={btnGhost} href="#/skills">
          Back to skills
        </a>
      </div>
    );

  const go = (s: number) => {
    setStageLocal(s);
    setStage(nodeId, s);
    window.scrollTo({ top: 0 });
  };
  const mastery = masteryStatus(attempts ?? []);
  const s = stage ?? (lesson.explore ? 0 : 1);
  const stages = STAGES.map((label, i) => ({ label, i })).filter((x) => x.i > 0 || lesson.explore);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <a href="#/skills" className={`text-sm ${muted} hover:underline`}>
          ← {unitTitle(node.unit)}
        </a>
        <h1 className={h1}>{node.title}</h1>
        <p className={`text-sm ${muted}`}>
          {sectionOf(node) ? `Workbook ${sectionOf(node)} · ` : ''}
          {node.outcome} · {node.standard === 'excellence' ? 'Standard of Excellence' : 'Acceptable standard'}
          {node.weakSpot ? ' · Exam weak spot' : ''}
        </p>
      </header>

      <MasteryBar status={mastery} mastered={!!state?.mastered} />

      {repair && <RepairBanner nodeId={nodeId} onClose={() => setRepair(false)} />}

      <nav className={`grid ${stages.length === 4 ? 'grid-cols-4' : 'grid-cols-3'} gap-1 rounded-xl bg-line/40 p-1 dark:bg-line-d/40`} aria-label="Lesson stages">
        {stages.map(({ label, i }) => (
          <button key={label} onClick={() => go(i)} aria-current={s === i ? 'step' : undefined} className={`min-h-10 rounded-lg px-1 text-sm font-bold ${s === i ? 'bg-card shadow-sm dark:bg-card-d' : muted}`}>
            {label}
          </button>
        ))}
      </nav>

      {s === 0 && lesson.explore && <ExploreStage lesson={lesson} onNext={() => go(1)} />}
      {s === 1 && <ExplainStage lesson={lesson} onNext={() => go(2)} />}
      {s === 2 && <FadedStage nodeId={nodeId} onNext={() => go(3)} />}
      {s === 3 && <PracticeStage nodeId={nodeId} onRepair={() => setRepair(true)} />}
    </div>
  );
}

function MasteryBar({ status, mastered }: { status: ReturnType<typeof masteryStatus>; mastered: boolean }) {
  return (
    <div className={`${card} flex flex-col gap-1 px-4 py-3`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold">{mastered ? 'Mastered. Reviews are scheduled.' : 'Mastery check'}</span>
        <span className={`text-sm tabular-nums ${muted}`}>
          {status.correct}/{status.counted} correct · {status.days} day{status.days === 1 ? '' : 's'}
        </span>
      </div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i < status.correct ? 'bg-good dark:bg-good-d' : i < status.counted ? 'bg-bad/60 dark:bg-bad-d/60' : 'bg-line dark:bg-line-d'}`} />
        ))}
      </div>
      {!mastered && <p className={`text-xs ${muted}`}>Mastered = at least 8 of your last 10 unassisted answers correct, over at least two different days.</p>}
    </div>
  );
}

/** Ranks prerequisites: diagnostic weak first, then shaky, then by recent accuracy (lowest first). */
function RepairBanner({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
  const node = NODE.get(nodeId)!;
  const info = useLiveQuery(async () => {
    const [states, diag, attempts] = await Promise.all([db.nodes.where('nodeId').anyOf(node.prerequisites).toArray(), db.diagnostic.where('nodeId').anyOf(node.prerequisites).toArray(), db.attempts.where('nodeId').anyOf(node.prerequisites).toArray()]);
    return node.prerequisites
      .map((id) => {
        const recent = attempts.filter((a) => a.nodeId === id && !a.assisted && a.mode !== 'faded').slice(-10);
        const acc = recent.length ? recent.filter((a) => a.correct).length / recent.length : null;
        const d = diag.find((x) => x.nodeId === id)?.result;
        const score = (d === 'weak' || d === 'inferred-weak' ? 0 : d === 'shaky' ? 1 : 2) + (acc ?? 0.6);
        return { id, mastered: !!states.find((s) => s.nodeId === id)?.mastered, acc, d, score };
      })
      .sort((a, b) => a.score - b.score);
  }, [nodeId]);
  const list = (info ?? []).filter((p) => !p.mastered);
  const shown = list.length ? list : (info ?? []);
  return (
    <div className="rounded-xl border border-warn bg-warn-soft p-4 dark:border-warn-d dark:bg-warn-soft-d">
      <p className="font-bold text-warn dark:text-warn-d">Two misses in a row. A prerequisite may be the real problem.</p>
      <p className="mt-1">{shown.length > 1 ? 'Most likely first:' : 'This skill builds on:'}</p>
      <ul className="mt-1 flex flex-col gap-1">
        {shown.map((p) => {
          const n = NODE.get(p.id)!;
          return (
            <li key={p.id}>
              <a className="font-bold text-accent hover:underline dark:text-accent-d" href={`#/node/${p.id}`}>
                {n.title}
              </a>
              <span className={`text-sm ${muted}`}>
                {p.d && p.d !== 'strong' ? ` · check: ${p.d === 'shaky' ? 'shaky' : 'weak'}` : ''}
                {p.acc !== null ? ` · recent ${Math.round(p.acc * 100)}%` : ''}
              </span>
              {n.unit === 'PRE' && hasContent(p.id) && (
                <>
                  {' · '}
                  <a className="text-sm font-bold text-accent hover:underline dark:text-accent-d" href={`#/repair/${p.id}?from=${nodeId}`}>
                    10-minute repair
                  </a>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <button className={`mt-2 text-sm font-bold ${muted} hover:underline`} onClick={onClose}>
        Keep practising this skill
      </button>
    </div>
  );
}

function PredictBox({ lesson, onDone }: { lesson: Lesson; onDone: (choice: number) => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const p = lesson.explore!.predict;
  return (
    <div className={`${card} flex flex-col gap-3 p-4`}>
      <p className={`text-sm font-bold uppercase tracking-wide ${muted}`}>Predict first</p>
      <p className="text-lg">
        <Rich text={p.question} />
      </p>
      <div className="flex flex-col gap-2">
        {p.options.map((o, i) => (
          <button key={i} onClick={() => setPick(i)} className={`rounded-xl border px-4 py-3 text-left ${pick === i ? 'border-accent bg-accent-soft dark:border-accent-d dark:bg-accent-soft-d' : 'border-line dark:border-line-d'}`}>
            <Rich text={o} />
          </button>
        ))}
      </div>
      <button className={btnPrimary} disabled={pick === null} onClick={() => onDone(pick!)}>
        Lock in my prediction
      </button>
    </div>
  );
}

function Explorer({ preset, locked }: { preset: ExplorePreset; locked: boolean }) {
  switch (preset.explorer) {
    case 'transformation':
      return <TransformationLab preset={preset} locked={locked} />;
    case 'function-ops':
      return <FunctionOpsLab preset={preset} locked={locked} />;
    case 'polynomial':
      return <PolynomialLab preset={preset} locked={locked} />;
    case 'exp-log':
      return <ExpLogLab preset={preset} locked={locked} />;
    case 'log-law':
      return <LogLawLab preset={preset} locked={locked} />;
    case 'unit-circle':
      return <UnitCircle preset={preset} locked={locked} />;
    case 'sinusoid':
      return <SinusoidLab preset={preset} locked={locked} />;
    case 'trig-equation':
      return <TrigEquationLab preset={preset} locked={locked} />;
    case 'identity':
      return <IdentityWorkspace preset={preset} locked={locked} />;
    case 'radical':
      return <RadicalLab preset={preset} locked={locked} />;
    case 'rational':
      return <RationalLab preset={preset} locked={locked} />;
    case 'counting':
      return <CountingLab preset={preset} locked={locked} />;
  }
}

function ExploreStage({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const p = lesson.explore!.predict;
  const preset = lesson.explore!.preset;
  return (
    <div className="flex flex-col gap-4">
      {pick === null ? (
        <PredictBox lesson={lesson} onDone={setPick} />
      ) : (
        <div className={`${card} flex flex-col gap-2 p-4`}>
          <p>
            <span className="font-bold">Your prediction: </span>
            <Rich text={p.options[pick]} />
          </p>
          <p>
            <span className="font-bold">Test it: </span>
            <Rich text={p.tryIt} />
          </p>
          {!revealed ? (
            <button className={btnGhost} onClick={() => setRevealed(true)}>
              I've tested it. Show the answer
            </button>
          ) : (
            <p className={pick === p.answer ? 'text-good dark:text-good-d' : 'text-bad dark:text-bad-d'}>
              <span className="font-bold">{pick === p.answer ? 'Your prediction was right: ' : 'The answer: '}</span>
              <Rich text={p.options[p.answer]} />
            </p>
          )}
        </div>
      )}
      <Explorer preset={preset} locked={pick === null} />
      <button className={btnPrimary} onClick={onNext}>
        Continue to the explanation
      </button>
    </div>
  );
}

export function WorkedExample({ item, n }: { item: Item; n: number }) {
  const [shown, setShown] = useState(1);
  const total = item.solution.length;
  const correct = item.choices?.find((c) => c.correct);
  return (
    <div className={`${card} flex flex-col gap-3 p-4`}>
      <p className={`text-sm font-bold uppercase tracking-wide ${muted}`}>Worked example {n}</p>
      <Stem item={item} />
      {correct && (
        <p className={`text-sm ${muted}`}>
          Options include: <Rich text={item.choices!.map((c) => c.tex).join(';  ')} />
        </p>
      )}
      <Steps steps={item.solution} upTo={shown} />
      {shown < total ? (
        <button className={btnGhost} onClick={() => setShown(shown + 1)}>
          Show step {shown + 1} of {total}
        </button>
      ) : correct ? (
        <p className="font-bold text-good dark:text-good-d">
          Answer: <Rich text={correct.tex} />
        </p>
      ) : null}
    </div>
  );
}

function ExplainStage({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const examples = useMemo(() => lesson.examples.map((e) => makeItem(generatorById(e.generatorId)!, e.seed, e.tier)), [lesson]);
  const [cardsDone, setCardsDone] = useState(false);
  const video = VIDEOS[lesson.nodeId];
  if (lesson.cards && !cardsDone)
    return (
      <div className="flex flex-col gap-4">
        {video && <VideoCard video={video} />}
        <CardDeck key={lesson.nodeId} cards={lesson.cards} onDone={() => setCardsDone(true)} />
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      {lesson.cards && (
        <div className="flex items-center justify-between gap-3">
          <h2 className={h2}>The short version</h2>
          <button className={`text-sm font-bold text-accent hover:underline dark:text-accent-d`} onClick={() => setCardsDone(false)}>
            Go through the steps again
          </button>
        </div>
      )}
      {!lesson.cards && video && <VideoCard video={video} />}
      <div className={`${card} flex flex-col gap-3 p-4 leading-relaxed`}>
        {lesson.explain.map((para, i) => (
          <p key={i}>
            <Rich text={para} />
          </p>
        ))}
      </div>
      {examples.map((it, i) => (
        <WorkedExample key={it.id} item={it} n={i + 1} />
      ))}
      <button className={btnPrimary} onClick={onNext}>
        Continue to faded practice
      </button>
    </div>
  );
}

/** Three items: last step left to you, last two steps, then the whole problem. */
function FadedStage({ nodeId, onNext }: { nodeId: string; onNext: () => void }) {
  const [round, setRound] = useState(0);
  const [item, setItem] = useState<Item | null>(() => itemFor(nodeId, 1));
  const [done, setDone] = useState(false);
  if (!item) return null;
  const n = item.solution.length;
  const shown = round === 0 ? Math.max(n - 1, 0) : round === 1 ? Math.max(n - 2, 0) : 0;
  const labels = ['You finish the last step', 'You finish the last two steps', 'The whole problem'];

  async function onDone(r: ItemResult) {
    await recordAttempt({ nodeId, itemId: item!.id, generatorId: item!.generatorId, seed: item!.seed, tier: item!.tier, correct: r.correct, assisted: true, hints: r.hints, confidence: r.confidence, misconception: r.misconception, ms: r.ms, mode: 'faded' });
    setDone(true);
  }
  function next() {
    if (round === 2) return onNext();
    setRound(round + 1);
    setItem(itemFor(nodeId, round === 0 ? 1 : 2, item!.generatorId));
    setDone(false);
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className={h2}>{labels[round]}</h2>
        <span className={`text-sm tabular-nums ${muted}`}>{round + 1} / 3</span>
      </div>
      <ItemView key={item.id} item={item} shownSteps={shown} onDone={onDone} onNext={next} nextLabel={round === 2 ? 'Start independent practice' : 'Next'} />
      {!done && round < 2 && (
        <button className={`self-start text-sm ${muted} hover:underline`} onClick={next}>
          Skip
        </button>
      )}
    </div>
  );
}

function PracticeStage({ nodeId, onRepair }: { nodeId: string; onRepair: () => void }) {
  const history = useLiveQuery(() => db.attempts.where('[nodeId+at]').between([nodeId, 0], [nodeId, Infinity]).filter((a) => a.mode !== 'faded').toArray(), [nodeId]);
  const [item, setItem] = useState<Item | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [tier, setTier] = useState<Tier | undefined>(undefined);

  useEffect(() => {
    if (history && !item) setItem(nextPracticeItem(nodeId, history, tier));
  }, [history, item, nodeId, tier]);

  if (!item) return <p className={muted}>Loading…</p>;

  async function onDone(r: ItemResult) {
    const res = await recordAttempt({ nodeId, itemId: item!.id, generatorId: item!.generatorId, seed: item!.seed, tier: item!.tier, correct: r.correct, assisted: r.assisted, hints: r.hints, confidence: r.confidence, misconception: r.misconception, ms: r.ms, mode: 'practice' });
    if (res.justMastered) setBanner('Skill mastered. It now joins your review queue.');
    if (res.needsRepair) onRepair();
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className={h2}>Independent practice</h2>
        <div className="flex items-center gap-1 text-sm" role="group" aria-label="Difficulty">
          <span className={muted}>Level</span>
          {([undefined, 1, 2, 3] as const).map((t) => (
            <button key={String(t)} onClick={() => { setTier(t); setItem(null); }} className={`rounded-md px-2 py-1 ${tier === t ? 'bg-accent text-white dark:bg-accent-d dark:text-paper-d' : muted}`}>
              {t ?? 'Auto'}
            </button>
          ))}
        </div>
      </div>
      {banner && <p className="rounded-lg bg-good-soft px-3 py-2 font-bold text-good dark:bg-good-soft-d dark:text-good-d">{banner}</p>}
      <p className={`text-xs ${muted}`}>
        Level {item.tier} · {generatorById(item.generatorId)?.title}
      </p>
      <ItemView key={item.id} item={item} onDone={onDone} onNext={() => setItem(null)} />
    </div>
  );
}
