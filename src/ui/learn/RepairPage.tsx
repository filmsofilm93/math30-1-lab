import { useMemo, useState } from 'react';
import { lessonFor, NODE } from '../../content';
import { recordAttempt } from '../../db/progress';
import { makeItem } from '../../engine/framework';
import { generatorById, generatorsFor } from '../../engine/generators';
import { itemFor } from '../../engine/practice';
import { randomSeed } from '../../engine/rng';
import type { Item, Tier } from '../../engine/types';
import { ItemView, type ItemResult } from '../components/ItemView';
import { Rich } from '../components/Rich';
import { btnGhost, btnPrimary, card, h1, h2, muted } from '../styles';
import { WorkedExample } from './NodePage';

const FADED = 2;
const PRACTICE = 5;
const PASS = 4;

/** ~10-minute repair: explanation and one example, 2 faded items, 5 practice items, then a verdict. */
export function RepairPage({ nodeId, from }: { nodeId: string; from?: string }) {
  const node = NODE.get(nodeId);
  const lesson = lessonFor(nodeId);
  const back = from ? NODE.get(from) : undefined;
  const [phase, setPhase] = useState<'learn' | 'faded' | 'practice' | 'result'>('learn');
  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);
  const [item, setItem] = useState<Item | null>(null);
  const example = useMemo(() => (lesson ? makeItem(generatorById(lesson.examples[0].generatorId)!, lesson.examples[0].seed, lesson.examples[0].tier) : null), [lesson]);
  const gens = generatorsFor(nodeId);

  if (!node || !lesson || !example) return <p>No repair lesson for this skill yet.</p>;

  // Practice cycles through every generator of the skill, easy to harder.
  const practiceItem = (k: number) => makeItem(gens[k % gens.length], randomSeed(), (k < 2 ? 1 : k < 4 ? 2 : 3) as Tier);

  function startFaded() {
    setPhase('faded');
    setI(0);
    setItem(itemFor(nodeId, 1, example!.generatorId));
    window.scrollTo({ top: 0 });
  }
  async function onDone(r: ItemResult) {
    const it = item!;
    await recordAttempt({ nodeId, itemId: it.id, generatorId: it.generatorId, seed: it.seed, tier: it.tier, correct: r.correct, assisted: phase === 'faded' || r.assisted, hints: r.hints, confidence: r.confidence, misconception: r.misconception, ms: r.ms, mode: phase === 'faded' ? 'faded' : 'repair' });
    if (phase === 'practice' && r.correct && !r.assisted) setRight((x) => x + 1);
  }
  function next() {
    if (phase === 'faded') {
      if (i + 1 < FADED) {
        setI(i + 1);
        setItem(itemFor(nodeId, 2, item!.generatorId));
      } else {
        setPhase('practice');
        setI(0);
        setItem(practiceItem(0));
      }
    } else if (i + 1 < PRACTICE) {
      setI(i + 1);
      setItem(practiceItem(i + 1));
    } else setPhase('result');
  }

  const header = (
    <header className="flex flex-col gap-1">
      <a href={back ? `#/node/${back.id}` : '#/'} className={`text-sm ${muted} hover:underline`}>
        ← {back ? back.title : 'Today'}
      </a>
      <h1 className={h1}>Repair: {node.title}</h1>
      <p className={`text-sm ${muted}`}>About 10 minutes · explanation, 2 guided questions, 5 on your own</p>
    </header>
  );

  if (phase === 'learn')
    return (
      <div className="flex flex-col gap-4">
        {header}
        <div className={`${card} flex flex-col gap-3 p-4 leading-relaxed`}>
          {lesson.explain.map((p, k) => (
            <p key={k}>
              <Rich text={p} />
            </p>
          ))}
        </div>
        <WorkedExample item={example} n={1} />
        <button className={btnPrimary} onClick={startFaded}>
          Try two guided questions
        </button>
      </div>
    );

  if (phase === 'result') {
    const passed = right >= PASS;
    return (
      <div className="flex flex-col gap-4">
        {header}
        <div className={`rounded-xl px-4 py-3 ${passed ? 'bg-good-soft dark:bg-good-soft-d' : 'bg-warn-soft dark:bg-warn-soft-d'}`}>
          <p className="font-bold">
            {right} of {PRACTICE} correct without help.
          </p>
          <p>{passed ? 'Repaired for now. It joins your normal practice, and mastery still needs more correct answers on another day.' : 'Not solid yet. The full lesson has more examples and a longer practice set; or come back to this repair tomorrow.'}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {back && (
            <a className={passed ? btnPrimary : btnGhost} href={`#/node/${back.id}`}>
              Back to {back.title.length > 36 ? back.title.slice(0, 34) + '…' : back.title}
            </a>
          )}
          <a className={passed && back ? btnGhost : btnPrimary} href={`#/node/${nodeId}`}>
            Full lesson
          </a>
          {!back && (
            <a className={btnGhost} href="#/">
              Today
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!item) return null;
  return (
    <div className="flex flex-col gap-3">
      {header}
      <div className="flex items-center justify-between">
        <h2 className={h2}>{phase === 'faded' ? (i === 0 ? 'Guided: finish the last step' : 'Guided: finish the last two steps') : 'On your own'}</h2>
        <span className={`text-sm tabular-nums ${muted}`}>
          {i + 1} / {phase === 'faded' ? FADED : PRACTICE}
        </span>
      </div>
      <ItemView key={item.id} item={item} shownSteps={phase === 'faded' ? Math.max(0, item.solution.length - 1 - i) : 0} onDone={onDone} onNext={next} nextLabel={phase === 'practice' && i + 1 === PRACTICE ? 'See result' : 'Next'} />
    </div>
  );
}
