import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo, useState } from 'react';
import { NODE, unitTitle } from '../../content';
import { DIRECTING_WORDS } from '../../content/exam';
import { SCENARIOS } from '../../engine/generators/exam/skills';
import { db, DEFAULT_SETTINGS, type MockRow } from '../../db/db';
import { assembleMock, WR_COUNT } from '../../engine/mock';
import { scoreMock } from '../../engine/mockScore';
import { makeWr, WR_TEMPLATES } from '../../engine/wr';
import { Rich } from '../components/Rich';
import { useSettings } from '../data';
import { btnGhost, btnPrimary, card, h1, h2, muted } from '../styles';
import { FormulaSheet } from './FormulaSheet';
import { blankWr, WrPractice } from './WrPanel';

const CALC_NODES = ['CALC.mode-window', 'CALC.mode', 'CALC.intersect-zero', 'CALC.max-min', 'CALC.table'];
const EXAM_NODES = ['EXAM.nr-recording', 'EXAM.directing-words', 'EXAM.wr-hygiene', 'EXAM.sketch-standard'];

function NodeLinks({ ids }: { ids: string[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {ids.map((id) => (
        <li key={id}>
          <a className="text-accent hover:underline dark:text-accent-d" href={`#/node/${encodeURIComponent(id)}`}>
            {NODE.get(id)?.title.replace(/^TI-84 Plus: /, '')}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ExamHub() {
  const settings = useSettings() ?? { ...DEFAULT_SETTINGS, stored: false };
  const mocks = useLiveQuery(() => db.mocks.orderBy('createdAt').reverse().toArray(), [], [] as MockRow[]);
  const open = mocks.find((m) => m.status !== 'done');
  const done = mocks.filter((m) => m.status === 'done');
  const studied = useMemo(() => {
    const order = settings.unitOrder;
    const i = settings.currentUnit ? order.indexOf(settings.currentUnit) : -1;
    return i >= 0 && i < order.length - 1 ? order.slice(0, i + 1) : null;
  }, [settings.unitOrder, settings.currentUnit]);
  const [scope, setScope] = useState<'all' | 'studied'>('all');

  async function start() {
    const seed = Math.floor(Math.random() * 2 ** 31);
    const units = scope === 'studied' ? studied : null;
    const paper = assembleMock(seed, units);
    const id = await db.mocks.add({ seed, units, paper, createdAt: Date.now(), elapsedMs: 0, extraMinutes: 0, answers: paper.slots.map(() => null), flags: [], wr: paper.wr.map(blankWr), status: 'writing' });
    window.location.hash = `#/exam/mock/${id}`;
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className={h1}>Exam</h1>

      <section className={`${card} flex flex-col gap-3 p-4`}>
        <h2 className={h2}>Mock diploma</h2>
        <p className={`text-sm ${muted}`}>
          24 multiple choice and 8 numerical response (75%), then {WR_COUNT} written-response questions with a 2-mark and a 3-mark part (25%). Topic and cognitive mix follow the official blueprint. 3 hours, extendable to 6. No feedback until you finish; then you mark your written response and get a report.
        </p>
        {open ? (
          <a className={`${btnPrimary} self-start`} href={`#/exam/mock/${open.id}`}>
            {open.status === 'writing' ? 'Resume mock' : 'Finish marking'}
          </a>
        ) : (
          <>
            {studied && (
              <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Questions from">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={scope === 'all'} onChange={() => setScope('all')} /> Whole course (diploma conditions)
                </label>
                <label className="flex items-start gap-2">
                  <input type="radio" className="mt-1.5" checked={scope === 'studied'} onChange={() => setScope('studied')} />
                  <span>Units studied so far: {studied.map(unitTitle).join(', ')}</span>
                </label>
              </div>
            )}
            <button className={`${btnPrimary} self-start`} onClick={start}>
              Start a mock
            </button>
          </>
        )}
        {done.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm">
            {done.map((m) => {
              const r = scoreMock(m.paper, m.answers, m.wr.map((w) => w.scores));
              return (
                <li key={m.id}>
                  <a className="text-accent hover:underline dark:text-accent-d" href={`#/exam/mock/${m.id}`}>
                    {new Date(m.submittedAt ?? m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {Math.round(r.percent * 100)}%
                  </a>
                  <span className={muted}> (range {Math.round(r.low * 100)}–{Math.round(r.high * 100)}%{m.units ? ', partial course' : ''})</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={`${card} flex flex-col gap-2 p-4`}>
        <h2 className={h2}>Practice</h2>
        <div className="flex flex-wrap gap-2">
          <a className={btnGhost} href="#/exam/wr">
            Written response
          </a>
          <a className={btnGhost} href="#/exam/words">
            Directing words
          </a>
          <a className={btnGhost} href="#/exam/formulas">
            Formula sheet
          </a>
        </div>
        <p className="mt-2 font-bold">TI-84 Plus drills</p>
        <p className={`text-sm ${muted}`}>Exact keystrokes for each task; you enter the result. In exam configuration the calculator gives no exact trig values and doesn't simplify radicals, so drill those by hand.</p>
        <NodeLinks ids={CALC_NODES} />
        <p className="mt-2 font-bold">Exam skills</p>
        <NodeLinks ids={EXAM_NODES} />
      </section>
    </div>
  );
}

export function FormulaPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Formula sheet</h1>
      <FormulaSheet />
    </div>
  );
}

export function WrPracticePage() {
  const settings = useSettings();
  const [k, setK] = useState(() => ({ t: WR_TEMPLATES[Math.floor(Math.random() * WR_TEMPLATES.length)].id, seed: Math.floor(Math.random() * 1e6) }));
  const [strand, setStrand] = useState<'any' | 'RF' | 'T' | 'PCBT'>('any');
  const q = useMemo(() => makeWr(k.t, k.seed), [k]);
  const next = (s = strand) => {
    const pool = WR_TEMPLATES.filter((t) => s === 'any' || t.strand === s);
    setK({ t: pool[Math.floor(Math.random() * pool.length)].id, seed: Math.floor(Math.random() * 1e6) });
    window.scrollTo({ top: 0 });
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Written response</h1>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Topic">
        {(['any', 'RF', 'T', 'PCBT'] as const).map((s) => (
          <button
            key={s}
            role="radio"
            aria-checked={strand === s}
            className={`rounded-full border px-3 py-1 text-sm ${strand === s ? 'border-accent bg-accent-soft text-accent dark:border-accent-d dark:bg-accent-soft-d dark:text-accent-d' : 'border-line dark:border-line-d'}`}
            onClick={() => {
              setStrand(s);
              next(s);
            }}
          >
            {s === 'any' ? 'Any topic' : s === 'RF' ? 'Relations and functions' : s === 'T' ? 'Trigonometry' : 'Counting and binomial'}
          </button>
        ))}
      </div>
      <WrPractice q={q} apiKey={settings?.apiKey} onNext={() => next()} />
    </div>
  );
}

export function WordsPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Directing words</h1>
      <p className={`text-sm ${muted}`}>
        Bolded in written-response questions, with these official definitions. Tap a word for what it means in practice and, where there is one, a sample answer that meets the standard and answers that don't.{' '}
        <a className="font-bold text-accent hover:underline dark:text-accent-d" href={`#/node/${encodeURIComponent('EXAM.directing-words')}`}>
          Practise
        </a>
      </p>
      <div className="flex flex-col gap-2">
        {DIRECTING_WORDS.map((w) => {
          const s = SCENARIOS.find((x) => x.word === w.word);
          const isOpen = open === w.word;
          return (
            <section key={w.word} className={`${card} overflow-hidden`}>
              <button className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : w.word)}>
                <span className="font-bold">
                  {w.word} {s && <span className={`ml-1 text-xs font-normal ${muted}`}>· sample answers</span>}
                </span>
                <span className={`text-sm ${muted}`}>{w.def}.</span>
              </button>
              {isOpen && (
                <div className="flex flex-col gap-3 border-t border-line px-4 py-3 text-sm dark:border-line-d">
                  <p>
                    <span className="font-bold">In practice: </span>
                    {w.inPractice}
                  </p>
                  {s && (
                    <>
                      <p>
                        <span className="font-bold">Question: </span>
                        <Rich text={s.task} />
                      </p>
                      <div className="rounded-lg bg-good-soft px-3 py-2 dark:bg-good-soft-d">
                        <p className="font-bold text-good dark:text-good-d">Meets the standard</p>
                        <Rich text={s.meets} />
                      </div>
                      {s.fails.map((f, i) => (
                        <div key={i} className="rounded-lg bg-bad-soft px-3 py-2 dark:bg-bad-soft-d">
                          <p className="font-bold text-bad dark:text-bad-d">Doesn't meet it</p>
                          <Rich text={f.tex} />
                          <p className={`mt-1 ${muted}`}>
                            <Rich text={f.why} />
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
