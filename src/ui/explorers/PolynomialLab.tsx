import { Coordinates, Mafs, Plot, Point } from 'mafs';
import { useEffect, useMemo, useState } from 'react';
import type { PolyPreset } from '../../content/lessons/types';
import { polyEval, polyTex } from '../../engine/frac';
import { endBehaviour, fromZeros, polyGraph, synth } from '../../engine/generators/u2/shared';
import { Tex } from '../components/Rich';
import { btnGhost, card, chip, muted } from '../styles';

type Zero = { r: number; m: number };
const LEADS = [-2, -1, 1, 2];
const MAX_DEG = 5;

const factorTex = (z: Zero) => {
  const f = z.r === 0 ? 'x' : `(x ${z.r > 0 ? '-' : '+'} ${Math.abs(z.r)})`;
  return z.m === 1 ? f : `${z.r === 0 ? 'x' : f}^{${z.m}}`;
};
const factoredTex = (k: number, zs: Zero[]) => `${k === 1 ? '' : k === -1 ? '-' : k}${[...zs].sort((a, b) => a.r - b.r).map(factorTex).join('')}`;
const behaviourText = (m: number) => (m === 1 ? 'crosses' : m === 2 ? 'bounces (touches and turns)' : 'crosses and flattens');
const arrow = (q: string) => ({ I: '↗', II: '↖', III: '↙', IV: '↘' })[q] ?? '';

const active = 'border-accent bg-accent text-white dark:border-accent-d dark:bg-accent-d dark:text-paper-d';

export function PolynomialLab({ preset, locked = false }: { preset: PolyPreset; locked?: boolean }) {
  const [view, setView] = useState<'graph' | 'divide'>(preset.view ?? 'graph');
  const [zeros, setZeros] = useState<Zero[]>(preset.zeros);
  const [lead, setLead] = useState(preset.lead ?? 1);
  const deg = zeros.reduce((s, z) => s + z.m, 0);
  const coeffs = useMemo(() => fromZeros(lead, zeros), [lead, zeros]);

  const move = (i: number, d: number) => {
    const r = zeros[i].r + d;
    if (r < -6 || r > 6 || zeros.some((z) => z.r === r)) return;
    setZeros(zeros.map((z, j) => (j === i ? { ...z, r } : z)));
  };
  const setMult = (i: number, m: number) => {
    if (deg - zeros[i].m + m > MAX_DEG) return;
    setZeros(zeros.map((z, j) => (j === i ? { ...z, m } : z)));
  };
  const add = () => {
    for (const r of [0, 1, -1, 2, -2, 3, -3, 4, -4]) if (!zeros.some((z) => z.r === r)) return setZeros([...zeros, { r, m: 1 }]);
  };

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <div className="flex gap-1.5" role="tablist" aria-label="Polynomial lab view">
        {(['graph', 'divide'] as const).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={`${chip} ${view === v ? active : ''}`} onClick={() => setView(v)}>
            {v === 'graph' ? 'Zeros and graph' : 'Synthetic division'}
          </button>
        ))}
      </div>
      {view === 'graph' ? (
        <GraphView zeros={zeros} lead={lead} deg={deg} coeffs={coeffs} locked={locked} onMove={move} onMult={setMult} onRemove={(i) => zeros.length > 1 && setZeros(zeros.filter((_, j) => j !== i))} onAdd={deg < MAX_DEG ? add : undefined} onLead={setLead} />
      ) : (
        <DivideView coeffs={preset.coeffs ?? coeffs} initialA={preset.a ?? zeros[0]?.r ?? 1} locked={locked} />
      )}
    </div>
  );
}

