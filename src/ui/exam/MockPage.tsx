import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { db, type MockRow, type MockWr } from '../../db/db';
import { recordAttempt } from '../../db/progress';
import { slotItem } from '../../engine/mock';
import { scoreMock } from '../../engine/mockScore';
import type { Item } from '../../engine/types';
import { makeWr } from '../../engine/wr';
import { Stem } from '../components/ItemView';
import { NRBoxes } from '../components/NRBoxes';
import { Rich } from '../components/Rich';
import { useSettings } from '../data';
import { btnGhost, btnPrimary, card, h1, muted } from '../styles';
import { FormulaOverlay } from './FormulaSheet';
import { MockReportView } from './MockReport';
import { WrMark, WrWrite } from './WrPanel';

const BASE_MIN = 180;
const MAX_EXTRA = 180;

export const fmtClock = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export function MockPage({ id }: { id: number }) {
  const row = useLiveQuery(() => db.mocks.get(id), [id]);
  if (row === undefined) return null;
  if (!row) return <p>That mock exam no longer exists.</p>;
  if (row.status === 'writing') return <Writing row={row} />;
  if (row.status === 'marking') return <Marking row={row} />;
  return <MockReportView row={row} />;
}

function Writing({ row }: { row: MockRow }) {
  const items = useMemo(() => row.paper.slots.map(slotItem), [row.paper]);
  const wrQs = useMemo(() => row.paper.wr.map((w) => makeWr(w.templateId, w.seed)), [row.paper]);
  const nMc = row.paper.slots.filter((s) => s.kind === 'mc').length;
  const total = items.length + wrQs.length;
  const [idx, setIdx] = useState(0);
  const [showSheet, setShowSheet] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [confirm, setConfirm] = useState(false);

  // Clock: counts only while this page is open and visible; saved every 10 s and when leaving.
  const [elapsed, setElapsed] = useState(row.elapsedMs);
  const elapsedRef = useRef(row.elapsedMs);
  useEffect(() => {
    let last = Date.now();
    const tick = () => {
      const now = Date.now();
      if (document.visibilityState === 'visible') elapsedRef.current += now - last;
      last = now;
      setElapsed(elapsedRef.current);
    };
    const save = () => db.mocks.update(row.id!, { elapsedMs: elapsedRef.current });
    const t = window.setInterval(tick, 1000);
    const s = window.setInterval(save, 10_000);
    const vis = () => {
      tick();
      save();
    };
    document.addEventListener('visibilitychange', vis);
    return () => {
      window.clearInterval(t);
      window.clearInterval(s);
      document.removeEventListener('visibilitychange', vis);
      tick();
      save();
    };
  }, [row.id]);

  const limit = (BASE_MIN + row.extraMinutes) * 60_000;
  const left = limit - elapsed;
  const over = left <= 0;

  const setAnswer = (i: number, v: number | string | null) => db.mocks.update(row.id!, { answers: row.answers.map((a, j) => (j === i ? v : a)) });
  const setWr = (q: number, patch: Partial<MockWr>) => db.mocks.update(row.id!, { wr: row.wr.map((w, j) => (j === q ? { ...w, ...patch } : w)) });
  const toggleFlag = (i: number) => db.mocks.update(row.id!, { flags: row.flags.includes(i) ? row.flags.filter((f) => f !== i) : [...row.flags, i] });
  const extend = () => db.mocks.update(row.id!, { extraMinutes: Math.min(MAX_EXTRA, row.extraMinutes + 30) });

  const answered = (i: number) => (i < items.length ? row.answers[i] != null && row.answers[i] !== '' : !!(row.wr[i - items.length].text.trim() || row.wr[i - items.length].photos.length));
  const unanswered = Array.from({ length: total }, (_, i) => i).filter((i) => !answered(i));
  const label = (i: number) => (i < nMc ? `${i + 1}` : i < items.length ? `NR ${i - nMc + 1}` : `WR ${i - items.length + 1}`);

  async function finish() {
    await db.mocks.update(row.id!, { elapsedMs: elapsedRef.current, status: 'marking', submittedAt: Date.now() });
    // Machine-scored answers also count as practice evidence for each skill.
    const rep = scoreMock(row.paper, row.answers, []);
    for (const s of rep.slots) {
      const it = s.item;
      await recordAttempt({ nodeId: it.nodeId, itemId: it.id, generatorId: it.generatorId, seed: it.seed, tier: it.tier, correct: s.correct, assisted: false, hints: 0, confidence: 'sure', misconception: !s.correct && it.format === 'mc' && typeof s.answer === 'number' ? it.choices![s.answer]?.misconception : undefined, ms: 0, mode: 'mock' });
    }
  }

  const go = useCallback((i: number) => {
    setIdx(Math.max(0, Math.min(total - 1, i)));
    setShowNav(false);
    window.scrollTo({ top: 0 });
  }, [total]);

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-[calc(2.75rem+env(safe-area-inset-top))] z-10 -mx-4 flex items-center justify-between gap-2 border-b border-line bg-paper/95 px-4 py-2 backdrop-blur dark:border-line-d dark:bg-paper-d/95">
        <span className={`font-mono text-lg font-bold tabular-nums ${over ? 'text-bad dark:text-bad-d' : left < 15 * 60_000 ? 'text-warn dark:text-warn-d' : ''}`} aria-label="Time left" role="timer">
          {over ? `+${fmtClock(-left)}` : fmtClock(left)}
        </span>
        <div className="flex gap-1.5">
          <button className={`${btnGhost} px-3`} onClick={() => setShowSheet(true)}>
            Formulas
          </button>
          <button className={`${btnGhost} px-3`} onClick={() => setShowNav(!showNav)} aria-expanded={showNav}>
            {idx + 1}/{total}
          </button>
        </div>
      </div>

      {over && (
        <div className="rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn dark:bg-warn-soft-d dark:text-warn-d">
          <p className="font-bold">The 3 hours{row.extraMinutes ? ` (plus ${row.extraMinutes} min)` : ''} are up.</p>
          <p className="text-ink dark:text-ink-d">The diploma allows up to 6 hours. Extend if you need to, or finish and mark.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {row.extraMinutes < MAX_EXTRA && (
              <button className={btnGhost} onClick={extend}>
                Add 30 minutes
              </button>
            )}
            <button className={btnPrimary} onClick={() => setConfirm(true)}>
              Finish
            </button>
          </div>
        </div>
      )}

      {showNav && (
        <nav className={`${card} grid grid-cols-6 gap-1.5 p-3 sm:grid-cols-9`} aria-label="Questions">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-current={i === idx ? 'true' : undefined}
              className={`relative min-h-10 rounded-lg border text-xs font-bold ${i === idx ? 'border-accent dark:border-accent-d' : 'border-line dark:border-line-d'} ${answered(i) ? 'bg-accent-soft dark:bg-accent-soft-d' : ''}`}
            >
              {label(i)}
              {row.flags.includes(i) && <span className="absolute -top-1 -right-1 text-xs" aria-label="flagged">⚑</span>}
            </button>
          ))}
          <p className={`col-span-full text-xs ${muted}`}>
            Shaded: answered. ⚑ flagged. {!over && row.extraMinutes < MAX_EXTRA && (
              <button className="font-bold text-accent underline dark:text-accent-d" onClick={extend}>
                Add 30 minutes
              </button>
            )}
            {row.extraMinutes > 0 && ` Extended by ${row.extraMinutes} min.`}
          </p>
        </nav>
      )}

      {idx < items.length ? (
        <Question key={idx} item={items[idx]} n={idx} nMc={nMc} value={row.answers[idx]} onChange={(v) => setAnswer(idx, v)} />
      ) : (
        <WrWrite key={idx} q={wrQs[idx - items.length]} n={idx - items.length} wr={row.wr[idx - items.length]} onChange={(p) => setWr(idx - items.length, p)} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button className={btnGhost} onClick={() => go(idx - 1)} disabled={idx === 0}>
            Back
          </button>
          {idx < total - 1 ? (
            <button className={btnPrimary} onClick={() => go(idx + 1)}>
              Next
            </button>
          ) : (
            <button className={btnPrimary} onClick={() => setConfirm(true)}>
              Finish
            </button>
          )}
        </div>
        <button className={`${btnGhost} px-3`} aria-pressed={row.flags.includes(idx)} onClick={() => toggleFlag(idx)}>
          {row.flags.includes(idx) ? '⚑ Flagged' : 'Flag'}
        </button>
      </div>

      {confirm && (
        <div className={`${card} flex flex-col gap-2 p-4`} role="alertdialog" aria-label="Finish the exam">
          <p className="font-bold">Finish and mark?</p>
          <p className={`text-sm ${muted}`}>
            {unanswered.length ? `${unanswered.length} unanswered: ${unanswered.map(label).join(', ')}.` : 'Every question has an answer.'} {row.flags.length ? `${row.flags.length} flagged.` : ''} You can't change answers after this.
          </p>
          <div className="flex gap-2">
            <button className={btnPrimary} onClick={finish}>
              Finish and mark
            </button>
            <button className={btnGhost} onClick={() => setConfirm(false)}>
              Keep writing
            </button>
          </div>
        </div>
      )}

      <button className={`self-start text-sm ${muted} underline`} onClick={() => (window.location.hash = '#/exam')}>
        Leave (your answers and time are saved)
      </button>
      {showSheet && <FormulaOverlay onClose={() => setShowSheet(false)} />}
    </div>
  );
}

