import { useState } from 'react';
import type { LogLawPreset } from '../../content/lessons/types';
import { LOG_PROBLEMS, checkStep, type StepVerdict } from '../../engine/loglaw';
import { MathField } from '../components/MathField';
import { Tex } from '../components/Rich';
import { bad, btnGhost, btnPrimary, card, chip, good, muted } from '../styles';

const LAWS = [
  { name: 'Product', tex: '\\log_b (MN) = \\log_b M + \\log_b N' },
  { name: 'Quotient', tex: '\\log_b \\frac{M}{N} = \\log_b M - \\log_b N' },
  { name: 'Power', tex: '\\log_b M^p = p\\log_b M' },
  { name: 'Values', tex: '\\log_b b = 1,\\ \\log_b 1 = 0,\\ \\log_b b^k = k' },
];

type Step = { tex: string; verdict: StepVerdict };

/** Apply one law at a time; every line is checked for equivalence with the start, and the goal form is detected. */
export function LogLawLab({ preset, locked = false }: { preset: LogLawPreset; locked?: boolean }) {
  const [pid, setPid] = useState(preset.problem);
  const problem = LOG_PROBLEMS.find((p) => p.id === pid) ?? LOG_PROBLEMS[0];
  const [steps, setSteps] = useState<Step[]>([]);
  const [draft, setDraft] = useState('');
  const [reveal, setReveal] = useState(false);
  const finished = steps.some((s) => s.verdict.ok && s.verdict.done);

  const pick = (id: string) => {
    setPid(id);
    setSteps([]);
    setDraft('');
    setReveal(false);
  };
  const submit = () => {
    if (!draft.trim()) return;
    const verdict = checkStep(problem, draft);
    setSteps([...steps, { tex: draft, verdict }]);
    if (verdict.ok) setDraft('');
  };

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`min-w-0 flex flex-col gap-3 ${locked ? 'opacity-50' : ''}`}>
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Problem">
          {LOG_PROBLEMS.map((p, i) => (
            <button key={p.id} className={`${chip} shrink-0 ${p.id === pid ? 'border-accent bg-accent text-white dark:border-accent-d dark:bg-accent-d dark:text-paper-d' : ''}`} onClick={() => pick(p.id)} aria-pressed={p.id === pid}>
              {p.goal === 'expand' ? 'Expand' : 'Condense'} {(i % 3) + 1}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <p className={`text-sm ${muted}`}>{problem.goal === 'expand' ? 'Expand fully, one law per line:' : 'Write as a single logarithm, one law per line:'}</p>
          <Tex src={problem.start} display />
        </div>
        <ol className="flex flex-col gap-2">
          {steps.map((s, i) => (
            <li key={i} className="flex flex-col gap-0.5 overflow-x-auto">
              <Tex src={`= ${s.tex}`} />
              <span className={`text-sm ${s.verdict.ok ? good : bad}`}>
                {s.verdict.ok ? '✓ ' : '✗ '}
                {s.verdict.message}
              </span>
            </li>
          ))}
        </ol>
        {!finished && (
          <div className="flex flex-col gap-2">
            <div className="overflow-x-clip py-0.5">
              <MathField value={draft} onChange={setDraft} onEnter={submit} label="Next line" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={btnPrimary} onClick={submit}>
                Check this line
              </button>
              <button className={btnGhost} onClick={() => setReveal(true)}>
                Show a finished form
              </button>
            </div>
          </div>
        )}
        {(reveal || finished) && (
          <div className="overflow-x-auto">
            <span className={`text-sm ${muted}`}>One finished form: </span>
            <Tex src={problem.answer} />
          </div>
        )}
      </fieldset>
      <details className="text-sm">
        <summary className="cursor-pointer font-bold">Laws</summary>
        <ul className="mt-1 flex flex-col gap-1 overflow-x-auto">
          {LAWS.map((l) => (
            <li key={l.name}>
              <span className="font-bold">{l.name}: </span>
              <Tex src={l.tex} />
            </li>
          ))}
        </ul>
      </details>
      <p className={`text-xs ${muted}`}>Each line is checked against the starting expression with positive values of the variables, so a wrong sign or misplaced exponent shows up at once.</p>
    </div>
  );
}
