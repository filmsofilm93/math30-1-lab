import { useMemo, useState } from 'react';
import type { IdentityPreset } from '../../content/lessons/types';
import { checkStep, compileTrig, IDENTITY_PROBLEMS, MOVES, npvDegrees, sidesMatch, type Move } from '../../engine/identity';
import { checkField } from '../../engine/check';
import { angleSet } from '../../engine/generators/u4/shared';
import { MathField } from '../components/MathField';
import { Tex } from '../components/Rich';
import { bad, btnGhost, btnPrimary, card, chip, good, muted } from '../styles';
import { chipOn } from './controls';

type Line = { tex: string; move: Move; newNpv?: number[] };
type Side = 'L' | 'R';

const radList = (ds: number[]) => (ds.length ? angleSet(ds, true).tex : '\\text{none}');

/** Prove an identity one move at a time: each side transforms on its own, every line is checked numerically, and new restrictions are flagged. */
export function IdentityWorkspace({ preset, locked = false }: { preset: IdentityPreset; locked?: boolean }) {
  const [pid, setPid] = useState(preset.problem);
  const problem = IDENTITY_PROBLEMS.find((p) => p.id === pid) ?? IDENTITY_PROBLEMS[0];
  const [lines, setLines] = useState<Record<Side, Line[]>>({ L: [], R: [] });
  const [side, setSide] = useState<Side>('L');
  const [move, setMove] = useState<Move | null>(null);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [npvDraft, setNpvDraft] = useState('');
  const [npvVerdict, setNpvVerdict] = useState<null | boolean>(null);
  const [test, setTest] = useState<null | { x: number; l: number; r: number }>(null);

  const npv = useMemo(() => npvDegrees(`${problem.lhs} + ${problem.rhs}`), [problem]);
  const last = (s: Side) => (lines[s].length ? lines[s][lines[s].length - 1].tex : s === 'L' ? problem.lhs : problem.rhs);
  const proven = sidesMatch(last('L'), last('R'));

  const pick = (id: string) => {
    setPid(id);
    setLines({ L: [], R: [] });
    setDraft('');
    setError('');
    setMove(null);
    setNpvVerdict(null);
    setNpvDraft('');
    setTest(null);
  };
  const submit = () => {
    if (!draft.trim()) return;
    if (!move) {
      setError('Pick the move you are using first.');
      return;
    }
    const v = checkStep(last(side), draft);
    if (!v.ok) {
      setError(v.note ?? 'Not equivalent.');
      return;
    }
    setLines({ ...lines, [side]: [...lines[side], { tex: draft, move, newNpv: v.newNpv }] });
    setDraft('');
    setError('');
    setMove(null);
  };
  const undo = (s: Side) => setLines({ ...lines, [s]: lines[s].slice(0, -1) });
  const tryValue = () => {
    const L = compileTrig(problem.lhs)!;
    const R = compileTrig(problem.rhs)!;
    for (;;) {
      const x = Math.round((Math.random() * 2 * Math.PI) * 100) / 100;
      if (!L.npv(x, 1e-3) && !R.npv(x, 1e-3)) return setTest({ x, l: L.f(x), r: R.f(x) });
    }
  };
  const checkNpv = () => setNpvVerdict(checkField(angleSet(npv, true), npvDraft).ok);

  const Column = ({ s }: { s: Side }) => (
    <div className={`flex min-w-0 flex-col gap-1 rounded-lg border p-2 ${side === s && !proven ? 'border-accent dark:border-accent-d' : 'border-line dark:border-line-d'}`}>
      <button className={`text-left text-sm font-bold ${muted}`} onClick={() => setSide(s)} aria-pressed={side === s}>
        {s === 'L' ? 'Left side' : 'Right side'} {side === s && !proven ? '(working here)' : '(tap to work here)'}
      </button>
      <div className="overflow-x-auto">
        <Tex src={s === 'L' ? problem.lhs : problem.rhs} />
      </div>
      {lines[s].map((l, i) => (
        <div key={i} className="flex flex-col overflow-x-auto">
          <Tex src={`= ${l.tex}`} />
          <span className={`text-xs ${muted}`}>{MOVES.find((m) => m.id === l.move)!.label}</span>
          {l.newNpv && (
            <span className={`text-xs ${bad}`}>
              Restriction added: not defined at <Tex src={radList(l.newNpv)} />. State it, or choose a step that avoids it.
            </span>
          )}
        </div>
      ))}
      {lines[s].length > 0 && !proven && (
        <button className={`${chip} self-start`} onClick={() => undo(s)}>
          Undo last line
        </button>
      )}
    </div>
  );

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-3 ${locked ? 'opacity-50' : ''}`}>
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Identity">
          {IDENTITY_PROBLEMS.map((p, i) => (
            <button key={p.id} className={`${chip} shrink-0 ${p.id === pid ? chipOn : ''}`} onClick={() => pick(p.id)} aria-pressed={p.id === pid}>
              {i + 1}
              {p.excellence ? '★' : ''}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <p className={`text-sm ${muted}`}>Prove{problem.excellence ? ' (standard of excellence)' : ''}:</p>
          <Tex src={`${problem.lhs} = ${problem.rhs}`} display />
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-accent-soft p-2 dark:bg-accent-soft-d">
          <p className="text-sm">
            First, the non-permissible values for <Tex src="0 \le x < 2\pi" /> (type <Tex src="\varnothing" /> if none):
          </p>
          <div className="overflow-x-clip py-0.5">
            <MathField value={npvDraft} onChange={setNpvDraft} onEnter={checkNpv} label="Non-permissible values" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className={btnGhost} onClick={checkNpv}>
              Check
            </button>
            <button className={btnGhost} onClick={() => setNpvVerdict(false)}>
              Show them
            </button>
            {npvVerdict !== null && (
              <span className={`text-sm ${npvVerdict ? good : bad}`}>
                {npvVerdict ? '✓ ' : ''}
                <Tex src={`x \\ne ${radList(npv)}`} />
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Column s="L" />
          <Column s="R" />
        </div>
        {proven ? (
          <p className={`font-bold ${good}`}>
            Proven: both sides now read <Tex src={last('L')} />. Each side was transformed on its own, so no step assumed the identity.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold">Move for the {side === 'L' ? 'left' : 'right'} side:</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Move">
              {MOVES.map((m) => (
                <button key={m.id} className={`${chip} ${move === m.id ? chipOn : ''}`} onClick={() => setMove(m.id)} aria-pressed={move === m.id}>
                  {m.label}
                </button>
              ))}
            </div>
            {move && (
              <div className={`overflow-x-auto text-sm ${muted}`}>
                <Tex src={MOVES.find((m) => m.id === move)!.tex} />
              </div>
            )}
            <div className="overflow-x-clip py-0.5">
              <MathField value={draft} onChange={setDraft} onEnter={submit} label="Next line" />
            </div>
            {error && <p className={`text-sm ${bad}`}>✗ {error}</p>}
            <div className="flex flex-wrap gap-2">
              <button className={btnPrimary} onClick={submit}>
                Check this line
              </button>
              <button className={btnGhost} onClick={tryValue}>
                Test a value
              </button>
            </div>
            {test && (
              <p className="overflow-x-auto text-sm">
                At <Tex src={`x = ${test.x}`} />: left <Tex src={`\\approx ${test.l.toFixed(4)}`} />, right <Tex src={`\\approx ${test.r.toFixed(4)}`} />. Equal values verify the identity at this <Tex src="x" /> only; they do not prove it.
              </p>
            )}
            <p className={`text-xs ${muted}`}>Hint: {problem.hint}</p>
          </div>
        )}
      </fieldset>
    </div>
  );
}