/** One machine-scored question, no feedback. */
function Question({ item, n, nMc, value, onChange }: { item: Item; n: number; nMc: number; value: number | string | null; onChange: (v: number | string | null) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className={`text-sm font-bold uppercase tracking-wide ${muted}`}>{n < nMc ? `Question ${n + 1}` : `Numerical response ${n - nMc + 1}`}</p>
      <Stem item={item} />
      {item.format === 'mc' ? (
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Options">
          {item.choices!.map((c, i) => (
            <button
              key={i}
              role="radio"
              aria-checked={value === i}
              onClick={() => onChange(value === i ? null : i)}
              className={`flex min-h-12 items-start gap-3 rounded-xl border px-4 py-3 text-left ${value === i ? 'border-accent bg-accent-soft dark:border-accent-d dark:bg-accent-soft-d' : 'border-line bg-card dark:border-line-d dark:bg-card-d'}`}
            >
              <span className={`mt-0.5 text-sm font-bold ${muted}`}>{'ABCD'[i]}</span>
              <span className="min-w-0 flex-1">
                <Rich text={c.tex} />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <NRBoxes value={typeof value === 'string' ? value : ''} onChange={(v) => onChange(v)} negative={item.nr!.kind === 'value' && item.nr!.negative} />
      )}
    </div>
  );
}

function Marking({ row }: { row: MockRow }) {
  const settings = useSettings();
  const wrQs = useMemo(() => row.paper.wr.map((w) => makeWr(w.templateId, w.seed)), [row.paper]);
  const [q, setQ] = useState(0);
  const setWr = (i: number, patch: Partial<MockWr>) => db.mocks.update(row.id!, { wr: row.wr.map((w, j) => (j === i ? { ...w, ...patch } : w)) });
  const done = row.wr.every((w) => w.scores.every((s) => s != null));
  const rep = scoreMock(row.paper, row.answers, []);
  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Mark your written response</h1>
      <p className={muted}>
        Machine-scored: {rep.machine.correct} / {rep.machine.total}. Now score each written-response part against its rubric and the general scoring guide. Half marks are allowed. Mark strictly, as a diploma marker would.
      </p>
      {wrQs.length > 1 && (
        <div className="flex gap-2" role="tablist">
          {wrQs.map((_, i) => (
            <button key={i} role="tab" aria-selected={q === i} className={`${btnGhost} px-3 ${q === i ? 'bg-accent-soft text-accent dark:bg-accent-soft-d dark:text-accent-d' : ''}`} onClick={() => setQ(i)}>
              WR {i + 1} {row.wr[i].scores.every((s) => s != null) ? '✓' : ''}
            </button>
          ))}
        </div>
      )}
      {wrQs[q] && <WrMark key={q} q={wrQs[q]} n={q} wr={row.wr[q]} apiKey={settings?.apiKey} onChange={(p) => setWr(q, p)} />}
      <div className="flex flex-wrap gap-2">
        {q < wrQs.length - 1 && (
          <button className={btnGhost} onClick={() => (setQ(q + 1), window.scrollTo({ top: 0 }))}>
            Next question
          </button>
        )}
        <button className={btnPrimary} disabled={!done} onClick={() => db.mocks.update(row.id!, { status: 'done' })}>
          See my report
        </button>
      </div>
      {!done && <p className={`text-sm ${muted}`}>Score every part to see the report.</p>}
    </div>
  );
}
