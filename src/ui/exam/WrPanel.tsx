import { useEffect, useMemo, useState } from 'react';
import { FULL_MARKS_NOTE, HALF_MARK_NOTE, SCORING_GUIDE } from '../../content/exam';
import type { MockWr } from '../../db/db';
import { markSteps } from '../../engine/mockScore';
import type { WrPart, WrQuestion } from '../../engine/wr';
import { Graph } from '../components/Graph';
import { Steps } from '../components/ItemView';
import { Rich } from '../components/Rich';
import { btnGhost, btnPrimary, card, muted } from '../styles';
import { askClaude, FEEDBACK_MODEL } from './claude';

function PartPrompt({ part, n }: { part: WrPart; n: number }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="leading-relaxed">
        <span className="mr-1 font-bold">
          {'ab'[n]}. ({part.marks} marks)
        </span>
        <Rich text={part.prompt} />
      </p>
      {part.table && (
        <div className="overflow-x-auto">
          <table className="border-collapse text-center tabular-nums">
            <thead>
              <tr>
                {part.table.head.map((h, i) => (
                  <th key={i} className="border border-line px-3 py-1.5 dark:border-line-d">
                    <Rich text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {part.table.rows.map((r, i) => (
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
      {part.graph && <Graph spec={part.graph} />}
    </div>
  );
}

function Photos({ photos, onRemove }: { photos: Blob[]; onRemove?: (i: number) => void }) {
  const urls = useMemo(() => photos.map((p) => URL.createObjectURL(p)), [photos]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  if (!photos.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((u, i) => (
        <div key={u} className="relative">
          <a href={u} target="_blank" rel="noreferrer">
            <img src={u} alt={`Photo ${i + 1} of handwritten work`} className="h-28 w-auto rounded-lg border border-line object-cover dark:border-line-d" />
          </a>
          {onRemove && (
            <button className="absolute top-1 right-1 rounded-full bg-black/60 px-2 text-sm font-bold text-white" aria-label={`Remove photo ${i + 1}`} onClick={() => onRemove(i)}>
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** Shrink a phone photo so storage and the optional Claude request stay small. */
async function shrink(file: File, max = 1600): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k);
    c.height = Math.round(bmp.height * k);
    c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b ?? file), 'image/jpeg', 0.85));
  } catch {
    return file;
  }
}

/** Write a response: typed work and/or photos of handwritten work. */
export function WrWrite({ q, n, wr, onChange }: { q: WrQuestion; n: number; wr: MockWr; onChange: (patch: Partial<MockWr>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className={`text-sm font-bold uppercase tracking-wide ${muted}`}>Written response {n + 1} · {q.title}</p>
      {q.intro && (
        <p className="leading-relaxed">
          <Rich text={q.intro} />
        </p>
      )}
      {q.parts.map((p, i) => (
        <PartPrompt key={i} part={p} n={i} />
      ))}
      <label className="flex flex-col gap-1">
        <span className={`text-sm font-bold ${muted}`}>Your work (label parts a and b)</span>
        <textarea value={wr.text} onChange={(e) => onChange({ text: e.target.value })} rows={8} className="rounded-lg border border-line bg-card p-3 font-mono text-sm dark:border-line-d dark:bg-card-d" placeholder={'a. …\nb. …'} />
      </label>
      <div className="flex flex-col gap-2">
        <span className={`text-sm font-bold ${muted}`}>Or photograph your handwritten work</span>
        <Photos photos={wr.photos} onRemove={(i) => onChange({ photos: wr.photos.filter((_, j) => j !== i) })} />
        <label className={`${btnGhost} self-start`}>
          Add photo
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (f) onChange({ photos: [...wr.photos, await shrink(f)] });
            }}
          />
        </label>
      </div>
    </div>
  );
}

/** Mark a response: rubric, general scoring guide, worked solution, half-mark self-score, optional Claude feedback. */
export function WrMark({ q, n, wr, apiKey, onChange }: { q: WrQuestion; n: number; wr: MockWr; apiKey?: string; onChange: (patch: Partial<MockWr>) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const empty = !wr.text.trim() && !wr.photos.length;

  async function ask() {
    setBusy(true);
    setErr('');
    try {
      const ai = await askClaude(apiKey!, q, wr.text, wr.photos);
      onChange({ ai });
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className={`text-sm font-bold uppercase tracking-wide ${muted}`}>Written response {n + 1} · {q.title}</p>
      {q.intro && (
        <p className="leading-relaxed">
          <Rich text={q.intro} />
        </p>
      )}
      <div className={`${card} flex flex-col gap-2 p-4`}>
        <span className={`text-sm font-bold ${muted}`}>Your response</span>
        {wr.text.trim() ? <pre className="font-mono text-sm whitespace-pre-wrap">{wr.text}</pre> : !wr.photos.length && <p className={muted}>No response. On the diploma this scores NR (no marks).</p>}
        <Photos photos={wr.photos} />
      </div>
      {apiKey && !empty && (
        <div className="flex flex-col gap-1">
          <button className={`${btnGhost} self-start`} onClick={ask} disabled={busy}>
            {busy ? 'Claude is reading your work…' : wr.ai ? 'Ask Claude again' : 'Ask Claude to score this'}
          </button>
          <span className={`text-xs ${muted}`}>Sends your work, the question and the rubric to {FEEDBACK_MODEL} with your key.</span>
          {err && <p className="rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn dark:bg-warn-soft-d dark:text-warn-d">{err}</p>}
        </div>
      )}
      {q.parts.map((p, i) => {
        const ai = wr.ai?.[i];
        return (
          <section key={i} className={`${card} flex flex-col gap-3 p-4`}>
            <PartPrompt part={p} n={i} />
            <div>
              <p className="text-sm font-bold">What full marks needs</p>
              <ul className="mt-1 flex list-disc flex-col gap-1 pl-5 text-sm">
                {p.rubric.map((r, j) => (
                  <li key={j}>
                    <Rich text={r} />
                  </li>
                ))}
              </ul>
            </div>
            <details>
              <summary className="cursor-pointer text-sm font-bold text-accent dark:text-accent-d">Worked solution</summary>
              <div className="mt-2">
                <Steps steps={p.solution} />
              </div>
            </details>
            <details>
              <summary className="cursor-pointer text-sm font-bold text-accent dark:text-accent-d">General scoring guide ({p.marks}-mark part)</summary>
              <dl className="mt-2 flex flex-col gap-1.5 text-sm">
                {SCORING_GUIDE[p.marks].map((l) => (
                  <div key={String(l.score)} className="flex gap-2">
                    <dt className="w-7 shrink-0 font-bold">{l.score}</dt>
                    <dd>{l.descriptor}</dd>
                  </div>
                ))}
              </dl>
              <p className={`mt-2 text-xs ${muted}`}>
                {HALF_MARK_NOTE} {FULL_MARKS_NOTE}
              </p>
            </details>
            {ai && (
              <div className="rounded-lg bg-accent-soft px-3 py-2 text-sm dark:bg-accent-soft-d">
                <p className="font-bold">
                  Claude: {ai.score} / {p.marks}
                </p>
                <p className="mt-1">{ai.feedback}</p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold">Your score</span>
              <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Score for part ${'ab'[i]}`}>
                {markSteps(p.marks).map((s) => {
                  const on = wr.scores[i] === s;
                  return (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={on}
                      className={`min-h-11 min-w-11 rounded-lg border px-2 font-bold tabular-nums ${on ? 'border-accent bg-accent text-white dark:border-accent-d dark:bg-accent-d dark:text-paper-d' : 'border-line bg-card dark:border-line-d dark:bg-card-d'}`}
                      onClick={() => onChange({ scores: wr.scores.map((x, j) => (j === i ? s : x)) })}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {ai && wr.scores[i] == null && (
                <button className="self-start text-sm font-bold text-accent hover:underline dark:text-accent-d" onClick={() => onChange({ scores: wr.scores.map((x, j) => (j === i ? ai.score : x)) })}>
                  Use Claude's score ({ai.score})
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export const blankWr = (): MockWr => ({ text: '', photos: [], scores: [null, null] });

/** Standalone written-response practice: write, then mark. */
export function WrPractice({ q, apiKey, onNext }: { q: WrQuestion; apiKey?: string; onNext: () => void }) {
  const [wr, setWr] = useState<MockWr>(blankWr);
  const [phase, setPhase] = useState<'write' | 'mark'>('write');
  useEffect(() => {
    setWr(blankWr());
    setPhase('write');
  }, [q.templateId, q.seed]);
  const patch = (p: Partial<MockWr>) => setWr((w) => ({ ...w, ...p }));
  const total = wr.scores.every((s) => s != null) ? wr.scores.reduce<number>((a, b) => a + (b ?? 0), 0) : null;
  return (
    <div className="flex flex-col gap-4">
      {phase === 'write' ? <WrWrite q={q} n={0} wr={wr} onChange={patch} /> : <WrMark q={q} n={0} wr={wr} apiKey={apiKey} onChange={patch} />}
      {phase === 'write' ? (
        <button className={`${btnPrimary} self-start`} onClick={() => setPhase('mark')}>
          Done: mark my response
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {total != null && <span className="font-bold">Total: {total} / 5</span>}
          <button className={btnPrimary} onClick={onNext}>
            Another question
          </button>
        </div>
      )}
    </div>
  );
}
