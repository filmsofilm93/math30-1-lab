import { useMemo, useState } from 'react';
import { NODE } from '../../content';
import type { MockRow } from '../../db/db';
import { STRAND_NAME } from '../../engine/mock';
import { scoreMock } from '../../engine/mockScore';
import { nrAnswerText } from '../../engine/nr';
import { Stem, Steps } from '../components/ItemView';
import { Rich } from '../components/Rich';
import { btnGhost, card, h1, h2, muted } from '../styles';
import { fmtClock } from './MockPage';

const pct = (x: number) => `${Math.round(x * 100)}%`;

export function MockReportView({ row }: { row: MockRow }) {
  const rep = useMemo(() => scoreMock(row.paper, row.answers, row.wr.map((w) => w.scores)), [row]);
  const [open, setOpen] = useState<number | null>(null);
  const nMc = rep.slots.filter((s) => s.item.format === 'mc').length;
  const date = new Date(row.submittedAt ?? row.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col gap-4">
      <h1 className={h1}>Mock diploma report</h1>
      <p className={`text-sm ${muted}`}>
        {date} · {fmtClock(row.elapsedMs)} writing{row.units ? ` · units: ${row.units.join(', ')}` : ' · whole course'}
      </p>

      <section className={`${card} flex flex-col gap-1 p-4`}>
        <p className="text-3xl font-bold tabular-nums">{pct(rep.percent)}</p>
        <p>
          Machine-scored {rep.machine.correct} / {rep.machine.total} (75% of the exam) · Written response {rep.wr.marks} / {rep.wr.total} (25%)
        </p>
        <p className={`text-sm ${muted}`}>
          Projected diploma range: <span className="font-bold text-ink dark:text-ink-d">{pct(rep.low)} to {pct(rep.high)}</span>. That is an 80% range from this one paper, with your own written-response marking; more mocks narrow it.
        </p>
        {row.paper.notes.length > 0 && <p className={`text-sm ${muted}`}>{row.paper.notes.join(' ')}</p>}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={h2}>By topic</h2>
        <div className={`${card} divide-y divide-line dark:divide-line-d`}>
          {rep.byStrand
            .filter((s) => s.total + s.wrTotal > 0)
            .map((s) => (
              <div key={s.strand} className="flex items-center justify-between gap-3 px-4 py-2">
                <span className="min-w-0">{STRAND_NAME[s.strand]}</span>
                <span className="shrink-0 text-right text-sm tabular-nums">
                  {s.correct}/{s.total}
                  {s.wrTotal ? ` · WR ${s.wrMarks}/${s.wrTotal}` : ''}
                </span>
              </div>
            ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={h2}>Review plan</h2>
        {rep.plan.length === 0 ? (
          <p>Nothing lost. Keep your reviews going and try another paper.</p>
        ) : (
          <>
            <p className={`text-sm ${muted}`}>Skills that cost the most marks, weighted by how often they appear on the diploma. Work down the list.</p>
            <ol className="flex flex-col gap-2">
              {rep.plan.slice(0, 10).map((p, i) => (
                <li key={p.nodeId} className={`${card} flex items-start gap-3 p-3`}>
                  <span className={`text-sm font-bold tabular-nums ${muted}`}>{i + 1}.</span>
                  <div className="min-w-0 flex-1">
                    <a className="font-bold text-accent hover:underline dark:text-accent-d" href={`#/node/${encodeURIComponent(p.nodeId)}`}>
                      {p.title}
                    </a>
                    <p className={`text-xs ${muted}`}>
                      {p.where.join(', ')} · {(p.lost * 100).toFixed(1)} exam points
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
        {rep.recordingErrors > 0 && (
          <p className="rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn dark:bg-warn-soft-d dark:text-warn-d">
            {rep.recordingErrors} numerical-response answer{rep.recordingErrors > 1 ? 's were' : ' was'} wrong only because of how it was recorded.{' '}
            <a className="font-bold underline" href={`#/node/${encodeURIComponent('EXAM.nr-recording')}`}>
              Practise the recording rules
            </a>
            .
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className={h2}>Questions</h2>
        <div className="flex flex-col gap-1.5">
          {rep.slots.map((s) => {
            const label = s.item.format === 'mc' ? `${s.index + 1}` : `NR ${s.index + 1 - nMc}`;
            const yours = s.answer == null || s.answer === '' ? 'no answer' : s.item.format === 'mc' ? 'ABCD'[s.answer as number] : String(s.answer);
            const right = s.item.format === 'mc' ? 'ABCD'[s.item.choices!.findIndex((c) => c.correct)] : nrAnswerText(s.item.nr!);
            const isOpen = open === s.index;
            return (
              <div key={s.index} className={`${card} overflow-hidden`}>
                <button className="flex w-full items-center gap-3 px-3 py-2 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.index)}>
                  <span className={`w-6 text-center font-bold ${s.correct ? 'text-good dark:text-good-d' : 'text-bad dark:text-bad-d'}`}>{s.correct ? '✓' : '✗'}</span>
                  <span className="w-12 shrink-0 text-sm font-bold">{label}</span>
                  <span className={`min-w-0 flex-1 truncate text-sm ${muted}`}>{NODE.get(s.item.nodeId)?.title}</span>
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-3 border-t border-line px-3 py-3 dark:border-line-d">
                    <Stem item={s.item} />
                    {s.item.format === 'mc' && (
                      <ol className="flex flex-col gap-1 text-sm">
                        {s.item.choices!.map((c, i) => (
                          <li key={i} className={c.correct ? 'font-bold text-good dark:text-good-d' : s.answer === i ? 'text-bad dark:text-bad-d' : ''}>
                            {'ABCD'[i]}. <Rich text={c.tex} />
                          </li>
                        ))}
                      </ol>
                    )}
                    <p className="text-sm">
                      Your answer: <span className="font-bold">{yours}</span> · Correct: <span className="font-bold">{right}</span>
                    </p>
                    {s.recording && <p className="text-sm text-warn dark:text-warn-d">{s.recording}</p>}
                    <Steps steps={s.item.solution} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <a className={`${btnGhost} self-start`} href="#/exam">
        Back to Exam
      </a>
    </div>
  );
}