function GraphView(props: { zeros: Zero[]; lead: number; deg: number; coeffs: number[]; locked: boolean; onMove: (i: number, d: number) => void; onMult: (i: number, m: number) => void; onRemove: (i: number) => void; onAdd?: () => void; onLead: (k: number) => void }) {
  const { zeros, lead, deg, coeffs, locked } = props;
  const g = polyGraph(coeffs, zeros.map((z) => z.r));
  const f = polyEval(coeffs);
  const ends = endBehaviour(deg, lead);
  const [from, to] = ends.replace(/quadrant /g, '').split(' to ');
  const yint = coeffs[coeffs.length - 1];
  const tame = (x: number) => {
    const y = f(x);
    return Math.abs(y) < 200 ? y : NaN;
  };
  return (
    <>
      <fieldset disabled={locked} className={`min-w-0 flex flex-col gap-2 ${locked ? 'opacity-50' : ''}`}>
        {zeros.map((z, i) => (
          <div key={i} className="flex items-center gap-1">
            <button className={`${chip} min-h-9 min-w-8 px-2`} onClick={() => props.onMove(i, -1)} aria-label={`Move zero ${z.r} left`}>
              −
            </button>
            <span className="w-14 shrink-0 text-center tabular-nums">
              <Tex src={`x = ${z.r}`} />
            </span>
            <button className={`${chip} min-h-9 min-w-8 px-2`} onClick={() => props.onMove(i, 1)} aria-label={`Move zero ${z.r} right`}>
              +
            </button>
            <span className={`ml-1 text-xs ${muted}`}>mult.</span>
            {[1, 2, 3].map((m) => (
              <button key={m} className={`${chip} min-h-9 min-w-8 px-2 ${z.m === m ? active : ''}`} onClick={() => props.onMult(i, m)} aria-pressed={z.m === m}>
                {m}
              </button>
            ))}
            {zeros.length > 1 && (
              <button className={`${chip} min-h-9`} onClick={() => props.onRemove(i)} aria-label={`Remove zero ${z.r}`}>
                ✕
              </button>
            )}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2">
          {props.onAdd && (
            <button className={`${chip} min-h-9`} onClick={props.onAdd}>
              + Add a zero
            </button>
          )}
          <span className={`text-sm ${muted}`}>Leading coefficient</span>
          {LEADS.map((k) => (
            <button key={k} className={`${chip} min-h-9 min-w-8 px-2 ${lead === k ? active : ''}`} onClick={() => props.onLead(k)} aria-pressed={lead === k}>
              {k}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={280} viewBox={{ x: g.view.x, y: g.view.y, padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: 1 }} yAxis={{ lines: Math.max(1, Math.round((g.view.y[1] - g.view.y[0]) / 10)) }} />
          <Plot.OfX y={tame} color="var(--mafs-blue)" weight={3} />
          {zeros.map((z) => (
            <Point key={z.r} x={z.r} y={0} color="var(--mafs-red)" />
          ))}
          <Point x={0} y={yint} color="var(--mafs-violet)" />
        </Mafs>
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <Tex src={`P(x) = ${factoredTex(lead, zeros)}`} />
        <Tex src={`P(x) = ${polyTex(coeffs)}`} />
        <p>
          Degree {deg} ({deg % 2 ? 'odd' : 'even'}), leading coefficient {lead > 0 ? 'positive' : 'negative'}: extends from quadrant {from} <span aria-hidden>{arrow(from)}</span> to quadrant {to} <span aria-hidden>{arrow(to)}</span>.
        </p>
        <p>
          <span className="text-[#6a3fb5] dark:text-[#a78bfa]">●</span> <Tex src={`y`} />
          -intercept: <Tex src={String(yint)} /> (set x = 0 in the factored form)
        </p>
        <ul className="flex flex-col gap-0.5">
          {[...zeros]
            .sort((a, b) => a.r - b.r)
            .map((z) => (
              <li key={z.r}>
                <span className="text-[#c2410c] dark:text-[#fb923c]">●</span> <Tex src={`x = ${z.r}`} />: multiplicity {z.m}, {behaviourText(z.m)}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

/** Synthetic division revealed one action at a time: bring down, then multiply and add per column. */
function DivideView({ coeffs, initialA, locked }: { coeffs: number[]; initialA: number; locked: boolean }) {
  const [a, setA] = useState(initialA);
  const [step, setStep] = useState(0);
  useEffect(() => setStep(0), [a, coeffs.join()]);
  const { q, r, mid, bottom } = synth(coeffs, a);
  const n = coeffs.length;
  const last = 2 * (n - 1); // step 0 = bring down; then multiply/add for each remaining column
  const shownBottom = (i: number) => i === 0 || step >= 2 * i;
  const shownMid = (i: number) => i > 0 && step >= 2 * i - 1;
  const col = step === 0 ? 0 : Math.ceil(step / 2);
  const caption =
    step === 0
      ? `Bring down the leading coefficient ${bottom[0]}.`
      : step % 2 === 1
        ? `Multiply ${bottom[col - 1]} by ${a} and write ${mid[col]} under ${coeffs[col]}.`
        : `Add: ${coeffs[col]} + ${mid[col]} = ${bottom[col]}.`;
  const done = step >= last;
  const cell = 'min-w-10 px-1 py-1 text-center tabular-nums';
  return (
    <div className={`flex flex-col gap-3 ${locked ? 'pointer-events-none opacity-50' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span>Divide by</span>
        <Tex src={`x ${a >= 0 ? '-' : '+'} ${Math.abs(a)}`} />
        <input type="range" min={-5} max={5} step={1} value={a} onChange={(e) => setA(Number(e.target.value))} className="h-8 min-w-32 flex-1 accent-accent dark:accent-accent-d" aria-label={`a = ${a}`} />
      </div>
      <Tex src={`P(x) = ${polyTex(coeffs)}`} />
      <div className="overflow-x-auto">
        <table className="border-collapse text-lg">
          <tbody>
            <tr>
              <td className={`${cell} border-r border-line font-bold text-accent dark:border-line-d dark:text-accent-d`}>{a}</td>
              {coeffs.map((c, i) => (
                <td key={i} className={cell}>
                  {c}
                </td>
              ))}
            </tr>
            <tr>
              <td className={`${cell} border-r border-line dark:border-line-d`} />
              {coeffs.map((_, i) => (
                <td key={i} className={`${cell} ${col === i && step % 2 === 1 ? 'rounded bg-accent-soft dark:bg-accent-soft-d' : ''}`}>
                  {shownMid(i) ? mid[i] : ''}
                </td>
              ))}
            </tr>
            <tr className="border-t border-line dark:border-line-d">
              <td className={`${cell} border-r border-line dark:border-line-d`} />
              {bottom.map((c, i) => (
                <td key={i} className={`${cell} font-bold ${i === n - 1 ? 'text-[#c2410c] dark:text-[#fb923c]' : ''} ${col === i && step % 2 === 0 ? 'rounded bg-accent-soft dark:bg-accent-soft-d' : ''}`}>
                  {shownBottom(i) ? c : ''}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p aria-live="polite">{caption}</p>
      {done && (
        <div className="flex flex-col gap-1 overflow-x-auto">
          <Tex src={`Q(x) = ${polyTex(q)},\\quad R = ${r}`} />
          <p>
            Remainder theorem: <Tex src={`P(${a}) = ${r}`} />.{' '}
            {r === 0 ? (
              <>
                So <Tex src={`x ${a >= 0 ? '-' : '+'} ${Math.abs(a)}`} /> is a factor.
              </>
            ) : (
              <>Not zero, so this is not a factor.</>
            )}
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button className={btnGhost} onClick={() => setStep(Math.min(last, step + 1))} disabled={done}>
          Next step
        </button>
        <button className={btnGhost} onClick={() => setStep(last)} disabled={done}>
          Show all
        </button>
        <button className={btnGhost} onClick={() => setStep(0)}>
          Restart
        </button>
      </div>
      <p className={`text-xs ${muted}`}>Write a 0 for any missing power before dividing. The last number in the bottom row is the remainder; the rest are the quotient's coefficients, one degree lower.</p>
    </div>
  );
}
