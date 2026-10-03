import { Coordinates, Line, Mafs, Plot, Point, Polygon } from 'mafs';
import { useState } from 'react';
import type { OpsPreset } from '../../content/lessons/types';
import { Tex } from '../components/Rich';
import { card, chip, muted } from '../styles';

interface LabFn {
  id: string;
  tex: string;
  f: (x: number) => number;
}

export const OPS_FNS: LabFn[] = [
  { id: 'line', tex: 'x + 1', f: (x) => x + 1 },
  { id: 'line2', tex: '-\\tfrac{1}{2}x + 2', f: (x) => -0.5 * x + 2 },
  { id: 'parabola', tex: 'x^2 - 4', f: (x) => x * x - 4 },
  { id: 'root', tex: '\\sqrt{x}', f: (x) => (x >= 0 ? Math.sqrt(x) : NaN) },
  { id: 'shift', tex: 'x - 4', f: (x) => x - 4 },
  { id: 'abs', tex: '|x| - 2', f: (x) => Math.abs(x) - 2 },
  { id: 'recip', tex: '\\frac{1}{x}', f: (x) => (x === 0 ? NaN : 1 / x) },
];

type Op = OpsPreset['op'] | 'compose2';
const OPS: { op: Op; label: string }[] = [
  { op: '+', label: 'f + g' },
  { op: '-', label: 'f - g' },
  { op: '*', label: 'f \\cdot g' },
  { op: '/', label: '\\frac{f}{g}' },
  { op: 'compose', label: 'f \\circ g' },
  { op: 'compose2', label: 'g \\circ f' },
];

function combine(op: Op, f: (x: number) => number, g: (x: number) => number) {
  return (x: number) => {
    const fx = f(x);
    const gx = g(x);
    switch (op) {
      case '+':
        return fx + gx;
      case '-':
        return fx - gx;
      case '*':
        return fx * gx;
      case '/':
        return Math.abs(gx) < 1e-12 ? NaN : fx / gx;
      case 'compose':
        return f(gx);
      case 'compose2':
        return g(fx);
    }
  };
}

const tame = (fn: (x: number) => number) => (x: number) => {
  const y = fn(x);
  return Number.isFinite(y) && Math.abs(y) < 60 ? y : NaN;
};

/** Domain of the result on [-8, 8], as shaded intervals (sampled; asymptotes and holes show as gaps). */
function domainBands(fn: (x: number) => number): [number, number][] {
  const out: [number, number][] = [];
  let start: number | null = null;
  const N = 1600;
  for (let i = 0; i <= N; i++) {
    const x = -8 + (16 * i) / N;
    const ok = Number.isFinite(fn(x));
    if (ok && start === null) start = x;
    if ((!ok || i === N) && start !== null) {
      out.push([start, ok ? x : x - 16 / N]);
      start = null;
    }
  }
  return out;
}

const fmt = (v: number) => (Number.isFinite(v) ? String(+v.toFixed(2)) : 'undefined');

export function FunctionOpsLab({ preset, locked = false }: { preset: OpsPreset; locked?: boolean }) {
  const [fid, setF] = useState(preset.f);
  const [gid, setG] = useState(preset.g);
  const [op, setOp] = useState<Op>(preset.op);
  const [x0, setX0] = useState(2);
  const F = OPS_FNS.find((o) => o.id === fid)!;
  const G = OPS_FNS.find((o) => o.id === gid)!;
  const h = combine(op, F.f, G.f);
  const bands = domainBands(h);
  const label = OPS.find((o) => o.op === op)!.label;
  const gx = G.f(x0);
  const fx = F.f(x0);

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`flex flex-col gap-2 ${locked ? 'opacity-50' : ''}`}>
        {(['f', 'g'] as const).map((which) => (
          <div key={which} className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="w-10 shrink-0 font-bold italic">{which}(x)</span>
            {OPS_FNS.map((o) => {
              const active = (which === 'f' ? fid : gid) === o.id;
              return (
                <button key={o.id} className={`${chip} shrink-0 ${active ? (which === 'f' ? 'border-accent bg-accent text-white dark:border-accent-d dark:bg-accent-d dark:text-paper-d' : 'border-[#6a3fb5] bg-[#6a3fb5] text-white') : ''}`} onClick={() => (which === 'f' ? setF(o.id) : setG(o.id))} aria-pressed={active}>
                  <Tex src={o.tex} />
                </button>
              );
            })}
          </div>
        ))}
        <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Operation">
          {OPS.map((o) => (
            <button key={o.op} className={`${chip} shrink-0 ${o.op === op ? 'border-[#c2410c] bg-[#c2410c] text-white' : ''}`} onClick={() => setOp(o.op)} aria-pressed={o.op === op}>
              <Tex src={o.label} />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={300} viewBox={{ x: [-8, 8], y: [-6, 6], padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} yAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} />
          {bands.map(([a, b], i) => (
            <Polygon key={i} points={[[a, -6], [b, -6], [b, -5.6], [a, -5.6]]} color="var(--mafs-red)" fillOpacity={0.35} weight={0} />
          ))}
          <Plot.OfX y={tame(F.f)} color="var(--mafs-blue)" style="dashed" weight={2} />
          <Plot.OfX y={tame(G.f)} color="var(--mafs-violet)" style="dashed" weight={2} />
          <Plot.OfX y={tame(h)} color="var(--mafs-red)" weight={3} />
          <Line.ThroughPoints point1={[x0, 0]} point2={[x0, 1]} opacity={0.3} />
          {Number.isFinite(fx) && <Point x={x0} y={fx} color="var(--mafs-blue)" />}
          {Number.isFinite(gx) && <Point x={x0} y={gx} color="var(--mafs-violet)" />}
          {Number.isFinite(h(x0)) && Math.abs(h(x0)) < 60 && <Point x={x0} y={h(x0)} color="var(--mafs-red)" />}
        </Mafs>
      </div>
      <label className="flex items-center gap-3">
        <span className="w-6 text-lg font-bold italic">x</span>
        <input type="range" min={-8} max={8} step={0.5} value={x0} onChange={(e) => setX0(Number(e.target.value))} className="h-8 flex-1 accent-accent dark:accent-accent-d" aria-label={`x = ${x0}`} />
        <span className="w-12 text-right tabular-nums">{x0}</span>
      </label>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <Tex src={`f(x) = ${F.tex},\\quad g(x) = ${G.tex}`} />
        <Tex src={`f(${x0}) = ${fmt(fx)},\\quad g(${x0}) = ${fmt(gx)}`} />
        <span className="font-bold text-[#c2410c] dark:text-[#fb923c]">
          <Tex src={`(${label})(${x0}) = ${op === 'compose' ? `f(${fmt(gx)})` : op === 'compose2' ? `g(${fmt(fx)})` : ''}${op.startsWith('compose') ? ' = ' : ''}${fmt(h(x0))}`} />
        </span>
      </div>
      <p className={`text-xs ${muted}`}>Dashed: f (blue) and g (violet). Red: the result. The red band on the x-axis shows the result's domain.</p>
    </div>
  );
}
