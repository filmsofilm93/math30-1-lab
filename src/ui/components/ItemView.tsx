import { useEffect, useMemo, useRef, useState } from 'react';
import curriculum from '../../content/curriculum.json';
import type { Confidence } from '../../db/db';
import { db } from '../../db/db';
import { checkField, reasonText, type Verdict } from '../../engine/check';
import type { Item, Step } from '../../engine/types';
import { btnGhost, btnPrimary, card, chip, muted } from '../styles';
import { Graph } from './Graph';
import { MathField } from './MathField';
import { Rich, Tex } from './Rich';

const MIS = new Map(curriculum.misconceptions.map((m) => [m.id, m.description]));

export interface ItemResult {
  correct: boolean;
  assisted: boolean;
  hints: number;
  confidence: Confidence;
  misconception?: string;
  ms: number;
}

export function Steps({ steps, upTo, startOpen = false }: { steps: Step[]; upTo?: number; startOpen?: boolean }) {
  const shown = steps.slice(0, upTo ?? steps.length);
  return (
    <ol className="flex flex-col gap-2">
      {shown.map((s, i) => (
        <StepRow key={i} n={i + 1} step={s} startOpen={startOpen} />
      ))}
    </ol>
  );
}

function StepRow({ n, step, startOpen }: { n: number; step: Step; startOpen: boolean }) {
  const [why, setWhy] = useState(startOpen);
  return (
    <li className="flex gap-3">
      <span className={`mt-0.5 shrink-0 text-sm font-bold tabular-nums ${muted}`}>{n}.</span>
      <div className="min-w-0 flex-1">
        <Rich text={step.tex} />
        {step.why && (
          <div className="mt-1">
            <button className="text-sm font-bold text-accent underline-offset-2 hover:underline dark:text-accent-d" onClick={() => setWhy(!why)} aria-expanded={why}>
              {why ? 'Hide why' : 'Why?'}
            </button>
            {why && (
              <p className={`mt-1 text-sm ${muted}`}>
                <Rich text={step.why} />
              </p>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export function Stem({ item }: { item: Item }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg leading-relaxed">
        <Rich text={item.stem} />
      </p>
      {item.table && (
        <div className="overflow-x-auto">
          <table className="border-collapse text-center tabular-nums">
            <thead>
              <tr>
                {item.table.head.map((h, i) => (
                  <th key={i} className="border border-line px-3 py-1.5 dark:border-line-d">
                    <Rich text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className="border border-line px-3 py-1.5 dark:border-line-d">
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {item.graph && <Graph spec={item.graph} />}
    </div>
  );
}

const CONF: { c: Confidence; label: string; key: string }[] = [
  { c: 'sure', label: 'Sure', key: 's' },
  { c: 'unsure', label: 'Unsure', key: 'u' },
  { c: 'guess', label: 'Guess', key: 'g' },
];

/**
 * One question: stem, answer area, hints, confidence, feedback and worked solution.
 * `shownSteps` > 0 shows the first steps of the solution (faded practice).
 */
export function ItemView({ item, shownSteps = 0, onDone, onNext, nextLabel = 'Next question' }: { item: Item; shownSteps?: number; onDone: (r: ItemResult) => void; onNext: () => void; nextLabel?: string }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [values, setValues] = useState<string[]>(() => (item.fields ?? []).map(() => ''));
  const [hints, setHints] = useState(0);
  const [verdicts, setVerdicts] = useState<Verdict[] | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [result, setResult] = useState<ItemResult | null>(null);
  const [reported, setReported] = useState(false);
  const start = useRef(Date.now());
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setChoice(null);
    setValues((item.fields ?? []).map(() => ''));
    setHints(0);
    setVerdicts(null);
    setProblem(null);
    setResult(null);
    setReported(false);
    start.current = Date.now();
  }, [item.id]);

  const done = result !== null;

  function submit(confidence: Confidence) {
    if (done) return;
    let correct: boolean;
    let misconception: string | undefined;
    if (item.format === 'mc') {
      if (choice === null) return setProblem('Choose an option first.');
      const ch = item.choices![choice];
      correct = ch.correct;
      misconception = ch.misconception;
    } else {
      const vs = item.fields!.map((f, i) => checkField(f.answer, values[i]));
      const unreadable = vs.findIndex((v) => v.reason === 'unreadable');
      if (unreadable >= 0) {
        setVerdicts(vs);
        return setProblem(item.fields!.length > 1 ? `Box ${unreadable + 1}: ${reasonText(vs[unreadable])}` : reasonText(vs[unreadable]));
      }
      setVerdicts(vs);
      correct = vs.every((v) => v.ok);
    }
    setProblem(null);
    const r: ItemResult = { correct, assisted: hints > 0 || shownSteps > 0, hints, confidence, misconception, ms: Date.now() - start.current };
    setResult(r);
    onDone(r);
    setTimeout(() => nextRef.current?.focus({ preventScroll: true }), 30);
  }

  // Desktop shortcuts: 1–4 choose, S/U/G submit with confidence, H hint, Enter/N next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'MATH-FIELD' || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (!done && item.format === 'mc' && ['1', '2', '3', '4'].includes(k)) setChoice(Number(k) - 1);
      else if (!done && CONF.some((c) => c.key === k)) submit(CONF.find((c) => c.key === k)!.c);
      else if (!done && k === 'h') setHints((h) => Math.min(3, h + 1));
      else if (done && (k === 'enter' || k === 'n')) onNext();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const chosen = choice !== null && item.choices ? item.choices[choice] : null;
  const answerTex = useMemo(() => (item.fields ?? []).map((f) => f.answer.tex), [item]);

  async function report() {
    await db.reports.add({ itemId: item.id, nodeId: item.nodeId, note: '', at: Date.now() });
    setReported(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <Stem item={item} />

      {shownSteps > 0 && (
        <div className={`${card} p-4`}>
          <p className={`mb-2 text-sm font-bold uppercase tracking-wide ${muted}`}>Worked so far</p>
          <Steps steps={item.solution} upTo={Math.min(shownSteps, item.solution.length)} />
          <p className={`mt-3 text-sm ${muted}`}>Finish the solution and enter the final answer.</p>
        </div>
      )}

      {item.format === 'mc' ? (
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Options">
          {item.choices!.map((c, i) => {
            const state = !done ? (choice === i ? 'sel' : '') : c.correct ? 'right' : choice === i ? 'wrong' : '';
            return (
              <button
                key={i}
                role="radio"
                aria-checked={choice === i}
                disabled={done}
                onClick={() => setChoice(i)}
                className={`flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  state === 'sel'
                    ? 'border-accent bg-accent-soft dark:border-accent-d dark:bg-accent-soft-d'
                    : state === 'right'
                      ? 'border-good bg-good-soft dark:border-good-d dark:bg-good-soft-d'
                      : state === 'wrong'
                        ? 'border-bad bg-bad-soft dark:border-bad-d dark:bg-bad-soft-d'
                        : 'border-line bg-card hover:bg-accent-soft dark:border-line-d dark:bg-card-d dark:hover:bg-accent-soft-d'
                }`}
              >
                <span className={`mt-0.5 text-sm font-bold ${muted}`}>{'ABCD'[i]}</span>
                <span className="min-w-0 flex-1">
                  <Rich text={c.tex} />
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {item.fields!.map((f, i) => (
            <label key={i} className="flex flex-col gap-1">
              {f.label && <span className={`text-sm font-bold ${muted}`}>{f.label}</span>}
              <div className="flex items-center gap-2">
                {f.prefix && (
                  <span className="shrink-0 text-lg">
                    <Tex src={f.prefix} />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <MathField
                    label={f.label ?? f.prefix ?? `Answer ${i + 1}`}
                    value={values[i]}
                    disabled={done}
                    autoFocus={i === 0 && !('ontouchstart' in window)}
                    onChange={(v) => setValues((old) => old.map((o, j) => (j === i ? v : o)))}
                    onEnter={() => (i === item.fields!.length - 1 ? submit('sure') : undefined)}
                  />
                </div>
                {verdicts && verdicts[i] && verdicts[i].reason !== 'unreadable' && (
                  <span className={`shrink-0 text-xl font-bold ${verdicts[i].ok ? 'text-good dark:text-good-d' : 'text-bad dark:text-bad-d'}`} aria-label={verdicts[i].ok ? 'correct' : 'incorrect'}>
                    {verdicts[i].ok ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {problem && <p className="rounded-lg bg-warn-soft px-3 py-2 text-warn dark:bg-warn-soft-d dark:text-warn-d">{problem}</p>}

      {!done && (
        <div className="flex flex-col gap-3">
          {hints > 0 && (
            <ol className={`${card} flex flex-col gap-2 p-4`}>
              {item.hints.slice(0, hints).map((h, i) => (
                <li key={i}>
                  <span className={`mr-2 text-xs font-bold uppercase tracking-wide ${muted}`}>{['Nudge', 'Method', 'Next step'][i]}</span>
                  <Rich text={h} />
                </li>
              ))}
            </ol>
          )}
          <div className="flex flex-col gap-2">
            <span className={`text-sm font-bold ${muted}`}>Check, and how sure are you?</span>
            <div className="grid grid-cols-3 gap-2 sm:flex">
              {CONF.map((c) => (
                <button key={c.c} className={`${c.c === 'sure' ? btnPrimary : btnGhost} px-2 sm:px-4`} onClick={() => submit(c.c)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {hints < 3 && (
            <button className="self-start text-sm font-bold text-accent hover:underline dark:text-accent-d" onClick={() => setHints(hints + 1)}>
              {hints === 0 ? 'Show a hint' : 'Another hint'} ({3 - hints} left)
            </button>
          )}
        </div>
      )}

      {done && result && (
        <div className="flex flex-col gap-4">
          <div className={`rounded-xl px-4 py-3 ${result.correct ? 'bg-good-soft text-good dark:bg-good-soft-d dark:text-good-d' : 'bg-bad-soft text-bad dark:bg-bad-soft-d dark:text-bad-d'}`}>
            <p className="font-bold">{result.correct ? (result.confidence === 'guess' ? 'Correct, but you guessed. This comes back sooner.' : 'Correct.') : 'Not this time.'}</p>
            {!result.correct && chosen?.misconception && (
              <div className="mt-1 text-ink dark:text-ink-d">
                <p>
                  <span className="font-bold">Common mistake: </span>
                  {MIS.get(chosen.misconception)}
                </p>
                {chosen.feedback && (
                  <p className="mt-1">
                    <Rich text={chosen.feedback} />
                  </p>
                )}
              </div>
            )}
            {!result.correct && item.format === 'input' && (
              <p className="mt-1 text-ink dark:text-ink-d">
                {verdicts?.some((v) => v.reason === 'exact') ? 'This question wants exact values (fractions, radicals), not decimals. ' : ''}
                {verdicts?.some((v) => v.reason === 'branches') ? 'Your answer needs both branches: use ±. ' : ''}
                Answer: {answerTex.map((t, i) => (
                  <span key={i}>
                    {i > 0 && ';  '}
                    {item.fields![i].prefix && <Tex src={item.fields![i].prefix!} />} <Tex src={t} />
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className={`${card} p-4`}>
            <p className={`mb-2 text-sm font-bold uppercase tracking-wide ${muted}`}>Worked solution</p>
            <Steps steps={item.solution} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button ref={nextRef} className={btnPrimary} onClick={onNext}>
              {nextLabel}
            </button>
            <button className={`${chip} ${muted}`} onClick={report} disabled={reported}>
              {reported ? `Reported (${item.id})` : 'Report a problem'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
