import { useEffect, useMemo, useState } from 'react';
import { NODE, NODES } from '../../content';
import { db } from '../../db/db';
import { recordAttempt } from '../../db/progress';
import { answer, nextStep, startDiagnostic, type DiagState } from '../../engine/diagnostic';
import { makeItem } from '../../engine/framework';
import { generatorById } from '../../engine/generators';
import { randomSeed } from '../../engine/rng';
import { ItemView, type ItemResult } from '../components/ItemView';
import { DIAG_LABEL, isWeak } from '../data';
import { btnGhost, btnPrimary, card, h1, h2, muted } from '../styles';

const PRE = NODES.filter((n) => n.unit === 'PRE');

export function DiagnosticPage() {
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<DiagState>(() => startDiagnostic(PRE));
  const [finished, setFinished] = useState(false);
  const { state: st, step } = useMemo(() => nextStep(state, PRE), [state]);
  const item = useMemo(() => (step.kind === 'ask' ? makeItem(generatorById(step.generatorId)!, randomSeed(), step.tier) : null), [step]);

  async function save(s: DiagState) {
    const at = Date.now();
    await db.diagnostic.bulkPut(Object.entries(s.results).map(([nodeId, r]) => ({ nodeId, result: r.level, correct: r.correct, asked: r.asked, at })));
  }
  useEffect(() => {
    if (started && step.kind === 'done' && !finished) {
      save(st).then(() => setFinished(true));
    }
  }, [started, step, st, finished]);

  if (!started)
    return (
      <div className="flex flex-col gap-4">
        <h1 className={h1}>Prerequisite check</h1>
        <div className={`${card} flex flex-col gap-2 p-4`}>
          <p>About 10 to 15 minutes. It checks the Math 10C and 20-1 skills that Math 30-1 builds on: exponents, radicals, factoring, quadratics, functions, domain and range, rational and radical equations, systems and reference angles.</p>
          <p>One question per skill, sometimes a second to confirm. No hints and no marks: it only decides where your plan starts. If you don't know something, say so; guessing makes the plan worse.</p>
          <p className={`text-sm ${muted}`}>Calculator allowed. You can stop at any point and keep what you've done.</p>
        </div>
        <button className={btnPrimary} onClick={() => setStarted(true)}>
          Start
        </button>
      </div>
    );

  if (finished || step.kind === 'done') return <DiagnosticResults results={st.results} />;

  const done = Object.keys(st.results).length;
  async function onDone(r: ItemResult) {
    if (step.kind !== 'ask' || !item) return;
    await recordAttempt({ nodeId: step.nodeId, itemId: item.id, generatorId: item.generatorId, seed: item.seed, tier: item.tier, correct: r.correct, assisted: false, hints: 0, confidence: r.confidence, misconception: r.misconception, ms: r.ms, mode: 'diagnostic' });
    setState(answer(st, { correct: r.correct, sure: r.confidence === 'sure' }));
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h1 className={h2}>Prerequisite check</h1>
        <span className={`text-sm tabular-nums ${muted}`}>
          {done} / {st.order.length} skills
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-line dark:bg-line-d" aria-hidden>
        <div className="h-1.5 rounded-full bg-accent dark:bg-accent-d" style={{ width: `${(100 * done) / st.order.length}%` }} />
      </div>
      <p className={`text-xs ${muted}`}>
        {NODE.get(step.nodeId)?.title}
        {step.confirm ? ' · one more to confirm' : ''}
      </p>
      {item && <ItemView key={item.id} item={item} test onDone={onDone} onNext={() => {}} />}
      <button
        className={`self-start text-sm ${muted} hover:underline`}
        onClick={async () => {
          await save(st);
          setFinished(true);
        }}
      >
        Stop here and keep what I've done
      </button>
    </div>
  );
}

function DiagnosticResults({ results }: { results: DiagState['results'] }) {
  const ids = PRE.map((n) => n.id).filter((id) => results[id]);
  const weak = ids.filter((id) => isWeak(results[id].level));
  const shaky = ids.filter((id) => results[id].level === 'shaky');
  const untested = PRE.filter((n) => !results[n.id] && n.id !== 'P.sine-cos-law');
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Your foundations</h1>
      <p className={muted}>
        {weak.length === 0 && shaky.length === 0 ? 'No repairs needed. Your plan goes straight to Math 30-1 content.' : `${weak.length} skill${weak.length === 1 ? '' : 's'} to repair and ${shaky.length} to firm up. Each repair is about 10 minutes and is built into your plan just before the unit that needs it.`}
      </p>
      <ul className={`${card} divide-y divide-line dark:divide-line-d`}>
        {ids.map((id) => {
          const r = results[id];
          const tone = isWeak(r.level) ? 'text-bad dark:text-bad-d' : r.level === 'shaky' ? 'text-warn dark:text-warn-d' : 'text-good dark:text-good-d';
          return (
            <li key={id} className="flex flex-col gap-0.5 px-4 py-2.5">
              <span>{NODE.get(id)?.title}</span>
              <span className="flex flex-wrap items-center gap-x-3 text-sm">
                <span className={`font-bold whitespace-nowrap ${tone}`}>{DIAG_LABEL[r.level]}</span>
                {r.level !== 'strong' && (
                  <a className="font-bold whitespace-nowrap text-accent hover:underline dark:text-accent-d" href={`#/repair/${id}`}>
                    10-minute repair
                  </a>
                )}
              </span>
            </li>
          );
        })}
      </ul>
      {untested.length > 0 && <p className={`text-sm ${muted}`}>Not checked: {untested.map((n) => n.title).join('; ')}. They are treated as fine until practice says otherwise.</p>}
      <p className={`text-sm ${muted}`}>“Inferred” means the skills it depends on were weak, so it was not asked. The optional sine and cosine law review is not part of the check (it is not directly assessed on the diploma).</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <a className={btnPrimary} href="#/">
          Go to today's session
        </a>
        <a className={btnGhost} href="#/plan">
          See the plan
        </a>
      </div>
    </div>
  );
}
